

export const getMinimalMajorBirthDate = () => {

  const now = new Date();
  const date = new Date();

  date.setFullYear(date.getFullYear() - 18);

  const diff = now.getTime() - date.getTime();
  const daysGone = Math.floor(diff / (1000 * 60 * 60 * 24))

  const minimalDate = new Date();
  minimalDate.setDate(minimalDate.getDate() - daysGone);

  return minimalDate;
}