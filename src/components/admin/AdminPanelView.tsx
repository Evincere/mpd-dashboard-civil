import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { ShieldCheck, Users, Database, Plus, Trash2, Edit, Activity, CheckCircle, RefreshCw, Server, Eye, EyeOff, Download, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../infrastructure/api/apiClient';

interface UserData {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface AuditLogData {
  id: string;
  userId: string;
  userNombre: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  detalles?: string;
  fechaHora: string;
}

interface DbStats {
  dbStatus: string;
  counts: {
    users: number;
    plazos: number;
    causas: number;
    tareas: number;
    convenios: number;
    atencion: number;
    auditLogs: number;
  };
}

export function AdminPanelView() {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'audit' | 'db'>('users');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Data States
  const [users, setUsers] = useState<UserData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogData[]>([]);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal User Form State
  const [showModal, setShowModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    initials: '',
    role: 'Operador',
    email: '',
    password: ''
  });

  const availableRoles = [
    'Administrador',
    'Defensor/a',
    'Codefensor/a',
    'Secretario/a',
    'Prosecretario/a',
    'Empleado/a',
    'Operador'
  ];

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e: any) {
      console.error('Error fetching users:', e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/audit-logs`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (e: any) {
      console.error('Error fetching audit logs:', e);
    }
  };

  const fetchDbStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/db-stats`);
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch (e: any) {
      console.error('Error fetching DB stats:', e);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'users') fetchUsers();
    if (activeSubTab === 'audit') fetchAuditLogs();
    if (activeSubTab === 'db') fetchDbStats();
  }, [activeSubTab]);

  // Database Action Handlers
  const handleDownloadBackup = () => {
    window.open(`${API_BASE_URL}/admin/db/export-backup`, '_blank');
    setSuccessMsg('Descargando respaldo completo de la base de datos (JSON)...');
  };

  const handleRestoreFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`¿Está seguro de restaurar los datos de la base de datos usando el archivo "${file.name}"?`)) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsedJson = JSON.parse(content);

        const res = await fetch(`${API_BASE_URL}/admin/db/restore`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedJson)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setSuccessMsg(data.message);
        fetchDbStats();
        fetchUsers();
      } catch (err: any) {
        setErrorMsg('Error al procesar archivo de respaldo: ' + err.message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handlePurgeAudit = async () => {
    if (!window.confirm('¿Está seguro de borrar todo el historial de auditoría?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/db/purge-audit`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg(data.message);
      fetchAuditLogs();
      fetchDbStats();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      initials: '',
      role: 'Operador',
      email: '',
      password: '123456'
    });
    setShowModalPassword(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (user: UserData) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      initials: user.initials,
      role: user.role,
      email: user.email,
      password: ''
    });
    setShowModalPassword(false);
    setShowModal(true);
  };

  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const url = editingUserId
        ? `${API_BASE_URL}/admin/users/${editingUserId}`
        : `${API_BASE_URL}/admin/users`;
      
      const method = editingUserId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar usuario');
      }

      setSuccessMsg(editingUserId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente con clave 123456');
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!window.confirm(`¿Está seguro de eliminar al usuario ${user.name} (${user.initials})? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${user.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Error al eliminar usuario');
      }

      setSuccessMsg(`Usuario ${user.name} eliminado.`);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Top Admin Header */}
      <div className="bg-brushed-metal p-4 rounded-xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-amber-600 to-amber-900 flex items-center justify-center border border-amber-400/40 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-amber-200 drop-shadow" />
          </div>
          <div>
            <h2 className="text-embossed-gold text-lg md:text-xl font-serif">
              Panel de Administración y Control Central
            </h2>
            <p className="text-slate-300 text-xs font-sans">
              Gestión exclusiva de usuarios, roles, trazabilidad de auditoría e infraestructura PostgreSQL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/80 px-3 py-1.5 rounded-lg border border-amber-800 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-amber-200 font-mono">Modo Administrador Activo</span>
        </div>
      </div>

      {/* Notifications / Feedback Messages */}
      {errorMsg && (
        <div className="p-3 bg-red-900/80 text-red-100 rounded-lg border border-red-700 text-xs flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-900/80 text-emerald-100 rounded-lg border border-emerald-700 text-xs flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Sub-tabs Navigation */}
      <div className="flex border-b border-amber-900/40 gap-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 text-xs font-serif font-bold rounded-t-lg flex items-center gap-2 transition ${
            activeSubTab === 'users'
              ? 'bg-amber-900 text-amber-100 border-t-2 border-amber-400'
              : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestión de Usuarios ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 text-xs font-serif font-bold rounded-t-lg flex items-center gap-2 transition ${
            activeSubTab === 'audit'
              ? 'bg-amber-900 text-amber-100 border-t-2 border-amber-400'
              : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Trazabilidad / Auditoría ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('db')}
          className={`px-4 py-2 text-xs font-serif font-bold rounded-t-lg flex items-center gap-2 transition ${
            activeSubTab === 'db'
              ? 'bg-amber-900 text-amber-100 border-t-2 border-amber-400'
              : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Acciones y Estado de Base de Datos</span>
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-mahogany p-3 rounded-lg border border-amber-900">
            <span className="text-amber-200 text-xs font-serif">
              Usuarios autorizados para acceder y colaborar en la plataforma
            </span>
            <button
              onClick={handleOpenCreateModal}
              className="btn-brass px-3 py-1.5 text-xs flex items-center gap-1 font-bold font-serif"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          <div className="bg-parchment dark:bg-slate-900 rounded-xl border-2 border-amber-900 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-mahogany text-amber-100 uppercase text-[10px] tracking-wider border-b border-amber-800">
                  <tr>
                    <th className="p-3">Usuario / Nombre</th>
                    <th className="p-3">Iniciales</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rol Seteado</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10 dark:divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-amber-100/50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-3 font-bold font-serif text-amber-950 dark:text-slate-100 flex items-center gap-2">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-amber-800"
                        />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-900 dark:text-amber-400">
                        {u.initials}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">
                        {u.email}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'Administrador'
                            ? 'bg-purple-900 text-purple-100 border border-purple-700'
                            : u.role.includes('Defensor')
                            ? 'bg-blue-900 text-blue-100 border border-blue-700'
                            : 'bg-amber-900 text-amber-100 border border-amber-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="btn-brass p-1.5 rounded inline-flex items-center justify-center"
                          title="Editar usuario / Cambiar rol"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {u.initials !== 'semper' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="btn-burgundy p-1.5 rounded inline-flex items-center justify-center"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs & Traceability */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-mahogany p-3 rounded-lg border border-amber-900 flex justify-between items-center text-xs">
            <span className="text-amber-200 font-serif">
              Trazabilidad completa de acciones y operaciones registradas en el sistema
            </span>
            <button
              onClick={fetchAuditLogs}
              className="btn-metal px-3 py-1 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualizar Logs</span>
            </button>
          </div>

          <div className="bg-parchment dark:bg-slate-900 rounded-xl border-2 border-amber-900 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-xs text-left">
                <thead className="bg-mahogany text-amber-100 uppercase text-[10px] tracking-wider sticky top-0 border-b border-amber-800">
                  <tr>
                    <th className="p-3">Fecha / Hora</th>
                    <th className="p-3">Operador</th>
                    <th className="p-3">Acción</th>
                    <th className="p-3">Entidad</th>
                    <th className="p-3">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10 dark:divide-slate-800 font-mono text-[11px]">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-serif">
                        Sin registros de auditoría almacenados.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-amber-100/50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-3 whitespace-nowrap text-amber-900 dark:text-amber-300">
                          {new Date(log.fechaHora).toLocaleString('es-AR')}
                        </td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-100">
                          {log.userNombre}
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-900/80 text-amber-100 px-2 py-0.5 rounded font-bold">
                            {log.accion}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {log.entidad}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 font-sans">
                          {log.detalles || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Database Actions & Health */}
      {activeSubTab === 'db' && (
        <div className="space-y-6">
          <div className="bg-paper-legal dark:bg-slate-900 p-6 rounded-xl border-2 border-amber-900 dark:border-slate-800 shadow-xl space-y-6">
            
            {/* Status Info */}
            <div className="flex items-center justify-between border-b border-amber-900/20 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Server className="w-6 h-6 text-amber-800 dark:text-amber-400" />
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-950 dark:text-amber-200">
                    Mantenimiento y Herramientas de Base de Datos
                  </h3>
                  <p className="text-xs text-amber-900 dark:text-slate-400">
                    {dbStats ? dbStats.dbStatus : 'Conectando con PostgreSQL...'}
                  </p>
                </div>
              </div>

              <button
                onClick={fetchDbStats}
                className="btn-metal px-3 py-1.5 text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar Conteo</span>
              </button>
            </div>

            {/* Counts Grid */}
            {dbStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-amber-100 dark:bg-slate-800 p-3 rounded-lg border border-amber-300 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-900 dark:text-slate-400">Usuarios</span>
                  <div className="text-2xl font-serif font-bold text-amber-950 dark:text-amber-100">{dbStats.counts.users}</div>
                </div>

                <div className="bg-amber-100 dark:bg-slate-800 p-3 rounded-lg border border-amber-300 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-900 dark:text-slate-400">Plazos</span>
                  <div className="text-2xl font-serif font-bold text-amber-950 dark:text-amber-100">{dbStats.counts.plazos}</div>
                </div>

                <div className="bg-amber-100 dark:bg-slate-800 p-3 rounded-lg border border-amber-300 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-900 dark:text-slate-400">Causas</span>
                  <div className="text-2xl font-serif font-bold text-amber-950 dark:text-amber-100">{dbStats.counts.causas}</div>
                </div>

                <div className="bg-amber-100 dark:bg-slate-800 p-3 rounded-lg border border-amber-300 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-900 dark:text-slate-400">Auditorías</span>
                  <div className="text-2xl font-serif font-bold text-amber-950 dark:text-amber-100">{dbStats.counts.auditLogs}</div>
                </div>
              </div>
            )}

            {/* Interactive Admin Actions */}
            <div className="border-t border-amber-900/20 dark:border-slate-800 pt-4 space-y-3">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-400">
                Operaciones Ejecutables por Administrador:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Action 1: Export JSON Backup */}
                <div className="bg-amber-50 dark:bg-slate-800/80 p-4 rounded-lg border border-amber-300 dark:border-slate-700 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-amber-950 dark:text-slate-100 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Respaldar Base de Datos
                    </h5>
                    <p className="text-[11px] text-amber-900 dark:text-slate-400 mt-1">
                      Genera y descarga una copia completa de la base de datos en formato JSON.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="btn-brass w-full py-1.5 text-xs font-bold font-serif flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Backup JSON</span>
                  </button>
                </div>

                {/* Action 2: Restore DB from JSON file */}
                <div className="bg-amber-50 dark:bg-slate-800/80 p-4 rounded-lg border border-amber-300 dark:border-slate-700 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-amber-950 dark:text-slate-100 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Restaurar Base de Datos
                    </h5>
                    <p className="text-[11px] text-amber-900 dark:text-slate-400 mt-1">
                      Carga un archivo `.json` de respaldo previo para restaurar los registros en PostgreSQL.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleRestoreFileSelected}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-brass w-full py-1.5 text-xs font-bold font-serif flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cargar & Restaurar JSON</span>
                  </button>
                </div>

                {/* Action 3: Purge Audit Logs */}
                <div className="bg-amber-50 dark:bg-slate-800/80 p-4 rounded-lg border border-amber-300 dark:border-slate-700 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-amber-950 dark:text-slate-100 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      Purga de Auditoría
                    </h5>
                    <p className="text-[11px] text-amber-900 dark:text-slate-400 mt-1">
                      Vacía el historial acumulado de registros de auditoría para liberar espacio.
                    </p>
                  </div>
                  <button
                    onClick={handlePurgeAudit}
                    className="btn-burgundy w-full py-1.5 text-xs font-bold font-serif flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purgar Registros</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* User Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-parchment dark:bg-slate-900 max-w-md w-full p-6 rounded-xl border-4 border-amber-900 dark:border-slate-700 shadow-2xl space-y-4 text-amber-950 dark:text-slate-100">
            <div className="border-b border-amber-800/30 pb-3 flex justify-between items-center">
              <h3 className="text-embossed-gold text-base font-serif font-bold">
                {editingUserId ? 'Editar Usuario / Rol' : 'Crear Nuevo Usuario'}
              </h3>
              <button onClick={() => setShowModal(false)} className="font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Alejandra Di Menza"
                  className="input-recessed w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Usuario / Iniciales *</label>
                  <input
                    type="text"
                    required
                    value={formData.initials}
                    onChange={e => setFormData({ ...formData, initials: e.target.value })}
                    placeholder="Ej: adimenza"
                    className="input-recessed w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Rol Seteado *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="input-recessed w-full font-mono"
                  >
                    {availableRoles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="adimenza@mpd.mendoza.gov.ar"
                  className="input-recessed w-full font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">
                  {editingUserId ? 'Nueva Contraseña (Opcional)' : 'Contraseña por Defecto'}
                </label>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUserId ? 'Dejar en blanco para no cambiar' : '123456'}
                    className="input-recessed w-full font-mono pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-2 top-2 text-amber-800 dark:text-slate-400 hover:text-amber-950"
                  >
                    {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-800/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-metal px-3 py-1.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-brass px-4 py-1.5 font-bold"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
