import { useState } from "react";
import {
  Home,
  Users,
  FileText,
  BarChart3,
  History,
  Shield
} from "lucide-react";

export default function App() {
  const [view, setView] = useState("dashboard");

  // 🔵 Sidebar items
  const menuItems = [
    { id: "dashboard", label: "Inicio", icon: Home },
    { id: "status", label: "Status Parroquias", icon: BarChart3 },
    { id: "create", label: "Crear Registros", icon: FileText },
    { id: "users", label: "Gestionar Usuarios", icon: Users },
    { id: "logs", label: "Historial Logs", icon: History }
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center gap-2">
          <Shield size={20} />
          Sistema Parroquial
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                  view === item.id
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Supremo</h1>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <p>Total Registros</p>
                <h2 className="text-2xl font-bold">128</h2>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <p>Inscritos CNE</p>
                <h2 className="text-2xl font-bold">76%</h2>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <p>Parroquias Activas</p>
                <h2 className="text-2xl font-bold">12</h2>
              </div>
            </div>
          </div>
        )}

        {/* STATUS PARROQUIAS */}
        {view === "status" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Status Parroquias</h1>

            {[
              { name: "Raúl Leoni", value: 1, total: 5 },
              { name: "Caricuao", value: 3, total: 5 },
              { name: "El Valle", value: 5, total: 5 }
            ].map((p, i) => (
              <div key={i} className="bg-white p-4 rounded shadow mb-3">
                <div className="flex justify-between">
                  <p>{p.name}</p>
                  <p>{p.value}/{p.total}</p>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{
                      width: `${(p.value / p.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREAR REGISTROS */}
        {view === "create" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Crear Registro</h1>

            <div className="bg-white p-4 rounded shadow space-y-3">
              <input className="w-full p-2 border" placeholder="Cédula" />
              <input className="w-full p-2 border" placeholder="Nombres" />
              <input className="w-full p-2 border" placeholder="Apellidos" />

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {view === "users" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

            <table className="w-full bg-white shadow rounded overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Rol</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {[
                  { name: "Juan Pérez", role: "ADMIN" },
                  { name: "Ana López", role: "AFILIADO" }
                ].map((u, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-yellow-500 px-2 py-1 text-white rounded">
                        Bloquear
                      </button>
                      <button className="bg-red-600 px-2 py-1 text-white rounded">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LOGS */}
        {view === "logs" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Historial de Logs</h1>

            <div className="bg-black text-green-400 p-4 rounded font-mono h-96 overflow-y-auto">
              <p>[2026-05-11] Usuario ADMIN creó registro</p>
              <p>[2026-05-11] Nueva directiva actualizada</p>
              <p>[2026-05-11] Login exitoso SUPREMO</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
