import { supabase } from '../lib/supabase';

export async function iniciarSesion(correo, password) {
  return await supabase.auth.signInWithPassword({
    email: correo,
    password,
  });
}

export async function crearUsuario(correo, password) {
  return await supabase.auth.signUp({
    email: correo,
    password,
  });
}

export async function recuperarPassword(correo) {
  return await supabase.auth.resetPasswordForEmail(correo);
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