import React from 'react';
import { TrendingUp, Package, Users, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AnalisisCard = ({ data, solicitud, onClick, onDownload }) => {
  const promedio = data.semBaja && data.semAlta ? ((parseFloat(data.semBaja) + parseFloat(data.semAlta)) / 2).toFixed(2) : '0';

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden border-l-4 border-blue-900"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 uppercase">
            {solicitud?.nombre || 'Solicitud Borrada'}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
            <Users size={14} /> Ref: {data.referencias?.[0]?.nombre || 'Sin referencias'}
          </div>
        </div>
        <Button 
          variant="secondary" 
          className="p-2 h-auto text-red-600 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(data.id);
          }}
        >
          <Download size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-50">
          <div className="flex items-center gap-1 text-[10px] text-blue-800 font-bold uppercase mb-1">
            <TrendingUp size={12} /> Prom. Ventas
          </div>
          <div className="text-lg font-black text-blue-950">${promedio}</div>
        </div>
        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-50">
          <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-bold uppercase mb-1">
            <Package size={12} /> Inventario
          </div>
          <div className="text-lg font-black text-emerald-950">${parseFloat(data.totalInv || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="text-[10px] text-gray-400 mt-4 italic">
        Actualizado el {new Date(data.updatedAt || data.createdAt).toLocaleString()}
      </div>
    </div>
  );
};
