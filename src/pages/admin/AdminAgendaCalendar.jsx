import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

const localizer = momentLocalizer(moment);

export default function AdminAgendaCalendar() {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);

const [nuevoEvento, setNuevoEvento] = useState({
  titulo: '',
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
  equipo_id: '',
  sede_id: '',
  entrenador_id: '',
  tipo_evento: 'entrenamiento',
  tipo_entrenamiento: '',
  descripcion: '',
});

useEffect(() => {
    cargarEventos();
    cargarCatalogos();
  }, []);

  async function crearEvento() {
    if (!nuevoEvento.fecha || !nuevoEvento.hora_inicio || !nuevoEvento.hora_fin) {
      alert('Completa fecha, hora inicio y hora fin.');
      return;
    }
  
    const { error } = await supabase.from('agenda_eventos').insert([
      {
        ...nuevoEvento,
        equipo_id: nuevoEvento.equipo_id || null,
        sede_id: nuevoEvento.sede_id || null,
        entrenador_id: nuevoEvento.entrenador_id || null,
        estado_evento: 'programado',
        estado: 'activo',
      },
    ]);
  
    if (error) {
      console.error(error);
      alert('No se pudo crear el evento.');
      return;
    }
  
    alert('Evento creado correctamente');
  
    setNuevoEvento({
      titulo: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      equipo_id: '',
      sede_id: '',
      entrenador_id: '',
      tipo_evento: 'entrenamiento',
      tipo_entrenamiento: '',
      descripcion: '',
    });
  
    setMostrarCrear(false);
    cargarEventos();
  }

  async function cargarCatalogos() {
    const [equiposRes, sedesRes, entrenadoresRes] = await Promise.all([
      supabase.from('equipos').select('id, nombre').order('nombre'),
      supabase.from('sedes').select('id, nombre_corto').order('nombre_corto'),
      supabase.from('entrenadores').select('id, nombres_completos').order('nombres_completos'),
    ]);
  
    setEquipos(equiposRes.data || []);
    setSedes(sedesRes.data || []);
    setEntrenadores(entrenadoresRes.data || []);
  }

  async function cargarEventos() {
    setCargando(true);

    const { data, error } = await supabase
      .from('agenda_eventos')
      .select(`
        id,
        titulo,
        tipo_evento,
        tipo_entrenamiento,
        fecha,
        hora_inicio,
        hora_fin,
        estado,
        estado_evento,
        descripcion,
        novedad,
        equipo:equipos(nombre),
        sede:sedes(nombre_corto),
        entrenador:entrenadores(nombres_completos)
      `)
      .order('fecha', { ascending: true });

    if (error) {
      console.error(error);
      alert('No se pudo cargar la agenda');
      setEventos([]);
      setCargando(false);
      return;
    }

    const eventosCalendario = (data || []).map((ev) => {
      const inicio = new Date(`${ev.fecha}T${ev.hora_inicio || '00:00'}`);
      const fin = new Date(`${ev.fecha}T${ev.hora_fin || ev.hora_inicio || '01:00'}`);

      return {
        id: ev.id,
        title: `${ev.equipo?.nombre || ev.titulo || 'Evento'} · ${ev.sede?.nombre_corto || ''}`,
        start: inicio,
        end: fin,
        resource: ev,
      };
    });

    setEventos(eventosCalendario);
    setCargando(false);
  }

  function eventStyleGetter(event) {
    const estado = event.resource?.estado_evento;

    let backgroundColor = '#0b2a6f';

    if (estado === 'cancelado') backgroundColor = '#777';
    if (estado === 'pendiente') backgroundColor = '#d99b00';
    if (estado === 'realizado') backgroundColor = '#198754';

    return {
      style: {
        backgroundColor,
        borderRadius: '10px',
        color: 'white',
        border: 'none',
        padding: '4px',
      },
    };
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Agenda calendario</h1>

      <section style={styles.adminPanel}>
  <button
    style={styles.boton}
    onClick={() => setMostrarCrear(!mostrarCrear)}
  >
    {mostrarCrear ? 'Cerrar formulario' : '+ Crear evento'}
  </button>

  {mostrarCrear && (
    <div style={{ marginTop: 20 }}>
      <input
        style={styles.input}
        placeholder="Título del evento"
        value={nuevoEvento.titulo}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })
        }
      />

      <input
        style={styles.input}
        type="date"
        value={nuevoEvento.fecha}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })
        }
      />

      <input
        style={styles.input}
        type="time"
        value={nuevoEvento.hora_inicio}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, hora_inicio: e.target.value })
        }
      />

      <input
        style={styles.input}
        type="time"
        value={nuevoEvento.hora_fin}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, hora_fin: e.target.value })
        }
      />

      <select
        style={styles.input}
        value={nuevoEvento.equipo_id}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, equipo_id: e.target.value })
        }
      >
        <option value="">Selecciona equipo</option>
        {equipos.map((equipo) => (
          <option key={equipo.id} value={equipo.id}>
            {equipo.nombre}
          </option>
        ))}
      </select>

      <select
        style={styles.input}
        value={nuevoEvento.sede_id}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, sede_id: e.target.value })
        }
      >
        <option value="">Selecciona sede</option>
        {sedes.map((sede) => (
          <option key={sede.id} value={sede.id}>
            {sede.nombre_corto}
          </option>
        ))}
      </select>

      <select
        style={styles.input}
        value={nuevoEvento.entrenador_id}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, entrenador_id: e.target.value })
        }
      >
        <option value="">Selecciona entrenador</option>
        {entrenadores.map((entrenador) => (
          <option key={entrenador.id} value={entrenador.id}>
            {entrenador.nombres_completos}
          </option>
        ))}
      </select>

      <input
        style={styles.input}
        placeholder="Tipo de entrenamiento"
        value={nuevoEvento.tipo_entrenamiento}
        onChange={(e) =>
          setNuevoEvento({
            ...nuevoEvento,
            tipo_entrenamiento: e.target.value,
          })
        }
      />

      <textarea
        style={styles.input}
        placeholder="Descripción"
        value={nuevoEvento.descripcion}
        onChange={(e) =>
          setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
        }
      />

      <button style={styles.boton} onClick={crearEvento}>
        Guardar evento
      </button>
    </div>
  )}
