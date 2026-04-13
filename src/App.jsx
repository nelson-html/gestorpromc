import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Layout } from './components/Layout';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Plus, Search } from 'lucide-react';
import { InstallPWA } from './components/InstallPWA';

// Features
import { ProspeccionCard } from './features/prospecciones/ProspeccionCard';
import { ProspeccionForm } from './features/prospecciones/ProspeccionForm';
import { SolicitudCard } from './features/solicitudes/SolicitudCard';
import { SolicitudForm } from './features/solicitudes/SolicitudForm';
import { AnalisisCard } from './features/analisis/AnalisisCard';
import { AnalisisForm } from './features/analisis/AnalisisForm';
import { ClientesList } from './features/clientes/ClientesList';

// Services
import { generateFullClientPDF, generateAnalisisPDF, generateSolicitudPDF } from './services/pdfService';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('prospecciones');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'old'
  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });
  
  const { 
    prospecciones, solicitudes, analisis, 
    deleteSolicitud, deleteAnalisis 
  } = useDatabase();

  const openModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', data: null });
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredProspecciones = sortData(prospecciones.filter(p => 
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.telefono?.toLowerCase().includes(search.toLowerCase()) ||
    p.lugar?.toLowerCase().includes(search.toLowerCase())
  ));

  const filteredSolicitudes = sortData(solicitudes.filter(s => 
    s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    s.nombreNegocio?.toLowerCase().includes(search.toLowerCase()) ||
    s.telefono?.toLowerCase().includes(search.toLowerCase())
  ));

  const filteredAnalisis = sortData(analisis.filter(a => {
    const sol = solicitudes.find(s => String(s.id) === String(a.solicitudId));
    if (!search) return true;
    return sol?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
           sol?.nombreNegocio?.toLowerCase().includes(search.toLowerCase());
  }));

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Search and Sort Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder={`Buscar en ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        {activeTab !== 'clientes' && (
          <button 
            onClick={() => setSortOrder(prev => prev === 'recent' ? 'old' : 'recent')}
            className="px-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold text-blue-900 shadow-sm hover:bg-gray-50 transition-all flex flex-col justify-center items-center"
          >
            ORDENAR
            <span className="text-gray-400 text-[8px]">{sortOrder === 'recent' ? 'RECIENTE' : 'ANTIGUO'}</span>
          </button>
        )}
      </div>

      {/* Lists */}
      <div className={search ? "" : "animate-in fade-in duration-500"}>
        {activeTab === 'prospecciones' && (
          <>
            {filteredProspecciones.length > 0 ? (
              filteredProspecciones.map(p => (
                <ProspeccionCard 
                  key={p.id} 
                  data={p} 
                  onClick={() => openModal('prospeccion', p)}
                  onConvert={(id) => openModal('solicitud', { prospeccionId: id, ...p, id: undefined })}
                />
              ))
            ) : (
              <EmptyState title="No hay prospecciones" desc="Toca el botón + para agregar una" />
            )}
            <Button variant="fab" onClick={() => openModal('prospeccion')}>
              <Plus size={28} />
            </Button>
          </>
        )}

        {activeTab === 'solicitudes' && (
          <>
            {filteredSolicitudes.length > 0 ? (
              filteredSolicitudes.map(s => (
                <SolicitudCard 
                  key={s.id} 
                  data={s} 
                  onClick={() => openModal('solicitud', s)}
                  onScale={(id) => {
                    const existing = analisis.find(a => a.solicitudId === id);
                    openModal('analisis', existing || { solicitudId: id });
                  }}
                />
              ))
            ) : (
              <EmptyState title="No hay solicitudes" desc="Convierte una prospección primero" />
            )}
          </>
        )}

        {activeTab === 'analisis' && (
          <>
            {filteredAnalisis.length > 0 ? (
              filteredAnalisis.map(a => (
                <AnalisisCard 
                  key={a.id} 
                  data={a} 
                  solicitud={solicitudes.find(s => String(s.id) === String(a.solicitudId))}
                  onClick={() => openModal('analisis', a)}
                  onDownload={() => generateAnalisisPDF(a, solicitudes.find(s => s.id === a.solicitudId))}
                />
              ))
            ) : (
              <EmptyState title="Sin análisis" desc="Crea uno desde el módulo de solicitudes" />
            )}
          </>
        )}

        {activeTab === 'clientes' && (
          <ClientesList 
            search={search}
            onEdit={(client) => {
              // Redirect to the appropriate form based on stage
              if (client.stage === 'analisis') {
                openModal('analisis', client.analisis);
              } else if (client.stage === 'solicitud') {
                openModal('solicitud', client.solicitud);
              } else {
                openModal('prospeccion', client);
              }
            }} 
          />
        )}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal}
        title={
          modal.type === 'prospeccion' ? (modal.data?.id ? 'Editar Prospección' : 'Nueva Prospección') :
          modal.type === 'solicitud' ? (modal.data?.id ? 'Editar Solicitud' : 'Nueva Solicitud') :
          'Análisis Financiero'
        }
        footer={
          <div className="flex gap-2 w-full justify-between">
            {modal.data?.id && (
              <Button 
                variant="danger" 
                onClick={() => {
                  if (confirm('¿Eliminar permanentemente?')) {
                    if (modal.type === 'solicitud') deleteSolicitud(modal.data.id);
                    if (modal.type === 'analisis') deleteAnalisis(modal.data.id);
                    closeModal();
                  }
                }}
                className={modal.type === 'prospeccion' ? 'hidden' : ''}
              >
                Eliminar
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
              {modal.type === 'solicitud' && modal.data?.id && (
                <Button variant="success" onClick={() => generateSolicitudPDF(modal.data)}>PDF</Button>
              )}
              {modal.type === 'analisis' && modal.data?.id && (
                <Button variant="success" onClick={() => {
                  const sol = solicitudes.find(s => s.id === modal.data.solicitudId);
                  const pros = prospecciones.find(p => p.id === sol?.prospeccionId);
                  generateFullClientPDF({
                    prospeccion: pros || {},
                    solicitud: sol,
                    analisis: modal.data
                  });
                }}>PDF Completo</Button>
              )}
            </div>
          </div>
        }
      >
        {modal.type === 'prospeccion' && (
          <ProspeccionForm 
            initialData={modal.data} 
            onComplete={() => {
              closeModal();
              setActiveTab('prospecciones');
            }} 
          />
        )}
        {modal.type === 'solicitud' && (
          <SolicitudForm 
            initialData={modal.data} 
            onComplete={() => {
              closeModal();
              setActiveTab('solicitudes');
            }} 
          />
        )}
        {modal.type === 'analisis' && (
          <AnalisisForm 
            initialData={modal.data} 
            onComplete={() => {
              closeModal();
              setActiveTab('analisis');
            }} 
          />
        )}
      </Modal>
      <InstallPWA />
    </Layout>
  );
};

const EmptyState = ({ title, desc }) => (
  <div className="text-center py-20 px-6">
    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="text-gray-300" size={32} />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-gray-400 text-sm mt-1">{desc}</p>
  </div>
);

function App() {
  return (
    <DatabaseProvider>
      <MainApp />
    </DatabaseProvider>
  );
}

export default App;
