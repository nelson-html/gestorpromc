import React from 'react';
import { Building2, Landmark, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SolicitudCard = ({ data, onClick, onScale }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group border-l-4 border-emerald-500"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase">
            {data.nombre || 'Sin Nombre'}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
            <Building2 size={14} /> {data.nombreNegocio || 'Sin Negocio'}
          </div>
        </div>
        <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-100 text-emerald-800">
          SOLICITUD ACTIVA
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 py-3 bg-gray-50 rounded-xl px-4">
        <div>
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Monto Solicitado</div>
          <div className="text-lg font-extrabold text-emerald-600">
            ${parseFloat(data.monto || 0).toLocaleString()} <span className="text-xs">{data.moneda}</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Producto</div>
          <div className="text-sm font-bold text-gray-700">{data.producto || 'N/A'}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
          <Clock size={12} /> Creado el {new Date(data.createdAt).toLocaleDateString()}
        </div>
        
        <Button 
          variant="primary" 
          className="text-xs px-3 py-1.5 h-auto rounded-lg gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onScale(data.id);
          }}
        >
          Análisis <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};
