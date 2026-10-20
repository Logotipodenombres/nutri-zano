/* ============================================================
   NUTRI-ZANO · Inicio de la aplicación
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { $ } = NZ.ui;

  function ctaFlotante() {
    const cta = $("#ctaFlotante");
    if (!cta) return;
    let ultimo = 0;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        const mostrar = y > 420 && y < document.body.scrollHeight - window.innerHeight - 320;
        if (mostrar !== cta.classList.contains("visible")) {
          cta.classList.toggle("visible", mostrar);
        }
        ultimo = y;
      },
      { passive: true }
    );
  }

  function iniciar() {
    try {
      NZ.nav.init();
    } catch (e) { /* nav */ }
    try {
      NZ.servicios.init();
    } catch (e) { /* servicios */ }
    try {
      NZ.catalogo.init();
    } catch (e) { /* catálogo */ }
    try {
      NZ.cita.init();
    } catch (e) { /* formulario */ }
    try {
      NZ.contacto.init();
    } catch (e) { /* contacto */ }
    try {
      if (NZ.instalar) NZ.instalar.init();
    } catch (e) { /* instalación */ }
    try {
      NZ.ui.iniciarReveal();
    } catch (e) { /* reveal */ }

    ctaFlotante();

    const anio = $("#anio");
    if (anio) anio.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
