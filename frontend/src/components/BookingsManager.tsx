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

import { AdminBooking } from '../types';

interface BookingsManagerProps {
  bookings: AdminBooking[];
}

const statusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'success';
    case 'canceled':
      return 'error';
    default:
      return 'default';
  }
};

const BookingsManager = ({ bookings }: BookingsManagerProps) => {
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
                    <Chip label={booking.status} color={statusColor(booking.status)} />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        style={{ marginRight: 8 }}
                      >
                        Hyväksy
                      </Button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button variant="contained" color="error" size="small">
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
