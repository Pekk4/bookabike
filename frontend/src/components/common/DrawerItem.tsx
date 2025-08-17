import { Link } from 'react-router-dom';

interface DrawerItemProps {
  to: string;
  label: string;
}

/**
 * DrawerItem component that renders a link inside the drawer menu.
 *
 * @param to - The path to navigate to when the item is clicked.
 * @param label - The text label for the drawer item.
 */
const DrawerItem = ({ to, label }: DrawerItemProps) => (
  <Link to={to}>
    <div
      className="
        w-full text-left p-4 hover:bg-orange-500
        hover:cursor-pointer hover:text-white transition
      "
    >
      {label}
    </div>
  </Link>
);

export default DrawerItem;
