import React, { useState } from 'react';

// Pantalla de Login Estética
const Login = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica simple por ahora: si es 'supremo', entra como tal
    if (user === 'supremo' && pass === 'Maracaibo2026') {
      onLogin('SUPREMO');
    } else if (user === 'parroquia') {
      onLogin('PARROQUIAL');
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-blue-100 w-full max-w-sm border border-gray-50">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white text-3xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800">Sistema Parroquial</h1>
          <p className="text-gray-400 text-sm mt-2">Ingresa tus credenciales de acceso</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" placeholder="Usuario" 
            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password" placeholder="Contraseña" 
            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente Principal con Roles
export default function App() {
  const [rol, setRol] = useState(null); // NULL = No logueado

  if (!rol) return <Login onLogin={setRol} />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar de Navegación */}
      <nav className="w-64 bg-white border-r border-gray-100 p-6 hidden md:block">
        <h2 className="font-black text-blue-600 text-xl mb-10">GESTIÓN MCBO</h2>
        <ul className="space-y-4">
          <li className="text-blue-600 font-bold p-3 bg-blue-50 rounded-xl cursor-pointer">Inicio</li>
          {rol === 'SUPREMO' && <li className="text-gray-500 font-medium p-3 hover:bg-gray-50 rounded-xl cursor-pointer">Todas las Parroquias</li>}
          <li className="text-gray-500 font-medium p-3 hover:bg-gray-50 rounded-xl cursor-pointer">Carga Manual</li>
          <li onClick={() => setRol(null)} className="text-red-400 font-medium p-3 hover:bg-red-50 rounded-xl cursor-pointer mt-20">Cerrar Sesión</li>
        </ul>
      </nav>

      {/* Contenido según el Rol */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              Bienvenido, {rol === 'SUPREMO' ? 'Usuario Supremo' : 'Coordinador Parroquial'}
            </h1>
            <p className="text-gray-500">Estado actual de la gestión en Maracaibo</p>
          </div>
        </header>

        {rol === 'SUPREMO' ? <DashboardSupremo /> : <DashboardParroquial />}
      </main>
    </div>
  );
}

// Vista específica para ti (SUPREMO)
const DashboardSupremo = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Total Registrados</p>
      <h3 className="text-4xl font-black text-gray-800 mt-2">1,240</h3>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-blue-600">
      <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Inscritos CNE</p>
      <h3 className="text-4xl font-black text-gray-800 mt-2">85%</h3>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-red-400">
      <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Parroquias Faltantes</p>
      <h3 className="text-4xl font-black text-gray-800 mt-2">4</h3>
    </div>
  </div>
);

const DashboardParroquial = () => (
  <div className="bg-blue-600 p-8 rounded-3xl text-white">
    <h3 className="text-2xl font-bold">Tu Parroquia: Coquivacoa</h3>
    <p className="mt-2 opacity-80">Usa el botón de carga manual para registrar nuevos cuadros.</p>
  </div>
);
