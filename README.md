# Nutri-Zano · Tarjeta digital

Tarjeta digital premium para **Nutri-Zano · Nutrióloga Yaneth Lozano**.
100 % estática (HTML, CSS y JavaScript sin dependencias ni paso de compilación):
se puede abrir directamente en el navegador o publicar en **GitHub Pages** o
**Cloudflare Pages** sin instalar nada.

---

## 1. Cómo ver el sitio

Haz doble clic en `index.html` (se abre en el navegador) o, para una prueba con
servidor local:

```powershell
# Desde la carpeta nutri-zano
python -m http.server 8080
# y abre http://localhost:8080
```

---

## 2. Estructura del proyecto

```
nutri-zano/
├── index.html                  ← Página principal (tarjeta digital)
├── aviso-privacidad.html       ← Aviso de privacidad accesible
├── manifest.webmanifest        ← Permite instalar la tarjeta como app
├── sw.js                       ← Service Worker (app instalable + sin conexión)
├── .nojekyll                   ← Permite publicar tal cual en GitHub Pages
├── assets/
│   ├── css/styles.css          ← Identidad visual completa
│   ├── js/
│   │   ├── config.js           ← ⭐ CONFIGURACIÓN (contacto, WhatsApp, etc.)
│   │   ├── data/products.js    ← ⭐ CATÁLOGO DE PRODUCTOS
│   │   ├── components/         ← Lógica por sección (UI, menú, servicios,
│   │   │                          catálogo, formulario, contacto, instalación)
│   │   └── main.js             ← Arranque
│   └── img/
│       ├── logo-nutri-zano.jpg           ← Logotipo oficial (original)
│       ├── foto-nutriologa.jpg           ← Fotografía profesional
│       ├── icono-192.png / icono-512.png / icono-maskable-512.png ← Iconos de la app
│       ├── hero-cuenco-saludable.jpg      ← Fotografía de portada
│       ├── hero-comida-saludable.svg     ← Ilustración de servicios
│       ├── plato-balanceado.svg          ← Ilustración de servicios
│       ├── asesoria-nutricional.svg      ← Ilustración de servicios
│       ├── snacks-saludables.svg         ← Ilustración decorativa
│       ├── decor/frutas-vegetales.svg    ← Decoración
│       └── productos/                    ← Fotografías reales del catálogo
└── README.md
```

---

## 3. Configuración rápida (`assets/js/config.js`)

| Campo | Qué hace |
|---|---|
| `email` | Correo de contacto (actualmente `Lozanojaneth720@gmail.com`). |
| `whatsapp` | **Déjalo vacío (`""`) hasta confirmar el número profesional.** Formato: `"5215512345678"` (código de país + número, sin signos). En cuanto lo agregues, el botón *Agendar cita* y *Me interesa* enviarán la solicitud por WhatsApp automáticamente. |
| `redes.facebook` / `redes.instagram` | Enlaces de las redes sociales. |
| `urlPublica` | URL definitiva del sitio cuando esté publicado (mejora el botón "Compartir"). |
| `formulario.limiteSolicitudes` | Protección anti-spam local (por navegador). |

> Mientras `whatsapp` esté vacío, el sitio usa el **correo** como vía de contacto.
> No se inventa ningún número.

---

## 4. Administrar el catálogo (`assets/js/data/products.js`)

Todos los productos viven en ese archivo. No hay panel administrativo (no hay backend):
se edita el archivo y se vuelve a publicar.

- **Agregar:** copia un bloque `{ ... }` completo dentro de `NUTRIZANO_PRODUCTOS` y edítalo.
- **Modificar:** cambia el texto entre comillas.
- **Ocultar:** pon `"visible": false` (deja de mostrarse sin borrarlo).
- **Eliminar:** borra el bloque completo.
- **Categorías:** `snacks`, `funcionales`, `otros` (se pueden agregar más en `NUTRIZANO_CATEGORIAS`).

### Cambiar las imágenes demo por fotos reales

1. Coloca tu fotografía en `assets/img/productos/` (ej. `chips-maixon.jpg`).
2. En el producto, cambia:
   ```js
   imagen: "assets/img/productos/chips-maixon.jpg",
   imagenDemo: false,   // así desaparece la etiqueta "Demo"
   ```

