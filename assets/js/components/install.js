/* ============================================================
   NUTRI-ZANO · Instalar la tarjeta como app
   - Android/Chrome: usa el evento beforeinstallprompt.
   - iPhone/iOS (Safari): muestra instrucciones para
     "Compartir → Agregar a pantalla de inicio".
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { modal } = NZ.ui;

  let prompPendiente = null;

  function esIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function esInstalable() {
    return "serviceWorker" in navigator && location.protocol.indexOf("http") === 0;
  }

  function ocultarBotones() {
    document.querySelectorAll("[data-instalar]").forEach((b) => {
      b.classList.add("oculto");
    });
  }

  function yaInstalada() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches
    );
  }

  function instrucciones() {
    const contenido = esIOS()
      ? `<p class="modal-texto">Para guardar Nutri-Zano en tu iPhone:</p>
         <ul class="modal-lista">
           <li><span>Toca el botón <strong>Compartir</strong> (el icono de cuadrado con flecha) en la barra de Safari.</span></li>
           <li><span>Elige <strong>«Agregar a pantalla de inicio»</strong>.</span></li>
           <li><span>Confirma tocando <strong>Agregar</strong>. Listo: podrás abrirla como una app.</span></li>
         </ul>`
      : `<p class="modal-texto">Para guardar Nutri-Zano en tu teléfono:</p>
         <ul class="modal-lista">
           <li><span>Abre el menú del navegador (los tres puntos <strong>⋮</strong>).</span></li>
           <li><span>Elige <strong>«Instalar aplicación»</strong> o <strong>«Agregar a pantalla de inicio»</strong>.</span></li>
           <li><span>Confirma y la tarjeta se abrirá como una app, con tu propio icono.</span></li>
         </ul>`;
    modal.abrir(`
      <p class="modal-eyebrow">Tarjeta digital como app</p>
      <h2 class="modal-titulo" id="modalTitulo">Guarda Nutri-Zano en tu teléfono</h2>
      ${contenido}
      <div class="modal-acciones">
        <button class="btn btn-ghost" data-cerrar-modal>Entendido</button>
      </div>
    `);
  }

  function instalar() {
    if (prompPendiente) {
      prompPendiente.prompt();
      prompPendiente.userChoice.then((respuesta) => {
        if (respuesta && respuesta.outcome === "accepted") ocultarBotones();
        prompPendiente = null;
      });
      return;
    }
    instrucciones();
  }

  function init() {
    if (!esInstalable() || yaInstalada()) {
      ocultarBotones();
      return;
    }

    window.addEventListener("beforeinstallprompt", (evento) => {
      evento.preventDefault();
      prompPendiente = evento;
      document.querySelectorAll("[data-instalar]").forEach((b) =>
        b.classList.remove("oculto")
      );
    });

    window.addEventListener("appinstalled", () => {
      ocultarBotones();
      if (NZ.ui && NZ.ui.toast) {
        NZ.ui.toast("¡Nutri-Zano se instaló en tu teléfono!");
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-instalar]")) {
        e.preventDefault();
        instalar();
      }
    });

    // Servicio de instalación solo se ofrece fuera de escritorio sin permiso explícito
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {
          /* sin service worker el sitio sigue funcionando */
        });
      });
    }
  }

  NZ.instalar = { init };
})();
