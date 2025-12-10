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
    id: '1',
    title: 'Culto de Jovens - FHOP',
    date: '2024-06-15',
    time: '19:30',
    location: 'Auditório Principal',
    description: 'Uma noite de adoração e estudo profundo da palavra.'
  },
  {
    id: '2',
    title: 'Café Literário',
    date: '2024-06-22',
    time: '09:00',
    location: 'Cafeteria do Hall',
    description: 'Discussão sobre o desafio do livro do mês.'
  },
  {
    id: '3',
    title: 'Vigília de Oração',
    date: '2024-07-05',
    time: '23:00',
    location: 'Sala de Oração',
    description: 'Intercessão pelo avivamento da nossa nação.'
  }
];

export const INITIAL_CHALLENGES: BookChallenge[] = [
  {
    id: '1',
    title: "Cristianismo Puro e Simples",
    author: "C.S. Lewis",
    description: "Uma obra clássica que explora a essência da fé cristã, removendo as complexidades denominacionais e focando no que realmente importa. Leitura obrigatória para fortalecer os fundamentos.",
    coverColor: "bg-amber-700",
    month: "Junho"
  }
];

export const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    id: 'def1',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop',
    description: 'Momento de Leitura em Grupo',
    date: '2024-05-20'
  },
  {
    id: 'def2',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    description: 'Café Literário e Comunhão',
    date: '2024-06-10'
  },
  {
    id: 'def3',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    description: 'Noite de Adoração',
    date: '2024-06-15'
  }
];