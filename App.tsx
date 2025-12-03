
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Notes } from './components/Notes';
import { Timetable } from './components/Timetable';
import { Chat } from './components/Chat';
import { Grades } from './components/Grades';
import { AdminPanel } from './components/AdminPanel';
import { TeacherTools } from './components/TeacherTools';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { AIAssistant } from './components/AIAssistant';
import { Settings } from './components/Settings'; // New Import
import { User, UserRole, Notification } from './types';
import { GlassCard } from './components/ui/GlassCard';
import { GraduationCap, BookOpen, ShieldCheck, MessageCircle } from 'lucide-react';

const USER_REGISTRY_KEY = 'gearhub_users_registry';
const ACTIVE_SESSION_KEY = 'gearhub_active_session';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load active session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    // Mock notifications
    setNotifications([
        { id: '1', title: 'Welcome to GEAR HUB!', message: 'Explore the new features.', type: 'info', timestamp: new Date().toISOString(), read: false }
    ]);
  }, []);

  const handleXPAction = (amount: number) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    
    // Check level up
    if (newLevel > (user.level || 1)) {
        setNotifications(prev => [
            { id: Date.now().toString(), title: 'Level Up!', message: `You reached Level ${newLevel}!`, type: 'success', timestamp: new Date().toISOString(), read: false },
            ...prev
        ]);
    }

    const updatedUser = { ...user, xp: newXP, level: newLevel };
    handleUpdateUser(updatedUser);
  };

  const handleLogin = (email: string, name: string) => {
    const registry = JSON.parse(localStorage.getItem(USER_REGISTRY_KEY) || '{}');
    const existingUser = registry[email];

    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(existingUser));
    } else {
      // Fallback for direct testing if somehow we bypass Login registration (shouldn't happen with new Login)
      // Logic moved primarily to Login.tsx for creation
      console.warn("User login attempted without registry entry. Creating fallback session.");
      const newUser: User = {
        id: email.replace(/[^a-zA-Z0-9]/g, '_'),
        name: name,
        email: email,
        role: UserRole.STUDENT, // Default
        avatar: '',
        xp: 0,
        level: 1,
        streak: 1,
        badges: []
      };
      setUser(newUser);
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(newUser));
      registry[email] = newUser;
      localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(updatedUser));
    const registry = JSON.parse(localStorage.getItem(USER_REGISTRY_KEY) || '{}');
    registry[updatedUser.email] = updatedUser;
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!user.role) {
    const handleRoleSelect = (role: UserRole) => {
      const updatedUser = { ...user, role };
      handleUpdateUser(updatedUser);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 pointer-events-none" />
        <div className="max-w-5xl w-full relative z-10 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Choose your role</h1>
            <p className="text-slate-400 text-lg">Select how you will be using GEAR HUB to customize your experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
             <GlassCard 
               className="p-8 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/10 transition-all group hover:-translate-y-2"
               onClick={() => handleRoleSelect(UserRole.STUDENT)}
             >
               <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-900/20">
                 <GraduationCap className="w-10 h-10 text-cyan-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-3">Student</h3>
               <p className="text-slate-400 leading-relaxed">Access study tools, create notes, manage schedule, and collaborate with peers.</p>
             </GlassCard>

             <GlassCard 
               className="p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/10 transition-all group hover:-translate-y-2"
               onClick={() => handleRoleSelect(UserRole.TEACHER)}
             >
               <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/20">
                 <BookOpen className="w-10 h-10 text-purple-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-3">Teacher</h3>
               <p className="text-slate-400 leading-relaxed">Publish notes, assign homework, grade submissions, and monitor class progress.</p>
             </GlassCard>

             <GlassCard 
               className="p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/10 transition-all group hover:-translate-y-2"
               onClick={() => handleRoleSelect(UserRole.ADMIN)}
             >
               <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-900/20">
                 <ShieldCheck className="w-10 h-10 text-orange-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-3">Admin</h3>
               <p className="text-slate-400 leading-relaxed">Oversee platform usage, manage users, and configure institutional settings.</p>
             </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  const renderContent = () => {
    // If Searching
    if (searchTerm) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Search Results</h2>
                <GlassCard className="p-8 text-center">
                    <p className="text-slate-400 text-lg">Searching for "<span className="text-white font-bold">{searchTerm}</span>"...</p>
                    <p className="text-sm text-slate-500 mt-2">No matching records found in this demo.</p>
                </GlassCard>
            </div>
        )
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} setActiveTab={setActiveTab} />;
      case 'notes':
        return <Notes user={user} onXPAction={handleXPAction} />;
      case 'timetable':
        return <Timetable user={user} />;
      case 'chat':
        return <Chat user={user} />;
      case 'grades':
        return <Grades user={user} />;
      case 'teacher-tools':
        return user.role === UserRole.TEACHER ? <TeacherTools user={user} /> : <Dashboard user={user} setActiveTab={setActiveTab} />;
      case 'admin':
        return user.role === UserRole.ADMIN ? <AdminPanel user={user} /> : <Dashboard user={user} setActiveTab={setActiveTab} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return <Dashboard user={user} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <Layout 
        currentUser={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        notifications={notifications}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSettingsClick={() => setIsSettingsOpen(true)}
      >
        {renderContent()}
      </Layout>
      
      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Floating AI Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => setIsAIChatOpen(true)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.6)] flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-white/20 ${isAIChatOpen ? 'hidden' : 'flex'}`}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
};

export default App;
