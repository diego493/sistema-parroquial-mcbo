const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// RUTA: Registro de Miembros Parroquiales (Manual + Checklist CNE)
app.post('/api/registrar', async (req, res) => {
    try {
        const { cedula, nombres, apellidos, telefono, parroquia, cargo, estaInscritoCNE, centroVotacion, usuarioId } = req.body;
        
        const nuevo = await prisma.miembroParroquial.create({
            data: {
                cedula, nombres, apellidos, telefono, parroquia, cargo,
                estaInscritoCNE,
                centroVotacion: estaInscritoCNE ? centroVotacion : "No inscrito",
                registradoPor: usuarioId
            }
        });
        res.status(201).json(nuevo);
    } catch (e) {
        res.status(400).json({ error: "Cédula duplicada o datos inválidos" });
    }
});

// RUTA: Directiva Municipal (Protegida para Supremo)
app.post('/api/directiva', async (req, res) => {
    const { rol, datos } = req.body;
    if (rol !== 'SUPREMO') return res.status(403).json({ error: "No autorizado" });

    const updated = await prisma.directivaMunicipal.upsert({
        where: { id: "unica_directiva" },
        update: datos,
        create: { id: "unica_directiva", ...datos }
    });
    res.json(updated);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
