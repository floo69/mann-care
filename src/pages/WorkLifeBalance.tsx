import { useState } from 'react';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scale, Moon, Clock, TrendingUp, Shield, Copy, Check, ChevronRight, ArrowLeft, Smile, Meh, Frown } from 'lucide-react';

interface DailyLog {
  date: string;
  shiftHours: number;
  sleepHours: number;
  mood: number;
  cycleDay?: number;
}

const burnoutTips = [
  'Take a 10-minute walk between shifts',
  'Practice box breathing before sleep',
  'Set a hard stop time for work each day',
  'Prioritize 7+ hours of sleep tonight',
  'Say no to one non-essential task today',
];

// Boundary Builder templates
const boundaryTemplates = {
  boss: {
    'Request lighter shift': "Hi [Name], I wanted to reach out regarding my upcoming schedule. I've been managing a heavier workload recently, and I'd like to request a lighter shift this week to maintain my performance quality and wellbeing. I'm happy to discuss how we can best arrange coverage. Thank you for understanding.",
    'Mental health day': "Hi [Name], I'd like to request a personal wellness day on [date]. I believe taking this time will help me return refreshed and continue providing the best care possible. I'll ensure my responsibilities are covered. Thank you for your support.",
    'Schedule adjustment': "Hi [Name], I'd like to discuss a potential adjustment to my current schedule. I've noticed that [specific concern] has been affecting my ability to perform at my best. Could we explore options such as [suggestion]? I value our team and want to ensure I'm contributing effectively.",
  },
  colleague: {
    'Decline extra work': "Hi [Name], thank you for thinking of me for this. Unfortunately, I'm at capacity with my current responsibilities right now and wouldn't be able to give it the attention it deserves. I'd recommend checking with [alternative]. I appreciate your understanding!",
    'Request support': "Hi [Name], I've been managing [task/situation] and could use some support. Would you be available to help with [specific request]? I want to make sure we deliver the best outcome for our patients. Thanks for being a great teammate.",
    'Set time boundary': "Hi [Name], I wanted to let you know that I'll be unavailable after [time] today to recharge. If anything urgent comes up before then, I'm happy to help. I find that maintaining this boundary helps me show up better for our team.",
  },
  team: {
    'Team wellness check': "Hi team, I wanted to check in with everyone. Our workload has been intense recently, and I want to make sure we're all taking care of ourselves. Let's discuss how we can better support each other and perhaps rotate responsibilities more evenly. Your wellbeing matters.",
    'Workload distribution': "Hi team, I'd like to propose we review our current workload distribution. I've noticed some imbalances that could lead to burnout. Could we schedule a brief meeting to discuss a more sustainable arrangement? I believe this will improve both our wellbeing and patient care.",
  },
};

