export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const maxBookingLength = 3; // Maximum number of days for a booking, starting from 0

export const statusTranslations: Record<string, string> = {
  pending: 'Odottaa',
  confirmed: 'Hyväksytty',
  canceled: 'Peruttu (käyttäjä)',
  wished: 'Toive',
  rejected: 'Varaus evätty',
  revoked: 'Peruttu (admin)',
};
