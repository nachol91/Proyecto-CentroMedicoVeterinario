import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { getTurnos, postTurno, deleteTurno, actualizarTurno, modificarTurno } from "../helpers/apiTurnos";
import { getUsuarios } from "../helpers/apiUsuarios";
import { mascotasGet } from "../helpers/apiMascotas";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Select from 'react-select';
import logoWhatsapp from '../assets/icons/whatsapp.png';

export default function CalendarioTurnos() {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const [showModalCrear, setShowModalCrear] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [nuevoTurno, setNuevoTurno] = useState({
    fecha: "",
    tipoDeEstudio: "CONSULTA GENERAL",
    descripcion: "",
    estado: "PENDIENTE",
    dueno: "",
    mascota: "",
    medico: ""
  });
  const [opcionesMascotas, setOpcionesMascotas] = useState([]);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});
  

  const cargarSelects = async () => {
  try {
    const resMascotas = await mascotasGet(); 
    const resUsuarios = await getUsuarios();

    const listaMascotas = resMascotas.mascotas || [];
    setMascotas(listaMascotas);
    
    
    const opciones = listaMascotas.map((mascota) => ({
      value: mascota._id,
      label: `${mascota.nombre.toUpperCase()} (Dueño: ${mascota.dueno?.nombre} ${mascota.dueno?.apellido} - ${mascota.dueno?.correo} - Tel: ${mascota.dueno?.telefono })`,
      datosCompletos: mascota 
    }));
    setOpcionesMascotas(opciones);

    const profesionalesHabilitados = resUsuarios.usuarios.filter(
      usuario => usuario.nivel === "MEDICO" || usuario.nivel === "ADMIN"
    );
    
    setMedicos(profesionalesHabilitados);
  } catch (error) {
    console.error("Error al cargar datos de los selectores", error);
  }
  };

  const cargarTurnos = async () => {
    try {
      const respuesta = await getTurnos();
      if (respuesta && respuesta.turnos){
        const turnosFormateados = respuesta.turnos.map((turno) => {
        const fechaInicio = new Date(turno.fecha);
        const fechaFin = new Date(fechaInicio.getTime() + 30 * 60000);
        return {
          id: turno._id,
          title: `${turno.mascota?.nombre || 'Paciente'} - ${turno.tipoDeEstudio}`, 
          start: turno.fecha,
          end: fechaFin.toISOString(),
          editable: turno.estado === "PENDIENTE",
          backgroundColor:turno.estado === "PENDIENTE" ? "#6f42c1" : 
                          turno.estado === "REALIZADO" ? "#28a745" : "#dc3545",
          borderColor:turno.estado === "PENDIENTE" ? "#6f42c1" : 
                      turno.estado === "REALIZADO" ? "#28a745" : "#dc3545",
          extendedProps: { ...turno, _id: turno._id }
          };
        });

      
      setEventos(turnosFormateados);
      };      
    } catch (error) {
      console.error("Error al cargar los turnos:", error);
    }
  };
  
  const handleEventClick = (info) => {
    setTurnoSeleccionado(info.event.extendedProps);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTurnoSeleccionado(null);
    setEditando(false);
  };

  const handleDateSelect = (selectInfo) => {
    const fechaSeleccionada = new Date(selectInfo.startStr);
    const ahora = new Date();
  
    if (fechaSeleccionada < ahora) {
      alert("No se pueden agendar turnos en fechas o horarios pasados.");
      selectInfo.view.calendar.unselect();
      return;
    }    
    
    setNuevaFecha(selectInfo.startStr);
    setNuevoTurno({
      fecha: selectInfo.startStr,
      tipoDeEstudio: "CONSULTA GENERAL",
      descripcion: "",
      dueno: "",
      mascota: "",
      medico: "",
      estado: "PENDIENTE"
    });
    setShowModalCrear(true);
    selectInfo.view.calendar.unselect();
  };

  const handleCrearTurno = async (e) => {
  e.preventDefault();
  
  try {
    if (!nuevoTurno.mascota || !nuevoTurno.medico || !nuevoTurno.dueno) {
      alert("Faltan datos obligatorios: Mascota, Médico o Dueño.");
      return;
    }

    const turnoAGuardar = { 
      ...nuevoTurno, 
      fecha: nuevaFecha
    };

    const respuesta = await postTurno(turnoAGuardar);

    alert("¡Turno agendado con éxito!");
    setShowModalCrear(false);
    await cargarTurnos(); 

  } catch (error) {
    alert("Error al guardar: " + error.message);
  }
  };

  const handleFinalizarAtencion = async () => {
    if (!turnoSeleccionado) return;

    try {
      await actualizarTurno(turnoSeleccionado._id, { estado: "REALIZADO" });

      alert("¡Consulta Finalizada!");
      handleClose();
      await cargarTurnos(); 
      
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleGuardarCambios = async () => {
    const medicoId = datosEditados.medico?._id || datosEditados.medico;

    const cuerpoParaEnviar = {
      fecha: datosEditados.fecha,
      descripcion: datosEditados.descripcion,
      tipoDeEstudio: datosEditados.tipoDeEstudio,
      medico: medicoId // Mandamos solo el ID
    };

    try {
      const respuesta = await modificarTurno(turnoSeleccionado._id, cuerpoParaEnviar);
      
      alert("¡Turno modificado con éxito!");
      setEditando(false);
      handleClose();
      await cargarTurnos();
    } catch (error) {
      alert("Error al modificar: " + error.message);
    }
  };

  const handleEventDrop = async (info) => {
    const { event } = info;
    
    const idTurno = event.extendedProps._id;
    const nuevaFecha = info.event.start;
    const ahora = new Date();

    if (nuevaFecha < ahora) {
      alert("No puedes reprogramar un turno a una fecha/hora pasada.");
      info.revert();
      return;
    }

    const cuerpoEdicion = {
      turno: idTurno,
      fecha: nuevaFecha,
      descripcion: event.extendedProps.descripcion,
      tipoDeEstudio: event.extendedProps.tipoDeEstudio,
      medico: event.extendedProps.medico?._id || event.extendedProps.medico
    };

    try {
      await modificarTurno(idTurno, cuerpoEdicion);
      alert("Turno reprogramado con éxito");
      await cargarTurnos(); 
    } catch (error) {
      alert("Error al reprogramar: " + error.message);
      info.revert(); 
    }
  };

  const handleBorrarTurno = async () => {
    if (!turnoSeleccionado) return;

    const idABorrar = turnoSeleccionado?._id || turnoSeleccionado?.id;

    if (!idABorrar) {
      alert("Error: No se pudo encontrar el identificador del turno.");
      return;
    }

    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el turno de ${turnoSeleccionado.mascota?.nombre}?`);

    if (confirmar) {
      try {
        const respuesta = await deleteTurno(idABorrar);

        alert("Turno eliminado correctamente");
        handleClose();
        await cargarTurnos(); 

      } catch (error) {
        alert("Error al intentar eliminar el turno");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    cargarTurnos();
    cargarSelects();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        locale={esLocale}
        events={eventos}
        eventMaxStack={3}
        eventClick={handleEventClick}        
        slotDuration="00:30:00"      
        slotLabelInterval="00:30:00"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        expandRows={true}
        height="650px"
        stickyHeaderDates={true}
        scrollTime="08:00:00"
        handleWindowResize={true}
        slotEventOverlap={false}
        selectable={true}
        selectMirror={true}        
        select={handleDateSelect}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: false,       
            hour12: false}}
        eventTimeFormat={{           
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}/>

      {/* Modal de Detalle */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            {editando ? "Editando Turno" : `${turnoSeleccionado?.tipoDeEstudio}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {turnoSeleccionado && (
            <div className="row">
              <div className="col-md-6 border-end">
                <h5 className="text-primary border-bottom pb-2">Paciente</h5>
                <p><strong>Nombre:</strong> {turnoSeleccionado.mascota?.nombre}</p>
                <p><strong>Dueño:</strong> {turnoSeleccionado.dueno?.nombre} {turnoSeleccionado.dueno?.apellido}</p>
                <div className="d-flex align-items-center mt-2">
                  <p className="mb-0 me-2"><strong>Teléfono:</strong></p>
                  <a href={`tel:${turnoSeleccionado?.dueno?.telefono}`} className="text-decoration-none fw-bold me-3">
                    {turnoSeleccionado?.dueno?.telefono}
                  </a>

                  <a 
                    href={`https://wa.me/${turnoSeleccionado?.dueno?.telefono.replace(/\D/g,'')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-success btn-sm d-flex align-items-center gap-2"
                    style={{ borderRadius: '20px', padding: '4px 12px' }}>
                    <img src={logoWhatsapp} alt="WhatsApp" style={{ width: '18px', height: '18px', objectFit: 'contain' }}/>
                    <span>WhatsApp</span>
                  </a>
                </div>
                <hr />
                <h5 className="text-primary border-bottom pb-2">Asignación</h5>
                
                <label className="fw-bold">Médico:</label>
                {editando ? (
                  <select 
                    className="form-select mb-3" 
                    value={datosEditados.medico?._id || datosEditados.medico} 
                    onChange={(e) => setDatosEditados({...datosEditados, medico: e.target.value})}
                  >
                    {medicos.map(m => <option key={m._id} value={m._id}>{m.nombre} {m.apellido}</option>)}
                  </select>
                ) : (
                  <p>{turnoSeleccionado.medico?.nombre} {turnoSeleccionado.medico?.apellido}</p>
                )}

                <label className="fw-bold">Tipo de Estudio:</label>
                {editando ? (
                  <select 
                    className="form-select" 
                    value={datosEditados.tipoDeEstudio} 
                    onChange={(e) => setDatosEditados({...datosEditados, tipoDeEstudio: e.target.value})}
                  >
                    <option value="CONSULTA GENERAL">CONSULTA GENERAL</option>
                    <option value="PRE-QUIRURGICO">PRE-QUIRURGICO</option>
                    <option value="ECOGRAFIA">ECOGRAFIA</option>
                    <option value="RADIOGRAFIA">RADIOGRAFIA</option>
                    <option value="ELECTROCARDIOGRAMA">ELECTROCARDIOGRAMA</option>
                  </select>
                ) : (
                  <p>{turnoSeleccionado.tipoDeEstudio}</p>
                )}
              </div>

              <div className="col-md-6">
                <h5 className="text-primary border-bottom pb-2">Estado y Motivo</h5>
                <p><strong>Estado Actual:</strong> 
                  <Badge className="ms-2" bg={turnoSeleccionado.estado === 'PENDIENTE' ? 'warning' : 'success'}>
                    {turnoSeleccionado.estado}
                  </Badge>
                </p>

                <div className="p-3 bg-light rounded border mt-3">
                  <strong>Descripción:</strong>
                  {editando ? (
                    <textarea 
                      className="form-control mt-2" 
                      rows="3" 
                      value={datosEditados.descripcion} 
                      onChange={(e) => setDatosEditados({...datosEditados, descripcion: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 mt-2">{turnoSeleccionado.descripcion}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {editando ? (
            <>
              <Button variant="secondary" onClick={() => setEditando(false)}>
                  Cancelar
              </Button>

              <Button variant="success" onClick={handleGuardarCambios}>
                Guardar Cambios
              </Button>
            </>) : (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>   

              <Button variant="danger" onClick={handleBorrarTurno}>
                Borrar Turno
              </Button>  

              {turnoSeleccionado?.estado === "PENDIENTE" && (
                <Button variant="warning" onClick={() => {setDatosEditados({...turnoSeleccionado}); setEditando(true)}}>
                  Editar
                </Button>
              )}

              {turnoSeleccionado?.estado === "PENDIENTE" && (
                <Button className="btn-violeta" onClick={handleFinalizarAtencion}>
                  Finalizar Atención
                </Button>
              )}
            </>
            )}
        </Modal.Footer>
      </Modal>

      {/* MODAL PARA CREAR UN NUEVO TURNO */}
      <Modal show={showModalCrear} onHide={() => setShowModalCrear(false)} backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Agendar Nuevo Turno</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleCrearTurno}>
          <Modal.Body>
            {/* Campo de Fecha */}
            <div className="mb-3">
              <label className="form-label fw-bold">Fecha y Hora</label>
              <input 
                type="text" 
                className="form-control bg-light" 
                value={nuevaFecha ? new Date(nuevaFecha).toLocaleString() : ""} 
                readOnly/>
            </div>

            {/* Tipo de Estudio */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tipo de Estudio</label>
              <select className="form-select" value={nuevoTurno.tipoDeEstudio} onChange={(e) => setNuevoTurno({...nuevoTurno, tipoDeEstudio: e.target.value})}required>
                <option value="CONSULTA GENERAL">CONSULTA GENERAL</option>
                <option value="PRE-QUIRURGICO">PRE-QUIRURGICO</option>
                <option value="ECOGRAFIA">ECOGRAFIA</option>
                <option value="RADIOGRAFIA">RADIOGRAFIA</option>
                <option value="ELECTROCARDIOGRAMA">ELECTROCARDIOGRAMA</option>
              </select>
            </div>

            {/* Selección de Mascota */}
            <div className="mb-3">
              <label className="form-label fw-bold">Mascota (Paciente)</label>
                <Select options={opcionesMascotas} required placeholder="Buscar mascota, dueño o email..." noOptionsMessage={() => "No se encontraron resultados"}
                  isClearable
                  onChange={(selected) => {
                    if (selected) {
                      const m = selected.datosCompletos;
                      setNuevoTurno({
                        ...nuevoTurno,
                        mascota: m._id,
                        dueno: m.dueno?._id || m.dueno
                      });
                    } else {
                      setNuevoTurno({ ...nuevoTurno, mascota: '', dueno: '' });
                    }
                  }}
                  styles={{control: (base) => ({...base,borderRadius: '0.375rem', borderColor: '#dee2e6'})}}
                />
            </div>

            {/* Selección de Médico */}
            <div className="mb-3">
              <label className="form-label fw-bold">Veterinario a Cargo</label>
              <select className="form-select" required onChange={(e) => setNuevoTurno({...nuevoTurno, medico: e.target.value})}>          
                <option value="">Asignar profesional...</option>
                {medicos.map((med) => (
                  <option key={med._id} value={med._id}>{med.nombre} {med.apellido}</option>
                ))}
              </select>
            </div>

            {/* Descripción del Motivo */}
            <div className="mb-3">
              <label className="form-label fw-bold">Descripción / Síntomas</label>
              <textarea 
                className="form-control" 
                rows="3"
                placeholder="Indique el motivo del turno..."
                required
                onChange={(e) => setNuevoTurno({...nuevoTurno, descripcion: e.target.value})}
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalCrear(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-violeta">
              Confirmar Cita
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

    </div>
  );
}