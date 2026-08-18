import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Convenio, EstadoConvenio, TipoConvenio } from '../../types';
import { Plus, Search, HeartPulse, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConveniosViewProps {
  convenios: Convenio[];
  onAddConvenio: (convenio: Omit<Convenio, 'id'>) => void;
  onUpdateResultado: (id: string, nuevoResultado: 'ACEPTADO' | 'EN TRÁMITE') => void;
}

export function ConveniosView({
  convenios,
  onAddConvenio,
  onUpdateResultado
}: ConveniosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('ALL');
  const [filterTipo, setFilterTipo] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Form State
  const [newExpte, setNewExpte] = useState('');
  const [newTipo, setNewTipo] = useState<TipoConvenio>('GESTION OSEP MEDICAMENTO');
  const [newEstado, setNewEstado] = useState<EstadoConvenio>('NO INICIADO');
  const [newObservaciones, setNewObservaciones] = useState('');

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado, filterTipo, pageSize]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newExpte) return;

    onAddConvenio({
      fecha: new Date().toISOString().split('T')[0],
      estado: newEstado,
      expteCaratula: newExpte,
      resultado: newEstado === 'INICIADO' ? 'EN TRÁMITE' : 'PENDIENTE',
      observaciones: newObservaciones,
      tipoConvenio: newTipo
    });

    setNewExpte('');
    setNewObservaciones('');
    setShowModal(false);
  };

  const handleAceptar = (id: string) => {
    onUpdateResultado(id, 'ACEPTADO');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const filteredConvenios = convenios.filter(c => {
    const matchesSearch = c.expteCaratula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.observaciones.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === 'ALL' ? true : c.estado === filterEstado;
    const matchesTipo = filterTipo === 'ALL' ? true : c.tipoConvenio === filterTipo;

    return matchesSearch && matchesEstado && matchesTipo;
  });

  const totalPages = Math.ceil(filteredConvenios.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedConvenios = filteredConvenios.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Control Banner */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-purple-700 to-purple-950 flex items-center justify-center border border-purple-400/40 shadow-inner">
            <HeartPulse className="w-6 h-6 text-purple-200 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Gestiones Extrajudiciales, OSEP y Convenios
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Trámites ante OSEP (medicamentos, prótesis), mediaciones de división de bienes y acuerdos de pago ({convenios.length} gestiones acumuladas)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-brass px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-serif"
        >
          <Plus className="w-4 h-4 text-amber-100" />
          <span>Registrar Convenio / Gestión</span>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-mahogany p-3.5 rounded-lg border border-amber-900 shadow-md flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por carátula u observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-recessed w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/80 font-bold uppercase text-[11px]">Estado:</span>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="input-recessed text-xs py-1 px-2 font-mono"
          >
            <option value="ALL">TODOS (INICIADO, NO INICIADO)</option>
            <option value="NO INICIADO">NO INICIADO</option>
            <option value="INICIADO">INICIADO</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/80 font-bold uppercase text-[11px]">Tipo Gestión:</span>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="input-recessed text-xs py-1 px-2 font-mono"
          >
            <option value="ALL">TODOS LOS TIPOS</option>
            <option value="GESTION OSEP MEDICAMENTO">OSEP Medicamentos</option>
            <option value="CONVENIO DIVISION BIENES">División de Bienes</option>
            <option value="ACUERDO DE PAGO">Acuerdo de Pago</option>
          </select>
        </div>

      </div>

      {/* Grid of Parchment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paginatedConvenios.length === 0 ? (
          <div className="col-span-full py-12 text-center text-amber-900/60 font-serif italic text-xs bg-parchment rounded-xl border border-amber-900/30">
            No se encontraron convenios ni gestiones que coincidan con la búsqueda.
          </div>
        ) : (
          paginatedConvenios.map((cnv) => {
            const isAceptado = cnv.resultado === 'ACEPTADO';
            const isOsep = cnv.tipoConvenio.includes('OSEP');

            return (
              <div
                key={cnv.id}
                className="bg-parchment p-4 rounded-xl relative shadow-xl border-2 border-amber-900/40 flex flex-col justify-between space-y-3"
              >
                {/* Paper clip metaphor */}
                <div className="brass-clip absolute -top-2.5 right-8" />

                <div>
                  {/* Header stamps */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {isAceptado ? (
                      <span className="stamp-badge stamp-homologado">ACEPTADO / HOMOLOGADO</span>
                    ) : (
                      <span className="stamp-badge stamp-tramite">{cnv.resultado}</span>
                    )}

                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                      {cnv.fecha}
                    </span>
                  </div>

                  {/* Tipo badge */}
                  <div className="mb-2">
                    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm ${
                      isOsep ? 'bg-purple-900 text-purple-100' : 'bg-amber-900 text-amber-100'
                    }`}>
                      {cnv.tipoConvenio}
                    </span>
                  </div>

                  {/* Title / Expte */}
                  <h3 className="font-serif text-sm font-bold text-amber-950 leading-snug">
                    {cnv.expteCaratula}
                  </h3>

                  {/* Observaciones */}
                  <p className="text-xs font-sans text-amber-900/90 bg-amber-100/60 p-2 rounded border border-amber-300/40 mt-2">
                    {cnv.observaciones}
                  </p>
                </div>

                {/* Action */}
                <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-800 font-bold">Estado: {cnv.estado}</span>

                  {!isAceptado && (
                    <button
                      onClick={() => handleAceptar(cnv.id)}
                      className="btn-brass px-3 py-1 font-bold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Marcar Aceptado</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      <div className="bg-mahogany p-3.5 rounded-lg border border-amber-900 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif text-amber-100">
        <div className="flex items-center gap-2">
          <span>Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="input-recessed text-xs py-0.5 px-2 font-mono text-amber-950"
          >
            <option value={15}>15 por pág.</option>
            <option value={25}>25 por pág.</option>
            <option value={50}>50 por pág.</option>
            <option value={100}>100 por pág.</option>
          </select>
          <span className="text-amber-200 font-mono text-[11px] ml-2">
            Mostrando {filteredConvenios.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, filteredConvenios.length)} de {filteredConvenios.length} convenios
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="btn-metal px-2.5 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <span className="px-3 py-1 font-bold text-amber-200 dark:text-amber-200 bg-amber-950 dark:bg-slate-800 rounded border border-amber-700 dark:border-slate-600 shadow">
            Pág. {currentPage} de {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="btn-metal px-2.5 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Nuevo Convenio */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment max-w-lg w-full p-6 rounded-xl border-4 border-amber-900 shadow-2xl space-y-4">
            
            <div className="border-b border-amber-800/30 pb-3 flex items-center justify-between">
              <h3 className="text-embossed-gold text-lg font-serif">Registrar Convenio / Gestión Extrajudicial</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-amber-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-amber-900 font-bold mb-1">N° Expte / Carátula o Beneficiario *</label>
                <input
                  type="text"
                  required
                  value={newExpte}
                  onChange={(e) => setNewExpte(e.target.value)}
                  placeholder="Ej: SRA. ROQUER GLADYS P/ GESTION OSEP MEDICAMENTO"
                  className="input-recessed w-full font-serif text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Tipo de Gestión</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as TipoConvenio)}
                    className="input-recessed w-full text-xs font-serif"
                  >
                    <option value="GESTION OSEP MEDICAMENTO">OSEP Medicamentos</option>
                    <option value="GESTION OSEP IMPLANTE/AUDIFONO">OSEP Prótesis / Implante</option>
                    <option value="CONVENIO DIVISION BIENES">Convenio División de Bienes</option>
                    <option value="ACUERDO DE PAGO">Acuerdo de Pago</option>
                    <option value="LEVANTE INHIBICION">Levantamiento de Inhibición</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">Estado Tramitación</label>
                  <select
                    value={newEstado}
                    onChange={(e) => setNewEstado(e.target.value as EstadoConvenio)}
                    className="input-recessed w-full text-xs font-mono"
                  >
                    <option value="NO INICIADO">NO INICIADO</option>
                    <option value="INICIADO">INICIADO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Observaciones de la Gestión *</label>
                <textarea
                  required
                  rows={3}
                  value={newObservaciones}
                  onChange={(e) => setNewObservaciones(e.target.value)}
                  placeholder="Detalles del pedido de medicamentos, tratativas conciliatorias o liquidación..."
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
                  Guardar Convenio
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
