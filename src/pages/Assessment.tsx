import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { useAppState } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Info,
  HeartPulse,
  Zap,
  PhoneCall,
} from 'lucide-react';

// ─── MHFA-based questions ────────────────────────────────────────────────────

const depressionQuestions = [
  { q: 'An unusually sad mood that does not go away?', context: 'In the last two weeks, have you frequently experienced:' },
  { q: 'A loss of enjoyment or interest in activities you used to love?', context: 'In the last two weeks, have you frequently experienced:' },
  { q: 'A significant lack of energy or feeling tired all the time?', context: 'In the last two weeks, have you frequently experienced:' },
  { q: 'Changes in your sleep (sleeping too much or too little)?', context: 'In the last two weeks, have you frequently experienced:' },
  { q: 'Changes in appetite or weight (loss or gain)?', context: 'In the last two weeks, have you frequently experienced:' },
  { q: 'Difficulty concentrating or making simple decisions?', context: 'In the last two weeks, have you frequently experienced:' },
  { q: 'Feelings of worthlessness, excessive guilt, or hopelessness?', context: 'In the last two weeks, have you frequently experienced:' },
];

const anxietyQuestions = [
  { q: 'Physical symptoms like a racing heart (palpitations), sweating, or trembling?', context: 'Do you regularly experience:' },
  { q: 'Shortness of breath or a "choking" sensation?', context: 'Do you regularly experience:' },
  { q: 'Persistent catastrophising — expecting the worst possible outcome?', context: 'Do you regularly experience:' },
  { q: 'A feeling of "unreality" or being detached from your surroundings?', context: 'Do you regularly experience:' },
  { q: 'Repetitive behaviours (like excessive checking) to reduce fear?', context: 'Do you regularly experience:' },
  { q: 'Avoidance of social situations or specific places due to fear?', context: 'Do you regularly experience:' },
];

const stressQuestions = [
  { q: 'Do you feel like your "container" is overflowing — constantly overwhelmed?', context: 'Stress Container model (MHFA):' },
  { q: 'Are you experiencing your personal "stress signature" — physical or mental signs that you are at your limit?', context: 'Stress Container model (MHFA):' },
  { q: 'Are you finding it difficult to "turn off autopilot" and be present in the moment?', context: 'Stress Container model (MHFA):' },
  { q: 'Has your stress led to increased use of alcohol or other substances as a coping mechanism?', context: 'Stress Container model (MHFA):' },
];

// Scoring: Yes = 2, Sometimes = 1, No = 0
const responseOptions = ['Yes', 'Sometimes', 'No'];
const responseScores: Record<string, number> = { Yes: 2, Sometimes: 1, No: 0 };

type Section = 'depression' | 'anxiety' | 'stress';
type Phase = 'intro' | Section | 'results';

interface Answers {
  depression: number[];
  anxiety: number[];
  stress: number[];
}

const sectionMeta: Record<Section, { label: string; total: number; icon: typeof Brain }> = {
  depression: { label: 'Section 1 — Depression', total: depressionQuestions.length, icon: Brain },
  anxiety: { label: 'Section 2 — Anxiety', total: anxietyQuestions.length, icon: HeartPulse },
  stress: { label: 'Section 3 — Stress & Burnout', total: stressQuestions.length, icon: Zap },
};

