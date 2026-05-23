    
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { styles } from '../styles/styles';
import logo from '../assets/logo.png';

export default function CrearPassword({ setPantalla, setUsuario, setPerfil }) {
  const deportistaGuardado = JSON.parse(
    localStorage.getItem('deportista_activacion') || 'null'
  );

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  async function crearCuenta() {
    if (!deportistaGuardado) {
      alert('No encontramos el deportista a activar.');
      setPantalla('activar');
      return;
    }

    if (!correo || !password || !confirmar) {
      alert('Completa correo y contraseña.');
      return;
    }

    if (password !== confirmar) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: correo,
        password,
      });

    if (authError) {
      setLoading(false);
      alert(authError.message);
      return;
    }

    const userId = authData.user?.id;

    if (!userId) {
      setLoading(false);
      alert('No se pudo crear el usuario.');
      return;
    }

    const { error: perfilError } = await supabase.from('perfiles').insert([
      {
        id: userId,
        correo,
        rol: 'padre',
        estado: 'activo',
      },
    ]);

    if (perfilError) {
      setLoading(false);
      alert('Usuario creado, pero no se pudo crear perfil.');
      console.error(perfilError);
      return;
    }

    const { error: deportistaError } = await supabase
      .from('deportistas')
      .update({
        acudiente_correo: correo,
      })
      .eq('id', deportistaGuardado.id);

    if (deportistaError) {
      setLoading(false);
      alert('No se pudo actualizar el correo del deportista.');
      console.error(deportistaError);
      return;
    }

    const { error: relacionError } = await supabase
      .from('padre_deportista')
      .insert([
        {
          padre_id: userId,
          deportista_id: deportistaGuardado.id,
          parentesco: deportistaGuardado.acudiente_parentesco || 'Acudiente',
          estado: 'activo',
        },
      ]);

    setLoading(false);

    if (relacionError) {
      alert('Usuario creado, pero no se pudo relacionar con el deportista.');
      console.error(relacionError);
      return;
    }

    localStorage.removeItem('deportista_activacion');

    alert('Cuenta creada correctamente. Ya puedes ingresar.');
    setPantalla('login');
  }

  return (
    <main style={styles.loginContainer}>
      <img src={logo} alt="Club Cedro" style={styles.loginLogo} />

      <section style={styles.loginBox}>
        <h1 style={styles.loginTitulo}>Crear contraseña</h1>

        <p>
          Deportista:{' '}
          <strong>{deportistaGuardado?.deportista_nombre}</strong>
        </p>

        <input
          style={styles.loginInput}
          placeholder="Correo del acudiente"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          style={styles.loginInput}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={styles.loginInput}
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        <button style={styles.loginButton} onClick={crearCuenta}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>

        <button
          style={styles.forgotButton}
          onClick={() => setPantalla('activar')}
        >
          Volver
        </button>
      </section>
    </main>
  );
}