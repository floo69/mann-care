/**
 * HeartRateMonitor — Physiologically realistic simulated heart rate display.
 *
 * Architecture (three separated concerns):
 *
 * 1. BPM UPDATE LOGIC  — slow timer (every 4-6 s), drifts BPM by ±1-3
 * 2. BEAT TIMING LOGIC — fires precisely at 60_000/bpm ms intervals
 *                        advances beatPhasePixels per RAF frame
 * 3. WAVEFORM DRAWING  — RAF loop samples qrsY() per new pixel,
 *                        scrolls buffer left, renders canvas
 *
 * To replace with real sensor data:
 *   • Keep the canvas/buffer/draw code exactly as-is
 *   • Remove scheduleBeat() and the BPM drift timer
 *   • Call triggerBeat(realBpm) on each real heartbeat event
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── CONFIG ────────────────────────────────────────────────────────────────
const BPM_DEFAULT = 72;
const BPM_MIN = 60;
const BPM_MAX = 85;
const SCROLL_PX = 1.5;      // pixels scrolled per animation frame  (~90px/s at 60fps)
const CANVAS_H = 90;       // canvas height in pixels
const LINE_COLOR = '#6366f1';
const GLOW_COLOR = 'rgba(99,102,241,0.55)';
const BG_COLOR = 'rgba(99,102,241,0.06)';
const BASELINE_CLR = 'rgba(99,102,241,0.15)';

// ─── QRS WAVEFORM SAMPLER ──────────────────────────────────────────────────
/**
 * Returns the Y pixel for a given beat phase fraction (0–1).
 *   phaseF = 0     → beat start (flat baseline)
 *   phaseF ≈ 0.28  → R peak (tall spike)
 *   phaseF = 1     → beat end (flat baseline, next beat begins)
 *
 * Shape: baseline → P-wave → Q-dip → R-spike → S-dip → T-wave → baseline
 */
