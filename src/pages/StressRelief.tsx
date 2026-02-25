import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Shield, ArrowLeft, Send, Bot, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const affirmations = [
  "You are safe. You are capable.",
  "This moment will pass.",
  "You have handled difficult things before.",
  "Your patients are lucky to have you.",
  "Breathe in calm, breathe out tension.",
  "You are doing your best, and that is enough.",
];

const groundingSteps = [
  { label: '5 things you can SEE', emoji: '👀' },
  { label: '4 things you can TOUCH', emoji: '✋' },
  { label: '3 things you can HEAR', emoji: '👂' },
  { label: '2 things you can SMELL', emoji: '👃' },
  { label: '1 thing you can TASTE', emoji: '👅' },
];

const getSliderGradient = (val: number) => {
  if (val <= 3) return 'from-primary to-primary';
  if (val <= 6) return 'from-warning to-accent';
  return 'from-accent to-destructive';
};

const getSliderLabel = (val: number) => {
  if (val <= 3) return { text: 'Low Stress', color: 'text-primary' };
  if (val <= 6) return { text: 'Moderate Stress', color: 'text-warning' };
  return { text: 'High Stress', color: 'text-destructive' };
};

// Simple AI response for moderate/high stress chat
const getStressResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('control') || lower.includes('can\'t'))
    return "It's okay to recognize what's outside your control. Focus on what you *can* influence right now — even small actions like taking a breath or stepping away for a moment can shift your state. You're doing the right thing by reflecting on this. 💚";
  if (lower.includes('patient') || lower.includes('work') || lower.includes('shift'))
    return "Clinical work is demanding, and it's natural to feel the weight of responsibility. Remember: you're human first, clinician second. Your wellbeing directly impacts your care quality. Would you like to try a quick grounding exercise?";
  return "Thank you for sharing that. Your feelings are completely valid. Healthcare professionals carry so much — it takes real strength to pause and check in with yourself. I'm here for you. Would you like me to suggest a calming exercise, or would you prefer to keep talking?";
};

