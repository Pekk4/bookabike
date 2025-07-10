import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { KeycloakProfile } from 'keycloak-js';

import { UserDataBooking, BookingStatus as b } from '../types';

interface BookingsManagerProps {
  bookings: UserDataBooking[];
  renderActions: (booking: UserDataBooking) => React.ReactNode;
  user?: KeycloakProfile;
}

const statusColor = (status: string) => {
  switch (status) {
    case b.Pending:
      return 'warning';
    case b.Confirmed:
      return 'success';
    case b.Canceled:
      return 'error';
    default:
      return 'default';
  }
};

const statusTranslations: Record<string, string> = {
  pending: 'Odottaa',
  confirmed: 'Hyväksytty',
  canceled: 'Hylätty',
  wished: 'Toive',
};

//const BookingsManager = ({ bookings, onAccept, onReject }: BookingsManagerProps) => {
const BookingsManager = ({ bookings, renderActions, user }: BookingsManagerProps) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center text-center pt-20">
      <TableContainer
        component={Paper}
        style={{
          overflow: 'auto',
          maxHeight: '80vh',
          minHeight: '80vh',
          minWidth: '100vw',
          margin: '0 auto',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Käyttäjä</TableCell>
              <TableCell align="center">Aloitus</TableCell>
              <TableCell align="center">Palautus</TableCell>
              <TableCell align="center">Noutopaikka</TableCell>
              <TableCell align="center">Varaus tehty</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Toimenpiteet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:cursor-pointer hover:bg-gray-50">
                {user && (
                  <TableCell>
                    {user?.firstName} {user?.lastName} <br />
                    <small>{user?.email}</small>
                  </TableCell>
                )}
                {!user && (
                  <TableCell>
                    {booking.user.firstName} {booking.user.lastName} <br />
                    <small>{booking.user.email}</small>
                  </TableCell>
                )}
                <TableCell align="center">
                  {new Date(booking.startDate).toLocaleDateString('fi-FI')}
                </TableCell>
                <TableCell align="center">
                  {new Date(booking.endDate).toLocaleDateString('fi-FI')}
                </TableCell>
                <TableCell align="center">Vantaa</TableCell>
                <TableCell align="center">
                  {new Date(booking.createdAt).toLocaleDateString('fi-FI')}
                  <br />
                  <small>
                    klo{' '}
                    {new Date(booking.createdAt).toLocaleTimeString('fi-FI', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={statusTranslations[booking.status] || booking.status}
                    color={statusColor(booking.status)}
                  />
                </TableCell>
                <TableCell align="center">{renderActions(booking)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookingsManager;
