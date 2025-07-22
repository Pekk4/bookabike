import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';

import useKeycloak from '../hooks/useKeycloak';

// !!
const BANNER_HEIGHT = 80; // TODO
// !!

const MenuBar = () => {
  const { keycloak, authenticated } = useKeycloak();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto z-50">
      <div className="relative w-full">
        <div className="bg-gradient-to-b from-org-gray to-black w-screen border-b-2 border-orange-500 h-20 relative">
          {/* TODO: adjust shadows etc */}
          <Link to="/">
            <div
              className="
                absolute left-1/2 bottom-0
                w-[179px] h-[71px]
                -translate-x-1/2 translate-y-1/2
                bg-[url(http://static.moottoripyora.org/img/logo.png)] bg-no-repeat bg-center
                #pointer-events-none # TODO: delete?
                drop-shadow-sm
                drop-shadow-white
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
                    keycloak?.logout();
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
                />
              )}
            </div>
          </div>
        </div>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            '& .MuiPaper-root': {
              marginTop: `${BANNER_HEIGHT}px`,
              height: `calc(100% - ${BANNER_HEIGHT}px)`,
            },
          }}
        >
          <div
            className="w-[250px]"
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <Link to="/">
              <div className="w-full text-left p-4 hover:bg-orange-500 hover:cursor-pointer hover:text-white transition">
                Etusivu
              </div>
            </Link>
            <Link to="/calendar">
              <div className="w-full text-left p-4 hover:bg-orange-500 hover:cursor-pointer hover:text-white transition">
                Varauskalenteri
              </div>
            </Link>
            <Link to="/my-bookings">
              <div className="w-full text-left p-4 hover:bg-orange-500 hover:cursor-pointer hover:text-white transition">
                Omat varaukseni
              </div>
            </Link>
            <Link to="/me">
              <div className="w-full text-left p-4 hover:bg-orange-500 hover:cursor-pointer hover:text-white transition">
                Omat tiedot
              </div>
            </Link>
            <Link to="/manage-bookings">
              <div className="w-full text-left p-4 hover:bg-orange-500 hover:cursor-pointer hover:text-white transition">
                Varaustenhallinta
              </div>
            </Link>
            <Link to="/admin-bookings">
              <div className="w-full text-left p-4 hover:bg-orange-500 hover:cursor-pointer hover:text-white transition">
                Admin varaukset
              </div>
            </Link>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default MenuBar;