</section>

      <section style={styles.adminPanel}>
        {cargando && <p>Cargando calendario...</p>}

        {!cargando && (
          <div style={{ height: 650 }}>
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              defaultView="day"
              views={['day', 'week', 'month']}
              step={30}
              timeslots={2}
              onSelectEvent={(event) => setEventoSeleccionado(event.resource)}
              eventPropGetter={eventStyleGetter}
              messages={{
                today: 'Hoy',
                previous: 'Atrás',
                next: 'Siguiente',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                noEventsInRange: 'No hay eventos en este rango',
              }}
            />
          </div>
        )}
      </section>

      {eventoSeleccionado && (
        <section style={styles.adminPanel}>
          <button
            style={styles.volverBtn}
            onClick={() => setEventoSeleccionado(null)}
          >
            Cerrar detalle
          </button>

          <h2>{eventoSeleccionado.titulo}</h2>

          <p><strong>Equipo:</strong> {eventoSeleccionado.equipo?.nombre || 'Sin equipo'}</p>
          <p><strong>Sede:</strong> {eventoSeleccionado.sede?.nombre_corto || 'Sin sede'}</p>
          <p><strong>Horario:</strong> {eventoSeleccionado.hora_inicio} - {eventoSeleccionado.hora_fin}</p>
          <p><strong>Entrenador:</strong> {eventoSeleccionado.entrenador?.nombres_completos || 'Sin entrenador'}</p>
          <p><strong>Tipo:</strong> {eventoSeleccionado.tipo_evento || '-'} / {eventoSeleccionado.tipo_entrenamiento || '-'}</p>
          <p><strong>Estado:</strong> {eventoSeleccionado.estado_evento || eventoSeleccionado.estado || '-'}</p>

          {eventoSeleccionado.descripcion && (
            <p><strong>Descripción:</strong> {eventoSeleccionado.descripcion}</p>
          )}

          {eventoSeleccionado.novedad && (
            <p><strong>Novedad:</strong> ⚠️ {eventoSeleccionado.novedad}</p>
          )}
        </section>
      )}
    </>
  );
}