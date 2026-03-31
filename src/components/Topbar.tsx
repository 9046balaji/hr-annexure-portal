import { Bell, Search, Plus } from 'lucide-react';

interface TopbarProps {
  setCurrentView: (view: string) => void;
}

export default function Topbar({ setCurrentView }: TopbarProps) {
  return (
    <header className="h-16 bg-surface border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search employees, annexures..." 
            className="w-full pl-10 pr-4 py-2 bg-background border-none rounded-ui text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-muted hover:bg-gray-50 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        
        <div className="flex items-center cursor-pointer">
          <div className="w-8 h-8 bg-indigo-100 text-primary rounded-full flex items-center justify-center font-semibold text-sm mr-3">
            HR
          </div>
          <div className="text-sm">
            <p className="font-semibold text-text leading-none">Sarah Jenkins</p>
            <p className="text-xs text-muted mt-1">HR Manager</p>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentView('builder')}
          className="ml-4 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-ui text-sm font-semibold flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Annexure
        </button>
      </div>
    </header>
  );
}
