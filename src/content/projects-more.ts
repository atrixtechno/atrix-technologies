import type { Project } from "./projects";

/**
 * Casos agregados en octubre de 2026: plataforma de empleo y programas de escritorio para Windows.
 * Todo sale de la documentación de cada proyecto (D:\PROYECTOS); sin cifras inventadas.
 */

const lead = (copy: string[]): Project["lead"] => ({
  name: "Ing. Néstor J. Resendiz, MBA",
  role: "Diseñador · Programador · Líder técnico · ATRIX Technologies",
  badges: ["Ingeniería", "MBA"],
  copy,
});

export const moreProjects: Project[] = [
  {
    slug: "boombeejobs",
    kind: "plataforma",
    name: "BoomBeeJobs",
    sector: "Empleo · Bolsa de trabajo en México",
    summary:
      "Bolsa de trabajo para México con paneles para candidatos, empresas y administración, publicada en la web, Google Play y App Store.",
    result:
      "Plataforma en producción en boombeejobs.com con apps de Android y iPhone, cobros en línea, verificación de empresas y herramientas con IA para candidatos.",
    url: "https://boombeejobs.com",
    previewImage: "/projects/boombeejobs-preview.jpg",
    logo: "/projects/logos/boombeejobs.png",
    tags: ["Web", "Android", "iPhone", "Pagos en línea", "IA para candidatos", "Panel de empresas"],
    stats: [
      { value: "3", label: "Paneles · candidato, empresa y admin" },
      { value: "Web + 2", label: "Apps · Android y iPhone" },
      { value: "IA", label: "CV, carta y práctica de entrevista" },
      { value: "RFC", label: "Empresas verificadas antes de publicar" },
    ],
    story: [
      "BoomBeeJobs nació para conectar a personas que buscan empleo con empresas revisadas en México, con un proceso claro de principio a fin: postularse, saber en qué va la postulación, conversar con la empresa y agendar entrevistas.",
      "ATRIX Technologies diseñó y desarrolló la plataforma completa: sitio público, paneles para candidatos, empresas y administración, planes de pago, apps para Android y iPhone, y herramientas de marketing en redes y campañas.",
      "La app de iPhone fue aprobada por Apple y la de Android está en Google Play; la web corre en producción con su propio dominio, correos y cobros en línea.",
    ],
    approach: [
      { title: "Confianza primero", copy: "Cada empresa se verifica con RFC y constancia fiscal antes de publicar; los candidatos pueden reportar vacantes sospechosas." },
      { title: "Transparencia en el proceso", copy: "El candidato ve si su postulación fue vista, si hay entrevista y cuánto suele tardar la empresa en responder." },
      { title: "Una experiencia en todas partes", copy: "El mismo diseño en web, Android y iPhone, con modo claro y oscuro y gestos en el celular." },
    ],
    deliverables: [
      { title: "Sitio y vacantes", copy: "Búsqueda por puesto y ciudad, vacantes para estudiantes, sueldos, calificaciones de empresas y vista previa al compartir." },
      { title: "Panel de candidato", copy: "Postulaciones, entrevistas, ofertas, mensajes y \"Creamos tu CV\": asistente de 5 pasos que genera un PDF profesional." },
      { title: "Panel de empresa", copy: "Vacantes, postulantes por etapa, entrevistas, equipo de RH y búsqueda de talento según el plan contratado." },
      { title: "Administración", copy: "Aprobación de empresas, cuentas, reportes, métricas, salud del sistema y bitácora." },
      { title: "Apps móviles", copy: "Android en Google Play e iPhone en App Store, con notificaciones y chat." },
      { title: "Cobros y marketing", copy: "Planes y paquetes con pago en línea, publicaciones en Instagram y Facebook y campañas pagadas desde el panel." },
    ],
    lead: lead([
      "Diseño, desarrollo y publicación de BoomBeeJobs: web, paneles, apps de Android y iPhone, pagos y herramientas de marketing.",
      "Enfoque: que buscar empleo y contratar sea claro y confiable para ambas partes.",
    ]),
    highlights: [
      "Paneles para candidato, empresa y administración con el mismo diseño",
      "Apps publicadas en Google Play y App Store",
      "Empresas verificadas con RFC y constancia fiscal",
      "Herramientas con IA para el CV, la carta de presentación y la entrevista",
      "Cobros en línea y marketing en redes integrados",
    ],
    stackNote: "Next.js · Supabase · Stripe · Android · iOS",
    seoTitle: "BoomBeeJobs — bolsa de trabajo con apps para Android y iPhone",
    seoDescription:
      "Caso ATRIX Technologies: BoomBeeJobs, bolsa de trabajo para México con paneles para candidatos y empresas, verificación de empresas, IA y apps en Google Play y App Store.",
    keywords: ["BoomBeeJobs", "bolsa de trabajo México", "app de empleo", "plataforma de reclutamiento", "ATRIX Technologies"],
    theme: { bg: "#f6f8ff", bgElevated: "#ffffff", fg: "#0c1a44", muted: "#4a5578", accent: "#e8960c", accentInk: "#ffffff", glow: "rgba(255,176,32,0.22)", light: true },
    themeDark: { bg: "#061233", bgElevated: "#0c1f4f", fg: "#f2f5ff", muted: "#a6b3d6", accent: "#ffb020", accentInk: "#0c2470", glow: "rgba(255,176,32,0.26)" },
    challenge:
      "Buscar trabajo suele ser un proceso a ciegas: vacantes dudosas, postulaciones sin respuesta y comunicación por varios canales. Las empresas, a su vez, pierden candidatos entre correos y hojas de cálculo.",
    solution:
      "Una plataforma con empresas verificadas, seguimiento visible de cada postulación, mensajes y entrevistas en un solo lugar, y apps para usarla desde el celular.",
    impact: [
      "Candidatos con un proceso claro y sin costo para postularse",
      "Empresas con sus postulantes ordenados por etapa",
      "Presencia en web, Google Play y App Store",
    ],
    modules: [
      { title: "Vacantes", copy: "Búsqueda por puesto y ciudad, filtros, áreas y vacantes para estudiantes." },
      { title: "Postulaciones", copy: "Etapas visibles para el candidato y la empresa, con ofertas y entrevistas." },
      { title: "Mensajes", copy: "Conversación entre empresa y candidato en un solo hilo, con adjuntos." },
      { title: "Creamos tu CV", copy: "Asistente de 5 pasos con vista previa y PDF profesional." },
      { title: "Planes y pagos", copy: "Planes para empresas y paquetes con pago en línea." },
      { title: "Administración", copy: "Verificación de empresas, reportes, métricas y bitácora." },
    ],
    technologies: [
      { name: "Next.js + React", role: "Sitio y paneles web" },
      { name: "Supabase", role: "Datos y archivos en la nube" },
      { name: "Stripe", role: "Cobros en línea" },
      { name: "Android e iOS", role: "Apps publicadas en las tiendas" },
      { name: "IA", role: "Ayuda con el CV, la carta y la entrevista" },
      { name: "Meta", role: "Publicaciones y campañas en redes" },
    ],
    process: [
      { title: "Definir el producto", copy: "Flujos para candidato, empresa y administración, y las reglas de confianza." },
      { title: "Construir la web", copy: "Sitio público, paneles, pagos y correos en producción." },
      { title: "Llevarlo al celular", copy: "Apps de Android e iPhone revisadas y aprobadas por las tiendas." },
      { title: "Crecer", copy: "Marketing en redes, campañas y mejoras continuas con el uso real." },
    ],
    persuasion: [
      "ATRIX puede llevar tu idea de plataforma de la web a las tiendas de apps.",
      "Pagos, verificación, paneles y apps: un solo equipo para todo el producto.",
      "Ideal si tu negocio necesita un marketplace o una plataforma con varios tipos de usuario.",
    ],
    year: "2026",
    location: "México",
  },
  {
    slug: "sistema-escolar",
    kind: "escritorio",
    name: "Sistema escolar",
    sector: "Educación · Administración escolar",
    summary:
      "Programa para Windows que administra alumnos, cobros, asistencia, notas y caja de un colegio, pensado para personal sin experiencia en sistemas.",
    result:
      "Un colegio que inscribe, cobra, imprime recibos y credenciales, pasa asistencia y cierra caja desde un solo programa, con roles para Dirección, Secretaría y Contabilidad.",
    previewImage: "/projects/sistema-escolar-preview.jpg",
    tags: ["Windows", "Cobros y caja", "Credenciales con QR", "Asistencia y notas", "Reportes PDF y Excel"],
    stats: [
      { value: "3", label: "Roles · Dirección, Secretaría y Contabilidad" },
      { value: "5", label: "Pasos para inscribir un alumno" },
      { value: "58/80 mm", label: "Tickets en impresora térmica" },
      { value: "PDF + Excel", label: "Reportes listos para imprimir" },
    ],
    story: [
      "Un colegio necesitaba dejar las libretas y hojas sueltas: saber quién debe, cobrar ordenado, imprimir recibos y llevar asistencia y calificaciones sin depender de una persona experta en computación.",
      "ATRIX Technologies construyó un programa de escritorio para Windows con inicio por tareas (Cobrar, Inscribir alumno, Pasar asistencia, Poner notas, Imprimir constancia, Ver quién debe, Cerrar la caja), palabras sencillas y ayuda dentro del programa.",
      "Incluye guía interactiva: cada pregunta del manual lleva a la pantalla real y marca dónde tocar, y el avance se guarda por usuario.",
    ],
    approach: [
      { title: "Para quien no es experto", copy: "Botones grandes, menú corto, letra grande y alto contraste, avisos claros y opción de deshacer." },
      { title: "El dinero, claro", copy: "Calendario de pagos por alumno en colores: pagado, parcial, vencido o bloqueado." },
      { title: "Seguro por diseño", copy: "Usuarios con roles y permisos, contraseñas cifradas y bloqueo temporal tras varios intentos fallidos." },
    ],
    deliverables: [
      { title: "Alumnos y tutores", copy: "Ficha completa con foto, salud y documentos; tutores con contacto de cobro." },
      { title: "Cuotas y cobros", copy: "Conceptos semanales, mensuales, anuales o únicos, montos por grado, becas, descuentos y recargos por atraso." },
      { title: "Caja y recibos", copy: "Recibos con desglose, tickets térmicos y cierre de caja con arqueo." },
      { title: "Asistencia y notas", copy: "Asistencia diaria por curso, calificaciones por período y boletines." },
      { title: "Credenciales", copy: "Credencial con foto y QR verificable, en hoja carta o tarjeta PVC." },
      { title: "Quién debe", copy: "Lista de atrasados con botón para escribir por WhatsApp a cada tutor." },
    ],
    lead: lead([
      "Diseño y desarrollo de un sistema de administración escolar para Windows.",
      "Enfoque: que secretaría y dirección lo usen desde el primer día, sin capacitación técnica.",
    ]),
    highlights: [
      "Inicio por tareas y guía interactiva dentro del programa",
      "Calendario de pagos por alumno con estados en color",
      "Credenciales con foto y QR verificable",
      "Tickets en impresora térmica con detección automática",
      "Roles y permisos por área",
    ],
    stackNote: "Windows · Electron · React · SQLite",
    seoTitle: "Sistema escolar — administración de alumnos, cobros y caja",
    seoDescription:
      "Caso ATRIX Technologies: programa de escritorio para Windows con alumnos, cobros, caja, asistencia, calificaciones y credenciales para colegios.",
    keywords: ["sistema escolar", "software para colegios", "control de cobros escolar", "credenciales escolares", "ATRIX Technologies"],
    theme: { bg: "#f4f7fd", bgElevated: "#ffffff", fg: "#0e1b3d", muted: "#4f5d7f", accent: "#1f5fd6", accentInk: "#ffffff", glow: "rgba(31,95,214,0.2)", light: true },
    themeDark: { bg: "#08122b", bgElevated: "#0e1c40", fg: "#eef3ff", muted: "#9fb0d4", accent: "#4f8bff", accentInk: "#ffffff", glow: "rgba(79,139,255,0.26)" },
    challenge:
      "En un colegio, el control de cobros, asistencia y notas suele vivir en libretas y hojas de cálculo: es difícil saber quién debe, cerrar la caja con confianza o imprimir documentos con buena presentación.",
    solution:
      "Un programa de escritorio que reúne alumnos, cobros, caja, asistencia, notas, credenciales y reportes, con un diseño pensado para personal sin experiencia en sistemas.",
    impact: [
      "Cobranza ordenada y lista de atrasados al día",
      "Recibos, constancias y credenciales con diseño oficial",
      "Dirección con el colegio completo en números",
    ],
    modules: [
      { title: "Panel general", copy: "Ingresos, egresos, balance, por cobrar, alumnos por grado, asistencia y notas." },
      { title: "Matrícula", copy: "Inscripción por año y sección, con historial y promoción masiva de alumnos." },
      { title: "Cobros", copy: "Calendario de pagos, recargos, descuentos con motivo y recibos." },
      { title: "Académico", copy: "Grados, materias, profesores, horarios, evaluaciones y boletines." },
      { title: "Documentos", copy: "Constancias, convenios y credenciales con marca de agua, firma, sello y QR." },
      { title: "Gastos", copy: "Egresos por categoría e ingresos contra egresos por mes." },
    ],
    technologies: [
      { name: "Windows", role: "Programa de escritorio con instalador" },
      { name: "Electron + React", role: "Interfaz del programa" },
      { name: "SQLite", role: "Base de datos local" },
      { name: "PDF y Excel", role: "Reportes y documentos imprimibles" },
      { name: "Impresoras térmicas", role: "Tickets de 58 y 80 mm" },
      { name: "WhatsApp", role: "Contacto rápido con tutores" },
    ],
    process: [
      { title: "Entender al colegio", copy: "Cobros, cuotas por grado, documentos y la rutina diaria de secretaría." },
      { title: "Diseñar para todos", copy: "Palabras sencillas, tareas grandes y ayuda junto a cada campo." },
      { title: "Construir y probar", copy: "Cobros, caja, asistencia, notas y documentos con datos reales de uso." },
      { title: "Instalar y acompañar", copy: "Instalador para Windows, guía de bienvenida y manual dentro del programa." },
    ],
    persuasion: [
      "Si tu escuela todavía cobra con libreta, un sistema así ordena todo desde el primer mes.",
      "ATRIX diseña para el personal real de tu institución, no para técnicos.",
      "Funciona sin internet y se instala en las computadoras que ya tienes.",
    ],
    year: "2026",
    location: "Programa para Windows",
  },
  {
    slug: "certificados-moopalkwan",
    kind: "escritorio",
    name: "Certificados Moopalkwan",
    sector: "Deporte · Certificados de taekwondo",
    summary:
      "Programa para Windows que genera e imprime certificados de grado del Instituto Mexicano Moopalkwan, uno por uno o de forma masiva desde Excel.",
    result:
      "Certificados con folio, diseño propio y calibración para hojas ya impresas, en tamaño carta u oficio, con historial y respaldos automáticos.",
    previewImage: "/projects/moopalkwan-preview.jpg",
    logo: "/projects/logos/moopalkwan.png",
    tags: ["Windows", "Certificados", "Folios", "Excel / CSV", "Diseñador de plantillas"],
    stats: [
      { value: "Carta + oficio", label: "Tamaños de hoja" },
      { value: "Excel", label: "Generación masiva desde CSV o Excel" },
      { value: "2", label: "Roles · administrador y operador" },
      { value: "30", label: "Respaldos diarios guardados" },
    ],
    story: [
      "El Instituto Mexicano Moopalkwan emite certificados de grado después de cada examen de taekwondo. Hacerlos a mano, uno por uno, toma tiempo y se presta a errores de nombres y folios.",
      "ATRIX Technologies desarrolló un programa de escritorio con diseñador de plantillas: cada campo se coloca en la hoja y el mismo diseño sirve en carta y oficio, con o sin fondo.",
      "Se puede imprimir solo el texto sobre papel ya impreso, calibrar en milímetros si sale corrido y generar todos los certificados de un examen desde una hoja de Excel.",
    ],
    approach: [
      { title: "Sin errores de folio", copy: "El folio se arma solo con un patrón (iniciales del profesor y consecutivo) y queda en el historial." },
      { title: "Diseño flexible", copy: "Plantillas con fondo, firmas y fuentes propias; textos que combinan datos como nombre, examen y fecha." },
      { title: "Datos seguros", copy: "Usuarios con roles, bitácora y respaldos automáticos diarios." },
    ],
    deliverables: [
      { title: "Certificado individual", copy: "Captura rápida e impresión al momento." },
      { title: "Generación masiva", copy: "Todos los certificados de un examen desde Excel o CSV." },
      { title: "Diseñador de plantillas", copy: "Campos, fondo, firmas y fuentes, con vista previa." },
      { title: "Calibración", copy: "Ajuste en milímetros para imprimir sobre hojas ya impresas." },
      { title: "Historial y folios", copy: "Registro de cada certificado emitido y PDF guardado." },
      { title: "Respaldos", copy: "Copia automática diaria; se conservan las últimas 30." },
    ],
    lead: lead([
      "Diseño y desarrollo del programa de certificados para el Instituto Mexicano Moopalkwan.",
      "Enfoque: imprimir sin errores y en minutos lo que antes tomaba horas.",
    ]),
    highlights: [
      "Certificados en carta y oficio con el mismo diseño",
      "Generación masiva desde Excel o CSV",
      "Folios automáticos con historial",
      "Calibración para hojas ya impresas",
      "Respaldos automáticos diarios",
    ],
    stackNote: "Windows · Electron · React · SQLite · PDF",
    seoTitle: "Certificados Moopalkwan — programa para certificados de taekwondo",
    seoDescription:
      "Caso ATRIX Technologies: programa de escritorio para generar e imprimir certificados de grado con folios, plantillas y generación masiva desde Excel.",
    keywords: ["certificados taekwondo", "programa de certificados", "generar certificados desde Excel", "Moopalkwan", "ATRIX Technologies"],
    theme: { bg: "#fbf7ee", bgElevated: "#ffffff", fg: "#2a1a08", muted: "#6b5537", accent: "#b8860b", accentInk: "#ffffff", glow: "rgba(184,134,11,0.22)", light: true },
    themeDark: { bg: "#140d05", bgElevated: "#22170a", fg: "#fbf3e2", muted: "#c3ad88", accent: "#e0b14a", accentInk: "#1a1005", glow: "rgba(224,177,74,0.26)" },
    challenge:
      "Cada examen genera decenas de certificados con nombre, grado, profesor y folio. Hacerlos a mano toma horas y un error obliga a reimprimir hojas que ya vienen impresas.",
    solution:
      "Un programa que llena e imprime los certificados con el diseño del instituto, uno por uno o todos a la vez desde Excel, con folios automáticos y calibración de impresión.",
    impact: [
      "Certificados listos en minutos después de cada examen",
      "Folios consecutivos sin repetirse",
      "Historial de todo lo emitido",
    ],
    modules: [
      { title: "Individual", copy: "Captura e impresión de un certificado." },
      { title: "Masivo", copy: "Importación desde Excel o CSV." },
      { title: "Plantillas", copy: "Diseñador con campos ubicados en la hoja." },
      { title: "Hoja", copy: "Tamaño, modo con fondo o solo datos, y calibración." },
      { title: "Historial", copy: "Folios, PDF generados y bitácora." },
      { title: "Usuarios", copy: "Administrador y operador con permisos distintos." },
    ],
    technologies: [
      { name: "Windows", role: "Programa con instalador" },
      { name: "Electron + React", role: "Interfaz y diseñador de plantillas" },
      { name: "SQLite", role: "Usuarios, folios y bitácora" },
      { name: "PDF", role: "Certificados listos para imprimir" },
      { name: "Excel / CSV", role: "Generación masiva" },
      { name: "Respaldos", role: "Copias automáticas diarias" },
    ],
    process: [
      { title: "Analizar el certificado", copy: "Campos, folio y papel que usa el instituto." },
      { title: "Diseñar la plantilla", copy: "El certificado reproducido con su diseño original." },
      { title: "Automatizar", copy: "Folios, generación masiva y calibración de impresión." },
      { title: "Entregar", copy: "Instalador para Windows y respaldos configurados." },
    ],
    persuasion: [
      "Si emites constancias, diplomas o certificados, ATRIX puede automatizarlos.",
      "Imprime sobre tus hojas oficiales sin perder el diseño.",
      "Ideal para escuelas, academias y asociaciones deportivas.",
    ],
    year: "2026",
    location: "México",
  },
  {
    slug: "contatrix",
    kind: "escritorio",
    name: "ContaTrix",
    sector: "Contabilidad · Bancos e impuestos",
    summary:
      "Programa de contabilidad, bancos e impuestos para empresas mexicanas: catálogo del SAT, pólizas, CFDI, balanza, estados financieros y conciliación bancaria.",
    result:
      "Contabilidad de partida doble con el catálogo del SAT, varias empresas por equipo y reportes financieros listos para imprimir o exportar.",
    previewImage: "/projects/contatrix-preview.jpg",
    logo: "/projects/logos/contatrix.png",
    tags: ["Windows", "Catálogo del SAT", "Pólizas", "CFDI", "Bancos", "DIOT"],
    stats: [
      { value: "Partida doble", label: "Pólizas validadas al guardar" },
      { value: "SAT", label: "Catálogo y claves oficiales" },
      { value: "1 archivo", label: "Por empresa" },
      { value: "Centavos", label: "Importes exactos, sin redondeos" },
    ],
    story: [
      "ContaTrix es un programa de contabilidad para México que reúne en una sola aplicación la contabilidad, los bancos y los impuestos de varias empresas.",
      "ATRIX Technologies lo diseñó como una aplicación de escritorio clásica (barra de menús, barra de íconos y ventanas internas) para que un contador trabaje rápido con teclado y atajos.",
      "Las reglas contables viven en un núcleo probado: importes en centavos, cuentas afectables, periodos de apertura y de ajuste, y validación de cada póliza antes de guardarla.",
    ],
    approach: [
      { title: "Exactitud", copy: "Importes en centavos y pólizas que solo se guardan si cuadran." },
      { title: "Como lo conoce el contador", copy: "Menús, atajos de teclado y ventanas internas al estilo de los programas contables." },
      { title: "Cada empresa aparte", copy: "Cada empresa es su propio archivo, fácil de respaldar y mover." },
    ],
    deliverables: [
      { title: "Catálogo de cuentas", copy: "Estructura configurable con la clave agrupadora del SAT." },
      { title: "Pólizas", copy: "Captura de ingresos, egresos y diario con validación." },
      { title: "CFDI", copy: "Comprobantes ligados a pólizas y documentos bancarios." },
      { title: "Bancos", copy: "Cheques, transferencias, depósitos y conciliación con el estado de cuenta." },
      { title: "Reportes", copy: "Balanza de comprobación, auxiliares, estado de resultados y balance general." },
      { title: "Impuestos", copy: "IVA, DIOT y XML para el SAT." },
    ],
    lead: lead([
      "Diseño y desarrollo de ContaTrix: contabilidad, bancos e impuestos para empresas mexicanas.",
      "Enfoque: reglas contables correctas y una forma de trabajar familiar para el contador.",
    ]),
    highlights: [
      "Contabilidad de partida doble con el catálogo del SAT",
      "Bancos con conciliación del estado de cuenta",
      "CFDI ligados a pólizas",
      "Balanza, auxiliares, resultados y balance",
      "Varias empresas, cada una en su archivo",
    ],
    stackNote: "Windows · Electron · React · SQLite",
    seoTitle: "ContaTrix — contabilidad, bancos e impuestos para México",
    seoDescription:
      "Caso ATRIX Technologies: ContaTrix, programa de contabilidad con catálogo del SAT, pólizas, CFDI, bancos, conciliación, balanza y estados financieros.",
    keywords: ["programa de contabilidad", "contabilidad SAT", "software contable México", "conciliación bancaria", "ATRIX Technologies"],
    theme: { bg: "#f3f8f5", bgElevated: "#ffffff", fg: "#0c2a1f", muted: "#4b6359", accent: "#0f7a55", accentInk: "#ffffff", glow: "rgba(15,122,85,0.2)", light: true },
    themeDark: { bg: "#06160f", bgElevated: "#0c2419", fg: "#ecf7f1", muted: "#9cbcae", accent: "#2fbf86", accentInk: "#06160f", glow: "rgba(47,191,134,0.24)" },
    challenge:
      "Llevar la contabilidad de varias empresas exige exactitud, reglas del SAT y reportes confiables; un error de captura o de redondeo descuadra todo el periodo.",
    solution:
      "Un programa con reglas contables en un núcleo probado, catálogo del SAT, bancos con conciliación y reportes financieros, en una interfaz que el contador ya conoce.",
    impact: [
      "Pólizas que no se guardan si no cuadran",
      "Bancos conciliados contra el estado de cuenta",
      "Reportes financieros listos para imprimir",
    ],
    modules: [
      { title: "Empresa", copy: "Alta de empresas, ejercicios y estructura de cuentas." },
      { title: "Catálogo", copy: "Cuentas de mayor y de detalle con clave agrupadora del SAT." },
      { title: "Pólizas", copy: "Captura, validación y afectación." },
      { title: "Bancos", copy: "Documentos bancarios, traspasos y conciliación." },
      { title: "Reportes", copy: "Balanza, auxiliares, resultados y balance." },
      { title: "Impuestos", copy: "IVA, DIOT y XML del SAT." },
    ],
    technologies: [
      { name: "Windows", role: "Programa con instalador" },
      { name: "Electron + React", role: "Interfaz de escritorio con ventanas internas" },
      { name: "SQLite", role: "Un archivo por empresa" },
      { name: "Núcleo contable", role: "Reglas puras con pruebas automáticas" },
      { name: "PDF y Excel", role: "Exportación de reportes" },
      { name: "Respaldos", role: "Copias de cada empresa" },
    ],
    process: [
      { title: "Estudiar el flujo contable", copy: "Catálogo, pólizas, periodos y cierre del ejercicio." },
      { title: "Construir el núcleo", copy: "Reglas contables puras y probadas antes de la interfaz." },
      { title: "Diseñar la interfaz", copy: "Menús, atajos y ventanas al estilo de un programa contable." },
      { title: "Agregar módulos", copy: "Bancos, CFDI, impuestos y reportes." },
    ],
    persuasion: [
      "ATRIX puede construir software contable y administrativo a la medida de tu despacho.",
      "Reglas correctas primero: la interfaz viene después.",
      "Ideal para despachos y empresas que necesitan control propio de su información.",
    ],
    year: "2026",
    location: "México",
  },
  {
    slug: "control-de-gastos",
    kind: "escritorio",
    name: "Control de Gastos",
    sector: "Finanzas · Control de gastos",
    summary:
      "Programa para Windows para registrar gastos por día con calendario, presupuesto mensual, reportes en PDF y Excel, y respaldos automáticos.",
    result:
      "Gastos capturados en segundos desde el calendario, con totales por día, semana y mes, presupuesto y reportes listos para compartir.",
    previewImage: "/projects/control-gastos-preview.jpg",
    logo: "/projects/logos/control-gastos.png",
    tags: ["Windows", "Calendario", "Presupuesto", "Reportes PDF y Excel", "Respaldos automáticos"],
    stats: [
      { value: "12", label: "Meses en la vista anual" },
      { value: "Enter", label: "Captura rápida: concepto + monto" },
      { value: "4", label: "Tipos de respaldo automático" },
      { value: "PDF + Excel", label: "Por año, mes, semana o día" },
    ],
    story: [
      "Control de Gastos es un programa sencillo para saber en qué se va el dinero: cada gasto es un concepto libre con monto, fecha y forma de pago.",
      "El calendario es el centro: vista anual con el total de cada mes, vista mensual por semanas y un panel del día para capturar rápido, con sugerencias de conceptos ya usados y una nota por día.",
      "Hay una edición hermana, Control de Gastos e Ingresos, con ingresos y categorías, que se instala por separado.",
    ],
    approach: [
      { title: "Capturar sin pensar", copy: "Concepto, monto y Enter. El programa sugiere los conceptos que ya usaste." },
      { title: "Ver el mes de un vistazo", copy: "Cada día muestra su total y cada semana su acumulado." },
      { title: "No perder nada", copy: "Respaldos por cambio, diarios, mensuales y al cerrar, verificados uno por uno." },
    ],
    deliverables: [
      { title: "Calendario anual y mensual", copy: "Totales por mes, semana y día, con minicalendarios en color." },
      { title: "Panel del día", copy: "Captura rápida, conceptos de la semana y nota del día con guardado automático." },
      { title: "Presupuesto", copy: "Presupuesto mensual con avance." },
      { title: "Reportes", copy: "PDF y Excel del año, mes, semana, día o días seleccionados." },
      { title: "Respaldos", copy: "Automáticos y verificados, con restauración desde configuración." },
      { title: "Edición con ingresos", copy: "Versión aparte con ingresos y categorías." },
    ],
    lead: lead([
      "Diseño y desarrollo de Control de Gastos y su edición con ingresos.",
      "Enfoque: que registrar un gasto tome segundos y que los datos nunca se pierdan.",
    ]),
    highlights: [
      "Calendario anual, mensual y panel del día",
      "Captura rápida con sugerencias",
      "Presupuesto mensual con avance",
      "Reportes en PDF y Excel por cualquier periodo",
      "Respaldos automáticos verificados",
    ],
    stackNote: "Windows · Electron · React · SQLite",
    seoTitle: "Control de Gastos — programa de gastos con calendario y reportes",
    seoDescription:
      "Caso ATRIX Technologies: programa de escritorio para Windows con calendario de gastos, presupuesto mensual, reportes PDF y Excel y respaldos automáticos.",
    keywords: ["control de gastos", "programa de gastos Windows", "presupuesto mensual", "reportes de gastos", "ATRIX Technologies"],
    theme: { bg: "#f4f7fd", bgElevated: "#ffffff", fg: "#0f1b33", muted: "#536079", accent: "#2563eb", accentInk: "#ffffff", glow: "rgba(37,99,235,0.2)", light: true },
    themeDark: { bg: "#0b0f17", bgElevated: "#121826", fg: "#eef2fb", muted: "#97a3bb", accent: "#4f8bff", accentInk: "#ffffff", glow: "rgba(79,139,255,0.26)" },
    challenge:
      "Anotar gastos en una libreta o en el celular se abandona pronto: es lento, no da totales y no ayuda a ver en qué se va el dinero.",
    solution:
      "Un programa enfocado solo en gastos, con un calendario que suma solo, captura en segundos, presupuesto y reportes listos.",
    impact: [
      "Gastos al día sin esfuerzo",
      "Totales por día, semana, mes y año",
      "Reportes para revisar o compartir",
    ],
    modules: [
      { title: "Panel", copy: "Gastado del mes, promedio diario, presupuesto y gastos por concepto." },
      { title: "Calendario", copy: "Vista anual y mensual con totales y acumulados." },
      { title: "Gastos", copy: "Lista completa con búsqueda y forma de pago." },
      { title: "Presupuesto", copy: "Meta mensual y avance." },
      { title: "Reportes", copy: "PDF y Excel con resumen, detalle y notas." },
      { title: "Configuración", copy: "Respaldos y restauración." },
    ],
    technologies: [
      { name: "Windows", role: "Programa con instalador" },
      { name: "Electron + React", role: "Interfaz del programa" },
      { name: "SQLite", role: "Base de datos local" },
      { name: "Excel", role: "Reportes con fórmulas" },
      { name: "PDF", role: "Reportes tamaño carta" },
      { name: "Respaldos", role: "Por cambio, diarios, mensuales y al cerrar" },
    ],
    process: [
      { title: "Simplificar", copy: "Solo gastos, sin categorías obligatorias." },
      { title: "Diseñar el calendario", copy: "Totales visibles en cada día, semana y mes." },
      { title: "Proteger los datos", copy: "Respaldos automáticos verificados." },
      { title: "Extender", copy: "Edición aparte con ingresos y categorías." },
    ],
    persuasion: [
      "Un buen programa resuelve una cosa muy bien.",
      "ATRIX crea herramientas a la medida para el control de tu negocio o tu casa.",
      "Funciona sin internet, en la computadora que ya tienes.",
    ],
    year: "2026",
    location: "Nuevo Laredo, Tamaulipas",
  },
  {
    slug: "moneychange",
    kind: "escritorio",
    name: "MONEYCHANGE — Sistema para casas de cambio",
    sector: "Finanzas · Casa de cambio",
    summary:
      "Programa para Windows para casas de cambio: compra y venta de divisas, conteo de billetes, tickets, corte físico, cierre del día y respaldos automáticos.",
    result:
      "Cada sucursal opera con su propio programa: registra operaciones, cuenta billetes, imprime tickets y cierra el día con el resumen por correo y WhatsApp.",
    previewImage: "/projects/moneychange-preview.jpg",
    tags: ["Windows", "Compra y venta de divisas", "Conteo de billetes", "Tickets térmicos", "Cierre del día"],
    stats: [
      { value: "1 PC", label: "Por sucursal, con sus propios datos" },
      { value: "57/80 mm", label: "Tickets térmicos o carta" },
      { value: "Promedio", label: "Costo ponderado por divisa" },
      { value: "Correo", label: "Resumen al hacer el cierre" },
    ],
    story: [
      "Una casa de cambio necesita registrar cada compra y venta con exactitud, saber cuánto tiene de cada divisa y cerrar el día cuadrado, sin depender de internet.",
      "ATRIX Technologies desarrolló MONEYCHANGE: un programa de escritorio por sucursal con compra y venta de divisas, conteo de billetes por denominación, tickets con el logo del negocio y corte físico diario.",
      "Al hacer el cierre, el sistema envía el resumen por correo (posición por divisa, compras, ventas, utilidad y billetes contados) y por WhatsApp.",
    ],
    approach: [
      { title: "Cuadrar siempre", copy: "El conteo de billetes avisa qué lado recontar si no cuadra, y no registra hasta que cuadre." },
      { title: "Cálculos correctos", copy: "Costo promedio ponderado por divisa y la misma fórmula de utilidad en todos los reportes." },
      { title: "Datos a salvo", copy: "Los datos viven fuera del programa y se respaldan solos." },
    ],
    deliverables: [
      { title: "Compra y venta", copy: "Operaciones en divisa o en pesos, con tipo de cambio especial cuando se necesita." },
      { title: "Conteo de billetes", copy: "Billetes y monedas por denominación para la divisa y los pesos." },
      { title: "Tickets", copy: "Comprobante con logo en impresoras térmicas de 57/80 mm, media carta o carta." },
      { title: "Corte físico", copy: "Por día y divisa: lo que había, entró, salió y lo contado." },
      { title: "Cierre del día", copy: "Resumen por correo y WhatsApp, con billetes en caja." },
      { title: "Configuración inicial", copy: "Asistente para negocio, logo, administrador y tipo de cambio, o restaurar un respaldo." },
    ],
    lead: lead([
      "Diseño y desarrollo de MONEYCHANGE para la operación diaria de casas de cambio.",
      "Enfoque: que cada operación y cada cierre cuadren, con o sin internet.",
    ]),
    highlights: [
      "Compra y venta de divisas con costo promedio ponderado",
      "Conteo de billetes por denominación",
      "Tickets en impresoras térmicas",
      "Corte físico y cierre del día",
      "Resumen del cierre por correo y WhatsApp",
    ],
    stackNote: "Windows · Electron · React · Node · SQLite",
    seoTitle: "MONEYCHANGE — sistema para casas de cambio",
    seoDescription:
      "Caso ATRIX Technologies: programa para casas de cambio con compra y venta de divisas, conteo de billetes, tickets, corte físico y cierre del día.",
    keywords: ["sistema casa de cambio", "software casa de cambio", "compra venta de divisas", "conteo de billetes", "ATRIX Technologies"],
    theme: { bg: "#f5f6f8", bgElevated: "#ffffff", fg: "#0c2d48", muted: "#4f6273", accent: "#b38b12", accentInk: "#ffffff", glow: "rgba(201,162,39,0.22)", light: true },
    themeDark: { bg: "#06182a", bgElevated: "#0c2d48", fg: "#f1f4f8", muted: "#a3b4c4", accent: "#c9a227", accentInk: "#0c2d48", glow: "rgba(201,162,39,0.26)" },
    challenge:
      "En una casa de cambio cada peso cuenta: un error de captura o de conteo descuadra la caja, y sin internet no se puede detener la operación.",
    solution:
      "Un programa por sucursal que registra cada operación, guía el conteo de billetes, imprime tickets y cierra el día con resumen automático.",
    impact: [
      "Operaciones registradas con exactitud",
      "Caja cuadrada con conteo por denominación",
      "Dueño informado al cierre por correo y WhatsApp",
    ],
    modules: [
      { title: "Inicio", copy: "Tipo de cambio, existencias y accesos rápidos." },
      { title: "Compra / Venta", copy: "Operaciones con conteo de billetes y ticket." },
      { title: "Corte del día", copy: "Corte físico por divisa con diferencias." },
      { title: "Cierre", copy: "Posición, utilidad, billetes y envío del resumen." },
      { title: "Reportes", copy: "Operaciones, gráficas y exportación." },
      { title: "Utilerías", copy: "Impresoras, correo, respaldos y base de datos." },
    ],
    technologies: [
      { name: "Windows", role: "Programa con instalador" },
      { name: "Electron + React", role: "Interfaz del programa" },
      { name: "Node + SQLite", role: "Reglas del negocio y datos locales" },
      { name: "Impresión directa", role: "Tickets térmicos ESC/POS" },
      { name: "Correo", role: "Resumen del cierre" },
      { name: "WhatsApp", role: "Detalle del cierre y del corte" },
    ],
    process: [
      { title: "Conocer la operación", copy: "Compra, venta, conteo y cierre en mostrador." },
      { title: "Calcular bien", copy: "Costo promedio, utilidad y redondeos correctos con pruebas." },
      { title: "Probar en mostrador", copy: "Pantallas que caben en monitores pequeños e impresoras reales." },
      { title: "Mejorar con el uso", copy: "Versiones frecuentes según lo que pide la sucursal." },
    ],
    persuasion: [
      "ATRIX construye sistemas para negocios donde cada operación debe cuadrar.",
      "Funciona sin internet y se adapta a tus impresoras.",
      "Ideal para casas de cambio, cajas y negocios con manejo de efectivo.",
    ],
    year: "2026",
    location: "Nuevo Laredo, Tamaulipas",
  },
];
