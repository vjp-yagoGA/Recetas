const coleccion = [
  {
    nombre: 'Tarta de manzana',
    categoria: 'postre',
    tiempo: 45,
    fecha: '2026-11-01',
    descripcion: 'Receta clásica de manzana y canela.',
    codigo: 'TAR-1001'
  },
  {
    nombre: 'Paella de verduras',
    categoria: 'principal',
    tiempo: 60,
    fecha: '2026-10-20',
    descripcion: 'Arroz con verduras y azafrán.',
    codigo: 'PAE-2002'
  },
  {
    nombre: 'Ensalada César',
    categoria: 'ensalada',
    tiempo: 20,
    fecha: '2026-11-07',
    descripcion: 'Aguacate, pollo, lechuga y aderezo.',
    codigo: 'ENS-3003'
  },
  {
    nombre: 'Sopa de lentejas',
    categoria: 'sopa',
    tiempo: 35,
    fecha: '2026-09-15',
    descripcion: 'Ideal para días fríos y con mucho sabor.',
    codigo: 'SOP-4004'
  },
  {
    nombre: 'Pasta al pesto',
    categoria: 'principal',
    tiempo: 25,
    fecha: '2026-10-10',
    descripcion: 'Pasta con albahaca, ajo y parmesano.',
    codigo: 'PAS-5005'
  },
  {
    nombre: 'Gazpacho andaluz',
    categoria: 'sopa',
    tiempo: 15,
    fecha: '2026-11-05',
    descripcion: 'Versión fresca con tomate y pimiento.',
    codigo: 'GAZ-6006'
  },
  {
    nombre: 'Brownie de chocolate',
    categoria: 'postre',
    tiempo: 50,
    fecha: '2026-10-04',
    descripcion: 'Brownie intenso y mantecoso.',
    codigo: 'BRO-7007'
  },
  {
    nombre: 'Pollo al ajillo',
    categoria: 'principal',
    tiempo: 40,
    fecha: '2026-11-08',
    descripcion: 'Pollo con ajo, perejil y vino blanco.',
    codigo: 'POL-8008'
  },
  {
    nombre: 'Ceviche de mango',
    categoria: 'entrante',
    tiempo: 18,
    fecha: '2026-09-29',
    descripcion: 'Frescura tropical y toque cítrico.',
    codigo: 'CEV-9009'
  },
  {
    nombre: 'Fajitas veganas',
    categoria: 'principal',
    tiempo: 30,
    fecha: '2026-10-27',
    descripcion: 'Tortillas rellenas con verduras y legumbres.',
    codigo: 'FAJ-1010'
  }
];

const DIAS_RECIENTE = 30;
let textoBuscado = '';
let criterio = 'ninguno';

function guardarCookie(nombre, valor, dias = 30) {
  const segundos = dias * 24 * 60 * 60;
  const texto = encodeURIComponent(valor);
  document.cookie = `${nombre}=${texto};max-age=${segundos};path=/`;
}

function leerCookie(nombre) {
  const partes = document.cookie.split(';');

  for (const parte of partes) {
    const [clave, valor] = parte.trim().split('=');
    if (clave === nombre) {
      return decodeURIComponent(valor);
    }
  }

  return null;
}

function crearFecha(texto) {
  return new Date(`${texto}T00:00:00`);
}

