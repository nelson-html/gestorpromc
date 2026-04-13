import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [prospecciones, setProspecciones] = useState(() => 
    JSON.parse(localStorage.getItem('prospecciones') || '[]')
  );
  const [solicitudes, setSolicitudes] = useState(() => 
    JSON.parse(localStorage.getItem('solicitudes') || '[]')
  );
  const [analisis, setAnalisis] = useState(() => 
    JSON.parse(localStorage.getItem('analisis') || '[]')
  );

  // Sync with localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('prospecciones', JSON.stringify(prospecciones));
  }, [prospecciones]);

  useEffect(() => {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem('analisis', JSON.stringify(analisis));
  }, [analisis]);

  const saveProspeccion = useCallback((data) => {
    setProspecciones(prev => {
      const idx = prev.findIndex(p => p.id === data.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...data, updatedAt: new Date().toISOString() };
        return next;
      }
      return [...prev, { ...data, createdAt: new Date().toISOString() }];
    });
  }, []);

  const saveSolicitud = useCallback((data) => {
    setSolicitudes(prev => {
      const idx = prev.findIndex(s => s.id === data.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...data, updatedAt: new Date().toISOString() };
        return next;
      }
      return [...prev, { ...data, createdAt: new Date().toISOString() }];
    });
    
    // Auto-update prospect status if it's new
    if (data.prospeccionId) {
      setProspecciones(prev => prev.map(p => 
        p.id === data.prospeccionId ? { ...p, estado: 'convertido' } : p
      ));
    }
  }, []);

  const saveAnalisis = useCallback((data) => {
    setAnalisis(prev => {
      const idx = prev.findIndex(a => a.id === data.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...data, updatedAt: new Date().toISOString() };
        return next;
      }
      return [...prev, { ...data, createdAt: new Date().toISOString() }];
    });
  }, []);

  const deleteSolicitud = useCallback((id) => {
    setSolicitudes(prev => prev.filter(s => s.id !== id));
    setAnalisis(prev => prev.filter(a => a.solicitudId !== id)); // Cascade delete
  }, []);

  const deleteAnalisis = useCallback((id) => {
    setAnalisis(prev => prev.filter(a => a.id !== id));
  }, []);

  const value = {
    prospecciones,
    solicitudes,
    analisis,
    saveProspeccion,
    saveSolicitud,
    saveAnalisis,
    deleteSolicitud,
    deleteAnalisis,
    stats: {
      prospecciones: prospecciones.length,
      solicitudes: solicitudes.length,
      analisis: analisis.length
    }
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};
