import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';

export default function EntrenadorDeportistas({ deportistas, recargar }) {
  const [seleccionado, setSeleccionado] = useState(null);

  if (seleccionado) {
    return (
      <EditarDeportista
        deportista={seleccionado}
        volver={() => setSeleccionado(null)}
        recargar={recargar}
      />
    );
  }

  return (
    <>
      <h1 style={styles.adminTitle}>Mis deportistas</h1>

      <section style={styles.adminPanel}>
        {deportistas.length === 0 && <p>No tienes deportistas asignados.</p>}

        {deportistas.map((dep) => {
          const equipoActivo =
            dep.equipo_deportista?.find((item) => item.estado === 'activo')
              ?.equipo?.nombre || 'Sin equipo';

          return (
            <div
              key={dep.id}
              style={{
                ...styles.adminListItem,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
              }}
            >
              {dep.foto_url ? (
                <img
                  src={dep.foto_url}
                  alt={dep.deportista_nombre}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#072c8f',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {dep.deportista_nombre?.charAt(0) || 'D'}
                </div>
              )}

              <div style={{ flex: 1 }}>
                <strong>{dep.deportista_nombre}</strong>

                <p>
                  {dep.categoria?.categoria || 'Sin categoría'} ·{' '}
                  {dep.sede?.nombre_corto || 'Sin sede'}
                </p>

                <small
                  style={{
                    display: 'block',
                    marginTop: 4,
                    color: '#072c8f',
                    fontWeight: 700,
                  }}
                >
                  Equipo: {equipoActivo}
                </small>

                <small>Documento: {dep.deportista_documento}</small>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    style={{
                      border: 'none',
                      background: '#253a9b',
                      color: '#fff',
                      padding: '7px 10px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    onClick={() => setSeleccionado(dep)}
                  >
                    Ver / Editar
                  </button>

                  <button
                    style={{
                      border: '1px solid #253a9b',
                      background: '#eef2ff',
                      color: '#253a9b',
                      padding: '7px 10px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    onClick={() => setSeleccionado(dep)}
                  >
                    Cambiar
                  </button>

                  <button
                    style={{
                      border: 'none',
                      background: '#dc2626',
                      color: '#fff',
                      padding: '7px 10px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    onClick={() => setSeleccionado(dep)}
                  >
                    Inactivar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

function EditarDeportista({ deportista, volver, recargar }) {
  const [form, setForm] = useState({
    deportista_nombre: deportista.deportista_nombre || '',
    deportista_documento: deportista.deportista_documento || '',
    fecha_nacimiento: deportista.fecha_nacimiento || '',
    direccion_vivienda: deportista.direccion_vivienda || '',
    sexo: deportista.sexo || '',
    colegio: deportista.colegio || '',
    eps: deportista.eps || '',
    rh: deportista.rh || '',
    alergias: deportista.alergias || '',
    contacto_emergencia: deportista.contacto_emergencia || '',
    telefono_emergencia: deportista.telefono_emergencia || '',
    talla_camisa: deportista.talla_camisa || '',
    talla_pantalon: deportista.talla_pantalon || '',
    foto_url: deportista.foto_url || '',
    estado: deportista.estado || 'activo',
  });

  const [motivoMovimiento, setMotivoMovimiento] = useState('');
  const [notaAdmin, setNotaAdmin] = useState('');
  const [entrenadores, setEntrenadores] = useState([]);
  const [nuevoEntrenador, setNuevoEntrenador] = useState('');

  useEffect(() => {
    cargarEntrenadores();
  }, []);

  async function cargarEntrenadores() {
    const { data, error } = await supabase
      .from('entrenadores')
      .select('id,nombres_completos')
      .order('nombres_completos');

    if (error) {
      console.error(error);
      return;
    }

    setEntrenadores(data || []);
  }

  async function guardarCambios() {
    const { error } = await supabase
      .from('deportistas')
      .update({
        deportista_nombre: form.deportista_nombre,
        deportista_documento: form.deportista_documento,
        fecha_nacimiento: form.fecha_nacimiento,
        direccion_vivienda: form.direccion_vivienda,
        sexo: form.sexo,
        colegio: form.colegio,
        eps: form.eps,
        rh: form.rh,
        alergias: form.alergias,
        contacto_emergencia: form.contacto_emergencia,
        telefono_emergencia: form.telefono_emergencia,
        talla_camisa: form.talla_camisa,
        talla_pantalon: form.talla_pantalon,
        foto_url: form.foto_url,
        estado: form.estado,
      })
      .eq('id', deportista.id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert('Datos actualizados correctamente.');
    recargar();
    volver();
  }

  async function cambiarEntrenador() {
    if (!nuevoEntrenador) {
      alert('Selecciona un entrenador.');
      return;
    }

    if (!motivoMovimiento.trim()) {
      alert('Debes indicar el motivo.');
      return;
    }

    const { error } = await supabase
      .from('deportistas')
      .update({
        entrenador_id: nuevoEntrenador,
      })
      .eq('id', deportista.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from('deportista_movimientos').insert({
      deportista_id: deportista.id,
      entrenador_origen_id: deportista.entrenador_id || null,
      entrenador_destino_id: nuevoEntrenador,
      tipo_movimiento: 'cambio_entrenador',
      motivo: motivoMovimiento,
      nota_admin: notaAdmin,
    });

    alert('Entrenador actualizado.');
    recargar();
    volver();
  }

  async function desactivarDeportista() {
    if (!motivoMovimiento.trim()) {
      alert('Debes indicar el motivo.');
      return;
    }

    const confirmar = confirm(
      '¿Seguro que deseas inactivar esta deportista? No se eliminará de la base de datos.'
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from('deportistas')
      .update({
        estado: 'inactivo',
        motivo_inactivacion: motivoMovimiento,
        nota_admin: notaAdmin,
        fecha_inactivacion: new Date().toISOString(),
      })
      .eq('id', deportista.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from('deportista_movimientos').insert({
      deportista_id: deportista.id,
      entrenador_origen_id: deportista.entrenador_id || null,
      tipo_movimiento: 'inactivacion',
      motivo: motivoMovimiento,
      nota_admin: notaAdmin,
    });

    alert('Deportista inactivada.');
    recargar();
    volver();
  }

  return (
    <>
      <button style={styles.volverBtn} onClick={volver}>
        ← Volver
      </button>

      <h1 style={styles.adminTitle}>Editar deportista</h1>

      <section style={styles.adminPanel}>
        <h3>Datos deportista</h3>

        <input
          style={styles.input}
          placeholder="Foto URL"
          value={form.foto_url}
          onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Nombre completo"
          value={form.deportista_nombre}
          onChange={(e) =>
            setForm({ ...form, deportista_nombre: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Documento"
          value={form.deportista_documento}
          onChange={(e) =>
            setForm({ ...form, deportista_documento: e.target.value })
          }
        />

        <input
          type="date"
          style={styles.input}
          value={form.fecha_nacimiento}
          onChange={(e) =>
            setForm({ ...form, fecha_nacimiento: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Dirección vivienda"
          value={form.direccion_vivienda}
          onChange={(e) =>
            setForm({ ...form, direccion_vivienda: e.target.value })
          }
        />

        <select
          style={styles.input}
          value={form.sexo}
          onChange={(e) => setForm({ ...form, sexo: e.target.value })}
        >
          <option value="">Sexo</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </select>

        <input
          style={styles.input}
          placeholder="Colegio"
          value={form.colegio}
          onChange={(e) => setForm({ ...form, colegio: e.target.value })}
        />

        <h3>Salud</h3>

        <input
          style={styles.input}
          placeholder="EPS"
          value={form.eps}
          onChange={(e) => setForm({ ...form, eps: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="RH"
          value={form.rh}
          onChange={(e) => setForm({ ...form, rh: e.target.value })}
        />

        <textarea
          style={styles.input}
          placeholder="Alergias"
          value={form.alergias}
          onChange={(e) => setForm({ ...form, alergias: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Contacto emergencia"
          value={form.contacto_emergencia}
          onChange={(e) =>
            setForm({ ...form, contacto_emergencia: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Teléfono emergencia"
          value={form.telefono_emergencia}
          onChange={(e) =>
            setForm({ ...form, telefono_emergencia: e.target.value })
          }
        />

        <h3>Uniforme</h3>

        <input
          style={styles.input}
          placeholder="Talla camisa"
          value={form.talla_camisa}
          onChange={(e) =>
            setForm({ ...form, talla_camisa: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Talla pantalón"
          value={form.talla_pantalon}
          onChange={(e) =>
            setForm({ ...form, talla_pantalon: e.target.value })
          }
        />

        <h3>Gestión deportiva</h3>

        <textarea
          style={styles.input}
          placeholder="Motivo del cambio o retiro"
          value={motivoMovimiento}
          onChange={(e) => setMotivoMovimiento(e.target.value)}
        />

        <textarea
          style={styles.input}
          placeholder="Nota para administrador"
          value={notaAdmin}
          onChange={(e) => setNotaAdmin(e.target.value)}
        />

        <select
          style={styles.input}
          value={nuevoEntrenador}
          onChange={(e) => setNuevoEntrenador(e.target.value)}
        >
          <option value="">Cambiar entrenador</option>

          {entrenadores.map((ent) => (
            <option key={ent.id} value={ent.id}>
              {ent.nombres_completos}
            </option>
          ))}
        </select>

        <button style={styles.boton} onClick={cambiarEntrenador}>
          Cambiar entrenador
        </button>

        <h3>Estado</h3>

        <select
          style={styles.input}
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <button style={styles.boton} onClick={guardarCambios}>
          Guardar cambios
        </button>

        <button style={styles.botonCancelarFull} onClick={desactivarDeportista}>
          Inactivar deportista
        </button>
      </section>
    </>
  );
}