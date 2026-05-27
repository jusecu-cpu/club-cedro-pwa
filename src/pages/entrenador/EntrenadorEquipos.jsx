import { styles } from '../../styles/styles';

export default function EntrenadorEquipos({
   equipos,
  mostrarCrearEquipo,
  setMostrarCrearEquipo,
  nuevoEquipoEntrenador,
  setNuevoEquipoEntrenador,
  sedesEntrenador,
  categoriasEntrenador,
  crearEquipoEntrenador,
  cargarEquipoDetalle,
}) {
  return (
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
  );
}