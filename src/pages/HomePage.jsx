import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import Swal from 'sweetalert2';

import { authLogin } from "../helpers/apiLogin";

import logo from "../assets/img/logo-sin-BG.png";
import "../styles/HomePage.css";

export default function HomePage({ logInAdmin, logInUser, logInMedico }) {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);


  async function logPageForm(e) {
  e.preventDefault();
  setCargando(true);

  const correo = e.target.email.value;
  const password = e.target.password.value;

  try{
    const data = await authLogin({ correo, password });
 
    if (!data.token) {
      Swal.fire({
        title: "Error de ingreso",
        text: "Credenciales incorrectas, comuniquese con el Administrador",
        icon: "error",
        confirmButtonColor: "#6f42c1",
      });
      return;
    }
  
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    
    if (data.usuario.nivel === "ADMIN") {
      logInAdmin();
      navigate("/admin");
    } else if (data.usuario.nivel === "USER") {
      logInUser();
      navigate("/user");
    } else if (data.usuario.nivel === "MEDICO") {
      logInMedico();
      navigate("/medico");
    } else {
      Swal.fire({
        title: "Error",
        text: "No tiene acceso a la página",
        icon: "error",
        confirmButtonColor: "#d33",
      });    
    }
  }catch (error){
    Swal.fire({
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor.Intentá más tarde.",
      icon: "error",
      confirmButtonColor: "#6f42c1",
    });
  }finally{
    setCargando(false);
  }};

  return (
    <main className="main-login">
      <span className="logo-login">
        <img src={logo} alt="logo centro medico" />
      </span>

      <h2>Bienvenidos</h2>

      <p>Ingresa tu Email y Contraseña</p>

      <div className="form-login">
        <Form onSubmit={logPageForm}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Control type="email" placeholder="Email" autoComplete="username" maxLength={35} required disabled={cargando} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Control type="password" placeholder="Contraseña" required autoComplete="current-password" minLength={8} maxLength={20} disabled={cargando}/>
          </Form.Group>
          <Button className="btn-violeta" type="submit" disabled={cargando}>
            {cargando ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                Ingresando...
              </>
            ) : ("ingresar")}            
          </Button>
        </Form>
      </div>

      <FloatingWhatsApp
        phoneNumber="+5492214184682"
        accountName="CeDiVe"
        statusMessage="En línea"
        chatMessage="Hola, como puedo ayudarte?"
      />
    </main>
  );
}
