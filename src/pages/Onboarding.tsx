import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/context/AppContext';
import { ChevronRight, ChevronLeft, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = ['Doctor', 'Dentist', 'Nurse', 'Medical Student', 'Paramedic', 'Therapist', 'Other'];
const specializations = ['General Practice', 'Surgery', 'Emergency Medicine', 'Pediatrics', 'Cardiology', 'Oncology', 'Psychiatry', 'Dental Surgery', 'Other'];
const triggers = ['Long shifts', 'Patient outcomes', 'Administrative burden', 'Work-life balance', 'Difficult procedures', 'Interpersonal conflict', 'Time pressure', 'Emotional cases'];
const calmingOptions = ['Breathing exercises', 'Meditation', 'Audio relaxation', 'Physical activity', 'Journaling', 'Mindfulness', 'Music', 'Nature sounds'];

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

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void) => {
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
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center text-center gap-6">
      <motion.div
        className="w-24 h-24 rounded-full gradient-calm flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Heart className="text-primary-foreground" size={40} />
      </motion.div>
      <h1 className="text-3xl font-serif text-foreground">Welcome to Mann Care</h1>
      <p className="text-muted-foreground leading-relaxed">
        Your personal mental wellness companion, designed for healthcare professionals like you.
      </p>
      <p className="text-sm text-muted-foreground">Let's personalize your experience in just a few steps.</p>
    </div>,
    // Step 1: Name & Role
    <div key="role" className="flex flex-col gap-5">
      <h2 className="text-2xl font-serif text-foreground">Tell us about yourself</h2>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Your name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Dr. Sarah..."
          className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Your role</label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                role === r ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>,
    // Step 2: Specialization & Years
    <div key="spec" className="flex flex-col gap-5">
      <h2 className="text-2xl font-serif text-foreground">Your experience</h2>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Specialization</label>
        <div className="grid grid-cols-2 gap-2">
          {specializations.map(s => (
            <button
              key={s}
              onClick={() => setSpec(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                spec === s ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Years of experience: {years}</label>
        <input
          type="range"
          min={0}
          max={40}
          value={years}
          onChange={e => setYears(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>,
    // Step 3: Triggers
    <div key="triggers" className="flex flex-col gap-5">
      <h2 className="text-2xl font-serif text-foreground">What stresses you most?</h2>
      <p className="text-sm text-muted-foreground">Select all that apply</p>
      <div className="flex flex-wrap gap-2">
        {triggers.map(t => (
          <button
            key={t}
            onClick={() => toggleItem(t, selectedTriggers, setSelectedTriggers)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedTriggers.includes(t) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>,
    // Step 4: Calming methods
    <div key="calming" className="flex flex-col gap-5">
      <h2 className="text-2xl font-serif text-foreground">How do you prefer to unwind?</h2>
      <p className="text-sm text-muted-foreground">We'll tailor recommendations for you</p>
      <div className="flex flex-wrap gap-2">
        {calmingOptions.map(c => (
          <button
            key={c}
            onClick={() => toggleItem(c, selectedCalming, setSelectedCalming)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCalming.includes(c) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>,
    // Step 5: Ready
    <div key="ready" className="flex flex-col items-center text-center gap-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Sparkles className="text-accent" size={56} />
      </motion.div>
      <h1 className="text-3xl font-serif text-foreground">You're all set!</h1>
      <p className="text-muted-foreground leading-relaxed">
        Your personalized wellness experience is ready. We're here for you every step of the way.
      </p>
    </div>,
  ];

  const totalSteps = steps.length;
  const canNext = step === 0 || step === totalSteps - 1 ||
    (step === 1 && name && role) ||
    (step === 2 && spec) ||
    (step === 3 && selectedTriggers.length > 0) ||
    (step === 4 && selectedCalming.length > 0);

  return (
    <div className="min-h-screen page-gradient flex flex-col px-6 py-8">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
            className="flex-1 rounded-xl py-6"
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </Button>
        )}
        <Button
          onClick={() => step === totalSteps - 1 ? finish() : setStep(s => s + 1)}
          disabled={!canNext}
          className="flex-1 rounded-xl py-6 gradient-calm border-none text-primary-foreground"
        >
          {step === totalSteps - 1 ? "Let's begin" : 'Continue'} <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
