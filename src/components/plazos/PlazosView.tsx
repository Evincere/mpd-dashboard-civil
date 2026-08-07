import { useState } from 'react';
import type { MouseEvent, FormEvent } from 'react';
import type { Plazo, PrioridadPlazo } from '../../types';
import { Clock, Plus, Search, Filter, Calendar, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlazosViewProps {
  plazos: Plazo[];
  onAddPlazo: (plazo: Omit<Plazo, 'id'>) => void;
  onToggleComplete: (id: string) => void;
}

export function PlazosView({
  plazos,
  onAddPlazo,
  onToggleComplete
}: PlazosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('ALL');
  const [filterAsignado, setFilterAsignado] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  // New Plazo Form state
  const [newCaratula, setNewCaratula] = useState('');
  const [newFecha, setNewFecha] = useState('');
  const [newPrioridad, setNewPrioridad] = useState<PrioridadPlazo>('URG');
  const [newInitials, setNewInitials] = useState('LA');
  const [newExpediente, setNewExpediente] = useState('');
  const [newObservaciones, setNewObservaciones] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleComplete = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(id);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCaratula || !newFecha) return;

    onAddPlazo({
      caratula: newCaratula,
      fechaVencimiento: newFecha,
      prioridad: newPrioridad,
      asignadoInitials: newInitials,
      estado: 'PENDIENTE',
      expedienteNro: newExpediente || undefined,
      observaciones: newObservaciones || undefined
    });

    // Reset form
    setNewCaratula('');
    setNewFecha('');
    setNewPrioridad('URG');
    setNewExpediente('');
    setNewObservaciones('');
    setShowModal(false);
  };

  // Unique list of assigned initials
  const initialsList = Array.from(new Set(plazos.map(p => p.asignadoInitials)));

  const filteredPlazos = plazos.filter(p => {
    const matchesSearch = p.caratula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.expedienteNro && p.expedienteNro.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPrioridad = filterPrioridad === 'ALL' ? true :
      filterPrioridad === 'HOY' ? p.fechaVencimiento === todayStr :
      filterPrioridad === 'VENCIDO' ? p.estado === 'VENCIDO' || p.fechaVencimiento < todayStr :
      p.prioridad === filterPrioridad;

    const matchesAsignado = filterAsignado === 'ALL' ? true : p.asignadoInitials === filterAsignado;

    return matchesSearch && matchesPrioridad && matchesAsignado;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Top Banner Control Panel (Physical Brushed Metal Panel) */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-amber-700 to-amber-950 flex items-center justify-center border border-amber-500/40 shadow-inner">
            <Clock className="w-6 h-6 text-amber-300 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Control de Plazos Procesales Perentorios
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Monitoreo activo de urgencias, internaciones Ley 26.657 y respuestas de vistas
            </p>
          </div>
        </div>

        {/* Action Button: Nuevo Plazo */}
        <button
          onClick={() => setShowModal(true)}
          className="btn-brass px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-serif"
        >
          <Plus className="w-4 h-4 text-amber-100" />
          <span>Registrar Nuevo Plazo</span>
        </button>

      </div>

      {/* Filter and Search Bar (Wood Trim & Recessed Inputs) */}
      <div className="bg-mahogany p-3.5 rounded-lg border border-amber-900 shadow-md flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por carátula o expediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-recessed w-full pl-9 text-xs"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="text-amber-200/80 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Urgencia:
          </span>

          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'HOY', label: '🔴 Vence Hoy' },
            { id: 'URG', label: 'Urgentes' },
            { id: 'VENCIDO', label: 'Vencidos' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterPrioridad(btn.id)}
              className={`px-3 py-1 rounded text-xs transition font-serif ${
                filterPrioridad === btn.id ? 'btn-brass font-bold' : 'btn-metal text-slate-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Asignado Initials Filter */}
        <div className="flex items-center gap-2">
          <span className="text-amber-200/80 font-bold uppercase text-[11px]">Asignado:</span>
          <select
            value={filterAsignado}
            onChange={(e) => setFilterAsignado(e.target.value)}
            className="input-recessed text-xs py-1 px-2 font-mono"
          >
            <option value="ALL">TODOS (LA, JB, JP, AD)</option>
            {initialsList.map(init => (
              <option key={init} value={init}>{init}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid of Plazos Rendered on Ruled Legal Notebook / Parchment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlazos.map((plazo) => {
          const isToday = plazo.fechaVencimiento === todayStr;
          const isPast = plazo.fechaVencimiento < todayStr;
          const isCompleted = plazo.estado === 'CUMPLIDO';

          return (
            <div
              key={plazo.id}
              className={`bg-parchment p-4 rounded-lg relative transition-all duration-200 ${
                isCompleted
                  ? 'opacity-70 grayscale-[0.3]'
                  : isToday
                  ? 'ring-4 ring-red-600/80 shadow-2xl scale-[1.01]'
                  : 'hover:shadow-2xl'
              }`}
            >
              {/* Physical Brass Pushpin on Card */}
              <div className="brass-pin -top-2 left-6" />

              {/* Status Stamp Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                {isCompleted ? (
                  <span className="stamp-badge stamp-homologado">CUMPLIDO</span>
                ) : isToday ? (
                  <span className="stamp-badge stamp-urgente animate-pulse">VENCE HOY</span>
                ) : isPast ? (
                  <span className="stamp-badge stamp-urgente">VENCIDO</span>
                ) : plazo.prioridad === 'URG' ? (
                  <span className="stamp-badge stamp-urgente">URGENTE</span>
                ) : (
                  <span className="stamp-badge stamp-tramite">EN PLAZO</span>
                )}

                {/* Assigned Initials Plaque */}
                <span className="bg-amber-900 text-amber-200 font-mono font-bold text-xs px-2 py-0.5 rounded border border-amber-700 shadow-inner">
                  {plazo.asignadoInitials}
                </span>
              </div>

              {/* Expediente & Date info */}
              <div className="text-xs font-mono text-amber-900/80 flex items-center justify-between border-b border-amber-900/15 pb-2 mb-2">
                <span className="flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-amber-800" />
                  Vencimiento: {plazo.fechaVencimiento}
                </span>
                {plazo.expedienteNro && (
                  <span className="bg-amber-200/60 px-1.5 py-0.5 rounded text-[11px]">
                    {plazo.expedienteNro}
                  </span>
                )}
              </div>

              {/* Carátula */}
              <h3 className="font-serif text-sm text-amber-950 font-bold leading-snug mb-2 line-clamp-3">
                {plazo.caratula}
              </h3>

              {/* Observaciones */}
              {plazo.observaciones && (
                <p className="text-xs text-amber-900/90 font-sans italic bg-amber-100/60 p-2 rounded border border-amber-300/40 mb-3">
                  "{plazo.observaciones}"
                </p>
              )}

              {/* Bottom Action Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-amber-900/10">
                <span className="text-[11px] text-amber-800 font-mono">
                  {plazo.asignadoNombre || `Asignado: ${plazo.asignadoInitials}`}
                </span>

                <button
                  onClick={(e) => handleComplete(plazo.id, e)}
                  className={`px-3 py-1 text-xs rounded font-bold flex items-center gap-1 transition ${
                    isCompleted
                      ? 'bg-amber-800 text-amber-100 hover:bg-amber-900'
                      : 'btn-brass text-amber-950 hover:text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Reabrir' : 'Dar por Cumplido'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal para Alta de Plazo (Real Skeuomorphic Parchment Window) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment max-w-lg w-full p-6 rounded-xl border-4 border-amber-900 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="border-b border-amber-800/30 pb-3 flex items-center justify-between">
              <h3 className="text-embossed-gold text-lg font-serif">Registrar Nuevo Plazo Procesal</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-amber-900 font-bold hover:text-red-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-amber-900 font-bold mb-1">Carátula / Detalle de la Causa *</label>
                <textarea
                  required
                  rows={3}
                  value={newCaratula}
                  onChange={(e) => setNewCaratula(e.target.value)}
                  placeholder="Ej: HOSPITAL SCHESTAKOW P/ REYES JUAN P/ INTERNACION LEY 26.657"
                  className="input-recessed w-full font-serif text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Fecha Vencimiento *</label>
                  <input
                    type="date"
                    required
                    value={newFecha}
                    onChange={(e) => setNewFecha(e.target.value)}
                    className="input-recessed w-full font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">Prioridad / Urgencia</label>
                  <select
                    value={newPrioridad}
                    onChange={(e) => setNewPrioridad(e.target.value as PrioridadPlazo)}
                    className="input-recessed w-full font-serif text-xs"
                  >
                    <option value="URG">URG (Urgente)</option>
                    <option value="S_P">S/P (Sin Plazo)</option>
                    <option value="NORMAL">NORMAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Iniciales Asignado *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={newInitials}
                    onChange={(e) => setNewInitials(e.target.value.toUpperCase())}
                    placeholder="LA, JB, JP, AD"
                    className="input-recessed w-full font-mono text-xs font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">N° Expediente (Opcional)</label>
                  <input
                    type="text"
                    value={newExpediente}
                    onChange={(e) => setNewExpediente(e.target.value)}
                    placeholder="EXP-12345/26"
                    className="input-recessed w-full font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Observaciones</label>
                <input
                  type="text"
                  value={newObservaciones}
                  onChange={(e) => setNewObservaciones(e.target.value)}
                  placeholder="Detalle de vista, informe u oficio..."
                  className="input-recessed w-full font-sans text-xs"
                />
              </div>

              <div className="pt-3 border-t border-amber-800/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-metal px-4 py-2 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-brass px-5 py-2 text-xs font-bold"
                >
                  Guardar Plazo
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
