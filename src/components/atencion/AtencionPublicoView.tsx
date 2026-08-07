import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AtencionPublico } from '../../types';
import { PhoneCall, Plus, Search } from 'lucide-react';

interface AtencionPublicoViewProps {
  atenciones: AtencionPublico[];
  onAddAtencion: (atn: Omit<AtencionPublico, 'id'>) => void;
}

export function AtencionPublicoView({
  atenciones,
  onAddAtencion
}: AtencionPublicoViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('');
  const [medio, setMedio] = useState<'WHATSAPP' | 'TELEFONO' | 'PRESENCIAL'>('WHATSAPP');

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre || !motivo) return;

    onAddAtencion({
      fecha: new Date().toISOString().split('T')[0],
      personaNombre: nombre,
      telefonoWsp: telefono || 'Sin teléfono',
      motivoConsulta: motivo,
      medioContacto: medio,
      atendidoPor: 'Mesa de Entrada',
      estado: 'EN_SEGUIMIENTO'
    });

    setNombre('');
    setTelefono('');
    setMotivo('');
    setShowModal(false);
  };

  const filtered = atenciones.filter(a =>
    a.personaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.motivoConsulta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Control Banner */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-emerald-700 to-emerald-950 flex items-center justify-center border border-emerald-400/40 shadow-inner">
            <PhoneCall className="w-6 h-6 text-emerald-200 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Registro de Atención al Público y WhatsApp / Teléfono
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Seguimiento de consultas presenciales, llamadas y mensajes de usuarios de la Defensoría
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-brass px-4 py-2 flex items-center gap-2 text-xs md:text-sm font-serif"
        >
          <Plus className="w-4 h-4 text-amber-100" />
          <span>Registrar Consulta</span>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-mahogany p-3.5 rounded-lg border border-amber-900 shadow-md flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por ciudadano o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-recessed w-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Desk Logbook */}
      <div className="bg-parchment p-4 rounded-xl border-2 border-amber-900 shadow-2xl space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="p-3.5 rounded-lg bg-amber-100/60 border border-amber-900/20 flex flex-col md:flex-row items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-900 text-amber-100 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {item.medioContacto}
                </span>
                <span className="font-mono text-xs font-bold text-amber-900">{item.fecha}</span>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                  {item.telefonoWsp}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-amber-950">{item.personaNombre}</h4>
              <p className="text-xs font-sans text-amber-900 mt-1">{item.motivoConsulta}</p>
            </div>

            <div className="text-right whitespace-nowrap text-xs font-mono text-amber-800">
              <span>Atendido por: {item.atendidoPor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Atención */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment max-w-lg w-full p-6 rounded-xl border-4 border-amber-900 shadow-2xl space-y-4">
            
            <div className="border-b border-amber-800/30 pb-3 flex items-center justify-between">
              <h3 className="text-embossed-gold text-lg font-serif">Registrar Consulta de Ciudadano</h3>
              <button onClick={() => setShowModal(false)} className="text-amber-900 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-amber-900 font-bold mb-1">Nombre y Apellido del Ciudadano *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Gómez, María Elena"
                  className="input-recessed w-full font-serif text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+54 9 260 4..."
                    className="input-recessed w-full font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">Medio de Contacto</label>
                  <select
                    value={medio}
                    onChange={(e) => setMedio(e.target.value as any)}
                    className="input-recessed w-full font-serif text-xs"
                  >
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="TELEFONO">TELÉFONO</option>
                    <option value="PRESENCIAL">PRESENCIAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Motivo de la Consulta *</label>
                <textarea
                  required
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Detalle del pedido o estado de su expediente..."
                  className="input-recessed w-full font-sans text-xs"
                />
              </div>

              <div className="pt-3 border-t border-amber-800/30 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-metal px-4 py-2 text-xs">Cancelar</button>
                <button type="submit" className="btn-brass px-5 py-2 text-xs font-bold">Guardar Consulta</button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
