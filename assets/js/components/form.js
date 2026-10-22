/* ============================================================
   NUTRI-ZANO · Formulario inteligente de citas
   - Validación de campos obligatorios
   - Confirmación previa con los datos antes de enviar
   - Envío por WhatsApp (si está configurado) o correo
   - Anti-spam local: honeypot + límite de solicitudes
   - Nunca almacena datos en analíticas ni los expone en URLs
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { $, $$, escapar, toast, cerrarCita } = NZ.ui;

  const MOTIVOS = [
    "Consulta nutricional general",
    "Quiero mejorar mis hábitos alimenticios",
    "Recomposición corporal",
    "Dislipidemias",
    "Resistencia a la insulina",
    "Manejo de SOMP",
    "Información sobre tratamientos reductivos",
    "Seguimiento nutricional",
    "Otro motivo",
  ];

  const estado = {
    motivo: "",
    primera: "",
    recomendo: "",
  };

  /* ---------- Apertura del modal ---------- */
  function abrirCita(motivoSugerido) {
    // Si el sistema de citas en línea está publicado, va directo hacia allá.
    const cfgCitas = (window.NUTRIZANO_CONFIG || {}).urlCitas;
    if (cfgCitas) {
      window.open(cfgCitas, "_blank", "noopener");
      return;
    }

    const m = $("#modalCita");
    if (!m) return;
    m.hidden = false;
    document.body.classList.add("no-scroll");
    $("#citaPaso1").hidden = false;
    $("#citaPaso2").hidden = true;
    $("#citaPaso3").hidden = true;

    configurarFechaMinima();

    if (motivoSugerido) {
      const match = MOTIVOS.find(
        (x) =>
          x.toLowerCase() === String(motivoSugerido).toLowerCase() ||
          x.toLowerCase().includes(String(motivoSugerido).toLowerCase()) ||
          String(motivoSugerido).toLowerCase().includes(x.toLowerCase())
      );
      if (match) seleccionarChip("#chipsMotivo", match);
    }

    setTimeout(() => {
      const cerrar = m.querySelector(".modal-cerrar");
      if (cerrar) cerrar.focus();
    }, 30);
  }

  function configurarFechaMinima() {
    const cfg = (window.NUTRIZANO_CONFIG && window.NUTRIZANO_CONFIG.formulario) || {};
    const dias = typeof cfg.diasMinimosCita === "number" ? cfg.diasMinimosCita : 1;
    const input = $("#fFecha");
    if (!input) return;
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const iso = d.toISOString().split("T")[0];
    input.min = iso;
  }

  /* ---------- Chips ---------- */
  function pintarChipsMotivo() {
    const cont = $("#chipsMotivo");
    if (!cont) return;
    cont.innerHTML = MOTIVOS.map(
      (m) =>
        `<button type="button" class="chip" role="radio" aria-checked="false" data-valor="${escapar(m)}">${escapar(m)}</button>`
    ).join("");
  }

  function seleccionarChip(selector, valor) {
    const cont = $(selector);
    if (!cont) return;
    $$(".chip", cont).forEach((c) => {
      const sel = c.getAttribute("data-valor") === valor;
      c.classList.toggle("seleccionado", sel);
      c.setAttribute("aria-checked", String(sel));
    });
    cont.dispatchEvent(new CustomEvent("chip:seleccionado", { detail: valor }));
  }

  function valorChip(selector) {
    const sel = $(selector + " .chip.seleccionado");
    return sel ? sel.getAttribute("data-valor") : "";
  }

  function enlazarChips(selector, alCambiar) {
    const cont = $(selector);
    if (!cont) return;
    cont.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const valor = chip.getAttribute("data-valor");
      seleccionarChip(selector, valor);
      if (alCambiar) alCambiar(valor);
    });
    cont.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const chips = $$(".chip", cont);
      const i = chips.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const sig = e.key === "ArrowRight" ? (i + 1) % chips.length : (i - 1 + chips.length) % chips.length;
      chips[sig].focus();
    });
  }

  /* ---------- Validación ---------- */
  function mostrarError(id, mensaje) {
    const el = document.querySelector('[data-error-for="' + id + '"]');
    if (el) el.textContent = mensaje || "";
    const campo = document.getElementById(id);
    if (campo && campo.classList) campo.classList.toggle("invalido", Boolean(mensaje));
  }

  function limpiarErrores() {
    $$("#formCita .error").forEach((e) => (e.textContent = ""));
    $$("#formCita .invalido").forEach((e) => e.classList.remove("invalido"));
  }

  function validar() {
    limpiarErrores();
    let ok = true;
    let primeroInvalido = null;

    const nombre = $("#fNombre").value.trim();
    if (nombre.length < 3) {
      mostrarError("fNombre", "Escribe tu nombre completo.");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fNombre");
    }

    const tel = $("#fTel").value.trim();
    if (!/^[0-9+\s()-]{8,20}$/.test(tel)) {
      mostrarError("fTel", "Escribe un teléfono de contacto válido.");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fTel");
    }

    const email = $("#fEmail").value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      mostrarError("fEmail", "El correo electrónico no parece válido.");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fEmail");
    }

    estado.motivo = valorChip("#chipsMotivo");
    if (!estado.motivo) {
      mostrarError("chipsMotivo", "Selecciona el motivo principal de tu consulta.");
      ok = false;
    }

    estado.primera = valorChip("#chipsPrimera");
    if (!estado.primera) {
      mostrarError("chipsPrimera", "Selecciona una opción.");
      ok = false;
    }

    estado.recomendo = valorChip("#chipsRecomendo");
    if (!estado.recomendo) {
      mostrarError("chipsRecomendo", "Selecciona una opción.");
      ok = false;
    }

    const fecha = $("#fFecha").value;
    if (!fecha) {
      mostrarError("fFecha", "Elige un día preferido.");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fFecha");
    } else if ($("#fFecha").min && fecha < $("#fFecha").min) {
      mostrarError("fFecha", "Selecciona una fecha a partir de " + $("#fFecha").min + ".");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fFecha");
    }

    const horario = $("#fHorario").value;
    if (!horario) {
      mostrarError("fHorario", "Selecciona un horario.");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fHorario");
    }

    if (!$("#fPrivacidad").checked) {
      mostrarError("fPrivacidad", "Debes aceptar el aviso de privacidad para continuar.");
      ok = false;
      primeroInvalido = primeroInvalido || $("#fPrivacidad");
    }

    if (!ok) {
      const destino = primeroInvalido || document.querySelector('[data-error-for]:not(:empty)');
      if (destino) {
        const foco = destino.id ? destino : null;
        (foco || destino).scrollIntoView({ behavior: "smooth", block: "center" });
        if (foco && foco.focus) setTimeout(() => foco.focus(), 320);
      }
      toast("Revisa los campos marcados para continuar.");
    }
    return ok;
  }

  /* ---------- Resumen de confirmación ---------- */
  function pintarResumen() {
    const datos = obtenerDatos();
    const filas = [
      ["Nombre", datos.nombre],
      ["Teléfono", datos.telefono],
      ["Correo electrónico", datos.correo || "No proporcionado"],
      ["Motivo de consulta", datos.motivo],
      ...(datos.otroMotivo ? [["Otro motivo", datos.otroMotivo]] : []),
      ["Primera consulta", datos.primera],
      ["¿Quién te recomendó?", datos.recomendo],
      ...(datos.recomendoQuien ? [["Recomendada por", datos.recomendoQuien]] : []),
      ["Día preferido", datos.fecha],
      ["Horario preferido", datos.horario],
    ];
    $("#resumenDatos").innerHTML = filas
      .map(
        ([k, v]) =>
          `<div><dt>${escapar(k)}</dt><dd>${escapar(v)}</dd></div>`
      )
      .join("");
  }

  function obtenerDatos() {
    return {
      nombre: $("#fNombre").value.trim(),
      telefono: $("#fTel").value.trim(),
      correo: $("#fEmail").value.trim(),
      motivo: estado.motivo,
      otroMotivo: $("#fOtroMotivo").value.trim(),
      primera: estado.primera,
      recomendo: estado.recomendo,
      recomendoQuien: $("#fRecomendo").value.trim(),
      fecha: $("#fFecha").value,
      horario: $("#fHorario").value,
    };
  }

  function formatearFecha(iso) {
    try {
      const [a, m, d] = iso.split("-");
      return d + "/" + m + "/" + a;
    } catch (e) {
      return iso;
    }
  }

  /* ---------- Envío ---------- */
  function mensajeSolicitud(d) {
    return [
      "SOLICITUD DE CITA · NUTRI-ZANO",
      "--------------------------------",
      "Nombre: " + d.nombre,
      "Teléfono: " + d.telefono,
      "Correo: " + (d.correo || "No proporcionado"),
      "Motivo de consulta: " + d.motivo + (d.otroMotivo ? " (" + d.otroMotivo + ")" : ""),
      "Primera consulta: " + d.primera,
      "Recomendación: " + d.recomendo + (d.recomendoQuien ? " — me recomendó: " + d.recomendoQuien : ""),
      "Día preferido: " + formatearFecha(d.fecha),
      "Horario preferido: " + d.horario,
      "--------------------------------",
      "Solicitud enviada desde la tarjeta digital. Pendiente de confirmación.",
    ].join("\n");
  }

  function limiteConfig() {
    const cfg = (window.NUTRIZANO_CONFIG && window.NUTRIZANO_CONFIG.formulario) || {};
    return {
      max: typeof cfg.limiteSolicitudes === "number" ? cfg.limiteSolicitudes : 3,
      min: typeof cfg.ventanaMinutos === "number" ? cfg.ventanaMinutos : 10,
    };
  }

  function superaLimite() {
    const { max, min } = limiteConfig();
    const clave = "nz_solicitudes";
    const ahora = Date.now();
    let historial = [];
    try {
      historial = JSON.parse(localStorage.getItem(clave) || "[]");
      if (!Array.isArray(historial)) historial = [];
    } catch (e) {
      historial = [];
    }
    historial = historial.filter((t) => ahora - t < min * 60 * 1000);
    if (historial.length >= max) return true;
    historial.push(ahora);
    try {
      localStorage.setItem(clave, JSON.stringify(historial));
    } catch (e) {
      /* almacenamiento no disponible: se omite el control */
    }
    return false;
  }

  function enviar(d) {
    // Protección anti-spam simple
    if ($("#fWeb").value.trim() !== "") return; // honeypot
    if (superaLimite()) {
      toast("Has enviado varias solicitudes recientemente. Intenta de nuevo en unos minutos.");
      return;
    }

    const cfg = window.NUTRIZANO_CONFIG || {};
    const texto = mensajeSolicitud(d);
    const asunto = "Solicitud de cita · " + d.nombre;
    let via = "";

    if (cfg.whatsapp) {
      const url = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
      via = "WhatsApp";
    } else if (cfg.email) {
      const url =
        "mailto:" + cfg.email + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(texto);
      window.location.href = url;
      via = "correo electrónico";
    }

    $("#exitoTexto").innerHTML =
      "Tu solicitud quedó <strong>pendiente de confirmación</strong>: la cita no se reserva " +
      "automáticamente. " +
      (via
        ? "Se abrió tu aplicación de " + escapar(via) + " para enviarla a Nutri-Zano; si no se abrió, escríbenos directamente."
        : "Muy pronto recibirás una respuesta para acordar el día y horario.") +
      " Tus datos se usan únicamente para dar seguimiento a tu solicitud.";

    $("#citaPaso2").hidden = true;
    $("#citaPaso3").hidden = false;
    $("#citaPaso3").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Inicialización ---------- */
  function init() {
    pintarChipsMotivo();
    enlazarChips("#chipsMotivo", (valor) => {
      estado.motivo = valor;
      $("#campoOtroMotivo").hidden = valor !== "Otro motivo";
      mostrarError("chipsMotivo", "");
    });
    enlazarChips("#chipsPrimera", (valor) => {
      estado.primera = valor;
      mostrarError("chipsPrimera", "");
    });
    enlazarChips("#chipsRecomendo", (valor) => {
      estado.recomendo = valor;
      $("#campoQuienRecomendo").hidden = valor !== "Sí";
      mostrarError("chipsRecomendo", "");
    });

    // Botones que abren la cita (incluye el proveniente de servicios)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-abrir-cita]");
      if (!btn) return;
      e.preventDefault();
      const modalAbierto = !$("#modal").hidden;
      if (modalAbierto) NZ.ui.modal.cerrar();
      abrirCita(btn.getAttribute("data-motivo"));
    });

    // Validación en vivo de campos con error
    ["fNombre", "fTel", "fEmail", "fFecha", "fHorario"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => mostrarError(id, ""));
        el.addEventListener("change", () => mostrarError(id, ""));
      }
    });

    $("#fPrivacidad").addEventListener("change", () => mostrarError("fPrivacidad", ""));

    $("#formCita").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validar()) return;
      pintarResumen();
      $("#citaPaso1").hidden = true;
      $("#citaPaso2").hidden = false;
      $("#modalCita .modal-caja").scrollTop = 0;
    });

    $("#btnEditar").addEventListener("click", () => {
      $("#citaPaso2").hidden = true;
      $("#citaPaso1").hidden = false;
      $("#modalCita .modal-caja").scrollTop = 0;
    });

    $("#btnConfirmar").addEventListener("click", () => {
      enviar(obtenerDatos());
    });

    configurarFechaMinima();
  }

  NZ.cita = { init, abrirCita };
})();
