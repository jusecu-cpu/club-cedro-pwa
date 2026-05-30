import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

export default function EntrenadorDocs({ deportistas = [] }) {
  const [verPolizas, setVerPolizas] = useState(false);
  const [coberturas, setCoberturas] = useState([]);

  useEffect(() => {
    cargarCoberturas();
  }, [deportistas]);

  async function cargarCoberturas() {
    const { data, error } = await supabase
      .from('deportista_coberturas')
      .select('deportista_documento, fecha_inicio, fecha_fin, estado')
      .eq('estado', 'activo');

    if (error) {
      console.error(error);
      setCoberturas([]);
      return;
    }

    setCoberturas(data || []);
  }

  function tieneCobertura(dep) {
    return coberturas.some(
      (c) =>
        String(c.deportista_documento).trim() ===
        String(dep.deportista_documento).trim()
    );
  }

  function coberturaDe(dep) {
    return coberturas.find(
      (c) =>
        String(c.deportista_documento).trim() ===
        String(dep.deportista_documento).trim()
    );
  }

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
      <h1 style={{ ...styles.adminTitle, fontSize: 26 }}>
        Documentos
      </h1>

      <section style={{ ...styles.alertaProteccion, padding: 18 }}>
        <div style={{ ...styles.portalIcon, fontSize: 24 }}>🛡️</div>

        <div>
          <h3 style={{ margin: 0, fontSize: 17 }}>
            Programa Protección Deportiva
          </h3>

          <p style={{ margin: '6px 0', fontSize: 13 }}>
            Número de póliza 1000092
            <br />
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
              }}
            >
              Ver
            </a>
          </article>
        ))}
      </section>

      <section style={{ ...styles.adminPanel, marginTop: 18 }}>
        <button
          style={styles.boton}
          onClick={() => setVerPolizas(!verPolizas)}
        >
          {verPolizas ? 'Ocultar deportistas con póliza' : 'Ver deportistas con póliza'}
        </button>

        {verPolizas && (
          <div style={{ marginTop: 18 }}>
            <h2 style={{ fontSize: 18 }}>
              Estado de cobertura
            </h2>

            {deportistas.map((dep) => {
              const activa = tieneCobertura(dep);
              const cobertura = coberturaDe(dep);

              return (
                <div
                  key={dep.id}
                  style={{
                    background: activa ? '#e8f8ee' : '#fee2e2',
                    border: activa
                      ? '1px solid #22c55e'
                      : '1px solid #ef4444',
                    color: activa ? '#15803d' : '#b91c1c',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div>
                    <strong>{dep.deportista_nombre}</strong>
                    <br />
                    <small>{dep.deportista_documento}</small>

                    {activa && cobertura && (
                      <small style={{ display: 'block', marginTop: 4 }}>
                        Vigencia: {cobertura.fecha_inicio} al {cobertura.fecha_fin}
                      </small>
                    )}
                  </div>

                  <strong>
                    {activa ? 'Activo' : 'Sin cobertura'}
                  </strong>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}