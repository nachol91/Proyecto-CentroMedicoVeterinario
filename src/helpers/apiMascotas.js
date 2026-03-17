const url = "http://localhost:3000/api/mascotas"; 


export const mascotasGetIdDueno = async (idDueno) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + idDueno, {
            method: 'GET',
            headers: {
                'Content-type': "application/json; charset=UTF-8",
                'x-token': token,
            }
        });
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return { msg: "No se pudo conectar con el servidor" };
    }
};


export const mascotaPost = async (datos) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-type': "application/json; charset=UTF-8",
                'x-token': token,
            }
        });
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return { msg: "No se conectó con la base de datos!" };
    }
};


export const mascotaPut = async (id, datos) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + id, {
            method: 'PUT',
            body: JSON.stringify(datos),
            headers: {
                'Content-type': "application/json; charset=UTF-8",
                'x-token': token,
            }
        });
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return { msg: "No se conectó con la base de datos!" };
    }
};


export const mascotaDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + id, {
            method: 'DELETE',
            headers: {
                'Content-type': "application/json; charset=UTF-8",
                'x-token': token,
            }
        });
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return { msg: "No se conectó con la base de datos!" };
    }
};


export const patchMascota = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(url + "/" + id, {
            method: 'PATCH',
            headers: {
                'Content-type': "application/json; charset=UTF-8",
                'x-token': token,
            }
        });
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return { msg: "No se conectó con la base de datos!" };
    }
};