import { supabase } from '../lib/supabase';

function normalizarCorreo(correo) {
  const usuarioLimpio = correo.trim().toLowerCase();

  return usuarioLimpio.includes('@')
    ? usuarioLimpio
    : `${usuarioLimpio}@clubcedro.com`;
}

export async function iniciarSesion(correo, password) {
  const emailLogin = normalizarCorreo(correo);

  return await supabase.auth.signInWithPassword({
    email: emailLogin,
    password,
  });
}

export async function crearUsuario(correo, password) {
  const emailLogin = normalizarCorreo(correo);

  return await supabase.auth.signUp({
    email: emailLogin,
    password,
  });
}

export async function recuperarPassword(correo) {
  const emailLogin = normalizarCorreo(correo);

  return await supabase.auth.resetPasswordForEmail(emailLogin);
}

export async function cerrarSesion() {
  return await supabase.auth.signOut();
}

export async function obtenerSesion() {
  return await supabase.auth.getSession();
}

export async function obtenerUsuario() {
  return await supabase.auth.getUser();
}