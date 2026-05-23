import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { styles } from './styles/styles';
import CrearPassword from './pages/CrearPassword';
import './App.css';
import PanelEntrenador from './pages/entrenador/PanelEntrenador';
import AdminAgenda from './pages/admin/AdminAgenda';
import AdminEquipos from './pages/admin/AdminEquipos';
import ActivarCuenta from './pages/ActivarCuenta';
import logo from './assets/logo.png';

const paises = [
  'Colombia',
  'Ecuador',
  'México',
  'Perú',
  'Argentina',
  'Chile',
  'España',
  'Estados Unidos',
  'Venezuela',
  'Otro',
];

const linksPago = [
  {
    concepto: 'Inscripción',
    descripcion: 'Pago único de inscripción deportiva',
    valor: '',
    url: 'https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=1984&searchedAgreementName=CLUB%20CEDRO%20INSCRIPCIONES%20DEPORTIVAS',
  },
  {
    concepto: 'Pago uniformes',
    descripcion: 'Pago de uniformes oficiales del club',
    valor: '',
    url: 'https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=1984&searchedAgreementName=CLUB%20CEDRO%20UNIFORMES',
  },
  {
    concepto: 'Mensualidad Bogotá',
    descripcion: 'Mensualidad sede Bogotá Capital',
    valor: '',
    url: 'https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=1984&searchedAgreementName=CEDRO%20BOGOTA%20CAPITAL%20MENSUALIDADES',
  },
  {
    concepto: 'Mensualidad Sabana / Chía',
    descripcion: 'Mensualidad sede Sabana Chía',
    valor: '',
    url: 'https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=1986&searchedAgreementName=CEDRO%20SABANA%20CHIA%20MENSUALIDADES',
  },
];

function App() {
  const [pantalla, setPantalla] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);

  return (
    <div style={styles.app}>
      <div style={pantalla === 'admin' ? styles.adminShell : styles.telefono}>
        {pantalla === 'login' && (
          <Login
            setPantalla={setPantalla}
            setUsuario={setUsuario}
            setPerfil={setPerfil}
          />
        )}

        {pantalla === 'activar' && (
         <ActivarCuenta
        setPantalla={setPantalla}
         />
        )}

        {pantalla === 'crear-password' && (
          <CrearPassword
       setPantalla={setPantalla}
       setUsuario={setUsuario}
       setPerfil={setPerfil}
       />
        )}

        {pantalla === 'registro' && (
          <RegistroInscripcion setPantalla={setPantalla} />
        )}

        {pantalla === 'ok' && <SolicitudEnviada setPantalla={setPantalla} />}

        {pantalla === 'admin' && (
          <PanelAdmin
            setPantalla={setPantalla}
            setUsuario={setUsuario}
            setPerfil={setPerfil}
          />
        )}

        {pantalla === 'padre' && (
          <PanelPadre
            usuario={usuario}
            perfil={perfil}
            setPantalla={setPantalla}
            setUsuario={setUsuario}
            setPerfil={setPerfil}
          />
        )}
        {pantalla === 'entrenador' && (
          <PanelEntrenador
            usuario={usuario}
            perfil={perfil}
            setPantalla={setPantalla}
            setUsuario={setUsuario}
            setPerfil={setPerfil}
            />
          )}
          
      </div>
    </div>
  );
}

