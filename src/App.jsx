import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { styles } from './styles/styles';
import CrearPassword from './pages/CrearPassword';
import './App.css';
import PanelEntrenador from './pages/entrenador/PanelEntrenador';
import AdminAgenda from './pages/admin/AdminAgenda';
import AdminEquipos from './pages/admin/AdminEquipos';
import ActivarCuenta from './pages/ActivarCuenta';
import { obtenerLinksPago } from './services/pagosService';
import PanelPadre from './pages/padre/PanelPadre';
import PanelAdmin from './pages/admin/PanelAdmin';
import { iniciarSesion as loginUsuario } from './services/authService';
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

    const { data, error } = await loginUsuario(correo, password);

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
