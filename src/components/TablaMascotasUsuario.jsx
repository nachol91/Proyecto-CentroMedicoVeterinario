import { useState } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { recetaGetID } from "../helpers/apiRecetas";
import "../styles/TablaMascotas.css";

export default function TablaMascotasUsuario({ mascotas }) {
  const [showModal, setShowModal] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [cargandoRecetas, setCargandoRecetas] = useState(false);

  const handleVerRecetas = async (mascota) => {
    setMascotaSeleccionada(mascota);
    setShowModal(true);
    setCargandoRecetas(true);

    try {
      // Pasamos el ID de la mascota seleccionada
      const data = await recetaGetID(mascota._id);
      setRecetas(data.recetas || data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener las recetas de la mascota",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setCargandoRecetas(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMascotaSeleccionada(null);
    setRecetas([]);
  };

  return (
    <>
      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Edad</th>
            <th>Sexo</th>
            <th>Peso</th>
            <th>Atendido Por</th>
            <th>Fecha de ingreso</th>
            <th>Recetas</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((mascota) => {
            return (
              <tr key={mascota._id}>
                <td>{mascota.nombre}</td>
                <td>{mascota.especie}</td>
                <td>{mascota.raza}</td>
                <td>{mascota.edad}</td>
                <td>{mascota.sexo}</td>
                <td>{mascota.peso} kg</td>
                <td>
                  {mascota.medicoQueCrea?.apellido},{" "}
                  {mascota.medicoQueCrea?.nombre}
                </td>
                <td>
                  {new Date(mascota.fechaRegistro).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <Button
                    className="btn-ver"
                    onClick={() => handleVerRecetas(mascota)}
                  >
                    Ver Recetas
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal para mostrar las recetas de la mascota seleccionada */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Recetas de {mascotaSeleccionada?.nombre}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {cargandoRecetas ? (
            <div className="d-flex justify-content-center align-items-center py-4">
              <Spinner animation="border" variant="primary" role="status" />
              <span className="ms-2">Cargando recetas...</span>
            </div>
          ) : recetas.length > 0 ? (
            <Table
              responsive
              striped
              bordered
              hover
              className="align-middle text-center"
            >
              <thead className="tabla-header">
                <tr>
                  <th>Fecha</th>
                  <th>Título</th>
                  <th>Observaciones</th>
                  <th>Archivo PDF</th>
                </tr>
              </thead>
              <tbody>
                {recetas.map((receta) => (
                  <tr key={receta._id}>
                    <td>
                      {receta.fecha
                        ? new Date(receta.fecha).toLocaleDateString("es-AR")
                        : receta.createdAt
                          ? new Date(receta.createdAt).toLocaleDateString(
                              "es-AR",
                            )
                          : "-"}
                    </td>
                    <td>{receta.titulo}</td>
                    <td>{receta.descripcion || "Sin observaciones"}</td>
                    <td>
                      <a
                        href={
                          receta.archivoUrl || receta.urlPdf || receta.pdfUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-violeta"
                      >
                        📄 Ver PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center my-3 text-muted">
              No hay recetas registradas para esta mascota.
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
