interface EquivalenceRule {
  oldName: string; // Nombre de la materia del Plan Viejo
  newName: string; // Nombre de la materia del Plan Nuevo que se homologa
}

export const EQUIVALENCE_DATA: EquivalenceRule[] = [
  // --- CIENCIAS BÁSICAS ---
  { oldName: 'CALCULO I', newName: 'Cálculo Diferencial' },
  { oldName: 'CALCULO I', newName: 'Matemáticas' }, // Regla: Cálculo I cubre Matemáticas
  { oldName: 'CALCULO II', newName: 'Cálculo Integral' },
  { oldName: 'CALCULO III', newName: 'Cálculo Multivariable' },
  { oldName: 'CALCULO IV', newName: 'Ecuaciones diferenciales' },
  { oldName: 'FISICA I', newName: 'Mecánica' },
  { oldName: 'FISICA II', newName: 'Ondas' },
  { oldName: 'FISICA III', newName: 'Electromagnetismo' },

  // --- CIENCIAS BÁSICAS DE INGENIERÍA ---
  { oldName: 'ALGEBRA LINEAL', newName: 'Álgebra Lineal' },
  { oldName: 'ANALISIS NUMERICO', newName: 'Análisis Numérico' },
  { oldName: 'CIRCUITOS', newName: 'Circuitos' },
  { oldName: 'ESTADISTICA', newName: 'Estadística descriptiva e inferencial' },
  {
    oldName: 'INVESTIGACIÓN DE OPERACIONES I',
    newName: 'Investigación de Operaciones',
  },
  {
    oldName: 'INVESTIGACIÓN DE OPERACIONES II',
    newName: 'Investigación de Operaciones',
  },
  { oldName: 'LÓGICA MATEMÁTICA', newName: 'Lógica Matemática' },

  // --- INGENIERÍA APLICADA ---
  {
    oldName: 'FUNDAMENTOS DE PROGRAMACIÓN',
    newName: 'Algoritmos y fundamentos de programación',
  },
  {
    oldName: 'ARQUITECTURA DEL COMPUTADOR.',
    newName: 'Arquitectura del Computador',
  },
  { oldName: 'BASE DE DATOS I', newName: 'Base de Datos' },
  { oldName: 'DISEÑO GRÁFICO', newName: 'Diseño Gráfico' },
  { oldName: 'ELECTIVA DEL PROGRAMA I', newName: 'Electiva del Programa I' },
  { oldName: 'ELECTIVA DEL PROGRAMA II', newName: 'Electiva del Programa II' },
  { oldName: 'ESTRUCTURA DE DATOS', newName: 'Estructura de Datos' },
  { oldName: 'INGENIERIA DEL SOFTWARE I', newName: 'Ingeniería de Software I' },
  {
    oldName: 'INGENIERIA DEL SOFTWAREII',
    newName: 'Ingeniería de Software II',
  },
  { oldName: 'INTELIGENCIA DE NEGOCIOS', newName: 'Inteligencia de negocios' },
  {
    oldName: 'INTRODUCCIONA LA INGENIERIA DE SISTEMAS',
    newName: 'Introducción a la Ingeniería de Sistemas',
  },
  {
    oldName: 'MODELAMIENTO Y SIMULACIÓN',
    newName: 'Modelamiento y Simulación',
  },
  { oldName: 'PENSAMIENTO SISTÉMICO', newName: 'Pensamiento Sistémico' },
  { oldName: 'PROGRAMACIÓN I', newName: 'Programación de computadores I' },
  { oldName: 'PROGRAMACIÓN II', newName: 'Programación de computadores II' },
  { oldName: 'PROGRAMACIÓN III', newName: 'Programación de computadores III' },
  { oldName: 'PROGRAMACIÓN IV', newName: 'Programación Web' },
  {
    oldName: 'REDES Y TELECOMUNICACIONES',
    newName: 'Fundamentos de Redes Informáticas',
  },
  {
    oldName: 'REDES Y TELECOMUNICACIONES II',
    newName: 'Optimización de Redes Informáticas',
  },
  {
    oldName: 'SEGURIDAD Y PRIVACIDAD DE LA INFORMACIÓN',
    newName: 'Seguridad y Privacidad Información',
  },
  { oldName: 'SISTEMAS OPERATIVOS', newName: 'Sistemas Operativos' },
  { oldName: 'PROFUNDIZACIÓN BI', newName: 'Programación Móviles' },

  // --- ÁREA DE INVESTIGACIÓN ---
  {
    oldName: 'METODOLOGIA DE INVESTIGACION',
    newName: 'Metodología de Investigación',
  },
  { oldName: 'PROYECTO DE GRADO I', newName: 'Proyecto de Grado I' },
  { oldName: 'PROYECTO DE GRADO II', newName: 'Proyecto de Grado II' },
  {
    oldName: 'SEMILLEROS DE INVESTIGACION',
    newName: 'Semillero de Investigación',
  },
  {
    oldName: 'SEMINARIO DE INVESTIGACIÓN',
    newName: 'Seminario de Investigación',
  },
  // --- ÁREA COMPLEMENTARIA E INSTITUCIONAL ---
  {
    oldName: 'COMUNICACIÓN ORAL Y ESCRITA I',
    newName: 'Expresión oral y escrita I',
  },
  {
    oldName: 'COMUNICACIÓN ORAL Y ESCRITA II',
    newName: 'Expresión oral y escrita II',
  },
  { oldName: 'DESARROLLO HUMANO', newName: 'Humanidades I' },
  {
    oldName: 'ELECTIVA COMPLEMENTARIA',
    newName: 'Electiva Ciencias Administrativas, Económicas y Contables',
  },
  { oldName: 'RESPONSABILIDAD PROFESIONAL', newName: 'Ética Profesional' },
  { oldName: 'DERECHO INFORMÁTICO', newName: 'Legislación Tecnológica' },
  {
    oldName: 'DERECHO CONSTITUCIONAL',
    newName: 'Formación Ciudadana y Constitucional',
  },
  { oldName: 'TECHNICAL ENGLISH I', newName: 'Tech English I' },
  { oldName: 'TECHNICAL ENGLISH II', newName: 'Tech English II' },
  { oldName: 'ACT. CULTURAL Y DPTIVA I', newName: 'Actividad Deportiva' },
  { oldName: 'ACT. CULTURAL Y DPTIVA I', newName: 'Actividad Cultural' },
  { oldName: 'CÁTEDRA DE LA PAZ', newName: 'Cátedra de la paz' },
  { oldName: 'CÁTEDRA UPECISTA', newName: 'Cátedra Upecista' },
];
