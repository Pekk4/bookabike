import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

interface ReasonFormProps {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
  label?: string;
}

const ReasonForm = ({ onSubmit, onCancel, label = 'Perustelu' }: ReasonFormProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason.trim());
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label={label}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        multiline
        minRows={2}
        autoFocus
      />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
