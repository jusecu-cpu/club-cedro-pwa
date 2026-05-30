import { styles } from '../../styles/styles';

export default function EntrenadorAsistencia({
  evento,
  listaAsistencia,
  setListaAsistencia,
  guardarAsistencia,
  volver,
}) {
  return (
    <main style={styles.adminPage}>
      <header style={styles.adminTopbar}>
        <button
          style={styles.menuHamburguesa}
          onClick={volver}
        >
          ←
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          Asistencia
        </h2>

        <div style={{ width: 40 }} />
      </header>

      <section style={styles.adminBody}>
        <section
          style={{
            background:
              'linear-gradient(135deg,#e6f0ff 0%,#f8fbff 100%)',
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            boxShadow:
              '0 6px 18px rgba(7,44,143,0.08)',
            border:
              '1px solid rgba(7,44,143,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background:
                  'rgba(7,44,143,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
              }}
            >
              📅
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: '#072c8f',
                  fontSize: 26,
                  fontWeight: 800,
                }}
              >
                {evento.titulo}
              </h2>

              <span
                style={{
                  display: 'inline-block',
                  marginTop: 6,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: '#dbe7ff',
                  color: '#072c8f',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Entrenamiento
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <small
                style={{
                  color: '#64748b',
                  fontWeight: 700,
                }}
              >
                EQUIPO
              </small>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {evento.equipo?.nombre ||
                  'Sin equipo'}
              </div>
            </div>

            <div>
              <small
                style={{
                  color: '#64748b',
                  fontWeight: 700,
                }}
              >
                FECHA
              </small>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {evento.fecha}
              </div>
            </div>
          </div>
        </section>

        <button
          style={{
            width: '100%',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 18,
            padding: 16,
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 18,
            cursor: 'pointer',
          }}
          onClick={() =>
            setListaAsistencia(
              listaAsistencia.map((item) => ({
                ...item,
                asistio: true,
                novedad: '',
              }))
            )
          }
        >
          ✅ Marcar todos presentes
        </button>

        {listaAsistencia.map((item, index) => (
          <div
            key={item.deportista_id}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              boxShadow:
                '0 4px 10px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {item.foto_url ? (
                <img
                  src={item.foto_url}
                  alt={item.nombre}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#072c8f',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {item.nombre?.charAt(0)}
                </div>
              )}

              <div style={{ flex: 1 }}>
                <strong>{item.nombre}</strong>
                <br />
                <small>{item.documento}</small>
              </div>

              <button
                type="button"
                onClick={() => {
                  const copia = [...listaAsistencia];

                  copia[index].asistio =
                    !copia[index].asistio;

                  if (copia[index].asistio) {
                    copia[index].novedad = '';
                  }

                  setListaAsistencia(copia);
                }}
                style={{
                  width: 54,
                  height: 30,
                  borderRadius: 999,
                  border: 'none',
                  background: item.asistio
                    ? '#16a34a'
                    : '#dc2626',
                  padding: 3,
                  display: 'flex',
                  justifyContent: item.asistio
                    ? 'flex-end'
                    : 'flex-start',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#fff',
                  }}
                />
              </button>
            </div>

            {!item.asistio && (
              <textarea
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 10,
                  border: '1px solid #ddd',
                }}
                placeholder="Motivo de ausencia"
                value={item.novedad}
                onChange={(e) => {
                  const copia = [...listaAsistencia];
                  copia[index].novedad =
                    e.target.value;
                  setListaAsistencia(copia);
                }}
              />
            )}
          </div>
        ))}

        <button
          style={styles.boton}
          onClick={guardarAsistencia}
        >
          Guardar asistencia
        </button>
      </section>
    </main>
  );
}