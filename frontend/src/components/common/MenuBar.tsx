import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';

import useKeycloak from '@hooks/useKeycloak';
import DrawerMenu from '@components/common/DrawerMenu';

/**
 * MenuBar component that displays the top navigation bar with a logo, login/logout button,
 * and a drawer for navigation links.
 */
const MenuBar = () => {
  const { keycloak, authenticated, isAdmin } = useKeycloak();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto z-10">
      <div
        className="
          bg-gradient-to-b from-org-gray to-black w-full
          border-b-2 border-orange-500 h-20 relative
        "
      >
        <Link to="/">
          <div
            className="
              absolute left-1/2 bottom-0
              w-[179px] h-[71px]
              -translate-x-1/2 translate-y-1/2
              bg-[url(./assets/images/logo.png)] bg-no-repeat bg-center
              drop-shadow-[20px_-4px_10px_rgba(255,255,255,0.75)]
            "
          />
          {/* stupid shit, but to have a symmetrical shadow around the logo, this is the way */}
          <div
            className="
              absolute left-1/2 bottom-0
              w-[179px] h-[71px]
              -translate-x-1/2 translate-y-1/2
              bg-[url(./assets/images/logo.png)] bg-no-repeat bg-center
              drop-shadow-[-20px_-4px_10px_rgba(255,255,255,0.75)]
            "
          />
        </Link>
        <div className="flex flex-row justify-between items-center h-full px-4">
          <IconButton
            onClick={() => setDrawerOpen(true)}
            className="hover:cursor-pointer sm:px-3"
            size="large"
            edge="start"
            sx={{ color: 'white' }}
            aria-label="menu"
          >
            <MenuIcon fontSize="large" className="hover:text-orange-500" />
          </IconButton>
          <div className="hover:cursor-pointer sm:px-3">
            {authenticated ? (
              <LogoutIcon
                onClick={() => {
                  keycloak?.logout({ redirectUri: window.location.origin + '/' });
                }}
                fontSize="large"
                className="text-white hover:text-orange-500"
              />
            ) : (
              <LoginIcon
                onClick={() => {
                  keycloak?.login();
                }}
                fontSize="large"
                className="text-white hover:text-orange-500"
                data-testid="login-button"
              />
            )}
          </div>
        </div>
      </div>
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} isAdmin={isAdmin} />
    </div>
  );
};

export default MenuBar;
