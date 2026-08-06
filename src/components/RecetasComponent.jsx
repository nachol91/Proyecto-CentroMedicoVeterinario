import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert, ListGroup, Table, Spinner} from "react-bootstrap";
import { getUsuarios } from "../helpers/apiUsuarios";
import { mascotasGetIdDueno } from "../helpers/apiMascotas";
import { recetaPost, recetasGet, recetaDelete } from "../helpers/apiRecetas";
import Swal from "sweetalert2";

export default function RecetasComponent() {
  // Estados de búsqueda y selección
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [duenoSeleccionado, setDuenoSeleccionado] = useState(null);

  // Estados de mascotas
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");

  // Estados de la receta
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivoPDF, setArchivoPDF] = useState(null);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const [listaRecetas, setListaRecetas] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [filtroTabla, setFiltroTabla] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
   cargarRecetas();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data.usuarios || []);
    } catch (error) {
      setMensaje({
        tipo: "danger",
        texto: "Error al obtener la lista de usuarios.",
      });
    }
  };

  // Filtrado idéntico al de tu tabla de pacientes
  const usuariosFiltrados = usuarios.filter((user) => {
    const termino = busqueda.toLowerCase();
    const nombreCompleto = `${user.nombre} ${user.apellido}`.toLowerCase();
    const correo = user.correo ? user.correo.toLowerCase() : "";
    const telefono = user.telefono ? user.telefono.toString() : "";
    return (
      nombreCompleto.includes(termino) ||
      correo.includes(termino) ||
      telefono.includes(termino)
    );
  });

  const handleSeleccionarDueno = async (usuario) => {
    setDuenoSeleccionado(usuario);
    setMascotaSeleccionada("");
    setMascotas([]);
    setMensaje({ tipo: "", texto: "" });

    try {
      const data = await mascotasGetIdDueno(usuario._id);
      setMascotas(data.mascotas || []);
    } catch (error) {
      setMensaje({
        tipo: "danger",
        texto: "Error al cargar las mascotas del dueño seleccionado.",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setMensaje({
          tipo: "warning",
          texto: "Por favor, selecciona un archivo PDF válido.",
        });
        setArchivoPDF(null);
        e.target.value = null;
        return;
      }
      setArchivoPDF(file);
      setMensaje({ tipo: "", texto: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mascotaSeleccionada || !archivoPDF) return;

    setLoading(true);

    try {
        const usuarioLogueado = JSON.parse(localStorage.getItem("usuario")) || {}; 
        const medicoId = usuarioLogueado.uid || usuarioLogueado._id;

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        formData.append("mascota", mascotaSeleccionada);
        formData.append("medico", medicoId);
        formData.append("archivo", archivoPDF);

        await recetaPost(formData);

        Swal.fire({
        icon: "success",
        title: "¡Receta creada correctamente!",
        showConfirmButton: false,
        timer: 2000
        });

        // 1. Reseteo de campos de la receta
        setTitulo("");
        setDescripcion("");
        setArchivoPDF(null);

        const fileInput = document.getElementById("archivoPdfInput");
        if (fileInput) fileInput.value = "";

        // 2. Reseteo de la búsqueda, dueño seleccionado y desplegable de mascotas
        setBusqueda("");
        setDuenoSeleccionado(null);
        setMascotas([]);
        setMascotaSeleccionada("");

        // 3. Recargar tabla de recetas
        await cargarRecetas();

    } catch (error) {
        Swal.fire({
        title: "Error",
        text: error.message || "No se pudo crear la receta",
        icon: "error",
        confirmButtonColor: "#d33"
        });
    } finally {
        setLoading(false);
    }
  };

  const cargarRecetas = async () => {
    setLoadingLista(true);
    try {
        const res = await recetasGet();
        // Asigna res.recetas o res según la respuesta del backend
        setListaRecetas(res.recetas || res);
    } catch (error) {
        console.error("Error al cargar lista de recetas:", error);
    } finally {
        setLoadingLista(false);
    }
  };  

  const recetasFiltradas = listaRecetas.filter((receta) => {
    const busqueda = filtroTabla.toLowerCase();
    const titulo = receta.titulo?.toLowerCase() || "";
    const mascota = receta.mascota?.nombre?.toLowerCase() || "";
    const duenoObj = receta.mascota?.dueno;
    const dueno = duenoObj ? `${duenoObj.nombre || ""} ${duenoObj.apellido || ""}`.toLowerCase() : "";

    return titulo.includes(busqueda) || mascota.includes(busqueda) || dueno.includes(busqueda);
  });

  const handleEliminarReceta = async (id) => {
        const resultado = await Swal.fire({
            title: "¿Estás seguro de eliminar esta receta?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6f42c1",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar"
        });

        if (resultado.isConfirmed) {
            try {
            await recetaDelete(id);
            
            // Filtramos la lista localmente
            setListaRecetas((prev) => prev.filter((r) => r._id !== id));

            Swal.fire({
                icon: "success",
                title: "¡Receta eliminada con éxito!",
                showConfirmButton: false,
                timer: 2000
            });
            } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar la receta. Inténtelo de nuevo más tarde.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
            }
        }
  };

  const handleLimpiar = () => {
    setBusqueda("");
    setDuenoSeleccionado(null);
    setMascotas([]);
    setMascotaSeleccionada("");
  };

return (
  <div className="w-100">
    <h1 className="mb-4">Gestión de Recetas</h1>

    {mensaje.texto && (
      <Alert variant={mensaje.tipo} onClose={() => setMensaje({ tipo: "", texto: "" })} dismissible>
        {mensaje.texto}
      </Alert>
    )}

    <Row className="m-0 g-3">
      {/* Columna Izquierda: Búsqueda de dueño y selección de mascota */}
      <Col md={6}>
        <Card className="p-3 border shadow-sm">
          <h5 className="mb-3">1. Buscar Dueño</h5>
          <div className="d-flex gap-2 mb-3">
            <Form.Control
              type="text"
              placeholder="🔍 Buscar por nombre, mail o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <Button className="btn-violeta" onClick={handleLimpiar}>
                Limpiar
              </Button>
            )}
          </div>

          {/* Resultados de búsqueda */}
          {busqueda.trim() !== "" && (
            <ListGroup className="mb-3" style={{ maxHeight: "180px", overflowY: "auto" }}>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((user) => (
                  <ListGroup.Item
                    key={user._id}
                    action
                    active={duenoSeleccionado?._id === user._id}
                    onClick={() => handleSeleccionarDueno(user)}
                  >
                    <strong>{user.nombre} {user.apellido}</strong> — {user.correo}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item disabled>No se encontraron usuarios.</ListGroup.Item>
              )}
            </ListGroup>
          )}

          {duenoSeleccionado && (
            <Alert variant="info" className="py-2 mb-3">
              <strong>Dueño:</strong> {duenoSeleccionado.nombre} {duenoSeleccionado.apellido}
            </Alert>
          )}

          {/* Elección de Mascota */}
          {duenoSeleccionado && (
            <div>
              <h5 className="mb-2">2. Seleccionar Mascota</h5>
              {mascotas.length > 0 ? (
                <Form.Select
                  value={mascotaSeleccionada}
                  onChange={(e) => setMascotaSeleccionada(e.target.value)}
                >
                  <option value="">-- Selecciona una mascota --</option>
                  {mascotas.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.nombre} ({m.especie || "Mascota"})
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <p className="text-warning m-0">Este usuario no tiene mascotas registradas.</p>
              )}
            </div>
          )}
        </Card>
      </Col>

      {/* Columna Derecha: Formulario de Receta PDF */}
      <Col md={6}>
        <Card className="p-3 border shadow-sm">
          <h5 className="mb-3">3. Datos de la Receta</h5>
          <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Form.Group className="mb-3">
              <Form.Label>Título de la Receta *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Receta Médica - Tratamiento Antibiótico"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción / Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Instrucciones sobre la dosis o indicación médica..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adjuntar PDF *</Form.Label>
              <Form.Control
                id="archivoPdfInput"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                required
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-violeta w-100 mt-2"
              disabled={loading || !mascotaSeleccionada || !archivoPDF}
            >
              {loading ? "Cargando archivo..." : "Subir Receta"}
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
    {/* Tabla de Historial General de Recetas */}
    <Row className="m-0 mt-4">
        <Col md={12}>
            <Card className="p-3 border shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">📋 Historial de Recetas Emitidas</h5>
                <Form.Control
                type="text"
                placeholder="🔍 Buscar por título, mascota o dueño..."
                style={{ maxWidth: "300px" }}
                value={filtroTabla}
                onChange={(e) => setFiltroTabla(e.target.value)}
                />
            </div>

            {loadingLista ? (
                <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted mb-0">Cargando recetas...</p>
                </div>
            ) : recetasFiltradas.length === 0 ? (
                <Alert variant="info" className="text-center m-0">
                No se encontraron recetas registradas.
                </Alert>
            ) : (
                <Table striped bordered hover responsive className="align-middle text-center m-0">
                <thead>
                    <tr>
                    <th>Fecha</th>
                    <th>Mascota</th>
                    <th>Dueño</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Archivo PDF</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {recetasFiltradas.map((receta) => (
                    <tr key={receta._id}>
                        <td>
                        {receta.fecha 
                            ? new Date(receta.fecha).toLocaleDateString("es-AR") 
                            : receta.createdAt 
                            ? new Date(receta.createdAt).toLocaleDateString("es-AR") 
                            : "-"}
                        </td>
                        <td><strong>{receta.mascota?.nombre || "N/A"}</strong></td>
                        <td>
                        {receta.mascota?.dueno 
                            ? `${receta.mascota.dueno.nombre} ${receta.mascota.dueno.apellido}` 
                            : "Sin asignar"}
                        </td>
                        <td>{receta.titulo}</td>
                        <td>{receta.descripcion || "Sin observaciones"}</td>
                        <td>
                        <a
                            href={receta.archivoUrl || receta.urlPdf || receta.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ver"
                        >
                            📄 Ver PDF
                        </a>
                        </td>
                        <td>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleEliminarReceta(receta._id)}
                        >
                            Eliminar
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            )}
            </Card>
        </Col>
    </Row>
  </div>
);
}
