import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

/**
 * Renders a styled MUI switch component for toggling between views.
 *
 * ViewSwitch is quite a special case, so we style it separately and not in theme.ts
 */
const ViewSwitch = styled(Switch)(() => ({
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

export default ViewSwitch;
