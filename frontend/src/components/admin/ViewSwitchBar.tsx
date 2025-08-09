import TableRowsIcon from '@mui/icons-material/TableRows';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import ViewSwitch from '@components/admin/ViewSwitch';

interface AdminViewBarProps {
  isCalendarView: boolean;
  onToggleView: () => void;
}

const ViewSwitchBar = ({ isCalendarView, onToggleView }: AdminViewBarProps) => {
  return (
    <div
      className="
        fixed top-4 left-1/4 -translate-x-1/2 h-12 w-44
        border-2 border-white rounded-md text-white
        flex flex-row items-center justify-center z-20
      "
    >
      <TableRowsIcon className="!w-7.5 !h-7.5 mx-2" />
      <ViewSwitch checked={isCalendarView} onChange={onToggleView} />
      <CalendarMonthIcon className="!w-7.5 !h-7.5 mx-2" />
    </div>
  );
};

export default ViewSwitchBar;
