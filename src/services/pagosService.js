import { supabase } from '../lib/supabase';

export async function obtenerLinksPago() {
  return await supabase
    .from('pagos')
    .select('*')
    .eq('estado', 'activo')
    .order('orden', { ascending: true });
}

export async function crearPago(data) {
  return await supabase
    .from('pagos')
    .insert([data]);
}

export async function actualizarPago(id, data) {
  return await supabase
    .from('pagos')
    .update(data)
    .eq('id', id);
}

export async function eliminarPago(id) {
  return await supabase
    .from('pagos')
    .delete()
    .eq('id', id);
}