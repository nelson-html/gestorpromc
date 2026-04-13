import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Camera, Plus } from 'lucide-react';
import { handleImageUpload } from '../../services/imageService';

export const SolicitudForm = ({ initialData, onAutoSaved, onComplete }) => {
  const { saveSolicitud } = useDatabase();
  const defaultValues = {
    id: Date.now(),
    prospeccionId: null,
    nombre: '',
    cedulaFoto1: '',
    cedulaFoto2: '',
    fechaNac: '',
    edad: '',
    estadoCivil: '',
    direccion: '',
    barrio: '',
    condicionVivienda: '',
    anosVivienda: '',
    telefono: '',
    escolaridad: '',
    dependientes: '',
    beneficiario: '',
    parentesco: '',
    nacionalidad: '',
    cedulaBenef: '',
    trabajoBenef: '',
    telBenef: '',
    nombreNegocio: '',
    dirNegocio: '',
    munNegocio: '',
    act1: '',
    act2: '',
    actPred: '',
    anosNegocio: '',
    condNegocio: '',
    horario: '',
    horaVisita: '',
    proposito: '',
    producto: '',
    moneda: 'USD',
    monto: '',
    primeraCuota: '',
    frecuencia: '',
    sector: 'Urbano',
    notas: '',
    fotos: []
  };

  const [formData, setFormData] = useState(() => {
    const combined = { ...defaultValues, ...initialData };
    // Ensure we have a valid ID if initialData.id is missing or null
    if (!initialData?.id) {
      combined.id = Date.now();
    }
    return combined;
  });

  const debouncedData = useDebounce(formData, 1000);

  useEffect(() => {
    if (debouncedData.nombre && debouncedData.monto) {
      saveSolicitud(debouncedData);
      if (onAutoSaved) onAutoSaved();
    }
  }, [debouncedData, saveSolicitud]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextData = { ...formData, [name]: value };
    
    if (name === 'fechaNac') {
      nextData.edad = calcEdad(value);
    }
    
    setFormData(nextData);
  };

  const handlePhoto = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await handleImageUpload(file);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    }
  };

  const handleGalleryPhoto = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await handleImageUpload(file);
      const nextFotos = [...formData.fotos];
      nextFotos[index] = base64;
      setFormData(prev => ({ ...prev, fotos: nextFotos }));
    }
  };

  const calcEdad = (fecha) => {
    if (!fecha) return '';
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  };

  const SectionTitle = ({ children, icon: Icon }) => (
    <div className="flex items-center gap-2 text-blue-900 border-b-2 border-blue-900 pb-1 mt-6 mb-4 font-bold uppercase tracking-wider text-xs">
      {Icon && <Icon size={14} />} {children}
    </div>
  );

  return (
    <div className="space-y-2">
      <SectionTitle>📋 Datos Generales</SectionTitle>
      <Input label="Nombre del Cliente" name="nombre" value={formData.nombre} onChange={handleChange} />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Cédula Frontal</label>
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handlePhoto(e, 'cedulaFoto1')} />
            {formData.cedulaFoto1 ? <img src={formData.cedulaFoto1} className="w-full h-full object-cover" /> : <><Camera className="text-gray-400" /> <span className="text-[10px] text-gray-400 mt-1">LADO A</span></>}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Cédula Reverso</label>
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handlePhoto(e, 'cedulaFoto2')} />
            {formData.cedulaFoto2 ? <img src={formData.cedulaFoto2} className="w-full h-full object-cover" /> : <><Camera className="text-gray-400" /> <span className="text-[10px] text-gray-400 mt-1">LADO B</span></>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input label="Fecha Nacimiento" type="date" name="fechaNac" value={formData.fechaNac} onChange={handleChange} />
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Edad</label>
          <div className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 font-bold">{formData.edad || '--'} años</div>
        </div>
      </div>

      <SectionTitle>🏢 Datos del Negocio</SectionTitle>
      <Input label="Nombre del Negocio" name="nombreNegocio" value={formData.nombreNegocio} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Años Funcionado" type="number" name="anosNegocio" value={formData.anosNegocio} onChange={handleChange} />
        <Input label="Actividad principal" name="act1" value={formData.act1} onChange={handleChange} />
      </div>

      <SectionTitle>💰 Crédito Solicitado</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        <Select 
          label="Moneda" 
          name="moneda" 
          value={formData.moneda} 
          onChange={handleChange}
          options={[{value: 'USD', label:'USD'}, {value:'C$', label:'C$'}]}
        />
        <div className="col-span-2">
          <Input label="Monto" type="number" name="monto" value={formData.monto} onChange={handleChange} />
        </div>
      </div>

      <SectionTitle>📸 Documentación Adicional (+3 fotos)</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-dashed border-gray-300 flex items-center justify-center">
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleGalleryPhoto(e, i)} />
             {formData.fotos[i] ? <img src={formData.fotos[i]} className="w-full h-full object-cover" /> : <Plus className="text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-8">
        <div className="text-[10px] text-gray-400 italic">
          ✨ Autoguardado activo.
        </div>
        <Button 
          onClick={() => onComplete && onComplete(formData)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          Finalizar y Guardar
        </Button>
      </div>
    </div>
  );
};
