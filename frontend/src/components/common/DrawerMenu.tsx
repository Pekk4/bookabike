import Drawer from '@mui/material/Drawer';

import DrawerItem from '@components/common/DrawerItem';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

/**
 * DrawerMenu component that renders a side navigation menu.
 * It includes links to different sections of the application.
 *
 * @param open - Boolean indicating if the drawer is open.
 * @param onClose - Function to call when the drawer should be closed.
 * @param isAdmin - Boolean indicating if the user has admin privileges.
 */
const DrawerMenu = ({ open, onClose, isAdmin }: DrawerMenuProps) => (
  <Drawer
    anchor="left"
    open={open}
    onClose={onClose}
    sx={{
      '& .MuiPaper-root': {
        // 80px is the height of the banner above
        marginTop: `80px`,
        height: `calc(100% - 80px)`,
      },
    }}
  >
    <div className="w-[250px]" role="presentation" onClick={onClose} onKeyDown={onClose}>
      <DrawerItem to="/" label="Etusivu" />
      <DrawerItem to="/calendar" label="Varauskalenteri" />
      <DrawerItem to="/my-bookings" label="Omat varaukseni" />
      {isAdmin && <DrawerItem to="/manage-bookings" label="Varaustenhallinta" />}
    </div>
  </Drawer>
);

export default DrawerMenu;
