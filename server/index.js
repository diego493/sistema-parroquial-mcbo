const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// 1. IMPORTAR LAS RUTAS DE AUTENTICACIÓN
const authRoutes = require('./routes/authRoutes');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🟢 RUTA BASE
app.get("/", (req, res) => {
    res.send("API Sistema Parroquial funcionando 🚀 - Diego Supremo");
});

// 🟢 CONECTAR RUTAS DE LOGIN Y REGISTRO
// Esto hace que funcione /api/auth/login
app.use('/api/auth', authRoutes);


// 🟢 REGISTRO DE MIEMBROS PARROQUIALES (Ya lo tenías, lo mantenemos)
app.post('/api/registrar', async (req, res) => {
    try {
        const {
            cedula, nombres, apellidos, telefono,
            parroquia, cargo, estaInscritoCNE,
            centroVotacion, usuarioId
        } = req.body;

        const nuevo = await prisma.miembroParroquial.create({
            data: {
                cedula, nombres, apellidos, telefono,
                parroquia, cargo, estaInscritoCNE,
                centroVotacion: estaInscritoCNE ? centroVotacion : "No inscrito",
                registradoPor: usuarioId
            }
        });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Cédula duplicada o datos inválidos" });
    }
});

// 🟢 DIRECTIVA MUNICIPAL
app.post('/api/directiva', async (req, res) => {
    try {
        const { rol, datos } = req.body;
        if (rol !== 'SUPREMO') return res.status(403).json({ error: "No autorizado" });

        const updated = await prisma.directivaMunicipal.upsert({
            where: { id: "unica_directiva" },
            update: datos,
            create: { id: "unica_directiva", ...datos }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error en directiva" });
    }
});

// 🟢 START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
