import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ProspeccionForm = ({ initialData, onAutoSaved, onComplete }) => {
  const { saveProspeccion } = useDatabase();
  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;
    return {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      nombre: '',
      lugar: '',
      telefono: '',
      monto: '',
      estado: 'nuevo'
    };
  });

  const debouncedData = useDebounce(formData, 1000);

  // Auto-save logic
  useEffect(() => {
    if (debouncedData.nombre || debouncedData.telefono || debouncedData.monto) {
      saveProspeccion(debouncedData);
      if (onAutoSaved) onAutoSaved();
    }
  }, [debouncedData, saveProspeccion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Fecha" 
          type="date" 
          name="fecha" 
          value={formData.fecha} 
          onChange={handleChange} 
        />
        <Input 
          label="Monto Interesado ($)" 
          type="number" 
          name="monto" 
          placeholder="0.00"
          value={formData.monto} 
          onChange={handleChange} 
        />
      </div>
      
      <Input 
        label="Nombre Completo" 
        name="nombre" 
        placeholder="Ej. Juan Pérez"
        value={formData.nombre} 
        onChange={handleChange} 
      />

      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Lugar / Ubicación" 
          name="lugar" 
          placeholder="Ej. Mercado Central"
          value={formData.lugar} 
          onChange={handleChange} 
        />
        <Input 
          label="Teléfono" 
          type="tel" 
          name="telefono" 
          placeholder="8888 8888"
          value={formData.telefono} 
          onChange={handleChange} 
        />
      </div>

      <Select 
        label="Estado" 
        name="estado"
        value={formData.estado}
        onChange={handleChange}
        options={[
          { value: 'nuevo', label: 'Nuevo' },
          { value: 'contactado', label: 'Contactado' },
          { value: 'interesado', label: 'Interesado' },
          { value: 'no-interesado', label: 'No Interesado' },
          { value: 'convertido', label: 'Convertido' },
        ]}
      />
      
      <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
        <div className="text-[10px] text-gray-400 italic">
          ✨ Autoguardado activo
        </div>
        <Button 
          onClick={() => onComplete && onComplete(formData)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all"
        >
          Guardar y Listar
        </Button>
      </div>
    </div>
  );
};
