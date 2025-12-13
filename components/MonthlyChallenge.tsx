import React, { useState, useEffect } from 'react';
import { Book, Star, Award, PartyPopper, CheckCircle, Edit2, X, Save, Trash2, PlusCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { INITIAL_CHALLENGES } from '../constants';
import { BookChallenge, RecycleBinItem } from '../types';

interface Props {
  isAdmin?: boolean;
}

const COLORS = [
  { label: 'Amber', value: 'bg-amber-700' },
  { label: 'Blue', value: 'bg-blue-700' },
  { label: 'Emerald', value: 'bg-emerald-700' },
  { label: 'Rose', value: 'bg-rose-700' },
  { label: 'Purple', value: 'bg-purple-700' },
  { label: 'Slate', value: 'bg-slate-800' },
];

const MonthlyChallenge: React.FC<Props> = ({ isAdmin = false }) => {
  const [challenges, setChallenges] = useState<BookChallenge[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  // Default form state for new/edit challenges
  const [editForm, setEditForm] = useState<BookChallenge | null>(null);

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadData = () => {
    try {
      const savedData = localStorage.getItem('fhop_challenges_list');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (!Array.isArray(parsed) && parsed !== null) {
           return [{ ...parsed, id: 'legacy_1' }];
        } else if (Array.isArray(parsed)) {
           return parsed;
        } else {
           return [];
        }
      } else {
        return INITIAL_CHALLENGES;
      }
    } catch (e) {
      return INITIAL_CHALLENGES;
    }
  };

  useEffect(() => {
    // 1. Initial Load
    setChallenges(loadData());

    // 2. Sync Listeners
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fhop_challenges_list') {
        setChallenges(loadData());
      }
    };
    const handleLocalUpdate = () => {
      setChallenges(loadData());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fhop_data_update_challenges', handleLocalUpdate);

    // 3. Polling for strict synchronization (Updated to 1000ms for faster updates)
    const intervalId = setInterval(() => {
      const currentStored = loadData();
      if (JSON.stringify(currentStored) !== JSON.stringify(challenges)) {
        setChallenges(currentStored);
      }
    }, 1000);

    // 4. Load Completion Statuses (Private)
    try {
        const savedCompleted = localStorage.getItem('fhop_challenges_completed_ids');
        if (savedCompleted) {
            setCompletedIds(new Set(JSON.parse(savedCompleted)));
        }
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fhop_data_update_challenges', handleLocalUpdate);
      clearInterval(intervalId);
    };
  }, [challenges]);

  const saveChallenges = (newList: BookChallenge[]) => {
      setChallenges(newList);
      localStorage.setItem('fhop_challenges_list', JSON.stringify(newList));
      window.dispatchEvent(new Event('fhop_data_update_challenges'));
  };

  const handleMarkAsRead = (id: string) => {
    if (completedIds.has(id)) return;
    
    const newSet = new Set(completedIds);
    newSet.add(id);
    setCompletedIds(newSet);
    setShowCelebration(true);
    localStorage.setItem('fhop_challenges_completed_ids', JSON.stringify(Array.from(newSet)));
    
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  const handleSave = () => {
    if (!editForm) return;

    let updatedList: BookChallenge[];
    
    // Check if updating existing or adding new
    const existingIndex = challenges.findIndex(c => c.id === editForm.id);
    
    if (existingIndex >= 0) {
        updatedList = challenges.map(c => c.id === editForm.id ? editForm : c);
    } else {
        updatedList = [...challenges, editForm];
    }

    saveChallenges(updatedList);
    setIsEditing(false);
    setEditForm(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    // 1. Find item to delete
    const itemToDeleteObj = challenges.find(c => c.id === id);

    if (itemToDeleteObj) {
      // 2. Move to Recycle Bin
      try {
        const binData = localStorage.getItem('fhop_recycle_bin');
        const bin: RecycleBinItem[] = binData ? JSON.parse(binData) : [];
        
        bin.push({
          deletedAt: new Date().toISOString(),
          type: 'challenge',
          originalData: itemToDeleteObj
        });
        
        localStorage.setItem('fhop_recycle_bin', JSON.stringify(bin));
        window.dispatchEvent(new Event('fhop_data_update_bin'));
      } catch (e) {
        console.error("Erro ao mover para lixeira", e);
      }

      // 3. Remove from Active List
      const updatedList = challenges.filter(c => c.id !== id);
      saveChallenges(updatedList);
    }
    
    setItemToDelete(null);
  };

  const handleCreateNew = () => {
    setEditForm({
      id: Date.now().toString(),
      title: '',
      author: '',
      description: '',
      coverColor: 'bg-blue-700',
      month: '',
      coverImage: ''
    });
    setIsEditing(true);
  };

  const handleEditClick = (challenge: BookChallenge) => {
      setEditForm({ ...challenge });
      setIsEditing(true);
  };

  // EMPTY STATE
  if (challenges.length === 0) {
    if (!isAdmin) return null; // Hide completely if user

    return (
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-50 rounded-full text-slate-300">
             <Award size={48} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Sem Desafios Ativos</h2>
            <p className="text-slate-500">Nenhum livro cadastrado no momento.</p>
          </div>
          
          <button 
            onClick={handleCreateNew}
            className="mt-4 flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <PlusCircle size={20} />
            <span>Criar Primeiro Desafio</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Add Button (Top) */}
      {isAdmin && (
        <div className="flex justify-end">
           <button 
              onClick={handleCreateNew}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-md"
            >
              <PlusCircle size={18} />
              <span>Adicionar Novo Livro</span>
            </button>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl max-w-sm w-full">
              <div className="animate-bounce mb-4 text-yellow-500">
                <PartyPopper size={64} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Parabéns!</h3>
              <p className="text-slate-600 px-2">
                Você completou a leitura! Mais um passo na sua jornada de conhecimento.
              </p>
              <button 
                onClick={() => setShowCelebration(false)}
                className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-full text-sm font-bold"
              >
                Continuar
              </button>
          </div>
        </div>
      )}

      {challenges.map((challenge) => {
          const isCompleted = completedIds.has(challenge.id);
          const hasImage = !!challenge.coverImage;
          
          return (
            <div key={challenge.id} className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 group/card transition-all hover:shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
              
              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <button 
                    onClick={() => handleEditClick(challenge)}
                    className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 rounded-lg shadow-sm"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => setItemToDelete(challenge.id)}
                    className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 rounded-lg shadow-sm"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                        <Award size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Desafio: {challenge.month}</h2>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0 flex justify-center md:justify-start">
                    {/* Book Cover Container */}
                    <div className={`w-40 h-60 md:w-48 md:h-72 rounded-lg shadow-xl ${!hasImage ? challenge.coverColor : 'bg-gray-100'} flex flex-col items-center justify-center p-0 text-center text-white transform hover:scale-105 transition-transform duration-300 relative overflow-hidden`}>
                      
                      {hasImage ? (
                        <img 
                          src={challenge.coverImage} 
                          alt={`Capa de ${challenge.title}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-6 flex flex-col items-center justify-center w-full h-full">
                          <Book size={48} className="mb-4 opacity-80" />
                          <h3 className="font-serif font-bold text-lg md:text-xl leading-tight mb-2 line-clamp-3">{challenge.title}</h3>
                          <p className="text-sm opacity-90 line-clamp-2">{challenge.author}</p>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-1 shadow-sm border border-white/30 w-max max-w-[90%]">
                          <CheckCircle size={14} className="text-white flex-shrink-0" />
                          <span className="text-xs font-bold text-white whitespace-nowrap">Lido</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{challenge.title}</h3>
                    <p className="text-lg text-blue-600 font-medium mb-4">por {challenge.author}</p>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                      {challenge.description}
                    </p>

                    <div className="flex items-center space-x-4 max-w-md">
                      <button 
                        onClick={() => handleMarkAsRead(challenge.id)}
                        disabled={isCompleted}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg duration-300 flex items-center justify-center space-x-2 ${
                          isCompleted 
                          ? 'bg-green-600 text-white cursor-default shadow-green-200' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 hover:scale-105'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle size={20} />
                            <span>Leitura Concluída</span>
                          </>
                        ) : (
                          <span>Marcar como Lido</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
      })}

      {/* Edit/Create Modal */}
      {isEditing && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                  {challenges.some(c => c.id === editForm.id) ? 'Editar Desafio' : 'Novo Desafio'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título do Livro</label>
                <input 
                  type="text" 
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nome do livro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Autor</label>
                  <input 
                    type="text" 
                    value={editForm.author}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nome do autor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mês/Título</label>
                  <input 
                    type="text" 
                    value={editForm.month}
                    onChange={(e) => setEditForm({ ...editForm, month: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Julho ou Extra"
                  />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Capa do Livro (URL da Imagem)</label>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={editForm.coverImage || ''}
                      onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="https://exemplo.com/capa.jpg"
                    />
                    {editForm.coverImage && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={editForm.coverImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                 </div>
                 <p className="text-xs text-slate-400 mt-1">Deixe em branco para usar a capa colorida padrão.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cor de Fundo (Padrão)</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditForm({ ...editForm, coverColor: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                        editForm.coverColor === color.value 
                        ? 'ring-4 ring-offset-2 ring-blue-500 scale-110' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Sinopse ou motivo do desafio..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200 border-t-4 border-red-500">
            <div className="flex flex-col items-center text-center">
               <div className="p-3 bg-red-100 rounded-full text-red-600 mb-4">
                 <AlertTriangle size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">Excluir Desafio?</h3>
               <p className="text-slate-500 text-sm mb-6">
                 Deseja realmente excluir este item? Ele será movido para a lixeira e não aparecerá mais para os usuários.
               </p>
               
               <div className="flex w-full gap-3">
                 <button 
                   onClick={() => setItemToDelete(null)}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                 >
                   Não
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                 >
                   Sim
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyChallenge;