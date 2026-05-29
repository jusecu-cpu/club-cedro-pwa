import { useState } from 'react';
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

        {deportistas.map((dep) => (
          <div
            key={dep.id}
            style={{
              ...styles.adminListItem,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
            onClick={() => setSeleccionado(dep)}
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

            <div>
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
                Equipo:{' '}
                {dep.equipo_deportista?.find((item) => item.estado === 'activo')
                  ?.equipo?.nombre || 'Sin equipo'}
              </small>

              <small>Documento: {dep.deportista_documento}</small>
            </div>
          </div>
        ))}
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
  console.error('ERROR ACTUALIZANDO DEPORTISTA:', error);
  alert(error.message);
  return;
}

    alert('Datos actualizados correctamente.');
    recargar();
    volver();
  }

  async function desactivarDeportista() {
    const confirmar = confirm(
      '¿Seguro que deseas desactivar esta deportista? No se eliminará de la base de datos.'
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from('deportistas')
      .update({ estado: 'inactivo' })
      .eq('id', deportista.id);

    if (error) {
      console.error(error);
      alert('No se pudo desactivar.');
      return;
    }

    alert('Deportista desactivada.');
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
          Desactivar deportista
        </button>
      </section>
    </>
  );
}