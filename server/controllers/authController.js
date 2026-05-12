const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTRO DE USUARIOS (Solo para que tú crees los primeros) ---
exports.register = async (req, res) => {
    try {
        const { cedula, email, password, nombre, rol, parroquia } = req.body;

        // 1. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Guardar en DB
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                cedula,
                email,
                password: hashedPassword,
                nombre,
                rol,
                parroquia
            }
        });

        res.status(201).json({ msg: "Usuario creado con éxito", userId: nuevoUsuario.id });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario. ¿Email o Cédula duplicada?" });
    }
};

// --- LOGIN REAL CON JWT ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        // 2. Verificar si está bloqueado
        if (!usuario.activo) {
            return res.status(403).json({ msg: "Este usuario ha sido bloqueado por el Supremo" });
        }

        // 3. Comparar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

        // 4. Crear el Token JWT (Dura 24 horas)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. REGISTRAR EN EL LOG (La Caja Negra)
        await prisma.logActividad.create({
            data: {
                usuario: usuario.nombre,
                accion: "INICIO_SESIÓN",
                detalles: `Acceso exitoso al sistema con rol ${usuario.rol}`
            }
        });

        // 6. Enviar respuesta al Frontend
        res.json({
            token,
            user: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol,
                parroquia: usuario.parroquia
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor durante el login" });
    }
};
