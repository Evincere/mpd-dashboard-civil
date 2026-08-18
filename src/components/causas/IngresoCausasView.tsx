import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { CausaIngreso, CanalIngreso, TipoCausa, EnteHospital } from '../../types';
import { Inbox, Plus, Search, Hospital, ChevronLeft, ChevronRight } from 'lucide-react';

interface IngresoCausasViewProps {
  causas: CausaIngreso[];
  onAddCausa: (causa: Omit<CausaIngreso, 'id'>) => void;
}

export function IngresoCausasView({
  causas,
  onAddCausa
}: IngresoCausasViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCanal, setFilterCanal] = useState<string>('ALL');
  const [filterHospital, setFilterHospital] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // New Causa Form State
  const [newCanal, setNewCanal] = useState<CanalIngreso>('GEJU');
  const [newCaratula, setNewCaratula] = useState('');
  const [newTipo, setNewTipo] = useState<TipoCausa>('INTERNACION_INVOLUNTARIA');
  const [newHospital, setNewHospital] = useState<EnteHospital>('HOSPITAL SCHESTAKOW');
  const [newExpediente, setNewExpediente] = useState('');
  const [newObservaciones, setNewObservaciones] = useState('');

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCanal, filterHospital, pageSize]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCaratula) return;

    onAddCausa({
      fechaIngreso: new Date().toISOString().split('T')[0],
      canal: newCanal,
      sistema: 'IOL Judicial Mendoza',
      caratula: newCaratula,
      tipoCausa: newTipo,
      enteHospital: newHospital,
      estadoCausa: 'NUEVA',
      notificacionStatus: 'NOTIFICADO',
      expedienteNro: newExpediente || undefined,
      observaciones: newObservaciones || undefined
    });

    setNewCaratula('');
    setNewExpediente('');
    setNewObservaciones('');
    setShowModal(false);
  };

  const filteredCausas = causas.filter(c => {
    const matchesSearch = c.caratula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.expedienteNro && c.expedienteNro.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCanal = filterCanal === 'ALL' ? true : c.canal === filterCanal;
    const matchesHospital = filterHospital === 'ALL' ? true : c.enteHospital === filterHospital;

    return matchesSearch && matchesCanal && matchesHospital;
  });

  const totalPages = Math.ceil(filteredCausas.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCausas = filteredCausas.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Control Banner Header */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-blue-700 to-blue-950 flex items-center justify-center border border-blue-400/40 shadow-inner">
            <Inbox className="w-6 h-6 text-blue-200 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Módulo de Ingreso / Egreso de Causas (GEJU — IOL)
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Registro centralizado de amparos, expedientes de Salud Mental Ley 26.657 y notificaciones ({causas.length} causas acumuladas)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-brass px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-serif"
        >
          <Plus className="w-4 h-4 text-amber-100" />
          <span>Registrar Causa Nueva</span>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-mahogany p-3.5 rounded-lg border border-amber-900 shadow-md flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por hospital, cliente o expediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-recessed w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/80 font-bold uppercase text-[11px]">Vía Ingreso:</span>
          <select
            value={filterCanal}
            onChange={(e) => setFilterCanal(e.target.value)}
            className="input-recessed text-xs py-1 px-2 font-mono"
          >
            <option value="ALL">TODAS (GEJU, IOL, MAIL)</option>
            <option value="GEJU">GEJU</option>
            <option value="IOL">IOL</option>
            <option value="MAIL">MAIL</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/80 font-bold uppercase text-[11px]">Ente / Hospital:</span>
          <select
            value={filterHospital}
            onChange={(e) => setFilterHospital(e.target.value)}
            className="input-recessed text-xs py-1 px-2 font-mono"
          >
            <option value="ALL">TODOS LOS HOSPITALES</option>
            <option value="HOSPITAL SCHESTAKOW">Hosp. Schestakow (San Rafael)</option>
            <option value="HOSPITAL REGIONAL MALARGÜE">Hosp. Malargüe</option>
            <option value="HOSPITAL EL CARMEN">Hosp. El Carmen</option>
          </select>
        </div>

      </div>

      {/* List / Table of Causas rendered on Parchment Sheets */}
      <div className="bg-parchment p-4 rounded-xl border-2 border-amber-900 shadow-2xl overflow-x-auto space-y-4">
        
        <table className="w-full text-left text-xs font-serif text-amber-950 border-collapse">
          <thead>
            <tr className="border-b-2 border-amber-800/40 bg-amber-200/50 text-amber-900 uppercase font-mono font-bold">
              <th className="py-2.5 px-3">Fecha</th>
              <th className="py-2.5 px-3">Vía / Sistema</th>
              <th className="py-2.5 px-3">Tipo / Estado</th>
              <th className="py-2.5 px-3">Carátula Expediente / Institución</th>
              <th className="py-2.5 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/10">
            {paginatedCausas.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-amber-900/60 font-serif italic text-xs">
                  No se encontraron causas que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              paginatedCausas.map((causa) => {
                const isSaludMental = causa.caratula.includes('26657') || causa.caratula.includes('INTERNACIÓN') || causa.tipoCausa === 'INTERNACION_INVOLUNTARIA';

                return (
                  <tr key={causa.id} className="hover:bg-amber-100/70 transition">
                    
                    {/* Fecha */}
                    <td className="py-3 px-3 font-mono font-bold text-amber-900 whitespace-nowrap">
                      {causa.fechaIngreso}
                    </td>

                    {/* Vía / Sistema */}
                    <td className="py-3 px-3">
                      <span className="bg-amber-900 text-amber-100 font-mono font-bold text-[11px] px-2 py-0.5 rounded border border-amber-700">
                        {causa.canal}
                      </span>
                      <div className="text-[10px] text-amber-800 font-mono mt-0.5">
                        {causa.sistema}
                      </div>
                    </td>

                    {/* Tipo / Estado Badges */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col items-start gap-1">
                        {isSaludMental ? (
                          <span className="stamp-badge stamp-salud-mental text-[10px]">
                            LEY 26.657 SALUD MENTAL
                          </span>
                        ) : (
                          <span className="stamp-badge stamp-asumido text-[10px]">
                            {causa.tipoCausa}
                          </span>
                        )}

                        <span className={`text-[10px] font-mono font-bold ${
                          causa.estadoCausa === 'NUEVA' ? 'text-red-700' : 'text-amber-800'
                        }`}>
                          ● {causa.estadoCausa}
                        </span>
                      </div>
                    </td>

                    {/* Carátula */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-sm text-amber-950 leading-snug">
                        {causa.caratula}
                      </div>

                      {causa.enteHospital && (
                        <div className="text-xs text-blue-900 font-bold flex items-center gap-1 mt-1">
                          <Hospital className="w-3.5 h-3.5 text-blue-800" />
                          {causa.enteHospital}
                        </div>
                      )}

                      {causa.observaciones && (
                        <div className="text-xs text-amber-800 italic mt-1 bg-amber-100/50 p-1 rounded">
                          Note: {causa.observaciones}
                        </div>
                      )}
                    </td>

                    {/* Action button */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="inline-block bg-amber-200/80 text-amber-950 text-xs px-2.5 py-1 rounded font-mono border border-amber-800/20 font-bold">
                        {causa.expedienteNro || 'S/N Expte'}
                      </span>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="bg-amber-200/40 p-3 rounded-lg border border-amber-800/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif text-amber-950">
          
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="input-recessed text-xs py-0.5 px-2 font-mono"
            >
              <option value={15}>15 por pág.</option>
              <option value={25}>25 por pág.</option>
              <option value={50}>50 por pág.</option>
              <option value={100}>100 por pág.</option>
            </select>
            <span className="text-amber-900 font-mono text-[11px] ml-2">
              Mostrando {filteredCausas.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, filteredCausas.length)} de {filteredCausas.length} causas
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

      </div>

      {/* Modal Alta de Causa Nueva */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment max-w-lg w-full p-6 rounded-xl border-4 border-amber-900 shadow-2xl space-y-4">
            
            <div className="border-b border-amber-800/30 pb-3 flex items-center justify-between">
              <h3 className="text-embossed-gold text-lg font-serif">Registrar Ingreso de Causa Judicial</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-amber-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-amber-900 font-bold mb-1">Carátula Completa de la Causa *</label>
                <textarea
                  required
                  rows={3}
                  value={newCaratula}
                  onChange={(e) => setNewCaratula(e.target.value)}
                  placeholder="Ej: HOSPITAL SCHESTAKOW P/ SANCHEZ MARCOS P/ INTERNACIÓN INVOLUNTARIA LEY 26.657"
                  className="input-recessed w-full font-serif text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Canal de Ingreso</label>
                  <select
                    value={newCanal}
                    onChange={(e) => setNewCanal(e.target.value as CanalIngreso)}
                    className="input-recessed w-full text-xs font-mono"
                  >
                    <option value="GEJU">GEJU</option>
                    <option value="IOL">IOL Judicial</option>
                    <option value="MAIL">MAIL Oficial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">Ente / Hospital Interviniente</label>
                  <select
                    value={newHospital}
                    onChange={(e) => setNewHospital(e.target.value as EnteHospital)}
                    className="input-recessed w-full text-xs font-serif"
                  >
                    <option value="HOSPITAL SCHESTAKOW">Hosp. Schestakow (San Rafael)</option>
                    <option value="HOSPITAL REGIONAL MALARGÜE">Hosp. Malargüe</option>
                    <option value="HOSPITAL EL CARMEN">Hosp. El Carmen</option>
                    <option value="NINGUNO / OTRO">Ninguno / Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Tipo de Causa</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as TipoCausa)}
                    className="input-recessed w-full text-xs font-serif"
                  >
                    <option value="INTERNACION_INVOLUNTARIA">Internación Involuntaria (Ley 26657)</option>
                    <option value="DETERMINACION_CAPACIDAD">Determinación de Capacidad</option>
                    <option value="SUCESION">Sucesión</option>
                    <option value="DIVORCIO">Divorcio</option>
                    <option value="RECLAMO_MEDICAMENTOS">Reclamo Medicamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">N° Expediente</label>
                  <input
                    type="text"
                    value={newExpediente}
                    onChange={(e) => setNewExpediente(e.target.value)}
                    placeholder="26657/2026"
                    className="input-recessed w-full font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Observaciones Iniciales</label>
                <input
                  type="text"
                  value={newObservaciones}
                  onChange={(e) => setNewObservaciones(e.target.value)}
                  placeholder="Detalle de oficio o resolución..."
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
                  Registrar Causa
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
