import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { useAppState } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Brain, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

// Perceived Stress Scale questions
const pssQuestions = [
  "How often have you been upset because of something unexpected?",
  "How often have you felt unable to control important things in your life?",
  "How often have you felt nervous and stressed?",
  "How often have you felt confident about handling personal problems?",
  "How often have you felt things were going your way?",
  "How often have you found you could not cope with all the things you had to do?",
  "How often have you been able to control irritations in your life?",
  "How often have you felt on top of things?",
  "How often have you been angered because of things outside your control?",
  "How often have you felt difficulties were piling up so high that you could not overcome them?",
];

const anxietyQuestions = [
  "Numbness or tingling",
  "Feeling hot",
  "Wobbliness in legs",
  "Unable to relax",
  "Fear of the worst happening",
  "Dizzy or lightheaded",
  "Heart pounding or racing",
  "Unsteady",
  "Terrified or afraid",
  "Nervous",
];

const options = ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'];
const anxietyOptions = ['Not at all', 'Mildly', 'Moderately', 'Severely'];

const Assessment = () => {
  const [phase, setPhase] = useState<'intro' | 'pss' | 'anxiety' | 'results'>('intro');
  const [pssIndex, setPssIndex] = useState(0);
  const [anxIndex, setAnxIndex] = useState(0);
  const [pssAnswers, setPssAnswers] = useState<number[]>([]);
  const [anxAnswers, setAnxAnswers] = useState<number[]>([]);
  const { addAssessment } = useAppState();
  const navigate = useNavigate();

  const answerPss = (val: number) => {
    const updated = [...pssAnswers, val];
    setPssAnswers(updated);
    if (pssIndex < pssQuestions.length - 1) {
      setPssIndex(i => i + 1);
    } else {
      setPhase('anxiety');
    }
  };

  const answerAnxiety = (val: number) => {
    const updated = [...anxAnswers, val];
    setAnxAnswers(updated);
    if (anxIndex < anxietyQuestions.length - 1) {
      setAnxIndex(i => i + 1);
    } else {
      // Calculate results
      // Reverse scoring for PSS items 4, 5, 7, 8 (0-indexed: 3, 4, 6, 7)
      const reversedPss = updated.length > 0 ? pssAnswers : [];
      let stressScore = 0;
      pssAnswers.forEach((a, i) => {
        if ([3, 4, 6, 7].includes(i)) {
          stressScore += (4 - a);
        } else {
          stressScore += a;
        }
      });
      const anxietyScore = updated.reduce((sum, a) => sum + a, 0);
      const burnoutRisk: 'low' | 'moderate' | 'high' =
        stressScore > 26 || anxietyScore > 25 ? 'high' :
        stressScore > 13 || anxietyScore > 15 ? 'moderate' : 'low';

      addAssessment({
        date: new Date().toISOString().split('T')[0],
        stressScore,
        anxietyScore,
        burnoutRisk,
      });
      setPhase('results');
    }
  };

  const latestStress = pssAnswers.reduce((sum, a, i) => {
    if ([3, 4, 6, 7].includes(i)) return sum + (4 - a);
    return sum + a;
  }, 0);
  const latestAnxiety = anxAnswers.reduce((sum, a) => sum + a, 0);
  const burnoutRisk = latestStress > 26 || latestAnxiety > 25 ? 'high' : latestStress > 13 || latestAnxiety > 15 ? 'moderate' : 'low';

  if (phase === 'intro') {
    return (
      <Layout>
        <div className="px-5 pt-8 space-y-6">
          <FadeIn>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Brain className="text-info" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-foreground">Mental First Aid</h1>
                <p className="text-sm text-muted-foreground">Quick emotional support & assessment</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
              <h3 className="font-semibold text-foreground">What we'll assess:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Perceived Stress Scale (PSS)</p>
                    <p className="text-xs text-muted-foreground">10 questions · ~3 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-accent">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Beck Anxiety Inventory</p>
                    <p className="text-xs text-muted-foreground">10 questions · ~3 minutes</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your responses are private and stored locally. These are screening tools, not diagnoses.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Button
              onClick={() => setPhase('pss')}
              className="w-full rounded-xl py-6 gradient-calm border-none text-primary-foreground"
            >
              Begin Assessment <ChevronRight size={18} className="ml-1" />
            </Button>
          </FadeIn>
        </div>
      </Layout>
    );
  }

  if (phase === 'results') {
    return (
      <Layout>
        <div className="px-5 pt-8 space-y-5">
          <FadeIn>
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
              >
                <CheckCircle className="text-primary" size={32} />
              </motion.div>
              <h1 className="text-2xl font-serif text-foreground">Your Results</h1>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 shadow-card text-center">
                <p className="text-3xl font-bold text-primary">{latestStress}</p>
                <p className="text-xs text-muted-foreground mt-1">Stress Score</p>
                <p className="text-[10px] text-muted-foreground">(out of 40)</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-card text-center">
                <p className="text-3xl font-bold text-info">{latestAnxiety}</p>
                <p className="text-xs text-muted-foreground mt-1">Anxiety Score</p>
                <p className="text-[10px] text-muted-foreground">(out of 30)</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className={`rounded-2xl p-4 shadow-card ${
              burnoutRisk === 'high' ? 'bg-destructive/10' :
              burnoutRisk === 'moderate' ? 'bg-warning/10' : 'bg-success/10'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className={
                  burnoutRisk === 'high' ? 'text-destructive' :
                  burnoutRisk === 'moderate' ? 'text-warning' : 'text-success'
                } />
                <p className="text-sm font-semibold text-foreground">
                  Burnout Risk: {burnoutRisk.charAt(0).toUpperCase() + burnoutRisk.slice(1)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {burnoutRisk === 'high'
                  ? "Your scores suggest elevated stress and anxiety. Consider speaking with a professional and using our calming tools regularly."
                  : burnoutRisk === 'moderate'
                  ? "Your stress levels are moderate. Regular use of calming techniques can help bring these down."
                  : "Your levels are within a healthy range. Keep up your wellness practices!"}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <h3 className="text-sm font-semibold text-foreground mb-2">Recommended actions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Try our box breathing exercise daily</li>
                <li>• Use the AI Coach for personalized support</li>
                <li>• Retake this assessment in 2 weeks</li>
                <li>• Practice micro-breaks between patients</li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/calming')} className="flex-1 rounded-xl py-5">
                Try Calming Tools
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1 rounded-xl py-5 gradient-calm border-none text-primary-foreground">
                Back to Home
              </Button>
            </div>
          </FadeIn>
        </div>
      </Layout>
    );
  }

  // Question phase
  const isPss = phase === 'pss';
  const currentQ = isPss ? pssQuestions[pssIndex] : anxietyQuestions[anxIndex];
  const currentOptions = isPss ? options : anxietyOptions;
  const currentIndex = isPss ? pssIndex : anxIndex;
  const totalQ = isPss ? pssQuestions.length : anxietyQuestions.length;
  const overallProgress = isPss
    ? (pssIndex / (pssQuestions.length + anxietyQuestions.length)) * 100
    : ((pssQuestions.length + anxIndex) / (pssQuestions.length + anxietyQuestions.length)) * 100;

  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">
              {isPss ? 'Perceived Stress Scale' : 'Beck Anxiety Inventory'}
            </p>
            <p className="text-xs text-muted-foreground">{currentIndex + 1}/{totalQ}</p>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${phase}-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <p className="text-sm text-muted-foreground mb-2">
                {isPss ? 'In the last month...' : 'In the past week, how much were you bothered by:'}
              </p>
              <h2 className="text-lg font-semibold text-foreground leading-snug">{currentQ}</h2>
            </div>

            <div className="space-y-2">
              {currentOptions.map((opt, i) => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => isPss ? answerPss(i) : answerAnxiety(i)}
                  className="w-full text-left px-5 py-4 rounded-xl bg-card shadow-card hover:bg-secondary transition-colors text-sm font-medium text-foreground"
                >
                  {opt}
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
