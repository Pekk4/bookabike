import React from 'react';
import { CircularProgress } from '@mui/material';

/**
 * LoadingView component that displays a loading spinner centered on the screen.
 * Used mostly while waiting for Keycloak session to be initialized.
 *
 * @returns A centered, orange coloured loading spinner.
 */
const LoadingView: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen text-orange-500">
    <CircularProgress color="inherit" />
  </div>
);

export default LoadingView;
