import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Animations';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: "Hi there 💚 I'm your personal wellness coach. I'm here to listen, support, and help you navigate the emotional demands of your work. How are you feeling today?",
  },
];

const coachResponses: Record<string, string> = {
  stressed: "I hear you, and it's completely valid to feel stressed. Healthcare work is incredibly demanding. Let's try something together — can you take three slow, deep breaths right now? Inhale for 4 counts, hold for 4, exhale for 4. Sometimes just pausing helps reset your nervous system. Would you like me to suggest some specific coping strategies?",
  anxious: "Anxiety before or during clinical work is more common than most people talk about. You're not alone in this. One technique that helps many healthcare professionals is the 5-4-3-2-1 grounding exercise: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. Would you like to try this together?",
  tired: "Exhaustion in healthcare is real and valid. Your body is telling you something important. When was the last time you took a proper break? Even a 5-minute walk or stepping outside for fresh air can help restore some energy. Would you like me to set up a micro-break reminder for you?",
  good: "That's wonderful to hear! 🌟 It's important to acknowledge the good days too. What's contributing to this positive feeling? Understanding what helps you feel good can help us build more of those moments into your routine.",
  default: "Thank you for sharing that with me. Your feelings matter, and it takes courage to express them. Remember, taking care of your mental health isn't a luxury — it's essential for both you and your patients. What specific support would be most helpful right now? I can suggest breathing exercises, help you reflect, or just listen.",
};

const getCoachResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('pressure'))
    return coachResponses.stressed;
  if (lower.includes('anxi') || lower.includes('worry') || lower.includes('nervous') || lower.includes('panic'))
    return coachResponses.anxious;
  if (lower.includes('tired') || lower.includes('exhaust') || lower.includes('burn') || lower.includes('fatigue'))
    return coachResponses.tired;
  if (lower.includes('good') || lower.includes('great') || lower.includes('fine') || lower.includes('happy'))
    return coachResponses.good;
  return coachResponses.default;
};

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getCoachResponse(userMsg.content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="px-5 pt-6 pb-3">
          <FadeIn>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
                <Bot className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-serif text-foreground">Wellness Coach</h1>
                <p className="text-xs text-muted-foreground">Always here for you</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card shadow-card text-foreground rounded-bl-md'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} className="text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="bg-card shadow-card rounded-2xl px-4 py-3 rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="px-5 pb-4 pt-2 border-t border-border glass">
          <div className="flex gap-2 items-center">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="How are you feeling..."
              className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl gradient-calm flex items-center justify-center text-primary-foreground disabled:opacity-50 transition-opacity"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AICoach;
