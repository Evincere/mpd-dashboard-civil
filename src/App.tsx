import { useState, useEffect } from 'react';
import type { PushNotification } from './types';
import { INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { PlazosView } from './components/plazos/PlazosView';
import { IngresoCausasView } from './components/causas/IngresoCausasView';
import { TareasKanbanView } from './components/tareas/TareasKanbanView';
import { ConveniosView } from './components/convenios/ConveniosView';
import { AtencionPublicoView } from './components/atencion/AtencionPublicoView';
import { EstadisticasView } from './components/estadisticas/EstadisticasView';
import { AdminPanelView } from './components/admin/AdminPanelView';

import { usePlazos } from './hooks/usePlazos';
import { useCausas } from './hooks/useCausas';
import { useTareas } from './hooks/useTareas';
import { useConvenios } from './hooks/useConvenios';
import { useAtenciones } from './hooks/useAtenciones';
import { useAuth } from './context/AuthContext';
import { LoginView } from './components/auth/LoginView';

export type ThemeMode = 'skeuomorphic' | 'flat' | 'neumorphic' | 'claymorphism' | 'liquid-glass';
export type ColorMode = 'light' | 'dark';

export function App() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <LoginView />;
  }

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

  // Custom Hooks (React Query) connected to Hexagonal Backend
  const { plazos, addPlazo, toggleComplete } = usePlazos();
  const { causas, addCausa } = useCausas();
  const { tareas, addTask, updateStatus } = useTareas();
  const { convenios, addConvenio, updateResultado } = useConvenios();
  const { atenciones, addAtencion } = useAtenciones();

  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);

  // Role Handler

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
        currentUserRole={user.role}
      />

      {/* Main Workspace Area (Desks, Notebooks, Folders) */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
        {activeTab === 'plazos' && (
          <PlazosView
            plazos={plazos}
            onAddPlazo={(p) => addPlazo(p)}
            onToggleComplete={(id) => toggleComplete(id)}
          />
        )}

        {activeTab === 'causas' && (
          <IngresoCausasView
            causas={causas}
            onAddCausa={(c) => addCausa(c)}
          />
        )}

        {activeTab === 'tareas' && (
          <TareasKanbanView
            tareas={tareas}
            onAddTask={(t) => addTask(t)}
            onUpdateStatus={(id, st) => updateStatus(id, st)}
          />
        )}

        {activeTab === 'convenios' && (
          <ConveniosView
            convenios={convenios}
            onAddConvenio={(cnv) => addConvenio(cnv)}
            onUpdateResultado={(id, res) => updateResultado(id, res)}
          />
        )}

        {activeTab === 'atencion' && (
          <AtencionPublicoView
            atenciones={atenciones}
            onAddAtencion={(atn) => addAtencion(atn)}
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

        {(user.role === 'Administrador' || user.role === 'ADMIN') && activeTab === 'admin' && (
          <AdminPanelView />
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
            Sistema de Gestión Integral v1.0 | Arquitectura Hexagonal + PostgreSQL
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
