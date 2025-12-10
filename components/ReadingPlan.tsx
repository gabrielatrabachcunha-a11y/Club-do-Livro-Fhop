import React, { useState, useEffect } from 'react';
import { Check, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { ReadingPlanItem } from '../types';
import { generatePlan } from '../services/readingPlanService';

interface Props {
  mode: 'year' | 'six_months';
}

const ReadingPlan: React.FC<Props> = ({ mode }) => {
  const [plan, setPlan] = useState<Record<string, ReadingPlanItem[]>>({});
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  useEffect(() => {
    // Generate plan structure
    const days = mode === 'year' ? 365 : 180;
    const generated = generatePlan(days);
    setPlan(generated);

    // Smart default open month logic
    const currentMonthIndex = new Date().getMonth();
    const monthNames = Object.keys(generated);
    // Safe access for 6 month plan (which might only have 6 keys)
    const currentMonthName = monthNames[currentMonthIndex];
    
    // If the current month has items, open it. 
    // If not (e.g., 6-month plan in December), open the last month with items or the first month.
    if (currentMonthName && generated[currentMonthName]?.length > 0) {
      setOpenMonth(currentMonthName);
    } else {
      // Find the first month with items for a fresh start, or stay closed
      const firstActiveMonth = monthNames.find(m => generated[m]?.length > 0);
      if (firstActiveMonth) {
         setOpenMonth(firstActiveMonth);
      }
    }

    // Load progress safely
    try {
      const saved = localStorage.getItem(`fhop_progress_${mode}`);
      if (saved) {
        setCheckedIds(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error("Error loading progress", e);
      // Reset if corrupt
      localStorage.removeItem(`fhop_progress_${mode}`);
    }
  }, [mode]);

  const toggleCheck = (id: string) => {
    const newSet = new Set(checkedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCheckedIds(newSet);
    localStorage.setItem(`fhop_progress_${mode}`, JSON.stringify(Array.from(newSet)));
  };

  const calculateProgress = (monthItems: ReadingPlanItem[]) => {
    if (!monthItems || monthItems.length === 0) return 0;
    const completed = monthItems.filter(i => checkedIds.has(i.id)).length;
    return Math.round((completed / monthItems.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {mode === 'year' ? 'Plano Anual de Leitura' : 'Bíblia em 6 Meses'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {mode === 'year' 
            ? 'Uma jornada completa pela Bíblia em 365 dias.' 
            : 'Desafio intensivo: Toda a Bíblia em 180 dias.'}
          {' '}Siga a ordem cronológica dos eventos.
        </p>

        <div className="space-y-4">
          {Object.entries(plan).map(([month, items]) => {
            const hasItems = items && items.length > 0;
            const progress = calculateProgress(items);
            const isOpen = openMonth === month;

            return (
              <div key={month} className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'}`}>
                <button 
                  onClick={() => setOpenMonth(isOpen ? null : month)}
                  className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-blue-50/50' : 'bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`font-semibold ${isOpen ? 'text-blue-700' : 'text-slate-700'}`}>{month}</span>
                    {hasItems && (
                      <div className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                        {progress}% Concluído
                      </div>
                    )}
                  </div>
                  {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="bg-white border-t border-slate-100">
                    {!hasItems ? (
                      <div className="p-8 text-center flex flex-col items-center text-slate-400">
                        <BookOpen size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma leitura agendada para este mês.</p>
                      </div>
                    ) : (
                      items.map((item) => {
                        const isChecked = checkedIds.has(item.id);
                        return (
                          <div key={item.id} className="group flex flex-col border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${isChecked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                  {item.day}
                                </div>
                                <div>
                                  <p className={`font-medium transition-colors ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                    {item.book}
                                  </p>
                                  <p className="text-xs text-slate-500">Capítulos {item.chapters}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleCheck(item.id); }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isChecked 
                                      ? 'bg-green-500 text-white shadow-md scale-105' 
                                      : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                  }`}
                                >
                                  <Check size={16} strokeWidth={3} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReadingPlan;