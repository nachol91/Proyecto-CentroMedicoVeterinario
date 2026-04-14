const url = import.meta.env.VITE_API_URL;

export const getTurnos = async (desde = 0) => {
  const limite = 50; 
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "turnos" + "/" + "?limite" + limite + "&desde" + desde, {
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
        return data;
    } catch (error) {
        console.error(error);
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
      throw new Error(data.msg || "Error al crear el turno en la base de datos");
    }
    return data;
    } catch (error) {
    console.error("HELPER ERROR:", error); // <--- LOG 3
    throw error;
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
      throw new Error(data.msg || "Error al actualizar el turno");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
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
      throw new Error(data.msg || "Error al modificar el turno");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
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
    return data;
  } catch (error) {
    console.error(error);
    return { msg: "No se conectó con la base de datos!" };
  }
};
