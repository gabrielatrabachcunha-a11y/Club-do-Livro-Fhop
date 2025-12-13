import React from 'react';
import { Package, Gift, Book, PenTool, MessageCircle } from 'lucide-react';

const BookBox: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 md:p-12 shadow-lg text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/20">
              <Gift size={16} />
              <span>Clube de Assinatura</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Box Club do Livro</h1>
            <p className="text-orange-100 text-lg max-w-xl leading-relaxed">
              Uma experiência literária completa entregue diretamente na sua casa a cada dois meses.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Package size={80} className="text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Book size={24} className="text-amber-600" />
            O que é o Box?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            Participe do nosso Box de Livros e receba a cada dois meses em sua casa o livro proposto do mês e uma seleção exclusiva de acessórios pensados para enriquecer seu momento de leitura.
          </p>
          
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <h3 className="font-bold text-amber-800 mb-3">O que vem na caixa?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm">
                  <Book size={16} />
                </div>
                <span className="font-medium">Livro do Mês (Edição Física)</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm flex-shrink-0">
                  <Gift size={16} />
                </div>
                <span className="font-medium">E acessórios como: Gorro, par de meias, canetas, marca paginas, Ecobag, garrafa térmica, Cartela de adesivos, acesso ao curso School.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Não perca essa oportunidade!</h2>
            <p className="text-slate-300 mb-8">
              Garanta sua vaga na próxima remessa e transforme sua rotina de leitura.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-lg font-bold text-slate-900 leading-snug">
                Deseja participar? Entre em contato com a liderança do Club do Livro.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Disclaimer */}
      <div className="text-center text-slate-400 text-sm mt-8">
        <p>* Os itens da caixa podem variar de acordo com a disponibilidade e o tema do mês.</p>
      </div>
    </div>
  );
};

export default BookBox;