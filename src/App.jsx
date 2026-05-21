import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import './App.css';
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
        onClick={() => setPantalla('registro')}
      >
        Crear cuenta / Inscribir deportista
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

        {menuAdmin === 'equipos' && <AdminEquipos />}

        {menuAdmin === 'agenda' && <AdminAgenda />}

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
                    setEditando({ ...editando, categoria: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  value={editando.anio_inicial}
                  onChange={(e) =>
                    setEditando({ ...editando, anio_inicial: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  value={editando.anio_final}
                  onChange={(e) =>
                    setEditando({ ...editando, anio_final: e.target.value })
                  }
                />

                <select
                  style={styles.input}
                  value={editando.estado}
                  onChange={(e) =>
                    setEditando({ ...editando, estado: e.target.value })
                  }
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>

                <button style={styles.adminSmallBtn} onClick={guardarCategoria}>
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

function AdminEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [deportistas, setDeportistas] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [deportistasEquipo, setDeportistasEquipo] = useState([]);
  const [deportistaSeleccionado, setDeportistaSeleccionado] = useState('');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [filtroEquipo, setFiltroEquipo] = useState('');

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: '',
    sede_id: '',
    categoria_id: '',
    entrenador_id: '',
  });

  useEffect(() => {
    cargarEquipos();
  }, []);

  async function cargarEquipos() {
    const [
      equiposRes,
      sedesRes,
      categoriasRes,
      entrenadoresRes,
      deportistasRes,
    ] = await Promise.all([
      supabase
        .from('equipos')
        .select(
          `
            id,
            nombre,
            estado,
            sede:sedes(nombre_corto),
            categoria:categorias(categoria),
            entrenador:entrenadores(nombres_completos)
          `
        )
        .order('nombre'),

      supabase.from('sedes').select('id, nombre_corto').order('nombre_corto'),

      supabase
        .from('categorias')
        .select('id, categoria')
        .eq('estado', 'Activo')
        .order('categoria'),

      supabase
        .from('entrenadores')
        .select('id, nombres_completos')
        .order('nombres_completos'),

      supabase
        .from('deportistas')
        .select('id, deportista_nombre, deportista_documento')
        .order('deportista_nombre'),
    ]);

    setEquipos(equiposRes.data || []);
    setSedes(sedesRes.data || []);
    setCategorias(categoriasRes.data || []);
    setEntrenadores(entrenadoresRes.data || []);
    setDeportistas(deportistasRes.data || []);
  }

  async function cargarDeportistasEquipo(equipo) {
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
          deportista_documento
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

  async function crearEquipo() {
    if (
      !nuevoEquipo.nombre ||
      !nuevoEquipo.sede_id ||
      !nuevoEquipo.categoria_id
    ) {
      alert('Completa nombre, sede y categoría.');
      return;
    }

    const { error } = await supabase.from('equipos').insert([
      {
        nombre: nuevoEquipo.nombre,
        sede_id: nuevoEquipo.sede_id,
        categoria_id: nuevoEquipo.categoria_id,
        entrenador_id: nuevoEquipo.entrenador_id || null,
        estado: 'activo',
      },
    ]);

    if (error) {
      console.error(error);
      alert('No se pudo crear el equipo.');
      return;
    }

    setNuevoEquipo({
      nombre: '',
      sede_id: '',
      categoria_id: '',
      entrenador_id: '',
    });

    setMostrarCrear(false);
    cargarEquipos();
  }

  async function cambiarEstadoEquipo(equipo) {
    const nuevoEstado = equipo.estado === 'activo' ? 'inactivo' : 'activo';

    const { error } = await supabase
      .from('equipos')
      .update({ estado: nuevoEstado })
      .eq('id', equipo.id);

    if (error) {
      console.error(error);
      alert('No se pudo cambiar el estado.');
      return;
    }

    cargarEquipos();
  }

  async function asignarDeportista() {
    if (!equipoSeleccionado || !deportistaSeleccionado) {
      alert('Selecciona un deportista.');
      return;
    }

    const { error } = await supabase.from('equipo_deportista').insert([
      {
        equipo_id: equipoSeleccionado.id,
        deportista_id: deportistaSeleccionado,
        estado: 'activo',
      },
    ]);

    if (error) {
      console.error(error);
      alert('No se pudo asignar. Puede que ya esté asignado.');
      return;
    }

    setDeportistaSeleccionado('');
    cargarDeportistasEquipo(equipoSeleccionado);
  }

  async function quitarDeportista(relacionId) {
    const { error } = await supabase
      .from('equipo_deportista')
      .update({ estado: 'inactivo' })
      .eq('id', relacionId);

    if (error) {
      console.error(error);
      alert('No se pudo eliminar del equipo.');
      return;
    }

    cargarDeportistasEquipo(equipoSeleccionado);
  }

  const equiposFiltrados = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(filtroEquipo.toLowerCase())
  );

  if (equipoSeleccionado) {
    return (
      <>
        <div style={styles.adminHeaderInline}>
          <button
            style={styles.volverBtn}
            onClick={() => {
              setEquipoSeleccionado(null);
              setDeportistasEquipo([]);
            }}
          >
            ← Volver
          </button>

          <button style={styles.adminPlusBtn} onClick={asignarDeportista}>
            +
          </button>
        </div>

        <h1 style={styles.adminTitle}>{equipoSeleccionado.nombre}</h1>

        <section style={styles.adminPanel}>
          <h2>Agregar deportista</h2>

          <select
            style={styles.input}
            value={deportistaSeleccionado}
            onChange={(e) => setDeportistaSeleccionado(e.target.value)}
          >
            <option value="">Selecciona deportista</option>
            {deportistas.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.deportista_nombre} - {dep.deportista_documento}
              </option>
            ))}
          </select>

          <button style={styles.boton} onClick={asignarDeportista}>
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
              <div>
                <strong>{item.deportista?.deportista_nombre}</strong>
                <p>Documento: {item.deportista?.deportista_documento}</p>
              </div>

              <button
                style={styles.adminSmallBtnDanger}
                onClick={() => quitarDeportista(item.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </section>
      </>
    );
  }

  return (
    <>
      <div style={styles.adminHeaderInline}>
        <h1 style={styles.adminTitle}>Equipos</h1>

        <button
          style={styles.adminPlusBtn}
          onClick={() => setMostrarCrear(!mostrarCrear)}
        >
          {mostrarCrear ? '×' : '+'}
        </button>
      </div>

      {mostrarCrear && (
        <section style={styles.adminPanel}>
          <h2>Crear equipo</h2>
          <input
            style={styles.input}
            placeholder="Nombre del equipo"
            value={nuevoEquipo.nombre}
            onChange={(e) =>
              setNuevoEquipo({
                ...nuevoEquipo,
                nombre: e.target.value,
              })
            }
          />

          <select
            style={styles.input}
            value={nuevoEquipo.sede_id}
            onChange={(e) =>
              setNuevoEquipo({ ...nuevoEquipo, sede_id: e.target.value })
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
            value={nuevoEquipo.categoria_id}
            onChange={(e) =>
              setNuevoEquipo({ ...nuevoEquipo, categoria_id: e.target.value })
            }
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoria}
              </option>
            ))}
          </select>
          <select
            style={styles.input}
            value={nuevoEquipo.entrenador_id}
            onChange={(e) =>
              setNuevoEquipo({ ...nuevoEquipo, entrenador_id: e.target.value })
            }
          >
            <option value="">Selecciona entrenador</option>
            {entrenadores.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.nombres_completos}
              </option>
            ))}
          </select>
          <button style={styles.boton} onClick={crearEquipo}>
            Crear equipo
          </button>
        </section>
      )}

      <section style={styles.adminPanel}>
        <h2>Listado de equipos</h2>

        {equipos.length === 0 && <p>No hay equipos creados.</p>}

        {equiposFiltrados.map((equipo) => (
          <div key={equipo.id} style={styles.adminListItem}>
            <div>
              <strong>{equipo.nombre}</strong>
              <p>
                {equipo.sede?.nombre_corto || 'Sin sede'} ·{' '}
                {equipo.categoria?.categoria || 'Sin categoría'}
              </p>
              <small>
                Entrenador:{' '}
                {equipo.entrenador?.nombres_completos || 'Sin entrenador'} ·{' '}
                Estado: {equipo.estado}
              </small>
            </div>

            <div style={styles.adminActions}>
              <button
                style={styles.adminSmallBtn}
                onClick={() => cargarDeportistasEquipo(equipo)}
              >
                Ver
              </button>

              <button
                style={styles.adminSmallBtn}
                onClick={() => cambiarEstadoEquipo(equipo)}
              >
                {equipo.estado === 'activo' ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function AdminAgenda() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAgendaAdmin();
  }, []);

  async function cargarAgendaAdmin() {
    setCargando(true);

    const hoy = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('agenda_eventos')
      .select(
        `
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
      `
      )
      .eq('fecha', hoy)
      .neq('estado_evento', 'cancelado')
      .order('hora_inicio', { ascending: true });

    if (error) {
      console.error(error);
      alert(error.message);
      setEventos([]);
    } else {
      setEventos(data || []);
    }

    setCargando(false);
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Agenda</h1>

      <section style={styles.adminPanelAgenda}>
        {cargando && <p>Cargando agenda...</p>}

        {!cargando && eventos.length === 0 && (
          <p>No hay eventos programados para hoy.</p>
        )}

        {!cargando &&
          eventos.map((ev) => (
            <div key={ev.id} style={styles.agendaAdminCard}>
              <h2>{ev.titulo}</h2>

              <div style={styles.agendaAdminRow}>
                <span>📅 Fecha</span>
                <strong>{ev.fecha}</strong>
              </div>

              <div style={styles.agendaAdminRow}>
                <span>🕐 Hora</span>
                <strong>
                  {ev.hora_inicio} - {ev.hora_fin}
                </strong>
              </div>

              <div style={styles.agendaAdminRow}>
                <span>🏐 Equipo</span>
                <strong>{ev.equipo?.nombre || 'Sin equipo'}</strong>
              </div>

              <div style={styles.agendaAdminRow}>
                <span>📍 Sede</span>
                <strong>{ev.sede?.nombre_corto || 'Sin sede'}</strong>
              </div>

              <div style={styles.agendaAdminRow}>
                <span>👤 Entrenador</span>
                <strong>
                  {ev.entrenador?.nombres_completos || 'Sin entrenador'}
                </strong>
              </div>

              {ev.novedad && (
                <div style={styles.agendaAdminNovedad}>⚠️ {ev.novedad}</div>
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

function PanelEntrenador({
  usuario,
  perfil,
  setPantalla,
  setUsuario,
  setPerfil,
}) {
  const [menu, setMenu] = useState('dashboard');
  useEffect(() => {
    setEventoEditando(null);
    setEventoCancelando(null);
    setEventoAsistencia(null);
  }, [menu]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [entrenador, setEntrenador] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [deportistas, setDeportistas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [deportistasEquipo, setDeportistasEquipo] = useState([]);
  const [deportistaSeleccionado, setDeportistaSeleccionado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarCrearEquipo, setMostrarCrearEquipo] = useState(false);
  const [eventoAsistencia, setEventoAsistencia] = useState(null);
  const [listaAsistencia, setListaAsistencia] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoCancelando, setEventoCancelando] = useState(null);
   const [deportistasAsistencia, setDeportistasAsistencia] = useState([]);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
     const [nuevoEquipoEntrenador, setNuevoEquipoEntrenador] = useState({
    nombre: '',
    sede_id: '',
    categoria_id: '',
  });
  const [sedesEntrenador, setSedesEntrenador] = useState([]);
  const [categoriasEntrenador, setCategoriasEntrenador] = useState([]);

  useEffect(() => {
    cargarEntrenador();
  }, []);
  const [mostrarCrearEvento, setMostrarCrearEvento] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    tipo_evento: '',
    tipo_entrenamiento: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    equipo_id: '',
    descripcion: '',
    es_repetitivo: false,
    frecuencia_repeticion: '',
    fecha_fin_repeticion: '',
  });

  async function cargarEntrenador() {
    setCargando(true);

    const correo = perfil?.correo || usuario?.email;

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

    const [equiposRes, deportistasRes, eventosRes, sedesRes, categoriasRes] =
      await Promise.all([
        supabase
          .from('equipos')
          .select(
            `
          id,
          nombre,
          estado,
          sede:sedes(nombre_corto),
          categoria:categorias(categoria)
        `
          )
          .eq('entrenador_id', entrenadorData.id)
          .order('nombre'),

        supabase
          .from('deportistas')
          .select(
            `
          id,
          deportista_nombre,
          deportista_documento,
          estado,
          sede:sedes(nombre_corto),
          categoria:categorias(categoria)
        `
          )
          .eq('entrenador_id', entrenadorData.id)
          .order('deportista_nombre'),

        supabase
          .from('agenda_eventos')
          .select(
            `
            id,
            titulo,
            tipo_evento,
            tipo_entrenamiento,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            equipo_id,
            sede_id,
            equipo:equipos(nombre),
            sede:sedes(nombre_corto)
          `
          )
          .eq('entrenador_id', entrenadorData.id)
          .order('fecha', { ascending: true }),

        supabase.from('sedes').select('id, nombre_corto').order('nombre_corto'),

        supabase.from('sedes').select('id, nombre_corto').order('nombre_corto'),

        supabase
          .from('categorias')
          .select('id, categoria')
          .eq('estado', 'Activo')
          .order('categoria'),
      ]);

    setEquipos(equiposRes.data || []);
    setDeportistas(deportistasRes.data || []);
    setEventos(eventosRes.data || []);
    setSedesEntrenador(sedesRes.data || []);
    setCategoriasEntrenador(categoriasRes.data || []);

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
        sede_id: equipoSeleccionadoEvento?.sede_id || null,
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
      descripcion: '',
      es_repetitivo: false,
      frecuencia_repeticion: '',
      fecha_fin_repeticion: '',
    });

    setMostrarCrearEvento(false);
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

  async function guardarEdicionEvento() {
    if (!eventoEditando) return;

    const { error } = await supabase
      .from('agenda_eventos')
      .update({
        titulo: eventoEditando.titulo,
        fecha: eventoEditando.fecha,
        hora_inicio: eventoEditando.hora_inicio,
        hora_fin: eventoEditando.hora_fin,
        sede_id: eventoEditando.sede_id,
        descripcion: eventoEditando.descripcion,
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

  async function abrirAsistencia(ev) {

    setEventoAsistencia(ev);
  
    const { data, error } = await supabase
      .from('equipo_deportista')
      .select(`
        deportista:deportistas(
          id,
          deportista_nombre,
          foto_url
        )
      `)
      .eq('equipo_id', ev.equipo_id);
  
    if (error) {
      console.error(error);
      alert('Error cargando deportistas');
      return;
    }
  
    setDeportistasAsistencia(data || []);
  }

  async function registrarAsistencia(
    eventoId,
    deportistaId,
    estado
  ) {
  
    const { error } = await supabase
      .from('asistencia_eventos')
      .upsert([
        {
          evento_id: eventoId,
          deportista_id: deportistaId,
          estado_asistencia: estado,
        }
      ]);
  
    if (error) {
      console.error(error);
      alert('Error guardando asistencia');
      return;
    }
  
    alert('Asistencia guardada');
  }


  async function guardarAsistencia() {
    if (!eventoAsistencia || listaAsistencia.length === 0) {
      alert('No hay asistencia para guardar.');
      return;
    }

    const pendientes = listaAsistencia.filter((item) => !item.estado);

    if (pendientes.length > 0) {
      alert('Debes marcar asistencia para todos los deportistas.');
      return;
    }

    const payload = listaAsistencia.map((item) => ({
      evento_id: eventoAsistencia.id,
      deportista_id: item.deportista_id,
      estado_asistencia: item.estado,
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

    const { error } = await supabase.from('equipo_deportista').insert([
      {
        equipo_id: equipoSeleccionado.id,
        deportista_id: deportistaSeleccionado,
        estado: 'activo',
      },
    ]);

    if (error) {
      console.error(error);
      alert('No se pudo asignar. Puede que ya esté en ese equipo.');
      return;
    }

    setDeportistaSeleccionado('');
    cargarEquipoDetalle(equipoSeleccionado);
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

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUsuario(null);
    setPerfil(null);
    setPantalla('login');
  }

  const deportistasSinEquipo = deportistas.filter((dep) => {
    const asignado = deportistasEquipo.some(
      (item) => item.deportista?.id === dep.id
    );
    return !asignado;
  });

  if (cargando) {
    return (
      <main style={styles.adminPage}>
        <HeaderApp />
        <section style={styles.adminPanel}>
          <p>Cargando información del entrenador...</p>
        </section>
      </main>
    );
  }

  if (!entrenador) {
    return (
      <main style={styles.adminPage}>
        <HeaderApp />
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
              {deportistas.map((dep) => (
                <option key={dep.id} value={dep.id}>
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
                <div>
                  <strong>{item.deportista?.deportista_nombre}</strong>
                  <p>
                    {item.deportista?.categoria?.categoria || 'Sin categoría'}
                  </p>
                  <small>
                    Documento: {item.deportista?.deportista_documento}
                  </small>
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

          <section style={styles.adminPanel}>
            <h2>Eventos próximos</h2>

            {eventos
              .filter((ev) => ev.equipo?.nombre === equipoSeleccionado.nombre)
              .map((ev) => (
                <div key={ev.id} style={styles.adminListItem}>
                  <div>
                    <strong>{ev.titulo}</strong>
                    <p>
                      {ev.tipo_evento} · {ev.fecha}
                    </p>
                    <small>
                      {ev.hora_inicio} - {ev.hora_fin}
                    </small>
                  </div>
                </div>
              ))}
          </section>
        </section>
      </main>
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
            style={
              menu === 'dashboard' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
            onClick={() => {
              setMenu('dashboard');
              setMenuAbierto(false);
            }}
          >
            📊 Dashboard
          </button>

          <button
            style={
              menu === 'equipos' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
            onClick={() => {
              setMenu('equipos');
              setMenuAbierto(false);
            }}
          >
            🏐 Mis equipos
          </button>

          <button
            style={
              menu === 'deportistas'
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
            }
            onClick={() => {
              setMenu('deportistas');
              setMenuAbierto(false);
            }}
          >
            👤 Mis deportistas
          </button>

          <button
            style={
              menu === 'agenda' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
            onClick={() => {
              setMenu('agenda');
              setMenuAbierto(false);
            }}
          >
            🗓️ Agenda
          </button>

          <button
            style={
              menu === 'carnet' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
            onClick={() => {
              setMenu('carnet');
              setMenuAbierto(false);
            }}
          >
            🪪 Carnet
          </button>

          <button
            style={
              menu === 'docs' ? styles.sidebarBtnActive : styles.sidebarBtn
            }
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

            <section style={styles.adminPanel}>
              <h2>{entrenador.nombres_completos}</h2>
              <p>{entrenador.correo_electronico}</p>
              <small>Estado: {entrenador.estado}</small>
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
                onClick={() => setMenu('sinEquipo')}
              >
                <p>Sin equipo</p>
                <h2>{deportistasSinEquipo.length}</h2>
              </button>
            </section>

            {deportistasSinEquipo.length > 0 && (
              <section style={styles.adminPanel}>
                <h2>Alertas</h2>
                <p>
                  Tienes <strong>{deportistasSinEquipo.length}</strong>{' '}
                  deportistas sin equipo asignado.
                </p>
              </section>
            )}
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
                <div key={dep.id} style={styles.adminListItem}>
                  <div>
                    <strong>{dep.deportista_nombre}</strong>
                    <p>
                      {dep.categoria?.categoria || 'Sin categoría'} ·{' '}
                      {dep.sede?.nombre_corto || 'Sin sede'}
                    </p>
                    <small>Documento: {dep.deportista_documento}</small>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {menu === 'equipos' && (
          <>
            <div style={styles.adminHeaderInline}>
              <h1 style={styles.adminTitle}>Mis equipos</h1>

              <button
                style={styles.adminPlusBtn}
                onClick={() => setMostrarCrearEquipo(!mostrarCrearEquipo)}
              >
                {mostrarCrearEquipo ? '×' : '+'}
              </button>
            </div>

            {mostrarCrearEquipo && (
              <section style={styles.adminPanel}>
                <h2>Crear equipo</h2>

                <input
                  style={styles.input}
                  placeholder="Nombre del equipo"
                  value={nuevoEquipoEntrenador.nombre}
                  onChange={(e) =>
                    setNuevoEquipoEntrenador({
                      ...nuevoEquipoEntrenador,
                      nombre: e.target.value,
                    })
                  }
                />

                <select
                  style={styles.input}
                  value={nuevoEquipoEntrenador.sede_id}
                  onChange={(e) =>
                    setNuevoEquipoEntrenador({
                      ...nuevoEquipoEntrenador,
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

                <select
                  style={styles.input}
                  value={nuevoEquipoEntrenador.categoria_id}
                  onChange={(e) =>
                    setNuevoEquipoEntrenador({
                      ...nuevoEquipoEntrenador,
                      categoria_id: e.target.value,
                    })
                  }
                >
                  <option value="">Selecciona categoría</option>
                  {categoriasEntrenador.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoria}
                    </option>
                  ))}
                </select>

                <button style={styles.boton} onClick={crearEquipoEntrenador}>
                  Crear equipo
                </button>
              </section>
            )}

            <section style={styles.adminPanel}>
              {equipos.length === 0 && <p>No tienes equipos asignados.</p>}

              {equipos.map((equipo) => (
                <div key={equipo.id} style={styles.adminListItem}>
                  <div>
                    <strong>{equipo.nombre}</strong>
                    <p>
                      {equipo.sede?.nombre_corto || 'Sin sede'} ·{' '}
                      {equipo.categoria?.categoria || 'Sin categoría'}
                    </p>
                    <small>Estado: {equipo.estado}</small>
                  </div>

                  <button
                    style={styles.adminSmallBtn}
                    onClick={() => cargarEquipoDetalle(equipo)}
                  >
                    Ver
                  </button>
                </div>
              ))}
            </section>
          </>
        )}

        {menu === 'deportistas' && (
          <>
            <h1 style={styles.adminTitle}>Mis deportistas</h1>

            <section style={styles.adminPanel}>
              {deportistas.length === 0 && (
                <p>No tienes deportistas asignados.</p>
              )}

              {deportistas.map((dep) => (
                <div key={dep.id} style={styles.adminListItem}>
                  <div>
                    <strong>{dep.deportista_nombre}</strong>
                    <p>
                      {dep.categoria?.categoria || 'Sin categoría'} ·{' '}
                      {dep.sede?.nombre_corto || 'Sin sede'}
                    </p>
                    <small>Documento: {dep.deportista_documento}</small>
                  </div>
                </div>
              ))}
            </section>
          </>
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
                  <option value="">Selecciona sede del entrenamiento</option>

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

                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={nuevoEvento.es_repetitivo}
                    onChange={(e) =>
                      setNuevoEvento({
                        ...nuevoEvento,
                        es_repetitivo: e.target.checked,
                      })
                    }
                  />
                  Evento repetitivo
                </label>

                {nuevoEvento.es_repetitivo && (
                  <>
                    <select
                      style={styles.input}
                      value={nuevoEvento.frecuencia_repeticion}
                      onChange={(e) =>
                        setNuevoEvento({
                          ...nuevoEvento,
                          frecuencia_repeticion: e.target.value,
                        })
                      }
                    >
                      <option value="">Frecuencia</option>
                      <option value="semanal">Semanal</option>
                      <option value="quincenal">Quincenal</option>
                      <option value="mensual">Mensual</option>
                    </select>

                    <input
                      type="date"
                      style={styles.input}
                      value={nuevoEvento.fecha_fin_repeticion}
                      onChange={(e) =>
                        setNuevoEvento({
                          ...nuevoEvento,
                          fecha_fin_repeticion: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                <button style={styles.boton} onClick={crearEventoEntrenador}>
                  Crear evento
                </button>
              </section>
            )}

            <section style={styles.adminPanel}>
              {eventos.length === 0 && <p>No tienes eventos programados.</p>}

              {eventos.map((ev) => (
                <div key={ev.id} style={styles.agendaCard}>
                  <div style={styles.agendaFecha}>
                    <strong style={{ fontSize: '22px' }}>
                      {new Date(ev.fecha).getDate()}
                    </strong>

                    <span>
                      {new Date(ev.fecha).toLocaleDateString('es-CO', {
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <div style={styles.agendaContenido}>
                    <small style={styles.agendaTipo}>{ev.tipo_evento}</small>

                    <h3>{ev.titulo}</h3>

                    <p>{ev.equipo?.nombre || 'Sin equipo'}</p>

                    <small>
                      {ev.hora_inicio} - {ev.hora_fin}
                    </small>
                  </div>

                 <div style={styles.eventoAcciones}>

  <button
    style={styles.botonMini}
    onClick={() => {
      const ahora = new Date();
      const inicioEvento = new Date(
        `${ev.fecha}T${ev.hora_inicio}`
      );

      if (ahora < inicioEvento) {
        alert(
          'La asistencia solo se puede diligenciar cuando el evento ya haya iniciado.'
        );
        return;
      }

      abrirAsistencia(ev);
    }}
  >
    Asistencia
  </button>

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
                </div>
              ))}
            </section>
          </>
        )}
        {eventoEditando && (
          <section style={styles.modalInterno}>
            <h2>Editar evento</h2>

            <input
              style={styles.input}
              value={eventoEditando.titulo}
              onChange={(e) =>
                setEventoEditando({ ...eventoEditando, titulo: e.target.value })
              }
              placeholder="Título"
            />

            <input
              type="date"
              style={styles.input}
              value={eventoEditando.fecha}
              onChange={(e) =>
                setEventoEditando({ ...eventoEditando, fecha: e.target.value })
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

            <select
              style={styles.input}
              value={eventoEditando.sede_id || ''}
              onChange={(e) =>
                setEventoEditando({
                  ...eventoEditando,
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

        {eventoAsistencia && (
          <>
            <div style={styles.adminHeaderInline}>
              <h1 style={styles.adminTitle}>Asistencia</h1>

              <button
                style={styles.adminPlusBtn}
                onClick={() => setEventoAsistencia(null)}
              >
                ×
              </button>
            </div>

            <section style={styles.adminPanel}>
              <h3>{eventoAsistencia.titulo}</h3>
              <p>
                <strong>Equipo:</strong>{' '}
                {eventoAsistencia.equipo?.nombre || 'Sin equipo'}
              </p>
              <p>
                <strong>Fecha:</strong> {eventoAsistencia.fecha}
              </p>
            </section>

            <section style={styles.adminPanel}>
              {listaAsistencia.length === 0 && (
                <p>No hay deportistas asignados a este equipo.</p>
              )}

              {listaAsistencia.map((item, index) => (
                <div key={item.deportista_id} style={styles.asistenciaFila}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <small>{item.documento}</small>
                  </div>

                  <select
                    style={styles.asistenciaSelect}
                    value={item.estado}
                    onChange={(e) => {
                      const copia = [...listaAsistencia];
                      copia[index].estado = e.target.value;
                      setListaAsistencia(copia);
                    }}
                  >
                    <option value="">Seleccionar</option>
                    <option value="asistio">✅ Asistió</option>
                    <option value="no_asistio">❌ No asistió</option>
                    <option value="tarde">⏰ Llegó tarde</option>
                    <option value="excusa">📄 Excusa</option>
                  </select>
                </div>
              ))}

              <button style={styles.boton} onClick={guardarAsistencia}>
                Guardar asistencia
              </button>
            </section>
          </>
        )}

        {menu === 'carnet' && (
          <>
            <h1 style={styles.adminTitle}>Carnet entrenador</h1>

            <section style={styles.detalleCard}>
              4
              <div style={styles.carnetBox}>
                <div style={styles.qrBox}>QR</div>

                <div>
                  <h3>CARNET</h3>
                  <h3>ENTRENADOR</h3>
                  <p>{entrenador.nombres_completos}</p>
                </div>
              </div>
            </section>
          </>
        )}

        {menu === 'docs' && <AdminDocs />}
      </section>
    </main>
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
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{texto}</span>
    </label>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#eef2f7',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Arial',
  },

  telefono: {
    width: '100%',
    maxWidth: '430px',
    minHeight: '100vh',
    background: '#f7f8fb',
  },

  loginContainer: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #6da9d7 0%, #eef5fb 32%, #ffffff 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 16px 22px',
    boxSizing: 'border-box',
  },

  loginLogo: {
    width: '125px',
    height: '125px',
    objectFit: 'contain',
    marginBottom: '8px',
  },

  loginTitulo: {
    color: '#21123f',
    fontSize: '28px',
    fontWeight: '800',
    margin: '4px 0 8px',
  },

  loginSubtitulo: {
    color: '#21123f',
    fontSize: '18px',
    textAlign: 'center',
    margin: '0 0 20px',
  },

  roleBox: {
    width: '100%',
    background: 'white',
    borderRadius: '18px',
    padding: '14px',
    marginBottom: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    boxSizing: 'border-box',
  },

  roleTitle: {
    margin: '0 0 10px',
    textAlign: 'center',
    color: '#1d1d45',
    fontWeight: 'bold',
  },

  roleButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
  },

  roleBtn: {
    background: '#f3f5fb',
    color: '#334499',
    border: '1px solid #dce1ee',
    padding: '11px',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  roleBtnActivo: {
    background: '#334499',
    color: 'white',
    border: '1px solid #334499',
    padding: '11px',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  loginBox: {
    width: '100%',
    background: 'white',
    borderRadius: '18px',
    padding: '22px 18px 18px',
    boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
    textAlign: 'left',
    boxSizing: 'border-box',
  },

  loginLabel: {
    display: 'block',
    color: '#21123f',
    fontSize: '15px',
    marginBottom: '6px',
  },

  loginInput: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderBottom: '1px solid #d7def0',
    background: '#ffffff',
    color: '#082567',
    fontSize: '16px',
    outline: 'none',
  },

  loginButton: {
    width: '100%',
    marginTop: '18px',
    padding: '14px',
    border: 'none',
    borderRadius: '24px',
    background: '#3949ab',
    color: '#fff',
    fontWeight: '800',
    fontSize: '16px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.18)',
  },

  forgotButton: {
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    color: '#9a98a7',
    fontSize: '16px',
    margin: '18px 0 55px',
    cursor: 'pointer',
  },

  createAccountButton: {
    width: '100%',
    background: 'white',
    color: '#334499',
    border: '2px solid #334499',
    padding: '14px',
    borderRadius: '28px',
    fontSize: '18px',
    fontWeight: '700',
    boxShadow: '0 4px 8px rgba(0,0,0,0.10)',
    cursor: 'pointer',
  },

  registroContainer: {
    padding: '25px 16px 40px',
  },

  padreContainer: {
    minHeight: '100vh',
    background: '#f4f6fb',
    padding: '0 10px 90px',
    overflowY: 'auto',
  },

  padreHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    height: '82px',
    background: '#082567',
    borderBottomLeftRadius: '18px',
    borderBottomRightRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 22px',
  },

  menuBtn: {
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
  },

  headerLogo: {
    width: '82px',
    height: '82px',
    objectFit: 'contain',
  },

  avatarBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: '#ff3f7f',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
  },

  padreMainCard: {
    marginTop: '22px',
    marginBottom: '18px',
    background: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },

  fotoDeportista: {
    width: '110px',
    height: '110px',
    minWidth: '110px',
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#e9eefc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #d8e0ff',
  },

  fotoDeportistaImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '18px',
  },

  inicialesFoto: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#334499',
  },

  padreMainInfo: {
    flex: 1,
    textAlign: 'center',
  },

  categoriaTexto: {
    color: '#1d1d45',
    fontWeight: '800',
    fontSize: '12px',
    textTransform: 'uppercase',
  },

  nombreDeportista: {
    color: '#1d1d45',
    fontSize: '22px',
    margin: '8px 0 0',
  },

  accesoTexto: {
    color: '#1d1d45',
    fontSize: '12px',
    margin: '2px 0 0',
  },

  gridResumen: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginTop: '18px',
    marginBottom: '18px',
  },

  entrenadorCard: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    textAlign: 'center',
    color: '#082567',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },

  resumenCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '18px',
    textAlign: 'center',
    color: '#082567',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },

  seccionTitulo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '10px',
    color: '#082567',
  },

  linkPagoCard: {
    background: 'white',
    margin: '0 10px',
    borderRadius: '14px',
    padding: '18px',
    display: 'grid',
    gridTemplateColumns: '52px 1fr 35px',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    cursor: 'pointer',
  },

  pseCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#005493',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  eventosGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    padding: '0 10px',
  },

  eventoCard: {
    background: '#0b7c61',
    color: 'white',
    borderRadius: '10px',
    height: '95px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '18px',
    fontWeight: 'bold',
  },

  portalTitleCard: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '18px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    color: '#082567',
  },

  portalIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: '#edf2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#334499',
    fontWeight: 'bold',
  },

  detalleCard: {
    background: 'white',
    margin: '14px',
    borderRadius: '16px',
    padding: '14px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  },

  badgeCategoria: {
    background: '#ff3f7f',
    color: 'white',
    borderRadius: '20px',
    padding: '8px 16px',
    fontWeight: 'bold',
    width: 'fit-content',
    margin: '0 auto 8px',
    fontSize: '12px',
    textTransform: 'uppercase',
  },

  detalleTop: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: '12px',
    alignItems: 'center',
  },

  subirFotoBox: {
    height: '110px',
    background: '#edf4ff',
    border: '1px solid #dbe4f7',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#002f7e',
    cursor: 'pointer',
    overflow: 'hidden',
  },

  fotoPreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

resumenCard: {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '18px',
  textAlign: 'center',
  color: '#082567',
  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
},

  nombreBox: {
    background: '#f7f9ff',
    border: '1px solid #dbe4f7',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',

  },

  infoLine: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e8e8ef',
    padding: '9px 4px',
    fontSize: '13px',
  },

  carnetBox: {
    marginTop: '12px',
    background: '#002366',
    color: 'white',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '25px',
  },

  qrBox: {
    background: 'white',
    color: '#002366',
    width: '58px',
    height: '58px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },

  subtituloAzul: {
    textAlign: 'center',
    color: '#002f7e',
    fontSize: '18px',
  },

  dataSection: {
    background: '#f7f9ff',
    border: '1px solid #dbe4f7',
    borderRadius: '12px',
    padding: '14px',
    marginTop: '12px',
    textAlign: 'center',
  },

  dataGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },

  dataItem: {
    background: 'white',
    border: '1px solid #dde4f5',
    borderRadius: '8px',
    padding: '12px 6px',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  pageIntro: {
    textAlign: 'center',
    color: '#6e6a7d',
    fontSize: '13px',
    padding: '0 18px',
  },

  pagoItemCard: {
    background: 'white',
    margin: '14px',
    borderRadius: '14px',
    padding: '18px',
    display: 'grid',
    gridTemplateColumns: '52px 1fr 55px',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
  },

  pagoInfo: {
    textAlign: 'center',
  },

  pagarBtn: {
    background: '#334499',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 10px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  eventoGrandeCard: {
    background: '#082567',
    color: 'white',
    margin: '14px',
    borderRadius: '14px',
    padding: '20px',
    minHeight: '95px',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
  },

  alertaProteccion: {
    background: '#eefaff',
    border: '1px dashed #008d9c',
    margin: '14px',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    textAlign: 'center',
  },

  documentoCard: {
    background: 'white',
    margin: '14px',
    borderRadius: '14px',
    padding: '18px',
    display: 'grid',
    gridTemplateColumns: '1fr 45px',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'center',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
  },

  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    height: '64px',
    background: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -4px 14px rgba(0,0,0,0.08)',
    zIndex: 20,
  },

  navItem: {
    background: 'transparent',
    border: 'none',
    color: '#1d1d45',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
  },

  navItemActivo: {
    background: 'transparent',
    border: 'none',
    color: '#334499',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
  },

  errorText: {
    color: '#b00020',
    fontSize: '13px',
  },

  logo: {
    width: '120px',
    display: 'block',
    margin: '0 auto 10px',
  },

  titulo: {
    textAlign: 'center',
    color: '#1d1d45',
    marginBottom: '5px',
  },

  subtitulo: {
    textAlign: 'center',
    color: '#777',
    marginBottom: '20px',
  },

  card: {
    background: 'white',
    borderRadius: '18px',
    padding: '18px',
    margin: '18px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  },

  sectionTitle: {
    marginTop: '20px',
    color: '#334499',
  },

  formLabel: {
    display: 'block',
    marginBottom: '14px',
  },

  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #d7def0',
    background: '#ffffff',
    color: '#082567',
    fontSize: '15px',
    outline: 'none',
  },

  legalRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '14px',
    alignItems: 'flex-start',
  },

  boton: {
    width: '100%',
    background: '#334499',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },

  botonSecundario: {
    width: 'calc(100% - 36px)',
    margin: '10px 18px',
    background: 'white',
    color: '#334499',
    border: '1px solid #334499',
    padding: '14px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  volverBtn: {
    border: 'none',
    background: 'transparent',
    color: '#334499',
    fontWeight: 'bold',
    marginBottom: '10px',
    cursor: 'pointer',
  },

  okContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },

  okCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '18px',
    textAlign: 'center',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  },

  infoBox: {
    background: '#eef4ff',
    border: '1px solid #d7e4ff',
    color: '#334499',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '15px',
  },

  adminLayout: {
    minHeight: '100vh',
    display: 'flex',
    background: '#f4f6fb',
  },

  adminSidebar: {
    width: '145px',
    background: '#002366',
    color: 'white',
    padding: '14px 10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  adminLogo: {
    width: '90px',
    margin: '0 auto 14px',
  },

  adminContent: {
    flex: 1,
    padding: '18px',
    overflowY: 'auto',
  },

  adminMenuBtn: {
    background: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    padding: '10px 8px',
    textAlign: 'left',
    fontSize: '12px',
    cursor: 'pointer',
  },

  adminMenuActivo: {
    background: 'white',
    color: '#002366',
    border: '1px solid white',
    borderRadius: '10px',
    padding: '10px 8px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  adminLogout: {
    marginTop: 'auto',
    background: '#ff3f7f',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  resumenCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '18px',
    textAlign: 'center',
    color: '#082567',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },

  adminCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },

  adminCard: {
    background: 'white',
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },

  adminPanel: {
    background: 'white',
    borderRadius: '14px',
    padding: '14px',
    marginBottom: '14px',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    overflowX: 'auto',
  },

  adminTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },

  adminTh: {
    textAlign: 'left',
    borderBottom: '1px solid #dce1ee',
    padding: '8px',
    color: '#334499',
  },

  adminTd: {
    borderBottom: '1px solid #edf0f7',
    padding: '8px',
  },

  adminListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    alignItems: 'center',
    borderBottom: '1px solid #edf0f7',
    padding: '12px 0',
  },

  adminActions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },

  adminSmallBtn: {
    background: '#334499',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
  },

  adminSmallBtnDanger: {
    background: '#ff3f7f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
  },

  adminPage: {
    minHeight: '100vh',
    background: '#f4f5fb',
    width: '100%',
    maxWidth: '430px',
  },

  adminTopbar: {
    background: '#002366',
    height: '82px',
    borderBottomLeftRadius: '18px',
    borderBottomRightRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    boxSizing: 'border-box',
  },

  menuHamburguesa: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '28px',
    cursor: 'pointer',
  },

  logoTopbar: {
    width: '82px',
  },

  adminAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#ff3f7f',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  sidebarFloating: {
    position: 'fixed',
    top: '95px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: '390px',
    background: '#002366',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 999,
    borderRadius: '18px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
    boxSizing: 'border-box',
  },

  sidebarBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    cursor: 'pointer',
  },

  sidebarBtnActive: {
    background: 'white',
    border: '1px solid white',
    color: '#002366',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '700',
    cursor: 'pointer',
  },

  sidebarLogout: {
    marginTop: 'auto',
    background: '#ff3f7f',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  adminBody: {
    width: '100%',
    padding: '14px',
    boxSizing: 'border-box',
  },

  adminOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 150,
  },

  adminOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 150,
  },

  adminShell: {
    width: '100%',
    minHeight: '100vh',
    background: '#f4f5fb',
    display: 'flex',
    justifyContent: 'center',
  },

  adminHeaderInline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },

  adminPlusBtn: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: 'none',
    background: '#334499',
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 5px 14px rgba(0,0,0,0.15)',
  },

  adminCardButton: {
    background: 'white',
    border: 'none',
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#1d1d45',
  },

  adminGrid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1d1d45',
    margin: '8px 0 14px',
  },

  agendaCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f6f7fb',
    borderRadius: '16px',
    padding: '12px',
    marginBottom: '12px',
  },

  agendaFecha: {
    width: '54px',
    height: '58px',
    borderRadius: '14px',
    background: '#334499',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  agendaContenido: {
    flex: 1,
  },

  agendaTipo: {
    color: '#ff3f7f',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  estadoSelect: {
    border: '1px solid #d9dcec',
    borderRadius: '10px',
    padding: '8px',
    minWidth: '120px',
  },

  eventoInicioCard: {
    background: '#112b7a',
    color: 'white',
    borderRadius: '10px',
    padding: '14px 12px',
    minHeight: '95px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '6px',
    textAlign: 'center',
  },

  eventoInicioTitulo: {
    fontSize: '15px',
    fontWeight: '800',
  },

  eventoInicioFecha: {
    fontSize: '13px',
    fontWeight: '700',
  },

  eventoInicioHora: {
    fontSize: '12px',
    opacity: 0.95,
  },

  eventoAcciones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
    width: '110px',
  },

  botonSecundario: {
    width: '100%',
    border: 'none',
    borderRadius: '12px',
    background: '#3554d1',
    color: '#fff',
    padding: '10px',
    fontWeight: '700',
    fontSize: '13px',
  },

  botonCancelar: {
    width: '100%',
    border: 'none',
    borderRadius: '12px',
    background: '#d64545',
    color: '#fff',
    padding: '10px',
    fontWeight: '700',
    fontSize: '13px',
  },

  novedadEvento: {
    marginTop: '10px',
    background: '#fff3cd',
    color: '#856404',
    padding: '10px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
  },

  modalInterno: {
    background: 'white',
    borderRadius: '18px',
    padding: '18px',
    margin: '16px 0',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
  },

  botonCancelarFull: {
    width: '100%',
    border: 'none',
    borderRadius: '14px',
    background: '#d64545',
    color: '#fff',
    padding: '12px',
    fontWeight: '800',
    marginTop: '10px',
  },
  historialSection: {
    marginTop: '24px',
  },

  subtituloSeccion: {
    fontSize: '18px',
    fontWeight: '800',
    marginTop: '18px',
    marginBottom: '12px',
    color: '#ffffff',
    textAlign: 'center',
  },

  cardHistorial: {
    background: '#fff',
    borderRadius: '18px',
    padding: '16px',
    marginBottom: '14px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },

  historialFecha: {
    color: '#6c757d',
    fontWeight: '700',
  },

  estadoAsistencia: {
    marginTop: '12px',
    padding: '10px',
    borderRadius: '12px',
    fontWeight: '800',
    textAlign: 'center',
  },

  asistenciaEventoPadre: {
    marginTop: '12px',
    background: '#ffffff',
    color: '#082567',
    borderRadius: '12px',
    padding: '10px',
    fontWeight: '800',
    textAlign: 'center',
  },

  menuPadre: {
    position: 'absolute',
    top: '80px',
    left: '20px',
    right: '20px',
    background: '#082567',
    borderRadius: '18px',
    padding: '16px',
    zIndex: 100,
    boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
  },

  botonFiltroEventos: {
    width: '100%',
    border: 'none',
    borderRadius: '14px',
    background: '#082567',
    color: '#fff',
    padding: '12px',
    fontWeight: '800',
    marginBottom: '14px',
  },

  asistenciaFila: {
    background: '#f4f6fb',
    borderRadius: '14px',
    padding: '12px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  asistenciaSelect: {
    width: '100%',
    border: '1px solid #d7def0',
    borderRadius: '12px',
    padding: '10px',
    fontSize: '14px',
  },

  documentoCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '18px',
    marginBottom: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },

  documentoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },

  estadoDocumento: {
    padding: '6px 12px',
    borderRadius: '999px',
    fontWeight: '700',
    fontSize: '12px',
  },

  botonVerDocumento: {
    display: 'inline-block',
    marginTop: '14px',
    background: '#082567',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
  },

  adminPanelAgenda: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
  },

  agendaAdminCard: {
    width: '100%',
    maxWidth: '560px',
    background: '#fff',
    borderRadius: '22px',
    padding: '22px',
    boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },

  agendaAdminRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #edf0f7',
    textAlign: 'left',
  },

  agendaAdminNovedad: {
    marginTop: '16px',
    color: '#c1121f',
    fontWeight: '800',
    textAlign: 'center',
  },

  eventoAcciones: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '12px',
    width: '100%',
  },
  
  botonMini: {
    flex: '1',
    minWidth: '82px',
    border: 'none',
    borderRadius: '10px',
    background: '#3949ab',
    color: '#fff',
    padding: '9px 6px',
    fontWeight: '800',
    fontSize: '12px',
  },
  
  botonMiniDanger: {
    flex: '1',
    minWidth: '82px',
    border: 'none',
    borderRadius: '10px',
    background: '#d64545',
    color: '#fff',
    padding: '9px 6px',
    fontWeight: '800',
    fontSize: '12px',
  },

  modalInternoGrande: {
    background: '#fff',
    borderRadius: '22px',
    padding: '22px',
    width: '92%',
    maxHeight: '85vh',
    overflowY: 'auto',
  },

  listaAsistencia: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '18px',
  },

  cardAsistencia: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f4f6fb',
    borderRadius: '16px',
    padding: '12px',
  },

  asistenciaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  asistenciaBtns: {
    display: 'flex',
    gap: '8px',
  },

  btnAsistio: {
    border: 'none',
    background: '#2d6a4f',
    color: '#fff',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '18px',
  },

  btnNoAsistio: {
    border: 'none',
    background: '#c1121f',
    color: '#fff',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '18px',
  },

  modalInternoGrande: {
    background: '#fff',
    borderRadius: '22px',
    padding: '22px',
    width: '92%',
    maxHeight: '85vh',
    overflowY: 'auto',
  },

};

export default App;
