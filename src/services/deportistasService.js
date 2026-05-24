import { supabase } from '../lib/supabase';

export async function buscarDeportistaPorDocumento(documento) {
  return await supabase
    .from('deportistas')
    .select('*')
    .eq('deportista_documento', documento)
    .maybeSingle();
}

export async function actualizarDeportista(id, data) {
  return await supabase
    .from('deportistas')
    .update(data)
    .eq('id', id);
}

export async function obtenerDeportistaPadre(padreId) {
  return await supabase
    .from('padre_deportista')
    .select(`
      id,
      parentesco,
      estado,
      deportista:deportistas (
        id,
        foto_url,
        acudiente_nombre,
        acudiente_documento,
        acudiente_correo,
        acudiente_celular,
        acudiente_parentesco,
        deportista_nombre,
        deportista_documento,
        pais,
        fecha_nacimiento,
        direccion_vivienda,
        sexo,
        colegio,
        eps,
        rh,
        alergias,
        observaciones_medicas,
        estado,
        sede:sedes(nombre_corto),
        categoria:categorias(categoria),
        entrenador:entrenadores(nombres_completos)
      )
    `)
    .eq('padre_id', padreId)
    .eq('estado', 'activo')
    .maybeSingle();
}