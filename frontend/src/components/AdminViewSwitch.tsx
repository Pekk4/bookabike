import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

// AdminViewSwitch is a quite special case, so we style it separately and not in theme.ts
const AdminViewSwitch = styled(Switch)(() => ({
  '& .MuiSwitch-track': {
    backgroundColor: '#999999',
    opacity: 1,
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-switchBase': {
    color: '#fff',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#fff',
      },
    },
  },
}));

export default AdminViewSwitch;
