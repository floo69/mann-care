import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { motion } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';
const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out',
  hold2: 'Hold',
  idle: 'Ready',
};
const phaseDuration = 4000; // 4 seconds per phase

const tools = [
  { id: 'box', label: 'Box Breathing', emoji: '🫁', desc: '4-4-4-4 pattern' },
  { id: 'meditation', label: '5-Min Meditation', emoji: '🧘', desc: 'Guided mindfulness' },
  { id: 'nature', label: 'Nature Sounds', emoji: '🌿', desc: 'Forest & rain' },
  { id: 'fidget', label: 'Fidget Tool', emoji: '🔮', desc: 'Tap to release' },
];

const CalmingTools = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [timer, setTimer] = useState(0);
  const [fidgetCount, setFidgetCount] = useState(0);

  // Box breathing logic
  useEffect(() => {
    if (!isRunning || activeTool !== 'box') return;
    const phases: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    let phaseIndex = 0;
    setPhase(phases[0]);

    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % 4;
      setPhase(phases[phaseIndex]);
      if (phaseIndex === 0) setCycles(c => c + 1);
    }, phaseDuration);

    return () => clearInterval(interval);
  }, [isRunning, activeTool]);

  // Meditation timer
  useEffect(() => {
    if (!isRunning || activeTool !== 'meditation') return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t >= 300) { setIsRunning(false); return 300; }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, activeTool]);

  const breathScale = phase === 'inhale' ? 1.5 : phase === 'exhale' ? 1 : phase === 'hold1' ? 1.5 : 1;

  if (activeTool === 'box') {
    return (
      <Layout>
        <div className="px-5 pt-8 flex flex-col items-center text-center min-h-[calc(100vh-7rem)]">
          <FadeIn>
            <button onClick={() => { setActiveTool(null); setIsRunning(false); setPhase('idle'); setCycles(0); }}
              className="text-sm text-muted-foreground mb-6">← Back to tools</button>

            <h1 className="text-2xl font-serif text-foreground mb-2">Box Breathing</h1>
            <p className="text-sm text-muted-foreground mb-8">Inhale · Hold · Exhale · Hold</p>
          </FadeIn>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{ scale: breathScale, opacity: phase === 'idle' ? 0.5 : 0.8 }}
                transition={{ duration: phaseDuration / 1000, ease: 'easeInOut' }}
                className="w-48 h-48 rounded-full gradient-calm"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-xl font-serif text-primary-foreground font-bold">{phaseLabels[phase]}</p>
                  {cycles > 0 && <p className="text-xs text-primary-foreground/70 mt-1">{cycles} cycles</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => { setIsRunning(false); setPhase('idle'); setCycles(0); }}
              className="rounded-xl w-12 h-12"
            >
              <RotateCcw size={18} />
            </Button>
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="rounded-xl px-8 py-3 gradient-calm border-none text-primary-foreground"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span className="ml-2">{isRunning ? 'Pause' : 'Start'}</span>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (activeTool === 'meditation') {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return (
      <Layout>
        <div className="px-5 pt-8 flex flex-col items-center text-center min-h-[calc(100vh-7rem)]">
          <button onClick={() => { setActiveTool(null); setIsRunning(false); setTimer(0); }}
            className="text-sm text-muted-foreground mb-6">← Back to tools</button>
          <h1 className="text-2xl font-serif text-foreground mb-2">5-Minute Meditation</h1>
          <p className="text-sm text-muted-foreground mb-8">Find a quiet space. Close your eyes.</p>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-48 h-48 rounded-full gradient-warm"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-3xl font-mono text-foreground">{mins}:{secs.toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
            {isRunning ? "Focus on your breath. Let thoughts pass like clouds..." : "Press start when you're ready."}
          </p>

          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="rounded-xl px-8 py-3 mb-8 gradient-warm border-none text-foreground"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
        </div>
      </Layout>
    );
  }

  if (activeTool === 'fidget') {
    return (
      <Layout>
        <div className="px-5 pt-8 flex flex-col items-center text-center min-h-[calc(100vh-7rem)]">
          <button onClick={() => { setActiveTool(null); setFidgetCount(0); }}
            className="text-sm text-muted-foreground mb-6">← Back to tools</button>
          <h1 className="text-2xl font-serif text-foreground mb-2">Fidget Tool</h1>
          <p className="text-sm text-muted-foreground mb-8">Tap the circle to release tension</p>

          <div className="flex-1 flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setFidgetCount(c => c + 1)}
              className="w-40 h-40 rounded-full gradient-calm shadow-soft flex items-center justify-center active:shadow-none transition-shadow"
            >
              <span className="text-4xl font-bold text-primary-foreground">{fidgetCount}</span>
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mb-8">Taps: {fidgetCount}</p>
        </div>
      </Layout>
    );
  }

  if (activeTool === 'nature') {
    return (
      <Layout>
        <div className="px-5 pt-8 flex flex-col items-center text-center min-h-[calc(100vh-7rem)]">
          <button onClick={() => setActiveTool(null)}
            className="text-sm text-muted-foreground mb-6">← Back to tools</button>
          <h1 className="text-2xl font-serif text-foreground mb-2">Nature Sounds</h1>

          <div className="flex-1 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-48 h-48 rounded-full bg-success/10 flex items-center justify-center"
            >
              <span className="text-6xl">🌿</span>
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
            Close your eyes and imagine yourself in a peaceful forest. Listen to the rustling leaves and gentle rain...
          </p>
        </div>
      </Layout>
    );
  }

  // Tool selection
  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wind className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Calming Tools</h1>
              <p className="text-sm text-muted-foreground">Short exercises for busy schedules</p>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-3">
          {tools.map((tool, i) => (
            <FadeIn key={tool.id} delay={i * 0.1}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTool(tool.id)}
                className="w-full text-left px-5 py-5 rounded-2xl bg-card shadow-card hover:shadow-soft hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-4"
              >
                <span className="text-3xl">{tool.emoji}</span>
                <div>
                  <p className="text-base font-semibold text-foreground">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </motion.button>
            </FadeIn>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CalmingTools;
