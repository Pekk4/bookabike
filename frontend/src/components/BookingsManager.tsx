import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

import { UserDataBooking, BookingStatus as b } from '../types';

interface BookingsManagerProps {
  bookings: UserDataBooking[];
  onAccept: (bookingId: number) => void;
  onReject: (bookingId: number) => void;
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

const BookingsManager = ({ bookings, onAccept, onReject }: BookingsManagerProps) => {
  return (
    <div className="h-screen w-screen grid grid-rows-3 justify-center items-center text-center">
      <div className="row-start-2">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Käyttäjä</TableCell>
                <TableCell>Aloitus</TableCell>
                <TableCell>Palautus</TableCell>
                <TableCell>Varaus tehty</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Toimenpiteet</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:cursor-pointer">
                  <TableCell>
                    {booking.user.firstName} {booking.user.lastName} <br />
                    <small>{booking.user.email}</small>
                  </TableCell>
                  <TableCell>{new Date(booking.startDate).toLocaleDateString('fi-FI')}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString('fi-FI')}</TableCell>
                  <TableCell>
                    {new Date(booking.createdAt).toLocaleDateString('fi-FI')}
                    <br />
                    klo{' '}
                    {new Date(booking.createdAt).toLocaleTimeString('fi-FI', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip label={booking.status} color={statusColor(booking.status)} />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => onAccept(booking.id)}
                      >
                        Hyväksy
                      </Button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => onReject(booking.id)}
                      >
                        Hylkää
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default BookingsManager;
