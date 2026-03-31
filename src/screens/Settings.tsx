import { Shield, Lock, FileText, Bell, Users, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Settings & Compliance</h1>
        <p className="text-muted mt-1">Manage portal configurations and compliance rules.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface rounded-ui shadow-ui overflow-hidden">
            <nav className="flex flex-col">
              {[
                { id: 'general', label: 'General Settings', icon: Globe, active: true },
                { id: 'compliance', label: 'Compliance Rules', icon: Shield, active: false },
                { id: 'templates', label: 'Document Templates', icon: FileText, active: false },
                { id: 'roles', label: 'Roles & Permissions', icon: Users, active: false },
                { id: 'security', label: 'Security', icon: Lock, active: false },
                { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                    item.active 
                      ? 'border-primary bg-indigo-50/50 text-primary' 
                      : 'border-transparent text-muted hover:bg-gray-50 hover:text-text'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-surface rounded-ui shadow-ui p-8">
            <h2 className="text-xl font-bold text-text mb-6">Company Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Company Name</label>
                  <input 
                    type="text" 
                    defaultValue="Acme Corporation"
                    className="w-full px-4 py-2.5 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Registration Number</label>
                  <input 
                    type="text" 
                    defaultValue="CIN-U72900KA2023PTC123456"
                    className="w-full px-4 py-2.5 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Registered Address</label>
                <textarea 
                  rows={3}
                  defaultValue="123 Innovation Drive, Tech Park, San Francisco, CA 94105"
                  className="w-full px-4 py-2.5 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-ui shadow-ui p-8">
            <h2 className="text-xl font-bold text-text mb-6">Regional Compliance</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="text-sm font-bold text-text">Enforce Minimum Wage Checks</h4>
                  <p className="text-xs text-muted mt-1">Automatically flag salaries below regional minimum wage.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="text-sm font-bold text-text">Strict Statutory Deductions</h4>
                  <p className="text-xs text-muted mt-1">Prevent manual override of calculated statutory deductions (PF, Tax).</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
