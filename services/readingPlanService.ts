import { ReadingPlanItem } from '../types';
import { BIBLE_BOOKS, MONTH_NAMES } from '../constants';

// Helper to check if a year is a leap year
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

// Generate a flattened list of all chapters in the Bible
const getAllChapters = () => {
  const allChapters: { book: string; chapter: number }[] = [];
  BIBLE_BOOKS.forEach(book => {
    for (let i = 1; i <= book.chapters; i++) {
      allChapters.push({ book: book.name, chapter: i });
    }
  });
  return allChapters;
};

// Logic to generate a plan based on duration (365 days or 180 days)
export const generatePlan = (durationDays: number): Record<string, ReadingPlanItem[]> => {
  const plan: Record<string, ReadingPlanItem[]> = {};
  const today = new Date();
  const year = today.getFullYear();
  // Standard days in month
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const isSixMonth = durationDays === 180;
  const monthLabels = isSixMonth 
    ? ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"]
    : MONTH_NAMES;

  monthLabels.forEach(name => {
    plan[name] = [];
  });

  const allChapters = getAllChapters();
  const totalChapters = allChapters.length;

  let chaptersDistributed = 0;
  let currentDayGlobal = 0;

  for (let m = 0; m < 12; m++) {
    if (m >= monthLabels.length) break;

    const monthName = monthLabels[m];
    const daysThisMonth = daysInMonth[m];

    for (let d = 1; d <= daysThisMonth; d++) {
      currentDayGlobal++;
      if (currentDayGlobal > durationDays) break;

      let targetTotalChapters;
      if (currentDayGlobal === durationDays) {
        targetTotalChapters = totalChapters;
      } else {
        targetTotalChapters = Math.ceil((currentDayGlobal / durationDays) * totalChapters);
      }
      
      const boundedTarget = Math.min(targetTotalChapters, totalChapters);
      const chaptersForTodayCount = boundedTarget - chaptersDistributed;

      if (chaptersForTodayCount > 0) {
        const todaysChapters = allChapters.slice(chaptersDistributed, chaptersDistributed + chaptersForTodayCount);
        chaptersDistributed += chaptersForTodayCount;

        // Group chapters by book
        const booksToday: Record<string, number[]> = {};
        todaysChapters.forEach(c => {
          if (!booksToday[c.book]) booksToday[c.book] = [];
          booksToday[c.book].push(c.chapter);
        });

        // FIXED: Join different books in a single string for the same day
        const bookDisplayNames: string[] = [];
        const chapterDisplayNames: string[] = [];

        Object.entries(booksToday).forEach(([bookName, chapters]) => {
          const start = chapters[0];
          const end = chapters[chapters.length - 1];
          const range = start === end ? `${start}` : `${start}-${end}`;
          
          bookDisplayNames.push(bookName);
          chapterDisplayNames.push(`${bookName} ${range}`);
        });

        plan[monthName].push({
          id: `${durationDays}-${m}-${d}`, // Unique ID per day instead of per book/day
          day: d,
          monthIndex: m,
          book: bookDisplayNames.join(" / "),
          chapters: chapterDisplayNames.join(" | "), // Combines like "Gênesis 50 | Jó 1-3"
          completed: false
        });
      }
    }
    if (currentDayGlobal >= durationDays) break;
  }
  
  return plan;
};