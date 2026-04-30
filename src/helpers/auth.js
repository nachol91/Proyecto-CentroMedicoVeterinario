export const leerUsuarioGuardado = () => {
    try {
        const usuario = localStorage.getItem("usuario");
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        return null;
    }
};