

export const createDate = (year: number, months?: number, day?: number) => {
  const date = new Date();

  date.setFullYear(year);
  if (months) {
    date.setMonth(months);
  }
  if (day) {
    date.setDate(day);
  }
  return date;
}