function Login({ setPantalla, setUsuario, setPerfil }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [perfilIngreso, setPerfilIngreso] = useState('padre');
  const [loading, setLoading] = useState(false);

  async function iniciarSesion() {
    if (!correo || !password) {
      alert('Completa correo y contraseña');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    if (perfilError || !perfilData) {
      alert('Usuario válido, pero no tiene perfil asignado.');
      return;
    }

    if (perfilData.rol !== perfilIngreso) {
      alert(
        `Este usuario está registrado como ${perfilData.rol}, no como ${perfilIngreso}.`
      );
      return;
    }

    setUsuario(data.user);
    setPerfil(perfilData);

    if (perfilData.rol === 'admin') setPantalla('admin');
    if (perfilData.rol === 'padre') setPantalla('padre');
    if (perfilData.rol === 'entrenador') setPantalla('entrenador');
  }

  async function recuperarPassword() {
    if (!correo) {
      alert('Escribe primero tu correo electrónico.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: window.location.origin,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('Te enviamos un correo para crear o recuperar tu contraseña.');
  }

  return (
    <main style={styles.loginContainer}>
      <img src={logo} alt="Club Cedro" style={styles.loginLogo} />

      <h1 style={styles.loginTitulo}>Bienvenidos</h1>
      <p style={styles.loginSubtitulo}>Ingresa tus datos para continuar</p>

      <section style={styles.roleBox}>
        <p style={styles.roleTitle}>Ingresar como</p>

        <div style={styles.roleButtons}>
          <button
            style={
              perfilIngreso === 'padre' ? styles.roleBtnActivo : styles.roleBtn
            }
            onClick={() => setPerfilIngreso('padre')}
          >
            Padre / Acudiente
          </button>

          <button
            style={
              perfilIngreso === 'entrenador'
                ? styles.roleBtnActivo
                : styles.roleBtn
            }
            onClick={() => setPerfilIngreso('entrenador')}
          >
            Entrenador
          </button>

          <button
            style={
              perfilIngreso === 'admin' ? styles.roleBtnActivo : styles.roleBtn
            }
            onClick={() => setPerfilIngreso('admin')}
          >
            Admin
          </button>
        </div>
      </section>

      <section style={styles.loginBox}>
        <label style={styles.loginLabel}>E-mail</label>
        <input
          type="email"
          placeholder="Tu correo electrónico"
          style={styles.loginInput}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label style={styles.loginLabel}>Contraseña</label>
        <input
          type="password"
          placeholder="Tu contraseña"
          style={styles.loginInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.loginButton} onClick={iniciarSesion}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </section>

      <button style={styles.forgotButton} onClick={recuperarPassword}>
        ¿Olvidaste o quieres crear tu contraseña?
      </button>

      <button
        style={styles.createAccountButton}
        onClick={() => setPantalla('activar')}
      >
        Activar cuenta / Inscribir deportista
      </button>
    </main>
  );
}

function RegistroInscripcion({ setPantalla }) {
  const [sedes, setSedes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    acudiente_nombre: '',
    acudiente_documento: '',
    acudiente_correo: '',
    acudiente_celular: '',
    acudiente_parentesco: '',
    deportista_nombre: '',
    deportista_documento: '',
    pais: '',
    fecha_nacimiento: '',
    direccion_vivienda: '',
    sexo: '',
    colegio: '',
    sede_id: '',
    entrenador_id: '',
    eps: '',
    rh: '',
    alergias: '',
    observaciones_medicas: '',
  });

  const [aceptaciones, setAceptaciones] = useState({
    datosMenor: false,
    politicas: false,
    terminos: false,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const { data: sedesData } = await supabase
      .from('sedes')
      .select('*')
      .order('nombre_corto', { ascending: true });

    setSedes(sedesData || []);

    const { data: entrenadoresData } = await supabase
      .from('entrenadores')
      .select('id, nombres_completos')
      .order('nombres_completos', { ascending: true });

    setEntrenadores(entrenadoresData || []);

    const { data: categoriasData } = await supabase
      .from('categorias')
      .select('id, categoria, anio_inicial, anio_final')
      .eq('estado', 'Activo');

    setCategorias(categoriasData || []);
  }

  function actualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  const categoriaCalculada = (() => {
    if (!form.fecha_nacimiento) return null;

    const anioNacimiento = new Date(form.fecha_nacimiento).getFullYear();

    return categorias.find((cat) => {
      const menor = Math.min(cat.anio_inicial, cat.anio_final);
      const mayor = Math.max(cat.anio_inicial, cat.anio_final);
      return anioNacimiento >= menor && anioNacimiento <= mayor;
    });
  })();

  const puedeEnviar =
    form.acudiente_nombre &&
    form.acudiente_documento &&
    form.acudiente_correo &&
    form.acudiente_celular &&
    form.acudiente_parentesco &&
    form.deportista_nombre &&
    form.deportista_documento &&
    form.pais &&
    form.fecha_nacimiento &&
    form.direccion_vivienda &&
    form.sexo &&
    form.sede_id &&
    aceptaciones.datosMenor &&
    aceptaciones.politicas &&
    aceptaciones.terminos;

  async function enviarSolicitud() {
    if (!puedeEnviar) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    setGuardando(true);

    const payload = {
      ...form,
      categoria_id: categoriaCalculada?.id || null,
      acepta_tratamiento_datos: aceptaciones.politicas,
      acepta_menor_edad: aceptaciones.datosMenor,
      acepta_terminos: aceptaciones.terminos,
      estado: 'Pendiente',
    };

    const { error } = await supabase
      .from('solicitudes_inscripcion')
      .insert([payload]);

    setGuardando(false);

    if (error) {
      console.error(error);
      alert('Error guardando solicitud.');
      return;
    }

    setPantalla('ok');
  }

  return (
    <main style={styles.registroContainer}>
      <button style={styles.volverBtn} onClick={() => setPantalla('login')}>
        ← Volver
      </button>

      <img src={logo} alt="Club Cedro" style={styles.logo} />

      <h1 style={styles.titulo}>Inscripción Deportiva</h1>
      <p style={styles.subtitulo}>Completa la información del deportista</p>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Datos del acudiente</h2>

        <Input
          label="Nombre completo *"
          value={form.acudiente_nombre}
          onChange={(v) => actualizar('acudiente_nombre', v)}
        />
        <Input
          label="Documento *"
          value={form.acudiente_documento}
          onChange={(v) => actualizar('acudiente_documento', v)}
        />
        <Input
          label="Correo electrónico *"
          value={form.acudiente_correo}
          onChange={(v) => actualizar('acudiente_correo', v)}
        />
        <Input
          label="Celular *"
          value={form.acudiente_celular}
          onChange={(v) => actualizar('acudiente_celular', v)}
        />

        <SelectSimple
          label="Parentesco *"
          value={form.acudiente_parentesco}
          onChange={(v) => actualizar('acudiente_parentesco', v)}
          options={['Madre', 'Padre', 'Tutor', 'Acudiente', 'Otro']}
        />

        <h2 style={styles.sectionTitle}>Datos del deportista</h2>

        <Input
          label="Nombre completo *"
          value={form.deportista_nombre}
          onChange={(v) => actualizar('deportista_nombre', v)}
        />
        <Input
          label="Documento *"
          value={form.deportista_documento}
          onChange={(v) => actualizar('deportista_documento', v)}
        />

        <SelectSimple
          label="País *"
          value={form.pais}
          onChange={(v) => actualizar('pais', v)}
          options={paises}
        />

        <Input
          label="Fecha nacimiento *"
          type="date"
          value={form.fecha_nacimiento}
          onChange={(v) => actualizar('fecha_nacimiento', v)}
        />
        <Input
          label="Dirección *"
          value={form.direccion_vivienda}
          onChange={(v) => actualizar('direccion_vivienda', v)}
        />

        <SelectSimple
          label="Sexo *"
          value={form.sexo}
          onChange={(v) => actualizar('sexo', v)}
          options={['Masculino', 'Femenino']}
        />

        <Input
          label="Colegio"
          value={form.colegio}
          onChange={(v) => actualizar('colegio', v)}
        />
        <Input
          label="Categoría automática"
          value={categoriaCalculada?.categoria || ''}
          readOnly
        />

        <label style={styles.formLabel}>
          <span>Sede *</span>
          <select
            style={styles.input}
            value={form.sede_id}
            onChange={(e) => actualizar('sede_id', e.target.value)}
          >
            <option value="">Selecciona una sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre_corto}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.formLabel}>
          <span>Entrenador</span>
          <select
            style={styles.input}
            value={form.entrenador_id}
            onChange={(e) => actualizar('entrenador_id', e.target.value)}
          >
            <option value="">Selecciona un entrenador</option>
            {entrenadores.map((entrenador) => (
              <option key={entrenador.id} value={entrenador.id}>
                {entrenador.nombres_completos}
              </option>
            ))}
          </select>
        </label>

        <h2 style={styles.sectionTitle}>Información médica</h2>

        <Input
          label="EPS"
          value={form.eps}
          onChange={(v) => actualizar('eps', v)}
        />
        <Input
          label="RH"
          value={form.rh}
          onChange={(v) => actualizar('rh', v)}
        />
        <Input
          label="Alergias"
          value={form.alergias}
          onChange={(v) => actualizar('alergias', v)}
        />
        <Input
          label="Observaciones médicas"
          value={form.observaciones_medicas}
          onChange={(v) => actualizar('observaciones_medicas', v)}
        />

        <h2 style={styles.sectionTitle}>Aceptaciones</h2>

        <CheckLegal
          checked={aceptaciones.datosMenor}
          onChange={() =>
            setAceptaciones({
              ...aceptaciones,
              datosMenor: !aceptaciones.datosMenor,
            })
          }
          texto="Autorizo tratamiento de datos del menor."
        />
        <CheckLegal
          checked={aceptaciones.politicas}
          onChange={() =>
            setAceptaciones({
              ...aceptaciones,
              politicas: !aceptaciones.politicas,
            })
          }
          texto="Acepto políticas de datos."
        />
        <CheckLegal
          checked={aceptaciones.terminos}
          onChange={() =>
            setAceptaciones({
              ...aceptaciones,
              terminos: !aceptaciones.terminos,
            })
          }
          texto="Acepto términos y condiciones."
        />

        <button
          style={{
            ...styles.boton,
            opacity: puedeEnviar && !guardando ? 1 : 0.5,
          }}
          disabled={!puedeEnviar || guardando}
          onClick={enviarSolicitud}
        >
          {guardando ? 'Guardando...' : 'Enviar solicitud'}
        </button>
      </div>
    </main>
  );
}

function PanelPadre({ usuario, perfil, setPantalla, setUsuario, setPerfil }) {
  const [deportista, setDeportista] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorTexto, setErrorTexto] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [tab, setTab] = useState('inicio');

  useEffect(() => {
    cargarDeportista();
  }, []);

  async function cargarDeportista() {
    setCargando(true);
    setErrorTexto('');

    const { data, error } = await supabase
      .from('padre_deportista')
      .select(
        `
        id,
        parentesco,
        estado,
        deportista:deportistas (
          id,
          foto_url,
          acudiente_nombre,
          acudiente_documento,
          acudiente_correo,
          acudiente_celular,
          acudiente_parentesco,
          deportista_nombre,
          deportista_documento,
          pais,
          fecha_nacimiento,
          direccion_vivienda,
          sexo,
          colegio,
          eps,
          rh,
          alergias,
          observaciones_medicas,
          estado,
          sede:sedes (
            nombre_corto
          ),
          categoria:categorias (
            categoria
          ),
          entrenador:entrenadores (
            nombres_completos
          )
        )
      `
      )
      .eq('padre_id', usuario.id)
      .eq('estado', 'activo')
      .maybeSingle();

    if (error) {
      setErrorTexto(error.message);
      setDeportista(null);
    } else {
      setDeportista(data?.deportista || null);
    }

    setCargando(false);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUsuario(null);
    setPerfil(null);
    setPantalla('login');
  }

  const iniciales =
    deportista?.deportista_nombre
      ?.split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'D';

  return (
    <main style={styles.padreContainer}>
      <HeaderApp
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        cerrarSesion={cerrarSesion}
      />

      {cargando && (
        <div style={styles.card}>
          <p>Cargando deportista...</p>
        </div>
      )}

      {!cargando && errorTexto && (
        <div style={styles.card}>
          <h3>No se pudo cargar el deportista</h3>
          <p style={styles.errorText}>{errorTexto}</p>
          <button style={styles.boton} onClick={cargarDeportista}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !errorTexto && !deportista && (
        <div style={styles.card}>
          <h3>No tienes deportista asignado</h3>
          <p>
            El administrador debe aprobar la inscripción y relacionar el
            deportista con tu usuario.
          </p>
        </div>
      )}

      {!cargando && deportista && (
        <>
          {tab === 'inicio' && (
            <InicioPadre
              deportista={deportista}
              iniciales={iniciales}
              setTab={setTab}
            />
          )}

          {tab === 'deportista' && (
            <DeportistaDetalle
              deportista={deportista}
              iniciales={iniciales}
              onActualizar={(nuevo) => setDeportista(nuevo)}
            />
          )}

          {tab === 'pagos' && <PagosPadre />}
          {tab === 'eventos' && <EventosPadre deportista={deportista} />}
          {tab === 'docs' && <DocumentosPadre />}
        </>
      )}

      <BottomNav tab={tab} setTab={setTab} />
    </main>
  );
}

function HeaderApp({ menuAbierto, setMenuAbierto, cerrarSesion }) {
  return (
    <>
      <div style={styles.padreHeader}>
        <button
          style={styles.menuBtn}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <img src={logo} alt="Club Cedro" style={styles.headerLogo} />

        <button style={styles.avatarBtn}>J</button>
      </div>

      {menuAbierto && (
        <aside style={styles.menuPadre}>
          <button style={styles.sidebarLogout} onClick={cerrarSesion}>
            🚪 Cerrar sesión
          </button>
        </aside>
      )}
    </>
  );
}

function PortalTitle({ icono, titulo }) {
  return (
    <section style={styles.portalTitleCard}>
      <div style={styles.portalIcon}>{icono}</div>
      <div>
        <small>Portal</small>
        <h2 style={{ color: '#082567', margin: 0 }}>
  {titulo}
</h2>
      </div>
    </section>
  );
}

function FotoDeportista({ deportista, iniciales, size = 110 }) {
  const [errorFoto, setErrorFoto] = useState(false);
  const foto = deportista?.foto_url?.trim();

  const fotoSrc = foto
    ? `${foto}${foto.includes('?') ? '&' : '?'}v=${Date.now()}`
    : '';

  return (
    <div
      style={{
        ...styles.fotoDeportista,
        width: size,
        height: size,
        minWidth: size,
      }}
    >
      {foto && !errorFoto ? (
        <img
          src={fotoSrc}
          alt="Foto deportista"
          style={styles.fotoDeportistaImg}
          referrerPolicy="no-referrer"
          onError={() => setErrorFoto(true)}
        />
      ) : (
        <div style={styles.inicialesFoto}>{iniciales}</div>
      )}
    </div>
  );
}

function InicioPadre({ deportista, iniciales, setTab }) {
  const [eventosInicio, setEventosInicio] = useState([]);

  useEffect(() => {
    cargarEventosInicio();
  }, []);

  async function cargarEventosInicio() {
    const { data } = await supabase
      .from('equipo_deportista')
      .select(
        `
          equipo:equipos(
            nombre,
            eventos:agenda_eventos(
              id,
              titulo,
              tipo_evento,
              tipo_entrenamiento,
              fecha,
              hora_inicio,
              hora_fin,
              descripcion,
              estado,
              estado_evento,
              novedad,
              motivo_cancelacion,
              fecha_actualizacion,
              sede_id,
              sede:sedes(nombre_corto)
            )
          )
        `
      )
      .eq('deportista_id', deportista.id)
      .eq('estado', 'activo');

    const eventos = [];

    (data || []).forEach((rel) => {
      (rel.equipo?.eventos || []).forEach((ev) => {
        eventos.push({
          ...ev,
          equipo_nombre: rel.equipo.nombre,
        });
      });
    });

    setEventosInicio(
      eventos
        .filter((ev) => ev.estado !== 'cancelado')
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 2)
    );
  }
  return (
    <>
      <section style={styles.padreMainCard}>
        <FotoDeportista
          deportista={deportista}
          iniciales={iniciales}
          size={112}
        />

        <div style={styles.padreMainInfo}>
          <small style={styles.categoriaTexto}>
            {deportista?.categoria?.categoria || 'Sin categoría'}
          </small>

          <h1 style={styles.nombreDeportista}>
            {deportista.deportista_nombre}
          </h1>
          <p style={styles.accesoTexto}>Acceso: padre</p>
        </div>
      </section>

      <section style={styles.gridResumen}>
        <div style={styles.resumenCard}>
          <p>Sede</p>
          <h3>{deportista?.sede?.nombre_corto || 'Sin sede'}</h3>
        </div>

        <div style={styles.resumenCard}>
          <p>Entrenador</p>
          <h3>
            {deportista?.entrenador?.nombres_completos || 'Sin entrenador'}
          </h3>
        </div>
      </section>

      <section style={styles.seccionTitulo}>
        <strong>Paga acá...</strong>
        <span onClick={() => setTab('pagos')}>Ver más...</span>
      </section>

      <section style={styles.linkPagoCard} onClick={() => setTab('pagos')}>
        <div style={styles.pseCircle}>PSE</div>
        <div>
          <h3>Links de pago</h3>
          <p>Inscripción, mensualidad, uniformes y torneos</p>
        </div>
        <strong>Ver</strong>
      </section>

      <section style={styles.seccionTitulo}>
        <strong>Eventos</strong>
        <span onClick={() => setTab('eventos')}>Ver más...</span>
      </section>
      <section style={styles.eventosGrid}>
        {eventosInicio.length === 0 && (
          <div style={styles.eventoCard}>Sin eventos próximos</div>
        )}

        {eventosInicio.map((ev) => (
          <div key={ev.id} style={styles.eventoInicioCard}>
            <strong style={styles.eventoInicioTitulo}>{ev.titulo}</strong>

            <span style={styles.eventoInicioFecha}>{ev.fecha}</span>

            <small style={styles.eventoInicioHora}>
              {ev.hora_inicio} - {ev.hora_fin}
            </small>
          </div>
        ))}
      </section>
    </>
  );
}

