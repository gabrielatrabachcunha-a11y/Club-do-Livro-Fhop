import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, X, Calendar, Book, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { RecycleBinItem, AgendaEvent, BookChallenge, GalleryPhoto } from '../types';
import { EVENTS, INITIAL_CHALLENGES } from '../constants';

const RecycleBin: React.FC = () => {
  const [items, setItems] = useState<RecycleBinItem[]>([]);

  const loadData = () => {
    try {
      const saved = localStorage.getItem('fhop_recycle_bin');
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]);
      }
    } catch (e) {
      setItems([]);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fhop_recycle_bin') loadData();
    };
    const handleLocalUpdate = () => loadData();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fhop_data_update_bin', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fhop_data_update_bin', handleLocalUpdate);
    };
  }, []);

  const saveBin = (newItems: RecycleBinItem[]) => {
    setItems(newItems);
    localStorage.setItem('fhop_recycle_bin', JSON.stringify(newItems));
    window.dispatchEvent(new Event('fhop_data_update_bin'));
  };

  const handlePermanentDelete = (index: number) => {
    if (confirm('Tem certeza? Essa ação não pode ser desfeita.')) {
      const newItems = [...items];
      newItems.splice(index, 1);
      saveBin(newItems);
    }
  };

  const handleRestore = (item: RecycleBinItem, index: number) => {
    try {
      if (item.type === 'event') {
        const currentData = localStorage.getItem('fhop_agenda_events');
        const currentList: AgendaEvent[] = currentData ? JSON.parse(currentData) : [];
        currentList.push(item.originalData as AgendaEvent);
        // Sort
        currentList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        localStorage.setItem('fhop_agenda_events', JSON.stringify(currentList));
        window.dispatchEvent(new Event('fhop_data_update_agenda'));
      } 
      else if (item.type === 'challenge') {
        const currentData = localStorage.getItem('fhop_challenges_list');
        const currentList: BookChallenge[] = currentData ? JSON.parse(currentData) : [];
        currentList.push(item.originalData as BookChallenge);
        
        localStorage.setItem('fhop_challenges_list', JSON.stringify(currentList));
        window.dispatchEvent(new Event('fhop_data_update_challenges'));
      }
      else if (item.type === 'photo') {
        const currentData = localStorage.getItem('fhop_gallery_photos');
        const currentList: GalleryPhoto[] = currentData ? JSON.parse(currentData) : [];
        currentList.push(item.originalData as GalleryPhoto);
        
        localStorage.setItem('fhop_gallery_photos', JSON.stringify(currentList));
        window.dispatchEvent(new Event('fhop_data_update_photos'));
      }

      // Remove from bin after restore
      const newItems = [...items];
      newItems.splice(index, 1);
      saveBin(newItems);

    } catch (e) {
      alert("Erro ao restaurar item. Tente liberar espaço.");
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-800 flex items-center gap-2">
            <Trash2 size={28} />
            Lixeira
          </h1>
          <p className="text-red-600">Itens excluídos permanecem aqui até serem removidos permanentemente.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-red-500 uppercase tracking-wider border border-red-100 shadow-sm">
           Acesso Restrito
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
             <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700">A lixeira está vazia</h3>
          <p className="text-slate-500">Nenhum item excluído recentemente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, index) => {
             // Determine icon and title based on type
             let Icon = AlertTriangle;
             let title = "Item Desconhecido";
             let detail = "";
             let badgeColor = "bg-gray-100 text-gray-600";
             let typeLabel = "Outro";

             if (item.type === 'event') {
               Icon = Calendar;
               const data = item.originalData as AgendaEvent;
               title = data.title;
               detail = `${new Date(data.date).toLocaleDateString()} - ${data.location}`;
               badgeColor = "bg-blue-100 text-blue-700";
               typeLabel = "Evento";
             } else if (item.type === 'challenge') {
               Icon = Book;
               const data = item.originalData as BookChallenge;
               title = data.title;
               detail = `${data.author} (${data.month})`;
               badgeColor = "bg-purple-100 text-purple-700";
               typeLabel = "Livro";
             } else if (item.type === 'photo') {
               Icon = ImageIcon;
               const data = item.originalData as GalleryPhoto;
               title = data.description || "Foto";
               detail = `${new Date(data.date).toLocaleDateString()}`;
               badgeColor = "bg-pink-100 text-pink-600";
               typeLabel = "Foto";
             }

             return (
               <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`p-3 rounded-lg ${badgeColor} flex-shrink-0`}>
                         <Icon size={24} />
                    </div>
                    
                    <div className="min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{typeLabel}</span>
                          <span className="text-xs text-slate-400">Excluído em: {new Date(item.deletedAt).toLocaleString()}</span>
                       </div>
                       <h3 className="font-bold text-slate-800 text-lg truncate">{title}</h3>
                       <p className="text-slate-500 text-sm truncate">{detail}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button 
                      onClick={() => handleRestore(item, index)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
                    >
                      <RefreshCw size={16} />
                      Restaurar
                    </button>
                    <button 
                      onClick={() => handlePermanentDelete(index)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm border border-red-100"
                    >
                      <X size={16} />
                      Excluir
                    </button>
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default RecycleBin;