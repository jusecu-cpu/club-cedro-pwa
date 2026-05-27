import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/styles';
import logo from '../../assets/logo.png';

export default function EntrenadorCarnet({ entrenador, recargar }) {
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState({
    nombres_completos: entrenador?.nombres_completos || '',
    documento_identidad: entrenador?.documento_identidad || '',
    celular: entrenador?.celular || '',
    correo_electronico: entrenador?.correo_electronico || '',
    eps: entrenador?.eps || '',
    foto_url: entrenador?.foto_url || '',
  });

  async function guardarDatos() {
    const { error } = await supabase
      .from('entrenadores')
      .update({
        nombres_completos: form.nombres_completos,
        documento_identidad: form.documento_identidad,
        celular: form.celular,
        correo_electronico: form.correo_electronico,
        eps: form.eps,
        foto_url: form.foto_url,
      })
      .eq('id', entrenador.id);

    if (error) {
      console.error(error);
      alert('No se pudieron actualizar los datos.');
      return;
    }

    alert('Datos actualizados correctamente.');
    setEditando(false);
    recargar();
  }

  return (
    <>
      <h1 style={{ ...styles.adminTitle, fontSize: 26 }}>Mi carnet</h1>

      <section
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: 24,
          maxWidth: 380,
          margin: '0 auto 20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          textAlign: 'center',
        }}
      >
        <img src={logo} alt="Club Cedro" style={{ width: 110, marginBottom: 16 }} />

        {form.foto_url ? (
          <img
            src={form.foto_url}
            alt="Foto entrenador"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 16,
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: '#f0f0f0',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 42,
              color: '#999',
            }}
          >
            👤
          </div>
        )}

        <h2>{form.nombres_completos || 'Entrenador'}</h2>

        <p><strong>Documento:</strong> {form.documento_identidad || '-'}</p>
        <p><strong>Celular:</strong> {form.celular || '-'}</p>
        <p><strong>Correo:</strong> {form.correo_electronico || '-'}</p>
        <p><strong>EPS:</strong> {form.eps || '-'}</p>

        <small>Entrenador Club Cedro</small>
      </section>

      <section style={styles.adminPanel}>
        <button style={styles.boton} onClick={() => setEditando(!editando)}>
          {editando ? 'Cerrar edición' : 'Actualizar mis datos'}
        </button>

        {editando && (
          <>
            <input
              style={styles.input}
              placeholder="Foto URL"
              value={form.foto_url}
              onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Nombres completos"
              value={form.nombres_completos}
              onChange={(e) => setForm({ ...form, nombres_completos: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Documento identidad"
              value={form.documento_identidad}
              onChange={(e) => setForm({ ...form, documento_identidad: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Celular"
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Correo electrónico"
              value={form.correo_electronico}
              onChange={(e) => setForm({ ...form, correo_electronico: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="EPS"
              value={form.eps}
              onChange={(e) => setForm({ ...form, eps: e.target.value })}
            />

            <button style={styles.boton} onClick={guardarDatos}>
              Guardar cambios
            </button>
          </>
        )}
      </section>
    </>
  );
}