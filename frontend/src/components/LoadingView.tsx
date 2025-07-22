import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingView: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen text-orange-500">
    <CircularProgress color="inherit" />
  </div>
);

export default LoadingView;
