import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';
import logo from '../../assets/logo.png';
import {
  obtenerEventosDeportista,
  obtenerAsistenciaDeportista,
} from '../../services/agendaService';


export default function PanelPadre({ usuario, perfil, setPantalla, setUsuario, setPerfil }) {    const [deportista, setDeportista] = useState(null);
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
  
      const { data, error } = await obtenerEventosDeportista(deportista.id);
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
  
      const {
        data: asistenciaData,
        error: asistenciaError,
      } = await obtenerAsistenciaDeportista(deportista.id);
  
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
  