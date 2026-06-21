import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

export default function AdminMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMovimientos();
  }, []);

  async function cargarMovimientos() {
    setCargando(true);

    const { data, error } = await supabase
      .from('deportista_movimientos')
      .select(`
        id,
        tipo_movimiento,
        motivo,
        nota_admin,
        created_at,
        deportista:deportistas(
          deportista_nombre,
          deportista_documento
        ),
        entrenador_origen:entrenadores!deportista_movimientos_entrenador_origen_id_fkey(
          nombres_completos
        ),
        entrenador_destino:entrenadores!deportista_movimientos_entrenador_destino_id_fkey(
          nombres_completos
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      alert(JSON.stringify(error, null, 2));
      setMovimientos([]);
    } else {
      setMovimientos(data || []);
    }

    setCargando(false);
  }

  function tipoTexto(tipo) {
    if (tipo === 'cambio_entrenador') return 'Cambio de entrenador';
    if (tipo === 'inactivacion') return 'Inactivación';
    return tipo || 'Movimiento';
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Movimientos deportivos</h1>

      <section style={styles.adminPanel}>
        {cargando && <p>Cargando movimientos...</p>}

        {!cargando && movimientos.length === 0 && (
          <p>No hay movimientos registrados.</p>
        )}

        {!cargando &&
          movimientos.map((mov) => (
            <div key={mov.id} style={styles.adminListItem}>
              <div>
                <strong>
                  {mov.deportista?.deportista_nombre || 'Sin deportista'}
                </strong>

                <p>
                  Documento:{' '}
                  {mov.deportista?.deportista_documento || 'Sin documento'}
                </p>

                <p>
                  <strong>Movimiento:</strong> {tipoTexto(mov.tipo_movimiento)}
                </p>

                <p>
                  <strong>Origen:</strong>{' '}
                  {mov.entrenador_origen?.nombres_completos || 'No aplica'}
                </p>

                <p>
                  <strong>Destino:</strong>{' '}
                  {mov.entrenador_destino?.nombres_completos || 'No aplica'}
                </p>

                <p>
                  <strong>Motivo:</strong> {mov.motivo || 'Sin motivo'}
                </p>

                <p>
                  <strong>Nota admin:</strong> {mov.nota_admin || 'Sin nota'}
                </p>

                <small>
                  Fecha:{' '}
                  {mov.created_at
                    ? new Date(mov.created_at).toLocaleString('es-CO')
                    : 'Sin fecha'}
                </small>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}