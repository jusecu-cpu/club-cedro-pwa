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
        fecha_inactivacion,
        sede_id,
        categoria_id,
        entrenador_id
      `)
      .in('estado', ['inactivo', 'inactiva', 'Inactivo', 'Inactiva'])
      .order('fecha_inactivacion', { ascending: false });

    if (error) {
      console.error('ERROR RETIROS:', error);
      alert(JSON.stringify(error, null, 2));
      setDeportistas([]);
      setCargando(false);
      return;
    }

    const sedeIds = [...new Set((data || []).map((d) => d.sede_id).filter(Boolean))];
    const categoriaIds = [...new Set((data || []).map((d) => d.categoria_id).filter(Boolean))];
    const entrenadorIds = [...new Set((data || []).map((d) => d.entrenador_id).filter(Boolean))];

    const { data: sedesData } = sedeIds.length
      ? await supabase.from('sedes').select('id, nombre_corto').in('id', sedeIds)
      : { data: [] };

    const { data: categoriasData } = categoriaIds.length
      ? await supabase.from('categorias').select('id, categoria').in('id', categoriaIds)
      : { data: [] };

    const { data: entrenadoresData } = entrenadorIds.length
      ? await supabase.from('entrenadores').select('id, nombres_completos').in('id', entrenadorIds)
      : { data: [] };

    const sedesMap = {};
    (sedesData || []).forEach((s) => {
      sedesMap[s.id] = s.nombre_corto;
    });

    const categoriasMap = {};
    (categoriasData || []).forEach((c) => {
      categoriasMap[c.id] = c.categoria;
    });

    const entrenadoresMap = {};
    (entrenadoresData || []).forEach((e) => {
      entrenadoresMap[e.id] = e.nombres_completos;
    });

    const enriquecidos = (data || []).map((dep) => ({
      ...dep,
      sede_nombre: sedesMap[dep.sede_id] || 'Sin sede',
      categoria_nombre: categoriasMap[dep.categoria_id] || 'Sin categoría',
      entrenador_nombre: entrenadoresMap[dep.entrenador_id] || 'Sin entrenador',
    }));

    setDeportistas(enriquecidos);
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

                <p>
                  {dep.categoria_nombre} · {dep.sede_nombre}
                </p>

                <small>
                  Documento: {dep.deportista_documento || 'Sin documento'}
                  <br />
                  Entrenador: {dep.entrenador_nombre}
                </small>

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