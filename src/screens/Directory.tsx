import { useState, useMemo } from 'react';
import { Search, MoreHorizontal, Filter, History as HistoryIcon, CheckSquare, Square, FileSignature, Loader2, Download, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';

interface DirectoryProps {
  setCurrentView: (view: string) => void;
  setSelectedEmployee: (emp: any) => void;
  setSelectedEmployeesForBulk?: (emps: any[]) => void;
}

export default function Directory({ setCurrentView, setSelectedEmployee, setSelectedEmployeesForBulk }: DirectoryProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const employees = [
    { id: 'EMP-001', name: 'Alex Chen', role: 'Senior Frontend Engineer', department: 'Engineering', ctc: '$145,000', status: 'Active' },
    { id: 'EMP-002', name: 'Maria Garcia', role: 'Product Designer', department: 'Design', ctc: '$120,000', status: 'Active' },
    { id: 'EMP-003', name: 'James Wilson', role: 'Marketing Director', department: 'Marketing', ctc: '$160,000', status: 'Active' },
    { id: 'EMP-004', name: 'Priya Patel', role: 'Data Scientist', department: 'Engineering', ctc: '$135,000', status: 'Active' },
    { id: 'EMP-005', name: 'David Kim', role: 'Account Executive', department: 'Sales', ctc: '$95,000', status: 'Active' },
    { id: 'EMP-006', name: 'Sarah Johnson', role: 'HR Business Partner', department: 'Human Resources', ctc: '$110,000', status: 'Active' },
    { id: 'EMP-007', name: 'Michael Brown', role: 'Backend Engineer', department: 'Engineering', ctc: '$130,000', status: 'On Leave' },
  ];

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];
  const statuses = ['All', ...Array.from(new Set(employees.map(e => e.status)))];

  const toggleAll = () => {
    if (selectedIds.length === sortedEmployees.length && sortedEmployees.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedEmployees.map(emp => emp.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleViewHistory = (emp: any) => {
    setSelectedEmployee(emp);
    setCurrentView('history');
  };

  const sortedEmployees = useMemo(() => {
    let filteredItems = employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });

    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        let aValue: string | number = a[sortConfig.key as keyof typeof a];
        let bValue: string | number = b[sortConfig.key as keyof typeof b];
        
        if (sortConfig.key === 'ctc') {
          aValue = parseInt((aValue as string).replace(/[^0-9]/g, ''));
          bValue = parseInt((bValue as string).replace(/[^0-9]/g, ''));
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filteredItems;
  }, [sortConfig, departmentFilter, statusFilter, searchQuery]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBatchGenerateClick = () => {
    if (setSelectedEmployeesForBulk) {
      const selected = employees.filter(emp => selectedIds.includes(emp.id));
      setSelectedEmployeesForBulk(selected);
      setCurrentView('bulkwizard');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Employee Directory</h1>
          <p className="text-muted mt-1">Manage compensation profiles for all employees.</p>
        </div>
        <button 
          onClick={() => setCurrentView('builder')}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-ui text-sm font-semibold transition-colors shadow-sm"
        >
          Generate Annexure
        </button>
      </div>

      <div className="bg-surface rounded-ui shadow-ui overflow-hidden relative">
        {/* Batch Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="absolute top-0 left-0 right-0 h-16 bg-indigo-50 border-b border-indigo-100 z-10 flex items-center justify-between px-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md mr-3">
                {selectedIds.length}
              </span>
              <span className="text-sm font-semibold text-primary">Employees Selected</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleBatchGenerateClick}
                className="px-4 py-2 bg-white border border-indigo-200 text-primary rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Configure {selectedIds.length} Annexures
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 text-muted hover:text-text text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search employees by name, ID, or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted font-medium">Department:</span>
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-background border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted font-medium">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-6 w-12">
                  <button onClick={toggleAll} className="text-muted hover:text-primary transition-colors">
                    {selectedIds.length === sortedEmployees.length && sortedEmployees.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('name')}>
                  <div className="flex items-center">Employee {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('role')}>
                  <div className="flex items-center">Role & Dept {sortConfig?.key === 'role' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('ctc')}>
                  <div className="flex items-center">Current CTC {sortConfig?.key === 'ctc' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('status')}>
                  <div className="flex items-center">Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedEmployees.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
                return (
                  <tr 
                    key={emp.id} 
                    className={`transition-colors group ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-gray-50/50'}`}
                  >
                    <td className="py-4 px-6">
                      <button onClick={() => toggleOne(emp.id)} className="text-muted hover:text-primary transition-colors">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary font-bold text-xs mr-3">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-text text-sm">{emp.name}</p>
                          <p className="text-xs text-muted">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-text">{emp.role}</p>
                      <p className="text-xs text-muted">{emp.department}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-text">{emp.ctc}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleViewHistory(emp)}
                          className="text-muted hover:text-primary p-1.5 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
                          title="View History"
                        >
                          <HistoryIcon className="w-4 h-4" />
                        </button>
                        <button className="text-muted hover:text-primary p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-muted">
          <p>Showing {sortedEmployees.length > 0 ? 1 : 0} to {sortedEmployees.length} of {sortedEmployees.length} employees</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
