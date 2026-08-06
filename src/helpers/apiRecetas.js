const url = import.meta.env.VITE_API_URL;


export const recetasGet = async (desde = 0) => {
    const limite = 20;
    const token = localStorage.getItem("token");

    const parametros = new URLSearchParams({
        limite: limite.toString(),
        desde: desde.toString()
    });

    try {
        const resp = await fetch(`${url}/recetas?${parametros}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-token": token,
            },
        });

        const data = await resp.json();
        if (!resp.ok) {
            throw new Error("Error al obtener las recetas");
        }
        return data;
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor");
    }
};


export const recetaGetID = async (idMascota) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + "recetas" + "/" + idMascota, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-token": token,
            },
        });

        const data = await resp.json();
        if (!resp.ok) {
            throw new Error("Error al obtener las recetas de la mascota");
        }
        return data;
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor");
    }
};


export const recetaPost = async (formData) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + "recetas", {
            method: "POST",
            body: formData, // FormData maneja su propio multipart/form-data
            headers: {
                "x-token": token, 
            },
        });

        const data = await resp.json();
        if (!resp.ok) {
            throw new Error(data.msg || "Error al crear la receta");
        }
        return data;
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor");
    }
};


export const recetaDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + "recetas" + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-token": token,
            },
        });

        const data = await resp.json();
        if (!resp.ok) {
            throw new Error("Error al eliminar la receta");
        }
        return data;
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor");
    }
};