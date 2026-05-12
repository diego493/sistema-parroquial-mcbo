const jwt = require('jsonwebtoken');

// Verifica si el usuario está logueado
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token no válido" });
  }
};

// Verifica el Rango (Role-Based Access Control)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: `Tu rango (${req.user.role}) no tiene permiso aquí` });
    }
    next();
  };
};
