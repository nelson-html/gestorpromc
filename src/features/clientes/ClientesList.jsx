import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Search, Filter, ArrowUpDown, Calendar, Phone, MapPin, ClipboardList, CheckCircle2 } from 'lucide-react';

export const ClientesList = ({ onEdit }) => {
  const { prospecciones, solicitudes, analisis } = useDatabase();
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const consolidatedData = useMemo(() => {
    return prospecciones.map(p => {
      const sol = solicitudes.find(s => s.prospeccionId === p.id || (s.nombre === p.nombre && s.telefono === p.telefono));
      const ana = sol ? analisis.find(a => a.solicitudId === sol.id) : null;
      
      // Determine overall stage
      let stage = 'prospeccion';
      if (ana) stage = 'analisis';
      else if (sol) stage = 'solicitud';

      // Use the latest update date
      const lastUpdate = [p.updatedAt, p.createdAt, sol?.updatedAt, sol?.createdAt, ana?.updatedAt, ana?.createdAt]
        .filter(Boolean)
        .sort()
        .reverse()[0];

      return {
        ...p,
        solicitud: sol,
        analisis: ana,
        stage,
        lastUpdate
      };
    });
  }, [prospecciones, solicitudes, analisis]);

  const filteredAndSorted = useMemo(() => {
    let data = [...consolidatedData];
    
    if (filter !== 'all') {
      data = data.filter(item => item.stage === filter);
    }

    data.sort((a, b) => {
      const dateA = new Date(a.lastUpdate || 0);
      const dateB = new Date(b.lastUpdate || 0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return data;
  }, [consolidatedData, filter, sortOrder]);

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'analisis': return { label: 'Análisis', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 };
      case 'solicitud': return { label: 'Solicitud', color: 'bg-blue-100 text-blue-800', icon: ClipboardList };
      default: return { label: 'Prospección', color: 'bg-gray-100 text-gray-800', icon: Calendar };
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-start">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'prospeccion', label: 'Prospección' },
            { id: 'solicitud', label: 'Solicitud' },
            { id: 'analisis', label: 'Análisis' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === opt.id ? 'bg-blue-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all self-end sm:self-auto"
        >
          <ArrowUpDown size={14} className="text-blue-600" />
          Fecha: {sortOrder === 'asc' ? 'Antiguos primero' : 'Recientes primero'}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredAndSorted.map(item => {
          const { label, color, icon: StageIcon } = getStageLabel(item.stage);
          return (
            <div 
              key={item.id}
              onClick={() => onEdit(item)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${color}`}>
                    <StageIcon size={16} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color}`}>
                    {label}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  {item.lastUpdate ? new Date(item.lastUpdate).toLocaleDateString() : 'Sin fecha'}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors uppercase">
                {item.nombre || 'Sin Nombre'}
              </h3>

              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Teléfono</span>
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Phone size={12} className="text-blue-600" /> {item.telefono || '---'}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Monto Int.</span>
                  <span className="text-sm font-black text-emerald-600">
                    ${item.monto ? parseFloat(item.monto).toLocaleString() : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Search className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-400 text-sm font-medium">No se encontraron clientes en esta etapa</p>
          </div>
        )}
      </div>
    </div>
  );
};
