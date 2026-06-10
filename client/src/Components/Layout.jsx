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
  Package,
  Radio,
  AlertTriangle
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
      'Vehicle Manager': 'bg-blue-900/50 text-blue-300 border-blue-700/50',
      'Jr Executive Engineer': 'bg-purple-900/50 text-purple-300 border-purple-700/50',
      'OIC': 'bg-amber-900/50 text-amber-300 border-amber-700/50',
      'Supplier': 'bg-olive-900/50 text-olive-400 border-olive-700/50',
    };
    return colors[role] || 'bg-military-800 text-military-400 border-military-700';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-military-950">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } flex-shrink-0 bg-military-900 border-r border-olive-700/25 transition-all duration-300 overflow-hidden`}
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
        }}
      >
        <div className="flex flex-col h-full w-72">

          {/* Logo Area */}
          <div className="p-5 border-b border-olive-700/25">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-military-950 rounded-sm border border-olive-700/40 flex items-center justify-center flex-shrink-0">
                <img src="/logo.png" alt="DFMS Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-olive-400 tracking-widest leading-none">DFMS</h1>
                <p className="text-xs text-military-500 tracking-wider uppercase mt-0.5">Defence Fleet Mgmt</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive-500 animate-pulse"></span>
                  <span className="text-xs text-olive-600 font-mono">SECURE</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-olive-700/25 bg-military-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-military-800 rounded-sm flex items-center justify-center border border-olive-700/40 flex-shrink-0">
                <span className="text-olive-400 font-bold font-display text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-military-100 truncate text-sm">{user?.name}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-sm text-xs font-semibold border tracking-wider uppercase ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* System Status */}
          <div className="px-4 py-3 border-t border-olive-700/25 bg-military-950/40">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-3 h-3 text-olive-600" />
              <span className="text-xs text-military-600 font-mono tracking-widest uppercase">Sys Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-500"></span>
              <span className="text-xs text-olive-500 font-mono">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-3 border-t border-olive-700/25">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500/80 hover:bg-red-500/10 hover:text-red-400 rounded-sm transition-all duration-200 font-semibold text-xs uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Bar */}
        <header className="bg-military-900/90 backdrop-blur-sm border-b border-olive-700/25 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-military-800 rounded-sm transition-colors border border-transparent hover:border-olive-700/30"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-military-400" />
                ) : (
                  <Menu className="w-5 h-5 text-military-400" />
                )}
              </button>
              <div className="hidden md:flex items-center gap-2 font-mono text-xs text-military-600">
                <span className="text-olive-700">[</span>
                <span className="text-military-500">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                <span className="text-olive-700">|</span>
                <span className="text-military-500">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-olive-700">]</span>
                <span className="text-olive-600 ml-2">● SECURE CHANNEL</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-military-950/60 border border-olive-700/25 rounded-sm px-3 py-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-mono text-amber-600/80 tracking-wider uppercase">Authorised Personnel Only</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-military-600 uppercase tracking-widest font-mono">Operator</p>
                <p className="font-mono text-sm text-military-200">{user?.email}</p>
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