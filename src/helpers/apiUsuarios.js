const url = "http://localhost:3000/api/usuarios";

export const getUsuarios = async (desde = 0) => {
  const limite = 10;

  const token = localStorage.getItem("token");

  try {
    const resp = await fetch((url + "?limite" + limite + "&desde" + desde), {
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
};

export const getUsuariosByID = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + id, {
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
    throw new Error("no se puede obtener el usuario solicitado");
  }
};

export const actualizarUsuario = async (id, datos) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + id, {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.msg || "Error al actualizar en la base de datos");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
