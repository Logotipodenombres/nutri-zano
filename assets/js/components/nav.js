/* ============================================================
   NUTRI-ZANO · Navegación
   Encabezado fijo, menú móvil y enlace activo por sección.
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { $, $$ } = NZ.ui;

  function init() {
    const header = $("#siteHeader");
    const toggle = $("#menuToggle");
    const nav = $("#mainNav");

    /* Sombra del encabezado al desplazar */
    const alDesplazar = () => {
      header.classList.toggle("fijo", window.scrollY > 12);
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    alDesplazar();

    /* Menú móvil */
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const abierto = nav.classList.toggle("abierto");
        toggle.setAttribute("aria-expanded", String(abierto));
        toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      });

      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          nav.classList.remove("abierto");
          toggle.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("click", (e) => {
        if (
          nav.classList.contains("abierto") &&
          !e.target.closest("#mainNav") &&
          !e.target.closest("#menuToggle")
        ) {
          nav.classList.remove("abierto");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* Enlace de sección activo */
    const secciones = ["inicio", "servicios", "productos", "nutriologa", "contacto"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if ("IntersectionObserver" in window && secciones.length) {
      const obs = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            $$(".main-nav a").forEach((a) =>
              a.classList.toggle("activo", a.getAttribute("href") === "#" + entrada.target.id)
            );
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      secciones.forEach((s) => obs.observe(s));
    }
  }

  NZ.nav = { init };
})();
