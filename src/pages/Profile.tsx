import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { useAppState } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { User, Shield, Palette, Bell, LogOut, Trash2, ChevronRight, Sparkles, Activity, Heart, Moon, Sun, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const themes = [
  { id: 'lavender', label: 'Lavender Calm', primary: '260 50% 65%', accent: '340 50% 75%', preview: 'bg-[hsl(260,50%,65%)]' },
  { id: 'mint', label: 'Soft Mint', primary: '158 45% 50%', accent: '180 35% 60%', preview: 'bg-[hsl(158,45%,50%)]' },
  { id: 'peach', label: 'Peach Serenity', primary: '20 60% 65%', accent: '340 45% 70%', preview: 'bg-[hsl(20,60%,65%)]' },
  { id: 'blue', label: 'Baby Blue Focus', primary: '210 55% 60%', accent: '230 45% 70%', preview: 'bg-[hsl(210,55%,60%)]' },
  { id: 'blush', label: 'Blush Balance', primary: '340 50% 70%', accent: '20 50% 75%', preview: 'bg-[hsl(340,50%,70%)]' },
];

const Profile = () => {
  const { profile, auth, logout, assessments } = useAppState();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('manncare-theme') || 'lavender');
  const [showThemes, setShowThemes] = useState(false);

  const lastAssessment = assessments[assessments.length - 1];
  const burnoutRisk = lastAssessment?.burnoutRisk || 'low';
  const stressScore = lastAssessment?.stressScore || 0;

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast({ title: 'Signed out', description: 'See you soon 💚' });
  };

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--ring', theme.primary);
    setActiveTheme(themeId);
    localStorage.setItem('manncare-theme', themeId);
    toast({ title: `Theme changed`, description: `${theme.label} applied ✨` });
  };

  const riskColor = burnoutRisk === 'low' ? 'text-success' : burnoutRisk === 'moderate' ? 'text-warning' : 'text-destructive';

  return (
    <Layout>
      <div className="px-5 pt-8 space-y-6">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="w-20 h-20 rounded-3xl gradient-calm flex items-center justify-center shadow-elevated mb-3"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl text-primary-foreground font-bold">
                {(profile.name || auth.email || 'U')[0].toUpperCase()}
              </span>
            </motion.div>
            <h1 className="text-xl font-serif text-foreground">{profile.name || 'User'}</h1>
            <p className="text-xs text-muted-foreground">
              {profile.role}{profile.specialization ? ` · ${profile.specialization}` : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{auth.email}</p>
          </div>
        </FadeIn>

        {/* Status Card */}
        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-primary" />
              <p className="text-xs font-semibold text-primary">Quick Status</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <Activity size={18} className="mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold text-foreground">{stressScore}</p>
                <p className="text-[10px] text-muted-foreground">Stress</p>
              </div>
              <div>
                <Heart size={18} className={`mx-auto mb-1 ${riskColor}`} />
                <p className={`text-sm font-bold capitalize ${riskColor}`}>{burnoutRisk}</p>
                <p className="text-[10px] text-muted-foreground">Burnout</p>
              </div>
              <div>
                <span className="text-lg">💚</span>
                <p className="text-lg font-bold text-foreground">72</p>
                <p className="text-[10px] text-muted-foreground">Balance</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Preferences */}
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <p className="text-xs font-semibold text-muted-foreground px-5 pt-4 pb-2">Preferences</p>
            <button
              onClick={toggleDark}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                <span className="text-sm text-foreground">{darkMode ? 'Dark mode' : 'Light mode'}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => setShowThemes(!showThemes)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Palette size={18} className="text-primary" />
                <span className="text-sm text-foreground">Theme</span>
              </div>
              <span className="text-xs text-muted-foreground">{themes.find(t => t.id === activeTheme)?.label}</span>
            </button>
            
            {/* Theme Picker */}
            {showThemes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-4 space-y-2"
              >
                {themes.map(theme => (
                  <motion.button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeTheme === theme.id ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-secondary/50'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${theme.preview}`} />
                    <span className="text-sm text-foreground flex-1 text-left">{theme.label}</span>
                    {activeTheme === theme.id && <Check size={16} className="text-primary" />}
                  </motion.button>
                ))}
              </motion.div>
            )}

            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <span className="text-sm text-foreground">Notifications</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          </div>
        </FadeIn>

        {/* Account */}
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <p className="text-xs font-semibold text-muted-foreground px-5 pt-4 pb-2">Account & Security</p>
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-primary" />
                <span className="text-sm text-foreground">Change password</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className="text-destructive" />
                <span className="text-sm text-destructive">Sign out</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-destructive" />
                <span className="text-sm text-destructive">Delete account</span>
              </div>
            </button>
          </div>
        </FadeIn>
      </div>
    </Layout>
  );
};

export default Profile;
