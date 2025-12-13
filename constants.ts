import { AgendaEvent, BookChallenge, GalleryPhoto } from './types';

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Chronological Order of Bible Books
export const BIBLE_BOOKS = [
  // Beginnings & Patriarchs
  { name: "Gênesis", chapters: 50 },
  { name: "Jó", chapters: 42 },
  
  // Exodus & Conquest
  { name: "Êxodo", chapters: 40 },
  { name: "Levítico", chapters: 27 },
  { name: "Números", chapters: 36 },
  { name: "Deuteronômio", chapters: 34 },
  { name: "Josué", chapters: 24 },
  { name: "Juízes", chapters: 21 },
  { name: "Rute", chapters: 4 },
  
  // United Kingdom
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Crônicas", chapters: 29 },
  { name: "Salmos", chapters: 150 },
  { name: "Cânticos", chapters: 8 },
  { name: "Provérbios", chapters: 31 },
  { name: "Eclesiastes", chapters: 12 },
  
  // Divided Kingdom
  { name: "1 Reis", chapters: 22 },
  { name: "2 Reis", chapters: 25 },
  { name: "2 Crônicas", chapters: 36 },
  { name: "Isaías", chapters: 66 },
  { name: "Oséias", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amós", chapters: 9 },
  { name: "Obadias", chapters: 1 },
  { name: "Jonas", chapters: 4 },
  { name: "Miquéias", chapters: 7 },
  { name: "Naum", chapters: 3 },
  { name: "Habacuque", chapters: 3 },
  { name: "Sofonias", chapters: 3 },
  { name: "Jeremias", chapters: 52 },
  { name: "Lamentações", chapters: 5 },
  
  // Exile & Return
  { name: "Ezequiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Ester", chapters: 10 },
  { name: "Esdras", chapters: 10 },
  { name: "Neemias", chapters: 13 },
  { name: "Ageu", chapters: 2 },
  { name: "Zacarias", chapters: 14 },
  { name: "Malaquias", chapters: 4 },
  
  // Gospels & Life of Jesus
  { name: "Mateus", chapters: 28 },
  { name: "Marcos", chapters: 16 },
  { name: "Lucas", chapters: 24 },
  { name: "João", chapters: 21 },
  
  // Early Church
  { name: "Atos", chapters: 28 },
  { name: "Tiago", chapters: 5 },
  { name: "Gálatas", chapters: 6 },
  { name: "1 Tessalonicenses", chapters: 5 },
  { name: "2 Tessalonicenses", chapters: 3 },
  { name: "1 Coríntios", chapters: 16 },
  { name: "2 Coríntios", chapters: 13 },
  { name: "Romanos", chapters: 16 },
  { name: "Efésios", chapters: 6 },
  { name: "Filipenses", chapters: 4 },
  { name: "Colossenses", chapters: 4 },
  { name: "Filemom", chapters: 1 },
  { name: "1 Pedro", chapters: 5 },
  { name: "2 Pedro", chapters: 3 },
  { name: "1 Timóteo", chapters: 6 },
  { name: "Tito", chapters: 3 },
  { name: "Hebreus", chapters: 13 },
  { name: "2 Timóteo", chapters: 4 },
  { name: "Judas", chapters: 1 },
  { name: "1 João", chapters: 5 },
  { name: "2 João", chapters: 1 },
  { name: "3 João", chapters: 1 },
  { name: "Apocalipse", chapters: 22 }
];

export const EVENTS: AgendaEvent[] = [
  {
    id: 'jan',
    title: 'Discussão do plano de leitura bíblica',
    date: '2025-01-01',
    displayDate: 'Janeiro - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Encontro mensal para discussão e compartilhamento sobre a leitura bíblica.'
  },
  {
    id: 'fev',
    title: 'Discussão do livro Devoção Extravagante',
    date: '2025-02-01',
    displayDate: 'Fevereiro - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Análise e conversa sobre o livro Devoção Extravagante de Emi Sousa.'
  },
  {
    id: 'mar',
    title: 'Discussão do plano de leitura bíblica',
    date: '2025-03-01',
    displayDate: 'Março - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Encontro mensal para discussão e compartilhamento sobre a leitura bíblica.'
  },
  {
    id: 'abr',
    title: 'Discussão do livro Cultura de Oração',
    date: '2025-04-01',
    displayDate: 'Abril - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Análise e conversa sobre o livro Cultura de Oração de Mike Duque Estrada.'
  },
  {
    id: 'mai',
    title: 'Discussão do plano de leitura bíblica',
    date: '2025-05-01',
    displayDate: 'Maio - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Encontro mensal para discussão e compartilhamento sobre a leitura bíblica.'
  },
  {
    id: 'jun',
    title: 'Discussão do livro Caminhos Antigos',
    date: '2025-06-01',
    displayDate: 'Junho - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Análise e conversa sobre o livro Caminhos Antigos de J.C. Ryle.'
  },
  {
    id: 'jul',
    title: 'Discussão do plano de leitura bíblica',
    date: '2025-07-01',
    displayDate: 'Julho - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Encontro mensal para discussão e compartilhamento sobre a leitura bíblica.'
  },
  {
    id: 'ago',
    title: 'Discussão do livro Chamados para Cantar',
    date: '2025-08-01',
    displayDate: 'Agosto - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Análise e conversa sobre o livro Chamados para Cantar de Rachel Culver.'
  },
  {
    id: 'set',
    title: 'Discussão do plano de leitura bíblica',
    date: '2025-09-01',
    displayDate: 'Setembro - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Encontro mensal para discussão e compartilhamento sobre a leitura bíblica.'
  },
  {
    id: 'out',
    title: 'Discussão do livro Misericórdia Triunfante',
    date: '2025-10-01',
    displayDate: 'Outubro - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Análise e conversa sobre o livro Misericórdia Triunfante de Dale Anderson.'
  },
  {
    id: 'nov',
    title: 'Discussão do plano de leitura bíblica',
    date: '2025-11-01',
    displayDate: 'Novembro - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Encontro mensal para discussão e compartilhamento sobre a leitura bíblica.'
  },
  {
    id: 'dez',
    title: 'Discussão do livro Bíblia 360',
    date: '2025-12-01',
    displayDate: 'Dezembro - Sem data definida',
    time: '19:30',
    location: 'FHOP',
    description: 'Análise e conversa sobre o livro Bíblia 360 de Daniel Lim.'
  }
];

export const INITIAL_CHALLENGES: BookChallenge[] = [
  {
    id: '1',
    title: "Devoção Extravagante",
    author: "Emi Sousa",
    description: "Um chamado para retornar ao primeiro amor e cultivar uma paixão ardente por Jesus, inspirado na vida e na adoração de Maria de Betânia.",
    coverColor: "bg-rose-700",
    month: "Janeiro / Fevereiro"
  },
  {
    id: '2',
    title: "Cultura de Oração",
    author: "Mike Duque Estrada",
    description: "Princípios práticos e teológicos para estabelecer uma vida de oração consistente, tanto no lugar secreto quanto na oração corporativa.",
    coverColor: "bg-blue-700",
    month: "Março / Abril"
  },
  {
    id: '3',
    title: "Caminhos Antigos",
    author: "J.C. Ryle",
    description: "Uma obra clássica que convoca a igreja a retornar às verdades fundamentais da fé cristã e à santidade prática, trilhando as veredas antigas.",
    coverColor: "bg-amber-700",
    month: "Maio / Junho"
  },
  {
    id: '4',
    title: "Chamados para Cantar",
    author: "Rachel Culver",
    description: "Uma visão bíblica sobre o ministério de música e canto na casa de oração, explorando o papel profético e sacerdotal da adoração.",
    coverColor: "bg-purple-700",
    month: "Julho / Agosto"
  },
  {
    id: '5',
    title: "Misericórdia Triunfante",
    author: "Dale Anderson",
    description: "Uma mensagem de esperança e restauração, revelando como a misericórdia de Deus supera o julgamento e restaura vidas para um propósito maior.",
    coverColor: "bg-emerald-700",
    month: "Setembro / Outubro"
  },
  {
    id: '6',
    title: "Bíblia 360",
    author: "Daniel Lim",
    description: "Um guia para imersão total nas Escrituras, incentivando a leitura sistemática, o estudo panorâmico e a meditação profunda em toda a Bíblia.",
    coverColor: "bg-slate-800",
    month: "Novembro / Dezembro"
  }
];

export const DEFAULT_PHOTOS: GalleryPhoto[] = [];