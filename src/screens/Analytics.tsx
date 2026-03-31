import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Analytics & Audit Readiness</h1>
        <p className="text-muted mt-1">Monitor compensation trends and compliance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-ui shadow-ui">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted">Average CTC</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text">$124,500</div>
          <p className="text-xs text-muted mt-2"><span className="text-emerald-600 font-medium">+4.2%</span> year over year</p>
        </div>
        
        <div className="bg-surface p-6 rounded-ui shadow-ui">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted">Compliance Score</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text">98%</div>
          <p className="text-xs text-muted mt-2">Based on recent audit checks</p>
        </div>

        <div className="bg-surface p-6 rounded-ui shadow-ui">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted">Pending Signatures</h3>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text">12</div>
          <p className="text-xs text-muted mt-2">Requires follow-up</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audit Log */}
        <div className="bg-surface rounded-ui shadow-ui overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-text">Recent Audit Log</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { action: 'Bulk Generation', user: 'Sarah Jenkins', time: '2 hours ago', status: 'Success' },
              { action: 'Template Update', user: 'Admin', time: '1 day ago', status: 'Success' },
              { action: 'Policy Violation', user: 'System', time: '2 days ago', status: 'Warning' },
              { action: 'Manual Override', user: 'Sarah Jenkins', time: '3 days ago', status: 'Success' },
            ].map((log, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-4 ${log.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div>
                    <p className="font-semibold text-sm text-text">{log.action}</p>
                    <p className="text-xs text-muted mt-0.5">by {log.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compensation Distribution */}
        <div className="bg-surface rounded-ui shadow-ui p-6">
          <h2 className="text-lg font-bold text-text mb-6">Compensation Distribution</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-text">Engineering</span>
                <span className="text-muted">45%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-text">Sales & Marketing</span>
                <span className="text-muted">30%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-text">Design</span>
                <span className="text-muted">15%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-indigo-300 h-full" style={{ width: '15%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-text">Operations</span>
                <span className="text-muted">10%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-indigo-200 h-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
