import { LayoutDashboard, LogOut, Receipt } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  role: string;
}

function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');

    navigate('/login');
  };

  const isEmployee = role === 'Employee';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">L</div>

        <span>LedgerFlow</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to={isEmployee ? '/employee' : '/accountant'}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to={isEmployee ? '/employee' : '/accountant'}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <Receipt size={18} />
          {isEmployee ? 'My Expenses' : 'Expenses'}
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
