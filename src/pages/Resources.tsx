import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Phone, MapPin, Shield, ExternalLink, Heart, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const helplines = [
  { name: 'National Suicide Prevention Lifeline', number: '988', desc: '24/7 free & confidential support', urgent: true },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'Text-based crisis support', urgent: true },
  { name: 'SAMHSA Helpline', number: '1-800-662-4357', desc: 'Substance abuse & mental health', urgent: false },
  { name: 'Doctor Support Line', number: '1-888-409-0141', desc: 'Free mental health support for physicians', urgent: false },
  { name: 'NAMI Helpline', number: '1-800-950-6264', desc: 'National Alliance on Mental Illness', urgent: false },
];

const crisisGuidance = [
  'Take slow, deep breaths — in for 4, hold for 4, out for 4.',
  'Remove yourself from the stressful environment if possible.',
  "Call a trusted friend, colleague, or family member.",
  'If you feel unsafe, call 988 or go to the nearest emergency room.',
  'Remember: asking for help is a sign of strength, not weakness.',
];

const Resources = () => {
  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        <FadeIn>
          <h1 className="text-2xl font-serif text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground mt-1">Support when you need it most</p>
        </FadeIn>

        {/* Crisis Banner */}
        <FadeIn delay={0.05}>
          <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-destructive" />
              <p className="text-sm font-semibold text-foreground">In immediate danger?</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              If you or someone else is in immediate danger, call emergency services (911) right away.
            </p>
            <motion.a
              href="tel:911"
              className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-sm font-semibold"
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={14} /> Call 911
            </motion.a>
          </div>
        </FadeIn>

        {/* Helplines */}
        <FadeIn delay={0.1}>
          <div className="space-y-3">
            <h2 className="text-base font-serif text-foreground">Mental Health Helplines</h2>
            {helplines.map(({ name, number, desc, urgent }, i) => (
              <motion.div
                key={name}
                className={`bg-card rounded-2xl p-4 shadow-card ${urgent ? 'ring-1 ring-accent/20' : ''}`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${urgent ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    <Phone size={18} className={urgent ? 'text-accent' : 'text-primary'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">{number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Crisis Guidance */}
        <FadeIn delay={0.15}>
          <div className="glass rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <h2 className="text-base font-serif text-foreground">Crisis Guidance</h2>
            </div>
            <div className="space-y-2.5">
              {crisisGuidance.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Nearby Support (Future Ready) */}
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-info" />
              <p className="text-sm font-semibold text-foreground">Nearby Support</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Location-based mental health centers and support groups coming soon. We're building this feature to connect you with local resources.
            </p>
          </div>
        </FadeIn>

        {/* Supportive message */}
        <FadeIn delay={0.25}>
          <div className="glass rounded-2xl p-5 text-center">
            <Heart size={24} className="text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">You are not alone</p>
            <p className="text-xs text-muted-foreground mt-1">
              Reaching out is a brave step. These resources are here for you anytime.
            </p>
          </div>
        </FadeIn>
      </div>
    </Layout>
  );
};

export default Resources;