const Assessment = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ depression: [], anxiety: [], stress: [] });
  const { addAssessment } = useAppState();
  const navigate = useNavigate();

  // Current question set
  const currentQuestions =
    phase === 'depression' ? depressionQuestions
      : phase === 'anxiety' ? anxietyQuestions
        : phase === 'stress' ? stressQuestions
          : [];

  const handleAnswer = (label: string) => {
    if (phase === 'intro' || phase === 'results') return;
    const score = responseScores[label];
    const section = phase as Section;
    const updated = [...answers[section], score];
    setAnswers(prev => ({ ...prev, [section]: updated }));

    if (qIndex < currentQuestions.length - 1) {
      setQIndex(i => i + 1);
    } else {
      // Move to next section or results
      setQIndex(0);
      if (phase === 'depression') setPhase('anxiety');
      else if (phase === 'anxiety') setPhase('stress');
      else {
        // Compute final scores (stress section answers are in `updated`)
        const depScore2 = answers.depression.reduce((s, a) => s + a, 0);
        const anxScore = answers.anxiety.reduce((s, a) => s + a, 0);
        const strScore = updated.reduce((s, a) => s + a, 0);

        const maxDep = depressionQuestions.length * 2;  // 14
        const maxAnx = anxietyQuestions.length * 2;     // 12
        const maxStr = stressQuestions.length * 2;      // 8

        const depPct = (depScore2 / maxDep) * 100;
        const anxPct = (anxScore / maxAnx) * 100;
        const strPct = (strScore / maxStr) * 100;

        const stressScore = Math.round((depPct + strPct) / 2);
        const anxietyScore = Math.round(anxPct);
        const burnoutRisk: 'low' | 'moderate' | 'high' =
          strPct > 60 || depPct > 60 || anxPct > 60 ? 'high'
            : strPct > 35 || depPct > 35 || anxPct > 35 ? 'moderate'
              : 'low';

        addAssessment({
          date: new Date().toISOString().split('T')[0],
          stressScore,
          anxietyScore,
          burnoutRisk,
        });

        setAnswers(prev => ({ ...prev, stress: updated }));
        setPhase('results');
      }
    }
  };

  // ── Derived scores for results ──
  const depScore = answers.depression.reduce((s, a) => s + a, 0);
  const anxScore = answers.anxiety.reduce((s, a) => s + a, 0);
  const strScore = answers.stress.reduce((s, a) => s + a, 0);
  const maxDep = depressionQuestions.length * 2;
  const maxAnx = anxietyQuestions.length * 2;
  const maxStr = stressQuestions.length * 2;
  const depPct = maxDep > 0 ? Math.round((depScore / maxDep) * 100) : 0;
  const anxPct = maxAnx > 0 ? Math.round((anxScore / maxAnx) * 100) : 0;
  const strPct = maxStr > 0 ? Math.round((strScore / maxStr) * 100) : 0;
  const overallRisk: 'low' | 'moderate' | 'high' =
    strPct > 60 || depPct > 60 || anxPct > 60 ? 'high'
      : strPct > 35 || depPct > 35 || anxPct > 35 ? 'moderate'
        : 'low';

  // ── Overall progress bar ──
  const totalQ = depressionQuestions.length + anxietyQuestions.length + stressQuestions.length;
  const answered =
    answers.depression.length + answers.anxiety.length + answers.stress.length +
    (phase !== 'intro' && phase !== 'results' ? qIndex : 0);
  const overallProgress = Math.round((answered / totalQ) * 100);

  // ─────────────────── INTRO ────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <Layout>
        <div className="px-5 pt-8 pb-6 space-y-5">
          <FadeIn>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="text-primary" size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-foreground">Mental First Aid</h1>
                <p className="text-sm text-muted-foreground">MHFA Wellbeing Assessment</p>
              </div>
            </div>
          </FadeIn>

          {/* MHFA disclaimer */}
          <FadeIn delay={0.08}>
            <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 flex gap-3">
              <Info size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 leading-relaxed">
                This tool is based on the <strong>Mental Health First Aid (MHFA)</strong> manual. It is an
                educational self-reflection aid — not a clinical diagnosis. MHFAiders are trained to
                recognise early signs and provide initial support until professional help is obtained.
              </p>
            </div>
          </FadeIn>

          {/* What's assessed */}
          <FadeIn delay={0.12}>
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Three Sections · ~5 minutes
                </p>
              </div>
              <div className="divide-y divide-border">
                {[
                  { num: '1', label: 'Depression', sub: `${depressionQuestions.length} indicators · MHFA symptom clusters`, color: 'text-primary', bg: 'bg-primary/10' },
                  { num: '2', label: 'Anxiety', sub: `${anxietyQuestions.length} indicators · MHFA symptom clusters`, color: 'text-accent', bg: 'bg-accent/10' },
                  { num: '3', label: 'Stress & Burnout', sub: `${stressQuestions.length} indicators · Stress Container model`, color: 'text-warning', bg: 'bg-warning/10' },
                ].map(item => (
                  <div key={item.num} className="flex items-center gap-3 px-4 py-3">
                    <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-xs font-bold ${item.color}`}>{item.num}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border bg-muted/40">
                <p className="text-[11px] text-muted-foreground">
                  Your responses are stored locally on this device and never shared.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* ALGEE note */}
          <FadeIn delay={0.18}>
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex gap-3">
              <HeartPulse size={15} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Assessment follows the <strong className="text-foreground">ALGEE Action Plan</strong> framework.
                Results include MHFA-recommended next steps: encourage professional help (Action 4) and
                self-care supports (Action 5).
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.22}>
            <Button
              onClick={() => { setPhase('depression'); setQIndex(0); }}
              className="w-full rounded-xl py-6 gradient-calm border-none text-primary-foreground font-semibold"
            >
              Begin Assessment <ChevronRight size={17} className="ml-1" />
            </Button>
          </FadeIn>
        </div>
      </Layout>
    );
  }

  // ─────────────────── RESULTS ──────────────────────────────────────────────
  if (phase === 'results') {
    const riskConfig = {
      high: { bg: 'bg-destructive/8 border-destructive/20', icon: 'text-destructive', label: 'High', text: 'Your responses suggest notable symptoms across one or more domains. MHFA strongly advises speaking with your GP or a mental health professional (ALGEE Action 4).' },
      moderate: { bg: 'bg-warning/8 border-warning/20', icon: 'text-warning', label: 'Moderate', text: 'Some indicators are present. Consistent use of self-care strategies — exercise, mindfulness, connecting with others — can be beneficial (ALGEE Action 5).' },
      low: { bg: 'bg-success/8 border-success/20', icon: 'text-success', label: 'Low', text: 'Symptom levels appear low. Keep maintaining your wellbeing practices and retake this assessment periodically.' },
    };
    const rc = riskConfig[overallRisk];

    return (
      <Layout>
        <div className="px-5 pt-8 pb-6 space-y-5">
          <FadeIn>
            <div className="flex flex-col items-center text-center gap-2 mb-2">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-1"
              >
                <CheckCircle2 className="text-primary" size={28} />
              </motion.div>
              <h1 className="text-2xl font-serif text-foreground">Your Results</h1>
              <p className="text-xs text-muted-foreground">Based on the MHFA Wellbeing Questionnaire</p>
            </div>
          </FadeIn>

          {/* Score bars */}
          <FadeIn delay={0.08}>
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Indicator Summary</p>
              </div>
              <div className="px-4 py-4 space-y-4">
                {[
                  { label: 'Depression', pct: depPct, color: 'bg-primary' },
                  { label: 'Anxiety', pct: anxPct, color: 'bg-accent' },
                  { label: 'Stress & Burnout', pct: strPct, color: 'bg-warning' },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{row.label}</span>
                      <span className="text-xs text-muted-foreground">{row.pct}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${row.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${row.pct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Overall risk */}
          <FadeIn delay={0.14}>
            <div className={`rounded-xl border p-4 ${rc.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className={rc.icon} />
                <p className="text-sm font-semibold text-foreground">
                  Overall Indicator: <span className={rc.icon}>{rc.label}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{rc.text}</p>
            </div>
          </FadeIn>

          {/* ALGEE next steps */}
          <FadeIn delay={0.2}>
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  ALGEE Recommended Next Steps
                </p>
              </div>
              <div className="divide-y divide-border">
                <div className="flex gap-3 px-4 py-3">
                  <PhoneCall size={15} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Action 4 — Encourage Professional Help</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Speak to your GP or a registered mental health professional for a proper evaluation.</p>
                  </div>
                </div>
                <div className="flex gap-3 px-4 py-3">
                  <HeartPulse size={15} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Action 5 — Encourage Other Supports</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Exercise, mindfulness, social connection, journalling, or helplines/text support services.</p>
                  </div>
                </div>
                <div className="flex gap-3 px-4 py-3">
                  <Brain size={15} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Note on depression &amp; anxiety</p>
                    <p className="text-xs text-muted-foreground mt-0.5">MHFA notes that prolonged stress from one often leads to the other — early recognition is key.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.26}>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/calming')} className="flex-1 rounded-xl py-5 text-sm">
                Calming Tools
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1 rounded-xl py-5 gradient-calm border-none text-primary-foreground text-sm font-semibold">
                Back to Home
              </Button>
            </div>
          </FadeIn>
        </div>
      </Layout>
    );
  }

  // ─────────────────── QUESTION PHASE ──────────────────────────────────────
  const section = phase as Section;
  const meta = sectionMeta[section];
  const currentQ = currentQuestions[qIndex];

  return (
    <Layout>
      <div className="px-5 pt-8 pb-6 space-y-5">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground">{meta.label}</p>
            <p className="text-xs text-muted-foreground">{qIndex + 1} / {meta.total}</p>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${phase}-${qIndex}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {/* Question card */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                {currentQ.context}
              </p>
              <h2 className="text-base font-semibold text-foreground leading-snug">{currentQ.q}</h2>
            </div>

            {/* Response options */}
            <div className="space-y-2">
              {responseOptions.map(opt => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left px-5 py-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm font-medium text-foreground flex items-center justify-between group"
                >
                  {opt}
                  <ChevronRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Assessment;
