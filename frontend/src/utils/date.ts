export const getCapitalizedMonth = (date: Date, locale: string = 'fi-FI'): string => {
  const month = date.toLocaleDateString(locale, { month: 'long' });

  return month.charAt(0).toUpperCase() + month.slice(1);
};
