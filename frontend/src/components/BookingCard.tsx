//import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
}

//const BookingCard: React.FC = () => (
const BookingCard = ({ booking }: BookingCardProps) => (
  <Card>
    <CardContent>
      <Typography className="p-1.5" variant="h6" component="div">
        Etunimi Sukunimi (username)
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

export default BookingCard;
