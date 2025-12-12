import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { generatePlan } from '../services/readingPlanService';
import { ArrowRight, BookOpen, Clock, Calendar, Trophy, Image as ImageIcon } from 'lucide-react';
import MonthlyChallenge from './MonthlyChallenge';
import Agenda from './Agenda';
import PhotoGallery from './PhotoGallery';

interface Props {
  user: User;
  onChangeTab: (tab: 'year' | 'six_months' | 'agenda' | 'challenge') => void;
  isAdmin?: boolean;
}

const Home: React.FC<Props> = ({ user, onChangeTab, isAdmin = false }) => {
  const [stats, setStats] = useState({
    year: { total: 0, completed: 0, percent: 0 },
    sixMonths: { total: 0, completed: 0, percent: 0 }
  });

  const calculateStats = () => {
    // Calculate progress for Year Plan
    const yearPlan = generatePlan(365);
    const yearTotalItems = Object.values(yearPlan).flat().length;
    let yearCompleted = 0;
    try {
      const savedYear = localStorage.getItem('fhop_progress_year');
      if (savedYear) {
        yearCompleted = JSON.parse(savedYear).length;
      }
    } catch (e) {}
    
    // Calculate progress for 6-Month Plan
    const sixMonthPlan = generatePlan(180);
    const sixMonthTotalItems = Object.values(sixMonthPlan).flat().length;
    let sixMonthCompleted = 0;
    try {
      const savedSix = localStorage.getItem('fhop_progress_six_months');
      if (savedSix) {
        sixMonthCompleted = JSON.parse(savedSix).length;
      }
    } catch (e) {}

    return {
      year: {
        total: yearTotalItems,
        completed: yearCompleted,
        percent: yearTotalItems > 0 ? Math.round((yearCompleted / yearTotalItems) * 100) : 0
      },
      sixMonths: {
        total: sixMonthTotalItems,
        completed: sixMonthCompleted,
        percent: sixMonthTotalItems > 0 ? Math.round((sixMonthCompleted / sixMonthTotalItems) * 100) : 0
      }
    };
  };

  useEffect(() => {
    // Initial calculation
    setStats(calculateStats());

    // Listen for storage events (updates from other tabs)
    const handleStorage = () => {
        setStats(calculateStats());
    };
    window.addEventListener('storage', handleStorage);
    
    // Poll for changes
    const intervalId = setInterval(() => {
        const newStats = calculateStats();
        // Simple comparison
        if (JSON.stringify(newStats) !== JSON.stringify(stats)) {
            setStats(newStats);
        }
    }, 2000);

    return () => {
        window.removeEventListener('storage', handleStorage);
        clearInterval(intervalId);
    };

  }, [stats]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 mb-3">
             <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
               Olá, {user.name.split(' ')[0]}! 👋
             </h1>
             {isAdmin && (
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Admin
                </span>
             )}
          </div>
          <p className="text-slate-500 text-lg leading-relaxed font-light max-w-lg">
            "Terei prazer nos teus decretos; não me esquecerei da tua palavra."
            <span className="block text-sm font-bold text-blue-600 mt-2 font-serif italic">- Salmos 119:16</span>
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Annual Plan Card */}
        <div 
          onClick={() => onChangeTab('year')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar size={24} />
            </div>
            <div className="flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
              <span className="text-sm font-medium mr-1">Abrir</span>
              <ArrowRight size={16} />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-1">Plano Anual</h3>
          <p className="text-slate-500 text-sm mb-6">Leitura completa em 365 dias</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">Progresso</span>
              <span className="text-blue-600">{stats.year.percent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.year.percent}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">{stats.year.completed} de {stats.year.total} leituras concluídas</p>
          </div>
        </div>

        {/* 6 Month Plan Card */}
        <div 
          onClick={() => onChangeTab('six_months')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Clock size={24} />
            </div>
            <div className="flex items-center text-slate-400 group-hover:text-purple-500 transition-colors">
              <span className="text-sm font-medium mr-1">Abrir</span>
              <ArrowRight size={16} />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-1">Bíblia em 6 Meses</h3>
          <p className="text-slate-500 text-sm mb-6">Desafio intensivo cronológico</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">Progresso</span>
              <span className="text-purple-600">{stats.sixMonths.percent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.sixMonths.percent}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">{stats.sixMonths.completed} de {stats.sixMonths.total} leituras concluídas</p>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      <div id="challenge-section">
        <div className="flex items-center space-x-2 mb-4 px-2">
          <Trophy className="text-yellow-600" size={20} />
          <h2 className="text-xl font-bold text-slate-800">Destaque do Mês</h2>
        </div>
        <MonthlyChallenge isAdmin={isAdmin} />
      </div>

      {/* Agenda Section */}
      <div id="agenda-section">
         <div className="flex items-center space-x-2 mb-4 px-2">
          <Calendar className="text-blue-600" size={20} />
          <h2 className="text-xl font-bold text-slate-800">Próximos Eventos</h2>
        </div>
        <Agenda isAdmin={isAdmin} />
      </div>

      {/* Photo Gallery Section */}
      <div id="gallery-section">
        <PhotoGallery isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default Home;