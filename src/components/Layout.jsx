import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Users, FileText, BarChart3 } from 'lucide-react';

export const Layout = ({ children, activeTab, onTabChange }) => {
  const { stats } = useDatabase();

  const navItems = [
    { id: 'prospecciones', label: 'Prospecciones', icon: Users, count: stats.prospecciones },
    { id: 'solicitudes', label: 'Solicitudes', icon: FileText, count: stats.solicitudes },
    { id: 'analisis', label: 'Análisis', icon: BarChart3, count: stats.analisis },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-50 bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🏦 Financiera Pro
          </h1>
          <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-1">
            {navItems.map(item => (
              <div key={item.id} className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-white/10">
                {item.label}: <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-top-4 duration-500">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-lg mx-auto flex justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'text-blue-900 bg-blue-50 scale-105 px-6' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} className={activeTab === item.id ? 'animate-bounce-short' : ''} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
