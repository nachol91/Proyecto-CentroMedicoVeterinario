
import { Routes, Route, useLocation, BrowserRouter as Router  } from 'react-router-dom';
import{useState} from 'react';
import HeaderComponents from './components/HeaderComponents';
import FooterComponents from './components/FooterComponents';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import ProtectedRouteAdmin from './routes/ProtectedRouteAdmin';
import MedicoPage from './pages/MedicoPage';
import ProtectedRouteUser from './routes/ProtectedRouteUser';
import UserPage from './pages/UserPage';
import listadoClientes from '../clientes.json';
import listadoMedicos from '../medicos.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css'

 const AppLayout = () => {

  localStorage.setItem('medicos', JSON.stringify(listadoMedicos));

  localStorage.setItem('clientes', JSON.stringify(listadoClientes));
  
  const location = useLocation();

  const mostrarHeader = location.pathname === "/admin" || location.pathname === "/user";

  const mostrarFooter = location.pathname === "/admin" || location.pathname ==="/user" || location.pathname === "/";

  const [authAdmin, setAuthAdmin] = useState(false);

  const [authUser, setAuthUser] = useState(false);

  function logInAdmin(){
    setAuthAdmin(true)
  };

  function logOutAdmin(){
    setAuthAdmin(false)
  };

  function logInUser(){
    setAuthUser(true)
  };

  function logOutUser(){
    setAuthUser(false)
  };



  return (
    <>

      {mostrarHeader && <HeaderComponents/>}

      <main>
        <Routes>
          
          <Route path='/' element={<HomePage authAdmin={authAdmin} authUser={authUser} logInAdmin={logInAdmin} logOutAdmin={logOutAdmin} logInUser={logInUser} logOutUser={logOutUser}/>}/>

          <Route path='/admin' element={
            <ProtectedRouteAdmin authAdmin={authAdmin}>
              <MedicoPage/>
            </ProtectedRouteAdmin>}/>

          <Route path='/user' element={
            <ProtectedRouteUser authUser={authUser}>
              <UserPage/>
            </ProtectedRouteUser>}/>

          <Route path='*' element={<ErrorPage/>}/>
          
        </Routes>

      </main>

      
      {mostrarFooter && <FooterComponents/>}

    </>
  )
}


function App(){
  return(
    <Router>
      <AppLayout/>
    </Router>
  );
};

export default App
