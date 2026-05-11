const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// RUTA PARA REGISTRAR UN MIEMBRO (Manual)
app.post('/api/registrar', async (req, res) => {
    try {
        const { cedula, nombres, apellidos, telefono, parroquia, cargo, estaInscritoCNE, centroVotacion } = req.body;
        
        const nuevoMiembro = await prisma.persona.create({
            data: {
                cedula,
                nombres,
                apellidos,
                telefono,
                parroquia,
                cargo,
                estaInscritoCNE,
                centroVotacion: estaInscritoCNE ? centroVotacion : "No inscrito",
                registradoPor: "Admin-Manual"
            }
        });
        res.status(201).json({ mensaje: "Registro exitoso", data: nuevoMiembro });
    } catch (error) {
        res.status(400).json({ error: "Error al registrar: Cédula duplicada o datos faltantes" });
    }
});

// RUTA PARA VER EL RESUMEN POR PARROQUIA
app.get('/api/resumen-parroquias', async (req, res) => {
    const resumen = await prisma.persona.groupBy({
        by: ['parroquia'],
        _count: { _all: true }
    });
    res.json(resumen);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
