import { useState, useEffect } from "react";
import { Button, Card, Form, Modal, Spinner, Row, Col } from "react-bootstrap";

//iconos y assets
import inicio from "../assets/icons/cucha.png";
import pacientes from "../assets/icons/nosotros.png";
import turnos from "../assets/icons/calendario.png";
import recetas from "../assets/icons/servicios.png";
import wp from "../assets/icons/whatsapp.png";
import recetaCard from "../assets/img/recetas.avif";
import turnosCard from "../assets/img/turnos.jpg";
import pacientesCard from "../assets/img/pacientesCard.jpeg";

// Componentes y Helpers
import TablaUsuarios from "../components/TablaUsuariosComponents";
import TablaMascotas from "../components/TablaMascotas";
import CalendarioTurnos from "../components/CalendarioTurnos";
import { postUsuario, actualizarUsuario, patchUsuario, getUsuarios, deleteUsuario } from "../helpers/apiUsuarios";
import { mascotasGetIdDueno, mascotaPost, mascotaDelete, mascotaPut, patchMascota } from "../helpers/apiMascotas";

import "../styles/MedicoPage.css";


export default function AdminPage() {

  // hooks y funciones de usuarios//

  const [activeTab, setActiveTab] = useState("inicio");
  const [usuarios, setUsuarios] = useState([]);  

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);  
  
  const [usuarioAEditar, setUsuarioAEditar] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setUsuarioAEditar();
  };
  
  //hooks para el buscador y el loading

  const [busqueda, setBusqueda] = useState("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    const filtrado = usuarios.filter((usuario) => {
      const nombre = usuario.nombre.toLowerCase();
      const apellido = usuario.apellido.toLowerCase();
      const correo = usuario.correo.toLowerCase();

      const userBusqueda = busqueda.toLowerCase();

      return(
        nombre.includes(userBusqueda) ||
        apellido.includes(userBusqueda) ||
        correo.includes(userBusqueda) ||
        usuario.telefono?.includes(busqueda)
      );
    });
    setUsuariosFiltrados(filtrado);
  },[busqueda, usuarios]);
  
  const obtenerUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data.usuarios || []);
  }; 

  const eliminarUsuario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");
    
    if (!confirmacion) return;

    try {
      await deleteUsuario(id);
      alert("Usuario eliminado con éxito!");
      obtenerUsuarios()
      
    }catch (error) {
      console.error("Error al eliminar: ", error);
      alert("No se pudo eliminar el usuario. Inténtelo de nuevo más tarde.");
    }
  };
   
  const handleSave = async(e) =>{
    
    e.preventDefault();
    setCargando(true);
    
    const nombre= e.target.nombre.value;
    const apellido= e.target.apellido.value;
    const correo= e.target.correo.value;
    const telefono= e.target.telefono.value;
    const nivel= e.target.rol.value;
    const password= e.target.password.value;
    const confirmarPassword= e.target.confirmarPassword.value;
    
    if (password.length > 0) {
        if (password !== confirmarPassword) {
          setCargando(false);
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
    } finally{
      setCargando(false);
    }
  };

  const edicionUsuarioClick = (usuario) => {
  setUsuarioAEditar(usuario);   
  setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      const id = usuarioAEditar._id;
      const nuevoEstado = e.target.estado.value === "true";

      if (nuevoEstado !== usuarioAEditar.estado) {
        await patchUsuario(id, { estado: nuevoEstado });
      }

      const password = e.target.nuevoPassword.value;
      const confirmar = e.target.confirmarPassword.value;

      if (password && password !== confirmar) {
        return alert("Las contraseñas no coinciden");
      }

      const datosModificados = {
        correo: e.target.correo.value,
        telefono: e.target.telefono.value,
        password: password || undefined 
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
    } finally{
      setCargando(false);
    }
  };

  //hooks y funciones de mascotas//

  const [mascotas, setMascotas] = useState([]);
  const [showModalMascotas, setShowModalMascotas] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState();
  const [cargandoId, setCargandoId] = useState(null);

  const [historiaSeleccionada, setHistoriaSeleccionada] = useState("");
  const [showModalHistoria, setShowModalHistoria] = useState(false);
  const [nombreMascotaHistoria, setNombreMascotaHistoria] = useState("");

  const [showCrearMascota, setShowCrearMascota] = useState(false);
  const medicoLogueado = JSON.parse(localStorage.getItem("usuario"));

  const [showEditMascota, setShowEditMascota] = useState(false);
  const [mascotaAEditar, setMascotaAEditar] = useState();


  const handleCrearMascota = async (e) => {
    e.preventDefault();
    
    const nombre = e.target.nombre.value;
    const especie = e.target.especie.value;
    const raza = e.target.raza.value;
    const edad = e.target.edad.value;
    const sexo = e.target.sexo.value;
    const peso = e.target.peso.value;
    const historiaClinica = e.target.historiaClinica.value;
    
    const dataMascota = {
        nombre,
        especie,
        raza: raza || "mestizo",
        edad: Number(edad),
        sexo,
        peso: Number(peso),
        historiaClinica: historiaClinica || "",
        dueno: usuarioSeleccionado._id, 
        medicoQueCrea: medicoLogueado._id 
    };

    try {
      const resultado = await mascotaPost(dataMascota);
      if (resultado) {
        alert("Mascota creada con éxito");
        e.target.reset();
        setShowCrearMascota(false);
  
        handleVerMascotas(usuarioSeleccionado); 
      };      
    } catch (error) {
      console.error(error);
      alert(error.message || "error al conectar al servidor")      
    }
    
  };

  const handleVerMascotas = async(usuario) =>{
    setCargandoId(usuario._id);
    setUsuarioSeleccionado(usuario);

    try{
      const data = await mascotasGetIdDueno(usuario._id);

      setMascotas(data.mascotas || []);
      setShowModalMascotas(true);
    }catch(error){
      console.error("Error al traer las mascotas:", error);
      alert("No se pudieron traer las mascotas del usuario");
    }finally{
      setCargandoId(null);
    }    
  };

  const handleVerHistoria = (texto, nombre) => {
    setHistoriaSeleccionada(texto || "Esta mascota aún no tiene historia clínica registrada.");
    setNombreMascotaHistoria(nombre);
    setShowModalHistoria(true);
  };

  const handleEliminarMascota = async (id) => {
  const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta mascota?");
  if (!confirmar) return;

  try {
    const resultado = await mascotaDelete(id);
    if (resultado) {
      alert("Mascota eliminada con éxito");
      handleVerMascotas(usuarioSeleccionado);
    }
  } catch (error) {
    alert("Error al eliminar la mascota");
  }
};

const edicionMascotaClick = (mascota) => {
  setMascotaAEditar(mascota);
  setShowEditMascota(true);
};

const handleUpdateMascota = async (e) => {
    e.preventDefault();
    
    try {
      const id = mascotaAEditar._id;
      const nuevoEstado = e.target.estado.value === "true";
      if(nuevoEstado !== mascotaAEditar.estado){
        await patchMascota(id, {estado: nuevoEstado});
      }

      const dataUpdate = {
        peso: Number(e.target.peso.value),
        edad: Number(e.target.edad.value), 
        NuevaHistoriaClinica: e.target.nuevaHistoria.value
      };
    
        const resultado = await mascotaPut(mascotaAEditar._id, dataUpdate);
        
        if (resultado) {
            alert("¡Registro actualizado con éxito!");
            setShowEditMascota(false);
            e.target.reset(); 
            handleVerMascotas(usuarioSeleccionado);
        }
    } catch (error) {
        console.error(error);
        alert("Error al actualizar los datos");
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
            className={`aside-item ${activeTab === "recetas" ? "active" : ""}`}
            onClick={() => setActiveTab("recetas")}>
            <img src={recetas} alt="Recetas" className="aside-custom-icon" />
            <span>Recetas</span>
          </button>

          <button
            className={`aside-item ${activeTab === "turnos" ? "active" : ""}`}
            onClick={() => setActiveTab("turnos")}>
            <img src={turnos} alt="Turnos" className="aside-custom-icon" />
            <span>Turnos</span>
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
            <div className="d-flex mb-3 gap-2">
              <Form.Control type="text" placeholder="🔍 Buscar por nombre, mail o teléfono..." className="w-25" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
                {busqueda && (
                  <Button className="btn-violeta" onClick={() => setBusqueda("")}>
                    Limpiar
                  </Button>
                )}
            </div>
            <TablaUsuarios usuarios={usuariosFiltrados} cargando={cargandoId} obtenerUsuarios={obtenerUsuarios} eliminarUsuario={eliminarUsuario} abrirEditor={edicionUsuarioClick} handleVerMascotas={handleVerMascotas}/>
            <Button className="btn-violeta" onClick={handleShow}>Crear Usuario</Button>
          </div>
        )}               
        {activeTab === "turnos" && <CalendarioTurnos />}
        {activeTab === "recetas" && <h1>Gestión de Recetas</h1>}
      </section>
      
      {/* //modales usuarios// */}
    
      <Modal className="crear-usuario" show={show} onHide={handleClose}>
        
        <Modal.Header closeButton>
          <Modal.Title>{activeTab === "medicos" ? "Registrar Nuevo Médico" : "Registrar Nuevo Usuario"}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form id="form-nuevo-usuario" onSubmit={handleSave} >
            <Row className="g-2">
              
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name='nombre' placeholder="ingresa el nombre" autoFocus required/>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="apellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" name='apellido' placeholder="ingresa el apellido" required/>
                </Form.Group>
              </Col>   

              <Col xs={12}>    
                <Form.Group className="mb-3 full-width" controlId="correo">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control type="email" name='correo' placeholder="ingresa el correo" required/>
                </Form.Group>
              </Col> 

              <Col xs={12}>
                <Form.Group className="mb-3 full-width" controlId="telefono">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control type="tel" name='telefono'rows={3} placeholder="ingresa el telefono" required/>
                </Form.Group>
              </Col>  
              
              <Col xs={12}>            
                <Form.Group className="mb-3 full-width" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" name='password' placeholder='ingresar contraseña'rows={3} required/>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group className="mb-3 full-width" controlId="confirmarPassword">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control type="password" name='confirmarPassword' placeholder='Confirma contraseña ingresada' rows={3} required/>
                </Form.Group>
              </Col>

              <input type="hidden" name="rol" value={activeTab === "medicos" ? "MEDICO" : "USUARIO"}/>
              
            </Row>             
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={cargando}>
            Cerrar
          </Button>
          <Button className="btn-violeta" type="submit" form="form-nuevo-usuario" disabled={cargando}>
            {cargando ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                Guardando...
              </>) : ("Guardar")}
          </Button>
        </Modal.Footer>
        
      </Modal>
      
      <Modal className="modificar-usuario" show={showEdit} onHide={handleCloseEdit}>
        
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario: {usuarioAEditar?.nombre} {usuarioAEditar?.apellido}</Modal.Title>
        </Modal.Header>
            
        <Modal.Body>
          <Form id="form-editar-usuario" onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>correo</Form.Label>
              <Form.Control type="email" name='correo' defaultValue={usuarioAEditar?.correo} autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="tel" name='telefono' defaultValue={usuarioAEditar?.telefono} rows={3} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select name = "estado" defaultValue={usuarioAEditar?.estado}>
                <option value="true">Habilitado</option>
                <option value="false">Deshabilitado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nueva contraseña(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='nuevoPassword' placeholder='ingrese la nueva contraseña (min 8 caracteres)'/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Confirmar contraseña(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='confirmarPassword' placeholder='repita la contraseña'/>
            </Form.Group>            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit} disabled={cargando}>
            Cerrar
          </Button>
          <Button className="btn-modificar" type="submit" form="form-editar-usuario" disabled={cargando}>
            {cargando ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                Actualizando...
              </>) : ("Guardar cambios")}
          </Button>
        </Modal.Footer>

      </Modal>

      {/* modales mascotas */}

      <Modal className="modal-principal-mascota" show={showModalMascotas} onHide={() => setShowModalMascotas(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Mascotas de: {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}</Modal.Title>
        </Modal.Header>
        <Modal.Body>        
          <TablaMascotas mascotas={mascotas}  handleVerHistoria={handleVerHistoria} handleEliminarMascota={handleEliminarMascota} abrirEditor={edicionMascotaClick}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalMascotas(false)}>
            Cerrar
          </Button>
          <Button className="btn-modificar" onClick={() => setShowCrearMascota(true)}>
            Agregar Nueva Mascota
        </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="modal-ver-historia" show={showModalHistoria} onHide={() => setShowModalHistoria(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Historia Clínica: {nombreMascotaHistoria}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3 bg-light border rounded">
            <p style={{ whiteSpace: 'pre-wrap' }}>{historiaSeleccionada}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalHistoria(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="crear-mascota" show={showCrearMascota} onHide={() => setShowCrearMascota(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Mascota para {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="form-nueva-mascota" onSubmit={handleCrearMascota}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nombre" placeholder="Nombre de la mascota" required autoFocus />
            </Form.Group>

            <Form.Group className="mb-3" controlId="especie">
              <Form.Label>Seleccione especie</Form.Label>
              <Form.Select name="especie" required>
                <option value="CANINO">CANINO</option>
                <option value="FELINO">FELINO</option>
                <option value="OTRO">OTRO</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="raza">
              <Form.Label>Raza</Form.Label>
              <Form.Control type="text" name="raza" placeholder="Ej: Mestizo, Labrador..." />
            </Form.Group>

            <Form.Group className="mb-3" controlId="edad">
              <Form.Label>Edad</Form.Label>
              <Form.Control type="number" name="edad" placeholder="Edad en años" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="sexo">
              <Form.Label>Seleccione sexo</Form.Label>
              <Form.Select name="sexo" required>
                <option value="MACHO">MACHO</option>
                <option value="HEMBRA">HEMBRA</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="peso">
              <Form.Label>Peso</Form.Label>
              <Form.Control type="number" name="peso" step="0.001" placeholder="Peso en kg" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="historiaClinica">
              <Form.Label>Historia Clínica</Form.Label>
              <Form.Control as="textarea" name="historiaClinica" rows={3} placeholder="Historia Clínica" />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCrearMascota(false)}>
            Cerrar
          </Button>
          <Button variant="primary" type="submit" form="form-nueva-mascota">
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="modificar-mascota" show={showEditMascota} onHide={() => setShowEditMascota(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Registro: {mascotaAEditar?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form-edit-mascota" onSubmit={handleUpdateMascota}>
            
            <div className="mb-3 p-2 bg-light rounded border border-info">
              <small className="text-muted d-block">Ficha Técnica:</small>
              <strong>{mascotaAEditar?.especie}</strong> | {mascotaAEditar?.raza} | {mascotaAEditar?.sexo}
            </div>
            
            <Form.Group className="mb-3" controlId="peso">
              <Form.Label>Peso Actual (Kg)</Form.Label>
              <Form.Control type="number" name="peso" step="0.001" defaultValue={mascotaAEditar?.peso} required/>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="edad">
              <Form.Label>Edad (Años)</Form.Label>
              <Form.Control type="number" name="edad" defaultValue={mascotaAEditar?.edad} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="estado">
              <Form.Label>Estado del Paciente</Form.Label>
              <Form.Select name="estado" defaultValue={mascotaAEditar?.estado}>
                <option value="true">Habilitado</option>
                <option value="false">Deshabilitado</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Nueva Observación Médica</Form.Label>
              <Form.Control as="textarea" name="nuevaHistoria" rows={4} placeholder="Escriba la nota de la consulta actual..."/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditMascota(false)}>Cerrar</Button>
          <Button className="btn-modificar" type="submit" form="form-edit-mascota">
            Actualizar Registro
          </Button>
        </Modal.Footer>
      </Modal>

    </main>
  );
}
