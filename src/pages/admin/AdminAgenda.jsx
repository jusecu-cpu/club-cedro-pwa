export default function AdminAgenda() {
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
  