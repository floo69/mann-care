import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Brain, Wind, MessageCircle, Zap, Scale, Activity, HeartPulse, BookHeart } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { icon: Activity, label: 'Clinical Mode', desc: 'Dental procedure support', to: '/clinical', gradient: 'gradient-calm' },
  { icon: HeartPulse, label: 'Mental First Aid', desc: 'Immediate emotional support', to: '/assessment', gradient: 'gradient-warm' },
  { icon: Wind, label: 'Calming Tools', desc: 'Breathing & grounding', to: '/calming', gradient: 'gradient-mint' },
  { icon: MessageCircle, label: 'AI Coach', desc: 'Talk to your wellness coach', to: '/coach', gradient: 'gradient-calm' },
  { icon: Zap, label: 'Stress Relief', desc: 'Quick emergency calm', to: '/stress-relief', gradient: 'gradient-warm' },
  { icon: Scale, label: 'Work-Life Balance', desc: 'Boundaries & burnout', to: '/work-life', gradient: 'gradient-mint' },
  { icon: BookHeart, label: 'Resources', desc: 'Helplines & crisis support', to: '/resources', gradient: 'gradient-warm' },
];

const Explore = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        <FadeIn>
          <h1 className="text-2xl font-serif text-foreground">Explore</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover tools for your wellbeing</p>
        </FadeIn>

        <div className="space-y-3">
          {categories.map(({ icon: Icon, label, desc, to, gradient }, i) => (
            <FadeIn key={label} delay={i * 0.06}>
              <motion.button
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-4 bg-card rounded-2xl p-4 shadow-card text-left"
                whileTap={{ scale: 0.97 }}
              >
                <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-soft`}>
                  <Icon size={22} className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.button>
            </FadeIn>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
