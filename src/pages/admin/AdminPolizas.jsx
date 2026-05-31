import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

const FECHA_INICIO = '2026-02-15';
const FECHA_FIN = '2026-12-15';

export default function AdminPolizas() {
  const [deportistas, setDeportistas] = useState([]);
  const [coberturas, setCoberturas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);

    const [deportistasRes, coberturasRes] = await Promise.all([
      supabase
        .from('deportistas')
        .select(`
          id,
          deportista_nombre,
          deportista_documento,
          foto_url,
          estado,
          sede:sedes(nombre_corto),
          categoria:categorias(categoria)
        `)
        .order('deportista_nombre'),

      supabase
        .from('deportista_coberturas')
        .select('*')
        .eq('estado', 'activo'),
    ]);

    if (deportistasRes.error) {
      console.error(deportistasRes.error);
      alert('No se pudieron cargar deportistas.');
    }

    if (coberturasRes.error) {
      console.error(coberturasRes.error);
      alert('No se pudieron cargar coberturas.');
    }

    setDeportistas(deportistasRes.data || []);
    setCoberturas(coberturasRes.data || []);
    setCargando(false);
  }

  function tieneCobertura(dep) {
    return coberturas.some(
      (c) =>
        String(c.deportista_documento).trim() ===
        String(dep.deportista_documento).trim()
    );
  }

  async function activarPoliza(dep) {
    const confirmar = confirm(
      `¿Activar póliza para ${dep.deportista_nombre}?`
    );

    if (!confirmar) return;

    const yaTiene = tieneCobertura(dep);

    if (yaTiene) {
      alert('Esta deportista ya tiene póliza activa.');
      return;
    }

    const { error } = await supabase
      .from('deportista_coberturas')
      .insert([
        {
          deportista_documento: dep.deportista_documento,
          fecha_inicio: FECHA_INICIO,
          fecha_fin: FECHA_FIN,
          estado: 'activo',
        },
      ]);

    if (error) {
      console.error(error);
      alert(error.message || 'No se pudo activar la póliza.');
      return;
    }

    alert('Póliza activada correctamente.');
    cargarDatos();
  }

  const deportistasFiltrados = deportistas.filter((dep) => {
    const texto = busqueda.toLowerCase();
  
    return (
      dep.deportista_nombre?.toLowerCase().includes(texto) ||
      String(dep.deportista_documento || '')
        .toLowerCase()
        .includes(texto)
    );
  });

  const activas = deportistasFiltrados.filter(tieneCobertura);

const sinCobertura = deportistasFiltrados.filter(
  (dep) => !tieneCobertura(dep)
);

  if (cargando) {
    return (
      <>
        <h1 style={styles.adminTitle}>Pólizas</h1>
        <section style={styles.adminPanel}>
          <p>Cargando pólizas...</p>
        </section>
      </>
    );
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Pólizas</h1>

      <section style={styles.adminPanel}>
  <input
    type="text"
    placeholder="Buscar por nombre o documento..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    style={{
      width: '100%',
      padding: 14,
      borderRadius: 12,
      border: '1px solid #d1d5db',
      fontSize: 15,
    }}
  />
</section>

      <section style={styles.adminCardsGrid}>
        <div style={styles.adminCardButton}>
          <p>Activas</p>
          <h2>{activas.length}</h2>
        </div>

        <div style={styles.adminCardButton}>
          <p>Sin cobertura</p>
          <h2>{sinCobertura.length}</h2>
        </div>
      </section>

      <section style={styles.adminPanel}>
        <h2>Sin cobertura</h2>

        {sinCobertura.length === 0 && (
          <p>Todos los deportistas tienen póliza activa.</p>
        )}

        {sinCobertura.map((dep) => (
          <div key={dep.id} style={styles.adminListItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {dep.foto_url ? (
                <img
                  src={dep.foto_url}
                  alt={dep.deportista_nombre}
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
                    fontWeight: 800,
                  }}
                >
                  {dep.deportista_nombre?.charAt(0) || 'D'}
                </div>
              )}

              <div>
                <strong>{dep.deportista_nombre}</strong>
                <p>
                  {dep.categoria?.categoria || 'Sin categoría'} ·{' '}
                  {dep.sede?.nombre_corto || 'Sin sede'}
                </p>
                <small>Documento: {dep.deportista_documento}</small>
              </div>
            </div>

            <button
              style={styles.adminSmallBtn}
              onClick={() => activarPoliza(dep)}
            >
              Activar
            </button>
          </div>
        ))}
      </section>

      <section style={styles.adminPanel}>
        <h2>Con póliza activa</h2>

        {activas.map((dep) => (
          <div key={dep.id} style={styles.adminListItem}>
            <div>
              <strong>{dep.deportista_nombre}</strong>
              <p>
                {dep.categoria?.categoria || 'Sin categoría'} ·{' '}
                {dep.sede?.nombre_corto || 'Sin sede'}
              </p>
              <small>Documento: {dep.deportista_documento}</small>
            </div>

            <strong style={{ color: '#16a34a' }}>Activo</strong>
          </div>
        ))}
      </section>
    </>
  );
}