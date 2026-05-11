import React, { useState } from 'react';

const FormularioRegistro = () => {
  const [estaInscrito, setEstaInscrito] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-100 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registro de Cuadros</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
            <input type="text" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="V-00000000" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
              <input type="text" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
              <input type="text" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parroquia</label>
            <select className="w-full p-3 rounded-lg border border-gray-200 bg-white">
              <option>Coquivacoa</option>
              <option>Chiquinquirá</option>
              <option>Juana de Ávila</option>
              {/* Aquí irán las 18 parroquias */}
            </select>
          </div>

          {/* CHECKLIST CNE ESTÉTICO */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl mt-6">
            <span className="text-sm font-semibold text-blue-900">¿Inscrito en el CNE?</span>
            <button 
              type="button"
              onClick={() => setEstaInscrito(!estaInscrito)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 ${estaInscrito ? 'bg-blue-600' : 'bg-gray-300'} relative`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${estaInscrito ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          {estaInscrito && (
            <div className="mt-4 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Votación</label>
              <input type="text" className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nombre de la escuela..." />
            </div>
          )}

          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-6">
            Guardar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioRegistro;
