import { useState } from 'react';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { useAppState, JournalEntry } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Sparkles, X, BookOpen, ChevronRight, Smile, Meh, Frown, SmilePlus, Angry } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const emotionSliders = [
  { key: 'stress', label: 'Stress', color: 'bg-destructive' },
  { key: 'anxiety', label: 'Anxiety', color: 'bg-accent' },
  { key: 'calm', label: 'Calm', color: 'bg-success' },
  { key: 'energy', label: 'Energy', color: 'bg-warning' },
  { key: 'focus', label: 'Focus', color: 'bg-info' },
];

const prompts = [
  "What's on your mind right now?",
  "What made you smile today?",
  "What's one thing you're grateful for?",
  "How did your body feel during your shift?",
  "What would you tell a friend in your situation?",
];

const moodIcons = [
  { icon: Angry, emoji: '😣' },
  { icon: Frown, emoji: '😟' },
  { icon: Meh, emoji: '😐' },
  { icon: Smile, emoji: '😊' },
  { icon: SmilePlus, emoji: '🤩' },
];

const getMoodColor = (mood: number) => {
  const colors = ['hsl(0, 55%, 60%)', 'hsl(340, 50%, 75%)', 'hsl(38, 80%, 60%)', 'hsl(260, 50%, 65%)', 'hsl(158, 45%, 50%)'];
  return colors[mood - 1] || 'hsl(260, 10%, 85%)';
};

const getDates = () => {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = -14; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const Journal = () => {
  const { journalEntries, addJournalEntry, moods, addMood } = useAppState();
  const [step, setStep] = useState<'idle' | 'emotions' | 'writing'>('idle');
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState<Record<string, number>>({
    stress: 50, anxiety: 50, calm: 50, energy: 50, focus: 50,
  });

  const currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  const dates = getDates();
  const today = new Date().toISOString().split('T')[0];

  const updateEmotion = (key: string, value: number[]) => {
    setEmotions(prev => ({ ...prev, [key]: value[0] }));
  };

  const save = () => {
    if (!text.trim()) return;
    const overallMood = Math.round(
      ((100 - emotions.stress) + (100 - emotions.anxiety) + emotions.calm + emotions.energy + emotions.focus) / 100
    );
    const moodValue = Math.max(1, Math.min(5, overallMood));
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
      mood: moodValue,
      tags: [],
    };
    addJournalEntry(entry);
    addMood({ date: entry.date, mood: moodValue });
    setText('');
    setEmotions({ stress: 50, anxiety: 50, calm: 50, energy: 50, focus: 50 });
    setStep('idle');
  };

  const startJournal = () => setStep('emotions');

  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-foreground">Journal</h1>
              <p className="text-sm text-muted-foreground mt-1">A safe space for your thoughts</p>
            </div>
            {step === 'idle' && (
              <motion.button
                onClick={startJournal}
                className="w-12 h-12 rounded-2xl gradient-calm flex items-center justify-center shadow-elevated"
                whileTap={{ scale: 0.9 }}
              >
                <PenLine size={20} className="text-primary-foreground" />
              </motion.button>
            )}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {/* Step 1: Emotion Setup */}
          {step === 'emotions' && (
            <motion.div
              key="emotions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-5 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif text-foreground">Set your current emotions</h2>
                  <p className="text-xs text-muted-foreground mt-1">Move the sliders to reflect how you feel right now.</p>
                </div>
                <button onClick={() => setStep('idle')}>
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-5">
                {emotionSliders.map(({ key, label, color }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground">{emotions[key]}%</span>
                    </div>
                    <Slider
                      value={[emotions[key]]}
                      onValueChange={(v) => updateEmotion(key, v)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep('writing')}
                className="w-full rounded-xl py-5 gradient-calm border-none text-primary-foreground"
              >
                Continue <ChevronRight size={16} className="ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Journal Writing */}
          {step === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <p className="text-xs text-muted-foreground italic">{currentPrompt}</p>
                </div>
                <button onClick={() => setStep('idle')}>
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Let your thoughts flow freely..."
                rows={8}
                className="w-full bg-secondary/30 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                autoFocus
              />

              <Button
                onClick={save}
                disabled={!text.trim()}
                className="w-full rounded-xl py-5 gradient-calm border-none text-primary-foreground"
              >
                Save Entry
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Timeline */}
        {step === 'idle' && (
          <FadeIn delay={0.1}>
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Mood Timeline</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map(date => {
                  const dateStr = date.toISOString().split('T')[0];
                  const moodEntry = moods.find(m => m.date === dateStr);
                  const isToday = dateStr === today;
                  const dayName = date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
                  const dayNum = date.getDate();

                  return (
                    <div
                      key={dateStr}
                      className={`flex-shrink-0 flex flex-col items-center gap-1 w-10 py-2 rounded-xl ${isToday ? 'bg-primary/10' : ''}`}
                    >
                      <span className="text-[9px] text-muted-foreground uppercase">{dayName}</span>
                      <span className={`text-[10px] font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>{dayNum}</span>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={moodEntry ? { backgroundColor: getMoodColor(moodEntry.mood) + '22' } : {}}
                      >
                        {moodEntry ? (
                          <span>{moodIcons[moodEntry.mood - 1]?.emoji}</span>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-border" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Past entries */}
        {journalEntries.length === 0 && step === 'idle' ? (
          <FadeIn delay={0.15}>
            <div className="flex flex-col items-center text-center py-12">
              <BookOpen size={48} className="text-muted-foreground/30 mb-4" />
              <p className="text-sm font-medium text-foreground">No entries yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start writing to build your reflection practice</p>
            </div>
          </FadeIn>
        ) : step === 'idle' && (
          <div className="space-y-3">
            {journalEntries.map((entry, i) => (
              <FadeIn key={entry.id} delay={i * 0.05}>
                <div className="bg-card rounded-2xl p-4 shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                    {entry.mood && (
                      <span className="text-xs">
                        {moodIcons[entry.mood - 1]?.emoji}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground line-clamp-3">{entry.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Journal;
