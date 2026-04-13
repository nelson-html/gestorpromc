import React from 'react';
import { MapPin, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ProspeccionCard = ({ data, onClick, onConvert }) => {
  const statusColors = {
    nuevo: 'bg-blue-100 text-blue-800',
    contactado: 'bg-emerald-100 text-emerald-800',
    interesado: 'bg-amber-100 text-amber-800',
    'no-interesado': 'bg-red-100 text-red-800',
    convertido: 'bg-purple-100 text-purple-800'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900" />
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors uppercase">
            {data.nombre || 'Sin Nombre'}
          </h3>
          <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500 font-medium">
            {data.lugar && <span className="flex items-center gap-1"><MapPin size={14}/> {data.lugar}</span>}
            {data.telefono && <span className="flex items-center gap-1"><Phone size={14}/> {data.telefono}</span>}
          </div>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusColors[data.estado || 'nuevo']}`}>
          {data.estado || 'nuevo'}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
        <div className="text-lg font-extrabold text-emerald-600">
          {data.monto ? `$${parseFloat(data.monto).toLocaleString()}` : 'Por definir'}
        </div>
        
        {data.estado !== 'convertido' && (
          <Button 
            variant="success" 
            className="text-xs px-3 py-1.5 h-auto rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onConvert(data.id);
            }}
          >
            Convertir <ArrowRight size={14} className="ml-1" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
        <Calendar size={10} /> {new Date(data.fecha || data.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
