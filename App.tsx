import React, { useState, useEffect } from 'react';
import { Screen, UserProgress, ModuleType, Badge } from './types';
import { Dashboard } from './components/Dashboard';
import { Simulation } from './components/Simulation';
import { Certificate } from './components/Certificate';
import { HardHat, Moon, Sun, LogOut } from 'lucide-react';

const INITIAL_USER: UserProgress = {
  name: 'Peserta',
  xp: 0,
  level: 1,
  completedModules: [],
  badges: []
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [currentModule, setCurrentModule] = useState<ModuleType | null>(null);
  const [nameInput, setNameInput] = useState('');
  
  // Initialize state from LocalStorage if available
  const [user, setUser] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('safetyHero_data');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [hasRegistered, setHasRegistered] = useState(() => {
    return !!localStorage.getItem('safetyHero_data');
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('safetyHero_theme') === 'dark';
  });

  // Effect to handle Dark Mode class and persistence
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('safetyHero_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('safetyHero_theme', 'light');
    }
  }, [darkMode]);

  // Effect to Auto-Save user progress
  useEffect(() => {
    if (hasRegistered) {
      localStorage.setItem('safetyHero_data', JSON.stringify(user));
    }
  }, [user, hasRegistered]);

  const handleStartModule = (module: ModuleType) => {
    setCurrentModule(module);
    setScreen('simulation');
  };

  const handleModuleComplete = (score: number) => {
    setUser(prev => {
      const newXp = prev.xp + score;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      const newCompletedModules = prev.completedModules.includes(currentModule!)
        ? prev.completedModules
        : [...prev.completedModules, currentModule!];

      const newBadges = [...prev.badges];
      
      // Award badge if first time completion
      if (!prev.completedModules.includes(currentModule!)) {
        let badgeIcon = '🏅';
        if (currentModule === ModuleType.FALL) badgeIcon = '🪂';
        if (currentModule === ModuleType.ELECTRICITY) badgeIcon = '⚡';
        if (currentModule === ModuleType.FORKLIFT) badgeIcon = '🚜';

        newBadges.push({
          id: Date.now().toString(),
          name: `Ahli ${currentModule}`,
          icon: badgeIcon,
          description: `Menyelesaikan simulasi ${currentModule}`,
          earnedAt: new Date().toISOString()
        });
      }

      // Award "Safety Champion" badge if all modules done
      if (newCompletedModules.length === 3 && !prev.badges.find(b => b.name === 'Safety Champion')) {
        newBadges.push({
           id: 'master-badge',
           name: 'Safety Champion',
           icon: '🏆',
           description: 'Menyelesaikan semua modul dasar K3',
           earnedAt: new Date().toISOString()
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedModules: newCompletedModules,
        badges: newBadges
      };
    });
    setScreen('dashboard');
    setCurrentModule(null);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUser(prev => ({ ...prev, name: nameInput }));
      setHasRegistered(true);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus progress dan keluar? Data akan hilang.")) {
      localStorage.removeItem('safetyHero_data');
      setUser(INITIAL_USER);
      setHasRegistered(false);
      setNameInput('');
      setScreen('dashboard');
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  if (!hasRegistered) {
    return (
      <div className="min-h-screen safety-pattern flex items-center justify-center p-4 transition-colors duration-300">
        <div className="absolute top-4 right-4">
           <button 
              onClick={toggleTheme} 
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:scale-110 transition-transform text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
        </div>

        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 animate-pop">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 animate-float">
              <HardHat className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">SafetyHero</h1>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Training K3 Seru & Interaktif!</p>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:border-orange-500 outline-none transition-all"
                placeholder="Siapa nama calon Safety Hero?"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1"
            >
              🚀 Mulai Petualangan K3
            </button>
          </form>
          <div className="mt-8 flex justify-center space-x-2">
             <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
             <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></span>
             <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safety-pattern text-slate-900 dark:text-slate-100 font-sans pb-10 transition-colors duration-300">
      {/* Navbar - Only visible on dashboard and game */}
      {screen !== 'certificate' && (
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors border-b border-orange-100 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-3 group" onClick={() => setScreen('dashboard')}>
              <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-white cursor-pointer tracking-tight">SafetyHero</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {screen === 'simulation' ? (
                <button onClick={() => setScreen('dashboard')} className="px-3 py-2 text-sm font-bold text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors">
                  Batal
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="p-2 mr-1 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Reset Data / Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
              
              <button 
                onClick={toggleTheme} 
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-yellow-400"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="pt-6">
        {screen === 'dashboard' && (
          <Dashboard 
            user={user} 
            onStartModule={handleStartModule} 
            onShowCertificate={() => setScreen('certificate')} 
          />
        )}
        
        {screen === 'simulation' && currentModule && (
          <Simulation 
            module={currentModule}
            onComplete={handleModuleComplete}
            onExit={() => setScreen('dashboard')}
          />
        )}

        {screen === 'certificate' && (
          <Certificate 
            user={user}
            onBack={() => setScreen('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;