/* ============================================================
   NUTRI-ZANO · Servicios
   Cuadrícula de servicios + ventana de detalle.
   Para editar textos, modifica el arreglo `servicios`.
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { $, $$, escapar, modal } = NZ.ui;

  const icono = (p) =>
    '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>";

  const ICONOS = {
    consulta: icono(
      '<path d="M12 21s-7-4.7-7-10a7 7 0 1 1 14 0c0 5.3-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="11" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'
    ),
    acompanamiento: icono(
      '<path d="M4 18v-6a8 8 0 0 1 16 0v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M2.8 15.5h3v5h-3zM18.2 15.5h3v5h-3z" fill="currentColor"/><path d="M12 21v-2.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
    ),
    habitos: icono(
      '<path d="M12 20.5c4.6 0 8.4-3.5 8.4-8V5.6H3.6v6.9c0 4.5 3.8 8 8.4 8Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.6 12.2 11 14.6l4.6-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    recomposicion: icono(
      '<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.4v17.2M3.4 12h17.2" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".55"/><path d="M6.6 6.6c3.4 2.6 7.4 2.6 10.8 0M6.6 17.4c3.4-2.6 7.4-2.6 10.8 0" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".55"/>'
    ),
    laboratorio: icono(
      '<path d="M9.5 3v6.2L4.6 18a2.4 2.4 0 0 0 2 3.6h10.8a2.4 2.4 0 0 0 2-3.6l-4.9-8.8V3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 3h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7.4 14.6h9.2" stroke="currentColor" stroke-width="1.6"/>'
    ),
    insulina: icono(
      '<path d="M12 3.6c3.4 0 6 2.5 6 5.7 0 3.4-2.2 5-3 7.4h-6c-.8-2.4-3-4-3-7.4 0-3.2 2.6-5.7 6-5.7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.6 19.4h4.8M10.4 21.6h3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
    ),
    somp: icono(
      '<path d="M12 21.2c-4.4 0-7.6-3-7.6-7.2 0-3.8 2.8-6.4 6-8.4 1.2 2.6 2 4 4 5.4 1.8 1.3 3.2 2.8 3.2 5 0 3.2-2.6 5.2-5.6 5.2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 21.2c1.8-2.6 2.6-5.4 2.2-8.4" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".7"/>'
    ),
    reductivo: icono(
      '<path d="M12 2.8c2 3.4 5.4 6 5.4 10a5.4 5.4 0 1 1-10.8 0c0-4 3.4-6.6 5.4-10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 15.6a2.4 2.4 0 0 1-2.4-2.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
    ),
  };

  const IMAGENES = {
    asesoria: "assets/img/asesoria-nutricional.svg",
    plato: "assets/img/plato-balanceado.svg",
    snacks: "assets/img/snacks-saludables.svg",
    hero: "assets/img/hero-comida-saludable.svg",
  };

  const servicios = [
    {
      id: "consulta-nutricional",
      motivoCita: "Consulta nutricional general",
      nombre: "Consulta nutricional",
      icono: ICONOS.consulta,
      imagen: IMAGENES.asesoria,
      resumen:
        "Evaluación y orientación nutricional personalizada de acuerdo con tus necesidades y objetivos.",
      detalle: [
        "Evaluación inicial de tus hábitos alimenticios, rutina y objetivos de bienestar.",
        "Orientación nutricional personalizada según tus necesidades.",
        "Definición de un plan realista y adaptado a tu estilo de vida.",
      ],
    },
    {
      id: "guia-acompanamiento",
      motivoCita: "Seguimiento nutricional",
      nombre: "Guía y acompañamiento nutricional",
      icono: ICONOS.acompanamiento,
      imagen: IMAGENES.plato,
      resumen:
        "Seguimiento profesional para facilitar cambios sostenibles en tu alimentación.",
      detalle: [
        "Revisiones periódicas para valorar tu evolución.",
        "Ajustes al plan de alimentación según tus resultados y necesidades.",
        "Resolución de dudas durante el proceso.",
      ],
    },
    {
      id: "cambio-de-habitos",
      motivoCita: "Quiero mejorar mis hábitos alimenticios",
      nombre: "Cambio de hábitos",
      icono: ICONOS.habitos,
      imagen: IMAGENES.hero,
      resumen:
        "Desarrollo de estrategias prácticas para construir una relación más saludable con la alimentación.",
      detalle: [
        "Identificación de hábitos que conviene modificar.",
        "Estrategias prácticas para el día a día.",
        "Herramientas de educación nutricional para sostener los cambios.",
      ],
    },
    {
      id: "recomposicion-corporal",
      motivoCita: "Recomposición corporal",
      nombre: "Recomposición corporal",
      icono: ICONOS.recomposicion,
      imagen: IMAGENES.plato,
      resumen:
        "Acompañamiento nutricional orientado a mejorar la composición corporal de manera individualizada.",
      detalle: [
        "Valoración individual de tus características y objetivos.",
        "Plan de alimentación adaptado a tu caso.",
        "Seguimiento periódico con ajustes personalizados.",
      ],
    },
    {
      id: "dislipidemias",
      motivoCita: "Dislipidemias",
      nombre: "Dislipidemias",
      icono: ICONOS.laboratorio,
      imagen: IMAGENES.snacks,
      resumen:
        "Orientación alimentaria para el manejo nutricional de alteraciones de colesterol y triglicéridos.",
      detalle: [
        "Orientación alimentaria adaptada a tus estudios de laboratorio.",
        "Sugerencias prácticas para mejorar tu patrón de alimentación.",
        "Coordinación con tus controles médicos habituales.",
      ],
    },
    {
      id: "resistencia-a-la-insulina",
      motivoCita: "Resistencia a la insulina",
      nombre: "Resistencia a la insulina",
      icono: ICONOS.insulina,
      imagen: IMAGENES.plato,
      resumen:
        "Planes de alimentación y seguimiento nutricional adaptados a las necesidades de cada persona.",
      detalle: [
        "Plan de alimentación adaptado a tus necesidades.",
        "Educación nutricional sobre la distribución de tus comidas.",
        "Seguimiento para valorar la evolución junto con tus controles.",
      ],
    },
    {
      id: "manejo-de-somp",
      motivoCita: "Manejo de SOMP",
      nombre: "Manejo de SOMP",
      icono: ICONOS.somp,
      imagen: IMAGENES.hero,
      resumen:
        "Acompañamiento nutricional dentro del manejo integral del síndrome. Denominación pendiente de validación con la profesional.",
      detalle: [
        "Acompañamiento nutricional personalizado dentro del manejo integral.",
        "La denominación “SOMP” se mantiene como información pendiente de validación por la profesional.",
        "No se agregan interpretaciones ni diagnósticos adicionales.",
      ],
      nota: "Denominación pendiente de validación por la profesional de la salud.",
    },
    {
      id: "tratamientos-reductivos-lipoenzimas",
      motivoCita: "Información sobre tratamientos reductivos",
      nombre: "Tratamientos reductivos con lipoenzimas",
      icono: ICONOS.reductivo,
      imagen: IMAGENES.snacks,
      resumen:
        "Información y valoración previa para tratamientos que contemplan lipasa, colagenasa e hialuronidasa, sujetos a evaluación profesional.",
      detalle: [
        "Valoración previa e información general sobre el tratamiento.",
        "Sujeto a indicaciones, evaluación profesional y normativa aplicable.",
        "No se prometen reducciones específicas de peso ni resultados garantizados.",
      ],
      nota:
        "Este tratamiento requiere evaluación profesional previa. La información aquí mostrada no constituye una indicación clínica ni garantiza resultados.",
    },
  ];

  function pintar() {
    const grid = $("#serviciosGrid");
    if (!grid) return;
    grid.innerHTML = servicios
      .map(
        (s) => `
      <article class="servicio-card" data-reveal>
        <span class="servicio-icono" aria-hidden="true">${s.icono}</span>
        <h3>${escapar(s.nombre)}</h3>
        <p>${escapar(s.resumen)}</p>
        <button class="servicio-ver" data-servicio="${escapar(s.id)}">
          Saber más
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </article>`
      )
      .join("");

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-servicio]");
      if (!btn) return;
      abrirDetalle(btn.getAttribute("data-servicio"));
    });
  }

  function abrirDetalle(id) {
    const s = servicios.find((x) => x.id === id);
    if (!s) return;
    modal.abrir(`
      <div class="modal-media">
        <img src="${s.imagen}" alt="Ilustración relacionada con ${escapar(s.nombre)}" loading="lazy" />
      </div>
      <p class="modal-eyebrow">Servicio profesional</p>
      <h2 class="modal-titulo" id="modalTitulo">${escapar(s.nombre)}</h2>
      <p class="modal-texto">${escapar(s.resumen)}</p>
      ${s.nota ? `<div class="aviso-demo">${escapar(s.nota)}</div>` : ""}
      <ul class="modal-lista">
        ${s.detalle.map((d) => `<li><span>${escapar(d)}</span></li>`).join("")}
      </ul>
      <div class="modal-acciones">
        <button class="btn btn-primary" data-abrir-cita data-motivo="${escapar(s.motivoCita || "Consulta nutricional general")}">Solicitar información</button>
        <button class="btn btn-ghost" data-cerrar-modal>Cerrar</button>
      </div>
    `);
  }

  NZ.servicios = { init: pintar, abrirDetalle };
})();
