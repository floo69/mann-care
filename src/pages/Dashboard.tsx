import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/context/AppContext';
import { FadeIn } from '@/components/Animations';
import Layout from '@/components/Layout';
import { Activity, Sparkles, Zap, Scale, HeartPulse, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const aiInsights = [
  "Your stress tends to increase during long shifts. Try short 2-minute breaks between patients.",
  "You've been consistent with check-ins this week — that self-awareness is powerful. 💚",
  "Consider a breathing exercise before your next procedure. It can lower cortisol by up to 25%.",
  "Your mood improves on days you sleep 7+ hours. Prioritize rest tonight.",
];

const Dashboard = () => {
  const { profile, moods, streaks } = useAppState();
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

  return (
    <Layout>
      <div className="px-5 pt-8 space-y-5">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
              </p>
              <h1 className="text-2xl font-serif text-foreground">{profile.name || 'Friend'}</h1>
            </div>
            <motion.button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-2xl gradient-calm flex items-center justify-center shadow-elevated"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-primary-foreground font-semibold">
                {(profile.name || 'U')[0]}
              </span>
            </motion.button>
          </div>
        </FadeIn>

        {/* Mental First Aid — Hero Card */}
        <FadeIn delay={0.1}>
          <motion.button
            onClick={() => navigate('/assessment')}
            className="w-full text-left relative overflow-hidden rounded-2xl p-5 shadow-elevated group"
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 gradient-warm opacity-90 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 rounded-2xl" />
            <div className="relative flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <HeartPulse size={28} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-base font-bold text-white">Mental First Aid</p>
                  <span className="text-[8px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">Priority</span>
                </div>
                <p className="text-xs text-white/80">Immediate emotional support & grounding</p>
              </div>
              <Shield size={18} className="text-white/60" />
            </div>
          </motion.button>
        </FadeIn>

        {/* Daily AI Insight */}
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-2xl p-4 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg gradient-calm flex items-center justify-center">
                  <Sparkles size={14} className="text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold text-primary">Daily AI Insight</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{aiInsights[insightIndex]}</p>
            </div>
          </div>
        </FadeIn>

        {/* Quick Actions Row */}
        <FadeIn delay={0.2}>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { icon: Activity, label: 'Clinical Mode', to: '/clinical', gradient: 'gradient-calm' },
              { icon: Zap, label: 'Stress Relief', to: '/stress-relief', gradient: 'gradient-warm' },
              { icon: Scale, label: 'Work-Life', to: '/work-life', gradient: 'gradient-mint' },
            ].map(({ icon: Icon, label, to, gradient }) => (
              <motion.button
                key={label}
                onClick={() => navigate(to)}
                className="flex-shrink-0 bg-card rounded-2xl p-4 shadow-card flex flex-col items-center gap-2 min-w-[100px]"
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center`}>
                  <Icon size={18} className="text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold text-foreground whitespace-nowrap">{label}</p>
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Encouragement / Progress Snapshot */}
        <FadeIn delay={0.25}>
          <div className="glass rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 gradient-mint opacity-[0.06] rounded-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp size={18} className="text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {streak > 0 ? `🔥 ${streak}-day check-in streak!` : 'Start your wellness streak today'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {streak > 0 ? 'Keep going — consistency builds resilience.' : 'Log your mood to begin tracking.'}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Wellness tip */}
        <FadeIn delay={0.3}>
          <div className="glass rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 gradient-warm opacity-[0.06] rounded-2xl" />
            <div className="relative">
              <p className="text-xs font-medium text-accent mb-1">✨ Daily Wellness Tip</p>
              <p className="text-sm leading-relaxed text-foreground">
                Take 3 deep breaths before your next patient. It activates your parasympathetic nervous system and helps you stay present.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Layout>
  );
};

export default Dashboard;
