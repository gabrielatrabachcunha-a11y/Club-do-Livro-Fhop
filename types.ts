export interface User {
  name: string;
  birthDate: string; // YYYY-MM-DD
  isMember: boolean;
}

export interface ReadingPlanItem {
  id: string;
  day: number;
  monthIndex: number; // 0-11
  book: string;
  chapters: string; // e.g. "1-3"
  completed: boolean;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface BookChallenge {
  id: string;
  title: string;
  author: string;
  description: string;
  coverColor: string; // Tailwind class
  month: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
}

export interface RecycleBinItem {
  deletedAt: string;
  type: 'event' | 'challenge' | 'photo';
  originalData: AgendaEvent | BookChallenge | GalleryPhoto;
}