function DeportistaDetalle({ deportista, iniciales, onActualizar }) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [form, setForm] = useState({
    acudiente_nombre: deportista.acudiente_nombre || '',
    acudiente_documento: deportista.acudiente_documento || '',
    acudiente_correo: deportista.acudiente_correo || '',
    acudiente_celular: deportista.acudiente_celular || '',
    acudiente_parentesco: deportista.acudiente_parentesco || '',
    deportista_nombre: deportista.deportista_nombre || '',
    pais: deportista.pais || '',
    fecha_nacimiento: deportista.fecha_nacimiento || '',
    direccion_vivienda: deportista.direccion_vivienda || '',
    sexo: deportista.sexo || '',
    colegio: deportista.colegio || '',
    eps: deportista.eps || '',
    rh: deportista.rh || '',
    alergias: deportista.alergias || '',
    observaciones_medicas: deportista.observaciones_medicas || '',
  });

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  const selectDeportista = `
    id,
    foto_url,
    acudiente_nombre,
    acudiente_documento,
    acudiente_correo,
    acudiente_celular,
    acudiente_parentesco,
    deportista_nombre,
    deportista_documento,
    pais,
    fecha_nacimiento,
    direccion_vivienda,
    sexo,
    colegio,
    eps,
    rh,
    alergias,
    observaciones_medicas,
    estado,
    sede:sedes (
      nombre_corto
    ),
    categoria:categorias (
      categoria
    ),
    entrenador:entrenadores (
      nombres_completos
    )
  `;

  async function guardarCambios() {
    setGuardando(true);

    const { data, error } = await supabase
      .from('deportistas')
      .update({
        acudiente_nombre: form.acudiente_nombre,
        acudiente_documento: form.acudiente_documento,
        acudiente_correo: form.acudiente_correo,
        acudiente_celular: form.acudiente_celular,
        acudiente_parentesco: form.acudiente_parentesco,
        deportista_nombre: form.deportista_nombre,
        pais: form.pais,
        fecha_nacimiento: form.fecha_nacimiento,
        direccion_vivienda: form.direccion_vivienda,
        sexo: form.sexo,
        colegio: form.colegio,
        eps: form.eps,
        rh: form.rh,
        alergias: form.alergias,
        observaciones_medicas: form.observaciones_medicas,
      })
      .eq('id', deportista.id)
      .select(selectDeportista)
      .single();

    setGuardando(false);

    if (error) {
      console.error(error);
      alert('No se pudo actualizar la información.');
      return;
    }

    onActualizar(data);
    setEditando(false);
    alert('Información actualizada correctamente.');
  }

  async function subirFoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSubiendoFoto(true);

    const extension = file.name.split('.').pop();
    const path = `${deportista.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('deportistas-fotos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      alert('No se pudo subir la foto.');
      setSubiendoFoto(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from('deportistas-fotos')
      .getPublicUrl(path);

    const fotoUrl = publicData.publicUrl;

    const { data, error } = await supabase
      .from('deportistas')
      .update({ foto_url: fotoUrl })
      .eq('id', deportista.id)
      .select(selectDeportista)
      .single();

    setSubiendoFoto(false);

    if (error) {
      console.error(error);
      alert('La foto subió, pero no se pudo guardar en el perfil.');
      return;
    }

    onActualizar(data);
    alert('Foto actualizada correctamente.');
  }

  return (
    <>
      <PortalTitle icono="👤" titulo="DEPORTISTA" />

      <section style={styles.detalleCard}>
        <div style={styles.badgeCategoria}>
          {deportista?.categoria?.categoria || 'Sin categoría'}
        </div>

        <div style={styles.detalleTop}>
          <label style={styles.subirFotoBox}>
            {deportista?.foto_url ? (
              <img
                src={deportista.foto_url}
                alt="Foto deportista"
                style={styles.fotoDeportistaImg}
                onError={(e) => {
                  console.log('Error cargando foto:', deportista.foto_url);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span>{subiendoFoto ? 'Subiendo...' : 'Subir foto'}</span>
            )}

            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={subirFoto}
            />
          </label>

          <div style={styles.nombreBox}>
            <small>Nombre deportista</small>
            <h1 style={{ color: '#082567' }}>
  {deportista.deportista_nombre}
</h1>
          </div>
        </div>

        <div style={styles.infoLine}>
          <span>Sede</span>
          <strong>{deportista?.sede?.nombre_corto || 'Sin sede'}</strong>
        </div>

        <div style={styles.infoLine}>
          <span>Entrenador</span>
          <strong>
            {deportista?.entrenador?.nombres_completos || 'Sin entrenador'}
          </strong>
        </div>

        <div style={styles.carnetBox}>
          <div style={styles.qrBox}>QR</div>
          <div>
            <h3>CARNET</h3>
            <h3>DEPORTISTA</h3>
          </div>
        </div>
      </section>

      <section style={styles.detalleCard}>
        <div style={styles.editHeader}>
          <h2 style={styles.subtituloAzul}>Información del deportista</h2>

          <button
            style={styles.pagarBtn}
            onClick={() => setEditando(!editando)}
          >
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {!editando && (
          <>
            <div style={styles.dataSection}>
              <h3>DATOS PERSONALES</h3>

              <div style={styles.dataGrid}>
                <DataItem
                  label="Nombre completo"
                  value={deportista.deportista_nombre}
                />
                <DataItem
                  label="Fecha de nacimiento"
                  value={deportista.fecha_nacimiento || 'Sin dato'}
                />
                <DataItem
                  label="Documento de identidad"
                  value={deportista.deportista_documento || 'Sin dato'}
                />
                <DataItem
                  label="Categoría"
                  value={deportista?.categoria?.categoria || 'Sin dato'}
                />
                <DataItem label="Sexo" value={deportista.sexo || 'Sin dato'} />
                <DataItem
                  label="Colegio"
                  value={deportista.colegio || 'Sin dato'}
                />
              </div>
            </div>

            <div style={styles.dataSection}>
              <h3>ACUDIENTE</h3>

              <div style={styles.dataGrid}>
                <DataItem
                  label="Nombre"
                  value={deportista.acudiente_nombre || 'Sin dato'}
                />
                <DataItem
                  label="Documento"
                  value={deportista.acudiente_documento || 'Sin dato'}
                />
                <DataItem
                  label="Correo"
                  value={deportista.acudiente_correo || 'Sin dato'}
                />
                <DataItem
                  label="Celular"
                  value={deportista.acudiente_celular || 'Sin dato'}
                />
              </div>
            </div>

            <div style={styles.dataSection}>
              <h3>INFORMACIÓN MÉDICA</h3>

              <div style={styles.dataGrid}>
                <DataItem label="EPS" value={deportista.eps || 'Sin dato'} />
                <DataItem label="RH" value={deportista.rh || 'Sin dato'} />
                <DataItem
                  label="Alergias"
                  value={deportista.alergias || 'Sin dato'}
                />
                <DataItem
                  label="Observaciones"
                  value={deportista.observaciones_medicas || 'Sin dato'}
                />
              </div>
            </div>
          </>
        )}

        {editando && (
          <div style={styles.dataSection}>
            <h3>EDITAR INFORMACIÓN</h3>

            <InputEdit
              label="Nombre deportista"
              value={form.deportista_nombre}
              onChange={(v) => cambiar('deportista_nombre', v)}
            />
            <InputEdit
              label="Documento deportista (no editable)"
              value={deportista.deportista_documento}
              readOnly
            />
            <InputEdit
              label="País"
              value={form.pais}
              onChange={(v) => cambiar('pais', v)}
            />
            <InputEdit
              label="Fecha nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={(v) => cambiar('fecha_nacimiento', v)}
            />
            <InputEdit
              label="Dirección vivienda"
              value={form.direccion_vivienda}
              onChange={(v) => cambiar('direccion_vivienda', v)}
            />
            <InputEdit
              label="Sexo"
              value={form.sexo}
              onChange={(v) => cambiar('sexo', v)}
            />
            <InputEdit
              label="Colegio"
              value={form.colegio}
              onChange={(v) => cambiar('colegio', v)}
            />

            <InputEdit
              label="Nombre acudiente"
              value={form.acudiente_nombre}
              onChange={(v) => cambiar('acudiente_nombre', v)}
            />
            <InputEdit
              label="Documento acudiente"
              value={form.acudiente_documento}
              onChange={(v) => cambiar('acudiente_documento', v)}
            />
            <InputEdit
              label="Correo acudiente"
              value={form.acudiente_correo}
              onChange={(v) => cambiar('acudiente_correo', v)}
            />
            <InputEdit
              label="Celular acudiente"
              value={form.acudiente_celular}
              onChange={(v) => cambiar('acudiente_celular', v)}
            />
            <InputEdit
              label="Parentesco"
              value={form.acudiente_parentesco}
              onChange={(v) => cambiar('acudiente_parentesco', v)}
            />

            <InputEdit
              label="EPS"
              value={form.eps}
              onChange={(v) => cambiar('eps', v)}
            />
            <InputEdit
              label="RH"
              value={form.rh}
              onChange={(v) => cambiar('rh', v)}
            />
            <InputEdit
              label="Alergias"
              value={form.alergias}
              onChange={(v) => cambiar('alergias', v)}
            />
            <InputEdit
              label="Observaciones médicas"
              value={form.observaciones_medicas}
              onChange={(v) => cambiar('observaciones_medicas', v)}
            />

            <button
              style={styles.boton}
              onClick={guardarCambios}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function InputEdit({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
}) {
  return (
    <label style={styles.formLabel}>
      <span>{label}</span>
      <input
        style={{ ...styles.input, background: readOnly ? '#eef0f6' : 'white' }}
        value={value}
        type={type}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </label>
  );
}

function DataItem({ label, value }) {
  return (
    <div style={styles.dataItem}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function PagosPadre() {
  function abrirPago(url) {
    window.open(url, '_blank');
  }

  return (
    <>
      <PortalTitle icono="💳" titulo="PAGOS" />

      <p style={styles.pageIntro}>
        Selecciona el concepto que deseas pagar. El pago se abrirá en una
        ventana externa.
      </p>

      {linksPago.map((link) => (
        <section key={link.concepto} style={styles.pagoItemCard}>
          <div style={styles.pseCircle}>PSE</div>

          <div style={styles.pagoInfo}>
            <h3>{link.concepto}</h3>
            <p>{link.descripcion}</p>
            {link.valor && <strong>{link.valor}</strong>}
            <small>Disponible</small>
          </div>
          <button style={styles.pagarBtn} onClick={() => abrirPago(link.url)}>
            Pagar
          </button>
        </section>
      ))}
    </>
  );
}

function EventosPadre({ deportista }) {
  const [eventos, setEventos] = useState([]);
  const [historialAsistencia, setHistorialAsistencia] = useState([]);
  const [verFinalizados, setVerFinalizados] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarEventosPadre();
  }, []);

  async function cargarEventosPadre() {
    if (!deportista?.id) return;

    setCargando(true);

    const { data, error } = await supabase
      .from('equipo_deportista')
      .select(
        `
  equipo_id,
  equipo:equipos(
    id,
    nombre,
    eventos:agenda_eventos(
      id,
      titulo,
      tipo_evento,
      tipo_entrenamiento,
      fecha,
      hora_inicio,
      hora_fin,
      descripcion,
      estado,
      estado_evento,
      novedad,
      motivo_cancelacion,
      fecha_actualizacion,
      sede_id,
      sede:sedes(nombre_corto)
    )
  )
