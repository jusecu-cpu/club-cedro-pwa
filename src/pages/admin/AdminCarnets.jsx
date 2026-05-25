import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';
import logo from '../../assets/logo.png';

export default function AdminCarnets() {
  const [tipo, setTipo] = useState('deportistas');
  const [personas, setPersonas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarPersonas();
  }, [tipo]);

  async function cargarPersonas() {
    setLoading(true);

    let query = supabase.from(tipo).select('*');

    if (tipo === 'entrenadores') {
      query = query.order('nombres_completos');
    }

    if (tipo === 'deportistas') {
      query = query.order('deportista_nombre');
    }

    if (tipo === 'perfiles') {
      query = query.eq('rol', 'admin');
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert('No se pudieron cargar los registros');
      setLoading(false);
      return;
    }

    setPersonas(data || []);
    setLoading(false);
  }

  function nombrePersona(p) {
    if (tipo === 'deportistas') return p.deportista_nombre;
    if (tipo === 'entrenadores') return p.nombres_completos;
return p.nombres || p.nombre || p.correo_electronico || p.email;
  }

  function documentoPersona(p) {
    if (tipo === 'deportistas') return p.deportista_documento;
return p.documento_identidad || p.documento || p.id;
    if (tipo === 'entrenadores') return p.documento;
    return p.id;
  }

  const filtrados = personas.filter((p) => {
    const texto = `
      ${nombrePersona(p) || ''}
      ${documentoPersona(p) || ''}
    `.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  if (seleccionado) {
    return (
      <>
        <button
          style={styles.volverBtn}
          onClick={() => setSeleccionado(null)}
        >
          ← Volver
        </button>

        <h1 style={styles.adminTitle}>Carnet</h1>

        <section
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: 24,
            maxWidth: 380,
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={logo}
              alt="Club Cedro"
              style={{
                width: 120,
                marginBottom: 20,
              }}
            />

            
             {seleccionado.foto_url ? (
                <img
                  src={seleccionado.foto_url}
                  alt="Foto"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: 20,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    fontWeight: 'bold',
                    color: '#999',
                  }}
                >
                  👤
                </div>
              )}

            <h2>{nombrePersona(seleccionado)}</h2>
            <p>
              Documento: {documentoPersona(seleccionado)} </p>
            <p>Celular: {seleccionado.celular || '-'}</p>
            <p>Correo: {seleccionado.correo_electronico || seleccionado.email || '-'}</p>
            <p>EPS: {seleccionado.eps || '-'}</p>

            {tipo === 'deportistas' && (
              <>
                <p>
                  Categoría: {seleccionado.categoria || '-'}
                </p>

                <p>
                  Estado: {seleccionado.estado || '-'}
                </p>
              </>
            )}

            {tipo === 'entrenadores' && (
              <>
                <p>
                  Cargo: Entrenador
                </p>

                <p>
                  Estado: {seleccionado.estado || '-'}
                </p>
              </>
            )}

            {tipo === 'perfiles' && (
              <>
                <p>
                  Rol: Admin
                </p>

                <p>
                  Correo: {seleccionado.email}
                </p>
              </>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Carnets</h1>

      <section style={styles.adminPanel}>
        <select
          style={styles.input}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="deportistas">Deportistas</option>
          <option value="entrenadores">Entrenadores</option>
          <option value="perfiles">Admins</option>
        </select>

        <input
          style={styles.input}
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {loading && <p>Cargando...</p>}

        {!loading &&
          filtrados.map((p) => (
            <div
              key={p.id}
              style={styles.adminListItem}
              onClick={() => setSeleccionado(p)}
            >
              <div>
                <strong>{nombrePersona(p)}</strong>

                <p>{documentoPersona(p)}</p>
              </div>

              <button style={styles.adminSmallBtn}>
                Ver carnet
              </button>
            </div>
          ))}
      </section>
    </>
  );
}