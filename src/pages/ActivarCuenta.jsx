import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { styles } from '../styles/styles';

export default function ActivarCuenta({ setPantalla }) {

  const [documento, setDocumento] = useState('');
  const [loading, setLoading] = useState(false);

  async function buscarDeportista() {

    if (!documento) {
      alert('Ingresa el documento');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('deportistas')
      .select('*')
      .eq('deportista_documento', documento)
      .single();

    setLoading(false);

    if (error || !data) {
      alert('No encontramos el deportista. Debes realizar inscripción completa.');
      setPantalla('registro');
      return;
    }

    // CASO: ya tiene correo
    if (data.acudiente_correo) {

      const correo = data.acudiente_correo;

      const correoOculto =
        correo.substring(0, 2) +
        '******' +
        correo.substring(correo.indexOf('@'));

      const confirmar = confirm(
        `Encontramos el correo:\n${correoOculto}\n\n¿Deseas enviar recuperación de contraseña?`
      );

      if (!confirmar) return;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(correo, {
          redirectTo: window.location.origin,
        });

      if (resetError) {
        alert('Error enviando recuperación');
        return;
      }

      alert('Correo enviado correctamente');
      return;
    }

    // CASO: no tiene correo
    localStorage.setItem(
      'deportista_activacion',
      JSON.stringify(data)
    );

    setPantalla('crear-password');
  }

  return (
    <main style={styles.loginContainer}>

      <img
        src="/logo.png"
        alt="Club Cedro"
        style={styles.logo}
      />

      <section style={styles.loginCard}>

        <h1 style={styles.title}>
          Activar cuenta
        </h1>

        <p style={{ textAlign: 'center' }}>
          Ingresa el documento del deportista
        </p>

        <input
          style={styles.input}
          placeholder="Documento deportista"
          value={documento}
          onChange={(e) =>
            setDocumento(e.target.value)
          }
        />

        <button
          style={styles.button}
          onClick={buscarDeportista}
        >
          {loading
            ? 'Buscando...'
            : 'Continuar'}
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => setPantalla('login')}
        >
          Volver
        </button>

      </section>

    </main>
  );
}