const StressRelief = () => {
  const [stressLevel, setStressLevel] = useState(5);
  const [phase, setPhase] = useState<'slider' | 'low' | 'moderate-questions' | 'moderate-chat' | 'high-calming' | 'high-chat' | 'breathing' | 'affirmation' | 'grounding' | 'complete'>('slider');
  const [breathCount, setBreathCount] = useState(0);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [groundingStep, setGroundingStep] = useState(0);
  const [moderateAnswers, setModerateAnswers] = useState({ q1: '', q2: '' });
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const startFlow = () => {
    if (stressLevel <= 3) setPhase('low');
    else if (stressLevel <= 6) setPhase('moderate-questions');
    else setPhase('high-calming');
  };

  // Auto-advance affirmations
  useEffect(() => {
    if (phase !== 'affirmation') return;
    const interval = setInterval(() => {
      setAffirmationIndex(i => {
        if (i >= affirmations.length - 1) {
          setPhase('grounding');
          return 0;
        }
        return i + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [phase]);

  const sendChat = (initialMsg?: string) => {
    const msg = initialMsg || chatInput.trim();
    if (!msg) return;
    const userMsg = { role: 'user' as const, content: msg };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: getStressResponse(msg) }]);
      setIsTyping(false);
    }, 1200);
  };

  const startModerateChat = () => {
    const intro = `I understand you're feeling stressed. You mentioned: "${moderateAnswers.q1}". ${moderateAnswers.q2.toLowerCase().includes('yes') ? "It sounds like this is something within your reach to address." : "Sometimes things feel out of our control, and that's okay."} Let's work through this together. 💚`;
    setChatMessages([{ role: 'assistant', content: intro }]);
    setPhase('moderate-chat');
  };

  const startHighChat = () => {
    setChatMessages([{ role: 'assistant', content: "I'm glad you took a moment to breathe. You showed real self-awareness by recognizing your stress level. I'm here to support you now. How are you feeling after the calming exercise? 💚" }]);
    setPhase('high-chat');
  };

  const sliderLabel = getSliderLabel(stressLevel);

  // SLIDER PHASE
  if (phase === 'slider') {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Zap className="text-accent mx-auto mb-4" size={32} />
          <h1 className="text-2xl font-serif text-foreground mb-2">How stressed are you?</h1>
          <p className="text-sm text-muted-foreground mb-8">Slide to rate your current stress level</p>

          <div className="mb-4">
            <div className={`text-5xl font-serif font-bold mb-2 ${sliderLabel.color}`}>{stressLevel}</div>
            <p className={`text-sm font-medium ${sliderLabel.color}`}>{sliderLabel.text}</p>
          </div>

          <div className="px-2 mb-8">
            <div className={`h-2 rounded-full bg-gradient-to-r ${getSliderGradient(stressLevel)} mb-1`} style={{ width: `${stressLevel * 10}%`, transition: 'width 0.3s' }} />
            <Slider
              value={[stressLevel]}
              onValueChange={v => setStressLevel(v[0])}
              min={1}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Calm</span>
              <span>Moderate</span>
              <span>Intense</span>
            </div>
          </div>

          <Button onClick={startFlow} className="w-full rounded-xl py-5 gradient-calm border-none text-primary-foreground">
            Continue
          </Button>

          <button onClick={() => navigate(-1)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1 mx-auto">
            <ArrowLeft size={14} /> Back
          </button>
        </motion.div>
      </div>
    );
  }

  // LOW STRESS (1-3)
  if (phase === 'low') {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="text-primary" size={36} />
          </motion.div>
          <h1 className="text-2xl font-serif text-foreground mb-3">You're doing great! 🌟</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your stress is manageable right now. That's wonderful! Let's keep it that way with a quick 1-minute breathing exercise.
          </p>
          <div className="glass rounded-2xl p-6 mb-6">
            <p className="text-sm font-medium text-foreground mb-4">1-Minute Box Breathing</p>
            <motion.div
              animate={{ scale: [1, 1.3, 1.3, 1], opacity: [0.6, 1, 1, 0.6] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="w-28 h-28 rounded-full gradient-calm mx-auto mb-4"
            />
            <p className="text-xs text-muted-foreground">Breathe in 4s · Hold 4s · Out 4s · Hold 4s</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1 rounded-xl">Done</Button>
            <Button onClick={() => navigate('/calming')} className="flex-1 rounded-xl gradient-calm border-none text-primary-foreground">More Tools</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // MODERATE - QUESTIONS (4-6)
  if (phase === 'moderate-questions') {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <MessageCircle className="text-warning mx-auto mb-3" size={32} />
            <h1 className="text-2xl font-serif text-foreground mb-1">Let's reflect together</h1>
            <p className="text-sm text-muted-foreground">Two quick questions to help understand your stress</p>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">What is making you feel stressed right now?</label>
              <textarea
                value={moderateAnswers.q1}
                onChange={e => setModerateAnswers(p => ({ ...p, q1: e.target.value }))}
                placeholder="Share what's on your mind..."
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Is this within your control?</label>
              <div className="flex gap-2">
                {['Yes, mostly', 'Partially', 'Not really'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setModerateAnswers(p => ({ ...p, q2: opt }))}
                    className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      moderateAnswers.q2 === opt ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={startModerateChat}
            disabled={!moderateAnswers.q1.trim() || !moderateAnswers.q2}
            className="w-full rounded-xl py-5 gradient-calm border-none text-primary-foreground"
          >
            Get Support
          </Button>

          <button onClick={() => setPhase('slider')} className="text-xs text-muted-foreground flex items-center gap-1 mx-auto">
            <ArrowLeft size={14} /> Back
          </button>
        </motion.div>
      </div>
    );
  }

  // HIGH STRESS CALMING (7-10)
  if (phase === 'high-calming') {
    return (
      <div className="min-h-screen page-gradient-calm flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="w-full max-w-sm">
          <p className="text-sm text-muted-foreground mb-6">Let's calm down first before we talk</p>
          <h1 className="text-2xl font-serif text-foreground mb-2">Breathe with me</h1>
          <p className="text-xs text-muted-foreground mb-8">Follow the circle. Slow and steady.</p>

          <motion.div
            animate={{ scale: [1, 1.4, 1.4, 1], opacity: [0.5, 1, 1, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="w-44 h-44 rounded-full gradient-calm mx-auto mb-6"
          />

          <div className="glass rounded-2xl p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-2">Grounding: 5-4-3-2-1</p>
            <p className="text-sm text-foreground">Name 5 things you see around you right now.</p>
          </div>

          <p className="text-xs text-muted-foreground mb-4">{breathCount}/3 breathing cycles</p>

          <Button
            onClick={() => {
              if (breathCount >= 2) startHighChat();
              else setBreathCount(c => c + 1);
            }}
            className="w-full rounded-xl py-5 gradient-calm border-none text-primary-foreground"
          >
            {breathCount >= 2 ? 'I feel calmer — continue' : 'Complete Breathing Cycle'}
          </Button>
        </motion.div>
      </div>
    );
  }

  // CHAT PHASE (moderate-chat or high-chat)
  if (phase === 'moderate-chat' || phase === 'high-chat') {
    return (
      <div className="min-h-screen page-gradient flex flex-col">
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
          <button onClick={() => setPhase('slider')} className="text-muted-foreground"><ArrowLeft size={20} /></button>
          <div className="w-9 h-9 rounded-full gradient-calm flex items-center justify-center">
            <Bot className="text-primary-foreground" size={18} />
          </div>
          <div>
            <p className="text-sm font-serif text-foreground">Wellness Coach</p>
            <p className="text-[10px] text-muted-foreground">Stress support session</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
          {chatMessages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card shadow-card text-foreground rounded-bl-md'
              }`}>{msg.content}</div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} className="text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><Bot size={14} className="text-primary" /></div>
              <div className="bg-card shadow-card rounded-2xl px-4 py-3 rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-4 pt-2 border-t border-border glass">
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="How are you feeling..."
              className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={() => sendChat()} disabled={!chatInput.trim()} className="w-11 h-11 rounded-xl gradient-calm flex items-center justify-center text-primary-foreground disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => navigate('/calming')}>🫁 Calming Tools</Button>
            <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setPhase('complete')}>✓ I feel better</Button>
          </div>
        </div>
      </div>
    );
  }

  // LEGACY PHASES (breathing, affirmation, grounding) kept for direct navigation
  if (phase === 'breathing') {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Zap className="text-accent mx-auto mb-4" size={32} />
          <h1 className="text-2xl font-serif text-foreground mb-2">Quick Stress Relief</h1>
          <p className="text-sm text-muted-foreground mb-8">Follow along with the breathing circle</p>
        </motion.div>
        <motion.div animate={{ scale: [1, 1.4, 1.4, 1], opacity: [0.6, 1, 1, 0.6] }} transition={{ duration: 8, repeat: Infinity }} className="w-40 h-40 rounded-full gradient-calm mb-8" />
        <p className="text-sm text-muted-foreground mb-6">Breathe with the circle. {breathCount}/3 cycles</p>
        <Button onClick={() => { if (breathCount >= 2) setPhase('affirmation'); else setBreathCount(c => c + 1); }} className="rounded-xl gradient-calm border-none text-primary-foreground">
          {breathCount >= 2 ? 'Continue' : 'Complete Cycle'}
        </Button>
        <button onClick={() => navigate(-1)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
      </div>
    );
  }

  if (phase === 'affirmation') {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 text-center">
        <Heart className="text-accent mb-6 animate-pulse" size={40} />
        <motion.p key={affirmationIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-serif text-foreground max-w-xs leading-relaxed">
          {affirmations[affirmationIndex]}
        </motion.p>
        <div className="flex gap-1.5 mt-8">
          {affirmations.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i <= affirmationIndex ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'grounding') {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 text-center">
        <Shield className="text-primary mb-4" size={32} />
        <h2 className="text-lg font-serif text-foreground mb-1">5-4-3-2-1 Grounding</h2>
        <p className="text-xs text-muted-foreground mb-8">Reconnect with the present moment</p>
        <motion.div key={groundingStep} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 mb-6 w-full max-w-xs">
          <span className="text-4xl mb-3 block">{groundingSteps[groundingStep].emoji}</span>
          <p className="text-lg font-semibold text-foreground">{groundingSteps[groundingStep].label}</p>
        </motion.div>
        <Button onClick={() => { if (groundingStep >= groundingSteps.length - 1) setPhase('complete'); else setGroundingStep(s => s + 1); }} className="rounded-xl gradient-calm border-none text-primary-foreground">
          {groundingStep >= groundingSteps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    );
  }

  // COMPLETE
  return (
    <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <span className="text-5xl block mb-4">🌟</span>
        <h1 className="text-2xl font-serif text-foreground mb-2">Well done.</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
          You just activated your body's natural calming response. You're ready to continue with clarity and confidence.
        </p>
        <Button onClick={() => navigate('/')} className="rounded-xl gradient-calm border-none text-primary-foreground">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default StressRelief;
