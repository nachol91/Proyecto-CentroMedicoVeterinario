import { Table, Button } from "react-bootstrap";
import "../styles/TablaMascotas.css"

export default function TablaMascotas({ mascotas, handleEliminarMascota, abrirEditor, handleVerHistoria }) {
  return (
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
          <th>Estado</th>
          <th>Historia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {mascotas.map((mascota) => {
          return(
              <tr key={mascota._id}>
                <td>{mascota.nombre}</td>
                <td>{mascota.especie}</td>
                <td>{mascota.raza}</td>
                <td>{mascota.edad}</td>
                <td>{mascota.sexo}</td>
                <td>{mascota.peso} kg</td>
                <td>
                  
                  {mascota.medicoQueCrea?.apellido}, {mascota.medicoQueCrea?.nombre}
                </td>
                <td>
                  {new Date(mascota.fechaRegistro).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>
                  {mascota.estado ? "Habilitado" : "Deshabilitado"}
                </td>
                <td>
                  <Button className="btn-ver" size="sm" onClick={() => handleVerHistoria(mascota.historiaClinica, mascota.nombre)}>
                    Ver
                  </Button>
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <Button size="sm" className="me-2 btn-modificar" onClick={() => abrirEditor(mascota)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleEliminarMascota(mascota._id)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
            </tr>
          );
        })}
        
      </tbody>
    </Table>
  );
}