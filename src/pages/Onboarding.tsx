import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/context/AppContext';
import { ChevronRight, ChevronLeft, CheckCircle2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = ['Doctor', 'Dentist', 'Nurse', 'Medical Student', 'Paramedic', 'Therapist', 'Other'];
const specializations = ['General Practice', 'Surgery', 'Emergency Medicine', 'Pediatrics', 'Cardiology', 'Oncology', 'Psychiatry', 'Dental Surgery', 'Other'];
const triggers = ['Long shifts', 'Patient outcomes', 'Administrative burden', 'Work-life balance', 'Difficult procedures', 'Interpersonal conflict', 'Time pressure', 'Emotional cases'];
const calmingOptions = ['Breathing exercises', 'Meditation', 'Audio relaxation', 'Physical activity', 'Journaling', 'Mindfulness', 'Music', 'Nature sounds'];

const chipClass = (active: boolean) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
    active
      ? 'bg-primary text-primary-foreground border-primary shadow-card'
      : 'bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
  }`;

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [spec, setSpec] = useState('');
  const [years, setYears] = useState(0);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedCalming, setSelectedCalming] = useState<string[]>([]);
  const { setProfile } = useAppState();
  const navigate = useNavigate();

  const toggle = (item: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const finish = () => {
    setProfile({
      name,
      role,
      specialization: spec,
      yearsExperience: years,
      stressTriggers: selectedTriggers,
      calmingMethods: selectedCalming,
      onboarded: true,
    });
    navigate('/');
  };

  const steps = [
    // 0: Welcome
    <div key="welcome" className="flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 rounded-xl gradient-calm flex items-center justify-center shadow-elevated">
        <Activity className="text-primary-foreground" size={30} />
      </div>
      <div>
        <h1 className="text-3xl font-serif text-foreground">Welcome to Mann Care</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          A structured wellness platform built specifically for healthcare professionals.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">Let's personalise your experience in a few quick steps.</p>
    </div>,

    // 1: Name & Role
    <div key="role" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Tell us about yourself</h2>
        <p className="text-sm text-muted-foreground mt-1">This helps us tailor your experience.</p>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 block">Your Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Dr. Sarah..."
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 block">Your Role</label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map(r => (
            <button key={r} onClick={() => setRole(r)} className={chipClass(role === r)}>{r}</button>
          ))}
        </div>
      </div>
    </div>,

    // 2: Spec & Years
    <div key="spec" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Your experience</h2>
        <p className="text-sm text-muted-foreground mt-1">Helps us surface the most relevant content.</p>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 block">Specialization</label>
        <div className="grid grid-cols-2 gap-2">
          {specializations.map(s => (
            <button key={s} onClick={() => setSpec(s)} className={chipClass(spec === s)}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 block">
          Years of Experience: <span className="text-primary font-bold">{years}</span>
        </label>
        <input
          type="range" min={0} max={40} value={years}
          onChange={e => setYears(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>,

    // 3: Triggers
    <div key="triggers" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Primary stressors</h2>
        <p className="text-sm text-muted-foreground mt-1">Select all that apply to your practice.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {triggers.map(t => (
          <button key={t} onClick={() => toggle(t, selectedTriggers, setSelectedTriggers)} className={chipClass(selectedTriggers.includes(t))}>
            {t}
          </button>
        ))}
      </div>
    </div>,

    // 4: Calming
    <div key="calming" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Recovery preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">We'll tailor recommendations to your style.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {calmingOptions.map(c => (
          <button key={c} onClick={() => toggle(c, selectedCalming, setSelectedCalming)} className={chipClass(selectedCalming.includes(c))}>
            {c}
          </button>
        ))}
      </div>
    </div>,

    // 5: Ready
    <div key="ready" className="flex flex-col items-center text-center gap-5">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center"
      >
        <CheckCircle2 className="text-success" size={32} />
      </motion.div>
      <div>
        <h1 className="text-3xl font-serif text-foreground">You're all set</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Your personalised wellness dashboard is ready. We're here to support your wellbeing.
        </p>
      </div>
    </div>,
  ];

  const totalSteps = steps.length;
  const canNext =
    step === 0 ||
    step === totalSteps - 1 ||
    (step === 1 && !!name && !!role) ||
    (step === 2 && !!spec) ||
    (step === 3 && selectedTriggers.length > 0) ||
    (step === 4 && selectedCalming.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            className="flex-1 rounded-lg py-5 border-border text-foreground"
          >
            <ChevronLeft size={17} className="mr-1" /> Back
          </Button>
        )}
        <Button
          onClick={() => (step === totalSteps - 1 ? finish() : setStep(s => s + 1))}
          disabled={!canNext}
          className="flex-1 rounded-lg py-5 gradient-calm border-none text-primary-foreground font-semibold"
        >
          {step === totalSteps - 1 ? "Let's begin" : 'Continue'} <ChevronRight size={17} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
