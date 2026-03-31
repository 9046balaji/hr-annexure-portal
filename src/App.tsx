/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './screens/Dashboard';
import Directory from './screens/Directory';
import Builder from './screens/Builder';
import Preview from './screens/Preview';
import History from './screens/History';
import BulkWizard from './screens/BulkWizard';
import Analytics from './screens/Analytics';
import Settings from './screens/Settings';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedEmployeesForBulk, setSelectedEmployeesForBulk] = useState<any[]>([]);
  const [annexureData, setAnnexureData] = useState({
    employee: { name: 'Alex Chen', role: 'Senior Frontend Engineer' },
    fixed: { basic: 60000, hra: 30000, special: 20000, lta: 5000 },
    variable: { bonus: 20000, retention: 10000 },
    deductions: { pf: 7200, insurance: 1200 },
    notes: {} as Record<string, string>
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Topbar setCurrentView={setCurrentView} />
        
        <main className="flex-1 mt-16 p-8 overflow-y-auto">
          {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
          {currentView === 'directory' && (
            <Directory 
              setCurrentView={setCurrentView} 
              setSelectedEmployee={setSelectedEmployee}
              setSelectedEmployeesForBulk={setSelectedEmployeesForBulk}
            />
          )}
          {currentView === 'builder' && (
            <Builder 
              setCurrentView={setCurrentView} 
              annexureData={annexureData} 
              setAnnexureData={setAnnexureData} 
            />
          )}
          {currentView === 'history' && (
            <History 
              setCurrentView={setCurrentView} 
              employee={selectedEmployee} 
            />
          )}
          {currentView === 'bulkwizard' && (
            <BulkWizard 
              setCurrentView={setCurrentView} 
              selectedEmployees={selectedEmployeesForBulk} 
            />
          )}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'settings' && <Settings />}
        </main>
      </div>

      {currentView === 'preview' && (
        <Preview 
          setCurrentView={setCurrentView} 
          annexureData={annexureData} 
        />
      )}
    </div>
  );
}
