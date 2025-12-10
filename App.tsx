import React, { useState, useEffect } from 'react';
import { User } from './types';
import Registration from './components/Registration';
import ReadingPlan from './components/ReadingPlan';
import Agenda from './components/Agenda';
import MonthlyChallenge from './components/MonthlyChallenge';
import PhotoGallery from './components/PhotoGallery'; // Imported
import BirthdayModal from './components/BirthdayModal';
import Home from './components/Home';
import RecycleBin from './components/RecycleBin'; // Imported
import { BookOpen, Calendar, Award, Clock, Menu, X, LogOut, Home as HomeIcon, ShieldCheck, Trash2, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'year' | 'six_months' | 'agenda' | 'challenge' | 'gallery' | 'recycle_bin'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check local storage for user
    try {
        const savedUser = localStorage.getItem('fhop_user');
        const savedIsAdmin = localStorage.getItem('fhop_is_admin');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedIsAdmin === 'true') {
          setIsAdmin(true);
        }
    } catch (e) {
        console.error("Failed to load user", e);
    }
    setIsLoaded(true);
  }, []);

  const handleRegister = (newUser: User, isAdminAccess: boolean = false) => {
    localStorage.setItem('fhop_user', JSON.stringify(newUser));
    localStorage.setItem('fhop_is_admin', String(isAdminAccess));
    setUser(newUser);
    setIsAdmin(isAdminAccess);
  };

  const handleLogout = () => {
    localStorage.removeItem('fhop_user');
    localStorage.removeItem('fhop_is_admin');
    setUser(null);
    setIsAdmin(false);
    setActiveTab('home');
  }

  if (!isLoaded) return null; // Prevent flash

  if (!user) {
    return <Registration onRegister={handleRegister} />;
  }

  const NavButton = ({ tab, icon: Icon, label }: { tab: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full md:w-auto px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {user && <BirthdayModal user={user} />}
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
        <div className="flex items-center space-x-2" onClick={() => setActiveTab('home')}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-800">Clube do Livro Fhop</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop) & Mobile Menu */}
      <nav className={`
        fixed inset-0 z-30 bg-white transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:w-72 md:flex md:flex-col md:border-r border-slate-200
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 md:p-8 h-full flex flex-col">
           {/* Logo Area */}
           <div className="hidden md:flex items-center space-x-3 mb-10 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                  <BookOpen className="text-white" size={24} />
              </div>
              <div>
                  <h1 className="font-bold text-lg text-slate-900 leading-tight">Clube do Livro Fhop</h1>
              </div>
           </div>

           {/* User Profile Snippet */}
           <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
              {isAdmin && (
                <div className="absolute top-0 right-0 p-2 text-blue-200">
                   <ShieldCheck size={40} className="opacity-10 rotate-12" />
                </div>
              )}
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Bem-vindo(a)</p>
              <p className="font-bold text-slate-800 text-lg truncate">{user.name.split(' ')[0]}</p>
              <div className={`flex items-center mt-2 text-xs font-medium px-2 py-1 rounded-md w-max ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}`}>
                 {isAdmin ? 'Administrador' : (user.isMember ? 'Membro FHOP' : 'Visitante')}
              </div>
           </div>

           {/* Navigation Links */}
           <div className="space-y-2 flex-1 overflow-y-auto">
              <NavButton tab="home" icon={HomeIcon} label="Início" />
              <NavButton tab="year" icon={Calendar} label="Plano Anual" />
              <NavButton tab="six_months" icon={Clock} label="Bíblia em 6 Meses" />
              <NavButton tab="agenda" icon={BookOpen} label="Agenda Club" />
              <NavButton tab="challenge" icon={Award} label="Desafio do Mês" />
              <NavButton tab="gallery" icon={ImageIcon} label="Galeria de Fotos" />
              
              {isAdmin && (
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 px-4 mb-2 uppercase">Admin</p>
                  <NavButton tab="recycle_bin" icon={Trash2} label="Lixeira" />
                </div>
              )}
           </div>

           {/* Logout */}
           <button 
             onClick={handleLogout}
             className="mt-auto flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium flex-shrink-0"
           >
             <LogOut size={20} />
             <span>Sair</span>
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Dynamic Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'home' && <Home key="home" user={user} onChangeTab={(tab: any) => setActiveTab(tab)} isAdmin={isAdmin} />}
            {activeTab === 'year' && <ReadingPlan key="year" mode="year" />}
            {activeTab === 'six_months' && <ReadingPlan key="six_months" mode="six_months" />}
            {activeTab === 'agenda' && <Agenda key="agenda" isAdmin={isAdmin} />}
            {activeTab === 'challenge' && <MonthlyChallenge key="challenge" isAdmin={isAdmin} />}
            
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="text-pink-600" size={24} />
                  <h2 className="text-2xl font-bold text-slate-800">Galeria de Fotos</h2>
                </div>
                <PhotoGallery key="gallery" isAdmin={isAdmin} />
              </div>
            )}

            {activeTab === 'recycle_bin' && isAdmin && <RecycleBin key="recycle_bin" />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;