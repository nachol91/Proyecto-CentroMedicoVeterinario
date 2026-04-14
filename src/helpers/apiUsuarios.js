const url = import.meta.env.VITE_API_URL;

export const getUsuarios = async (desde = 0) => {
  const limite = 20;

  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "usuarios" + "/" + "?limite" + limite + "&desde" + desde, {
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

export const getUsuarioByID = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "usuarios" + "/" + id, {
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
    const resp = await fetch(url + "/" + "usuarios" + "/" + id, {
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

export const deleteUsuario = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "usuarios" + "/" + id, {
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

export const postUsuario = async (datos) => {
  
  const token = localStorage.getItem("token");
  
  const resp = await fetch(url + "/" + "usuarios", {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": token,
    }
  });

  const data = await resp.json();

  if (!resp.ok) {
  throw new Error(data.message || 'El usuario ya se encuentra registrado en la base de datos');
  }

  return data;     
    
}

export const patchUsuario = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const resp = await fetch(url + "/" + "usuarios" + "/" + id, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": token,
      },
    });

    const data = await resp.json();
    return data;    
  } catch (error) {
    console.error(error);
    return { msg: "no se conectó con la base de datos!"}
    
  }
}