`
      )
      .eq('deportista_id', deportista.id)
      .eq('estado', 'activo');

    setCargando(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    const eventosPlano = [];

    (data || []).forEach((rel) => {
      const equipo = rel.equipo;

      (equipo?.eventos || []).forEach((evento) => {
        eventosPlano.push({
          ...evento,
          equipo_nombre: equipo.nombre,
        });
      });
    });

    eventosPlano.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    setEventos(eventosPlano);
    setHistorialAsistencia(data?.[0]?.asistencias || []);

    const { data: asistenciaData, error: asistenciaError } = await supabase
      .from('asistencia_eventos')
      .select(
        `
    id,
    evento_id,
    deportista_id,
    estado_asistencia,
    fecha_registro
  `
      )
      .eq('deportista_id', deportista.id);

    if (asistenciaError) {
      console.error(asistenciaError);
    } else {
      setHistorialAsistencia(asistenciaData || []);
    }
  }
  const hoy = new Date();

  const eventosVisibles = eventos.filter((ev) => {
    const finEvento = new Date(`${ev.fecha}T${ev.hora_fin}`);

    if (verFinalizados) return finEvento < hoy;

    return finEvento >= hoy && ev.estado_evento !== 'cancelado';
  });

  return (
    <>
      <PortalTitle icono="🗓️" titulo="EVENTOS" />

      <button
        style={styles.botonFiltroEventos}
        onClick={() => setVerFinalizados(!verFinalizados)}
      >
        {verFinalizados ? 'Ver próximos eventos' : 'Ver eventos cumplidos'}
      </button>

      {cargando && (
        <section style={styles.eventoGrandeCard}>
          <p>Cargando eventos...</p>
        </section>
      )}

      {!cargando && eventos.length === 0 && (
        <section style={styles.eventoGrandeCard}>
          <h3>No tienes eventos programados</h3>
          <p>
            Cuando el entrenador programe eventos para tu equipo, aparecerán
            aquí.
          </p>
        </section>
      )}

      {!cargando &&
        eventosVisibles.map((ev) => (
          <section key={ev.id} style={styles.eventoGrandeCard}>
            <small style={styles.agendaTipo}>
              {ev.tipo_evento || 'Evento'}
            </small>

            <h3>{ev.titulo}</h3>

            <p>
              <strong>Equipo:</strong> {ev.equipo_nombre}
            </p>

            <p>
              <strong>Sede:</strong>{' '}
              {ev.sede?.nombre_corto || ev.sede_nombre || 'Sin sede'}
            </p>

            <p>
              <strong>Fecha:</strong> {ev.fecha}
            </p>

            <p>
              <strong>Hora:</strong> {ev.hora_inicio} - {ev.hora_fin}
            </p>

            {ev.descripcion && <p>{ev.descripcion}</p>}
            {ev.novedad && (
              <div style={styles.novedadEvento}>⚠️ {ev.novedad}</div>
            )}
            <section style={styles.historialSection}>
              {(() => {
                const finEvento = new Date(`${ev.fecha}T${ev.hora_fin}`);
                const eventoYaTermino = new Date() >= finEvento;

                if (!eventoYaTermino) return null;

                const asistencia = historialAsistencia.find(
                  (a) => a.evento_id === ev.id
                );

                if (!asistencia) return null;

                return (
                  <div style={styles.asistenciaEventoPadre}>
                    {asistencia.estado_asistencia === 'asistio' && '✅ Asistió'}
                    {asistencia.estado_asistencia === 'no_asistio' &&
                      '❌ No asistió'}
                    {asistencia.estado_asistencia === 'excusa' && '📄 Excusa'}
                    {asistencia.estado_asistencia === 'tarde' &&
                      '⏰ Llegó tarde'}
                  </div>
                );
              })()}
            </section>
          </section>
        ))}
    </>
  );
}

function DocumentosPadre() {
  const [documentos, setDocumentos] = useState([]);
  const [cargandoDocs, setCargandoDocs] = useState(true);
  return (
    <>
      <PortalTitle icono="📄" titulo="DOCUMENTOS" />

      {cargandoDocs && (
        <section style={styles.eventoGrandeCard}>
          <p>Cargando documentos...</p>
        </section>
      )}

      {!cargandoDocs && documentos.length === 0 && (
        <section style={styles.eventoGrandeCard}>
          <h3>No hay documentos cargados</h3>
          <p>El club aún no ha subido documentos.</p>
        </section>
      )}

      {documentos.map((doc) => (
        <section key={doc.id} style={styles.documentoCard}>
          <div style={styles.documentoHeader}>
            <h3>{doc.tipo_documento}</h3>

            <div
              style={{
                ...styles.estadoDocumento,
                background:
                  doc.estado === 'Vigente'
                    ? '#d4edda'
                    : doc.estado === 'Vencido'
                    ? '#f8d7da'
                    : '#fff3cd',
                color:
                  doc.estado === 'Vigente'
                    ? '#155724'
                    : doc.estado === 'Vencido'
                    ? '#721c24'
                    : '#856404',
              }}
            >
              {doc.estado}
            </div>
          </div>

          {doc.fecha_vencimiento && (
            <p>
              <strong>Vence:</strong> {doc.fecha_vencimiento}
            </p>
          )}

          {doc.observacion && <p>{doc.observacion}</p>}

          {doc.archivo_url && (
            <a
              href={doc.archivo_url}
              target="_blank"
              rel="noreferrer"
              style={styles.botonVerDocumento}
            >
              Ver documento
            </a>
          )}
        </section>
      ))}
      <section style={styles.alertaProteccion}>
        <div style={styles.portalIcon}>A</div>
        <div>
          <h3>Programa de Protección Deportiva</h3>
          <p>Compañía de seguros 601-744-3718</p>
          <small>Llamar primero para asignar centro asistencial</small>
        </div>
      </section>

      <DocumentoCard
        titulo="Resumen del programa Protección deportiva"
        texto="Resumen general del programa de protección para deportistas."
      />
      <DocumentoCard
        titulo="Condicionado detallado de asistencia"
        texto="Condiciones generales, alcances y exclusiones del programa."
      />
      <DocumentoCard
        titulo="Slip de póliza de seguros"
        texto="Documento de referencia de la póliza asociada al programa."
      />
    </>
  );
}

function DocumentoCard({ titulo, texto }) {
  return (
    <section style={styles.documentoCard}>
      <div>
        <h3>{titulo}</h3>
        <p>{texto}</p>
      </div>
      <button style={styles.pagarBtn}>Ver</button>
    </section>
  );
}

function BottomNav({ tab, setTab }) {
  return (
    <nav style={styles.bottomNav}>
      <button
        style={tab === 'inicio' ? styles.navItemActivo : styles.navItem}
        onClick={() => setTab('inicio')}
      >
        <span>🏠</span>
        Inicio
      </button>

      <button
        style={tab === 'deportista' ? styles.navItemActivo : styles.navItem}
        onClick={() => setTab('deportista')}
      >
        <span>👤</span>
        Deportista
      </button>

      <button
        style={tab === 'pagos' ? styles.navItemActivo : styles.navItem}
        onClick={() => setTab('pagos')}
      >
        <span>💳</span>
        Pagos
      </button>

      <button
        style={tab === 'eventos' ? styles.navItemActivo : styles.navItem}
        onClick={() => setTab('eventos')}
      >
        <span>🗓️</span>
        Eventos
      </button>

      <button
        style={tab === 'docs' ? styles.navItemActivo : styles.navItem}
        onClick={() => setTab('docs')}
      >
        <span>📄</span>
        Docs
      </button>
    </nav>
  );
}

function PanelAdmin({ setPantalla, setUsuario, setPerfil }) {
  const [menuAdmin, setMenuAdmin] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [resumen, setResumen] = useState({
    sedes: 0,
    entrenadores: 0,
    deportistas: 0,
    categorias: 0,
    solicitudes: 0,
  });

  const [porSede, setPorSede] = useState([]);
  const [porEntrenador, setPorEntrenador] = useState([]);
  const [porCategoria, setPorCategoria] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarAdmin();
  }, []);

  async function cargarAdmin() {
    const [
      sedesRes,
      entrenadoresRes,
      deportistasRes,
      categoriasRes,
      solicitudesRes,
      deportistasData,
      entrenadoresData,
      categoriasData,
    ] = await Promise.all([
      supabase.from('sedes').select('*', { count: 'exact', head: true }),
      supabase.from('entrenadores').select('*', { count: 'exact', head: true }),
      supabase.from('deportistas').select('*', { count: 'exact', head: true }),
      supabase.from('categorias').select('*', { count: 'exact', head: true }),
      supabase
        .from('solicitudes_inscripcion')
        .select('*', { count: 'exact', head: true }),

      supabase.from('deportistas').select(`
        id,
        deportista_nombre,
        sede:sedes(nombre_corto),
        entrenador:entrenadores(nombres_completos),
        categoria:categorias(categoria)
      `),

      supabase.from('entrenadores').select('*').order('nombres_completos'),

      supabase.from('categorias').select('*').order('categoria'),
    ]);

    setResumen({
      sedes: sedesRes.count || 0,
      entrenadores: entrenadoresRes.count || 0,
      deportistas: deportistasRes.count || 0,
      categorias: categoriasRes.count || 0,
      solicitudes: solicitudesRes.count || 0,
    });

    setEntrenadores(entrenadoresData.data || []);
    setCategorias(categoriasData.data || []);

    const deportistas = deportistasData.data || [];

    setPorSede(agrupar(deportistas, (d) => d.sede?.nombre_corto || 'Sin sede'));

    setPorEntrenador(
      agrupar(
        deportistas,
        (d) => d.entrenador?.nombres_completos || 'Sin entrenador'
      )
    );

    setPorCategoria(
      agrupar(deportistas, (d) => d.categoria?.categoria || 'Sin categoría')
    );
  }

  function agrupar(lista, campoFn) {
    const mapa = {};

    lista.forEach((item) => {
      const key = campoFn(item);
      mapa[key] = (mapa[key] || 0) + 1;
    });

    return Object.entries(mapa).map(([nombre, total]) => ({
      nombre,
      total,
    }));
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUsuario(null);
    setPerfil(null);
    setPantalla('login');
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

        <div style={styles.adminAvatar}>A</div>
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
            style={
              menuAdmin === 'dashboard'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('dashboard');
              setMenuAbierto(false);
            }}
          >
            📊 Dashboard
          </button>

          <button
            style={
              menuAdmin === 'aprobaciones'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('aprobaciones');
              setMenuAbierto(false);
            }}
          >
            ✅ Aprobaciones
          </button>

          <button
            style={
              menuAdmin === 'entrenadores'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('entrenadores');
              setMenuAbierto(false);
            }}
          >
            👤 Entrenadores
          </button>

          <button
            style={
              menuAdmin === 'categorias'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('categorias');
              setMenuAbierto(false);
            }}
          >
            🏷️ Categorías
          </button>

          <button
            style={
              menuAdmin === 'equipos'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('equipos');
              setMenuAbierto(false);
            }}
          >
            🏐 Equipos
          </button>

          <button
            style={
              menuAdmin === 'agenda'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('agenda');
              setMenuAbierto(false);
            }}
          >
            🗓️ Agenda
          </button>

          <button
            style={
              menuAdmin === 'carnets'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('carnets');
              setMenuAbierto(false);
            }}
          >
            🪪 Carnets
          </button>

          <button
            style={
              menuAdmin === 'docs' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
            onClick={() => {
              setMenuAdmin('docs');
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
        {menuAdmin === 'dashboard' && (
          <AdminDashboard
            resumen={resumen}
            porSede={porSede}
            porEntrenador={porEntrenador}
            porCategoria={porCategoria}
          />
        )}

        {menuAdmin === 'aprobaciones' && <AdminAprobaciones />}

        {menuAdmin === 'entrenadores' && (
          <AdminEntrenadores
            entrenadores={entrenadores}
            recargar={cargarAdmin}
          />
        )}

        {menuAdmin === 'categorias' && (
          <AdminCategorias categorias={categorias} recargar={cargarAdmin} />
        )}

        {menuAdmin === 'equipos' && <div>Equipos</div>}

        {menuAdmin === 'agenda' && <div>Agenda</div>}

        {menuAdmin === 'carnets' && <AdminCarnets />}

        {menuAdmin === 'docs' && <AdminDocs />}
      </section>
    </main>
  );
}

function AdminDashboard({ resumen, porSede, porEntrenador, porCategoria }) {
  return (
    <>
      <h1 style={styles.adminTitle}>Dashboard</h1>

      <section style={styles.adminCardsGrid}>
        <AdminCard titulo="Sedes" valor={resumen.sedes} />
        <AdminCard titulo="Entrenadores" valor={resumen.entrenadores} />
        <AdminCard titulo="Deportistas" valor={resumen.deportistas} />
        <AdminCard titulo="Categorías" valor={resumen.categorias} />
        <AdminCard titulo="Solicitudes" valor={resumen.solicitudes} />
      </section>

      <AdminTabla titulo="Deportistas por sede" data={porSede} />
      <AdminTabla titulo="Deportistas por entrenador" data={porEntrenador} />
      <AdminTabla titulo="Deportistas por categoría" data={porCategoria} />
    </>
  );
}

function AdminCard({ titulo, valor }) {
  return (
    <div style={styles.adminCard}>
      <p>{titulo}</p>
      <h2>{valor}</h2>
    </div>
  );
}

function AdminTabla({ titulo, data }) {
  return (
    <section style={styles.adminPanel}>
      <h2>{titulo}</h2>

      <table style={styles.adminTable}>
        <thead>
          <tr>
            <th style={styles.adminTh}>Nombre</th>
            <th style={styles.adminTh}>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td style={styles.adminTd} colSpan="2">
                Sin datos
              </td>
            </tr>
          )}

          {data.map((item) => (
            <tr key={item.nombre}>
              <td style={styles.adminTd}>{item.nombre}</td>
              <td style={styles.adminTd}>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function AdminAprobaciones() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudConfirmar, setSolicitudConfirmar] = useState(null);
  const [accionConfirmar, setAccionConfirmar] = useState('');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  async function cargarSolicitudes() {
    const { data, error } = await supabase
      .from('solicitudes_inscripcion')
      .select(
        `
        *,
        categoria:categorias(categoria),
        sede:sedes(nombre_corto),
        entrenador:entrenadores(nombres_completos)
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      alert('No se pudieron cargar las solicitudes.');
      return;
    }

    setSolicitudes(data || []);
  }

  async function aprobarSolicitud(solicitud) {
    const { data: deportistaCreado, error: errorDeportista } = await supabase
      .from('deportistas')
      .insert([
        {
          acudiente_nombre: solicitud.acudiente_nombre,
          acudiente_documento: solicitud.acudiente_documento,
          acudiente_correo: solicitud.acudiente_correo,
          acudiente_celular: solicitud.acudiente_celular,
          acudiente_parentesco: solicitud.acudiente_parentesco,

          deportista_nombre: solicitud.deportista_nombre,
          deportista_documento: solicitud.deportista_documento,
          pais: solicitud.pais,
          fecha_nacimiento: solicitud.fecha_nacimiento,
          direccion_vivienda: solicitud.direccion_vivienda,
          sexo: solicitud.sexo,
          colegio: solicitud.colegio,

          sede_id: solicitud.sede_id,
          categoria_id: solicitud.categoria_id,
          entrenador_id: solicitud.entrenador_id,

          eps: solicitud.eps,
          rh: solicitud.rh,
          alergias: solicitud.alergias,
          observaciones_medicas: solicitud.observaciones_medicas,

          estado: 'activo',
        },
      ])
      .select()
      .single();

    if (errorDeportista) {
      console.error(errorDeportista);

      alert(JSON.stringify(errorDeportista, null, 2));

      return;
    }

    const { error: errorSolicitud } = await supabase
      .from('solicitudes_inscripcion')
      .update({ estado: 'Aprobada' })
      .eq('id', solicitud.id);

    if (errorSolicitud) {
      console.error(errorSolicitud);
      alert(
        'El deportista fue creado, pero no se pudo actualizar la solicitud.'
      );
      return;
    }

    alert(
      `Solicitud aprobada. Deportista creado: ${deportistaCreado.deportista_nombre}`
    );

    setDetalle(null);
    cargarSolicitudes();
  }

  async function rechazarSolicitud(solicitud) {
    const { error } = await supabase
      .from('solicitudes_inscripcion')
      .update({ estado: 'Rechazada' })
      .eq('id', solicitud.id);

    if (error) {
      console.error(error);
      alert('No se pudo rechazar la solicitud.');
      return;
    }

    setDetalle(null);
    cargarSolicitudes();
  }

  if (detalle) {
    return (
      <>
        <button style={styles.volverBtn} onClick={() => setDetalle(null)}>
          ← Volver
        </button>

        <h1 style={styles.adminTitle}>Detalle solicitud</h1>

        <section style={styles.adminPanel}>
          <h2>{detalle.deportista_nombre}</h2>

          <p>
            <strong>Categoría:</strong>{' '}
            {detalle.categoria?.categoria || 'Sin categoría'}
          </p>
          <p>
            <strong>Sede:</strong> {detalle.sede?.nombre_corto || 'Sin sede'}
          </p>
          <p>
            <strong>Entrenador:</strong>{' '}
            {detalle.entrenador?.nombres_completos || 'Sin entrenador'}
          </p>
          <p>
            <strong>Documento deportista:</strong>{' '}
            {detalle.deportista_documento}
          </p>
          <p>
            <strong>Fecha nacimiento:</strong> {detalle.fecha_nacimiento}
          </p>
          <p>
            <strong>Sexo:</strong> {detalle.sexo}
          </p>
          <p>
            <strong>Colegio:</strong> {detalle.colegio || 'Sin dato'}
          </p>
          <p>
            <strong>Estado:</strong> {detalle.estado}
          </p>

          <hr />

          <p>
            <strong>Acudiente:</strong> {detalle.acudiente_nombre}
          </p>
          <p>
            <strong>Documento acudiente:</strong> {detalle.acudiente_documento}
          </p>
          <p>
            <strong>Correo:</strong> {detalle.acudiente_correo}
          </p>
          <p>
            <strong>Celular:</strong> {detalle.acudiente_celular}
          </p>
          <p>
            <strong>Parentesco:</strong> {detalle.acudiente_parentesco}
          </p>

          <div style={styles.adminActions}>
            <button
              style={styles.adminSmallBtn}
              onClick={() => aprobarSolicitud(detalle)}
            >
              Aprobar
            </button>

            <button
              style={styles.adminSmallBtnDanger}
              onClick={() => rechazarSolicitud(detalle)}
            >
              Rechazar
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Aprobaciones</h1>

      <section style={styles.adminPanel}>
        {solicitudes.length === 0 && <p>No hay solicitudes.</p>}

        {solicitudes.map((s) => (
          <div key={s.id} style={styles.adminListItem}>
            <div>
              <strong>{s.deportista_nombre}</strong>

              <p>
                {s.categoria?.categoria || 'Sin categoría'} ·{' '}
                {s.sede?.nombre_corto || 'Sin sede'}
              </p>

              <small>
                Entrenador:{' '}
                {s.entrenador?.nombres_completos || 'Sin entrenador'} · Estado:{' '}
                {s.estado}
              </small>
            </div>

            <div style={styles.adminActions}>
              <button
                style={styles.adminSmallBtn}
                onClick={() => setDetalle(s)}
              >
                Ver
              </button>

              {s.estado === 'Pendiente' && (
                <>
                  <button
                    style={styles.adminSmallBtn}
                    onClick={() => {
                      setSolicitudConfirmar(s);
                      setAccionConfirmar('aprobar');
                    }}
                  >
                    Aprobar
                  </button>

                  <button
                    style={styles.adminSmallBtnDanger}
                    onClick={() => {
                      setSolicitudConfirmar(s);
                      setAccionConfirmar('rechazar');
                    }}
                  >
                    Rechazar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {solicitudConfirmar && (
          <div style={styles.modalInterno}>
            <h2>
              {accionConfirmar === 'aprobar'
                ? 'Aprobar inscripción'
                : 'Rechazar inscripción'}
            </h2>

            <p>
              ¿Confirmas la acción para{' '}
              <strong>{solicitudConfirmar.deportista_nombre}</strong>?
            </p>

            <button
              style={styles.boton}
              onClick={async () => {
                if (accionConfirmar === 'aprobar') {
                  await aprobarSolicitud(solicitudConfirmar);
                } else {
                  await rechazarSolicitud(solicitudConfirmar);
                }

                setSolicitudConfirmar(null);
                setAccionConfirmar('');
              }}
            >
              Confirmar
            </button>

            <button
              style={styles.botonCancelarFull}
              onClick={() => {
                setSolicitudConfirmar(null);
                setAccionConfirmar('');
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function AdminEntrenadores({ entrenadores, recargar }) {
  const [nuevo, setNuevo] = useState({
    nombres_completos: '',
    correo_electronico: '',
    celular: '',
    pais: 'Colombia',
  });

  async function crearEntrenador() {
    if (!nuevo.nombres_completos) {
      alert('Escribe el nombre del entrenador.');
      return;
    }

    const { error } = await supabase.from('entrenadores').insert([
      {
        ...nuevo,
        estado: 'activo',
      },
    ]);

    if (error) {
      alert('No se pudo crear el entrenador.');
      console.error(error);
      return;
    }

    setNuevo({
      nombres_completos: '',
      correo_electronico: '',
      celular: '',
      pais: 'Colombia',
    });

    recargar();
  }

  async function cambiarEstado(entrenador) {
    const nuevoEstado = entrenador.estado === 'activo' ? 'inactivo' : 'activo';

    const { error } = await supabase
      .from('entrenadores')
      .update({ estado: nuevoEstado })
      .eq('id', entrenador.id);

    if (error) {
      alert('No se pudo actualizar.');
      return;
    }

    recargar();
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Entrenadores</h1>

      <section style={styles.adminPanel}>
        <h2>Crear entrenador</h2>

        <input
          style={styles.input}
          placeholder="Nombre completo"
          value={nuevo.nombres_completos}
          onChange={(e) =>
            setNuevo({ ...nuevo, nombres_completos: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Correo electrónico"
          value={nuevo.correo_electronico}
          onChange={(e) =>
            setNuevo({ ...nuevo, correo_electronico: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Celular"
          value={nuevo.celular}
          onChange={(e) => setNuevo({ ...nuevo, celular: e.target.value })}
        />

        <button style={styles.boton} onClick={crearEntrenador}>
          Crear entrenador
        </button>
      </section>

      <section style={styles.adminPanel}>
        <h2>Listado de entrenadores</h2>

        {entrenadores.map((entrenador) => (
          <div key={entrenador.id} style={styles.adminListItem}>
            <div>
              <strong>{entrenador.nombres_completos}</strong>
              <p>{entrenador.correo_electronico || 'Sin correo'}</p>
              <small>Estado: {entrenador.estado || 'Sin estado'}</small>
            </div>

            <button
              style={styles.adminSmallBtn}
              onClick={() => cambiarEstado(entrenador)}
            >
              {entrenador.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </section>
    </>
  );
}

function AdminCategorias({ categorias, recargar }) {
  const [editando, setEditando] = useState(null);

  async function guardarCategoria() {
    const { error } = await supabase
      .from('categorias')
      .update({
        categoria: editando.categoria,
        anio_inicial: editando.anio_inicial,
        anio_final: editando.anio_final,
        estado: editando.estado,
      })
      .eq('id', editando.id);

    if (error) {
      alert('No se pudo actualizar la categoría.');
      return;
    }

    setEditando(null);
    recargar();
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Categorías</h1>

      <section style={styles.adminPanel}>
        {categorias.map((cat) => (
          <div key={cat.id} style={styles.adminListItem}>
            {editando?.id === cat.id ? (
              <div style={{ width: '100%' }}>
                <input
                  style={styles.input}
                  value={editando.categoria}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      categoria: e.target.value,
                    })
                  }
                />

                <input
                  style={styles.input}
                  value={editando.anio_inicial}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      anio_inicial: e.target.value,
                    })
                  }
                />

                <input
                  style={styles.input}
                  value={editando.anio_final}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      anio_final: e.target.value,
                    })
                  }
                />

                <select
                  style={styles.input}
                  value={editando.estado}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      estado: e.target.value,
                    })
                  }
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>

                <button
                  style={styles.adminSmallBtn}
                  onClick={guardarCategoria}
                >
                  Guardar
                </button>

                <button
                  style={styles.adminSmallBtnDanger}
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{cat.categoria}</strong>

                  <p>
                    {cat.anio_inicial} - {cat.anio_final}
                  </p>

                  <small>{cat.estado}</small>
                </div>

                <button
                  style={styles.adminSmallBtn}
                  onClick={() => setEditando(cat)}
                >
                  Editar
                </button>
              </>
            )}
          </div>
        ))}
      </section>
    </>
  );
}

function AdminCarnets() {
  return (
    <>
      <h1 style={styles.adminTitle}>Carnets</h1>
      <section style={styles.adminPanel}>
        <p>Próximo paso: ver carnets de deportistas y entrenadores.</p>
      </section>
    </>
  );
}

function AdminDocs() {
  return (
    <>
      <h1 style={styles.adminTitle}>Programa de seguros / Docs</h1>

      <section style={styles.alertaProteccion}>
        <div style={styles.portalIcon}>A</div>
        <div>
          <h3>Programa de Protección Deportiva</h3>
          <p>Compañía de seguros 601-744-3718</p>
          <small>Llamar primero para asignar centro asistencial</small>
        </div>
      </section>

      <DocumentoCard
        titulo="Resumen del programa Protección deportiva"
        texto="Resumen general del programa de protección para deportistas."
      />
      <DocumentoCard
        titulo="Condicionado detallado de asistencia"
        texto="Condiciones generales, alcances y exclusiones del programa."
      />
      <DocumentoCard
        titulo="Slip de póliza de seguros"
        texto="Documento de referencia de la póliza asociada al programa."
      />
    </>
  );
}


function SolicitudEnviada({ setPantalla }) {
  return (
    <main style={styles.okContainer}>
      <div style={styles.okCard}>
        <h1>Solicitud enviada</h1>
        <p>El administrador revisará la inscripción y aprobará el acceso.</p>

        <button style={styles.boton} onClick={() => setPantalla('login')}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, type = 'text', readOnly = false }) {
 
 return (
    <label style={styles.formLabel}>
      <span>{label}</span>
      <input
        style={styles.input}
        value={value}
        type={type}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectSimple({ label, options, value, onChange }) {

  return (
    <label style={styles.formLabel}>
      <span>{label}</span>

      <select
        style={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecciona una opción</option>
        {options.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </label>
  );
}

  function CheckLegal({ checked, onChange, texto }) {
  return (
    <label style={styles.legalRow}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span>{texto}</span>
    </label>
  );
}
export default App;
