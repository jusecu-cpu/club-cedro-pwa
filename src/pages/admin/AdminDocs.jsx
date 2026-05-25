import { styles } from '../../styles/styles';

export default function AdminDocs() {
  const documentos = [
    {
      icono: '🛡️',
      titulo: 'Resumen protección deportiva',
      descripcion: 'Resumen general del programa para deportistas.',
      archivo: '/docs/resumen-proteccion.pdf',
    },
    {
      icono: '📘',
      titulo: 'Condicionado de asistencia',
      descripcion: 'Detalle de condiciones, límites y exclusiones.',
      archivo: '/docs/condicionado-asistencia.pdf',
    },
    {
      icono: '📄',
      titulo: 'Slip póliza de seguros',
      descripcion: 'Coberturas principales de la póliza.',
      archivo: '/docs/slip-poliza.pdf',
    },
  ];

  return (
    <>
      <h1 style={{ ...styles.adminTitle, fontSize: 26, lineHeight: 1.05 }}>
        Documentos
      </h1>

      {/* aquí pega el resto del diseño que ya tienes */}
    </>
  );
}