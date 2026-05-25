import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

export default function AdminDeportistas() {
  const [deportistas, setDeportistas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDeportistas();
  }, []);

  async function cargarDeportistas() {
    setLoading(true);

    const { data, error } = await supabase
      .from('deportistas')
      .select('*')
      .order('deportista_nombre', { ascending: true });

    if (error) {
      console.error(error);
      alert('No se pudieron cargar los deportistas');
      setLoading(false);
      return;
    }

    setDeportistas(data || []);
    setLoading(false);
  }

  async function guardarCambios() {
    setGuardando(true);

    const { error } = await supabase
      .from('deportistas')
      .update({
        acudiente_nombre: seleccionado.acudiente_nombre,
        acudiente_documento: seleccionado.acudiente_documento,
        acudiente_correo: seleccionado.acudiente_correo,
        acudiente_celular: seleccionado.acudiente_celular,
        acudiente_parentesco: seleccionado.acudiente_parentesco,
        deportista_nombre: seleccionado.deportista_nombre,
        deportista_documento: seleccionado.deportista_documento,
        pais: seleccionado.pais,
        fecha_nacimiento: seleccionado.fecha_nacimiento,
        direccion_vivienda: seleccionado.direccion_vivienda,
        sexo: seleccionado.sexo,
        colegio: seleccionado.colegio,
        eps: seleccionado.eps,
        rh: seleccionado.rh,
        alergias: seleccionado.alergias,
        observaciones_medicas: seleccionado.observaciones_medicas,
        estado: seleccionado.estado,
      })
      .eq('id', seleccionado.id);

    setGuardando(false);

    if (error) {
      console.error(error);
      alert('No se pudo actualizar el deportista');
      return;
    }

    alert('Deportista actualizado correctamente');
    setSeleccionado(null);
    cargarDeportistas();
  }

  function cambiar(campo, valor) {
    setSeleccionado({
      ...seleccionado,
      [campo]: valor,
    });
  }

  const deportistasFiltrados = deportistas.filter((dep) => {
    const texto = `
      ${dep.deportista_nombre || ''}
      ${dep.deportista_documento || ''}
      ${dep.acudiente_nombre || ''}
      ${dep.acudiente_correo || ''}
    `.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  if (seleccionado) {
    return (
      <>
        <button style={styles.volverBtn} onClick={() => setSeleccionado(null)}>
          ← Volver a deportistas
        </button>

        <h1 style={styles.adminTitle}>Detalle deportista</h1>

        <section style={styles.adminPanel}>
          <h2>{seleccionado.deportista_nombre}</h2>

          <h3>Datos del deportista</h3>

          <Campo label="Nombre deportista" value={seleccionado.deportista_nombre} onChange={(v) => cambiar('deportista_nombre', v)} />
          <Campo label="Documento deportista" value={seleccionado.deportista_documento} onChange={(v) => cambiar('deportista_documento', v)} />
          <Campo label="País" value={seleccionado.pais} onChange={(v) => cambiar('pais', v)} />
          <Campo label="Fecha nacimiento" type="date" value={seleccionado.fecha_nacimiento} onChange={(v) => cambiar('fecha_nacimiento', v)} />
          <Campo label="Dirección vivienda" value={seleccionado.direccion_vivienda} onChange={(v) => cambiar('direccion_vivienda', v)} />
          <Campo label="Sexo" value={seleccionado.sexo} onChange={(v) => cambiar('sexo', v)} />
          <Campo label="Colegio" value={seleccionado.colegio} onChange={(v) => cambiar('colegio', v)} />

          <h3>Datos del acudiente</h3>

          <Campo label="Nombre acudiente" value={seleccionado.acudiente_nombre} onChange={(v) => cambiar('acudiente_nombre', v)} />
          <Campo label="Documento acudiente" value={seleccionado.acudiente_documento} onChange={(v) => cambiar('acudiente_documento', v)} />
          <Campo label="Correo acudiente" value={seleccionado.acudiente_correo} onChange={(v) => cambiar('acudiente_correo', v)} />
          <Campo label="Celular acudiente" value={seleccionado.acudiente_celular} onChange={(v) => cambiar('acudiente_celular', v)} />
          <Campo label="Parentesco" value={seleccionado.acudiente_parentesco} onChange={(v) => cambiar('acudiente_parentesco', v)} />

          <h3>Información médica</h3>

          <Campo label="EPS" value={seleccionado.eps} onChange={(v) => cambiar('eps', v)} />
          <Campo label="RH" value={seleccionado.rh} onChange={(v) => cambiar('rh', v)} />
          <Campo label="Alergias" value={seleccionado.alergias} onChange={(v) => cambiar('alergias', v)} />
          <Campo label="Observaciones médicas" value={seleccionado.observaciones_medicas} onChange={(v) => cambiar('observaciones_medicas', v)} />

          <h3>Estado</h3>

          <label style={styles.formLabel}>
            <span>Estado</span>
            <select
              style={styles.input}
              value={seleccionado.estado || ''}
              onChange={(e) => cambiar('estado', e.target.value)}
            >
              <option value="">Selecciona estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </label>

          <button style={styles.boton} onClick={guardarCambios} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Deportistas</h1>

      <section style={styles.adminPanel}>
        <input
          style={styles.input}
          placeholder="Buscar por nombre, documento o acudiente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {loading && <p>Cargando deportistas...</p>}

        {!loading && deportistasFiltrados.length === 0 && (
          <p>No se encontraron deportistas.</p>
        )}

        {!loading &&
          deportistasFiltrados.map((dep) => (
            <div
              key={dep.id}
              style={styles.adminListItem}
              onClick={() => setSeleccionado(dep)}
            >
              <div>
                <strong>{dep.deportista_nombre || 'Sin nombre'}</strong>
                <p>Documento: {dep.deportista_documento || '-'}</p>
                <small>
                  Acudiente: {dep.acudiente_nombre || '-'} · Estado: {dep.estado || '-'}
                </small>
              </div>

              <button style={styles.adminSmallBtn}>Ver / Editar</button>
            </div>
          ))}
      </section>
    </>
  );
}

function Campo({ label, value, onChange, type = 'text' }) {
  return (
    <label style={styles.formLabel}>
      <span>{label}</span>
      <input
        style={styles.input}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}