import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function formatTimestamp(timestamp: string): string {
  const date = parseISO(timestamp);

  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd/MM/yyyy');
}

export function generateUniqueNegativeNumber() {
  return -(Date.now() + Math.floor(Math.random() * 10000000));
}
