import { useState, useEffect } from "react";
import { Spinner, Card, Table, Button } from "react-bootstrap";

// Assets (Tus iconos y fotos confirmados)
import inicio from "../assets/icons/cucha.png";
import pacientes from "../assets/icons/nosotros.png";
import turnosIcon from "../assets/icons/calendario.png";
import wp from "../assets/icons/whatsapp.png";
import pacientesCard from "../assets/img/pacientesCard.jpeg";
import turnosCard from "../assets/img/turnos.jpg"

// Componentes y Helpers (Usando el nombre EXACTO de tu export)
import TablaMascotasUsuario from "../components/TablaMascotasUsuario";
import { getUsuarioByID } from "../helpers/apiUsuarios";
import { mascotasGetIdDueno } from "../helpers/apiMascotas"; 
import { getTurnosByIdDueno } from "../helpers/apiTurnos";

import "../styles/AdminPage.css";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [usuarioData, setUsuarioData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mascotas, setMascotas] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const obtenerUsuario = async ()=>{
    const usuarioConectado = JSON.parse(localStorage.getItem("usuario"))
    const data = await getUsuarioByID(usuarioConectado._id)

    setUsuarioData(data.usuario || data);    
  };

  const obtenerMascotas = async ()=>{
    setCargando(true);
    const usuarioConectado = JSON.parse(localStorage.getItem("usuario"));
    const idDueno = usuarioConectado._id;
    try {
      const data = await mascotasGetIdDueno(idDueno);
      setMascotas(data.mascotas || []);
    } catch (error) {
      console.error("Error al traer las mascotas:", error);
      alert("No se pudieron traer las mascotas del usuario");
    }finally{
      setCargando(false);
    }
    
  };

 const obtenerTurnos = async () => {
    setCargando(true);
    try {
        const usuarioConectado = JSON.parse(localStorage.getItem("usuario"));
        const data = await getTurnosByIdDueno(usuarioConectado._id);
        
        setTurnos(data.turnos || []); 
    } catch (error) {
        console.error("Error al traer los turnos:", error);
    } finally {
        setCargando(false);
    }
  };

 useEffect(() => {    
    obtenerUsuario();
    obtenerMascotas();
    obtenerTurnos();
  }, []);
  

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
            className={`aside-item ${activeTab === "mascotas" ? "active" : ""}`} 
            onClick={() => setActiveTab("mascotas")}>
            <img src={pacientes} alt="Mascotas" className="aside-custom-icon" />
            <span>Mis Mascotas</span>
          </button>

          <button
            className={`aside-item ${activeTab === "turnos" ? "active" : ""}`} 
            onClick={() => setActiveTab("turnos")}>
            <img src={turnosIcon} alt="Turnos" className="aside-custom-icon" />
            <span>Mis Turnos</span>
          </button>
        </nav>

        <div className="aside-footer">
          <hr />
          <p>Si tenés alguna duda o consulta envíanos un mensaje</p>
          <a href="https://wa.me/+5492214184682" target="_blank" rel="noreferrer">
            <img src={wp} alt="Whatsapp" className="whatsapp-custom-icon" />
          </a>
        </div>
      </aside>

      <section className="content-main">
        {activeTab === "inicio" && (
          <div>
            <h1>Panel de {usuarioData?.nombre}</h1>
            <div className="tarjetas">
              <Card className="custom-card">
                <Card.Img variant="top" src={pacientesCard} className="card-img-custom" />
                <Card.Body>
                  <Card.Title>Mis Mascotas</Card.Title>
                  <Button className="btn-violeta" onClick={() => setActiveTab('mascotas')}>
                    Ver mis mascotas
                  </Button>
                </Card.Body>
              </Card>

              <Card className="custom-card">
                <Card.Img variant="top" src={turnosCard} className="card-img-custom" />
                <Card.Body>
                  <Card.Title>Turnos</Card.Title>
                  <Button className="btn-violeta" onClick={() => setActiveTab('turnos')}>Ver mis turnos</Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "mascotas" && (
          <div>
            <h1>Mis Mascotas Registradas</h1>
            
            {cargando ? (
              <div className="d-flex justify-content-center align-items-center mt-5">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <span className="ms-2">Cargando mascotas...</span>
              </div>
            ) : (
              <TablaMascotasUsuario mascotas={mascotas || []} />
            )}
          </div>
        )}

        {activeTab === "turnos" && (
          <div>
            <h1>Mis Próximos Turnos</h1>
            {activeTab === "turnos" && (
                <div>
                  {cargando ? (
                    <div className="d-flex justify-content-center mt-5">
                      <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </Spinner>
                      <span className="ms-2">Cargando Turnos...</span>
                    </div>
                  ) : (
                    <Table striped bordered hover responsive className="mt-4">
                      <thead className="tabla-header">
                        <tr>
                          <th>Mascota</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Estudio</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {turnos.length > 0 ? (
                          turnos.map((turno) => (
                            <tr key={turno._id}>
                              <td>{turno.mascota?.nombre}</td>
                              <td>{new Date(turno.fecha).toLocaleDateString('es-AR')}</td>
                              <td>{new Date(turno.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</td>
                              <td>{turno.tipoDeEstudio}</td>
                              <td>{turno.estado}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">No tenés turnos programados</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>
            )}
            
          </div>
        )}
      </section>
    </main>
  );
}