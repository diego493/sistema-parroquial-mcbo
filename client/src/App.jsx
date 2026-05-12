import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- LISTA OFICIAL DE PARROQUIAS ---
const PARROQUIAS_MARACAIBO = [
  "Antonio Borjas Romero", "Bolívar", "Cacique Mara", "Caracciolo Parra Pérez",
  "Cecilio Acosta", "Cristo de Aranza", "Coquivacoa", "Chiquinquirá",
  "Francisco Eugenio Bustamante", "Idelfonso Vásquez", "Juana de Ávila",
  "Luis Hurtado Higuera", "Manuel Dagnino", "Olegario Villalobos",
  "Raúl Leoni", "Santa Lucía", "Venancio Pulgar", "San Isidro"
];

// --- COMPONENTES DE VISTA ---

const DashboardSupremo = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm border-b-4 border-b-blue-600">
      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Total Registrados</p>
      <h3 className="text-4xl font-black text-gray-800 mt-2">1,240</h3>
    </div>
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm border-b-4 border-b-green-400">
      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Efectividad CNE</p>
      <h3 className="text-4xl font-black text-gray-800 mt-2">85%</h3>
    </div>
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm border-b-4 border-b-red-400">
      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Alertas Rojas</p>
      <h3 className="text-4xl font-black text-gray-800 mt-2">4</h3>
    </div>
  </div>
);

const SeccionUsuarios = ({ usuarios, onToggleStatus, onEliminar }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b border-gray-100">
        <tr>
          <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usuario</th>
          <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Rol / Parroquia</th>
          <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Estado</th>
          <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {usuarios.length === 0 ? (
          <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium">No hay usuarios registrados</td></tr>
        ) : (
          usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-6">
                <p className="font-bold text-slate-800">{u.nombre}</p>
                <p className="text-xs text-slate-400">{u.email} • C.I: {u.cedula}</p>
              </td>
              <td className="p-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase italic">
                  {u.rol?.replace('_', ' ')}
                </span>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{u.parroquia || 'Gestión Municipal'}</p>
              </td>
              <td className="p-6">
                <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${u.activo ? 'text-green-500' : 'text-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${u.activo ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {u.activo ? 'Activo' : 'Bloqueado'}
                </span>
              </td>
              <td className="p-6 flex gap-2">
                <button onClick={() => onToggleStatus(u.id, u.activo)} className="text-[10px] font-bold px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                  {u.activo ? 'Bloquear' : 'Activar'}
                </button>
                <button onClick={() => onEliminar(u.id)} className="text-[10px] font-bold px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('INICIO');
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded = JSON.parse(window.atob(savedToken.split('.')[1]));
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al conectar con la API de usuarios");
    }
  };

  useEffect(() => {
    if (vista === 'USUARIOS') fetchUsuarios();
  }, [vista]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: email.value, password: password.value
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert("Error de acceso: " + (err.response?.data?.msg || "Servidor no disponible"));
    }
  };

  const toggleStatus = async (id, activo) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, { activo: !activo });
      fetchUsuarios();
    } catch (err) { alert("Error al cambiar estado"); }
  };

  const eliminarUser = async (id) => {
    if (window.confirm("¿Confirmas la eliminación definitiva?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`);
        fetchUsuarios();
      } catch (err) { alert("No se pudo eliminar"); }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600">SISTEMA CARGANDO...</div>;

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] w-full max-w-sm shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-black text-center mb-8 text-slate-800 tracking-tighter italic">GESTIÓN MCBO</h2>
        <input name="email" type="email" placeholder="Correo Supremo" className="w-full p-4 mb-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium" required />
        <input name="password" type="password" placeholder="Contraseña" className="w-full p-4 mb-6 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium" required />
        <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">ACCEDER AL PANEL</button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <nav className="w-72 bg-white border-r border-gray-100 p-8 flex flex-col">
        <div className="mb-12">
          <h2 className="font-black text-blue-600 text-2xl tracking-tighter italic">SISTEMA MCBO</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Acceso: {user.rol}</p>
        </div>
        <ul className="space-y-2 flex-1">
          <li onClick={() => setVista('INICIO')} className={`p-4 rounded-2xl cursor-pointer font-bold transition-all ${vista === 'INICIO' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-slate-50'}`}>📊 Dashboard</li>
          {user.rol === 'SUPREMO' && (
            <li onClick={() => setVista('USUARIOS')} className={`p-4 rounded-2xl cursor-pointer font-bold transition-all ${vista === 'USUARIOS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-slate-50'}`}>👥 Gestión Usuarios</li>
          )}
          <li onClick={() => setVista('REGISTRO')} className={`p-4 rounded-2xl cursor-pointer font-bold transition-all ${vista === 'REGISTRO' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-50'}`}>📝 Crear Registro</li>
        </ul>
        <button onClick={() => { localStorage.removeItem('token'); setUser(null); }} className="p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">Cerrar Sesión</button>
      </nav>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight tracking-tighter">Bienvenido, {user.nombre}</h1>
          <p className="text-slate-400 text-sm font-medium">Panel de control de la gestión política municipal</p>
        </header>

        {vista === 'INICIO' && <DashboardSupremo />}
        
        {vista === 'USUARIOS' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Control de Personal</h2>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all">+ Nuevo Usuario</button>
            </div>
            <SeccionUsuarios usuarios={usuarios} onToggleStatus={toggleStatus} onEliminar={eliminarUser} />
          </div>
        )}

        {/* MODAL PARA CREAR USUARIO CORREGIDO */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black mb-6 text-slate-800 tracking-tighter">Registrar Nuevo Integrante</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const d = e.target.elements;
                try {
                  await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
                    cedula: d.cedula.value, 
                    nombre: d.nombre.value, 
                    email: d.email.value, 
                    password: d.password.value, 
                    rol: d.rol.value, 
                    parroquia: d.parroquia.value
                  });
                  alert("¡Usuario creado con éxito!");
                  setShowModal(false);
                  fetchUsuarios();
                } catch (err) {
                  alert(err.response?.data?.error || "Error al crear: Revisa si la cédula o email ya existen.");
                }
              }} className="space-y-4">
                <input name="cedula" placeholder="Cédula de Identidad" className="w-full p-4 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-600 font-medium" required />
                <input name="nombre" placeholder="Nombre y Apellido" className="w-full p-4 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-600 font-medium" required />
                <input name="email" type="email" placeholder="Correo Electrónico" className="w-full p-4 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-600 font-medium" required />
                <input name="password" type="password" placeholder="Contraseña Temporal" className="w-full p-4 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-600 font-medium" required />
                
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Rol en el Sistema</p>
                <select name="rol" className="w-full p-4 bg-slate-50 rounded-xl border border-gray-100 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="COORDINADOR_PARROQUIAL">Coordinador Parroquial</option>
                  <option value="ADMINISTRADOR">Administrador de Datos</option>
                </select>
                
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Jurisdicción (Parroquia)</p>
                <select name="parroquia" className="w-full p-4 bg-slate-50 rounded-xl border border-gray-100 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600" required>
                  <option value="">Seleccione una Parroquia</option>
                  {PARROQUIAS_MARACAIBO.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 p-4 font-bold text-gray-400 hover:text-gray-600 transition">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white font-black p-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition">CREAR</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