function qrsY(phaseF: number, midY: number, amp: number): number {
    // Flat leading baseline (0 → 0.12)
    if (phaseF < 0.12) return midY;

    // P-wave: gentle hump (0.12 → 0.22)
    if (phaseF < 0.22) {
        const t = (phaseF - 0.12) / 0.10;
        return midY - Math.sin(t * Math.PI) * amp * 0.13;
    }

    // Brief baseline (0.22 → 0.26)
    if (phaseF < 0.26) return midY;

    // Q-dip: small downward notch (0.26 → 0.29)
    if (phaseF < 0.29) {
        const t = (phaseF - 0.26) / 0.03;
        return midY + Math.sin(t * Math.PI) * amp * 0.20;
    }

    // R-spike: sharp tall peak (0.29 → 0.36)
    // Triangle shape: ramps up then down steeply
    if (phaseF < 0.36) {
        const t = (phaseF - 0.29) / 0.07;         // 0→1 over the spike window
        const triangle = 1 - Math.abs(2 * t - 1); // 0→1→0 triangle
        return midY - triangle * amp * 0.95;       // upward spike
    }

    // S-dip: overshoot below baseline (0.36 → 0.42)
    if (phaseF < 0.42) {
        const t = (phaseF - 0.36) / 0.06;
        return midY + Math.sin(t * Math.PI) * amp * 0.28;
    }

    // Return to baseline (0.42 → 0.47)
    if (phaseF < 0.47) {
        const t = (phaseF - 0.42) / 0.05;
        return midY + (1 - t) * 0; // already at midY from S-dip end
    }

    // Brief flat (0.47 → 0.52)
    if (phaseF < 0.52) return midY;

    // T-wave: smooth broad hump (0.52 → 0.78)
    if (phaseF < 0.78) {
        const t = (phaseF - 0.52) / 0.26;
        return midY - Math.sin(t * Math.PI) * amp * 0.20;
    }

    // Flat trailing baseline until next beat (0.78 → 1.0)
    return midY;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────
export const HeartRateMonitor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ── Shared heartbeat state (all in refs — no React re-renders for RAF) ──
    const bpmRef = useRef(BPM_DEFAULT);
    const beatPhasePixRef = useRef(0);   // how many px into the current beat
    const pixelsPerBeatRef = useRef(0);   // total px one full beat occupies
    const bufferRef = useRef<number[]>([]);
    const rafRef = useRef<number>(0);
    const beatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bpmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const bpmDisplayRef = useRef<HTMLSpanElement>(null);

    // ── Helper: recompute pixels-per-beat from current BPM ─────────────────
    const recalcPixelsPerBeat = () => {
        const beatMs = 60_000 / bpmRef.current;
        // frames per beat (at 60fps) × pixels per frame
        const framesPerBeat = (beatMs / 1000) * 60;
        pixelsPerBeatRef.current = Math.round(framesPerBeat * SCROLL_PX);
    };

    // ── 1. BPM UPDATE LOGIC — runs every 4-6 seconds ───────────────────────
    const startBpmDriftTimer = () => {
        bpmTimerRef.current = setInterval(() => {
            // Drift by a small random amount (±1 to 3)
            const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 3));
            const next = Math.min(BPM_MAX, Math.max(BPM_MIN, bpmRef.current + delta));
            bpmRef.current = next;
            recalcPixelsPerBeat();

            // Update the BPM number in the DOM directly (no state = no re-render)
            if (bpmDisplayRef.current) {
                bpmDisplayRef.current.textContent = `${next}`;
            }
        }, 4000 + Math.random() * 2000); // 4-6 s jitter
    };

    // ── 2. BEAT TIMING LOGIC — fires each beat, resets beatPhasePixels ─────
    const scheduleBeat = () => {
        if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
        // Reset phase to beginning of new beat
        beatPhasePixRef.current = 0;
        const intervalMs = 60_000 / bpmRef.current;
        beatTimerRef.current = setTimeout(scheduleBeat, intervalMs);
    };

    // ── 3. WAVEFORM DRAWING LOGIC — RAF loop ───────────────────────────────
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const mid = H / 2;
        const amp = (H / 2) * 0.85;            // waveform amplitude (px)
        const pxb = pixelsPerBeatRef.current;  // pixels per full beat

        // Advance beat phase by SCROLL_PX pixels this frame
        const steps = Math.ceil(SCROLL_PX);
        for (let i = 0; i < steps; i++) {
            // Compute phase fraction for this new pixel (clamp to 1 if past end)
            const phaseF = pxb > 0 ? Math.min(beatPhasePixRef.current / pxb, 1) : 1;
            const newY = qrsY(phaseF, mid, amp);

            // Scroll buffer left, append new sample on the right
            bufferRef.current.shift();
            bufferRef.current.push(newY);

            // Advance phase counter (wrap handled by scheduleBeat resetting to 0)
            beatPhasePixRef.current += 1;
        }

        // ── Clear & background ──
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, W, H);

        // ── Dashed center baseline ──
        ctx.save();
        ctx.setLineDash([3, 8]);
        ctx.strokeStyle = BASELINE_CLR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, mid);
        ctx.lineTo(W, mid);
        ctx.stroke();
        ctx.restore();

        // ── Waveform line ──
        ctx.beginPath();
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        bufferRef.current.forEach((y, x) => {
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // ── Glowing leading dot on the rightmost point ──
        const leadY = bufferRef.current[W - 1] ?? mid;
        const grad = ctx.createRadialGradient(W - 1, leadY, 0, W - 1, leadY, 10);
        grad.addColorStop(0, GLOW_COLOR);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(W - 1, leadY, 10, 0, Math.PI * 2);
        ctx.fill();

        rafRef.current = requestAnimationFrame(draw);
    };

    // ── Mount / Unmount ─────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        recalcPixelsPerBeat();

        // Init buffer to flat baseline
        const W = canvas.offsetWidth || 400;
        canvas.width = W;
        canvas.height = CANVAS_H;
        const mid = CANVAS_H / 2;
        bufferRef.current = Array(W).fill(mid);

        // Start all three logic layers
        startBpmDriftTimer();
        scheduleBeat();
        rafRef.current = requestAnimationFrame(draw);

        // ResizeObserver keeps canvas pixel-perfect on layout changes
        const ro = new ResizeObserver(entries => {
            const newW = Math.floor(entries[0].contentRect.width);
            if (canvas.width !== newW && newW > 0) {
                canvas.width = newW;
                const newMid = canvas.height / 2;
                bufferRef.current = Array(newW).fill(newMid);
            }
        });
        ro.observe(canvas.parentElement!);

        return () => {
            cancelAnimationFrame(rafRef.current);
            if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
            if (bpmTimerRef.current) clearInterval(bpmTimerRef.current);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">

            {/* ── Header row: pulse dot + label + BPM ── */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                    {/* Animated heartbeat dot — animates at BPM_DEFAULT rhythm visually */}
                    <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.35, 1] }}
                        transition={{ duration: 60 / BPM_DEFAULT, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2.5 h-2.5 rounded-full bg-primary"
                    />
                    <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                        Heart Rate
                    </span>
                </div>

                {/* BPM number — updated via DOM ref, no React renders */}
                <div className="flex items-baseline gap-1">
                    <span
                        ref={bpmDisplayRef}
                        className="text-2xl font-bold tabular-nums text-foreground"
                    >
                        {BPM_DEFAULT}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">BPM</span>
                </div>
            </div>

            {/* ── Waveform canvas ── */}
            <div className="w-full px-0">
                <canvas
                    ref={canvasRef}
                    height={CANVAS_H}
                    className="w-full block"
                    style={{ height: CANVAS_H }}
                />
            </div>

            <p className="text-[10px] text-muted-foreground/60 text-right px-4 pb-3 pt-1">
                Simulated · not medical data
            </p>
        </div>
    );
};

export default HeartRateMonitor;
