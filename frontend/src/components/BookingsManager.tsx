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

import { UserDataBooking, Booking, BookingStatus } from '../types';

type BookingRow = UserDataBooking | Booking;

interface BookingsManagerProps {
  //bookings: UserDataBooking[];
  bookings: BookingRow[];
  //renderActions: (booking: UserDataBooking) => React.ReactNode;
  renderActions: (booking: BookingRow) => React.ReactNode;
  //user?: KeycloakProfile;
  showUserColumn?: boolean;
}

const statusColor = (status: string): React.CSSProperties | undefined => {
  switch (status) {
    case BookingStatus.Pending:
      return { backgroundColor: '#ed6c02', color: '#fff' }; // orange
    case BookingStatus.Confirmed:
      return { backgroundColor: '#2e7d32', color: '#fff' }; // green
    case BookingStatus.Canceled:
      return { backgroundColor: '#888888', color: '#fff' }; // grey
    case BookingStatus.Revoked:
      return { backgroundColor: '#888888', color: '#fff' }; // grey
    case BookingStatus.Rejected:
      return { backgroundColor: '#d32f2f', color: '#fff' }; // red
    case BookingStatus.Wished:
      return { backgroundColor: '#D8CDEA', color: '#222' }; // light purple
    default:
      return undefined;
  }
};

const statusTranslations: Record<string, string> = {
  pending: 'Odottaa',
  confirmed: 'Hyväksytty',
  canceled: 'Peruttu (käyttäjä)',
  wished: 'Toive',
  rejected: 'Varaus evätty',
  revoked: 'Peruttu (vastaava)',
};

//const BookingsManager = ({ bookings, onAccept, onReject }: BookingsManagerProps) => {
const BookingsManager = ({
  bookings,
  renderActions,
  showUserColumn = false,
}: BookingsManagerProps) => {
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
              {showUserColumn && <TableCell>Käyttäjä</TableCell>}
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
                {/*user && (
                  <TableCell>
                    {user?.firstName} {user?.lastName} <br />
                    <small>{user?.email}</small>
                  </TableCell>
                )*/}
                {showUserColumn && 'user' in booking && (
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
                    style={statusColor(booking.status)}
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
