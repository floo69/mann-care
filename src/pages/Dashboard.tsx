import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/context/AppContext';
import { FadeIn } from '@/components/Animations';
import Layout from '@/components/Layout';
import { Activity, Sparkles, Zap, Scale, HeartPulse, TrendingUp, ChevronRight, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const aiInsights = [
  "Your stress tends to peak during long shifts. Try 2-minute structured breathing breaks between patients.",
  "You've maintained consistent check-ins this week. Self-monitoring is a clinically proven resilience strategy.",
  "A brief breathing exercise before procedures can reduce cortisol by up to 25%. Try it now.",
  "Data shows your mood correlates with 7+ hours of sleep. Consider a sleep hygiene review tonight.",
];

const Dashboard = () => {
  const { profile, moods } = useAppState();
  const navigate = useNavigate();
  const insightIndex = new Date().getDay() % aiInsights.length;

  const streak = (() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (moods.find(m => m.date === dateStr)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  })();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="px-5 pt-8 pb-6 space-y-6">

        {/* ── Header ── */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-1">
                {greeting}
              </p>
              <h1 className="text-3xl font-serif text-foreground leading-tight">
                {profile.name || 'Clinician'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={16} />
              </motion.button>
              <motion.button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-lg gradient-calm flex items-center justify-center shadow-elevated"
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-primary-foreground text-sm font-bold">
                  {(profile.name || 'U')[0].toUpperCase()}
                </span>
              </motion.button>
            </div>
          </div>
        </FadeIn>

        {/* ── Divider ── */}
        <div className="h-px bg-border" />

        {/* ── Hero CTA: Mental First Aid ── */}
        <FadeIn delay={0.08}>
          <motion.button
            onClick={() => navigate('/assessment')}
            className="w-full text-left relative overflow-hidden rounded-xl shadow-elevated group"
            whileTap={{ scale: 0.98 }}
          >
            {/* structured dark blue background, no pink */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(221,65%,30%)] to-[hsl(221,55%,42%)]" />
            {/* subtle grid texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(255,255,255,1) 24px,rgba(255,255,255,1) 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,rgba(255,255,255,1) 24px,rgba(255,255,255,1) 25px)',
              }}
            />
            <div className="relative px-5 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                <HeartPulse size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold text-white">Mental First Aid</p>
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-white/20 text-white px-2 py-0.5 rounded">
                    Priority
                  </span>
                </div>
                <p className="text-sm text-white/70">
                  Immediate emotional support &amp; clinical grounding
                </p>
              </div>
              <ChevronRight size={18} className="text-white/50 flex-shrink-0 group-hover:text-white/80 transition-colors" />
            </div>
          </motion.button>
        </FadeIn>

        {/* ── Quick Actions Row ── */}
        <FadeIn delay={0.14}>
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Quick Access
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Activity, label: 'Clinical Mode', to: '/clinical', accentClass: 'bg-primary/10 text-primary' },
                { icon: Zap, label: 'Stress Relief', to: '/stress-relief', accentClass: 'bg-accent/10 text-accent' },
                { icon: Scale, label: 'Work-Life', to: '/work-life', accentClass: 'bg-primary/10 text-primary' },
              ].map(({ icon: Icon, label, to, accentClass }) => (
                <motion.button
                  key={label}
                  onClick={() => navigate(to)}
                  className="bg-card border border-border rounded-xl p-4 shadow-card flex flex-col items-center gap-2.5 hover:border-primary/30 hover:shadow-elevated transition-all duration-200"
                  whileTap={{ scale: 0.94 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${accentClass} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-[11px] font-semibold text-foreground text-center leading-tight">
                    {label}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── AI Insight ── */}
        <FadeIn delay={0.2}>
          <div className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={15} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-1.5">
                  Daily Clinical Insight
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {aiInsights[insightIndex]}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Progress Snapshot ── */}
        <FadeIn delay={0.26}>
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
                Wellness Streak
              </p>
              <button
                onClick={() => navigate('/progress')}
                className="text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
              >
                View Progress <ChevronRight size={12} />
              </button>
            </div>
            <div className="px-4 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {streak > 0
                    ? `${streak}-day check-in streak`
                    : 'Start your check-in streak today'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {streak > 0
                    ? 'Consistency is a key predictor of resilience.'
                    : 'Log your mood now to begin tracking.'}
                </p>
              </div>
              {streak > 0 && (
                <span className="text-2xl font-bold text-success/80 leading-none">
                  {streak}
                </span>
              )}
            </div>
          </div>
        </FadeIn>

        {/* ── Evidence-Based Tip ── */}
        <FadeIn delay={0.32}>
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-1.5">
              Evidence-Based Tip
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              Take 3 diaphragmatic breaths before your next patient interaction. This activates the
              parasympathetic nervous system and measurably reduces perceived stress.
            </p>
          </div>
        </FadeIn>

      </div>
    </Layout>
  );
};

export default Dashboard;
