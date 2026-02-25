import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, AlertTriangle, CheckCircle, Heart, Wind, Smile, ArrowLeft, PartyPopper } from 'lucide-react';

const dentalProcedures = [
  'Root Canal',
  'Tooth Extraction',
  'Dental Implant',
  'Scaling & Polishing',
  'Crown Placement',
  'Wisdom Tooth Removal',
  'Filling Restoration',
];

const complications: Record<string, string[]> = {
  'Root Canal': ['Instrument separation', 'Perforation of the root', 'Incomplete cleaning of canals', 'Post-operative pain', 'Sodium hypochlorite accident'],
  'Tooth Extraction': ['Dry socket (alveolar osteitis)', 'Root tip fracture', 'Excessive bleeding', 'Nerve damage (inferior alveolar)', 'Sinus communication'],
  'Dental Implant': ['Implant failure / non-integration', 'Peri-implantitis', 'Nerve injury', 'Sinus perforation', 'Prosthetic complications'],
  'Scaling & Polishing': ['Gingival sensitivity', 'Tooth sensitivity post-procedure', 'Minor bleeding', 'Enamel damage from over-polishing'],
  'Crown Placement': ['Crown decementation', 'Marginal discrepancy', 'Pulp irritation', 'Aesthetic mismatch', 'Occlusal interference'],
  'Wisdom Tooth Removal': ['Dry socket', 'Inferior alveolar nerve paresthesia', 'Lingual nerve damage', 'Jaw stiffness (trismus)', 'Infection'],
  'Filling Restoration': ['Post-operative sensitivity', 'Secondary caries', 'Filling fracture', 'Pulp exposure', 'Improper contact point'],
  default: ['Bleeding or hemorrhage', 'Infection at the site', 'Adverse reaction to anesthesia', 'Nerve damage', 'Patient anxiety or distress'],
};

const solutions: Record<string, string[]> = {
  'Root Canal': ['Use apex locator & radiographs for working length', 'Seal perforation with MTA immediately', 'Ensure thorough irrigation with NaOCl and EDTA', 'Prescribe analgesics; reassure patient', 'Aspirate immediately; irrigate with saline'],
  'Tooth Extraction': ['Place socket dressing with clove oil/alvogyl', 'Use root tip elevators carefully; consider surgical approach', 'Apply gauze pressure; use hemostatic agents', 'Warn patient pre-op; use nerve block carefully', 'Close with buccal flap; prescribe antibiotics & decongestants'],
  'Dental Implant': ['Ensure primary stability; consider bone grafting', 'Maintain oral hygiene; debride peri-implant area', 'Map nerve position with CBCT pre-operatively', 'Use short implants or sinus lift procedure', 'Verify impression accuracy; adjust prosthesis'],
  'Scaling & Polishing': ['Use gentle strokes; apply desensitizing agent', 'Recommend sensitivity toothpaste for 2 weeks', 'Apply pressure with gauze; use hemostatic agent', 'Use rubber cup at low speed; avoid over-polishing'],
  'Crown Placement': ['Re-cement with appropriate luting agent', 'Adjust margins; remake if necessary', 'Use desensitizing liner; monitor symptoms', 'Communicate shade requirements with lab', 'Adjust occlusion with articulating paper'],
  'Wisdom Tooth Removal': ['Pack socket; prescribe chlorhexidine rinse', 'Inform patient; monitor recovery over 6-8 weeks', 'Minimize lingual flap retraction', 'Prescribe muscle relaxants; warm compresses', 'Prescribe antibiotics; ensure wound irrigation'],
  'Filling Restoration': ['Apply desensitizing agent; check occlusion', 'Ensure complete caries removal before filling', 'Use flowable composite for small repairs', 'Apply calcium hydroxide liner; consider root canal', 'Use matrix band system for proper contour'],
  default: ['Apply direct pressure and assess hemostasis protocols', 'Follow sterile technique strictly', 'Monitor vitals continuously', 'Use anatomical landmarks carefully', 'Communicate clearly with the patient'],
};

