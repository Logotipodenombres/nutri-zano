/* ============================================================
   NUTRI-ZANO · Utilidades de interfaz (UI)
   - Selección de elementos, toast, modal genérico con foco
     atrapado y animaciones de aparición al desplazarse.
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Escape de texto (protección contra inyección) ---------- */
  function escapar(texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(mensaje, ms) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = mensaje;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("visible");
      setTimeout(() => (el.hidden = true), 320);
    }, ms || 3400);
  }

  /* ---------- Modal genérico ---------- */
  const modal = {
    _ultimoFoco: null,

    abrir(html) {
      const m = $("#modal");
      const caja = $("#modalContenido");
      if (!m || !caja) return;
      this._ultimoFoco = document.activeElement;
      caja.innerHTML = html;
      m.hidden = false;
      document.body.classList.add("no-scroll");
      const primero = m.querySelector(".modal-cerrar");
      if (primero) primero.focus();
    },

    cerrar() {
      const m = $("#modal");
      if (!m || m.hidden) return;
      m.hidden = true;
      $("#modalContenido").innerHTML = "";
      if (!estaAbiertoElDeCita()) document.body.classList.remove("no-scroll");
      if (this._ultimoFoco && this._ultimoFoco.focus) this._ultimoFoco.focus();
    },
  };

  function estaAbiertoElDeCita() {
    const mc = $("#modalCita");
    return mc && !mc.hidden;
  }

  /* ---------- Aparición al desplazarse ---------- */
  function iniciarReveal() {
    const elementos = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elementos.forEach((el) => obs.observe(el));
  }

  /* ---------- Cerrar modales con Escape / clic ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("#modalCita").hidden) cerrarCita();
      else if (!$("#modal").hidden) modal.cerrar();
    }
    if (e.key === "Tab") atraparFoco(e);
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cerrar-modal]")) modal.cerrar();
    if (e.target.closest("[data-cerrar-cita]")) cerrarCita();
  });

  function cerrarCita() {
    const m = $("#modalCita");
    if (!m || m.hidden) return;
    m.hidden = true;
    document.body.classList.remove("no-scroll");
    const p1 = $("#citaPaso1"), p2 = $("#citaPaso2"), p3 = $("#citaPaso3");
    if (p1 && p2 && p3) {
      p1.hidden = false;
      p2.hidden = true;
      p3.hidden = true;
    }
  }

  /* Foco atrapado dentro del modal abierto */
  function atraparFoco(e) {
    const activo = !$("#modalCita").hidden
      ? $("#modalCita")
      : !$("#modal").hidden
      ? $("#modal")
      : null;
    if (!activo) return;
    const foco = activo.querySelectorAll(
      'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const visibles = Array.from(foco).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!visibles.length) return;
    const primero = visibles[0];
    const ultimo = visibles[visibles.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }

  NZ.ui = {
    $,
    $$,
    escapar,
    toast,
    modal,
    iniciarReveal,
    cerrarCita,
  };
})();
