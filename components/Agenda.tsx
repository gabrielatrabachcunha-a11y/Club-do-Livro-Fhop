import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Edit2, X, Save, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { EVENTS } from '../constants';
import { AgendaEvent, RecycleBinItem } from '../types';

interface Props {
  isAdmin?: boolean;
}

const Agenda: React.FC<Props> = ({ isAdmin = false }) => {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadData = () => {
    try {
      const savedEvents = localStorage.getItem('fhop_agenda_events');
      if (savedEvents) {
        return JSON.parse(savedEvents);
      } else {
        return EVENTS;
      }
    } catch (e) {
      return EVENTS;
    }
  };

  useEffect(() => {
    // Initial load
    setEvents(loadData());

    // 1. Listen for storage events (Tab to Tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fhop_agenda_events') {
        setEvents(loadData());
      }
    };

    // 2. Listen for local events (Component to Component sync)
    const handleLocalUpdate = () => {
      setEvents(loadData());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fhop_data_update_agenda', handleLocalUpdate);

    // 3. POLLING (Safety Net): Check every 2 seconds for changes
    // This handles cases where events might be missed or specific browser quirks
    const intervalId = setInterval(() => {
      const currentStored = loadData();
      // Deep comparison to avoid unnecessary re-renders
      if (JSON.stringify(currentStored) !== JSON.stringify(events)) {
        setEvents(currentStored);
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fhop_data_update_agenda', handleLocalUpdate);
      clearInterval(intervalId);
    };
  }, [events]); // Depend on events to make comparison work inside interval closure if needed, though loadData reads fresh

  const saveEventsToStorage = (newEvents: AgendaEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('fhop_agenda_events', JSON.stringify(newEvents));
    // Dispatch custom event to notify other components in same window
    window.dispatchEvent(new Event('fhop_data_update_agenda'));
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    // 1. Find item to delete
    const itemToDeleteObj = events.find(e => e.id === id);
    
    if (itemToDeleteObj) {
      // 2. Move to Recycle Bin
      try {
        const binData = localStorage.getItem('fhop_recycle_bin');
        const bin: RecycleBinItem[] = binData ? JSON.parse(binData) : [];
        
        bin.push({
          deletedAt: new Date().toISOString(),
          type: 'event',
          originalData: itemToDeleteObj
        });
        
        localStorage.setItem('fhop_recycle_bin', JSON.stringify(bin));
        window.dispatchEvent(new Event('fhop_data_update_bin')); // Notify bin
      } catch (e) {
        console.error("Erro ao mover para lixeira", e);
      }

      // 3. Remove from Active List
      const updatedEvents = events.filter(e => e.id !== id);
      saveEventsToStorage(updatedEvents);
    }
    
    setItemToDelete(null);
  };

  const handleAddNew = () => {
    const newEvent: AgendaEvent = {
      id: Date.now().toString(),
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:30',
      location: 'FHOP',
      description: ''
    };
    setEditingEvent(newEvent);
    setIsAddingNew(true);
  };

  const handleEditClick = (event: AgendaEvent) => {
    setEditingEvent({ ...event });
    setIsAddingNew(false);
  };

  const handleSaveEdit = () => {
    if (!editingEvent) return;
    
    if (!editingEvent.title || !editingEvent.date) {
      alert("Por favor, preencha pelo menos o título e a data.");
      return;
    }

    let updatedEvents: AgendaEvent[];
    if (isAddingNew) {
      updatedEvents = [...events, editingEvent];
    } else {
      updatedEvents = events.map(e => e.id === editingEvent.id ? editingEvent : e);
    }
    
    // Sort by date
    updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    saveEventsToStorage(updatedEvents);
    setEditingEvent(null);
    setIsAddingNew(false);
  };

  const handleInputChange = (field: keyof AgendaEvent, value: string) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [field]: value });
    }
  };

  // If user is not admin and list is empty (and explicitly saved as empty array), show nothing or message
  const isEmpty = events.length === 0;

  if (isEmpty && !isAdmin) {
    return null; // Hide completely for users if empty
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
             <Calendar size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda Club do Livro</h2>
        </div>
        
        {isAdmin && (
           <button 
             onClick={handleAddNew}
             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg shadow-blue-200"
           >
             <Plus size={16} />
             <span>Novo Evento</span>
           </button>
        )}
      </div>

      {isEmpty ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="flex justify-center mb-3 text-slate-300">
            <Calendar size={48} />
          </div>
          <p className="text-slate-500 font-medium">Nenhum evento agendado no momento.</p>
          {isAdmin && <p className="text-xs text-slate-400 mt-1">Clique em "Novo Evento" para adicionar.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="group relative overflow-hidden bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-1 uppercase tracking-wide">
                    <span>{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                    <span>•</span>
                    <span>{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button 
                      onClick={() => handleEditClick(event)}
                      className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => setItemToDelete(event.id)}
                      className="p-2 bg-white border border-slate-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{isAddingNew ? 'Novo Evento' : 'Editar Evento'}</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input 
                  type="text" 
                  value={editingEvent.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nome do evento"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    value={editingEvent.date}
                    onChange={(e) => {
                      handleInputChange('date', e.target.value);
                      e.target.blur();
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                  <input 
                    type="time" 
                    value={editingEvent.time}
                    onChange={(e) => {
                      handleInputChange('time', e.target.value);
                      e.target.blur();
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
                <input 
                  type="text" 
                  value={editingEvent.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Auditório Principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  value={editingEvent.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Detalhes sobre o evento..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
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
               <h3 className="text-lg font-bold text-slate-800 mb-2">Excluir Evento?</h3>
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

export default Agenda;