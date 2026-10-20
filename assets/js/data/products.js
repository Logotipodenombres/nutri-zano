/**
 * ============================================================
 *  NUTRI-ZANO · CATÁLOGO DE PRODUCTOS (archivo de datos)
 * ============================================================
 *  ADMINISTRAR PRODUCTOS
 *  -------------------------------------------------
 *  1. AGREGAR: copia un bloque { ... } completo dentro del
 *     arreglo `productos` y edítalo.
 *  2. MODIFICAR: cambia el texto entre comillas.
 *  3. OCULTAR: cambia `"visible": true` a `"visible": false`
 *     (el producto deja de mostrarse sin borrarlo).
 *  4. ELIMINAR: borra el bloque completo del producto.
 *  5. FOTOGRAFÍAS: coloca tu foto en assets/img/productos/
 *     y escribe la misma ruta en "imagen".
 *
 *  CAMPOS:
 *   id          -> identificador único en minúsculas y sin espacios
 *   nombre      -> nombre del producto
 *   categoria   -> "chips" | "churritos" | "obleas" | "otros"
 *   descripcion -> descripción breve basada en la etiqueta del producto
 *   presentacion-> contenido o presentación (ej. "50 g")
 *   precio      -> texto libre; usa "" si no quieres mostrar precio
 *   imagen      -> ruta de la fotografía
 *   imagenDemo  -> true SOLO si la imagen es una ilustración de muestra
 *   visible     -> true para mostrar, false para ocultar
 *
 *  NOTA: las descripciones se basan en la información impresa
 *  en el empaque de cada producto. No agregar promesas de
 *  resultados ni propiedades clínicas no respaldadas.
 * ============================================================
 */

window.NUTRIZANO_CATEGORIAS = [
  { id: "todos", nombre: "Todos" },
  { id: "chips", nombre: "Chips" },
  { id: "churritos", nombre: "Churritos" },
  { id: "obleas", nombre: "Obleas" },
  { id: "otros", nombre: "Otros productos" },
];

window.NUTRIZANO_PRODUCTOS = [
  {
    id: "chips-coliflor-adobada",
    nombre: "Chips de coliflor adobada",
    categoria: "chips",
    descripcion:
      "Chips de coliflor deshidratada con mezcla de chiles micos. Snack mexicano sin frituras ni conservadores, hecho en México.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/producto-chips-coliflor-adobada.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "chips-camote-fuego",
    nombre: "Chips de camote Fuego",
    categoria: "chips",
    descripcion:
      "Chips de camote deshidratado con mezcla de chiles secos. Snack mexicano sin frituras ni conservadores, hecho en México.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/productos/chips-camote-fuego.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "chips-camote-adobado",
    nombre: "Chips de camote adobado",
    categoria: "chips",
    descripcion:
      "Chips de camote deshidratado con adobo de chiles. Snack mexicano sin frituras ni conservadores, hecho en México.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/productos/chips-camote-adobado.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "chips-jicama-adobada",
    nombre: "Chips de jícama adobada",
    categoria: "chips",
    descripcion:
      "Chips de jícama con adobo de chiles. Snack mexicano sin frituras ni conservadores, hecho en México.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/productos/chips-jicama-adobada.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "churritos-nopal-sal-limon",
    nombre: "Churritos de nopal sal y limón",
    categoria: "churritos",
    descripcion:
      "Churritos de harina de nopal con mezcla de sal y limón de origen natural. Según su empaque: sin azúcar y fuente de fibra.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/productos/churritos-nopal-sal-limon.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "churritos-nopal-adobado",
    nombre: "Churritos de nopal adobado",
    categoria: "churritos",
    descripcion:
      "Churritos de harina de nopal con mezcla de chiles secos. Snack mexicano sin frituras ni conservadores, hecho en México.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/productos/churritos-nopal-adobado.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "churritos-amaranto-sal-limon",
    nombre: "Churritos de amaranto sal y limón",
    categoria: "churritos",
    descripcion:
      "Churritos de harina de amaranto deshidratado con limón y sal. Snack mexicano sin frituras ni conservadores, hecho en México.",
    presentacion: "50 g por empaque",
    precio: "",
    imagen: "assets/img/productos/churritos-amaranto-sal-limon.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "obleas-amaranto",
    nombre: "Obleas de amaranto",
    categoria: "obleas",
    descripcion:
      "Obleas a base de harina de amaranto endulzadas con extracto puro de stevia, adicionadas con vitaminas, minerales y antioxidantes. Disponibles en variedad Mazapán, Taro, Pink Chai y Mora Azul.",
    presentacion: "45 g por presentación (caja surtida disponible)",
    precio: "",
    imagen: "assets/img/productos/obleas-amaranto-caja.jpg",
    imagenDemo: false,
    visible: true,
  },
  {
    id: "choco-oblea",
    nombre: "Choco Oblea",
    categoria: "obleas",
    descripcion:
      "Oblea elaborada con avena, quinoa, chía, salvado de trigo integral, chocolate semi amargo y endulzada con extracto puro de stevia. Hecha en México.",
    presentacion: "Presentación por definir",
    precio: "",
    imagen: "assets/img/productos/oblea-choco-oblea.jpg",
    imagenDemo: false,
    visible: true,
  },
];
