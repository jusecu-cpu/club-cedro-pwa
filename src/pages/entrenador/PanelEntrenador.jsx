import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';
import logo from '../../assets/logo.png';
import EntrenadorDocs from './EntrenadorDocs';
import EntrenadorCarnet from './EntrenadorCarnet';
import EntrenadorEquipos from './EntrenadorEquipos';
import EntrenadorDeportistas from './EntrenadorDeportistas';
import EntrenadorAsistencia from './EntrenadorAsistencia';

export default function PanelEntrenador({
  usuario,
  perfil,
  setPantalla,
  setUsuario,
  setPerfil,
}) {
  const [menu, setMenu] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [entrenador, setEntrenador] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [deportistas, setDeportistas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [deportistasEquipo, setDeportistasEquipo] = useState([]);
  const [deportistaSeleccionado, setDeportistaSeleccionado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [deportistasAsignadosIds, setDeportistasAsignadosIds] = useState([]);
  const [mostrarCrearEquipo, setMostrarCrearEquipo] = useState(false);
  const [mostrarCrearEvento, setMostrarCrearEvento] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoCancelando, setEventoCancelando] = useState(null);
  const [eventoAsistencia, setEventoAsistencia] = useState(null);
  const [listaAsistencia, setListaAsistencia] = useState([]);
  const [asignacionesRapidas, setAsignacionesRapidas] = useState({});
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [asistenciaConsulta, setAsistenciaConsulta] = useState(null);
  const [nuevoEquipoEntrenador, setNuevoEquipoEntrenador] = useState({
    nombre: '',
    sede_id: '',
    categoria_id: '',
  });

  const [sedesEntrenador, setSedesEntrenador] = useState([]);
  const [categoriasEntrenador, setCategoriasEntrenador] = useState([]);

  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    tipo_evento: '',
    tipo_entrenamiento: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    equipo_id: '',
    sede_id: '',
    descripcion: '',
    es_repetitivo: false,
    frecuencia_repeticion: '',
    fecha_fin_repeticion: '',
  });

  useEffect(() => {
    cargarEntrenador();
  }, []);

  useEffect(() => {
    setEventoEditando(null);
    setEventoCancelando(null);
    setEventoAsistencia(null);
    setListaAsistencia([]);
  }, [menu]);

  async function cargarEntrenador() {
    setCargando(true);
  
    if (!usuario) {
      console.error('No llegó usuario al PanelEntrenador');
      setEntrenador(null);
      setCargando(false);
      return;
    }
  
    const correo =
      perfil?.correo ||
      perfil?.correo_electronico ||
      usuario?.email;
  
    if (!correo) {
      console.error('No se encontró correo para buscar entrenador', {
        usuario,
        perfil,
      });
      setEntrenador(null);
      setCargando(false);
      return;
    }
  
    console.log('Buscando entrenador con correo:', correo);
  
    const { data: entrenadorData, error: entrenadorError } = await supabase
      .from('entrenadores')
      .select('*')
      .eq('correo_electronico', correo)
      .maybeSingle();

    if (entrenadorError || !entrenadorData) {
      console.error(entrenadorError);
      setEntrenador(null);
      setCargando(false);
      return;
    }

    setEntrenador(entrenadorData);

    const [
      equiposRes,
      deportistasRes,
      eventosRes,
      sedesRes,
      categoriasRes,
      asignacionesRes,
    ] = await Promise.all([
      supabase
        .from('equipos')
        .select(`
          id,
          nombre,
          estado,
          sede_id,
          categoria_id,
          sede:sedes(nombre_corto),
          categoria:categorias(categoria)
        `)
        .eq('entrenador_id', entrenadorData.id)
        .order('nombre'),
    
      supabase
      .from('deportistas')
      .select(`
        id,
        deportista_nombre,
        deportista_documento,
        fecha_nacimiento,
        direccion_vivienda,
        sexo,
        colegio,
        eps,
        rh,
        alergias,
        contacto_emergencia,
        telefono_emergencia,
        talla_camisa,
        talla_pantalon,
        foto_url,
        estado,
        sede:sedes(nombre_corto),
        categoria:categorias(categoria),
        equipo_deportista(
          estado,
          equipo:equipos(
            id,
            nombre
          )
        )
      `)
        .eq('entrenador_id', entrenadorData.id)
        .order('deportista_nombre'),
    
      supabase
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
          equipo_id,
          sede_id,
          equipo:equipos(nombre),
          sede:sedes(nombre_corto)
        `)
        .eq('entrenador_id', entrenadorData.id)
        .order('fecha', { ascending: true }),
    
      supabase.from('sedes').select('id, nombre_corto').order('nombre_corto'),
    
      supabase
        .from('categorias')
        .select('id, categoria')
        .eq('estado', 'Activo')
        .order('categoria'),
    
      supabase
        .from('equipo_deportista')
        .select('deportista_id')
        .eq('estado', 'activo'),
    ]);

    setEquipos(equiposRes.data || []);
    setDeportistas(deportistasRes.data || []);
    setEventos(eventosRes.data || []);
    setSedesEntrenador(sedesRes.data || []);
    setCategoriasEntrenador(categoriasRes.data || []);
    setDeportistasAsignadosIds(
      (asignacionesRes.data || []).map((item) => item.deportista_id)
    );
    setCargando(false);
  }

  async function crearEventoEntrenador() {
    if (
      !nuevoEvento.titulo ||
      !nuevoEvento.tipo_evento ||
      !nuevoEvento.fecha ||
      !nuevoEvento.hora_inicio ||
      !nuevoEvento.hora_fin ||
      !nuevoEvento.equipo_id
    ) {
      alert('Completa título, tipo, fecha, horas y equipo.');
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaEvento = new Date(`${nuevoEvento.fecha}T00:00:00`);

    if (fechaEvento < hoy) {
      alert('No puedes crear eventos con fecha anterior a hoy.');
      return;
    }

    const equipoSeleccionadoEvento = equipos.find(
      (eq) => eq.id === nuevoEvento.equipo_id
    );

    const { error } = await supabase.from('agenda_eventos').insert([
      {
        titulo: nuevoEvento.titulo,
        tipo_evento: nuevoEvento.tipo_evento,
        tipo_entrenamiento: nuevoEvento.tipo_evento,
        fecha: nuevoEvento.fecha,
        hora_inicio: nuevoEvento.hora_inicio,
        hora_fin: nuevoEvento.hora_fin,
        equipo_id: nuevoEvento.equipo_id,
        entrenador_id: entrenador.id,
        sede_id: nuevoEvento.sede_id || equipoSeleccionadoEvento?.sede_id || null,
        descripcion: nuevoEvento.descripcion || null,
        es_repetitivo: nuevoEvento.es_repetitivo,
        frecuencia_repeticion: nuevoEvento.es_repetitivo
          ? nuevoEvento.frecuencia_repeticion
          : null,
        fecha_fin_repeticion: nuevoEvento.es_repetitivo
          ? nuevoEvento.fecha_fin_repeticion
          : null,
        estado: 'activo',
      },
    ]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setNuevoEvento({
      titulo: '',
      tipo_evento: '',
      tipo_entrenamiento: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      equipo_id: '',
      sede_id: '',
      descripcion: '',
      es_repetitivo: false,
      frecuencia_repeticion: '',
      fecha_fin_repeticion: '',
    });

    setMostrarCrearEvento(false);
    cargarEntrenador();
  }

  async function guardarEdicionEvento() {
    if (!eventoEditando) return;

    const { error } = await supabase
      .from('agenda_eventos')
      .update({
        titulo: eventoEditando.titulo,
        fecha: eventoEditando.fecha,
        hora_inicio: eventoEditando.hora_inicio,
        hora_fin: eventoEditando.hora_fin,
        sede_id: eventoEditando.sede_id || null,
        descripcion: eventoEditando.descripcion || null,
        estado_evento: 'modificado',
        novedad: 'El evento fue actualizado por el entrenador.',
        fecha_actualizacion: new Date().toISOString(),
        actualizado_por: usuario.id,
      })
      .eq('id', eventoEditando.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEventoEditando(null);
    cargarEntrenador();
  }

  async function confirmarCancelacionEvento() {
    if (!eventoCancelando || !motivoCancelacion) {
      alert('Escribe el motivo de cancelación.');
      return;
    }

    const { error } = await supabase
      .from('agenda_eventos')
      .update({
        estado_evento: 'cancelado',
        novedad: `Evento cancelado: ${motivoCancelacion}`,
        motivo_cancelacion: motivoCancelacion,
        fecha_actualizacion: new Date().toISOString(),
        actualizado_por: usuario.id,
      })
      .eq('id', eventoCancelando.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEventoCancelando(null);
    setMotivoCancelacion('');
    cargarEntrenador();
  }

  async function abrirAsistencia(ev) {
    setEventoAsistencia(ev);
  
    const { data, error } = await supabase
      .from('equipo_deportista')
      .select(`
        id,
        deportista:deportistas(
          id,
          deportista_nombre,
          deportista_documento,
          foto_url
        )
      `)
      .eq('equipo_id', ev.equipo_id)
      .eq('estado', 'activo');
  
    if (error) {
      console.error(error);
      alert('Error cargando deportistas');
      return;
    }
  
    setListaAsistencia(
      (data || []).map((item) => ({
        deportista_id: item.deportista?.id,
        nombre: item.deportista?.deportista_nombre || 'Sin nombre',
        documento: item.deportista?.deportista_documento || '',
        foto_url: item.deportista?.foto_url || '',
        asistio: true,
        novedad: '',
      }))
    );
  }
  
  async function guardarAsistencia() {
    if (!eventoAsistencia || listaAsistencia.length === 0) {
      alert('No hay asistencia para guardar.');
      return;
    }
  
    const sinNovedad = listaAsistencia.filter(
      (item) => item.asistio === false && !item.novedad.trim()
    );
  
    if (sinNovedad.length > 0) {
      alert('Debes escribir novedad para las deportistas ausentes.');
      return;
    }
  
    const payload = listaAsistencia.map((item) => ({
      evento_id: eventoAsistencia.id,
      deportista_id: item.deportista_id,
      estado_asistencia: item.asistio ? 'asistio' : 'no_asistio',
      novedad: item.asistio ? null : item.novedad,
      registrado_por: usuario.id,
      fecha_registro: new Date().toISOString(),
    }));
  
    const { error } = await supabase
      .from('asistencia_eventos')
      .upsert(payload, {
        onConflict: 'evento_id,deportista_id',
      });
  
    if (error) {
      console.error(error);
      alert(error.message || 'No se pudo guardar la asistencia.');
      return;
    }
  
    alert('Asistencia guardada correctamente.');
    setEventoAsistencia(null);
    setListaAsistencia([]);
  }
  
  async function crearEquipoEntrenador() {
    if (
      !nuevoEquipoEntrenador.nombre ||
      !nuevoEquipoEntrenador.sede_id ||
      !nuevoEquipoEntrenador.categoria_id
    ) {
      alert('Completa nombre, sede y categoría.');
      return;
    }

    const { error } = await supabase.from('equipos').insert([
      {
        nombre: nuevoEquipoEntrenador.nombre,
        sede_id: nuevoEquipoEntrenador.sede_id,
        categoria_id: nuevoEquipoEntrenador.categoria_id,
        entrenador_id: entrenador.id,
        estado: 'activo',
      },
    ]);

    if (error) {
      console.error(error);
      alert('No se pudo crear el equipo.');
      return;
    }

    setNuevoEquipoEntrenador({
      nombre: '',
      sede_id: '',
      categoria_id: '',
    });

    setMostrarCrearEquipo(false);
    cargarEntrenador();
  }

  async function cargarEquipoDetalle(equipo) {
    setEquipoSeleccionado(equipo);

    const { data, error } = await supabase
      .from('equipo_deportista')
      .select(
        `
        id,
        estado,
        deportista:deportistas (
          id,
          deportista_nombre,
          deportista_documento,
          foto_url,
          categoria:categorias(categoria)
        )
      `
      )
      .eq('equipo_id', equipo.id)
      .eq('estado', 'activo');

    if (error) {
      console.error(error);
      alert('No se pudieron cargar los deportistas del equipo.');
      return;
    }

    setDeportistasEquipo(data || []);
  }

  async function asignarDeportistaAEquipo() {
    if (!equipoSeleccionado || !deportistaSeleccionado) {
      alert('Selecciona un deportista.');
      return;
    }
  
    // 1. Validar si ya está activo en cualquier equipo
    const { data: asignacionActiva, error: errorConsulta } = await supabase
      .from('equipo_deportista')
      .select('*')
      .eq('deportista_id', deportistaSeleccionado)
      .eq('estado', 'activo')
      .maybeSingle();
  
    if (errorConsulta) {
      console.error(errorConsulta);
      alert('No se pudo validar la asignación.');
      return;
    }
  
    if (asignacionActiva) {
      alert('Este deportista ya está asignado a un equipo activo.');
      return;
    }
  
    // 2. Revisar si ya existe relación inactiva con este equipo
    const { data: relacionExistente } = await supabase
      .from('equipo_deportista')
      .select('*')
      .eq('equipo_id', equipoSeleccionado.id)
      .eq('deportista_id', deportistaSeleccionado)
      .maybeSingle();
  
    if (relacionExistente) {
      const { error } = await supabase
        .from('equipo_deportista')
        .update({ estado: 'activo' })
        .eq('id', relacionExistente.id);
  
      if (error) {
        console.error(error);
        alert('No se pudo reactivar el deportista en el equipo.');
        return;
      }
    } else {
      const { error } = await supabase.from('equipo_deportista').insert([
        {
          equipo_id: equipoSeleccionado.id,
          deportista_id: deportistaSeleccionado,
          estado: 'activo',
        },
      ]);
  
      if (error) {
        console.error(error);
        alert(error.message || 'No se pudo asignar.');
        return;
      }
    }
  
    setDeportistaSeleccionado('');
    cargarEquipoDetalle(equipoSeleccionado);
    cargarEntrenador();
  }

  async function quitarDeportista(relacionId) {
    const { error } = await supabase
      .from('equipo_deportista')
      .update({ estado: 'inactivo' })
      .eq('id', relacionId);

    if (error) {
      console.error(error);
      alert('No se pudo retirar del equipo.');
      return;
    }

    cargarEquipoDetalle(equipoSeleccionado);
  }

  async function asignarRapidoAEquipo(deportistaId) {
    const equipoId = asignacionesRapidas[deportistaId];
  
    if (!equipoId) {
      alert('Selecciona un equipo.');
      return;
    }
  
    const { data: relacionExistente } = await supabase
      .from('equipo_deportista')
      .select('*')
      .eq('equipo_id', equipoId)
      .eq('deportista_id', deportistaId)
      .maybeSingle();
  
    if (relacionExistente) {
      const { error } = await supabase
        .from('equipo_deportista')
        .update({ estado: 'activo' })
        .eq('id', relacionExistente.id);
  
      if (error) {
        console.error(error);
        alert('No se pudo reactivar la deportista.');
        return;
      }
    } else {
      const { error } = await supabase.from('equipo_deportista').insert([
        {
          equipo_id: equipoId,
          deportista_id: deportistaId,
          estado: 'activo',
        },
      ]);
  
      if (error) {
        console.error(error);
        alert(error.message || 'No se pudo asignar.');
        return;
      }
    }
  
    alert('Deportista asignada correctamente.');
  
    setAsignacionesRapidas({
      ...asignacionesRapidas,
      [deportistaId]: '',
    });
  
    cargarEntrenador();
  }

  async function cerrarEvento(eventoId) {

    const { data: asistencias } = await supabase
      .from('asistencia_eventos')
      .select('id')
      .eq('evento_id', eventoId);
  
    if (!asistencias?.length) {
      alert(
        'Primero debes registrar la asistencia antes de cerrar el evento.'
      );
      return;
    }
  
    const confirmar = confirm(
      '¿Deseas cerrar este evento?'
    );
  
    if (!confirmar) return;
  
    const { error } = await supabase
      .from('agenda_eventos')
      .update({
        estado_evento: 'cumplido',
      })
      .eq('id', eventoId);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await cargarEntrenador();
  
    alert('Evento cerrado correctamente.');
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUsuario(null);
    setPerfil(null);
    setPantalla('login');
  }

  const deportistasSinEquipo = deportistas.filter(
    (dep) => !deportistasAsignadosIds.includes(dep.id)
  );
  
  
  const eventosProximos = eventos
  .filter((ev) => ev.estado_evento !== 'cumplido' && ev.estado_evento !== 'cancelado')
  .sort(
    (a, b) =>
      new Date(`${a.fecha}T${a.hora_inicio || '00:00'}`) -
      new Date(`${b.fecha}T${b.hora_inicio || '00:00'}`)
  );

  const eventosCumplidos = eventos
  .filter((ev) => ev.estado_evento === 'cumplido')
  .sort(
    (a, b) =>
      new Date(`${b.fecha}T${b.hora_inicio || '00:00'}`) -
      new Date(`${a.fecha}T${a.hora_inicio || '00:00'}`)
  );


  if (!usuario) {
    return (
      <main style={styles.adminPage}>
        <section style={styles.adminPanel}>
          <h2>No hay sesión activa</h2>
          <button style={styles.botonSecundario} onClick={cerrarSesion}>
            Volver al login
          </button>
        </section>
      </main>
    );
  }
  
  if (cargando) {
    return (
      <main style={styles.adminPage}>
        <header style={styles.adminTopbar}>
          <img src={logo} alt="Club Cedro" style={styles.logoTopbar} />
        </header>

        <section style={styles.adminPanel}>
          <p>Cargando información del entrenador...</p>
        </section>
      </main>
    );
  }

  if (!entrenador) {
    return (
      <main style={styles.adminPage}>
        <header style={styles.adminTopbar}>
          <img src={logo} alt="Club Cedro" style={styles.logoTopbar} />
        </header>

        <section style={styles.adminPanel}>
          <h2>No encontramos tu perfil de entrenador</h2>
          <p>
            Valida que tu correo de acceso coincida con el correo registrado en
            entrenadores.
          </p>
          <button style={styles.botonSecundario} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </section>
      </main>
    );
  }

  if (equipoSeleccionado) {
    return (
      <main style={styles.adminPage}>
        <header style={styles.adminTopbar}>
          <button
            style={styles.menuHamburguesa}
            onClick={() => setEquipoSeleccionado(null)}
          >
            ←
          </button>

          <img src={logo} alt="Club Cedro" style={styles.logoTopbar} />

          <div style={styles.adminAvatar}>E</div>
        </header>

        <section style={styles.adminBody}>
          <h1 style={styles.adminTitle}>{equipoSeleccionado.nombre}</h1>

          <section style={styles.adminPanel}>
            <h2>Agregar deportista</h2>

            <select
              style={styles.input}
              value={deportistaSeleccionado}
              onChange={(e) => setDeportistaSeleccionado(e.target.value)}
            >
              <option value="">Selecciona deportista</option>

              {deportistasSinEquipo.map((dep) => (                <option key={dep.id} value={dep.id}>
                  {dep.deportista_nombre} - {dep.deportista_documento}
                </option>
              ))}
            </select>

            <button style={styles.boton} onClick={asignarDeportistaAEquipo}>
              Agregar al equipo
            </button>
          </section>

          <section style={styles.adminPanel}>
            <h2>Deportistas asignados</h2>

            {deportistasEquipo.length === 0 && (
              <p>No hay deportistas asignados.</p>
            )}

{deportistasEquipo.map((item) => (
  <div key={item.id} style={styles.adminListItem}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {item.deportista?.foto_url ? (
        <img
          src={item.deportista.foto_url}
          alt={item.deportista.deportista_nombre}
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#072c8f',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          {item.deportista?.deportista_nombre?.charAt(0) || 'D'}
        </div>
      )}

      <div>
        <strong>{item.deportista?.deportista_nombre}</strong>
        <p>{item.deportista?.categoria?.categoria || 'Sin categoría'}</p>
        <small>Documento: {item.deportista?.deportista_documento}</small>
      </div>
    </div>

    <button
      style={styles.adminSmallBtnDanger}
      onClick={() => quitarDeportista(item.id)}
    >
      Retirar
    </button>
  </div>
))}
          </section>
        </section>
      </main>
    );
    
  }

  if (eventoAsistencia) {
    return (
      <EntrenadorAsistencia
        evento={eventoAsistencia}
        listaAsistencia={listaAsistencia}
        setListaAsistencia={setListaAsistencia}
        guardarAsistencia={guardarAsistencia}
        volver={() => {
          setEventoAsistencia(null);
          setListaAsistencia([]);
        }}
      />
    );
  }


  return (
    <main style={styles.adminPage}>
      <header style={styles.adminTopbar}>
        <button
          style={styles.menuHamburguesa}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <img src={logo} alt="Club Cedro" style={styles.logoTopbar} />

        <div style={styles.adminAvatar}>E</div>
      </header>

      {menuAbierto && (
        <div
          style={styles.adminOverlay}
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {menuAbierto && (
        <aside style={styles.sidebarFloating}>
          <button
            style={menu === 'dashboard' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => {
              setMenu('dashboard');
              setMenuAbierto(false);
            }}
          >
            📊 Dashboard
          </button>

          <button
            style={menu === 'equipos' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => {
              setMenu('equipos');
              setMenuAbierto(false);
            }}
          >
            🏐 Mis equipos
          </button>

          <button
            style={
              menu === 'deportistas' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
            onClick={() => {
              setMenu('deportistas');
              setMenuAbierto(false);
            }}
          >
            👤 Mis deportistas
          </button>

          <button
            style={menu === 'agenda' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => {
              setMenu('agenda');
              setMenuAbierto(false);
            }}
          >
            🗓️ Agenda
          </button>

          <button
            style={menu === 'carnet' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => {
              setMenu('carnet');
              setMenuAbierto(false);
            }}
            
          >
            🪪 Carnet
          </button>

          <button
            style={menu === 'docs' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => {
              setMenu('docs');
              setMenuAbierto(false);
            }}
          >
            📄 Docs
          </button>

          <button style={styles.sidebarLogout} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </aside>
      )}

      <section style={styles.adminBody}>
        {menu === 'dashboard' && (
          <>
            <h1 style={styles.adminTitle}>Entrenador</h1>

            <section
          style={{
            background: '#072c8f',
            borderRadius: 28,
            padding: 28,
            color: '#fff',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          {entrenador.foto_url ? (
            <img
              src={entrenador.foto_url}
              alt="Entrenador"
              style={{
                width: 95,
                height: 95,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid rgba(255,255,255,0.2)',
                marginBottom: 16,
              }}
            />
          ) : (
            <div
              style={{
                width: 95,
                height: 95,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 16px',
              }}
            >
              👤
            </div>
          )}

          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {entrenador.nombres_completos}
          </h2>

          <p
            style={{
              marginTop: 8,
              marginBottom: 6,
              color: 'rgba(255,255,255,0.85)',
              fontSize: 15,
            }}
          >
            {entrenador.correo_electronico}
          </p>

          <small
            style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 12px',
              borderRadius: 30,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Estado: {entrenador.estado}
          </small>
</section>

            <section style={styles.adminCardsGrid}>
              <button
                style={styles.adminCardButton}
                onClick={() => setMenu('equipos')}
              >
                <p>Equipos</p>
                <h2>{equipos.length}</h2>
              </button>

              <button
                style={styles.adminCardButton}
                onClick={() => setMenu('deportistas')}
              >
                <p>Deportistas</p>
                <h2>{deportistas.length}</h2>
              </button>

              <button
                style={styles.adminCardButton}
                onClick={() => setMenu('agenda')}
              >
                <p>Eventos</p>
                <h2>{eventos.length}</h2>
              </button>
                        
              <button
              style={styles.adminCardButton}
              onClick={() => setMenu('docs')}
            >
              <p>Docs</p>
              <h2>3</h2>
            </button>


              <button
                style={styles.adminCardButton}
                onClick={() => setMenu('sinEquipo')}
              >
                <p>Sin equipo</p>
                <h2>{deportistasSinEquipo.length}</h2>
              </button>
            </section>
          </>
        )}

{menu === 'sinEquipo' && (
  <>
    <h1 style={styles.adminTitle}>Sin equipo</h1>

    <section style={styles.adminPanel}>
      {deportistasSinEquipo.length === 0 && (
        <p>Todos los deportistas tienen equipo asignado.</p>
      )}

      {deportistasSinEquipo.map((dep) => (
        <div
          key={dep.id}
          style={{
            ...styles.adminListItem,
            display: 'block',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            {dep.foto_url ? (
              <img
                src={dep.foto_url}
                alt={dep.deportista_nombre}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#072c8f',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {dep.deportista_nombre?.charAt(0) || 'D'}
              </div>
            )}

            <div>
              <strong>{dep.deportista_nombre}</strong>
              <p>
                {dep.categoria?.categoria || 'Sin categoría'} ·{' '}
                {dep.sede?.nombre_corto || 'Sin sede'}
              </p>
              <small>Documento: {dep.deportista_documento}</small>
            </div>
          </div>

          <select
            style={styles.input}
            value={asignacionesRapidas[dep.id] || ''}
            onChange={(e) =>
              setAsignacionesRapidas({
                ...asignacionesRapidas,
                [dep.id]: e.target.value,
              })
            }
          >
            <option value="">Selecciona equipo</option>

            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.nombre}
              </option>
            ))}
          </select>

          <button
            style={styles.boton}
            onClick={() => asignarRapidoAEquipo(dep.id)}
          >
            Asignar a equipo
          </button>
        </div>
      ))}
    </section>
  </>
)}

        {menu === 'equipos' && (
          <EntrenadorEquipos
            equipos={equipos}
            mostrarCrearEquipo={mostrarCrearEquipo}
            setMostrarCrearEquipo={setMostrarCrearEquipo}
            nuevoEquipoEntrenador={nuevoEquipoEntrenador}
            setNuevoEquipoEntrenador={setNuevoEquipoEntrenador}
            sedesEntrenador={sedesEntrenador}
            categoriasEntrenador={categoriasEntrenador}
            crearEquipoEntrenador={crearEquipoEntrenador}
            cargarEquipoDetalle={cargarEquipoDetalle}
          />
        )}
        {menu === 'deportistas' && (
        <EntrenadorDeportistas
          deportistas={deportistas}
          recargar={cargarEntrenador}
        />
      )}

        
        {menu === 'agenda' && (
          <>
            <div style={styles.adminHeaderInline}>
              <h1 style={styles.adminTitle}>Agenda</h1>

              <button
                style={styles.adminPlusBtn}
                onClick={() => setMostrarCrearEvento(!mostrarCrearEvento)}
              >
                {mostrarCrearEvento ? '×' : '+'}
              </button>
            </div>

            {mostrarCrearEvento && (
              <section style={styles.adminPanel}>
                <h2>Crear evento</h2>

                <input
                  style={styles.input}
                  placeholder="Título evento"
                  value={nuevoEvento.titulo}
                  onChange={(e) =>
                    setNuevoEvento({
                      ...nuevoEvento,
                      titulo: e.target.value,
                    })
                  }
                />

                <select
                  style={styles.input}
                  value={nuevoEvento.tipo_evento}
                  onChange={(e) =>
                    setNuevoEvento({
                      ...nuevoEvento,
                      tipo_evento: e.target.value,
                    })
                  }
                >
                  <option value="">Tipo evento</option>
                  <option value="Entrenamiento">Entrenamiento</option>
                  <option value="Partido">Partido</option>
                  <option value="Torneo">Torneo</option>
                  <option value="Reunión">Reunión</option>
                </select>

                <select
                  style={styles.input}
                  value={nuevoEvento.equipo_id}
                  onChange={(e) =>
                    setNuevoEvento({
                      ...nuevoEvento,
                      equipo_id: e.target.value,
                    })
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
                    setNuevoEvento({
                      ...nuevoEvento,
                      sede_id: e.target.value,
                    })
                  }
                >
                  <option value="">Selecciona sede</option>

                  {sedesEntrenador.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre_corto}
                    </option>
                  ))}
                </select>

                <textarea
                  style={styles.input}
                  placeholder="Descripción"
                  value={nuevoEvento.descripcion}
                  onChange={(e) =>
                    setNuevoEvento({
                      ...nuevoEvento,
                      descripcion: e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  style={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                  value={nuevoEvento.fecha}
                  onChange={(e) =>
                    setNuevoEvento({
                      ...nuevoEvento,
                      fecha: e.target.value,
                    })
                  }
                />

                <div style={styles.adminGrid2}>
                  <input
                    type="time"
                    style={styles.input}
                    value={nuevoEvento.hora_inicio}
                    onChange={(e) =>
                      setNuevoEvento({
                        ...nuevoEvento,
                        hora_inicio: e.target.value,
                      })
                    }
                  />

                  <input
                    type="time"
                    style={styles.input}
                    value={nuevoEvento.hora_fin}
                    onChange={(e) =>
                      setNuevoEvento({
                        ...nuevoEvento,
                        hora_fin: e.target.value,
                      })
                    }
                  />
                </div>

                <button style={styles.boton} onClick={crearEventoEntrenador}>
                  Crear evento
                </button>
              </section>
            )}

        <section style={styles.adminPanel}>
          {eventos.length === 0 && <p>No tienes eventos programados.</p>}

          <h2>Próximos eventos</h2>

          {eventosProximos.length === 0 && <p>No tienes próximos eventos.</p>}

          {eventosProximos.map((ev) => (
           <EventoEntrenadorCard
           ev={ev}
           abrirAsistencia={abrirAsistencia}
           cerrarEvento={cerrarEvento}
           setEventoEditando={setEventoEditando}
           setEventoCancelando={setEventoCancelando}
           setMotivoCancelacion={setMotivoCancelacion}
         />

          ))}

          <h2 style={{ marginTop: 30 }}>Eventos cumplidos</h2>

          {eventosCumplidos.length === 0 && <p>No hay eventos cumplidos.</p>}

          {eventosCumplidos.map((ev) => (
            <EventoEntrenadorCard
              key={ev.id}
              ev={ev}
              abrirAsistencia={abrirAsistencia}
              setEventoEditando={setEventoEditando}
              setEventoCancelando={setEventoCancelando}
              setMotivoCancelacion={setMotivoCancelacion}
              cumplido
            />
          ))}
        </section>
           </>
                )}

  {menu === 'docs' && <EntrenadorDocs deportistas={deportistas} />} 
  {menu === 'carnet' && (
            <EntrenadorCarnet
              entrenador={entrenador}
              recargar={cargarEntrenador}
            />
          )}

                
                {eventoEditando && (
                  <section style={styles.modalInterno}>
                    <h2>Editar evento</h2>

                    <input
                      style={styles.input}
                      value={eventoEditando.titulo}
                      onChange={(e) =>
                        setEventoEditando({
                          ...eventoEditando,
                          titulo: e.target.value,
                        })
                      }
                      placeholder="Título"
                    />

                    <input
                      type="date"
                      style={styles.input}
                      value={eventoEditando.fecha}
                      onChange={(e) =>
                        setEventoEditando({
                          ...eventoEditando,
                          fecha: e.target.value,
                        })
                      }
                    />

                    <input
                      type="time"
                      style={styles.input}
                      value={eventoEditando.hora_inicio}
                      onChange={(e) =>
                        setEventoEditando({
                          ...eventoEditando,
                          hora_inicio: e.target.value,
                        })
                      }
                    />

                    <input
                      type="time"
                      style={styles.input}
                      value={eventoEditando.hora_fin}
                      onChange={(e) =>
                        setEventoEditando({
                          ...eventoEditando,
                          hora_fin: e.target.value,
                        })
                      }
                    />

                    <textarea
                      style={styles.input}
                      value={eventoEditando.descripcion || ''}
                      onChange={(e) =>
                        setEventoEditando({
                          ...eventoEditando,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Descripción / cancha / novedad"
                    />

                    <button style={styles.boton} onClick={guardarEdicionEvento}>
                      Guardar cambios
                    </button>

                    <button
                      style={styles.botonCancelarFull}
                      onClick={() => setEventoEditando(null)}
                    >
                      Cerrar
                    </button>
          </section>
        )}

        {eventoCancelando && (
          <section style={styles.modalInterno}>
            <h2>Cancelar evento</h2>

            <p>{eventoCancelando.titulo}</p>

            <textarea
              style={styles.input}
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              placeholder="Motivo de cancelación"
            />

            <button
              style={styles.botonCancelarFull}
              onClick={confirmarCancelacionEvento}
            >
              Confirmar cancelación
            </button>

            <button
              style={styles.boton}
              onClick={() => setEventoCancelando(null)}
            >
              Volver
            </button>
            </section>
            )}

            </section>
          </main>
        );
      }
        

      function EventoEntrenadorCard({
        ev,
        abrirAsistencia,
        cerrarEvento,
        setEventoEditando,
        setEventoCancelando,
        setMotivoCancelacion,
        cumplido = false,
      })

{
  return (
    <div key={ev.id} style={styles.agendaCard}>
      <div style={styles.agendaFecha}>
        <strong style={{ fontSize: '22px' }}>
        {new Date(ev.fecha).getDate()}
        </strong>

        <span>
        {new Date(`${ev.fecha}T12:00:00`).toLocaleDateString('es-CO', {
  month: 'short',
})}
        </span>
      </div>

      <div style={styles.agendaContenido}>
        <small style={styles.agendaTipo}>
          {cumplido ? 'Cumplido' : ev.tipo_evento}
        </small>

        <h3>{ev.titulo}</h3>
        <p>{ev.equipo?.nombre || 'Sin equipo'}</p>
        <small>{ev.hora_inicio} - {ev.hora_fin}</small>
      </div>

      {!cumplido && (
        <div style={styles.eventoAcciones}>
          <button
            style={styles.botonMini}
            onClick={() => abrirAsistencia(ev)}
          >
            Asistencia
          </button>

          {!cumplido && (
          <button
            style={{
              width: '100%',
              marginTop: 8,
              padding: 12,
              border: 'none',
              borderRadius: 12,
              background: '#16a34a',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => cerrarEvento(ev.id)}
          >
            ✅ Cerrar evento
          </button>
        )}

          <button
            style={styles.botonMini}
            onClick={() => setEventoEditando(ev)}
          >
            Editar
          </button>

          <button
            style={styles.botonMiniDanger}
            onClick={() => {
              setEventoCancelando(ev);
              setMotivoCancelacion('');
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}