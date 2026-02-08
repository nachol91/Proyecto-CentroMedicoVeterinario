import {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo-sin-BG.png'
import '../styles/HomePage.css'



export default function HomePage({authAdmin, authUser, logInAdmin, logInUser}) {
  
  

  // const[emailsMedicos, setEmailsMedicos] = useState([]);
  // const[emailsUsuarios, setEmailsUsuarios] = useState([]);
  // const[passMedicos, setPassMedicos] = useState([]);
  // const[passUsuarios, setPassUsuarios] = useState([]);
  const navigate = useNavigate();


  // useEffect(()=> {
  //   const medicosEmails = medicos.map(usuario => usuario.email);
  //   setEmailsMedicos(medicosEmails);
  // },[]);

  //  useEffect(()=> {
  //   const clientesEmails = listadoClientes.map(usuario => usuario.email);
  //   setEmailsUsuarios(clientesEmails);
  // },[]);

  // useEffect(()=> {
  //   const medicosPass = listadoMedicos.map(usuario => usuario.password);
  //   setPassMedicos(medicosPass);
  // },[]);

  // useEffect(()=> {
  //   const clientesPass = listadoClientes.map(usuario => usuario.password);
  //   setPassUsuarios(clientesPass);
  // },[]);
  


  function logPageForm(e) {
    e.preventDefault();

    const mailIngresado = e.target.email.value;
    console.log(mailIngresado);
    const passIngresado = e.target.password.value;
    console.log(passIngresado);

    const medicos = JSON.parse(localStorage.getItem('medicos'));
    console.log(medicos);
    console.log(medicos.map(medico=>medico.email));
    const clientes = JSON.parse(localStorage.getItem('clientes'));
    console.log(clientes);
    console.log(clientes.map(cliente=>cliente.email));


    if (mailIngresado === clientes.email && passIngresado === clientes.password){
      logInUser();
      navigate('/user')
    }else if(mailIngresado === medicos.email && passIngresado === medicos.password){
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

    </main>  
  )
}
