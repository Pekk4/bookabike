import { Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type EditOrDeleteBarProps = {
  onEdit: () => void;
  onDelete: () => void;
};

const EditOrDeleteBar = ({ onEdit, onDelete }: EditOrDeleteBarProps) => {
  return (
    // Not sure about this...
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        startIcon={<EditIcon />}
        onClick={onEdit}
      >
        Muokkaa
      </Button>
      <Button
        variant="contained"
        color="error"
        size="medium"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
      >
        Poista
      </Button>
    </Stack>
  );
};

export default EditOrDeleteBar;
