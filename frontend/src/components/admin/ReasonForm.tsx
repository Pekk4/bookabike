import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

interface ReasonFormProps {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
  label?: string;
}

/**
 * Renders a form for submitting a reason to reject/revoke a booking.
 * Only admins are required to provide a reason.
 *
 * @param onSubmit - Callback function to handle form submission with the reason.
 * @param onCancel - Callback function to handle form cancellation.
 * @param label - Optional label for the reason input field, defaults to 'Perustelu'.
 */
const ReasonForm = ({ onSubmit, onCancel, label = 'Perustelu' }: ReasonFormProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason.trim());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4 pt-10">
      <TextField
        label={label}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        multiline
        minRows={2}
        autoFocus
      />
      <Box className="flex justify-center gap-4 pt-4">
        <Button variant="contained" type="submit" disabled={!reason.trim()}>
          Lähetä
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Peruuta
        </Button>
      </Box>
    </Box>
  );
};

export default ReasonForm;
