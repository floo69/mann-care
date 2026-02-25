import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/context/AppContext';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type AuthMode = 'signin' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, profile } = useAppState();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      toast({ title: 'Reset link sent', description: `Check ${email} for password reset instructions.` });
      setMode('signin');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({ title: 'Passwords don\'t match', variant: 'destructive' });
      return;
    }

    if (!email || !password) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    login(email);
    toast({ title: mode === 'signup' ? 'Account created!' : 'Welcome back!', description: 'Redirecting...' });
    
    if (profile.onboarded) {
      navigate('/');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen page-gradient flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            className="w-20 h-20 rounded-3xl gradient-calm flex items-center justify-center shadow-elevated mb-4"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart className="text-primary-foreground" size={34} />
          </motion.div>
          <h1 className="text-3xl font-serif text-foreground">Mann Care</h1>
          <p className="text-sm text-muted-foreground mt-1">Your calm companion</p>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-serif text-foreground text-center">
                {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
              </h2>

              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
                />
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}

              {/* Confirm password */}
              {mode === 'signup' && (
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
                  />
                </div>
              )}

              {/* Forgot password link */}
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl py-6 gradient-calm border-none text-primary-foreground font-medium"
              >
                {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>

        {/* Toggle */}
        <div className="text-center mt-6">
          {mode === 'forgot' ? (
            <button onClick={() => setMode('signin')} className="text-sm text-muted-foreground">
              Back to <span className="text-primary font-medium">Sign In</span>
            </button>
          ) : mode === 'signin' ? (
            <button onClick={() => setMode('signup')} className="text-sm text-muted-foreground">
              Don't have an account? <span className="text-primary font-medium">Sign Up</span>
            </button>
          ) : (
            <button onClick={() => setMode('signin')} className="text-sm text-muted-foreground">
              Already have an account? <span className="text-primary font-medium">Sign In</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
