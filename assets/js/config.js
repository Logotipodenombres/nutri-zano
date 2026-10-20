/**
 * ============================================================
 *  NUTRI-ZANO · ARCHIVO DE CONFIGURACIÓN
 * ============================================================
 *  Edita SOLO este archivo para cambiar datos de contacto,
 *  enlaces y opciones de envío del formulario de citas.
 *  No requiere conocimientos de programación: guarda los
 *  cambios, vuelve a publicar el sitio y listo.
 * ============================================================
 */

window.NUTRIZANO_CONFIG = {
  /* ---------- Marca ---------- */
  nombreComercial: "Nutri-Zano",
  profesional: "Nutrióloga Yaneth Lozano",
  eslogan: "Nutrición • Bienestar • Equilibrio",

  /* ---------- Contacto ---------- */
  email: "Lozanojaneth720@gmail.com",

  /**
   * Número de WhatsApp profesional (código de país + número, SIN signos).
   * Ejemplo: "5215512345678"
   * Mientras esté vacío ("") el sitio usará el correo electrónico como
   * vía de contacto alternativa. NO inventes un número: déjalo vacío
   * hasta que la profesional lo confirme.
   */
  whatsapp: "5217531464420",

  redes: {
    facebook: "https://www.facebook.com/nutri.zano.nutriologa",
    instagram: "https://www.instagram.com/nutrizanonutriologa/",
  },

  /* ---------- Compartir tarjeta ---------- */
  // URL pública definitiva cuando el sitio esté publicado
  // (GitHub Pages / Cloudflare Pages). Mientras esté vacía se usa la URL actual.
  urlPublica: "https://logotipodenombres.github.io/nutri-zano/",

  /* ---------- Formulario de citas ---------- */
  formulario: {
    // Máximo de solicitudes desde el mismo navegador en 10 minutos (anti-spam local)
    limiteSolicitudes: 3,
    ventanaMinutos: 10,
    // Días mínimos desde hoy para poder elegir una fecha de consulta
    diasMinimosCita: 1,
  },
};
