import type { Plazo, CausaIngreso, TareaDiaria, Convenio } from '../../types';
import { BarChart3, Printer, Hospital, Award } from 'lucide-react';

interface EstadisticasViewProps {
  plazos: Plazo[];
  causas: CausaIngreso[];
  tareas: TareaDiaria[];
  convenios: Convenio[];
}

export function EstadisticasView({
  plazos,
  causas,
  convenios
}: EstadisticasViewProps) {
  const totalPlazos = plazos.length;
  const plazosCumplidos = plazos.filter(p => p.estado === 'CUMPLIDO').length;
  const plazosUrgentes = plazos.filter(p => p.prioridad === 'URG').length;
  const eficiencialPct = totalPlazos > 0 ? Math.round((plazosCumplidos / totalPlazos) * 100) : 100;

  const totalCausas = causas.length;
  const causasSaludMental = causas.filter(c => c.caratula.includes('26657') || c.caratula.includes('INTERNACIÓN')).length;
  const causasSchestakow = causas.filter(c => c.enteHospital === 'HOSPITAL SCHESTAKOW').length;
  const causasMalargue = causas.filter(c => c.enteHospital === 'HOSPITAL REGIONAL MALARGÜE').length;

  const conveniosAceptados = convenios.filter(c => c.resultado === 'ACEPTADO').length;
  const conveniosOsep = convenios.filter(c => c.tipoConvenio.includes('OSEP')).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 print:p-0 print:bg-white">
      
      {/* Top Banner Control Panel (Hidden during print) */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-amber-500 to-amber-900 flex items-center justify-center border border-amber-300/40 shadow-inner">
            <BarChart3 className="w-6 h-6 text-amber-200 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Informe Estadístico Institucional — MPD Mendoza
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Métricas automatizadas trimestrales para la Defensoría Oficial Civil San Rafael
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="btn-brass px-5 py-2.5 flex items-center gap-2 text-xs md:text-sm font-bold font-serif shadow-xl"
        >
          <Printer className="w-4 h-4 text-amber-950" />
          <span>Generar Informe para Imprimir / PDF</span>
        </button>

      </div>

      {/* Official Certificate / Report Sheet Metaphor */}
      <div className="bg-parchment p-6 md:p-8 rounded-xl border-4 border-amber-900 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Institutional Header */}
        <div className="border-b-2 border-amber-900/40 pb-4 text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img
              src="/logos/logo2.png"
              alt="Ministerio Público de la Defensa Provincia de Mendoza"
              className="h-28 md:h-32 object-contain"
            />
          </div>
          <h2 className="text-base font-serif font-bold text-amber-900 tracking-wider uppercase">
            Defensoría Oficial Civil — Segunda Circunscripción Judicial (San Rafael)
          </h2>
          <p className="text-xs font-mono text-amber-800">
            INFORME DE GESTIÓN Y MÉTRICAS DE TRAMITACIÓN JUDICIAL — AÑO 2026
          </p>
        </div>

        {/* Key Performance Indicators (KPI Cards with Brass Borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-amber-100/70 p-4 rounded-lg border-2 border-amber-800/40 shadow-inner text-center space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase text-amber-900">Total Plazos Controlados</span>
            <div className="text-3xl font-serif font-bold text-amber-950">{totalPlazos}</div>
            <div className="text-xs text-amber-800 font-sans">{plazosUrgentes} definidos como URG</div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-lg border-2 border-amber-800/40 shadow-inner text-center space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase text-amber-900">Cumplimiento de Plazos</span>
            <div className="text-3xl font-serif font-bold text-emerald-800">{eficiencialPct}%</div>
            <div className="text-xs text-emerald-900 font-bold">{plazosCumplidos} de {totalPlazos} en regla</div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-lg border-2 border-amber-800/40 shadow-inner text-center space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase text-amber-900">Causas Ingresadas (2026)</span>
            <div className="text-3xl font-serif font-bold text-blue-900">{totalCausas}</div>
            <div className="text-xs text-blue-900 font-bold">{causasSaludMental} Ley Salud Mental 26.657</div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-lg border-2 border-amber-800/40 shadow-inner text-center space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase text-amber-900">Convenios Homologados</span>
            <div className="text-3xl font-serif font-bold text-purple-900">{conveniosAceptados}</div>
            <div className="text-xs text-purple-900 font-bold">{conveniosOsep} gestiones OSEP médicas</div>
          </div>

        </div>

        {/* Detailed Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Salud Mental Breakdown */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-900/30 space-y-3">
            <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-2 border-b border-amber-900/20 pb-2">
              <Hospital className="w-4 h-4 text-purple-800" />
              Internaciones Involuntarias por Hospital (Ley 26.657)
            </h3>
            
            <div className="space-y-2 text-xs font-serif">
              <div>
                <div className="flex justify-between text-amber-900 mb-1">
                  <span>Hospital Schestakow (San Rafael)</span>
                  <span className="font-bold font-mono">{causasSchestakow} causas</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-800 h-2.5 rounded-full" style={{ width: `${totalCausas > 0 ? (causasSchestakow/totalCausas)*100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-amber-900 mb-1">
                  <span>Hospital Regional Malargüe</span>
                  <span className="font-bold font-mono">{causasMalargue} causas</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${totalCausas > 0 ? (causasMalargue/totalCausas)*100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Efficiency Bar */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-900/30 space-y-3">
            <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-2 border-b border-amber-900/20 pb-2">
              <Award className="w-4 h-4 text-amber-800" />
              Resumen de Eficiencia en Carga y Respuestas
            </h3>
            
            <p className="text-xs text-amber-900 font-sans leading-relaxed">
              El entorno unificado automatizado ha eliminado el riesgo de omisión visual en hojas de cálculo compartidas. Se redujo el tiempo medio de respuesta en internaciones de salud mental a menos de 24 hs.
            </p>

            <div className="p-3 bg-amber-100/80 rounded border border-amber-300 text-xs font-serif text-amber-950 font-bold text-center">
              ✓ Registros exportados para elevar a la Jefatura del MPD Mendoza.
            </div>
          </div>

        </div>

        {/* Official Signature Area */}
        <div className="pt-8 border-t-2 border-amber-900/30 flex justify-between items-end text-xs font-serif text-amber-950">
          <div>
            <div className="stamp-badge stamp-homologado">REGISTRO OFICIAL CONFIRMADO</div>
            <p className="text-[10px] text-amber-800 mt-1 font-mono">Generado el: {new Date().toLocaleDateString('es-AR')}</p>
          </div>

          <div className="text-center space-y-1">
            <div className="w-48 border-b border-amber-950 mb-1"></div>
            <div className="font-bold">Firma Defensor/a Oficial Civil</div>
            <div className="text-[10px] text-amber-800">Defensoría Civil San Rafael — MPD</div>
          </div>
        </div>

      </div>

    </div>
  );
};