const ClinicalMode = () => {
  const [step, setStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [feedbackMood, setFeedbackMood] = useState<number | null>(null);
  const navigate = useNavigate();

  const filteredProcedures = dentalProcedures.filter(p =>
    p.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const steps = [
    // Step 0: Procedure Selection
    <div key="select" className="space-y-4">
      <h1 className="text-2xl font-serif text-foreground">What dental procedure are you about to perform?</h1>
      <p className="text-sm text-muted-foreground">Select your procedure below</p>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search dental procedures..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-1.5">
        {filteredProcedures.map(proc => (
          <motion.button
            key={proc}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedProcedure(proc); setStep(1); }}
            className="w-full text-left px-4 py-3 rounded-xl bg-card shadow-card hover:shadow-soft hover:translate-y-[-1px] transition-all duration-300 text-sm font-medium text-foreground flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🦷</span>
              {proc}
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>,

    // Step 1: Complications
    <div key="complications" className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="text-warning" size={20} />
        <h1 className="text-2xl font-serif text-foreground">Common Complications</h1>
      </div>
      <p className="text-sm text-muted-foreground">For: <span className="font-medium text-foreground">{selectedProcedure}</span></p>
      <div className="space-y-2">
        {(complications[selectedProcedure] || complications.default).map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-4 shadow-card hover:shadow-soft transition-shadow duration-300 flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-warning">{i + 1}</span>
            </div>
            <p className="text-sm text-foreground">{c}</p>
          </motion.div>
        ))}
      </div>
    </div>,

    // Step 2: Solutions
    <div key="solutions" className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle className="text-success" size={20} />
        <h1 className="text-2xl font-serif text-foreground">Quick Solutions</h1>
      </div>
      <div className="space-y-2">
        {(solutions[selectedProcedure] || solutions.default).map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-4 shadow-card hover:shadow-soft transition-shadow duration-300 flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle size={14} className="text-success" />
            </div>
            <p className="text-sm text-foreground">{s}</p>
          </motion.div>
        ))}
      </div>
    </div>,

    // Step 3: Reassurance
    <div key="reassurance" className="flex flex-col items-center text-center space-y-6 py-8">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <Heart className="text-primary" size={40} />
      </motion.div>
      <div className="space-y-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-xl font-serif text-foreground">You've done this before.</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xl font-serif text-foreground">You are trained and capable.</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="text-2xl font-serif text-primary font-bold">You've got this. 💚</motion.p>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="text-sm text-muted-foreground">Take a moment. Breathe. Then proceed with confidence.</motion.p>
    </div>,

    // Step 4: Calming Tools Suggestion
    <div key="calming" className="space-y-4">
      <div className="text-center mb-4">
        <Wind className="text-primary mx-auto mb-3" size={32} />
        <h1 className="text-2xl font-serif text-foreground">Try a calming tool</h1>
        <p className="text-sm text-muted-foreground mt-1">We suggest using one before you begin</p>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Box Breathing', desc: 'Animated 4-4-4-4 breathing cycle', emoji: '🫁' },
          { label: '5-Minute Meditation', desc: 'Quick guided mindfulness session', emoji: '🧘' },
          { label: 'Guided Audio', desc: 'Calming nature sounds & voice', emoji: '🎧' },
          { label: 'Fidget Tool', desc: 'Interactive stress relief', emoji: '🔮' },
        ].map((tool, i) => (
          <motion.button
            key={tool.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate('/calming')}
            className="w-full text-left px-4 py-4 rounded-xl bg-card shadow-card hover:shadow-soft hover:translate-y-[-1px] transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-2xl">{tool.emoji}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{tool.label}</p>
              <p className="text-xs text-muted-foreground">{tool.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>,

    // Step 5: Feedback
    <div key="feedback" className="flex flex-col items-center text-center space-y-6 py-4">
      {feedbackMood !== null ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <PartyPopper className="text-accent mx-auto" size={56} />
          <h1 className="text-2xl font-serif text-foreground mt-4">Great job!</h1>
          <p className="text-sm text-muted-foreground mt-2">You're taking care of yourself, and that makes you a better clinician.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/progress')} className="rounded-xl">View Progress</Button>
            <Button onClick={() => navigate('/')} className="rounded-xl gradient-calm border-none text-primary-foreground">Back to Home</Button>
          </div>
        </motion.div>
      ) : (
        <>
          <Smile className="text-primary" size={40} />
          <h1 className="text-2xl font-serif text-foreground">How do you feel now?</h1>
          <p className="text-sm text-muted-foreground">Quick check before you proceed</p>
          <div className="flex gap-3">
            {['😟', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFeedbackMood(i + 1)}
                className="w-14 h-14 rounded-xl bg-card shadow-card flex items-center justify-center text-2xl hover:bg-secondary transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>,
  ];

  return (
    <Layout>
      <div className="px-5 pt-6 page-gradient-clinical min-h-[calc(100vh-5rem)]">
        {/* Progress & Back */}
        <div className="flex items-center justify-between mb-4">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}
          <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {/* Next button (not on last step or procedure selection) */}
        {step > 0 && step < steps.length - 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
            <Button onClick={() => setStep(s => s + 1)} className="w-full rounded-xl py-5 gradient-calm border-none text-primary-foreground">
              Continue <ChevronRight size={18} className="ml-1" />
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default ClinicalMode;