const WorkLifeBalance = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'tracker' | 'boundary'>('tracker');
  const [shiftHours, setShiftHours] = useState(8);
  const [sleepHours, setSleepHours] = useState(7);
  const [dailyMood, setDailyMood] = useState(3);
  const [isFemale, setIsFemale] = useState(false);
  const [cycleDay, setCycleDay] = useState(1);
  const [logged, setLogged] = useState(false);

  // Boundary Builder state
  const [recipient, setRecipient] = useState<'boss' | 'colleague' | 'team'>('boss');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [draftText, setDraftText] = useState('');
  const [copied, setCopied] = useState(false);

  // Mock weekly data
  const [weeklyLogs] = useState<DailyLog[]>([
    { date: 'Mon', shiftHours: 10, sleepHours: 6, mood: 2 },
    { date: 'Tue', shiftHours: 8, sleepHours: 7, mood: 3 },
    { date: 'Wed', shiftHours: 12, sleepHours: 5, mood: 2 },
    { date: 'Thu', shiftHours: 8, sleepHours: 7, mood: 4 },
    { date: 'Fri', shiftHours: 9, sleepHours: 6, mood: 3 },
  ]);

  // Calculate burnout risk
  const avgShift = weeklyLogs.reduce((s, l) => s + l.shiftHours, 0) / weeklyLogs.length;
  const avgSleep = weeklyLogs.reduce((s, l) => s + l.sleepHours, 0) / weeklyLogs.length;
  const avgMood = weeklyLogs.reduce((s, l) => s + l.mood, 0) / weeklyLogs.length;
  const burnoutScore = Math.min(100, Math.max(0, (avgShift - 8) * 15 + (7 - avgSleep) * 20 + (3 - avgMood) * 15 + 30));
  const burnoutLevel = burnoutScore > 65 ? 'High' : burnoutScore > 40 ? 'Moderate' : 'Low';
  const burnoutColor = burnoutScore > 65 ? 'text-destructive' : burnoutScore > 40 ? 'text-warning' : 'text-primary';
  const balanceScore = Math.max(0, 100 - burnoutScore);

  const logDay = () => {
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  const selectTemplate = (name: string) => {
    setSelectedTemplate(name);
    const templates = boundaryTemplates[recipient] as Record<string, string>;
    setDraftText(templates[name] || '');
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="px-5 pt-6 pb-24 space-y-5">
        <FadeIn>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
              <Scale className="text-info" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif text-foreground">Work-Life Balance</h1>
              <p className="text-xs text-muted-foreground">Track, predict, and protect your wellbeing</p>
            </div>
          </div>
        </FadeIn>

        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setTab('tracker')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'tracker' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            📊 Tracker
          </button>
          <button onClick={() => setTab('boundary')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'boundary' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            🛡️ Boundary Builder
          </button>
        </div>

        {tab === 'tracker' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Daily Log */}
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-5">
              <h3 className="text-sm font-semibold text-foreground">Today's Log</h3>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock size={12} /> Shift Length</span>
                  <span className="font-medium text-foreground">{shiftHours}h</span>
                </div>
                <Slider value={[shiftHours]} onValueChange={v => setShiftHours(v[0])} min={4} max={16} step={0.5} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground flex items-center gap-1"><Moon size={12} /> Sleep Hours</span>
                  <span className="font-medium text-foreground">{sleepHours}h</span>
                </div>
                <Slider value={[sleepHours]} onValueChange={v => setSleepHours(v[0])} min={2} max={12} step={0.5} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Daily Mood</p>
                <div className="flex gap-2 justify-between">
                  {[
                    { val: 1, icon: Frown, label: 'Bad' },
                    { val: 2, icon: Frown, label: 'Low' },
                    { val: 3, icon: Meh, label: 'Okay' },
                    { val: 4, icon: Smile, label: 'Good' },
                    { val: 5, icon: Smile, label: 'Great' },
                  ].map(m => (
                    <button key={m.val} onClick={() => setDailyMood(m.val)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${dailyMood === m.val ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-secondary'}`}>
                      <m.icon size={20} className={dailyMood === m.val ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="text-[9px] text-muted-foreground">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setIsFemale(!isFemale)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isFemale ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {isFemale ? '🌸 Cycle Tracking On' : '🌸 Cycle Tracking'}
                </button>
                {isFemale && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Day</span>
                    <input type="number" min={1} max={35} value={cycleDay} onChange={e => setCycleDay(+e.target.value)} className="w-14 px-2 py-1 rounded-lg bg-secondary text-foreground text-sm text-center" />
                  </div>
                )}
              </div>

              <Button onClick={logDay} className="w-full rounded-xl gradient-calm border-none text-primary-foreground">
                {logged ? '✓ Logged!' : 'Log Today'}
              </Button>
            </div>

            {/* Burnout Prediction */}
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Weekly Overview</h3>
              </div>


              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Work-Life Balance</span>
                  <span className="font-medium text-primary">{Math.round(balanceScore)}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${balanceScore}%` }} transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-primary" />
                </div>
              </div>

              {/* Mini chart */}
              <div>
                <p className="text-xs text-muted-foreground mb-3">Weekly Overview</p>
                <div className="flex gap-2">
                  {weeklyLogs.map((log, i) => {
                    const moodEmoji = log.mood >= 4 ? '😊' : log.mood === 3 ? '😐' : '😟';
                    const barHeight = Math.max(20, (log.mood / 5) * 72);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-sm">{moodEmoji}</span>
                        <div className="w-full flex flex-col justify-end" style={{ height: 72 }}>
                          <div className="w-full rounded-t-lg bg-primary/20 relative overflow-hidden" style={{ height: barHeight }}>
                            <div
                              className="absolute bottom-0 w-full rounded-t-lg bg-primary"
                              style={{ height: `${(log.sleepHours / 12) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[9px] font-medium text-foreground">{log.date}</span>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">🌙{log.sleepHours}h</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-[10px] text-muted-foreground">Sleep</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-primary/20" /><span className="text-[10px] text-muted-foreground">Mood</span></div>
                </div>
              </div>

              {burnoutScore > 50 && (
                <div className="bg-warning/5 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-medium text-warning">💡 Recommendations</p>
                  {burnoutTips.slice(0, 3).map((tip, i) => (
                    <p key={i} className="text-xs text-foreground">• {tip}</p>
                  ))}
                  <Button variant="outline" size="sm" className="rounded-lg text-xs mt-1" onClick={() => navigate('/calming')}>
                    Open Calming Tools
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'boundary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="text-primary" size={18} />
                <h3 className="text-sm font-semibold text-foreground">Boundary Builder</h3>
              </div>
              <p className="text-xs text-muted-foreground">Generate professional messages to set healthy boundaries at work.</p>

              {/* Recipient */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Who is this for?</p>
                <div className="flex gap-2">
                  {(['boss', 'colleague', 'team'] as const).map(r => (
                    <button key={r} onClick={() => { setRecipient(r); setSelectedTemplate(''); setDraftText(''); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all ${recipient === r ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {r === 'boss' ? '👔' : r === 'colleague' ? '🤝' : '👥'} {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Select a message type</p>
                <div className="space-y-1.5">
                  {Object.keys(boundaryTemplates[recipient]).map(name => (
                    <button key={name} onClick={() => selectTemplate(name)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between ${selectedTemplate === name ? 'bg-primary/10 ring-1 ring-primary text-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                      {name}
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {draftText && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">Your Draft</p>
                  <button onClick={copyDraft} className="flex items-center gap-1 text-xs text-primary font-medium">
                    {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <textarea
                  value={draftText}
                  onChange={e => setDraftText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-40 leading-relaxed"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl text-xs" onClick={copyDraft}>
                    {copied ? '✓ Copied' : '📋 Copy to Clipboard'}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center">Edit the message above, then copy and paste into your preferred messaging app.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default WorkLifeBalance;
