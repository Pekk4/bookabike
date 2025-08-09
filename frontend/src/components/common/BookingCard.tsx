import { Table, TableBody, TableCell, TableRow, TableContainer, Paper, Chip } from '@mui/material';

import { getStatusColor, getStatusTranslation } from '@utils/status';
import { dateLocale } from '@constants';
import { BookingEntry } from '@types';

interface BookingCardProps {
  booking: BookingEntry;
  renderActions: (booking: BookingEntry) => React.ReactNode;
  showUserDetails?: boolean;
}

// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Renders a detailed view of a booking with details and actions.
 * Displays booking information such as user, status, dates, and actions.
 * User details flag is for admin views, as users tends to know their names usually.
 *
 * @param booking - The booking data object to display.
 * @param renderActions - Function to render action buttons for the booking.
 * @param showUserDetails - Boolean to determine if user details should be shown.
 */
const BookingCard = ({ booking, renderActions, showUserDetails = false }: BookingCardProps) => {
  let firstName = '';
  let lastName = '';
  const hasUser = showUserDetails && 'user' in booking && booking.user;
  const startDate = new Date(booking.startDate).toLocaleDateString(dateLocale);
  const endDate = new Date(booking.endDate).toLocaleDateString(dateLocale);
  const createdAt = new Date(booking.createdAt).toLocaleDateString(dateLocale);

  if (hasUser) {
    // Keycloak allows lowercased names, which is not very aesthetic
    firstName = capitalize(booking.user.firstName);
    lastName = capitalize(booking.user.lastName);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {hasUser && (
              <>
                <TableRow>
                  <TableCell>Käyttäjä</TableCell>
                  <TableCell>
                    {firstName} {lastName}
                    <br />({booking.user.username})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Yhteystiedot</TableCell>
                  <TableCell>
                    {booking.user.email}
                    <br />
                    {/* to be implemented: phone number */}
                    +358401234567
                  </TableCell>
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                <Chip
                  label={getStatusTranslation(booking.status)}
                  style={getStatusColor(booking.status)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nouto</TableCell>
              <TableCell>{startDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Palautus</TableCell>
              <TableCell>{endDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Noutopaikka</TableCell>
              <TableCell>Vantaa</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Varaus tehty</TableCell>
              <TableCell>{createdAt}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Toimenpiteet</TableCell>
              <TableCell align="center">{renderActions(booking)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BookingCard;
