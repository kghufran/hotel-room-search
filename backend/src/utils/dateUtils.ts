export const addNoonTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setHours(12, 0, 0, 0); 
  return date.toISOString();
};
