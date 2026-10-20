/* ============================================================
   NUTRI-ZANO · Contacto
   Enlaces de redes, correo, canal de contacto (WhatsApp o
   correo), compartir tarjeta (Web Share API) y descarga .vcf
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { $, toast, modal } = NZ.ui;

  function cfg() {
    return window.NUTRIZANO_CONFIG || {};
  }

  /* ---------- Canal de contacto configurable ---------- */
  function canal(mensaje, asunto) {
    const c = cfg();
    if (c.whatsapp) {
      const url =
        "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent(mensaje);
      window.open(url, "_blank", "noopener");
      return;
    }
    if (c.email) {
      window.location.href =
        "mailto:" +
        c.email +
        "?subject=" +
        encodeURIComponent(asunto || "Consulta Nutri-Zano") +
        "&body=" +
        encodeURIComponent(mensaje);
      return;
    }
    modal.abrir(`
      <p class="modal-eyebrow">Canal de contacto</p>
      <h2 class="modal-titulo" id="modalTitulo">Configura un canal de contacto</h2>
      <p class="modal-texto">
        Aún no hay un canal de comunicación configurado. Agrega el número de WhatsApp
        profesional en <code>assets/js/config.js</code> (campo <strong>whatsapp</strong>)
        y el sitio lo usará automáticamente. Mientras tanto, no se comparte ningún dato.
      </p>
      <div class="modal-acciones">
        <button class="btn btn-ghost" data-cerrar-modal>Entendido</button>
      </div>
    `);
  }

  /* ---------- Enlaces de contacto ---------- */
  function pintarEnlaces() {
    const c = cfg();
    const fb = $("#linkFacebook");
    const ig = $("#linkInstagram");
    const em = $("#linkEmail");

    if (fb && c.redes && c.redes.facebook) fb.href = c.redes.facebook;
    if (ig && c.redes && c.redes.instagram) ig.href = c.redes.instagram;
    if (em && c.email) {
      em.href =
        "mailto:" +
        c.email +
        "?subject=" +
        encodeURIComponent("Consulta Nutri-Zano");
      $("#emailTexto").textContent = c.email;
    }

    // Enlaces de la barra superior
    const tbEmail = $("#topbarEmail");
    const tbTexto = $("#topbarEmailTexto");
    const tbFacebook = document.querySelector(".topbar-redes a[href*='facebook']");
    const tbInstagram = document.querySelector(".topbar-redes a[href*='instagram']");
    if (tbEmail && c.email) {
      tbEmail.href = "mailto:" + c.email + "?subject=" + encodeURIComponent("Consulta Nutri-Zano");
    }
    if (tbTexto && c.email) tbTexto.href = tbEmail ? tbEmail.href : "mailto:" + c.email;
    if (tbFacebook && c.redes && c.redes.facebook) tbFacebook.href = c.redes.facebook;
    if (tbInstagram && c.redes && c.redes.instagram) tbInstagram.href = c.redes.instagram;
  }

  /* ---------- Compartir tarjeta ---------- */
  function urlPublica() {
    const c = cfg();
    if (c.urlPublica) return c.urlPublica;
    return window.location.href.split("#")[0];
  }

  function textoCompartir() {
    const c = cfg();
    return (
      (c.nombreComercial || "Nutri-Zano") +
      " · " +
      (c.profesional || "") +
      "\n" +
      (c.eslogan || "") +
      "\nTu bienestar comienza con una mejor alimentación. Agenda tu consulta:"
    );
  }

  async function compartir() {
    const datos = {
      title: (cfg().nombreComercial || "Nutri-Zano") + " · Tarjeta digital",
      text: textoCompartir(),
      url: urlPublica(),
    };
    if (navigator.share) {
      try {
        await navigator.share(datos);
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(datos.text + "\n" + datos.url);
      toast("Enlace copiado al portapapeles.");
    } catch (e) {
      window.open(datos.url, "_blank", "noopener");
      toast("Se abrió la tarjeta en una nueva pestaña para que la compartas.");
    }
  }

  /* ---------- Descargar contacto (.vcf) ---------- */
  function descargarVcf() {
    const c = cfg();
    const lineas = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Lozano;Yaneth;;;",
      "FN:Yaneth Lozano (Nutri-Zano)",
      "ORG:Nutri-Zano",
      "TITLE:Nutrióloga",
      c.email ? "EMAIL;TYPE=INTERNET:" + c.email : "",
      c.redes && c.redes.facebook ? "URL:" + c.redes.facebook : "",
      c.redes && c.redes.instagram ? "NOTE;TYPE=INSTAGRAM:" + c.redes.instagram : "",
      "NOTE:Nutrición • Bienestar • Equilibrio",
      "END:VCARD",
    ].filter(Boolean);

    const blob = new Blob([lineas.join("\r\n")], {
      type: "text/vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Nutri-Zano-Yaneth-Lozano.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2500);
    toast("Contacto descargado. Ábrelo para guardarlo en tu teléfono.");
  }

  function init() {
    pintarEnlaces();

    const btnCompartir = $("#btnCompartir");
    if (btnCompartir) btnCompartir.addEventListener("click", compartir);

    const btnVcf = $("#btnVcf");
    if (btnVcf) btnVcf.addEventListener("click", descargarVcf);
  }

  NZ.contacto = { init, canal, compartir, descargarVcf };
})();
