import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Phone, ExternalLink, Heart, Wind, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Resources = () => {
  return (
    <Layout>
      <div className="px-5 pt-8 pb-28 space-y-5">

        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Heart className="text-primary" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-foreground">Resources</h1>
              <p className="text-xs text-muted-foreground">Support when you need it most</p>
            </div>
          </div>
        </FadeIn>

        {/* Emergency banner */}
        <FadeIn delay={0.05}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent border border-destructive/25 p-5">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-destructive/10 -translate-y-6 translate-x-6" />
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-destructive" />
              <p className="text-sm font-semibold text-foreground">Crisis Helpline — India</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              If you're experiencing thoughts of suicide or self-harm, please reach out immediately. You are not alone. Help is available 24/7.
            </p>
            <motion.a
              href="tel:9152987821"
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 bg-destructive text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg"
            >
              <Phone size={16} />
              iCall — 9152987821
            </motion.a>
            <p className="text-[10px] text-muted-foreground mt-3">iCall · Tata Institute of Social Sciences · Confidential &amp; Free</p>
          </div>
        </FadeIn>

        {/* Meditation & Relaxation */}
        <FadeIn delay={0.1}>
          <div className="relative overflow-hidden bg-card rounded-2xl shadow-card p-5">
            {/* Decorative orb */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -translate-y-10 translate-x-10" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl gradient-calm flex items-center justify-center shadow-soft">
                <Wind className="text-primary-foreground" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Meditation &amp; Relaxation</p>
                <p className="text-xs text-muted-foreground">Guided session to calm your mind</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              A curated guided meditation session designed to help healthcare professionals decompress, reset, and restore inner peace. Take just 10 minutes for yourself.
            </p>

            <motion.a
              href="https://share.google/y2oj5ZRgFg0mteDGW"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between w-full bg-primary/8 hover:bg-primary/12 border border-primary/20 rounded-xl px-4 py-3.5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧘</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Open Meditation Session</p>
                  <p className="text-[10px] text-muted-foreground">Tap to open · Opens in browser</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-primary flex-shrink-0" />
            </motion.a>
          </div>
        </FadeIn>

        {/* Quick steps card */}
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-2xl shadow-card p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">If you're struggling right now</p>
            {[
              { emoji: '🫁', text: 'Breathe slowly — 4 counts in, hold 4, out 4' },
              { emoji: '🚶', text: 'Step away from the stressful environment' },
              { emoji: '📞', text: 'Call iCall: 9152987821 (free & confidential)' },
              { emoji: '💬', text: 'Talk to a trusted colleague or friend' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{item.emoji}</span>
                <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Affirming footer card */}
        <FadeIn delay={0.2}>
          <div className="rounded-2xl gradient-calm p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 w-16 h-16 rounded-full bg-white" />
              <div className="absolute bottom-2 right-4 w-10 h-10 rounded-full bg-white" />
            </div>
            <Heart size={28} className="text-primary-foreground mx-auto mb-2 opacity-90" />
            <p className="text-base font-serif text-primary-foreground font-semibold">You are not alone.</p>
            <p className="text-xs text-primary-foreground/80 mt-1 leading-relaxed max-w-xs mx-auto">
              Reaching out is the bravest thing you can do. These resources exist for you, always.
            </p>
          </div>
        </FadeIn>

      </div>
    </Layout>
  );
};

export default Resources;
