import { useState, useEffect } from 'react';
import type { UserProfile, UserRole, Plazo, CausaIngreso, TareaDiaria, Convenio, AtencionPublico, PushNotification, EstadoTarea } from './types';
import { CURRENT_USER, INITIAL_PLAZOS, INITIAL_CAUSAS, INITIAL_TAREAS, INITIAL_CONVENIOS, INITIAL_ATENCION, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { PlazosView } from './components/plazos/PlazosView';
import { IngresoCausasView } from './components/causas/IngresoCausasView';
import { TareasKanbanView } from './components/tareas/TareasKanbanView';
import { ConveniosView } from './components/convenios/ConveniosView';
import { AtencionPublicoView } from './components/atencion/AtencionPublicoView';
import { EstadisticasView } from './components/estadisticas/EstadisticasView';

export type ThemeMode = 'skeuomorphic' | 'flat' | 'neumorphic' | 'claymorphism' | 'liquid-glass';
export type ColorMode = 'light' | 'dark';

export function App() {
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<string>('plazos');

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('defensoria_theme') as ThemeMode) || 'skeuomorphic';
  });

  useEffect(() => {
    document.body.classList.remove('theme-skeuomorphic', 'theme-flat', 'theme-neumorphic', 'theme-claymorphism', 'theme-liquid-glass');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    return (localStorage.getItem('defensoria_colormode') as ColorMode) || 'light';
  });

  useEffect(() => {
    if (colorMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [colorMode]);

  const handleToggleTheme = () => {
    const modes: ThemeMode[] = ['skeuomorphic', 'flat', 'neumorphic', 'claymorphism', 'liquid-glass'];
    const currentIndex = modes.indexOf(theme);
    const nextTheme = modes[(currentIndex + 1) % modes.length];
    setTheme(nextTheme);
    localStorage.setItem('defensoria_theme', nextTheme);
  };

  const handleToggleColorMode = () => {
    const nextMode: ColorMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(nextMode);
    localStorage.setItem('defensoria_colormode', nextMode);
  };

  const [plazos, setPlazos] = useState<Plazo[]>(INITIAL_PLAZOS);
  const [causas, setCausas] = useState<CausaIngreso[]>(INITIAL_CAUSAS);
  const [tareas, setTareas] = useState<TareaDiaria[]>(INITIAL_TAREAS);
  const [convenios, setConvenios] = useState<Convenio[]>(INITIAL_CONVENIOS);
  const [atenciones, setAtenciones] = useState<AtencionPublico[]>(INITIAL_ATENCION);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);

  // Role Handler
  const handleRoleChange = (newRole: UserRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
  };

  // Plazos Handlers
  const handleAddPlazo = (newPlazo: Omit<Plazo, 'id'>) => {
    const created: Plazo = {
      ...newPlazo,
      id: `plz-${Date.now()}`
    };
    setPlazos([created, ...plazos]);

    // Push notification for urgent plazo
    if (newPlazo.prioridad === 'URG') {
      const notif: PushNotification = {
        id: `nt-${Date.now()}`,
        title: '⚠️ Nuevo Plazo URGENTE Registrado',
        message: `${newPlazo.caratula.slice(0, 50)}... para ${newPlazo.fechaVencimiento}`,
        timestamp: 'Ahora',
        level: 'CRITICAL',
        read: false,
        linkTab: 'plazos'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const handleToggleCompletePlazo = (id: string) => {
    setPlazos(plazos.map(p => {
      if (p.id === id) {
        const nextState = p.estado === 'CUMPLIDO' ? 'PENDIENTE' : 'CUMPLIDO';
        return { ...p, estado: nextState };
      }
      return p;
    }));
  };

  // Causas Handlers
  const handleAddCausa = (newCausa: Omit<CausaIngreso, 'id'>) => {
    const created: CausaIngreso = {
      ...newCausa,
      id: `causa-${Date.now()}`
    };
    setCausas([created, ...causas]);
  };

  // Tareas Handlers
  const handleAddTask = (newTask: Omit<TareaDiaria, 'id'>) => {
    const created: TareaDiaria = {
      ...newTask,
      id: `tar-${Date.now()}`
    };
    setTareas([created, ...tareas]);
  };

  const handleUpdateTaskStatus = (id: string, nextStatus: EstadoTarea) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, estado: nextStatus } : t));
  };

  // Convenios Handlers
  const handleAddConvenio = (newCnv: Omit<Convenio, 'id'>) => {
    const created: Convenio = {
      ...newCnv,
      id: `cnv-${Date.now()}`
    };
    setConvenios([created, ...convenios]);
  };

  const handleUpdateResultadoConvenio = (id: string, nuevoResultado: 'ACEPTADO' | 'EN TRÁMITE') => {
    setConvenios(convenios.map(c => c.id === id ? { ...c, resultado: nuevoResultado, estado: nuevoResultado === 'ACEPTADO' ? 'INICIADO' : c.estado } : c));
  };

  // Atencion Publico Handler
  const handleAddAtencion = (newAtn: Omit<AtencionPublico, 'id'>) => {
    const created: AtencionPublico = {
      ...newAtn,
      id: `atn-${Date.now()}`
    };
    setAtenciones([created, ...atenciones]);
  };

  // Notification Mark Read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const urgentPlazosCount = plazos.filter(p => p.prioridad === 'URG' && p.estado === 'PENDIENTE').length;

  return (
    <div className={`bg-leather-desk min-h-screen text-amber-950 font-sans flex flex-col theme-${theme} ${colorMode === 'dark' ? 'dark-mode' : ''}`}>
      
      {/* Top Header */}
      <Header
        currentUser={user}
        onRoleChange={handleRoleChange}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onNavigateTab={(t) => setActiveTab(t)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        colorMode={colorMode}
        onToggleColorMode={handleToggleColorMode}
      />

      {/* Skeuomorphic Tabbed Folder Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        urgentPlazosCount={urgentPlazosCount}
      />

      {/* Main Workspace Area (Desks, Notebooks, Folders) */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
        {activeTab === 'plazos' && (
          <PlazosView
            plazos={plazos}
            onAddPlazo={handleAddPlazo}
            onToggleComplete={handleToggleCompletePlazo}
          />
        )}

        {activeTab === 'causas' && (
          <IngresoCausasView
            causas={causas}
            onAddCausa={handleAddCausa}
          />
        )}

        {activeTab === 'tareas' && (
          <TareasKanbanView
            tareas={tareas}
            onAddTask={handleAddTask}
            onUpdateStatus={handleUpdateTaskStatus}
          />
        )}

        {activeTab === 'convenios' && (
          <ConveniosView
            convenios={convenios}
            onAddConvenio={handleAddConvenio}
            onUpdateResultado={handleUpdateResultadoConvenio}
          />
        )}

        {activeTab === 'atencion' && (
          <AtencionPublicoView
            atenciones={atenciones}
            onAddAtencion={handleAddAtencion}
          />
        )}

        {activeTab === 'estadisticas' && (
          <EstadisticasView
            plazos={plazos}
            causas={causas}
            tareas={tareas}
            convenios={convenios}
          />
        )}
      </main>

      {/* Footer Desk Trim */}
      <footer className="bg-mahogany text-amber-200/70 text-xs py-4 px-4 border-t border-amber-900 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-serif">
          
          <div className="flex items-center gap-3">
            <div className="bg-amber-50/90 px-3 py-1.5 rounded-md shadow-inner border border-amber-300">
              <img
                src="/logos/logo3.png"
                alt="Ministerio Público de la Defensa Mendoza"
                className="h-7 object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-amber-100 text-xs">Defensoría Oficial Civil — San Rafael</div>
              <div className="text-[11px] text-amber-300/80">Segunda Circunscripción Judicial — Provincia de Mendoza</div>
            </div>
          </div>

          <div className="font-mono text-[11px] text-amber-300/70">
            Sistema de Gestión Integral v1.0 | Entorno VPS Cloud (Dokploy)
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
