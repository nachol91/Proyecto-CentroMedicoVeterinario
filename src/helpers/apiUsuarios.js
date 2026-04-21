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
    if (!resp.ok) {
      throw new Error('Error al obtener los Usuarios');
    }
    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
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
    if (!resp.ok) {
      throw new Error('Error al obtener el Usuario');
    }
    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
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
      throw new Error("Error al actualizar el usuario");
    }
    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
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
    if (!resp.ok) {
      throw new Error('Error al Eliminar el Usuario');
    }
    return data;
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }
};

export const postUsuario = async (datos) => {
  
  const token = localStorage.getItem("token");

  try {
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
      throw new Error('Error al crear el Usuario');
    }
    return data;  
    
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");    
  }    
};

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
    if (!resp.ok) {
      throw new Error('Error al Habilitar/Deshabilitar el Usuario');
    }
    return data;    
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");    
  }
}