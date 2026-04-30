const url = import.meta.env.VITE_API_URL;

export const getTurnos = async (desde = 0) => {
  const limite = 50; 
  const token = localStorage.getItem("token");

  const parametros = new URLSearchParams({
        limite: limite.toString(),
        desde: desde.toString()
    });

  try {
    const resp = await fetch(`${url}/turnos?${parametros}`, {
      method: "GET",
      headers: {
        "content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error("Error al obtener los turnos de la base de datos");
    }
    return data;
  } catch (error) {
    throw new Error("No se pueden obtener los turnos!");
  }
};

export const getTurnosByIdDueno = async (idDueno) => {
    const token = localStorage.getItem("token");
    try {
      const resp = await fetch(url + "/" + "turnos" + "/" + idDueno, {
        method: 'GET',
        headers: {
          'Content-type': "application/json; charset=UTF-8",
          'x-token': token,
        }
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error("Error al obtener el turno de la base de datos");
      }
      return data;
    } catch (error) {
      throw new Error("No se pudo conectar con el servidor");
    }
};

export const postTurno = async (datos) => {
  const token = localStorage.getItem("token");

  try {    
    const resp = await fetch(url + "/" + "turnos", {
      method: "POST",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      }      
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error("Error al crear el turno en la base de datos");
    }
    return data;
    } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }  
}

export const actualizarTurno = async (id, datos) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "turnos" + "/" + id, {
      method: "PATCH",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error("Error al actualizar el turno");
    }

    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }
};

export const modificarTurno = async (id, datos) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "turnos" + "/" + id, {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error("Error al modificar el turno");
    }
    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }
};

export const deleteTurno = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "turnos" + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();
     if (!resp.ok) {
      throw new Error("Error al eliminar el turno");
    }
    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }
};

export const getMisTurnos = async () => {
    const token = localStorage.getItem("token");
    try {
        const resp = await fetch(url + "/" + "turnos" + "/" + "mis-turnos", {
            method: 'GET',
            headers: {
                'Content-type': "application/json; charset=UTF-8",
                'x-token': token,
            }
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error("Error al obtener tus turnos");
        return data;
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor");
    }
};
