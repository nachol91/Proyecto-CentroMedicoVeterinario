import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import Swal from 'sweetalert2';

import { actualizarUsuario } from '../helpers/apiUsuarios';

import logo from "../assets/img/logo-sin-BG.png";
import avatar from "../assets/icons/icono-avatar.png";
import "../styles/HeaderComponents.css";

export default function HeaderComponents() {
  
  const navigate = useNavigate();
  
  const usuarioLocal = localStorage.getItem("usuario");
  
  const userData = (usuarioLocal && usuarioLocal !== "undefined") ? JSON.parse(usuarioLocal) : null;
  
  const idUsuario = userData?._id || userData?.uid || userData?.id;
  const { nombre, apellido, correo, telefono, img } = userData || {};

  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);
  
  
  const handleSave = async (e) =>{
  
    e.preventDefault();
    
    const nuevoCorreo = e.target.correo.value;
    const nuevoTelefono = e.target.telefono.value;
    const passwordActual = e.target.passwordActual.value;
    const nuevoPassword = e.target.nuevoPassword.value;
    const confirmarPassword = e.target.confirmarPassword.value;

    if (nuevoPassword) {
        if (nuevoPassword !== confirmarPassword) {
          Swal.fire({
            title: "Error",
            text: "Las nuevas contraseñas deben ser iguales",
            icon: "error",
            confirmButtonColor: "#d33",
          });
          return;
        }
        if (nuevoPassword.length < 8) {
          Swal.fire({
            title: "Error",
            text: "La nueva contraseña debe tener al menos 8 caracteres",
            icon: "error",
            confirmButtonColor: "#d33",
          });
          return
        }
    };

    const datosNuevos = {
      correo: nuevoCorreo,
      telefono: nuevoTelefono,
      passwordActual: passwordActual || undefined, 
      password: nuevoPassword || undefined
    };

    try {
          
      const resultados = await actualizarUsuario(idUsuario, datosNuevos);   

      if(resultados){
        localStorage.setItem("usuario", JSON.stringify(resultados.usuario));
        Swal.fire({
          icon: "success",
          title: "los datos se actualizaron correctamente",
          showConfirmButton: false,
          timer: 2000
        });
        handleClose();}          
      }catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error al conectar con el servidor",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
  };
  
  const cerrarSesion = async (e) => {
    e.preventDefault();
    
    const resultado = await Swal.fire({
      title: "Esta seguro que desea cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f42c1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });
    if (resultado.isConfirmed) {
      try{
        localStorage.clear();
        navigate("/");
      }catch (error){
        Swal.fire("error al cerrar cesion")
      }      
    }
  };
  
  return (
    <section className="header">
      <div className="logo-header">
        <div className="imagen-logo">
          <img src={logo} alt="imagen del header" />
        </div>
        <p className="nombre-usuario">Bienvenido {nombre}!</p>
      </div>
      <div className="info-usuario">
        <div className="logo-usuario">
          <img
            src={img ? img : avatar}
            alt="avatar del usuario"
          />
        </div>
        <div className="menu-sesion">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {nombre} {apellido}
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
          <Modal.Title>Mis Datos Personales</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form id="form-mis-datos" onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" name='correo' autoComplete="username" defaultValue={correo} autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="tel" name='telefono' defaultValue={telefono} rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña actual(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='passwordActual' autoComplete="current-password" placeholder='ingresa tu contraseña actual'/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nueva contraseña(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='nuevoPassword' autoComplete="new-password" placeholder='ingrese la nueva contraseña (min 8 caracteres)'/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Confirmar contraseña(Dejar en blanco si no se quiere modificar)</Form.Label>
              <Form.Control type="password" name='confirmarPassword' autoComplete="new-password" placeholder='repita la contraseña'/>
            </Form.Group>            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" type='submit' form='form-mis-datos'>
            Guardar cambios
          </Button>
        </Modal.Footer>

      </Modal>
    </section>
  );
}
