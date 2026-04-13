import React, { useState, useEffect, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DynamicTable } from '../../components/ui/DynamicTable';
import { Camera, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { handleImageUpload } from '../../services/imageService';

export const AnalisisForm = ({ initialData, onAutoSaved, onComplete }) => {
  const { saveAnalisis } = useDatabase();
  const defaultValues = {
    id: Date.now(),
    solicitudId: null,
    semBaja: '',
    semAlta: '',
    gastos: [],
    licencias: '',
    clientes: [],
    ingresos: [],
    referencias: [
      { cedula: '', nombre: '', telefono: '', anos: '', parentesco: '' },
      { cedula: '', nombre: '', telefono: '', anos: '', parentesco: '' }
    ],
    efectivo: '',
    bancos: '',
    cxc: '',
    totalInv: '0.00',
    inventario: [],
    activos: [],
    creditos: [],
    facturas: '',
    vehiculos: '',
    servicios: '',
    fotosCliente: []
  };

  const [formData, setFormData] = useState(() => {
    const combined = { ...defaultValues, ...initialData };
    // Ensure we have a valid ID if initialData.id is missing or null
    if (!initialData?.id) {
      combined.id = Date.now();
    }
    return combined;
  });

  const debouncedData = useDebounce(formData, 1500);

  useEffect(() => {
    if (debouncedData.solicitudId) {
      saveAnalisis(debouncedData);
      if (onAutoSaved) onAutoSaved();
    }
  }, [debouncedData, saveAnalisis]);

  const totalInventario = useMemo(() => {
    return formData.inventario.reduce((acc, item) => {
      return acc + (parseFloat(item.cant || 0) * parseFloat(item.costo || 0));
    }, 0).toFixed(2);
  }, [formData.inventario]);

  useEffect(() => {
    if (totalInventario !== formData.totalInv) {
      setFormData(prev => ({ ...prev, totalInv: totalInventario }));
    }
  }, [totalInventario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (field, newData) => {
    setFormData(prev => ({ ...prev, [field]: newData }));
  };

  const handleReferenceChange = (index, field, value) => {
    const nextRefs = [...formData.referencias];
    nextRefs[index][field] = value;
    setFormData(prev => ({ ...prev, referencias: nextRefs }));
  };

  const handlePhoto = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await handleImageUpload(file);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    }
  };

  const SectionTitle = ({ children, icon: Icon }) => (
    <div className="flex items-center gap-2 text-blue-900 border-b-2 border-blue-900 pb-1 mt-8 mb-6 font-black uppercase tracking-widest text-xs">
      {Icon && <Icon size={16} />} {children}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <SectionTitle icon={TrendingUp}>📈 Ciclos de Venta Semanal</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Semana Baja ($)" 
          type="number" 
          name="semBaja" 
          value={formData.semBaja} 
          onChange={handleChange} 
        />
        <Input 
          label="Semana Alta ($)" 
          type="number" 
          name="semAlta" 
          value={formData.semAlta} 
          onChange={handleChange} 
        />
      </div>

      <DynamicTable 
        title="💵 Gasto Familiar Mensual"
        headers={['Concepto', 'Monto ($)']}
        fields={['concepto', 'monto']}
        data={formData.gastos}
        onChange={(data) => handleTableChange('gastos', data)}
      />

      <SectionTitle icon={Camera}>📸 Licencias y Permisos</SectionTitle>
      <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer mb-6">
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handlePhoto(e, 'licencias')} />
        {formData.licencias ? <img src={formData.licencias} className="w-full h-full object-cover" /> : <Camera className="text-gray-400" />}
      </div>

      <DynamicTable 
        title="📦 Inventario de Productos"
        headers={['Producto', 'Cant', 'Costo', 'Venta']}
        fields={['producto', 'cant', 'costo', 'venta']}
        data={formData.inventario}
        onChange={(data) => handleTableChange('inventario', data)}
      />
      <div className="text-right text-lg font-black text-emerald-600 pr-4">
        TOTAL INVENTARIO: ${formData.totalInv}
      </div>

      <SectionTitle icon={Plus}>👥 Referencias Personales</SectionTitle>
      {[0, 1].map(idx => (
        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
          <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase">Referencia #{idx + 1}</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cédula" value={formData.referencias[idx].cedula} onChange={(e) => handleReferenceChange(idx, 'cedula', e.target.value)} />
            <Input label="Nombre" value={formData.referencias[idx].nombre} onChange={(e) => handleReferenceChange(idx, 'nombre', e.target.value)} />
            <Input label="Teléfono" value={formData.referencias[idx].telefono} onChange={(e) => handleReferenceChange(idx, 'telefono', e.target.value)} />
            <Input label="Parentezco" value={formData.referencias[idx].parentesco} onChange={(e) => handleReferenceChange(idx, 'parentesco', e.target.value)} />
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-8">
        <div className="text-[10px] text-gray-400 italic">
          ✨ Autoguardado inteligente.
        </div>
        <Button 
          onClick={() => onComplete && onComplete(formData)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
        >
          Finalizar y Guardar
        </Button>
      </div>
    </div>
  );
};
