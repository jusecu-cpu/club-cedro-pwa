import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';
import logo from '../../assets/logo.png';
import AdminDeportistas from './AdminDeportistas';
import AdminEquipos from './AdminEquipos';
import AdminAgenda from './AdminAgenda';
import AdminCarnets from './AdminCarnets';
import AdminPolizas from './AdminPolizas';
import AdminMovimientos from './AdminMovimientos';
import AdminRetiros from './AdminRetiros';

export default function PanelAdmin({ setPantalla, setUsuario, setPerfil }) {
    const [menuAdmin, setMenuAdmin] = useState('dashboard');
    const [menuAbierto, setMenuAbierto] = useState(window.innerWidth >= 900);
    const [resumen, setResumen] = useState({
        sedes: 0,
        entrenadores: 0,
        deportistas: 0,
        categorias: 0,
        solicitudes: 0,
        activas: 0,
        inactivas: 0,
        sinEntrenador: 0,
      });

    const [porSede, setPorSede] = useState([]);
    const [porEntrenador, setPorEntrenador] = useState([]);
    const [porCategoria, setPorCategoria] = useState([]);
    const [entrenadores, setEntrenadores] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        cargarAdmin();
    }, []);

    useEffect(() => {
        function ajustarMenu() {
          setMenuAbierto(window.innerWidth >= 900);
        }
      
        window.addEventListener('resize', ajustarMenu);
        return () => window.removeEventListener('resize', ajustarMenu);
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
          sedesData,
        ] = await Promise.all([
          supabase.from('sedes').select('*', { count: 'exact', head: true }),
          supabase.from('entrenadores').select('*', { count: 'exact', head: true }),
          supabase.from('deportistas').select('*', { count: 'exact', head: true }),
          supabase.from('categorias').select('*', { count: 'exact', head: true }),
          supabase.from('solicitudes_inscripcion').select('*', { count: 'exact', head: true }),
      
          supabase.from('deportistas').select(`
            id,
            deportista_nombre,
            estado,
            sede_id,
            entrenador_id,
            categoria_id
          `),
      
          supabase.from('entrenadores').select('*').order('nombres_completos'),
          supabase.from('categorias').select('*').order('categoria'),
          supabase.from('sedes').select('*').order('nombre_corto'),
        ]);
      
        const deportistas = deportistasData.data || [];
      
        const activas = deportistas.filter((d) => {
          const estado = String(d.estado || '').toLowerCase().trim();
          return estado === 'activo' || estado === 'activa' || estado === '';
        }).length;
      
        const inactivas = deportistas.filter((d) => {
          const estado = String(d.estado || '').toLowerCase().trim();
          return estado === 'inactivo' || estado === 'inactiva';
        }).length;
      
        const sinEntrenador = deportistas.filter((d) => !d.entrenador_id).length;
      
        setResumen({
          sedes: sedesRes.count || 0,
          entrenadores: entrenadoresRes.count || 0,
          deportistas: deportistasRes.count || 0,
          categorias: categoriasRes.count || 0,
          solicitudes: solicitudesRes.count || 0,
          activas,
          inactivas,
          sinEntrenador,
        });
      
        setEntrenadores(entrenadoresData.data || []);
        setCategorias(categoriasData.data || []);
      
        const entrenadoresMap = {};
        (entrenadoresData.data || []).forEach((e) => {
          entrenadoresMap[e.id] = e.nombres_completos;
        });
      
        const categoriasMap = {};
        (categoriasData.data || []).forEach((c) => {
          categoriasMap[c.id] = c.categoria;
        });
      
        const sedesMap = {};
        (sedesData.data || []).forEach((s) => {
          sedesMap[s.id] = s.nombre_corto;
        });
      
        setPorSede(
          agrupar(deportistas, (d) => sedesMap[d.sede_id] || 'Sin sede')
        );
      
        setPorEntrenador(
          agrupar(
            deportistas,
            (d) => entrenadoresMap[d.entrenador_id] || 'Sin entrenador'
          )
        );
      
        setPorCategoria(
          agrupar(
            deportistas,
            (d) => categoriasMap[d.categoria_id] || 'Sin categoría'
          )
        );
      }


      function agrupar(lista, campoFn) {
        const mapa = {};
      
        lista.forEach((item) => {
          const key = campoFn(item);
          mapa[key] = (mapa[key] || 0) + 1;
        });
      
        return Object.entries(mapa)
          .map(([nombre, total]) => ({
            nombre,
            total,
          }))
          .sort((a, b) => b.total - a.total);
      }


    async function cerrarSesion() {
        await supabase.auth.signOut();
        setUsuario(null);
        setPerfil(null);
        setPantalla('login');
    }

    return (
        <main style={styles.adminPage}>
                <header
                className={menuAbierto ? 'admin-topbar-with-sidebar' : ''}
                style={styles.adminTopbar}
                >                
                <button
                    style={styles.menuHamburguesa}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    ☰
                </button>

                <img src={logo} alt="Club Cedro" style={styles.logoTopbar} />

                <div style={styles.adminAvatar}>A</div>
            </header>
            {menuAbierto && window.innerWidth < 900 && (
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
                        menuAdmin === 'deportistas'
                        ? styles.sidebarBtnActive
                        : styles.sidebarBtn
                    }
                    onClick={() => {
                        setMenuAdmin('deportistas');
                        setMenuAbierto(false);
                    }}
                    >
                    👥 Deportistas
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
                        style={menuAdmin === 'polizas' ? styles.sidebarBtnActive : styles.sidebarBtn}
                        onClick={() => {
                            setMenuAdmin('polizas');
                            setMenuAbierto(false);
                        }}
                        >
                        🛡️ Pólizas
                        </button>   

                          <button
                            style={
                                menuAdmin === 'movimientos'
                                ? styles.sidebarBtnActive
                                : styles.sidebarBtn
                            }
                            onClick={() => {
                                setMenuAdmin('movimientos');
                                setMenuAbierto(false);
                            }}
                            >
                            🔁 Movimientos
                            </button>   

                            <button
                            style={
                                menuAdmin === 'retiros'
                                ? styles.sidebarBtnActive
                                : styles.sidebarBtn
                            }
                            onClick={() => {
                                setMenuAdmin('retiros');
                                setMenuAbierto(false);
                            }}
                            >
                            🚪 Retiros
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

                <section
                className={menuAbierto ? 'admin-with-sidebar' : ''}
                style={styles.adminBody}
>                {menuAdmin === 'dashboard' && (
                    <AdminDashboard
                    resumen={resumen}
                    porSede={porSede}
                    porEntrenador={porEntrenador}
                    porCategoria={porCategoria}
                    setMenuAdmin={setMenuAdmin}
                  />
                    
                    
                )}

                {menuAdmin === 'deportistas' && (
                <AdminDeportistas />
                )}

                {menuAdmin === 'aprobaciones' && <AdminAprobaciones />}
                {menuAdmin === 'nuevoDeportista' && (
                <RegistroDeportistaAdmin />
                )}
                               
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
                {menuAdmin === 'polizas' && <AdminPolizas />}
                {menuAdmin === 'movimientos' && <AdminMovimientos />}
                {menuAdmin === 'retiros' && <AdminRetiros />}
                {menuAdmin === 'carnets' && <AdminCarnets />}
                {menuAdmin === 'sedes' && (
                <>
                    <h1 style={styles.adminTitle}>Sedes</h1>
                    <section style={styles.adminPanel}>
                    <p>Módulo sedes en construcción.</p>
                    </section>
                </>
                )} 

                {menuAdmin === 'docs' && <AdminDocs />}
            </section>
        </main>
    );
}

