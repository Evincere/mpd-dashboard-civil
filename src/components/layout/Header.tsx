import { useState } from 'react';
import type { UserProfile, UserRole, PushNotification } from '../../types';
import { Bell, User, CheckCircle, Radio, Sparkles, LayoutGrid, Droplets, Shapes, Gem, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onRoleChange: (role: UserRole) => void;
  notifications: PushNotification[];
  onMarkNotificationRead: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  theme: 'skeuomorphic' | 'flat' | 'neumorphic' | 'claymorphism' | 'liquid-glass';
  onToggleTheme: () => void;
  colorMode: 'light' | 'dark';
  onToggleColorMode: () => void;
}

export function Header({
  currentUser,
  onRoleChange,
  notifications,
  onMarkNotificationRead,
  onNavigateTab,
  theme,
  onToggleTheme,
  colorMode,
  onToggleColorMode
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: UserRole[] = [
    'Defensor/a',
    'Codefensor/a',
    'Secretario/a',
    'Prosecretario/a',
    'Empleado/a'
  ];

  return (
    <header className="bg-mahogany text-amber-50 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Institution Emblem & Title */}
        <div className="flex items-center gap-3">
          {/* Official Emblem Logo Badge */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 p-0.5 shadow-xl flex items-center justify-center border border-amber-300">
            <div className="w-full h-full rounded-lg bg-slate-900 p-1 flex items-center justify-center border border-amber-500/50 shadow-inner">
              <img src="/logos/logo1.png" alt="Logo Ministerio Público de la Defensa" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          <div className="h-10 md:h-12 flex items-center">
            <img src="/logos/banner.png" alt="Banner Ministerio Público de la Defensa" className="h-full w-auto object-contain" />
          </div>
        </div>

        {/* Right: Theme Switcher, Live Push Bell, VPS Status, User Role Selector */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Theme Selector Button */}
          <button
            onClick={onToggleTheme}
            className={`px-3 py-1.5 flex items-center gap-2 text-xs transition-all cursor-pointer ${
              theme === 'flat' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md border border-blue-500' 
                : theme === 'neumorphic'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl border-none shadow-md'
                : theme === 'claymorphism'
                ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl border-none shadow-lg'
                : theme === 'liquid-glass'
                ? 'bg-sky-500/80 hover:bg-sky-500 text-white font-semibold rounded-full border border-white/40 backdrop-blur-md shadow-lg'
                : 'btn-brass text-white'
            }`}
            title="Alternar entre Tema Físico, Plano, Suave (Neumorphism), Arcilla (Claymorphism) y Vidrio Líquido (Liquid Glass)"
          >
            {theme === 'skeuomorphic' ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Tema: <strong>Físico (Skeuo)</strong></span>
                <span className="sm:hidden">Skeuo</span>
              </>
            ) : theme === 'flat' ? (
              <>
                <LayoutGrid className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Tema: <strong>Plano (Flat)</strong></span>
                <span className="sm:hidden">Flat</span>
              </>
            ) : theme === 'neumorphic' ? (
              <>
                <Droplets className="w-4 h-4 text-cyan-200" />
                <span className="hidden sm:inline">Tema: <strong>Suave (Neumo)</strong></span>
                <span className="sm:hidden">Soft</span>
              </>
            ) : theme === 'claymorphism' ? (
              <>
                <Shapes className="w-4 h-4 text-pink-200" />
                <span className="hidden sm:inline">Tema: <strong>Arcilla (Clay)</strong></span>
                <span className="sm:hidden">Clay</span>
              </>
            ) : (
              <>
                <Gem className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span className="hidden sm:inline">Tema: <strong>Vidrio Líquido (Glass)</strong></span>
                <span className="sm:hidden">Glass</span>
              </>
            )}
          </button>

          {/* Color Mode Toggle (Sun/Moon) */}
          <button
            onClick={onToggleColorMode}
            className={`p-1.5 flex items-center justify-center rounded-md border transition-all ${
              colorMode === 'dark'
                ? 'bg-slate-800 border-slate-600 text-amber-300 hover:bg-slate-700'
                : 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'
            }`}
            title={`Cambiar a modo ${colorMode === 'dark' ? 'claro' : 'oscuro'}`}
          >
            {colorMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-amber-950/90 px-3 py-1.5 rounded-md border border-amber-800/60 text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-amber-200 font-mono text-[11px]">Local Dev (Nube Dokploy VPS Lista)</span>
          </div>

          {/* Live Push Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-metal p-2 flex items-center justify-center relative text-amber-200 hover:text-white"
              title="Notificaciones Push en Vivo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-amber-200 shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-parchment text-amber-950 rounded-lg shadow-2xl border-2 border-amber-800/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="bg-mahogany text-amber-200 px-4 py-2.5 flex items-center justify-between border-b border-amber-800">
                  <span className="font-serif font-bold text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" /> Push / Alertas en Vivo
                  </span>
                  <span className="text-xs text-amber-300 font-mono">{unreadCount} pendientes</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-amber-800/10 p-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-amber-800 font-serif">
                      Sin notificaciones procesales nuevas
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          if (n.linkTab) onNavigateTab(n.linkTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-amber-100/80 transition ${
                          !n.read ? 'bg-amber-50 font-semibold border-l-4 border-amber-600' : 'opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-bold ${
                            n.level === 'CRITICAL' ? 'text-red-700' : n.level === 'WARNING' ? 'text-amber-800' : 'text-blue-800'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-amber-700 font-mono whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-amber-900 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="btn-brass px-3 py-1.5 flex items-center gap-2 text-xs shadow-md"
            >
              <User className="w-4 h-4 text-amber-100" />
              <div className="text-left hidden sm:block">
                <div className="font-bold text-white text-xs leading-none">{currentUser.name}</div>
                <div className="text-[10px] text-amber-100 font-mono">{currentUser.role}</div>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-parchment text-amber-950 rounded-md shadow-2xl border-2 border-amber-800 z-50 p-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 border-b border-amber-800/20 pb-1 mb-2">
                  Cambiar Rol de Sesión:
                </div>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between hover:bg-amber-200 ${
                      currentUser.role === r ? 'bg-amber-300 font-bold text-amber-950' : 'text-amber-900'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <CheckCircle className="w-3.5 h-3.5 text-amber-800" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
