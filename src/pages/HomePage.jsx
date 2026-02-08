import {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import logo from '../assets/img/logo-sin-BG.png'
import '../styles/HomePage.css'



export default function HomePage({authAdmin, authUser, logInAdmin, logInUser}) {
  
  const navigate = useNavigate();



  function logPageForm(e) {
    e.preventDefault();

    const mailIngresado = e.target.email.value;
    
    const passIngresado = e.target.password.value;
    

    const medicos = JSON.parse(localStorage.getItem('medicos'));
    
    const mailMedicos = medicos.map(medico=>medico.email);
    
    const clientes = JSON.parse(localStorage.getItem('clientes'));
    
    const mailClientes = clientes.map(cliente=>cliente.email);


    if (mailClientes.includes(mailIngresado)){
      logInUser();
      navigate('/user')
    }else if(mailMedicos.includes(mailIngresado)){
      logInAdmin();
      navigate('/admin')
    }else{
      alert('Email o contraseña incorrecto')
    }

  }

  return (
    <main className="main-login">

            <span className="logo-login"><img src={logo} alt="logo centro medico" /></span>

            <h2>Bienvenidos</h2>

            <p>Ingresa tu Email y Contraseña</p>

            <div className="form-login">

                <Form onSubmit={logPageForm}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Control type="email" placeholder="Email" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Control type="password" placeholder="Contraseña" required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        ingresar
                    </Button>
                </Form>
            
            </div>

            <FloatingWhatsApp
              phoneNumber="+5492214184682" 
              accountName='CeDiVe'
              statusMessage='En línea'
              chatMessage='Hola, como puedo ayudarte?'/>
              
    </main>  
  )
}







  
