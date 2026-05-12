const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// 1. IMPORTAR LAS RUTAS DE AUTENTICACIÓN
const authRoutes = require('./routes/authRoutes');

const app = express();
const prisma = new PrismaClient();

// 2. MIDDLEWARES (Configuración de seguridad y lectura de datos)
app.use(cors());
app.use(express.json()); // Vital para que el servidor entienda el JSON que envía React

// 🟢 RUTA BASE (Prueba de vida)
app.get("/", (req, res) => {
    res.send("API Sistema Parroquial funcionando 🚀 - Diego Supremo");
});

// 🟢 CONECTAR RUTAS DE LOGIN Y REGISTRO
// Todas las rutas de auth ahora empiezan con /api/auth
app.use('/api/auth', authRoutes);


// 🟢 REGISTRO DE MIEMBROS PARROQUIALES
// Esta ruta es la que usará el formulario estético de "Crear Registro"
app.post('/api/registrar', async (req, res) => {
    try {
        const {
            cedula, nombres, apellidos, telefono,
            parroquia, cargo, estaInscritoCNE,
            centroVotacion, registradoPor
        } = req.body;

        const nuevoMiembro = await prisma.miembroParroquial.create({
            data: {
                cedula,
                nombres,
                apellidos,
                telefono,
                parroquia,
                cargo,
                estaInscritoCNE,
                centroVotacion: estaInscritoCNE ? centroVotacion : "No inscrito",
                registradoPor: registradoPor // Aquí va el nombre o ID del que registra
            }
        });

        res.status(201).json(nuevoMiembro);

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(400).json({ error: "Cédula duplicada o datos faltantes" });
    }
});


// 🟢 DIRECTIVA MUNICIPAL (Solo accesible por el SUPREMO)
app.post('/api/directiva', async (req, res) => {
    try {
        const { rol, datos } = req.body;

        if (rol !== 'SUPREMO') {
            return res.status(403).json({ error: "No autorizado. Solo el Supremo puede modificar la directiva." });
        }

        const updated = await prisma.directivaMunicipal.upsert({
            where: { id: "unica_directiva" },
            update: datos,
            create: {
                id: "unica_directiva",
                ...datos
            }
        });

        res.json(updated);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la directiva" });
    }
});


// 🟢 CONFIGURACIÓN DEL PUERTO Y ARRANQUE
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`🔗 Rutas de autenticación listas en /api/auth`);
});
