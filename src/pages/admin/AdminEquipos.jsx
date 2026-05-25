import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

export default function AdminEquipos() {
    const [equipos, setEquipos] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [entrenadores, setEntrenadores] = useState([]);
    const [deportistas, setDeportistas] = useState([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
    const [deportistasEquipo, setDeportistasEquipo] = useState([]);
    const [deportistaSeleccionado, setDeportistaSeleccionado] = useState('');
    const [mostrarCrear, setMostrarCrear] = useState(false);
    const [filtroEquipo, setFiltroEquipo] = useState('');
  
    const [nuevoEquipo, setNuevoEquipo] = useState({
      nombre: '',
      sede_id: '',
      categoria_id: '',
      entrenador_id: '',
    });
  
    useEffect(() => {
      cargarEquipos();
    }, []);
  
    async function cargarEquipos() {
      const [
        equiposRes,
        sedesRes,
        categoriasRes,
        entrenadoresRes,
        deportistasRes,
      ] = await Promise.all([
        supabase
          .from('equipos')
          .select(
            `
              id,
              nombre,
              estado,
              sede:sedes(nombre_corto),
              categoria:categorias(categoria),
              entrenador:entrenadores(nombres_completos)
            `
          )
          .order('nombre'),
  
        supabase.from('sedes').select('id, nombre_corto').order('nombre_corto'),
  
        supabase
          .from('categorias')
          .select('id, categoria')
          .eq('estado', 'Activo')
          .order('categoria'),
  
        supabase
          .from('entrenadores')
          .select('id, nombres_completos')
          .order('nombres_completos'),
  
        supabase
          .from('deportistas')
          .select('id, deportista_nombre, deportista_documento')
          .order('deportista_nombre'),
      ]);
  
      setEquipos(equiposRes.data || []);
      setSedes(sedesRes.data || []);
      setCategorias(categoriasRes.data || []);
      setEntrenadores(entrenadoresRes.data || []);
      setDeportistas(deportistasRes.data || []);
    }
  
    async function cargarDeportistasEquipo(equipo) {
      setEquipoSeleccionado(equipo);
  
      const { data, error } = await supabase
        .from('equipo_deportista')
        .select(
          `
          id,
          estado,
          deportista:deportistas (
            id,
            deportista_nombre,
            deportista_documento
          )
        `
        )
        .eq('equipo_id', equipo.id)
        .eq('estado', 'activo');
  
      if (error) {
        console.error(error);
        alert('No se pudieron cargar los deportistas del equipo.');
        return;
      }
  
      setDeportistasEquipo(data || []);
    }
  
    async function crearEquipo() {
      if (
        !nuevoEquipo.nombre ||
        !nuevoEquipo.sede_id ||
        !nuevoEquipo.categoria_id
      ) {
        alert('Completa nombre, sede y categoría.');
        return;
      }
  
      const { error } = await supabase.from('equipos').insert([
        {
          nombre: nuevoEquipo.nombre,
          sede_id: nuevoEquipo.sede_id,
          categoria_id: nuevoEquipo.categoria_id,
          entrenador_id: nuevoEquipo.entrenador_id || null,
          estado: 'activo',
        },
      ]);
  
      if (error) {
        console.error(error);
        alert('No se pudo crear el equipo.');
        return;
      }
  
      setNuevoEquipo({
        nombre: '',
        sede_id: '',
        categoria_id: '',
        entrenador_id: '',
      });
  
      setMostrarCrear(false);
      cargarEquipos();
    }
  
    async function cambiarEstadoEquipo(equipo) {
      const nuevoEstado = equipo.estado === 'activo' ? 'inactivo' : 'activo';
  
      const { error } = await supabase
        .from('equipos')
        .update({ estado: nuevoEstado })
        .eq('id', equipo.id);
  
      if (error) {
        console.error(error);
        alert('No se pudo cambiar el estado.');
        return;
      }
  
      cargarEquipos();
    }
  
    async function asignarDeportista() {
      if (!equipoSeleccionado || !deportistaSeleccionado) {
        alert('Selecciona un deportista.');
        return;
      }
  
      const { error } = await supabase.from('equipo_deportista').insert([
        {
          equipo_id: equipoSeleccionado.id,
          deportista_id: deportistaSeleccionado,
          estado: 'activo',
        },
      ]);
  
      if (error) {
        console.error(error);
        alert('No se pudo asignar. Puede que ya esté asignado.');
        return;
      }
  
      setDeportistaSeleccionado('');
      cargarDeportistasEquipo(equipoSeleccionado);
    }
  
    async function quitarDeportista(relacionId) {
      const { error } = await supabase
        .from('equipo_deportista')
        .update({ estado: 'inactivo' })
        .eq('id', relacionId);
  
      if (error) {
        console.error(error);
        alert('No se pudo eliminar del equipo.');
        return;
      }
  
      cargarDeportistasEquipo(equipoSeleccionado);
    }
  
    const equiposFiltrados = equipos.filter((equipo) =>
      equipo.nombre.toLowerCase().includes(filtroEquipo.toLowerCase())
    );
  
    if (equipoSeleccionado) {
      return (
        <>
          <div style={styles.adminHeaderInline}>
            <button
              style={styles.volverBtn}
              onClick={() => {
                setEquipoSeleccionado(null);
                setDeportistasEquipo([]);
              }}
            >
              ← Volver
            </button>
  
            <button style={styles.adminPlusBtn} onClick={asignarDeportista}>
              +
            </button>
          </div>
  
          <h1 style={styles.adminTitle}>{equipoSeleccionado.nombre}</h1>
  
          <section style={styles.adminPanel}>
            <h2>Agregar deportista</h2>
  
            <select
              style={styles.input}
              value={deportistaSeleccionado}
              onChange={(e) => setDeportistaSeleccionado(e.target.value)}
            >
              <option value="">Selecciona deportista</option>
              {deportistas.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.deportista_nombre} - {dep.deportista_documento}
                </option>
              ))}
            </select>
  
            <button style={styles.boton} onClick={asignarDeportista}>
              Agregar al equipo
            </button>
          </section>
  
          <section style={styles.adminPanel}>
            <h2>Deportistas asignados</h2>
  
            {deportistasEquipo.length === 0 && (
              <p>No hay deportistas asignados.</p>
            )}
  
            {deportistasEquipo.map((item) => (
              <div key={item.id} style={styles.adminListItem}>
                <div>
                  <strong>{item.deportista?.deportista_nombre}</strong>
                  <p>Documento: {item.deportista?.deportista_documento}</p>
                </div>
  
                <button
                  style={styles.adminSmallBtnDanger}
                  onClick={() => quitarDeportista(item.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </section>
        </>
      );
    }
  
    return (
      <>
        <div style={styles.adminHeaderInline}>
          <h1 style={styles.adminTitle}>Equipos</h1>
  
          <button
            style={styles.adminPlusBtn}
            onClick={() => setMostrarCrear(!mostrarCrear)}
          >
            {mostrarCrear ? '×' : '+'}
          </button>
        </div>
  
        {mostrarCrear && (
          <section style={styles.adminPanel}>
            <h2>Crear equipo</h2>
            <input
              style={styles.input}
              placeholder="Nombre del equipo"
              value={nuevoEquipo.nombre}
              onChange={(e) =>
                setNuevoEquipo({
                  ...nuevoEquipo,
                  nombre: e.target.value,
                })
              }
            />
  
            <select
              style={styles.input}
              value={nuevoEquipo.sede_id}
              onChange={(e) =>
                setNuevoEquipo({ ...nuevoEquipo, sede_id: e.target.value })
              }
            >
              <option value="">Selecciona sede</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre_corto}
                </option>
              ))}
            </select>
            <select
              style={styles.input}
              value={nuevoEquipo.categoria_id}
              onChange={(e) =>
                setNuevoEquipo({ ...nuevoEquipo, categoria_id: e.target.value })
              }
            >
              <option value="">Selecciona categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoria}
                </option>
              ))}
            </select>
            <select
              style={styles.input}
              value={nuevoEquipo.entrenador_id}
              onChange={(e) =>
                setNuevoEquipo({ ...nuevoEquipo, entrenador_id: e.target.value })
              }
            >
              <option value="">Selecciona entrenador</option>
              {entrenadores.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.nombres_completos}
                </option>
              ))}
            </select>
            <button style={styles.boton} onClick={crearEquipo}>
              Crear equipo
            </button>
          </section>
        )}
  
        <section style={styles.adminPanel}>
          <h2>Listado de equipos</h2>
  
          {equipos.length === 0 && <p>No hay equipos creados.</p>}
  
          {equiposFiltrados.map((equipo) => (
            <div key={equipo.id} style={styles.adminListItem}>
              <div>
                <strong>{equipo.nombre}</strong>
                <p>
                  {equipo.sede?.nombre_corto || 'Sin sede'} ·{' '}
                  {equipo.categoria?.categoria || 'Sin categoría'}
                </p>
                <small>
                  Entrenador:{' '}
                  {equipo.entrenador?.nombres_completos || 'Sin entrenador'} ·{' '}
                  Estado: {equipo.estado}
                </small>
              </div>
  
              <div style={styles.adminActions}>
                <button
                  style={styles.adminSmallBtn}
                  onClick={() => cargarDeportistasEquipo(equipo)}
                >
                  Ver
                </button>
  
                <button
                  style={styles.adminSmallBtn}
                  onClick={() => cambiarEstadoEquipo(equipo)}
                >
                  {equipo.estado === 'activo' ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </section>
      </>
    );
  }
  