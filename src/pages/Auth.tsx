import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/context/AppContext';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
      toast({ title: "Passwords don't match", variant: 'destructive' });
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

  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Wordmark */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-xl gradient-calm flex items-center justify-center shadow-elevated mb-4">
            <Activity className="text-primary-foreground" size={26} />
          </div>
          <h1 className="text-2xl font-serif text-foreground tracking-tight">Mann Care</h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
            Clinician Wellness Platform
          </p>
        </div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
          >
            <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {mode === 'signin' ? 'Sign in to your account' : mode === 'signup' ? 'Create an account' : 'Reset your password'}
              </h2>

              {/* Email */}
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={inputClass}
                />
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              )}

              {/* Confirm password */}
              {mode === 'signup' && (
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className={inputClass}
                  />
                </div>
              )}

              {/* Forgot link */}
              {mode === 'signin' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-calm border-none text-primary-foreground font-semibold rounded-lg py-5"
              >
                {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                <ArrowRight size={15} className="ml-2" />
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>

        {/* Toggle footer */}
        <div className="text-center mt-5">
          {mode === 'forgot' ? (
            <button onClick={() => setMode('signin')} className="text-sm text-muted-foreground hover:text-foreground">
              Back to <span className="text-primary font-medium">Sign In</span>
            </button>
          ) : mode === 'signin' ? (
            <button onClick={() => setMode('signup')} className="text-sm text-muted-foreground hover:text-foreground">
              No account? <span className="text-primary font-medium">Create one</span>
            </button>
          ) : (
            <button onClick={() => setMode('signin')} className="text-sm text-muted-foreground hover:text-foreground">
              Already have an account? <span className="text-primary font-medium">Sign In</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
