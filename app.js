// ---------- UTILIDADES ----------
const STORAGE_KEY = "contacts.v1";
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function loadContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveContacts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ---------- ESTADO ----------
let contacts = loadContacts();
let editingId = null;

// ---------- RENDER ----------
function render() {
  const q = $("#search").value.trim().toLowerCase();
  const [field, dir] = $("#sortBy").value.split("-");

  let filtered = contacts.filter((c) =>
    [c.firstName, c.lastName, c.city].some((v) =>
      (v || "").toLowerCase().includes(q)
    )
  );

  filtered.sort((a, b) => {
    if (field === "createdAt")
      return dir === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
    const av = (a[field] || "").toLowerCase();
    const bv = (b[field] || "").toLowerCase();
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });

  const tbody = $("#tbody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr class="empty"><td colspan="6">No hay contactos que coincidan</td></tr>';
  } else {
    for (const c of filtered) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${escapeHTML(c.firstName)} ${escapeHTML(
        c.lastName
      )}</strong>
            <div class="muted">${new Date(c.createdAt).toLocaleString()}</div>
        </td>
        <td>${escapeHTML(c.phone || "")}</td>
        <td>${escapeHTML(c.city || "")}</td>
        <td>${escapeHTML(c.address || "")}</td>
        <td>${escapeHTML(c.gender || "")}</td>
        <td>
          <button class="btn-secondary" data-action="edit" data-id="${c.id}">Editar</button>
          <button class="btn-danger" data-action="del" data-id="${c.id}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    }
  }

  $("#totalBadge").textContent = `${contacts.length} contacto${
    contacts.length !== 1 ? "s" : ""
  }`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>\"']/g, (s) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s])
  );
}

// ---------- FORMULARIO ----------
const form = $("#contact-form");
const statusEl = $("#formStatus");
const submitBtn = $("#submitBtn");
const cancelEditBtn = $("#cancelEditBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());

  // Normalización
  payload.firstName = payload.firstName.trim();
  payload.lastName = payload.lastName.trim();
  payload.phone = payload.phone.trim();
  payload.city = (payload.city || "").trim();
  payload.address = (payload.address || "").trim();

  // Validación simple
  if (!payload.firstName || !payload.lastName || !payload.phone || !payload.gender) {
    flash("Por favor completa los campos requeridos.");
    return;
  }

  if (editingId) {
    // UPDATE
    const idx = contacts.findIndex((c) => c.id === editingId);
    if (idx !== -1) {
      contacts[idx] = { ...contacts[idx], ...payload };
      saveContacts(contacts);
      flash("Contacto actualizado ✅", true);
    }
    exitEditMode();
  } else {
    // CREATE (evitar duplicados simples por teléfono)
    if (contacts.some((c) => c.phone === payload.phone)) {
      flash("Ya existe un contacto con ese teléfono.");
      return;
    }
    contacts.push({ id: uid(), createdAt: Date.now(), ...payload });
    saveContacts(contacts);
    form.reset();
    flash("Contacto agregado ✅", true);
  }

  render();
});

function flash(msg, positive = false) {
  statusEl.textContent = msg;
  statusEl.style.color = positive ? "var(--success)" : "var(--danger)";
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
}

function enterEditMode(contact) {
  editingId = contact.id;
  form.firstName.value = contact.firstName || "";
  form.lastName.value = contact.lastName || "";
  form.phone.value = contact.phone || "";
  form.city.value = contact.city || "";
  form.address.value = contact.address || "";
  $$('input[name="gender"]').forEach((r) => (r.checked = r.value === contact.gender));
  submitBtn.textContent = "Guardar";
  cancelEditBtn.hidden = false;
  form.firstName.focus();
}

function exitEditMode() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "ADD";
  cancelEditBtn.hidden = true;
}

cancelEditBtn.addEventListener("click", () => {
  exitEditMode();
  flash("Edición cancelada");
});

// Delegación de eventos para Editar/Eliminar
$("#tbody").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return;

  if (action === "edit") {
    enterEditMode(contact);
  } else if (action === "del") {
    if (confirm("¿Eliminar este contacto?")) {
      contacts = contacts.filter((c) => c.id !== id);
      saveContacts(contacts);
      render();
      if (editingId === id) exitEditMode();
    }
  }
});

// Buscador y orden
$("#search").addEventListener("input", debounce(render, 120));
$("#sortBy").addEventListener("change", render);

// Borrar todo
$("#clearAllBtn").addEventListener("click", () => {
  if (contacts.length === 0) return;
  if (confirm("Esto eliminará todos los contactos. ¿Continuar?")) {
    contacts = [];
    saveContacts(contacts);
    exitEditMode();
    render();
  }
});

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), ms);
  };
}

// Primera carga
render();