function AdminDashboard({
    resumen,
    porSede,
    porEntrenador,
    porCategoria,
    setMenuAdmin,
  }) {
    return (
        <>
            <div
            style={{
                marginBottom: 20,
            }}
            >
            <h1 style={styles.adminTitle}>
                Dashboard Ejecutivo
            </h1>

            <p
                style={{
                color: '#666',
                marginTop: -10,
                }}
            >
                Resumen general Club Cedro
            </p>
            </div>

            <section style={styles.adminCardsGrid}>
            <AdminCard
                titulo="Activas"
                valor={resumen.activas}
                onClick={() => setMenuAdmin('deportistas')}
            />

            <AdminCard
                titulo="Inactivas"
                valor={resumen.inactivas}
                onClick={() => setMenuAdmin('retiros')}
            />

            <AdminCard
                titulo="Solicitudes"
                valor={resumen.solicitudes}
                onClick={() => setMenuAdmin('aprobaciones')}
            />

            <AdminCard
                titulo="Sin entrenador"
                valor={resumen.sinEntrenador}
                onClick={() => setMenuAdmin('deportistas')}
            />

            <AdminCard
                titulo="Sedes"
                valor={resumen.sedes}
                onClick={() => setMenuAdmin('sedes')}
            />

            <AdminCard
                titulo="Entrenadores"
                valor={resumen.entrenadores}
                onClick={() => setMenuAdmin('entrenadores')}
            />
            </section>
            <div className="admin-dashboard-tables">
            <AdminTabla titulo="Deportistas por sede" data={porSede} />
            <AdminTabla titulo="Deportistas por entrenador" data={porEntrenador} />
            <AdminTabla titulo="Deportistas por categoría" data={porCategoria} />
            </div>
        </>
    );
}

