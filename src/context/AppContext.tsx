import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  role: string;
  specialization: string;
  yearsExperience: number;
  stressTriggers: string[];
  calmingMethods: string[];
  onboarded: boolean;
  avatar?: string;
}

export interface AssessmentResult {
  date: string;
  stressScore: number;
  anxietyScore: number;
  burnoutRisk: 'low' | 'moderate' | 'high';
}

export interface MoodEntry {
  date: string;
  mood: number; // 1-5
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood?: number;
  tags: string[];
}

interface AuthState {
  isLoggedIn: boolean;
  email: string;
}

interface AppState {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  assessments: AssessmentResult[];
  addAssessment: (a: AssessmentResult) => void;
  moods: MoodEntry[];
  addMood: (m: MoodEntry) => void;
  streaks: number;
  journalEntries: JournalEntry[];
  addJournalEntry: (e: JournalEntry) => void;
  auth: AuthState;
  login: (email: string) => void;
  logout: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  role: '',
  specialization: '',
  yearsExperience: 0,
  stressTriggers: [],
  calmingMethods: [],
  onboarded: false,
};

const AppContext = createContext<AppState>({
  profile: defaultProfile,
  setProfile: () => {},
  assessments: [],
  addAssessment: () => {},
  moods: [],
  addMood: () => {},
  streaks: 0,
  journalEntries: [],
  addJournalEntry: () => {},
  auth: { isLoggedIn: false, email: '' },
  login: () => {},
  logout: () => {},
});

export const useAppState = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mindwell-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [assessments, setAssessments] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem('mindwell-assessments');
    return saved ? JSON.parse(saved) : [
      { date: '2025-02-17', stressScore: 24, anxietyScore: 18, burnoutRisk: 'moderate' },
      { date: '2025-02-19', stressScore: 20, anxietyScore: 15, burnoutRisk: 'moderate' },
      { date: '2025-02-21', stressScore: 16, anxietyScore: 12, burnoutRisk: 'low' },
    ];
  });

  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('mindwell-moods');
    return saved ? JSON.parse(saved) : [
      { date: '2025-02-17', mood: 2 },
      { date: '2025-02-18', mood: 3 },
      { date: '2025-02-19', mood: 3 },
      { date: '2025-02-20', mood: 4 },
      { date: '2025-02-21', mood: 4 },
      { date: '2025-02-22', mood: 3 },
      { date: '2025-02-23', mood: 4 },
    ];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('mindwell-journal');
    return saved ? JSON.parse(saved) : [];
  });

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('mindwell-auth');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, email: '' };
  });

  const updateProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('mindwell-profile', JSON.stringify(p));
  };

  const addAssessment = (a: AssessmentResult) => {
    const updated = [...assessments, a];
    setAssessments(updated);
    localStorage.setItem('mindwell-assessments', JSON.stringify(updated));
  };

  const addMood = (m: MoodEntry) => {
    const existing = moods.findIndex(e => e.date === m.date);
    const updated = existing >= 0 
      ? moods.map((e, i) => i === existing ? m : e)
      : [...moods, m];
    setMoods(updated);
    localStorage.setItem('mindwell-moods', JSON.stringify(updated));
  };

  const addJournalEntry = (e: JournalEntry) => {
    const updated = [e, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem('mindwell-journal', JSON.stringify(updated));
  };

  const login = (email: string) => {
    const state = { isLoggedIn: true, email };
    setAuth(state);
    localStorage.setItem('mindwell-auth', JSON.stringify(state));
  };

  const logout = () => {
    const state = { isLoggedIn: false, email: '' };
    setAuth(state);
    localStorage.setItem('mindwell-auth', JSON.stringify(state));
  };

  return (
    <AppContext.Provider value={{
      profile,
      setProfile: updateProfile,
      assessments,
      addAssessment,
      moods,
      addMood,
      streaks: 7,
      journalEntries,
      addJournalEntry,
      auth,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};
