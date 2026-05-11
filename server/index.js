const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🟢 RUTA BASE (para que no salga "Cannot GET /")
app.get("/", (req, res) => {
    res.send("API Sistema Parroquial funcionando 🚀");
});


// 🟢 REGISTRO DE MIEMBROS PARROQUIALES
app.post('/api/registrar', async (req, res) => {
    try {
        const {
            cedula,
            nombres,
            apellidos,
            telefono,
            parroquia,
            cargo,
            estaInscritoCNE,
            centroVotacion,
            usuarioId
        } = req.body;

        const nuevo = await prisma.miembroParroquial.create({
            data: {
                cedula,
                nombres,
                apellidos,
                telefono,
                parroquia,
                cargo,
                estaInscritoCNE,
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


// 🟢 DIRECTIVA MUNICIPAL (PROTEGIDA SIMULADA)
app.post('/api/directiva', async (req, res) => {
    try {
        const { rol, datos } = req.body;

        if (rol !== 'SUPREMO') {
            return res.status(403).json({ error: "No autorizado" });
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
        res.status(500).json({ error: "Error en directiva" });
    }
});


// 🟢 START SERVER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
