import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ArrowRight, BookOpen, Calendar as CalendarIcon, Lock, X } from 'lucide-react';

interface Props {
  onRegister: (user: User, isAdmin?: boolean) => void;
}

const Registration: React.FC<Props> = ({ onRegister }) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    birthDate: '', // Internally keeps YYYY-MM-DD
    isMember: false,
  });

  // State for the segmented date inputs
  const [dateParts, setDateParts] = useState({ day: '', month: '', year: '' });
  
  // Admin Login State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);
  
  // Refs for auto-focus navigation
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const hiddenDateRef = useRef<HTMLInputElement>(null);

  // Sync dateParts to formData.birthDate whenever parts change
  useEffect(() => {
    const { day, month, year } = dateParts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      // Validate basic ranges
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (dayNum > 0 && dayNum <= 31 && monthNum > 0 && monthNum <= 12 && yearNum > 1900) {
        setFormData(prev => ({ ...prev, birthDate: `${year}-${month}-${day}` }));
        return;
      }
    }
    // If incomplete or invalid, reset the internal birthDate
    setFormData(prev => ({ ...prev, birthDate: '' }));
  }, [dateParts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.birthDate) {
      onRegister(formData, false);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'FHOP123') {
      // Create a specific admin user profile
      const adminUser: User = {
        name: 'Administrador',
        birthDate: '2000-01-01',
        isMember: true
      };
      onRegister(adminUser, true);
    } else {
      setAdminError(true);
      setAdminPassword('');
    }
  };

  const handlePartChange = (
    part: 'day' | 'month' | 'year', 
    value: string, 
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    // Only allow numbers
    const cleanValue = value.replace(/\D/g, '');
    
    // Limits
    const maxLength = part === 'year' ? 4 : 2;
    if (cleanValue.length > maxLength) return;

    setDateParts(prev => ({ ...prev, [part]: cleanValue }));

    // Auto-focus next field
    if (cleanValue.length === maxLength && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>, 
    part: 'day' | 'month' | 'year', 
    prevRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    // Move back on Backspace if empty
    if (e.key === 'Backspace' && dateParts[part] === '' && prevRef && prevRef.current) {
      prevRef.current.focus();
    }
  };

  // Handle selection from the native picker
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoDate = e.target.value; // YYYY-MM-DD
    if (!isoDate) return;

    const [year, month, day] = isoDate.split('-');
    setDateParts({ day, month, year });
    setFormData(prev => ({ ...prev, birthDate: isoDate }));
  };

  const openDatePicker = () => {
    if (hiddenDateRef.current) {
        hiddenDateRef.current.showPicker();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
               <BookOpen className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Clube do Livro FHOP</h1>
            <p className="text-blue-100 text-sm">Junte-se a nós nesta jornada de fé.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
            <div className="relative flex items-center w-full px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all bg-slate-50 focus-within:bg-white">
              {/* Segmented Inputs */}
              <div className="flex items-center flex-1">
                <input
                  ref={dayRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="DD"
                  className="w-8 text-center bg-transparent outline-none placeholder:text-slate-400"
                  value={dateParts.day}
                  onChange={(e) => handlePartChange('day', e.target.value, monthRef)}
                  onKeyDown={(e) => handleKeyDown(e, 'day')}
                />
                <span className="text-slate-400 mx-1">/</span>
                <input
                  ref={monthRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  className="w-8 text-center bg-transparent outline-none placeholder:text-slate-400"
                  value={dateParts.month}
                  onChange={(e) => handlePartChange('month', e.target.value, yearRef)}
                  onKeyDown={(e) => handleKeyDown(e, 'month', dayRef)}
                />
                <span className="text-slate-400 mx-1">/</span>
                <input
                  ref={yearRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="AAAA"
                  className="w-14 text-center bg-transparent outline-none placeholder:text-slate-400"
                  value={dateParts.year}
                  onChange={(e) => handlePartChange('year', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'year', monthRef)}
                />
              </div>

              <button
                type="button"
                onClick={openDatePicker}
                className="text-slate-400 hover:text-blue-600 transition-colors p-1"
              >
                <CalendarIcon size={20} />
              </button>
              
              {/* Hidden Date Input for Native Picker */}
              <input 
                ref={hiddenDateRef}
                type="date"
                className="absolute opacity-0 pointer-events-none bottom-0 right-0"
                onChange={handlePickerChange}
                tabIndex={-1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Você é membro da FHOP?</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isMember: true })}
                className={`py-3 px-4 rounded-xl border font-medium transition-all ${
                  formData.isMember
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isMember: false })}
                className={`py-3 px-4 rounded-xl border font-medium transition-all ${
                  !formData.isMember
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center group"
          >
            <span>Iniciar Acesso</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </form>
        
        <div className="px-8 pb-6 pt-2 text-center bg-white">
           <button 
             onClick={() => setShowAdminModal(true)}
             className="text-xs text-slate-300 hover:text-slate-500 transition-colors flex items-center justify-center mx-auto space-x-1"
           >
             <Lock size={12} />
             <span>Área Administrativa</span>
           </button>
           <p className="text-xs text-slate-300 mt-4 border-t border-slate-50 pt-4">© 2024 Club do Livro FHOP. Dados salvos localmente.</p>
        </div>

        {/* Admin Login Modal */}
        {showAdminModal && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom duration-300">
            <button 
              onClick={() => {
                setShowAdminModal(false);
                setAdminError(false);
                setAdminPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <div className="w-full max-w-xs">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600">
                  <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Acesso Administrativo</h3>
                <p className="text-sm text-slate-500">Digite a senha para gerenciar o app</p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError(false);
                    }}
                    placeholder="Senha"
                    className={`w-full px-4 py-3 rounded-xl border text-center text-lg tracking-widest outline-none transition-all ${
                      adminError 
                      ? 'border-red-300 bg-red-50 text-red-600 placeholder:text-red-300' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                  />
                  {adminError && (
                    <p className="text-xs text-red-500 text-center mt-2 font-medium">Senha incorreta. Tente novamente.</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Entrar
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="w-full py-3 text-slate-500 text-sm hover:text-slate-800 transition-colors"
                >
                  Voltar ao cadastro
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;