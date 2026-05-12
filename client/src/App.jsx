import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- VISTAS SEGÚN ROL (ESTÉTICAS) ---

const DashboardSupremo = ({ stats }) => (
  <div className="space-y-8 animate-fadeIn">
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
    
    <div className="bg-slate-900 text-blue-400 p-8 rounded-3xl font-mono text-xs shadow-2xl">
      <h2 className="text-blue-200 text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span> Terminal de Actividad
      </h2>
      <p>[{new Date().toLocaleString()}] <span className="text-green-400">SUCCESS:</span> Usuario Supremo conectado.</p>
    </div>
  </div>
);

const DashboardAdmin = () => (
  <div className="p-8 bg-white rounded-3xl border border-gray-100">
    <h2 className="text-2xl font-black text-gray-800 mb-4 text-center">🛡️ Gestión Administrativa</h2>
    <p className="text-gray-500 text-center">Aquí podrás gestionar usuarios y revisar logs de auditoría.</p>
  </div>
);

const DashboardParroquial = ({ user }) => (
  <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200">
    <h2 className="text-2xl font-bold">📍 Parroquia: {user.parroquia || 'No asignada'}</h2>
    <p className="opacity-80 mt-2">Usa el menú para registrar nuevos miembros en tu zona.</p>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('INICIO');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        // Decodificamos el token para mantener la sesión al refrescar
        const base64Url = savedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64));
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    try {
      // CORRECCIÓN: Ruta completa con /api
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: email.value,
        password: password.value
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.msg || "Error de autenticación");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-blue-600">Iniciando Sistema...</div>;

  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-slate-900 p-4">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">GESTIÓN MCBO</h2>
          <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">Acceso Restringido</p>
        </div>
        <div className="space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          <input name="password" type="password" placeholder="Contraseña" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            INGRESAR
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR DINÁMICO */}
      <nav className="w-72 bg-white border-r border-gray-100 p-8 flex flex-col shadow-sm">
        <div className="mb-12">
          <h2 className="font-black text-blue-600 text-2xl tracking-tighter">SISTEMA MCBO</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.rol}</p>
        </div>
        
        <ul className="space-y-3 flex-1">
          <li onClick={() => setVista('INICIO')} className={`p-4 rounded-2xl cursor-pointer font-bold transition-all ${vista === 'INICIO' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-slate-50'}`}>
            📊 Dashboard
          </li>
          
          {['SUPREMO', 'ADMINISTRADOR'].includes(user.rol) && (
            <li onClick={() => setVista('USUARIOS')} className={`p-4 rounded-2xl cursor-pointer font-bold transition-all ${vista === 'USUARIOS' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-50'}`}>
              👥 Usuarios
            </li>
          )}

          <li onClick={() => setVista('REGISTRO')} className={`p-4 rounded-2xl cursor-pointer font-bold transition-all ${vista === 'REGISTRO' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-50'}`}>
            📝 Crear Registro
          </li>
        </ul>

        <button 
          onClick={() => { localStorage.removeItem('token'); setUser(null); }} 
          className="p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition text-left"
        >
          🚪 Cerrar Sesión
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bienvenido, {user.nombre}</h1>
          <p className="text-slate-400 font-medium">Panel de control de la gestión política</p>
        </header>

        {vista === 'INICIO' && (
          <>
            {user.rol === 'SUPREMO' && <DashboardSupremo />}
            {user.rol === 'ADMINISTRADOR' && <DashboardAdmin />}
            {user.rol === 'COORDINADOR_PARROQUIAL' && <DashboardParroquial user={user} />}
          </>
        )}
        
        {vista === 'REGISTRO' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm max-w-2xl mx-auto">
             <h2 className="text-xl font-bold mb-6">Formulario de Registro</h2>
             <p className="text-gray-400">Aquí irá el formulario que diseñamos con el switch del CNE.</p>
          </div>
        )}
      </main>
    </div>
  );
}
