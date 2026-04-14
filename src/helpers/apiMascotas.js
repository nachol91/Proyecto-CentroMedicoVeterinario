const url = import.meta.env.VITE_API_URL; 


export const mascotasGet = async (desde = 0) => {
    const limite = 20;
    const token = localStorage.getItem("token");

    try {
    const resp = await fetch(url + "?limite" + limite + "&desde" + desde, {
      method: "GET",
      headers: {
        "content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("no se pueden obtener los datos!");
  }
}

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