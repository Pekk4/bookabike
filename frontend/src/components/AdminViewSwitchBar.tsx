import Switch from '@mui/material/Switch';

interface AdminViewBarProps {
  isCalendarView: boolean;
  onToggleView: () => void;
}

const AdminViewSwitchBar = ({ isCalendarView, onToggleView }: AdminViewBarProps) => {
  return (
    <div className="absolute bottom-0 right-0 px-10 h-12 bg-stone-50 border-t-1 border-l-1 rounded-tl-lg flex items-center">
      <p>
        Taulukkonäkymä <Switch color="default" checked={isCalendarView} onChange={onToggleView} />{' '}
        Kalenterinäkymä
      </p>
    </div>
  );
};

export default AdminViewSwitchBar;
