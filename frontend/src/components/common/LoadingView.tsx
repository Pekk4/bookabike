import { CircularProgress } from '@mui/material';

interface LoadingViewProps {
  inModal?: boolean;
}

/**
 * LoadingView component that displays a centered loading spinner.
 * Used mostly while waiting something, e.g. Keycloak session or API call promises.
 * Can be used in a modal or as a full page view.
 *
 * @param inModal - Boolean indicating if the loading spinner is shown in a modal.
 *
 * @returns A centered, orange coloured loading spinner.
 */
const LoadingView = ({ inModal = false }: LoadingViewProps) => (
  <div
    className={
      inModal
        ? 'flex items-center justify-center p-8 text-orange-500'
        : 'flex justify-center items-center min-h-screen text-orange-500'
    }
  >
    <CircularProgress color="inherit" />
  </div>
);

export default LoadingView;
