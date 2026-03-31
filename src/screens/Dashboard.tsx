import { FileText, Clock, CheckCircle, ArrowRight, FileSignature, Users } from 'lucide-react';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export default function Dashboard({ setCurrentView }: DashboardProps) {
  const recentAnnexures = [
    { id: 'ANX-2023-089', name: 'Alex Chen', role: 'Senior Frontend Engineer', date: 'Oct 24, 2023', status: 'Pending' },
    { id: 'ANX-2023-088', name: 'Maria Garcia', role: 'Product Designer', date: 'Oct 22, 2023', status: 'Signed' },
    { id: 'ANX-2023-087', name: 'James Wilson', role: 'Marketing Director', date: 'Oct 20, 2023', status: 'Draft' },
    { id: 'ANX-2023-086', name: 'Priya Patel', role: 'Data Scientist', date: 'Oct 18, 2023', status: 'Signed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Signed':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">Signed</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>;
      case 'Draft':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Good morning, Sarah</h1>
        <p className="text-muted mt-1">Here's what's happening with your compensation documents today.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-ui shadow-ui transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted">Pending Approvals</h3>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text">12</div>
          <p className="text-xs text-muted mt-2"><span className="text-emerald-600 font-medium">+2</span> since yesterday</p>
        </div>
        
        <div className="bg-surface p-6 rounded-ui shadow-ui transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted">Issued This Month</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text">48</div>
          <p className="text-xs text-muted mt-2"><span className="text-emerald-600 font-medium">+15%</span> vs last month</p>
        </div>

        <div className="bg-surface p-6 rounded-ui shadow-ui transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted">Signed & Completed</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text">36</div>
          <p className="text-xs text-muted mt-2">75% completion rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface rounded-ui shadow-ui overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-text">Recent Annexures</h2>
            <button className="text-sm text-primary font-semibold hover:text-primary-hover flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentAnnexures.map((annexure) => (
              <div key={annexure.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setCurrentView('preview')}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-primary font-bold text-sm mr-4">
                    {annexure.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-text">{annexure.name}</p>
                    <p className="text-xs text-muted mt-0.5">{annexure.role} â€¢ {annexure.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-muted">{annexure.date}</span>
                  <div className="w-20 flex justify-end">
                    {getStatusBadge(annexure.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-ui shadow-ui p-6">
          <h2 className="text-lg font-bold text-text mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setCurrentView('builder')}
              className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <FileSignature className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-text">New Annexure</p>
                <p className="text-xs text-muted mt-0.5">Create from scratch</p>
              </div>
            </button>
            
            <button 
              onClick={() => setCurrentView('directory')}
              className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Users className="w-5 h-5 text-gray-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-text">Update Existing</p>
                <p className="text-xs text-muted mt-0.5">Modify current employee</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
