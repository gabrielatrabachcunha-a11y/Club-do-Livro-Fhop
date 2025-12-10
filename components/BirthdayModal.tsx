import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { X, Gift } from 'lucide-react';

interface Props {
  user: User;
}

const BirthdayModal: React.FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkBirthday = () => {
      if (!user.birthDate) return;
      
      const today = new Date();
      const birth = new Date(user.birthDate);
      
      if (today.getDate() === birth.getDate() + 1 && // +1 to fix timezone offset usually
          today.getMonth() === birth.getMonth()) {
          setIsOpen(true);
      }
      
      // Simple string match fallback to avoid timezone complexity
      const todayStr = today.toISOString().slice(5, 10); // MM-DD
      const birthStr = user.birthDate.slice(5, 10);
      
      if (todayStr === birthStr) {
        setIsOpen(true);
      }
    };

    checkBirthday();
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl animate-bounce-subtle">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="p-4 mb-4 bg-yellow-100 rounded-full text-yellow-600">
            <Gift size={48} />
          </div>
          
          <h2 className="mb-2 text-3xl font-bold text-gray-800">Feliz Aniversário, {user.name.split(' ')[0]}!</h2>
          <p className="mb-6 text-gray-600 px-2">
            Que Deus derrame chuvas de bênçãos sobre a sua vida e que a Sua presença guie cada um dos seus passos neste novo ciclo!
          </p>
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-lg font-serif italic text-slate-700 leading-relaxed">
              "Tu criaste o íntimo do meu ser e me teceste no ventre de minha mãe."
            </p>
            <p className="mt-4 font-semibold text-slate-900">— Salmos 139:13</p>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-8 px-10 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg shadow-blue-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayModal;