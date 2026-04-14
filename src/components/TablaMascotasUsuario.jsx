import { Table, Button } from "react-bootstrap";
import "../styles/TablaMascotas.css"

export default function TablaMascotasUsuario({ mascotas }) {
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
          <th>Recetas</th>
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
                  <Button className="btn-ver">Ver Recetas</Button>
                </td>
            </tr>
          );
        })}
        
      </tbody>
    </Table>
  );
}