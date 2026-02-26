import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, AlertTriangle, CheckCircle, Heart, Wind, Smile, ArrowLeft, PartyPopper } from 'lucide-react';

const dentalProcedures = [
  'Principles of Suturing',
  'Restoration (Filling / Cement)',
  'Tooth Removal in a Child',
  'Injection Technique',
  'Complications of Dental Implants',
  'Jaw Relation',
  'Aesthetic Treatment of Front Teeth',
  'Swallowed File Management',
  'Avulsion / Front Tooth Fracture (Child)',
  'Hemisection',
];

// YouTube tutorial links per procedure (only those that have one)
const youtubeLinks: Record<string, string> = {
  'Principles of Suturing': 'https://youtu.be/NKjQiILT7uc?si=RRDundGVn8SgHquQ',
  'Restoration (Filling / Cement)': 'https://youtu.be/KuZImX8p4DQ?si=qj2D6RxzSmH43roe',
  'Injection Technique': 'https://youtu.be/Cr3A2hRt_wI?si=s0Q3T3WF61sxi-78',
  'Jaw Relation': 'https://youtu.be/Rc13YCwEhEs?si=atCyv8I-dzCo1eCk',
  'Aesthetic Treatment of Front Teeth': 'https://youtu.be/eNJJRt5KLcQ?si=uk5ov5_YChYc_nIJ',
};

// YouTube logo — red rounded rect + white play triangle
const YouTubeIcon = () => (
  <svg viewBox="0 0 20 14" className="w-5 h-3.5" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="14" rx="3" fill="#FF0000" />
    <path d="M8 4l5 3-5 3V4z" fill="white" />
  </svg>
);

const complications: Record<string, string[]> = {
  'Principles of Suturing': [
    'Wound dehiscence due to excessive tension on sutures',
    'Postoperative infection or suture abscess',
    'Tissue necrosis from over-tight knots',
    'Haematoma formation beneath the flap',
    'Accidental swallowing or aspiration of suture needle',
  ],
  'Restoration (Filling / Cement)': [
    'Post-operative thermal or occlusal sensitivity',
    'Secondary caries beneath the restoration',
    'Pulp irritation or exposure during cavity prep',
    'Restoration fracture or debonding',
    'Poor contact point — food impaction',
    'Colour mismatch with adjacent teeth',
  ],
  'Tooth Removal in a Child': [
    'Premature loss disrupting permanent eruption sequence',
    'Excessive bleeding or haematoma',
    'Root tip fracture with retained fragment',
    'Damage to permanent tooth germ below root apex',
    'Psychological distress and needle phobia',
  ],
  'Injection Technique': [
    'Intravascular injection — systemic local anaesthetic toxicity',
    'Failed / incomplete anaesthesia',
    'Haematoma at injection site',
    'Trismus following inferior alveolar nerve block',
    'Needle fracture (rare — high-gauge needles)',
    'Transient facial nerve paralysis (parotid infiltration)',
    'Vasovagal syncope',
  ],
  'Complications of Dental Implants': [
    'Osseointegration failure / implant mobility',
    'Peri-implantitis — infection around implant',
    'Inferior alveolar or mental nerve damage',
    'Sinus membrane perforation (posterior maxilla)',
    'Prosthetic screw loosening or fracture',
    'Crestal bone resorption',
    'Flap necrosis and wound dehiscence',
  ],
  'Jaw Relation': [
    'Incorrect vertical dimension of occlusion (VDO)',
    'Centric relation not coinciding with centric occlusion',
    'Face-bow transfer errors leading to articulator inaccuracy',
    'Temporomandibular pain post-prosthesis',
    'Phonetic problems due to incorrect OVD',
  ],
  'Aesthetic Treatment of Front Teeth': [
    'Colour relapse after bleaching',
    'Gingival irritation from bleaching agents',
    'Veneer or composite debonding / chipping',
    'Sensitivity following tooth preparation',
    'Shade mismatch between restoration and teeth',
    'Over-reduction leading to pulp exposure',
  ],
  'Swallowed File Management': [
    'File aspirated into respiratory tract — respiratory emergency',
    'Delayed diagnosis if not immediately noticed',
    'GI perforation risk if file passes sharp end-on',
    'Medico-legal consequences if not documented properly',
    'Patient anxiety and loss of trust',
  ],
  'Avulsion / Front Tooth Fracture (Child)': [
    'Pulp necrosis if not managed within golden hour',
    'Root resorption — inflammatory or replacement type',
    'Ankylosis of replanted permanent tooth',
    'Damage to developing permanent successor (primary avulsion)',
    'Psychological distress in child and parent',
    'Crown-root fracture requiring extraction',
  ],
  'Hemisection': [
    'Fracture of remaining root during sectioning',
    'Periodontal compromise of retained root',
    'Endodontic failure in treated root',
    'Bone loss progression at furcation',
    'Crown or bridge failure on hemisected unit',
  ],
  default: ['Bleeding or haemorrhage', 'Infection at the site', 'Adverse reaction to anaesthesia', 'Nerve damage', 'Patient anxiety or distress'],
};

