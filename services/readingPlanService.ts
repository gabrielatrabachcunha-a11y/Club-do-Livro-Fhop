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
  // Use "Mês 1"..."Mês 6" for the 6-month plan, otherwise use standard names
  const monthLabels = isSixMonth 
    ? ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"]
    : MONTH_NAMES;

  // Initialize plan structure
  monthLabels.forEach(name => {
    plan[name] = [];
  });

  const allChapters = getAllChapters();
  const totalChapters = allChapters.length;

  let chaptersDistributed = 0;
  let currentDayGlobal = 0; // 1 to durationDays

  // Iterate through the calendar year until we reach durationDays
  for (let m = 0; m < 12; m++) {
    // Break if we run out of labels (e.g. for 6 month plan)
    if (m >= monthLabels.length) break;

    const monthName = monthLabels[m];
    const daysThisMonth = daysInMonth[m];

    for (let d = 1; d <= daysThisMonth; d++) {
      currentDayGlobal++;
      
      // If we are past the plan duration (e.g., day 181 of a 180-day plan), stop generating.
      if (currentDayGlobal > durationDays) {
        break;
      }

      // Calculate the target number of chapters that should be finished by the end of today.
      // We use Math.ceil to ensure we stay slightly ahead of schedule to avoid a huge pile at the end.
      // However, for the very last day, we force it to totalChapters.
      let targetTotalChapters;
      if (currentDayGlobal === durationDays) {
        targetTotalChapters = totalChapters;
      } else {
        targetTotalChapters = Math.ceil((currentDayGlobal / durationDays) * totalChapters);
      }
      
      const boundedTarget = Math.min(targetTotalChapters, totalChapters);
      const chaptersForTodayCount = boundedTarget - chaptersDistributed;

      if (chaptersForTodayCount > 0) {
        // Get the slice of chapters for today
        const todaysChapters = allChapters.slice(chaptersDistributed, chaptersDistributed + chaptersForTodayCount);
        
        // Update tracker
        chaptersDistributed += chaptersForTodayCount;

        // Group chapters by book
        const booksToday: Record<string, number[]> = {};
        todaysChapters.forEach(c => {
          if (!booksToday[c.book]) {
            booksToday[c.book] = [];
          }
          booksToday[c.book].push(c.chapter);
        });

        // Create plan items
        Object.entries(booksToday).forEach(([bookName, chapters]) => {
          const start = chapters[0];
          const end = chapters[chapters.length - 1];
          const chapterString = start === end ? `${start}` : `${start}-${end}`;

          plan[monthName].push({
            id: `${durationDays}-${m}-${d}-${bookName}`,
            day: d,
            monthIndex: m,
            book: bookName,
            chapters: chapterString,
            completed: false
          });
        });
      }
    }
    if (currentDayGlobal >= durationDays) break;
  }
  
  // Final safety check: if for any calculation oddity we missed chapters, append them to the last active day
  if (chaptersDistributed < totalChapters) {
     const remaining = allChapters.slice(chaptersDistributed);
     
     // Find the last month that has content, or default to first
     let lastMonthIndex = 0;
     for(let i = monthLabels.length - 1; i >= 0; i--) {
        if (plan[monthLabels[i]].length > 0) {
            lastMonthIndex = i;
            break;
        }
     }
     const lastMonthName = monthLabels[lastMonthIndex];
     
     // Get the last day used in that month
     const lastMonthItems = plan[lastMonthName];
     const lastDay = lastMonthItems.length > 0 ? lastMonthItems[lastMonthItems.length - 1].day : daysInMonth[lastMonthIndex];

     const booksRemaining: Record<string, number[]> = {};
     remaining.forEach(c => {
        if (!booksRemaining[c.book]) booksRemaining[c.book] = [];
        booksRemaining[c.book].push(c.chapter);
     });

     Object.entries(booksRemaining).forEach(([bookName, chapters]) => {
          const start = chapters[0];
          const end = chapters[chapters.length - 1];
          const chapterString = start === end ? `${start}` : `${start}-${end}`;

          plan[lastMonthName].push({
            id: `${durationDays}-overflow-${bookName}`,
            day: lastDay,
            monthIndex: lastMonthIndex,
            book: bookName,
            chapters: chapterString,
            completed: false
          });
     });
  }

  return plan;
};