function fechaLegible(texto) {
  return crearFecha(texto).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function diasDesde(texto) {
  const MS_DIA = 24 * 60 * 60 * 1000;
  const ms = Date.now() - crearFecha(texto).getTime();
  return Math.floor(ms / MS_DIA);
}

function buscarPorTexto(lista, texto) {
  const textoNormalizado = texto.toLowerCase();

  return lista.filter((item) => {
    return (
      item.nombre.toLowerCase().includes(textoNormalizado) ||
      item.categoria.toLowerCase().includes(textoNormalizado) ||
      item.descripcion.toLowerCase().includes(textoNormalizado)
    );
  });
}

function crearTarjeta(elemento) {
  const tarjeta = document.createElement('article');
  tarjeta.classList.add('tarjeta');

  if (diasDesde(elemento.fecha) <= DIAS_RECIENTE) {
    tarjeta.classList.add('reciente');
  }

  const titulo = document.createElement('h3');
  titulo.textContent = elemento.nombre;

  const categoria = document.createElement('span');
  categoria.classList.add('categoria');
  categoria.textContent = elemento.categoria;

  const datos = document.createElement('p');
  datos.textContent = `Tiempo: ${elemento.tiempo} min · Código: ${elemento.codigo}`;

  const fecha = document.createElement('p');
  fecha.classList.add('fecha');
  fecha.textContent = fechaLegible(elemento.fecha);

  const descripcion = document.createElement('p');
  descripcion.textContent = elemento.descripcion;

  tarjeta.append(categoria, titulo, datos, fecha, descripcion);
  return tarjeta;
}

function pintar(lista) {
  const contenedor = document.querySelector('#listado');
  contenedor.replaceChildren();

  for (const elemento of lista) {
    contenedor.appendChild(crearTarjeta(elemento));
  }
}

function estadisticas(lista) {
  if (lista.length === 0) {
    return null;
  }

  const tiempos = lista.map(item => item.tiempo);
  const total = tiempos.reduce((acc, valor) => acc + valor, 0);
  const media = total / lista.length;
  const maximo = Math.max(...tiempos);
  const minimo = Math.min(...tiempos);

  return { total, media, maximo, minimo };
}

function pintarEstadisticas(lista) {
  const elemento = document.querySelector('#estadisticas');
  const datos = estadisticas(lista);

  if (!datos) {
    elemento.textContent = 'No hay estadísticas disponibles.';
    return;
  }

  elemento.textContent = `Total: ${datos.total} min · Media: ${datos.media.toFixed(1)} min · Máximo: ${datos.maximo} min · Mínimo: ${datos.minimo} min`;
}

function ordenar(lista, criterioActual) {
  const copia = [...lista];

  if (criterioActual === 'nombre') {
    copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (criterioActual === 'tiempo') {
    copia.sort((a, b) => a.tiempo - b.tiempo);
  } else if (criterioActual === 'fecha') {
    copia.sort((a, b) => crearFecha(b.fecha) - crearFecha(a.fecha));
  }

  return copia;
}

function pintarResumen(mostrados) {
  const resumen = document.querySelector('#resumen');
  resumen.textContent = `Mostrando ${mostrados} de ${coleccion.length} recetas`;
}

function actualizar() {
  const filtradas = buscarPorTexto(coleccion, textoBuscado);
  const ordenadas = ordenar(filtradas, criterio);

  pintar(ordenadas);
  pintarEstadisticas(ordenadas);
  pintarResumen(ordenadas.length);

  const sinResultados = document.querySelector('#noHayResultados');
  sinResultados.hidden = ordenadas.length > 0;
}

function elegirOrden(nuevo) {
  criterio = nuevo;
  guardarCookie('orden', criterio, 30);
  actualizar();
}

function borrarCookieOrden() {
  document.cookie = 'orden=; max-age=0; path=/';
  criterio = 'ninguno';
  actualizar();
}

function limpiarBuscador() {
  textoBuscado = '';
  document.querySelector('#buscador').value = '';
  guardarCookie('busqueda', '', 30);
  actualizar();
}

function validarCampo(valor, regex) {
  return regex.test(valor);
}

function validarFormulario() {
  const nombre = document.querySelector('#nombre').value.trim();
  const categoria = document.querySelector('#categoria').value.trim();
  const tiempo = document.querySelector('#tiempo').value.trim();
  const fecha = document.querySelector('#fecha').value;
  const codigo = document.querySelector('#codigo').value.trim();
  const mensaje = document.querySelector('#mensajeValidacion');

  const nombreValido = validarCampo(nombre, /^[A-Za-zÁ-ÿ0-9\s]{3,}$/);
  const categoriaValida = validarCampo(categoria, /^[A-Za-zÁ-ÿ\s]{2,}$/);
  const tiempoValido = validarCampo(tiempo, /^[1-9]\d*$/);
  const fechaValida = validarCampo(fecha, /^\d{4}-\d{2}-\d{2}$/);
  const codigoValido = validarCampo(codigo, /^[A-Z]{3}-\d{4}$/);

  if (!nombreValido || !categoriaValida || !tiempoValido || !fechaValida || !codigoValido) {
    mensaje.textContent = 'Datos no válidos. Revisa nombre, categoría, tiempo, fecha y código (ABC-1234).';
    mensaje.className = 'mensaje error';
    return false;
  }

  coleccion.push({
    nombre,
    categoria,
    tiempo: Number(tiempo),
    fecha,
    descripcion: `Receta añadida recientemente en ${categoria}.`,
    codigo
  });

  mensaje.textContent = 'Receta guardada correctamente.';
  mensaje.className = 'mensaje ok';
  document.querySelector('#nombre').value = '';
  document.querySelector('#categoria').value = '';
  document.querySelector('#tiempo').value = '';
  document.querySelector('#fecha').value = '';
  document.querySelector('#codigo').value = '';
  actualizar();
  return true;
}

function inicializarEventos() {
  document.querySelector('#buscador').addEventListener('input', (event) => {
    textoBuscado = event.target.value;
    guardarCookie('busqueda', textoBuscado, 30);
    actualizar();
  });

  document.querySelector('#ordenNombre').addEventListener('click', () => elegirOrden('nombre'));
  document.querySelector('#ordenTiempo').addEventListener('click', () => elegirOrden('tiempo'));
  document.querySelector('#ordenFecha').addEventListener('click', () => elegirOrden('fecha'));
  document.querySelector('#limpiar').addEventListener('click', limpiarBuscador);
  document.querySelector('#olvidarOrden').addEventListener('click', borrarCookieOrden);
  document.querySelector('#guardarReceta').addEventListener('click', validarFormulario);
}

function recuperarEstado() {
  const ordenGuardado = leerCookie('orden');
  const busquedaGuardada = leerCookie('busqueda');

  if (ordenGuardado) {
    criterio = ordenGuardado;
  }

  if (busquedaGuardada) {
    textoBuscado = busquedaGuardada;
    document.querySelector('#buscador').value = textoBuscado;
  }
}

function init() {
  recuperarEstado();
  inicializarEventos();
  actualizar();
}

init();
