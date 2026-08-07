import type { FC } from 'react';
import { Clock, Inbox, CheckSquare, FileText, PhoneCall, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  urgentPlazosCount: number;
}

export const Navbar: FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  urgentPlazosCount
}) => {
  const tabs = [
    {
      id: 'plazos',
      label: 'PLAZOS PROCESALES',
      icon: Clock,
      badge: urgentPlazosCount > 0 ? urgentPlazosCount : null,
      badgeColor: 'bg-red-600 text-white'
    },
    {
      id: 'causas',
      label: 'INGRESO / EGRESO CAUSAS',
      icon: Inbox
    },
    {
      id: 'tareas',
      label: 'TABLERO DE TAREAS',
      icon: CheckSquare
    },
    {
      id: 'convenios',
      label: 'CONVENIOS Y OSEP',
      icon: FileText
    },
    {
      id: 'atencion',
      label: 'ATENCIÓN / WSP',
      icon: PhoneCall
    },
    {
      id: 'estadisticas',
      label: 'ESTADÍSTICAS MPD',
      icon: BarChart3
    }
  ];

  return (
    <nav className="bg-brushed-metal px-2 md:px-4 pt-3 pb-1 border-b border-amber-950/60 shadow-lg w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-start lg:justify-between gap-1 lg:gap-1.5 overflow-x-auto lg:overflow-visible scrollbar-none py-1 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`shrink-0 lg:shrink lg:flex-1 lg:min-w-0 px-2.5 sm:px-3 lg:px-1.5 xl:px-3 py-2 md:py-2.5 rounded-t-lg font-serif text-xs lg:text-[11px] xl:text-xs 2xl:text-sm tracking-wider uppercase flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
                isActive ? 'tab-raised-active' : 'tab-recessed'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-amber-800' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>

              {tab.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ml-0.5 border border-red-300 shadow shrink-0 ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}

              {/* Physical Stitching line on active tab */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-t-lg" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
