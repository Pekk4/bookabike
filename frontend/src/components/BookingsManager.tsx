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

import { getStatusTranslation, getStatusColor } from '../utils/status';
import BookingCard from './BookingCard';
import useModal from '../hooks/useModal';

import { BookingEntry } from '../types';

interface BookingsManagerProps {
  bookings: BookingEntry[];
  renderActions: (booking: BookingEntry) => React.ReactNode;
  showUserColumn?: boolean;
}

const BookingsManager = ({
  bookings,
  renderActions,
  showUserColumn = false,
}: BookingsManagerProps) => {
  const { showModal } = useModal();

  const getBookingCard = (booking: BookingEntry) => (
    <BookingCard booking={booking} renderActions={renderActions} showUserDetails={showUserColumn} />
  );

  const handleDialog = (booking: BookingEntry) => {
    showModal(getBookingCard(booking), 'close');
  };

  return (
    <div className="max-h-full min-h-1 w-full flex justify-center text-center">
      <TableContainer component={Paper} className="w-full max-h-full min-h-1 overflow-auto">
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
              <TableRow
                key={booking.id}
                className="hover:cursor-pointer hover:bg-orange-400"
                onClick={() => handleDialog(booking)}
              >
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
                    label={getStatusTranslation(booking.status)}
                    style={getStatusColor(booking.status)}
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
