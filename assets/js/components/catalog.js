/* ============================================================
   NUTRI-ZANO · Catálogo de productos
   Lee los datos de assets/js/data/products.js
   (agregar, modificar, ocultar o eliminar productos ahí).
   ============================================================ */
(function () {
  "use strict";

  const NZ = (window.NZ = window.NZ || {});
  const { $, $$, escapar, modal, toast } = NZ.ui;

  let categoriaActiva = "todos";

  function productosVisibles() {
    const lista = Array.isArray(window.NUTRIZANO_PRODUCTOS)
      ? window.NUTRIZANO_PRODUCTOS
      : [];
    return lista.filter((p) => p && p.visible !== false);
  }

  function nombreCategoria(id) {
    const cats = window.NUTRIZANO_CATEGORIAS || [];
    const c = cats.find((x) => x.id === id);
    return c ? c.nombre : id;
  }

  function pintarFiltros() {
    const cont = $("#filtrosCategorias");
    if (!cont) return;
    const cats = (window.NUTRIZANO_CATEGORIAS || []).filter((c) =>
      c.id === "todos"
        ? true
        : productosVisibles().some((p) => p.categoria === c.id)
    );
    cont.innerHTML = cats
      .map(
        (c) => `
      <button class="filtro-btn${c.id === categoriaActiva ? " activo" : ""}"
              role="tab" aria-selected="${c.id === categoriaActiva}"
              data-categoria="${escapar(c.id)}">${escapar(c.nombre)}</button>`
      )
      .join("");

    cont.onclick = (e) => {
      const btn = e.target.closest("[data-categoria]");
      if (!btn) return;
      categoriaActiva = btn.getAttribute("data-categoria");
      pintarFiltros();
      pintarProductos();
    };
  }

  function pintarProductos() {
    const grid = $("#productosGrid");
    if (!grid) return;

    const lista = productosVisibles().filter(
      (p) => categoriaActiva === "todos" || p.categoria === categoriaActiva
    );

    if (!lista.length) {
      grid.innerHTML =
        '<p class="catalog-note">No hay productos en esta categoría por el momento.</p>';
      return;
    }

    grid.innerHTML = lista
      .map((p, i) => {
        const demo = p.imagenDemo === true;
        return `
      <article class="producto-card" data-reveal>
        <button class="producto-media" data-producto="${escapar(p.id)}" aria-label="Ver detalles de ${escapar(p.nombre)}">
          <img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy" decoding="async"
               ${i < 2 ? "" : 'loading="lazy"'} />
          ${demo ? '<span class="badge-demo">Demo</span>' : ""}
        </button>
        <div class="producto-cuerpo">
          <span class="producto-categoria">${escapar(nombreCategoria(p.categoria))}</span>
          <h3>${escapar(p.nombre)}</h3>
          <p class="producto-desc">${escapar(p.descripcion)}</p>
          <div class="producto-meta">
            <span>${escapar(p.presentacion || "Presentación por definir")}</span>
            <span class="producto-precio">${p.precio ? escapar(p.precio) : "Consultar"}</span>
          </div>
          <div class="producto-acciones">
            <button class="btn btn-primary" data-interes="${escapar(p.id)}">Me interesa</button>
            <button class="btn btn-ghost" data-producto="${escapar(p.id)}">Solicitar información</button>
          </div>
        </div>
      </article>`;
      })
      .join("");

    // Reaplicar animación de aparición a las tarjetas nuevas
    NZ.ui.$$("[data-reveal]", grid).forEach((el) => {
      if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver(
          (entradas) => {
            entradas.forEach((en) => {
              if (en.isIntersecting) {
                en.target.classList.add("visible");
                obs.unobserve(en.target);
              }
            });
          },
          { threshold: 0.08 }
        );
        obs.observe(el);
      } else {
        el.classList.add("visible");
      }
    });
  }

  function abrirProducto(id) {
    const p = productosVisibles().find((x) => x.id === id);
    if (!p) return;
    const demo = p.imagenDemo === true;
    modal.abrir(`
      <div class="modal-media">
        <img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy" />
      </div>
      <p class="modal-eyebrow">${escapar(nombreCategoria(p.categoria))}</p>
      <h2 class="modal-titulo" id="modalTitulo">${escapar(p.nombre)}</h2>
      <div class="modal-meta">
        <span>${escapar(p.presentacion || "Presentación por definir")}</span>
        <span>${p.precio ? escapar(p.precio) : "Precio a consultar"}</span>
      </div>
      ${demo ? '<div class="aviso-demo">Imagen demostrativa. Esta fotografía ilustrativa será sustituida por la fotografía real del producto.</div>' : ""}
      <p class="modal-texto">${escapar(p.descripcion)}</p>
      <div class="modal-acciones">
        <button class="btn btn-primary" data-interes="${escapar(p.id)}">Me interesa</button>
        <button class="btn btn-terracota" data-info-producto="${escapar(p.id)}">Solicitar información</button>
        <button class="btn btn-ghost" data-cerrar-modal>Cerrar</button>
      </div>
    `);
  }

  function interes(id, tipo) {
    const p = productosVisibles().find((x) => x.id === id);
    if (!p) return;
    const asunto = (tipo === "info" ? "Información sobre: " : "Me interesa: ") + p.nombre;
    const mensaje =
      "Hola, " +
      (tipo === "info"
        ? "quisiera recibir más información sobre"
        : "me interesa el producto") +
      ' "' + p.nombre + '". ¿Podrían enviarme disponibilidad, presentación y precio? Gracias.';
    if (NZ.contacto && NZ.contacto.canal) {
      NZ.contacto.canal(mensaje, asunto);
    } else {
      toast("Canal de contacto no disponible todavía.");
    }
  }

  function init() {
    pintarFiltros();
    pintarProductos();

    document.addEventListener("click", (e) => {
      const btnProducto = e.target.closest("[data-producto]");
      if (btnProducto) {
        abrirProducto(btnProducto.getAttribute("data-producto"));
        return;
      }
      const btnInteres = e.target.closest("[data-interes]");
      if (btnInteres) {
        interes(btnInteres.getAttribute("data-interes"), "interes");
        return;
      }
      const btnInfo = e.target.closest("[data-info-producto]");
      if (btnInfo) {
        interes(btnInfo.getAttribute("data-info-producto"), "info");
      }
    });
  }

  NZ.catalogo = { init };
})();
