import { supabase } from '../lib/supabase';

export async function obtenerEventosDeportista(deportistaId) {
  return await supabase
    .from('equipo_deportista')
    .select(`
      equipo:equipos(
        id,
        nombre,
        eventos:agenda_eventos(
          id,
          titulo,
          tipo_evento,
          tipo_entrenamiento,
          fecha,
          hora_inicio,
          hora_fin,
          descripcion,
          estado,
          estado_evento,
          novedad,
          motivo_cancelacion,
          fecha_actualizacion,
          sede_id,
          sede:sedes(nombre_corto)
        )
      )
    `)
    .eq('deportista_id', deportistaId)
    .eq('estado', 'activo');
}

export async function obtenerAsistenciaDeportista(deportistaId) {
  return await supabase
    .from('asistencia_eventos')
    .select(`
      id,
      evento_id,
      deportista_id,
      estado_asistencia,
      fecha_registro
    `)
    .eq('deportista_id', deportistaId);
}

export async function obtenerAgendaEntrenador(entrenadorId) {
  return await supabase
    .from('agenda_eventos')
    .select('*')
    .eq('entrenador_id', entrenadorId)
    .order('fecha', { ascending: true });
}

export async function crearEvento(data) {
  return await supabase
    .from('agenda_eventos')
    .insert([data]);
}

export async function actualizarEvento(id, data) {
  return await supabase
    .from('agenda_eventos')
    .update(data)
    .eq('id', id);
}

export async function eliminarEvento(id) {
  return await supabase
    .from('agenda_eventos')
    .delete()
    .eq('id', id);
}