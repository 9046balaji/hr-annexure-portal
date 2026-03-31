import { FileText, Users, LayoutDashboard, Settings, Bell, Search, Plus } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'builder', label: 'Annexure Builder', icon: FileText },
    { id: 'analytics', label: 'Analytics & Audit', icon: Search },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
          <FileText className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight text-text">AnnexurePro</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-2">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (currentView === 'preview' && item.id === 'builder');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-ui transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-muted hover:bg-gray-50 hover:text-text'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-muted'}`} />
              {item.label}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center px-3 py-2.5 rounded-ui transition-colors ${
            currentView === 'settings' 
              ? 'bg-primary/10 text-primary font-semibold' 
              : 'text-muted hover:bg-gray-50 hover:text-text'
          }`}
        >
          <Settings className={`w-5 h-5 mr-3 ${currentView === 'settings' ? 'text-primary' : 'text-muted'}`} />
          Settings & Compliance
        </button>
      </div>
    </aside>
  );
}
