import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

export default function AdminRetiros() {
  const [deportistas, setDeportistas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarRetiros();
  }, []);

  async function cargarRetiros() {
    setCargando(true);

    const { data, error } = await supabase
      .from('deportistas')
      .select(`
        id,
        deportista_nombre,
        deportista_documento,
        estado,
        motivo_inactivacion,
        nota_admin,
        fecha_inactivacion
      `)
      .in('estado', ['inactivo', 'inactiva', 'Inactivo', 'Inactiva'])
      .order('fecha_inactivacion', { ascending: false });

    if (error) {
      console.error('ERROR RETIROS:', error);
      alert(JSON.stringify(error, null, 2));
      setDeportistas([]);
    } else {
      setDeportistas(data || []);
    }

    setCargando(false);
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Retiros / Inactivas</h1>

      <section style={styles.adminPanel}>
        {cargando && <p>Cargando retiros...</p>}

        {!cargando && deportistas.length === 0 && (
          <p>No hay deportistas inactivas registradas.</p>
        )}

        {!cargando &&
          deportistas.map((dep) => (
            <div key={dep.id} style={styles.adminListItem}>
              <div>
                <strong>{dep.deportista_nombre}</strong>

                <p>Documento: {dep.deportista_documento || 'Sin documento'}</p>

                <p>
                  <strong>Motivo:</strong>{' '}
                  {dep.motivo_inactivacion || 'Sin motivo registrado'}
                </p>

                <p>
                  <strong>Nota admin:</strong> {dep.nota_admin || 'Sin nota'}
                </p>

                <small>
                  Fecha:{' '}
                  {dep.fecha_inactivacion
                    ? new Date(dep.fecha_inactivacion).toLocaleString('es-CO')
                    : 'Sin fecha'}
                </small>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}