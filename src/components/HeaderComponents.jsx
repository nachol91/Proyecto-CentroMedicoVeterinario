import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { actualizarUsuario } from '../helpers/apiUsuarios';
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import logo from "../assets/img/logo-sin-BG.png";
import avatar from "../assets/icons/icono-avatar.png";
import "../styles/HeaderComponents.css";

export default function HeaderComponents() {
  
  const navigate = useNavigate();
  
  const userRaw = localStorage.getItem("usuario");
  
  const userData = (userRaw && userRaw !== "undefined") ? JSON.parse(userRaw) : null;
  
  const idUsuario = userData?._id || userData?.uid || userData?.id;
  const correoUsuario = userData.correo
  const telefonoUsuario = userData.telefono
  const nombreUsuario = userData.nombre 
  const apellidoUsuario = userData.apellido
  const imgUsuario = userData.img;

  const [formData, setFormData] = useState({
    correo: '',
    telefono: '',
    passwordActual: '',
    nuevoPassword: '',      
    confirmarPassword: ''
  });
  
  const handleChange = (e) => {

    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = async (e) =>{
  
    if (e) e.preventDefault();
    
    const {correo, telefono, passwordActual, nuevoPassword, confirmarPassword} = formData;

    if (nuevoPassword.length > 0) {
        if (nuevoPassword !== confirmarPassword) {
          return alert("Las nuevas contraseñas no coinciden");
        }
        if (nuevoPassword.length < 8) {
          return alert("La nueva contraseña debe tener al menos 8 caracteres");
        }
      }
    const datosNuevos = {
      correo: correo,
      telefono: Number(telefono),
      passwordActual: passwordActual || undefined, 
      password: nuevoPassword || undefined
    };

    try {
          
      const resultados = await actualizarUsuario(idUsuario, datosNuevos);   

      if(resultados){
        localStorage.setItem("usuario", JSON.stringify(resultados.usuario));
        alert("los datos se actualizaron correctamente")
        setFormData({...formData, passwordActual: '', nuevoPassword: '', confirmarPassword: '',});
        handleClose();
      }          
      }catch (error) {
        console.error(error);
        alert(error.message || "error al conectar al servidor")
      }
  }  
  
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);

  const handleShow = () =>{
    setFormData({
      correo:  correoUsuario,
      telefono: telefonoUsuario,
      passwordActual: '',
      nuevoPassword: '', 
      confirmarPassword: ''
    });
    setShow(true);  
  }; 
  
  const cerrarSesion = (e) => {

    e.preventDefault();
    const confirmar = window.confirm("Esta seguro que desea cerrar sesión?");
    if (confirmar) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  
  return (
    <section className="header">
      <div className="logo-header">
        <div className="imagen-logo">
          <img src={logo} alt="imagen del header" />
        </div>
        <p className="nombre-usuario">Bienvenido {nombreUsuario}!</p>
      </div>
      <div className="info-usuario">
        <div className="logo-usuario">
          <img
            src={imgUsuario ? imgUsuario : avatar}
            alt="avatar del usuario"
          />
        </div>
        <div className="menu-sesion">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {nombreUsuario} {apellidoUsuario}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={handleShow}>
                Mis Datos
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={cerrarSesion}>
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        
        <Modal.Header closeButton>
          <Modal.Title>Mis Datos</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>correo</Form.Label>
              <Form.Control type="email" name='correo' value={formData.correo} onChange={handleChange} autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="number" name='telefono' value={formData.telefono} onChange={handleChange} rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña actual(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='passwordActual' placeholder='ingresa tu contraseña actual' value={formData.passwordActual} rows={3} onChange={handleChange} />
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
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar cambios
          </Button>
        </Modal.Footer>

      </Modal>
    </section>
  );
}
