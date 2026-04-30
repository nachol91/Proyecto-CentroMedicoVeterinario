import { useState, useEffect } from "react";
import { Button, Card, Form, Modal, Spinner, Row, Col } from "react-bootstrap";

import Swal from 'sweetalert2';

import inicio from "../assets/icons/cucha.png";
import pacientes from "../assets/icons/nosotros.png";
import turnos from "../assets/icons/calendario.png";
import recetas from "../assets/icons/servicios.png";
import wp from "../assets/icons/whatsapp.png";
import recetaCard from "../assets/img/recetas.avif";
import turnosCard from "../assets/img/turnos.jpg";
import pacientesCard from "../assets/img/pacientesCard.jpeg";

import TablaUsuarios from "../components/TablaUsuariosComponents";
import TablaMascotas from "../components/TablaMascotas";
import CalendarioTurnos from "../components/CalendarioTurnos";
import { postUsuario, actualizarUsuario, patchUsuario, getUsuarios, deleteUsuario } from "../helpers/apiUsuarios";
import { mascotasGetIdDueno, mascotaPost, mascotaDelete, mascotaPut, patchMascota } from "../helpers/apiMascotas";
import { leerUsuarioGuardado } from "../helpers/auth";

import "../styles/MedicoPage.css";


export default function AdminPage() {


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
    const resultado = await Swal.fire({
      title: "¿Estás seguro de eliminar este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f42c1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });
    if(resultado.isConfirmed){
      try {
        await deleteUsuario(id);
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado con éxito!",
          showConfirmButton: false,
          timer: 2000
        });
        obtenerUsuarios();      
      }catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario. Inténtelo de nuevo más tarde.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
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
          Swal.fire({
            title: "Error",
            text: "Las contraseñas no coinciden",
            icon: "error",
            confirmButtonColor: "#d33",
          });
          return;
        }      
      }
  
      if (password.length < 8) {
        setCargando(false);
        Swal.fire({
          title: "Error",
          text: "La contraseña debe tener al menos 8 caracteres",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;          
      }
      
      const dataUsuario ={ nombre, apellido, correo, telefono, nivel, password };
  
      try {
        const resultado = await postUsuario(dataUsuario);
  
        if(resultado){
          Swal.fire({
            icon: "success",
            title: "El usuario se cargo correctamente!",
            showConfirmButton: false,
            timer: 2300
          });
          e.target.reset();
          handleClose();
  
          obtenerUsuarios();
        };
      }catch (error) {
        Swal.fire({
          title: "Error",
          text: "error al conectar al servidor",
          icon: "error",
          confirmButtonColor: "#d33",
        });
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
          Swal.fire({
            title: "Error",
            text: "Las contraseñas no coinciden",
            icon: "error",
            confirmButtonColor: "#d33",
          });
          return;
        }
  
        const datosModificados = {
          correo: e.target.correo.value,
          telefono: e.target.telefono.value,
          password: password || undefined 
        };
  
        const resultado = await actualizarUsuario(usuarioAEditar._id, datosModificados);
  
        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "¡Usuario actualizado correctamente!",
            showConfirmButton: false,
            timer: 2000
          });
          e.target.reset();
          handleCloseEdit();
  
          obtenerUsuarios();        
        }
      } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Error al actualizar el usuario",
            icon: "error",
            confirmButtonColor: "#d33",
          });
      } finally{
        setCargando(false);
      }
  };

  const [mascotas, setMascotas] = useState([]);
  const [showModalMascotas, setShowModalMascotas] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState();
  const [cargandoId, setCargandoId] = useState(null);

  const [historiaSeleccionada, setHistoriaSeleccionada] = useState("");
  const [showModalHistoria, setShowModalHistoria] = useState(false);
  const [nombreMascotaHistoria, setNombreMascotaHistoria] = useState("");

  const [showCrearMascota, setShowCrearMascota] = useState(false);
  const medicoLogueado = leerUsuarioGuardado();

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
        medicoQueCrea: medicoLogueado?._id 
    };

    try {
      const resultado = await mascotaPost(dataMascota);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Mascota creada con éxito",
          showConfirmButton: false,
          timer: 2000
        });
        e.target.reset();
        setShowCrearMascota(false);
  
        handleVerMascotas(usuarioSeleccionado); 
      };      
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al conectar con el servidor",
        icon: "error",
        confirmButtonColor: "#d33",
      });          
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
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener las mascotas del usuario",
        icon: "error",
        confirmButtonColor: "#d33",
      });
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
  
  const resultado = await Swal.fire({
    title: "¿Estás seguro de que deseas eliminar esta mascota?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6f42c1",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar"
  });

  if(resultado.isConfirmed){
    try {
      const resultado = await mascotaDelete(id);
      if (resultado) {
        Swal.fire({
            icon: "success",
            title: "Mascota eliminada con éxito",
            showConfirmButton: false,
            timer: 2000
          });
        handleVerMascotas(usuarioSeleccionado);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar la mascota",
        icon: "error",
        confirmButtonColor: "#d33",
      })}
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
        Swal.fire({
          icon: "success",
          title: "¡Registro actualizado con éxito!",
          showConfirmButton: false,
          timer: 2000
        });
        setShowEditMascota(false);
        e.target.reset(); 
        handleVerMascotas(usuarioSeleccionado);
      }
    } catch (error) {
        Swal.fire({
        title: "Error",
        text: "Error al actualizar los datos",
        icon: "error",
        confirmButtonColor: "#d33",
      });          
    };
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
      
    
      <Modal className="crear-usuario" show={show} onHide={handleClose}>
        
        <Modal.Header closeButton>
          <Modal.Title>"Registrar Nuevo Usuario"</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form id="form-nuevo-usuario" onSubmit={handleSave} >
            <Row className="g-2">
              
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name='nombre' placeholder="ej: Juan" autoFocus minLength={3} maxLength={15} required/>
                  <Form.Text className="text-muted">
                    Máximo 15 caracteres.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="apellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" name='apellido' placeholder="ej: Lopez" minLength={3} maxLength={15} required/>
                  <Form.Text className="text-muted">
                    Máximo 15 caracteres.
                  </Form.Text>
                </Form.Group>
              </Col>   

              <Col xs={12}>    
                <Form.Group className="mb-3 full-width" controlId="correo">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control type="email" name='correo' placeholder="ej: ejemplo@gmail.com" maxLength={35} required/>
                </Form.Group>
              </Col> 

              <Col xs={12}>
                <Form.Group className="mb-3 full-width" controlId="telefono">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control type="tel" name='telefono'rows={3} pattern="[0-9]*" placeholder="ingrese el telefono(solo numeros)" maxLength={15} required/>
                </Form.Group>
              </Col>  
              
              <Col xs={12}>            
                <Form.Group className="mb-3 full-width" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" name='password' autoComplete="new-password" placeholder='ingresar contraseña' rows={3} minLength={8} maxLength={20} required/>
                  <Form.Text className="text-muted">
                    Mínimo 8 caracteres.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group className="mb-3 full-width" controlId="confirmarPassword">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control type="password" name='confirmarPassword' autoComplete="new-password" placeholder='Confirmar contraseña' rows={3} 
                    minLength={8} maxLength={20} required/>
                  <Form.Text className="text-muted">
                    Mínimo 8 caracteres.
                  </Form.Text>
                </Form.Group>
              </Col>

              <input type="hidden" name="rol" value={"USER"}/>
              
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
              <Form.Control type="text" name="nombre" placeholder="Nombre de la mascota" maxLength={15} required autoFocus />
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
              <Form.Control type="text" name="raza" placeholder="Ej: Mestizo, Labrador..." maxLength={15} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="edad">
              <Form.Label>Edad</Form.Label>
              <Form.Control type="number" name="edad" placeholder="Edad en años" min="1" max="99" 
                onInput={(e) => {
                  if (e.target.value.length > 2) {
                    e.target.value = e.target.value.slice(0, 2);
                  }
                }} required />
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
              <Form.Control type="number" name="peso" step="0.005" placeholder="Peso en kg(Ej: 10.5)" min="0" max="500"
                onInput={(e) => {
                  if (e.target.value.length > 6) {
                    e.target.value = e.target.value.slice(0, 6);
                  }
                }} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="historiaClinica">
              <Form.Label>Historia Clínica</Form.Label>
              <Form.Control as="textarea" name="historiaClinica" rows={3} placeholder="Historia Clínica" maxLength={500} required />
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
              <Form.Control type="number" name="peso" step="0.005" defaultValue={mascotaAEditar?.peso} required/>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="edad">
              <Form.Label>Edad (Años)</Form.Label>
              <Form.Control type="number" name="edad" defaultValue={mascotaAEditar?.edad} min="1" max="99" required />
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
