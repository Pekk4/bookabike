//import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { UserDataBooking } from '../types';

interface BookingCardProps {
  booking: UserDataBooking;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

//const BookingCard: React.FC = () => (
const BookingCard = ({ booking }: BookingCardProps) => {
  // Keycloak allows lowercased names
  const firstName = capitalize(booking.user.firstName);
  const lastName = capitalize(booking.user.lastName);

  return (
    <Card>
      <CardContent>
        {/*<Typography className="p-1.5" variant="h6" component="div">
          Etunimi Sukunimi (username)
        </Typography>
        */}
        <Typography className="p-1.5" variant="h6" component="div">
          {firstName} {lastName} ({booking.user.username})
        </Typography>
        <Typography className="p-1.5" variant="body2">
          Aloitus: {new Date(booking.startDate).toLocaleDateString('fi-FI')}
        </Typography>
        {/*<Typography variant="body2" color="text.secondary">*/}
        <Typography className="p-1.5" variant="body2">
          Palautus: {new Date(booking.endDate).toLocaleDateString('fi-FI')}
        </Typography>
        <Typography className="p-1.5" variant="body2">
          Status: {booking.status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
