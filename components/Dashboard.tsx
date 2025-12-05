import React from 'react';
import { UserProgress, ModuleType } from '../types';
import { Shield, Zap, Truck, Lock, CheckCircle, Play, Star } from 'lucide-react';

interface DashboardProps {
  user: UserProgress;
  onStartModule: (module: ModuleType) => void;
  onShowCertificate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartModule, onShowCertificate }) => {
  
  const modules = [
    { 
      type: ModuleType.FALL, 
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      desc: "Pelajari cara aman bekerja di ketinggian dan penggunaan APD."
    },
    { 
      type: ModuleType.ELECTRICITY, 
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      desc: "Identifikasi risiko sengatan listrik dan prosedur LOTO."
    },
    { 
      type: ModuleType.FORKLIFT, 
      icon: <Truck className="w-8 h-8 text-red-500" />,
      desc: "Operasional aman forklift dan manajemen beban."
    }
  ];

  const allModulesCompleted = modules.every(m => user.completedModules.includes(m.type));
  const progressPercent = (user.completedModules.length / modules.length) * 100;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-pop">
      
      {/* Hero / Stats Section */}
      <div className="bg-orange-500 dark:bg-orange-600 rounded-3xl p-6 md:p-10 text-white shadow-xl transform transition-transform hover:scale-[1.01] duration-300 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>

        <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-2">Halo, {user.name}! 👋</h1>
            <p className="text-orange-50 opacity-90 text-lg">Siap jadi pahlawan keselamatan hari ini?</p>
            
            <div className="mt-8 flex items-center justify-center md:justify-start space-x-8">
              <div className="group cursor-default">
                <span className="text-xs uppercase tracking-wider opacity-90 font-bold text-orange-100">Level</span>
                <div className="text-5xl font-black group-hover:scale-110 transition-transform duration-300">{user.level}</div>
              </div>
              <div className="h-12 w-0.5 bg-orange-300"></div>
              <div className="group cursor-default">
                <span className="text-xs uppercase tracking-wider opacity-90 font-bold text-orange-100">XP Total</span>
                <div className="text-5xl font-black text-yellow-200 group-hover:scale-110 transition-transform duration-300">{user.xp}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 dark:bg-black/20 p-6 rounded-2xl backdrop-blur-sm border-2 border-white/30 w-full md:w-auto min-w-[280px]">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-90">Misi Sertifikasi</h3>
            <div className="w-full bg-black/20 rounded-full h-4 mb-2 overflow-hidden">
              <div 
                className="bg-green-400 h-4 rounded-full transition-all duration-1000 relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-right text-sm font-medium">{user.completedModules.length} dari {modules.length} Selesai</p>
            
            {allModulesCompleted && (
              <button 
                onClick={onShowCertificate}
                className="mt-6 w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-orange-900 font-bold rounded-xl transition-all hover:-translate-y-1 flex items-center justify-center animate-bounce-slow shadow-lg border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1"
              >
                <Star className="w-5 h-5 mr-2" />
                Ambil Sertifikat!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" /> Koleksi Badge
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.badges.map((badge) => (
            <div key={badge.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:border-orange-500 dark:hover:border-orange-500 transition-colors group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">{badge.icon}</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{badge.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{badge.description}</p>
            </div>
            ))}
            {user.badges.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <p>Belum ada badge. Ayo selesaikan misi pertamamu! 🏃‍♂️</p>
            </div>
            )}
        </div>
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
             <Play className="w-5 h-5 mr-2 text-blue-500" /> Pilihan Misi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => {
            const isCompleted = user.completedModules.includes(m.type);
            
            return (
              <div key={m.type} className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-2 ${isCompleted ? 'border-green-400/50 dark:border-green-500/30' : 'border-slate-100 dark:border-slate-700'}`}>
                {isCompleted && (
                  <div className="absolute top-3 right-3 text-green-500 bg-green-100 dark:bg-green-900/50 rounded-full p-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-4 bg-orange-100 dark:bg-slate-700 w-16 h-16 rounded-2xl flex items-center justify-center self-start transform transition-transform group-hover:rotate-6">
                    {m.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{m.type}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">{m.desc}</p>
                  
                  <button 
                    onClick={() => onStartModule(m.type)}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                      isCompleted 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-orange-500/20 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1'
                    }`}
                  >
                    {isCompleted ? (
                      <><span>Main Lagi</span><Play className="w-4 h-4" /></>
                    ) : (
                      <><span>Mulai Misi</span><Play className="w-4 h-4 fill-current" /></>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Coming Soon Module */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 opacity-75 grayscale flex flex-col justify-center items-center text-center">
            <Lock className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-500 dark:text-slate-500">B3 & Kimia</h3>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};