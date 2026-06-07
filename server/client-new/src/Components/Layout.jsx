import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  Menu, 
  X, 
  Home, 
  FileText, 
  CheckCircle, 
  Truck,
  ClipboardList,
  Shield,
  Package
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'manager':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard/vehicle-manager' },
          { icon: FileText, label: 'Create Request', path: '/dashboard/vehicle-manager/create' },
          { icon: ClipboardList, label: 'My Requests', path: '/dashboard/vehicle-manager/requests' },
          { icon: Truck, label: 'Vehicles', path: '/dashboard/vehicle-manager/vehicles' },
        ];
      case 'jee':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard/jr-executive' },
          { icon: ClipboardList, label: 'Pending Approvals', path: '/dashboard/jr-executive/pending-approvals' },
        ];
      case 'oic':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard/oic' },
          { icon: Shield, label: 'Pending Approvals', path: '/dashboard/oic/pending' },
        ];
      case 'supplier':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard/supplier' },
          { icon: Package, label: 'Approved Requests', path: '/dashboard/supplier/approved' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Vehicle Manager': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Jr Executive Engineer': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'OIC': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'Supplier': 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return colors[role] || 'bg-military-700 text-military-300';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-military-950">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } bg-military-900 border-r border-military-700/50 transition-all duration-300 overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-military-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-olive-400">DFMS</h1>
                <p className="text-xs text-military-400">Defence Fleet Management</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-military-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-military-800 rounded-full flex items-center justify-center border-2 border-olive-600/50">
                <span className="text-olive-400 font-semibold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-military-100">{user?.name}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold border ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-military-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-military-900/50 backdrop-blur-sm border-b border-military-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-military-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-military-300" />
              ) : (
                <Menu className="w-6 h-6 text-military-300" />
              )}
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-military-400">Logged in as</p>
                <p className="font-medium text-military-100">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;