import { useState, useEffect } from "react";
import inicio from "../assets/icons/cucha.png";
import pacientes from "../assets/icons/nosotros.png";
import turnos from "../assets/icons/calendario.png";
import recetas from "../assets/icons/servicios.png";
import wp from "../assets/icons/whatsapp.png";
import medicos from "../assets/icons/medicos.png";
import recetaCard from "../assets/img/recetas.avif";
import medicosCard from "../assets/img/medicos.jpg";
import turnosCard from "../assets/img/turnos.jpg";
import pacientesCard from "../assets/img/pacientesCard.jpeg";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import TablaUsuarios from "../components/TablaUsuariosComponents";
import TablaMedicos from "../components/TablaMedicosComponents";
import { postUsuario, actualizarUsuario, patchUsuario, getUsuarios, deleteUsuario } from "../helpers/apiUsuarios";
import "../styles/AdminPage.css";


export default function AdminPage() {
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  
  const [activeTab, setActiveTab] = useState("inicio");

  const [show, setShow] = useState(false);
  
  const [showEdit, setShowEdit] = useState(false);

  const [usuarios, setUsuarios] = useState([]); 
  
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    rol: "",
    estado: "true",
    nuevoPassword: "",
    confirmarPassword: ""
  });

  useEffect(() => {
    obtenerUsuarios();
  }, []);
  
  const obtenerUsuarios = async () => {
    const data = await getUsuarios();
    const usuariosObtenidos = data.usuarios;
    setUsuarios(usuariosObtenidos);
  }; 

  const eliminarUsuario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");
    
    if (!confirmacion) return;

    try {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter(usuario => usuario._id !== id));

      alert("Usuario eliminado con éxito!");
      obtenerUsuarios()
      
    }catch (error) {
      console.error("Error al eliminar: ", error);
      alert("No se pudo eliminar el usuario. Inténtelo de nuevo más tarde.");
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);  
   
  const handleSave = async(e) =>{
    
    e.preventDefault();
    
    const nombre= e.target.nombre.value;
    const apellido= e.target.apellido.value;
    const correo= e.target.correo.value;
    const telefono= e.target.telefono.value;
    const nivel= e.target.rol.value;
    const password= e.target.password.value;
    const confirmarPassword= e.target.confirmarPassword.value;
    
    if (password.length > 0) {
        if (password !== confirmarPassword) {
          return alert("Las contraseñas no coinciden");
        }
        if (password.length < 8) {
          return alert("La contraseña debe tener al menos 8 caracteres");
        }
    }
    
    const dataUsuario ={ nombre, apellido, correo, telefono, nivel, password };

    try {
      const resultado = await postUsuario(dataUsuario);

      if(resultado){
        alert("El usuario se cargo correctamente!");
        e.target.reset();
        handleClose();

        obtenerUsuarios();
      };
    }catch (error) {
      console.error(error);
      alert(error.message || "error al conectar al servidor")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCloseEdit = () => {
    setShowEdit(false);
    setUsuarioAEditar(null);
  };

  const handleModificarClick = (usuario) => {
  setUsuarioAEditar(usuario); 
  
  setFormData({
    id: usuario._id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    telefono: usuario.telefono,
    nivel: usuario.nivel,
    estado: usuario.estado.toString() 
  });
  
  setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const id = formData.id;
      const nuevoEstadoBooleano = formData.estado === "true";

      if (nuevoEstadoBooleano !== usuarioAEditar.estado) {
        await patchUsuario(id, { estado: nuevoEstadoBooleano });
      }

      if (formData.nuevoPassword && formData.nuevoPassword !== formData.confirmarPassword) {
        return alert("Las contraseñas no coinciden");
      }

      const datosModificados = {
        correo: formData.correo,
        telefono: formData.telefono,
        password: formData.nuevoPassword || undefined 
      };

      const resultado = await actualizarUsuario(id, datosModificados);

      if (resultado) {
        alert("¡Usuario actualizado correctamente!");
        e.target.reset();
        handleCloseEdit();

        obtenerUsuarios();        
      }
    } catch (error) {
      console.error(error)
      alert("Error al actualizar: " + error.message);
    }
  };

  return (
    <main className="admin-page">
      
      <aside className="aside-main">
        <nav className="aside-nav">
          <button
            className={`aside-item ${activeTab === "inicio" ? "active" : ""}`}
            onClick={() => setActiveTab("inicio")}>
            <img src={inicio} alt="Inicio" className="aside-custom-icon" />
            <span>Inicio</span>
          </button>

          <button
            className={`aside-item ${activeTab === "pacientes" ? "active" : ""}`}
            onClick={() => setActiveTab("pacientes")}>
            <img src={pacientes} alt="Pacientes" className="aside-custom-icon"/>
            <span>Usuarios/Mascotas</span>
          </button>

          <button
            className={`aside-item ${activeTab === "medicos" ? "active" : ""}`}
            onClick={() => setActiveTab("medicos")}>
            <img src={medicos} alt="medicos" className="aside-custom-icon"/>
            <span>Médicos</span>
          </button>

          <button
            className={`aside-item ${activeTab === "recetas" ? "active" : ""}`}
            onClick={() => setActiveTab("recetas")}>
            <img src={recetas} alt="Recetas" className="aside-custom-icon" />
            <span>Recetas</span>
          </button>

          <button
            className={`aside-item ${activeTab === "turnos" ? "active" : ""}`}
            onClick={() => setActiveTab("turnos")}>
            <img src={turnos} alt="Turnos" className="aside-custom-icon" />
            <span>Mis Turnos</span>
          </button>

        </nav>

        <div className="aside-footer">
          <hr />
          <p>Si tenés alguna duda o consulta envíanos un mensaje</p>
          <a
            href="https://wa.me/+5492214184682"
            target="_blank"
            rel="noreferrer"
          >
            <img src={wp} alt="Whatsapp" className="whatsapp-custom-icon" />
          </a>
        </div>
      </aside>

      <section className="content-main">
        {activeTab === "inicio" && (
          <div>
            <h1>Panel Principal</h1>
            <div className="tarjetas">
              <Card className="custom-card">
                <Card.Img variant="top" src={pacientesCard} className="card-img-custom" />
                <Card.Body>
                  <Card.Title>Usuarios-Mascotas</Card.Title>
                  <Button className="btn-violeta" onClick={() => setActiveTab('pacientes')}>Ver Usuarios-Mascotas</Button>
                </Card.Body>
              </Card>

               <Card className="custom-card">
                <Card.Img variant="top" src={medicosCard} className="card-img-custom" />
                <Card.Body>
                  <Card.Title>Médicos</Card.Title>
                  <Button className="btn-violeta" onClick={() => setActiveTab('medicos')}>Ver Médicos</Button>
                </Card.Body>
              </Card>

              <Card className="custom-card">
                <Card.Img variant="top" src={turnosCard} className="card-img-custom" />
                <Card.Body>
                  <Card.Title>Turnos</Card.Title>
                  <Button className="btn-violeta" onClick={() => setActiveTab('turnos')}>Gestionar turnos</Button>
                </Card.Body>
              </Card>

              <Card className="custom-card">
                <Card.Img variant="top" src={recetaCard} className="card-img-custom" />
                <Card.Body>
                  <Card.Title>Recetas</Card.Title>
                  <Button className="btn-violeta" onClick={() => setActiveTab('recetas')}>Ver Recetas</Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
        {activeTab === "pacientes" && (
          <div>
            <h1>Gestión de Usuarios-Mascotas</h1>
            <TablaUsuarios usuarios={usuarios} obtenerUsuarios={obtenerUsuarios} eliminarUsuario={eliminarUsuario} abrirEditor={handleModificarClick}/>
            <Button className="btn-violeta" onClick={handleShow}>Crear Usuario</Button>
          </div>
        )}
        {activeTab === "medicos" && (
          <div>
            <h1>Gestión de Médicos</h1>
            <TablaMedicos usuarios={usuarios} obtenerUsuarios={obtenerUsuarios} eliminarUsuario={eliminarUsuario} abrirEditor={handleModificarClick}/>
            <Button className="btn-violeta" onClick={handleShow}>Crear Médico</Button>
          </div>
        )}
        {activeTab === "turnos" && <h1>Gestión de Turnos</h1>}
        {activeTab === "recetas" && <h1>Gestión de Recetas</h1>}
      </section>

      <Modal show={show} onHide={handleClose}>
        
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Usuario</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form id="form-nuevo-usuario" onSubmit={handleSave} >
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name='nombre' placeholder="ingresa el nombre"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="apellido">
              <Form.Label>apellido</Form.Label>
              <Form.Control type="text" name='apellido' placeholder="ingresa el apellido"/>
            </Form.Group>            
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>correo</Form.Label>
              <Form.Control type="email" name='correo' placeholder="ingresa el correo" autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="tel" name='telefono'rows={3} placeholder="ingresa el telefono"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Control type="text" name='rol' placeholder="ingresa el rol"/>
            </Form.Group>            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name='password' placeholder='ingresar contraseña'rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmarPassword">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control type="password" name='confirmarPassword' placeholder='Confirma contraseña ingresada' rows={3}/>
            </Form.Group>            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" type="submit" form="form-nuevo-usuario">
            Guardar
          </Button>
        </Modal.Footer>
        
      </Modal>
      
      <Modal show={showEdit} onHide={handleCloseEdit}>
        
        <Modal.Header closeButton>
          <Modal.Title>Datos Usuario</Modal.Title>
        </Modal.Header>
            
        <Modal.Body>
          <Form id="form-editar-usuario" onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>correo</Form.Label>
              <Form.Control type="email" name='correo' value={formData.correo} onChange={handleChange} autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="tel" name='telefono' value={formData.telefono} onChange={handleChange} rows={3} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select name = "estado" value={formData.estado} onChange={handleChange}>
                <option value="true">Habilitado</option>
                <option value="false">Deshabilitado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nueva contraseña(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='nuevoPassword' placeholder='ingrese la nueva contraseña (min 8 caracteres)' value={formData.nuevoPassword} rows={3} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Confirmar contraseña(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='confirmarPassword' placeholder='repita la contraseña' value={formData.confirmarPassword} rows={3} onChange={handleChange} />
            </Form.Group>            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Cerrar
          </Button>
          <Button className="btn-modificar" type="submit" form="form-editar-usuario">
            Guardar cambios
          </Button>
        </Modal.Footer>

      </Modal>

    </main>
  );
}
