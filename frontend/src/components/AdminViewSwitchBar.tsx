import Switch from '@mui/material/Switch';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface AdminViewBarProps {
  isCalendarView: boolean;
  onToggleView: () => void;
}

const AdminViewSwitchBar = ({ isCalendarView, onToggleView }: AdminViewBarProps) => {
  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-0 py-12 my-auto w-14 bg-stone-100 border-l-1 border-y-1 rounded-l-md flex flex-col items-center z-10">
      <TableRowsIcon fontSize="large" />
      <Switch color="default" checked={isCalendarView} onChange={onToggleView} />
      <CalendarMonthIcon fontSize="large" />
    </div>
  );
};

export default AdminViewSwitchBar;