const solutions: Record<string, string[]> = {
  'Principles of Suturing': [
    'Approximate tissue — do not strangulate; use interrupted sutures intraorally',
    'Use resorbable sutures (Vicryl / plain gut) intraorally; non-resorbable (silk) for skin',
    'Count and account for all needles before and after closure',
    'Irrigate wound and ensure haemostasis before final closure',
    'For dehiscence: debride, irrigate and resuture if edges viable',
    'Remove sutures at 5–7 days; earlier if tension is high',
  ],
  'Restoration (Filling / Cement)': [
    'Remove all caries with explorer + caries detector dye before placement',
    'Place GIC base or calcium hydroxide liner over deep cavities',
    'Use matrix band system for accurate contact point and contour',
    'Check and adjust occlusion with articulating paper immediately after set',
    'For sensitivity: desensitising agent for mild; root canal evaluation if severe',
    'Match shade under natural light on a moist tooth before isolation',
  ],
  'Tooth Removal in a Child': [
    'Use topical anaesthetic before injection; warm the solution; inject very slowly',
    'Apply Tell-Show-Do technique; use child-friendly language throughout',
    'Apply firm gauze pressure post-extraction; observe for 15 minutes',
    'If root tip retained near germ — leave in situ, monitor radiographically',
    'Fit space maintainer promptly if primary molar lost prematurely',
    'Refer for phobia management if distress is significant',
  ],
  'Injection Technique': [
    'Always aspirate before injecting; inject at 1 mL/min to avoid intravascular deposit',
    'Confirm landmarks: palpate coronoid notch for IANB; inject slightly above occlusal plane',
    'For failed block: wait 7–10 min; supplement with intraligamentary or Gow-Gates technique',
    'For haematoma: immediate pressure, cold pack, reassure; review in 48 hours',
    'For syncope: recline fully, elevate legs, monitor vitals; do not leave patient unattended',
    'Never use a bent needle; use fresh needle for each separate block',
  ],
  'Complications of Dental Implants': [
    'Peri-implantitis: mechanical debridement + antiseptic irrigation; systemic antibiotics if acute',
    'Nerve damage: CBCT pre-op to map IAN; remove/reposition implant if impinging',
    'Sinus perforation: small tears heal spontaneously; large tears need Schneiderian membrane repair',
    'Implant failure: remove, graft, allow 3–6 months healing then replant',
    'Screw loosening: retighten to manufacturer torque; check and correct occlusion',
    'Bone resorption: optimise loading & hygiene; surgical correction if structural',
  ],
  'Jaw Relation': [
    'Re-establish VDO using phonetic test (closest speaking space = 2–4 mm) and Willis gauge',
    'Confirm centric relation with Dawson bimanual manipulation technique',
    'Use semi-adjustable articulator with accurate face-bow transfer for complex cases',
    'For TMD post-prosthesis: fit occlusal splint; remount and adjust at 1-week review',
    'Always complete wax try-in before final prosthesis delivery for patient approval',
  ],
  'Aesthetic Treatment of Front Teeth': [
    'Bleaching: 10–16% carbamide peroxide in custom tray, nightguard technique; fluoride for sensitivity',
    'Composite bonding: 30-sec etch, bonding agent, incremental layering for translucency',
    'Veneers: minimal prep 0.3–0.5 mm; temporise with Protemp; verify shade with trial paste',
    'Shade selection: assess in natural light, on moist tooth, before rubber dam isolation',
    'Polish with sequential Sof-Lex discs for optimal surface finish and lustre',
    'For pulp exposure risk during prep: use rubber dam, gentle burs, liner before restoration',
  ],
  'Swallowed File Management': [
    'IMMEDIATE: chest + abdominal X-ray to locate the file — do not wait',
    'If in airway (trachea / bronchus): emergency ENT referral for bronchoscopy — do NOT delay',
    'If in oesophagus: urgent endoscopy for retrieval within hours',
    'If in stomach (asymptomatic): conservative monitoring; serial X-rays every 24–48 hours; check stools',
    'Document everything: time of incident, file specs, steps taken — critical medico-legally',
    'Prevention: rubber dam always; tie floss to file; count instruments before and after use',
  ],
  'Avulsion / Front Tooth Fracture (Child)': [
    'Primary tooth avulsion: do NOT replant — risk to permanent successor; fit space maintainer',
    'Permanent tooth avulsion: replant within 30 min; store in milk or Hanks Balanced Salt Solution',
    'Replantation: gently rinse root with saline; never scrape; splint with flexible splint 7–14 days',
    'RCT within 2 weeks for mature apex; apexification/apexogenesis for immature open apex',
    'Crown fracture with pulp exposure: partial pulpotomy with MTA to preserve pulp vitality',
    'Follow-up radiographically at 1, 3, 6 months to detect root resorption early',
  ],
  'Hemisection': [
    'Complete endodontic treatment of all retained roots before surgery',
    'Use surgical bur to section vertically through furcation without damaging retained root',
    'Raise full-thickness flap; remove affected root cleanly; smooth any sharp bony projections',
    'Osseous recontouring to create adequate embrasure for interproximal hygiene access',
    'Final restoration: individual crown or splinted bridge after 3 months of confirmed healing',
    'Educate patient on meticulous interdental cleaning — essential for long-term success',
  ],
  default: ['Apply direct pressure and assess haemostasis', 'Follow strict sterile technique', 'Monitor vitals continuously', 'Use anatomical landmarks carefully', 'Communicate clearly with the patient'],
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
        {filteredProcedures.map(proc => {
          const ytLink = youtubeLinks[proc];
          return (
            <motion.button
              key={proc}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedProcedure(proc); setStep(1); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-card border border-border shadow-card hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground flex items-center justify-between group"
            >
              <span className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-base flex-shrink-0">🦷</span>
                <span className="truncate">{proc}</span>
              </span>
              <span className="flex items-center gap-2 flex-shrink-0 ml-2">
                {ytLink && (
                  <span
                    role="button"
                    title="Watch tutorial on YouTube"
                    onClick={e => { e.stopPropagation(); window.open(ytLink, '_blank', 'noopener,noreferrer'); }}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                  >
                    <YouTubeIcon />
                  </span>
                )}
                <ChevronRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </span>
            </motion.button>
          );
        })}
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
