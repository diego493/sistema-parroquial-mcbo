import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- COMPONENTES DE VISTA SEGÚN ROL ---
const DashboardSupremo = () => <div className="p-8"><h1>👑 Panel Global de Maracaibo</h1><p>Control total de las 18 parroquias.</p></div>;
const DashboardAdmin = () => <div className="p-8"><h1>🛡️ Gestión Administrativa</h1><p>Control de usuarios y logs.</p></div>;
const DashboardParroquial = () => <div className="p-8"><h1>📍 Gestión de Parroquia</h1><p>Registro local de cuadros.</p></div>;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar, verificamos si hay sesión activa
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // Aquí podrías validar el token con el backend
      const decoded = JSON.parse(atob(savedToken.split('.')[1])); 
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: email.value,
        password: password.value
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert("Error de autenticación");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando Sistema...</div>;

  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-black mb-6 text-center">LOGIN GESTIÓN</h2>
        <input name="email" type="email" placeholder="Email" className="w-full mb-4 p-4 bg-slate-100 rounded-xl" required />
        <input name="password" type="password" placeholder="Contraseña" className="w-full mb-6 p-4 bg-slate-100 rounded-xl" required />
        <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">INGRESAR</button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR DINÁMICO */}
      <nav className="w-64 bg-white border-r p-6">
        <h2 className="font-black text-blue-600 mb-10">SISTEMA MCBO</h2>
        <ul className="space-y-2">
          <li className="font-bold p-3 bg-blue-50 text-blue-600 rounded-xl">Dashboard</li>
          
          {/* Solo Supremo ve esto */}
          {user.role === 'SUPREMO' && (
            <li className="p-3 text-gray-500 hover:bg-slate-50 rounded-xl cursor-pointer">Configuración Global</li>
          )}

          {/* Supremo y Admin ven esto */}
          {['SUPREMO', 'ADMINISTRADOR'].includes(user.role) && (
            <li className="p-3 text-gray-500 hover:bg-slate-50 rounded-xl cursor-pointer">Gestión de Usuarios</li>
          )}

          <li onClick={() => { localStorage.removeItem('token'); setUser(null); }} className="p-3 text-red-500 mt-20 cursor-pointer">Cerrar Sesión</li>
        </ul>
      </nav>

      {/* RENDERIZADO POR ROL */}
      <main className="flex-1">
        {user.role === 'SUPREMO' && <DashboardSupremo />}
        {user.role === 'ADMINISTRADOR' && <DashboardAdmin />}
        {user.role === 'COORDINADOR_PARROQUIAL' && <DashboardParroquial />}
      </main>
    </div>
  );
}
