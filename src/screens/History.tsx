import { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, Clock, Search } from 'lucide-react';

interface HistoryProps {
  setCurrentView: (view: string) => void;
  employee: any;
}

export default function History({ setCurrentView, employee }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const history = [
    { id: 'ANX-2023-089', date: 'Oct 24, 2023', ctc: '$145,000', status: 'Active', type: 'Annual Revision' },
    { id: 'ANX-2022-042', date: 'Oct 15, 2022', ctc: '$125,000', status: 'Superseded', type: 'Annual Revision' },
    { id: 'ANX-2021-112', date: 'Nov 01, 2021', ctc: '$110,000', status: 'Superseded', type: 'Initial Offer' },
  ];

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted">No employee selected.</p>
        <button onClick={() => setCurrentView('directory')} className="mt-4 text-primary font-semibold hover:underline">Go back to Directory</button>
      </div>
    );
  }

  const filteredHistory = history.filter(doc => 
    doc.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => setCurrentView('directory')}
          className="p-2 mr-4 text-muted hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">Compensation History</h1>
          <p className="text-muted mt-1">{employee.name} • {employee.role}</p>
        </div>
      </div>

      <div className="bg-surface rounded-ui shadow-ui overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-text flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Past Annexures
          </h2>
          <button 
            onClick={() => setCurrentView('builder')}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Create New Annexure
          </button>
        </div>
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search by Document ID or Type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredHistory.length > 0 ? filteredHistory.map((doc) => (
            <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <p className="font-semibold text-text">{doc.type}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${doc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1">{doc.id} • Effective: {doc.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-0.5">Total CTC</p>
                  <p className="font-bold text-text font-mono">{doc.ctc}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-muted hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors" title="View Document">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-muted hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors" title="Download PDF">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted">
              No annexures found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