**Producto ya real:** *Chips de coliflor adobada* (foto original de empaque MAIXON, 50 g).
Los demás productos están marcados como **Demo** (imágenes ilustrativas, sin marca,
sin propiedades nutricionales ni precios inventados).

---

## 5. Imágenes

No hay generador de imágenes disponible en este entorno, así que se crearon
**ilustraciones SVG originales** (tonos salvia, terracota y crema, sin marcas de
agua ni texto) como recursos temporales:

| Archivo | Uso |
|---|---|
| `hero-comida-saludable.svg` | Portada |
| `plato-balanceado.svg` | Servicios |
| `asesoria-nutricional.svg` | Servicios |
| `snacks-saludables.svg` | Catálogo |
| `foto-nutriologa.jpg` | Fotografía profesional de Yaneth Lozano |

Las 9 fotografías del catálogo son reales (productos MAIXON) y ya están
optimizadas para web (máx. 1200 px, calidad 82).

Para reemplazarlas, basta con usar el mismo nombre de archivo con extensión `.jpg`
y actualizar la ruta correspondiente en `products.js` o en `index.html`.

---

## 6. Formulario de citas

> **Sistema de citas en línea (opcional):** este sitio puede enlazarse con el
> sistema de agendado completo que vive en la carpeta `../nutri-citas`
> (Cloudflare Workers + D1). Basta con poner la URL publicada en
> `config.js → urlCitas` y todos los botones *Agendar cita* abrirán la agenda
> en línea, con horarios reales, confirmación por WhatsApp y Google Calendar.
> Consulta `../nutri-citas/README.md`. Mientras `urlCitas` esté vacía, el
> formulario de abajo sigue funcionando como hasta ahora.

- Validación de campos obligatorios con mensajes en español.
- Confirmación previa con todos los datos antes de enviar.
- La cita queda **pendiente de confirmación** (nunca se reserva automáticamente).
- Protección anti-spam: campo honeypot invisible + límite de solicitudes por navegador.
- Los datos no se almacenan en el sitio ni se envían a analíticas; viajan únicamente
  por la app de correo/WhatsApp del usuario hacia los canales de Nutri-Zano.

---

## 7. Tarjeta como app (instalable)

La tarjeta se puede **instalar en el teléfono** como una aplicación:

- Se activa mediante `manifest.webmanifest` + `sw.js` (service worker).
- En el sitio aparecen botones **"Descargar app"** (barra superior y sección de contacto).
- En Android/Chrome el navegador muestra el diálogo de instalación automático.
- En iPhone/Safari el botón abre instrucciones para *Compartir → Agregar a pantalla de inicio*.
- Al instalarse, la app conserva su propio icono (logotipo Nutri-Zano) y funciona
  aunque el dispositivo pierda conexión temporalmente (caché del service worker).

> Nota: para que la instalación funcione en línea, el sitio debe publicarse por
> **HTTPS** (GitHub Pages y Cloudflare Pages lo hacen de forma automática).

---

## 8. Publicación

### GitHub Pages
1. Sube la carpeta `nutri-zano` a un repositorio (por ejemplo `nutri-zano.github.io`).
2. En *Settings → Pages*, elige la rama `main` y la carpeta raíz `/`.
3. El archivo `.nojekyll` ya está incluido (evita que GitHub procese los archivos).

### Cloudflare Pages
1. Sube el proyecto a un repositorio de GitHub.
2. En Cloudflare Pages → *Create project* → *Upload assets* o conecta el repositorio.
3. *Build command:* vacío · *Build output directory:* `/`.

> Después de publicar, copia la URL definitiva en `config.js → urlPublica`
> para mejorar el botón "Compartir tarjeta".

---

## 8. Privacidad y seguridad

- No se incluyen contraseñas, tokens ni claves privadas.
- Aviso de privacidad accesible en `aviso-privacidad.html`.
- Sin datos de salud en herramientas de seguimiento publicitario (no hay analíticas).
- Escape de texto en todo el contenido dinámico (protección contra inyección HTML).
- El formulario está preparado para conectarse a un backend con rate limiting
  si en el futuro se necesita; hoy funciona 100 % del lado del usuario.
