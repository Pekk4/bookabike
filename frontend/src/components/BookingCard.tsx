import { Card, CardContent, Chip, Typography } from '@mui/material';

import { getStatusColor, getStatusTranslation } from '../utils/status';

import { BookingEntry } from '../types';

interface BookingCardProps {
  booking: BookingEntry;
  renderActions: (booking: BookingEntry) => React.ReactNode;
  showUserDetails?: boolean;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const BookingCard = ({ booking, renderActions, showUserDetails = false }: BookingCardProps) => {
  let firstName = '';
  let lastName = '';
  const hasUser = showUserDetails && 'user' in booking && booking.user;
  const startDate = new Date(booking.startDate).toLocaleDateString('fi-FI');
  const endDate = new Date(booking.endDate).toLocaleDateString('fi-FI');

  if (hasUser) {
    // Keycloak allows lowercased names
    firstName = capitalize(booking.user.firstName);
    lastName = capitalize(booking.user.lastName);
  }

  return (
    <>
      <Card>
        <CardContent>
          {hasUser && (
            <Typography className="p-1.5" variant="h6" component="div">
              {firstName} {lastName} ({booking.user.username})
            </Typography>
          )}
          {!hasUser && (
            <Typography className="p-1.5" variant="h6" component="div">
              {startDate} - {endDate}
            </Typography>
          )}
          {/*<Typography className="p-1.5" variant="body2">
            Status:{' '}*/}
          <Chip
            label={getStatusTranslation(booking.status)}
            style={getStatusColor(booking.status)}
            className="p-1.5"
          />
          {/*</Typography>*/}
          <Typography className="p-1.5" variant="body2">
            Aloitus: {startDate}
          </Typography>
          {/*<Typography variant="body2" color="text.secondary">*/}
          <Typography className="p-1.5" variant="body2">
            Palautus: {endDate}
          </Typography>
          <Typography className="p-1.5" variant="body2">
            Noutopaikka: To be implemented
          </Typography>
          <Typography className="p-1.5" variant="body2">
            Varaus tehty: {new Date(booking.createdAt).toLocaleDateString('fi-FI')}
          </Typography>
          {renderActions(booking)}
        </CardContent>
      </Card>
    </>
  );
};

export default BookingCard;
