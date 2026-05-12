import React, { useState } from 'react';

export default function App() {
  const [rol, setRol] = useState('SUPREMO'); // Forzado para pruebas
  const [vista, setVista] = useState('INICIO');

  // Datos de ejemplo para las parroquias (Luego vendrán de tu DB)
  const parroquiasStatus = [
    { nombre: "Raul Leoni", registros: 1, total: 5 },
    { nombre: "Coquivacoa", registros: 3, total: 5 },
    { nombre: "Chiquinquirá", registros: 5, total: 5 },
    { nombre: "Juana de Ávila", registros: 0, total: 5 },
  ];

  if (!rol) return <Login onLogin={setRol} />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Moderno */}
      <nav className="w-72 bg-white border-r border-gray-100 p-6 flex flex-col shadow-sm">
        <div className="mb-10 px-2">
          <h2 className="font-black text-blue-600 text-2xl tracking-tighter">GESTIÓN MCBO</h2>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Panel de Control Supremo</p>
        </div>
        
        <ul className="space-y-2 flex-1">
          <NavItem active={vista === 'INICIO'} onClick={() => setVista('INICIO')} label="Inicio" icon="🏠" />
          <NavItem active={vista === 'STATUS'} onClick={() => setVista('STATUS')} label="Status Parroquias" icon="📊" />
          <NavItem active={vista === 'REGISTROS'} onClick={() => setVista('REGISTROS')} label="Crear Registros" icon="📝" />
          <NavItem active={vista === 'USUARIOS'} onClick={() => setVista('USUARIOS')} label="Gestionar Usuarios" icon="👥" />
          <NavItem active={vista === 'LOGS'} onClick={() => setVista('LOGS')} label="Historial de Logs" icon="📜" />
        </ul>

        <button onClick={() => setRol(null)} className="p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition flex items-center gap-3">
          <span>🚪</span> Cerrar Sesión
        </button>
      </nav>

      <main className="flex-1 p-10 overflow-y-auto">
        {vista === 'INICIO' && <DashboardPrincipal />}
        {vista === 'STATUS' && <StatusParroquias data={parroquiasStatus} />}
        {vista === 'USUARIOS' && <GestionUsuarios />}
        {vista === 'LOGS' && <HistorialLogs />}
        {vista === 'REGISTROS' && <div className="text-center p-20 bg-white rounded-3xl border">Cargando Formulario de Registro...</div>}
      </main>
    </div>
  );
}

// Componentes Pequeños para el Diseño
const NavItem = ({ active, onClick, label, icon }) => (
  <li onClick={onClick} className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 font-bold ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-gray-50'}`}>
    <span>{icon}</span> {label}
  </li>
);

const StatusParroquias = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((p, i) => (
      <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-gray-800 text-lg">{p.nombre}</h3>
          <span className="text-sm font-bold text-blue-600">{p.registros}/{p.total}</span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all" style={{ width: `${(p.registros/p.total)*100}%` }}></div>
        </div>
        <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">Faltan {p.total - p.registros} cargos por asignar</p>
      </div>
    ))}
  </div>
);

const GestionUsuarios = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-black text-gray-800">Control de Usuarios</h2>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200">+ Crear Usuario</button>
    </div>
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-gray-400 border-b">
          <th className="pb-4">Nombre</th>
          <th className="pb-4">Rol</th>
          <th className="pb-4">Parroquia</th>
          <th className="pb-4">Acciones</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        <tr className="border-b">
          <td className="py-4 font-bold">Admin Central</td>
          <td>ADMIN</td>
          <td>Maracaibo (Global)</td>
          <td className="flex gap-2">
            <button className="text-blue-500 font-bold p-2 bg-blue-50 rounded-lg">Bloquear</button>
            <button className="text-red-500 font-bold p-2 bg-red-50 rounded-lg">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const HistorialLogs = () => (
  <div className="bg-slate-900 text-blue-400 p-8 rounded-3xl font-mono text-xs shadow-2xl">
    <h2 className="text-blue-200 text-lg font-bold mb-6 flex items-center gap-2">
      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span> Terminal de Actividad de la Base de Datos
    </h2>
    <div className="space-y-2 opacity-80">
      <p>[11-05-2026 19:45:02] <span className="text-green-400">SUCCESS:</span> Usuario 'Supremo' inició sesión desde IP 190.203.XX.XX</p>
      <p>[11-05-2026 19:48:10] <span className="text-yellow-400">UPDATE:</span> Parroquia Raul Leoni registró nuevo cargo (1/5)</p>
      <p>[11-05-2026 19:50:00] <span className="text-blue-400">CREATE:</span> Nuevo usuario 'Coord_Coquivacoa' habilitado</p>
    </div>
  </div>
);

const DashboardPrincipal = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-blue-600">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Total Registrados</p>
            <h3 className="text-4xl font-black text-gray-800 mt-2">1,240</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-green-400">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Efectividad CNE</p>
            <h3 className="text-4xl font-black text-gray-800 mt-2">85%</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-red-400">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Alertas Rojas</p>
            <h3 className="text-4xl font-black text-gray-800 mt-2">4 Parroquias</h3>
        </div>
    </div>
);
