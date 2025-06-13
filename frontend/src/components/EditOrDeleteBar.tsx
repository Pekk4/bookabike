import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EditOrDeleteBar = () => {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        className="p-20 m-20"
        startIcon={<EditIcon />}
        onClick={() => console.log('Edit booking')}
      >
        Muokkaa
      </Button>
      <Button
        className="p-20 m-20"
        variant="contained"
        color="error"
        size="medium"
        startIcon={<DeleteIcon />}
        onClick={() => console.log('Delete booking')}
      >
        Poista
      </Button>
    </div>
  );
};

export default EditOrDeleteBar;
