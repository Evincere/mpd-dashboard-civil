import { useState } from 'react';
import type { FormEvent, DragEvent } from 'react';
import type { TareaDiaria, EstadoTarea, AccionTarea } from '../../types';
import { CheckSquare, Plus, Search, User, ArrowRight, ArrowLeft, GripVertical, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TareasKanbanViewProps {
  tareas: TareaDiaria[];
  onAddTask: (tarea: Omit<TareaDiaria, 'id'>) => void;
  onUpdateStatus: (id: string, nextStatus: EstadoTarea) => void;
}

export function TareasKanbanView({
  tareas,
  onAddTask,
  onUpdateStatus
}: TareasKanbanViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResponsable, setFilterResponsable] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  
  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<EstadoTarea | null>(null);

  // Form state
  const [newPersona, setNewPersona] = useState('');
  const [newResponsable, setNewResponsable] = useState('ALVARADO');
  const [newAccion, setNewAccion] = useState<AccionTarea>('ASUME');
  const [newNotas, setNewNotas] = useState('');

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPersona) return;

    onAddTask({
      fecha: new Date().toISOString().split('T')[0],
      caratulaPersona: newPersona,
      responsableNombre: newResponsable,
      accion: newAccion,
      estado: 'PENDIENTE',
      notas: newNotas || undefined
    });

    setNewPersona('');
    setNewNotas('');
    setShowModal(false);
  };

  const handleStatusChange = (id: string, nextStatus: EstadoTarea) => {
    onUpdateStatus(id, nextStatus);

    if (nextStatus === 'COMPLETADA') {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent, status: EstadoTarea) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: DragEvent, status: EstadoTarea) => {
    e.preventDefault();
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: DragEvent, targetStatus: EstadoTarea) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      const task = tareas.find(t => t.id === taskId);
      if (task && task.estado !== targetStatus) {
        handleStatusChange(taskId, targetStatus);
      }
    }
    setDraggedTaskId(null);
  };

  const filteredTareas = tareas.filter(t => {
    const matchesSearch = t.caratulaPersona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.accion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResp = filterResponsable === 'ALL' ? true : t.responsableNombre === filterResponsable;

    return matchesSearch && matchesResp;
  });

  const columns: { status: EstadoTarea; title: string; stamp: string; color: string }[] = [
    { status: 'PENDIENTE', title: 'Tareas Pendientes', stamp: 'stamp-urgente', color: 'border-red-800' },
    { status: 'EN_PROCESO', title: 'En Tramitación', stamp: 'stamp-tramite', color: 'border-amber-800' },
    { status: 'COMPLETADA', title: 'Tareas Finalizadas', stamp: 'stamp-homologado', color: 'border-emerald-800' }
  ];

  const getPreviousStatus = (current: EstadoTarea): EstadoTarea | null => {
    if (current === 'EN_PROCESO') return 'PENDIENTE';
    if (current === 'COMPLETADA') return 'EN_PROCESO';
    return null;
  };

  const getNextStatus = (current: EstadoTarea): EstadoTarea | null => {
    if (current === 'PENDIENTE') return 'EN_PROCESO';
    if (current === 'EN_PROCESO') return 'COMPLETADA';
    return null;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Top Brushed Metal Header */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-amber-600 to-amber-900 flex items-center justify-center border border-amber-400/40 shadow-inner">
            <CheckSquare className="w-6 h-6 text-amber-200 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Tablero Kanban de Asignación Diaria de Tareas
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Distribución operativa por integrante. Arrastra las tarjetas para cambiar de estado o usa las flechas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-brass px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-serif"
        >
          <Plus className="w-4 h-4 text-amber-100" />
          <span>Nueva Tarea Diaria</span>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-mahogany p-3.5 rounded-lg border border-amber-900 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar tarea, persona o acción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-recessed w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/80 font-bold uppercase text-[11px]">Responsable:</span>
          <select
            value={filterResponsable}
            onChange={(e) => setFilterResponsable(e.target.value)}
            className="input-recessed text-xs py-1 px-2 font-mono"
          >
            <option value="ALL">TODOS (ALVARADO, DI MENZA)</option>
            <option value="ALVARADO">Dr. ALVARADO</option>
            <option value="DI MENZA">Dra. DI MENZA</option>
          </select>
        </div>

      </div>

      {/* Kanban Board Columns on Ruled Legal Pad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const columnTasks = filteredTareas.filter(t => t.estado === col.status);
          const isDragOver = dragOverColumn === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={(e) => handleDragLeave(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`bg-paper-legal p-4 rounded-xl shadow-xl min-h-[500px] border-t-4 transition-all flex flex-col ${
                col.color
              } ${
                isDragOver
                  ? 'ring-4 ring-amber-500/60 bg-amber-100/90 scale-[1.01]'
                  : ''
              }`}
            >
              
              {/* Column Header */}
              <div className="border-b-2 border-amber-900/30 pb-2 mb-4 flex items-center justify-between">
                <span className={`stamp-badge ${col.stamp} text-[11px]`}>
                  {col.title} ({columnTasks.length})
                </span>
                <span className="text-amber-900 text-xs font-mono font-bold">2026</span>
              </div>

              {/* Drop Target Indicator when dragging */}
              {isDragOver && (
                <div className="p-3 mb-3 border-2 border-dashed border-amber-700 bg-amber-200/50 rounded-lg text-center text-xs font-bold text-amber-900 animate-pulse">
                  Soltar tarjeta aquí para mover a {col.title}
                </div>
              )}

              {/* Tasks List */}
              <div className="space-y-4 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-10 text-amber-900/60 font-serif text-xs italic border-2 border-dashed border-amber-900/20 rounded-lg">
                    No hay tareas en este estado. Arrastra una tarjeta aquí.
                  </div>
                ) : (
                  columnTasks.map((tarea) => {
                    const prevStatus = getPreviousStatus(col.status);
                    const nextStatus = getNextStatus(col.status);
                    const isBeingDragged = draggedTaskId === tarea.id;

                    return (
                      <div
                        key={tarea.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tarea.id)}
                        onDragEnd={() => setDraggedTaskId(null)}
                        className={`bg-parchment p-3.5 rounded-lg relative shadow-md border border-amber-900/30 transition hover:shadow-xl group cursor-grab active:cursor-grabbing select-none ${
                          isBeingDragged ? 'opacity-40 scale-95 border-amber-600' : ''
                        }`}
                      >
                        {/* Brass Pin & Drag Handle */}
                        <div className="brass-pin -top-2 left-4" />
                        
                        <div className="absolute top-3 right-2 text-amber-800/40 group-hover:text-amber-800 transition" title="Arrastrar tarjeta">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Header info */}
                        <div className="flex items-center justify-between text-xs font-mono text-amber-900 mb-1 border-b border-amber-900/10 pb-1 pr-5">
                          <span className="font-bold flex items-center gap-1">
                            <User className="w-3 h-3 text-amber-800" />
                            {tarea.responsableNombre}
                          </span>
                          <span className="text-[10px] text-amber-700">{tarea.fecha}</span>
                        </div>

                        {/* Action Stamp Tag */}
                        <div className="my-2">
                          <span className="inline-block bg-amber-900 text-amber-100 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm uppercase">
                            ⚡ {tarea.accion}
                          </span>
                        </div>

                        {/* Title Persona */}
                        <h4 className="font-serif text-sm font-bold text-amber-950 leading-snug">
                          {tarea.caratulaPersona}
                        </h4>

                        {tarea.notas && (
                          <p className="text-xs text-amber-900/80 font-sans italic bg-amber-100/60 p-1.5 rounded mt-2 border border-amber-200">
                            "{tarea.notas}"
                          </p>
                        )}

                        {/* Movement controls (Left & Right arrows + state change) */}
                        <div className="mt-3 pt-2 border-t border-amber-900/10 flex items-center justify-between gap-1">
                          {prevStatus ? (
                            <button
                              onClick={() => handleStatusChange(tarea.id, prevStatus)}
                              className="btn-metal px-2 py-1 text-[10px] font-bold flex items-center gap-1 text-amber-200"
                              title={`Volver a ${prevStatus === 'PENDIENTE' ? 'Pendiente' : 'En Tramitación'}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span className="hidden sm:inline">Retroceder</span>
                            </button>
                          ) : <div />}

                          {nextStatus && (
                            <button
                              onClick={() => handleStatusChange(tarea.id, nextStatus)}
                              className="btn-brass px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 ml-auto"
                              title={`Avanzar a ${nextStatus === 'EN_PROCESO' ? 'En Tramitación' : 'Finalizadas'}`}
                            >
                              <span>{nextStatus === 'COMPLETADA' ? 'Finalizar' : 'Avanzar'}</span>
                              {nextStatus === 'COMPLETADA' ? <CheckCircle className="w-3 h-3 text-amber-950" /> : <ArrowRight className="w-3 h-3 text-amber-950" />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Nueva Tarea */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment max-w-lg w-full p-6 rounded-xl border-4 border-amber-900 shadow-2xl space-y-4">
            
            <div className="border-b border-amber-800/30 pb-3 flex items-center justify-between">
              <h3 className="text-embossed-gold text-lg font-serif">Asignar Nueva Tarea Diaria</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-amber-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-amber-900 font-bold mb-1">Carátula / Nombre Persona *</label>
                <input
                  type="text"
                  required
                  value={newPersona}
                  onChange={(e) => setNewPersona(e.target.value)}
                  placeholder="Ej: ZAPATA NATALIA o DIV BILATERAL PAREJAS"
                  className="input-recessed w-full font-serif text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Responsable *</label>
                  <select
                    value={newResponsable}
                    onChange={(e) => setNewResponsable(e.target.value)}
                    className="input-recessed w-full text-xs font-mono"
                  >
                    <option value="ALVARADO">Dr. ALVARADO</option>
                    <option value="DI MENZA">Dra. DI MENZA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">Acción / Hito Procesal *</label>
                  <select
                    value={newAccion}
                    onChange={(e) => setNewAccion(e.target.value as AccionTarea)}
                    className="input-recessed w-full text-xs font-serif"
                  >
                    <option value="ASUME">ASUME</option>
                    <option value="CONTESTA VISTA">CONTESTA VISTA</option>
                    <option value="PEDIR INF SUMARIA ESCRITO HECHO">PEDIR INF SUMARIA ESCRITO HECHO</option>
                    <option value="OF HECHO">OF HECHO</option>
                    <option value="ESTADISTICAS">ESTADISTICAS</option>
                    <option value="AMPARO">AMPARO</option>
                    <option value="PRESCRIPCION ADQUISITIVA">PRESCRIPCION ADQUISITIVA</option>
                    <option value="ACTA CON ANTECEDENTES">ACTA CON ANTECEDENTES</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Notas Adicionales</label>
                <input
                  type="text"
                  value={newNotas}
                  onChange={(e) => setNewNotas(e.target.value)}
                  placeholder="Instrucciones específicas..."
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
                  Crear Tarea
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