function AdminCard({ titulo, valor, onClick }) {
    return (
      <div
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #072c8f 0%, #1f4ed8 100%)',
          color: '#fff',
          borderRadius: 18,
          padding: 14,
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: '0 10px 22px rgba(7,44,143,.18)',
          minHeight: 96,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 800 }}>{titulo}</span>
  
        <h2
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 900,
            lineHeight: 1,
            color: '#fff',
          }}
        >
          {valor}
        </h2>
      </div>
    );
  }


  function AdminTabla({ titulo, data }) {
    return (
      <section
        style={{
          ...styles.adminPanel,
          overflowX: 'auto',
        }}
      >
        <h2
          style={{
            fontSize: 18,
            color: '#072c8f',
            marginBottom: 12,
          }}
        >
          {titulo}
        </h2>
  
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: '#072c8f', padding: 8 }}>
                #
              </th>
              <th style={{ textAlign: 'left', color: '#072c8f', padding: 8 }}>
                Nombre
              </th>
              <th style={{ textAlign: 'right', color: '#072c8f', padding: 8 }}>
                Total
              </th>
            </tr>
          </thead>
  
          <tbody>
            {data.length === 0 && (
              <tr>
                <td style={styles.adminTd} colSpan="3">
                  Sin datos
                </td>
              </tr>
            )}
  
                {data.slice(0, 10).map((item, index) => (
                  <tr key={item.nombre}>
                <td style={{ padding: 8 }}>{index + 1}</td>
                <td style={{ padding: 8 }}>{item.nombre}</td>
                <td style={{ padding: 8, textAlign: 'right', fontWeight: 700 }}>
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 10 && (
  <p
    style={{
      textAlign: 'center',
      color: '#072c8f',
      fontWeight: 800,
      fontSize: 13,
      marginTop: 12,
    }}
  >
    Mostrando 10 de {data.length}
  </p>
)}
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

function AdminDocs() {
    const documentos = [
      {
        icono: '🛡️',
        titulo: 'Resumen protección deportiva',
        descripcion: 'Resumen general del programa para deportistas.',
        archivo: '/docs/resumen-proteccion.pdf',
      },
      {
        icono: '📘',
        titulo: 'Condicionado de asistencia',
        descripcion: 'Detalle de condiciones, límites y exclusiones.',
        archivo: '/docs/condicionado-asistencia.pdf',
      },
      {
        icono: '📄',
        titulo: 'Slip póliza de seguros',
        descripcion: 'Coberturas principales de la póliza.',
        archivo: '/docs/slip-poliza.pdf',
      },
    ];
  
    return (
      <>
        <h1 style={{ ...styles.adminTitle, fontSize: 26, lineHeight: 1.05 }}>
          Documentos
        </h1>
  
        <section
          style={{
            ...styles.alertaProteccion,
            padding: 18,
            borderRadius: 18,
            alignItems: 'center',
          }}
        >
          <div style={{ ...styles.portalIcon, fontSize: 24 }}>🛡️</div>
  
          <div>
            <h3 style={{ margin: 0, fontSize: 17 }}>
              Programa Protección Deportiva
            </h3>
            <p style={{ margin: '6px 0', fontSize: 13 }}>
              Número de póliza 1000092     
              Línea de atención: 601-744-3718
            </p>
            <small>Solicitar autorización antes de acudir.</small>
          </div>
        </section>
  
        <section style={{ display: 'grid', gap: 14 }}>
          {documentos.map((doc) => (
            <article
              key={doc.titulo}
              style={{
                background: '#fff',
                borderRadius: 18,
                padding: 18,
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 26 }}>{doc.icono}</div>
  
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>
                    {doc.titulo}
                  </h3>
                  <p style={{ margin: '6px 0 0', fontSize: 13 }}>
                    {doc.descripcion}
                  </p>
                </div>
              </div>
  
              <a
                href={doc.archivo}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#253a9b',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                Ver
              </a>
            </article>
          ))}
        </section>
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