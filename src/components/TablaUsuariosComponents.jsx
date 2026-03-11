import { Table, Button } from 'react-bootstrap';
import "../styles/TablaUsuarios.css";

export default function TablaUsuariosComponents({ abrirEditor, usuarios, obtenerUsuarios, eliminarUsuario }) {

   return (
    <div>
        <section>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Télefono</th>
                        <th>Estado</th>
                        <th>Fecha de Registro</th>                        
                        <th>Mascotas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.filter((usuario) => usuario.nivel === "USER").map((usuario) => {
                        return (
                            <tr key={usuario._id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.estado === true ? (<p>Habilitado</p>) : (<p>Deshabilitado</p>)}</td>
                                <td>{usuario.fechaRegistro}</td>
                                <td>Mascotas</td>
                                <td>
                                    {usuario.nivel !== "ADMIN" && (
                                        <Button variant="danger" onClick={() => { eliminarUsuario(usuario._id) }}>
                                            Eliminar
                                        </Button>)}
                                    {usuario.nivel !== "ADMIN" && (
                                        <Button className="btn-modificar" onClick={() => abrirEditor(usuario)}>
                                            Modificar
                                        </Button>)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </section>
        
    </div>
  );
}
