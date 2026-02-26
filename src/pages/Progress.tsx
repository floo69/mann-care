import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { useAppState } from '@/context/AppContext';
import { BarChart3, TrendingDown, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

const ProgressPage = () => {
  const { assessments, moods } = useAppState();

  const stressData = assessments.map(a => ({
    date: a.date.slice(5),
    stress: a.stressScore,
    anxiety: a.anxietyScore,
  }));

  const moodData = moods.slice(-7).map(m => ({
    date: m.date.slice(5),
    mood: m.mood,
  }));

  const latestAssessment = assessments[assessments.length - 1];
  const previousAssessment = assessments.length > 1 ? assessments[assessments.length - 2] : null;
  const stressChange = previousAssessment
    ? latestAssessment.stressScore - previousAssessment.stressScore
    : 0;

  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Your Progress</h1>
              <p className="text-sm text-muted-foreground">Track your wellness journey</p>
            </div>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-3 shadow-card text-center">
              <TrendingDown className={`mx-auto mb-1 ${stressChange <= 0 ? 'text-success' : 'text-destructive'}`} size={20} />
              <p className="text-lg font-bold text-foreground">{stressChange <= 0 ? stressChange : `+${stressChange}`}</p>
              <p className="text-[10px] text-muted-foreground">Stress Δ</p>
            </div>
            <div className="bg-card rounded-2xl p-3 shadow-card text-center">
              <Flame className="mx-auto mb-1 text-accent" size={20} />
              <p className="text-lg font-bold text-foreground">7</p>
              <p className="text-[10px] text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </FadeIn>

        {/* Stress & Anxiety chart */}
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Stress & Anxiety Trends</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stressData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="stress" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="anxiety" stroke="hsl(var(--info))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded bg-primary" />
                <span className="text-[10px] text-muted-foreground">Stress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded bg-info" />
                <span className="text-[10px] text-muted-foreground">Anxiety</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Mood chart */}
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Mood This Week</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Area type="monotone" dataKey="mood" stroke="hsl(var(--primary))" fill="url(#moodGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>

        {/* Achievements */}
        <FadeIn delay={0.25}>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Achievements</h3>
            <div className="flex gap-3 flex-wrap">
              {[
                { emoji: '🌱', label: 'First Check-in' },
                { emoji: '🔥', label: '7-Day Streak' },
                { emoji: '🧘', label: 'Meditation Pro' },
                { emoji: '📊', label: 'Self-Aware' },
              ].map(badge => (
                <div key={badge.label} className="flex flex-col items-center gap-1 bg-secondary rounded-xl p-3 min-w-[70px]">
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-[9px] text-muted-foreground text-center">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </Layout>
  );
};

export default ProgressPage;
