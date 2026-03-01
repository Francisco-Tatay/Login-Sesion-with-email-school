import jwt from 'jsonwebtoken';
const secretKey = "HolaMundoSecret";

export const verificationToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1]; // Quitamos "Bearer "
    if (!token) {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    // Verificamos que el token sea válido
    const decoded = jwt.verify(token, SECRETO);

    // Guardamos los datos del usuario en la request
    // Así las siguientes rutas pueden usarlos
    req.usuario = decoded;

    // Continuamos con la siguiente función
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    }
    return res.status(500).json({ message: "Error al verificar token" });
  }
};