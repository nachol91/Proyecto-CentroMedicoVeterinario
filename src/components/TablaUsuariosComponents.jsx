import { Table, Button } from 'react-bootstrap';
import "../styles/TablaUsuarios.css";

export default function TablaUsuariosComponents({ abrirEditor, usuarios, eliminarUsuario, handleVerMascotas }) {

   return (
    <div className="tabla-usuarios">
        <section>
            <Table responsive bordered hover>
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
                                <td>
                                    {new Date(usuario.fechaRegistro).toLocaleString('es-AR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td>
                                    <Button className="btn-ver" onClick={() => handleVerMascotas(usuario)}>
                                        Ver Mascotas
                                    </Button> 
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() =>  eliminarUsuario(usuario._id) }>
                                        Eliminar
                                    </Button>
                                    
                                    <Button className="btn-modificar" onClick={() => abrirEditor(usuario)}>
                                        Modificar
                                    </Button>                                        
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
