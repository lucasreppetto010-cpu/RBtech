// Loja de demonstração da RB Tech. Catálogo fixo; produtos e preços ilustrativos.
const WHATSAPP = "5555996822565"; // RB Tech: pedidos de teste da demonstração
const CART_KEY = "rbtech_demo_cart";

const PRODUCTS = [
  { id: 1, name: "Look Off-white com Cropped Canelado", cat: "Conjuntos", price: 219.9, img: "d3.jpg", pos: "50% 20%", featured: true, isNew: true,
    desc: "Calça skinny off-white e cropped canelado de gola alta. Leve, elegante e fácil de combinar.", sizes: { P: true, M: true, G: true, GG: false } },
  { id: 2, name: "Conjunto Alfaiataria Preto", cat: "Conjuntos", price: 289.9, img: "d4.jpg", pos: "50% 25%", featured: true,
    desc: "Blazer acinturado com botões duplos e calça reta. Do trabalho ao jantar.", sizes: { P: true, M: false, G: true, GG: true } },
  { id: 3, name: "Casaco Estampado Geométrico", cat: "Casacos", price: 259.9, img: "d2.jpg", pos: "50% 35%", featured: true,
    desc: "Lã batida com estampa geométrica em tons terrosos. A peça que faz o look.", sizes: { P: true, M: true, G: true, GG: true } },
  { id: 4, name: "Casaco Longo Caramelo", cat: "Casacos", price: 239.9, img: "d1.jpg", pos: "50% 25%", isNew: true,
    desc: "Modelagem alongada em tom caramelo. Clássico que nunca sai de moda.", sizes: { P: true, M: true, G: false, GG: false } },
  { id: 5, name: "Sobretudo Off-white", cat: "Casacos", price: 249.9, img: "d5.jpg", pos: "50% 25%",
    desc: "Sobretudo leve off-white, para usar aberto ou fechado.", sizes: { P: true, M: true, G: true, GG: false } },
  { id: 6, name: "Parka Oversized Off-white", cat: "Casacos", price: 199.9, img: "d6.jpg", pos: "50% 30%",
    desc: "Parka ampla com bolsos e barra ajustável. Combina com tênis e lenço.", sizes: { "Único": true } },
  { id: 7, name: "Casaco Marrom com Calça Cinza", cat: "Conjuntos", price: 279.9, img: "d7.jpg", pos: "50% 30%",
    desc: "Combinação sóbria e elegante para os dias frios.", sizes: { P: true, M: true, G: true, GG: true } },
  { id: 8, name: "Casaco Longo Marrom", cat: "Casacos", price: 229.9, img: "d8.jpg", pos: "50% 25%",
    desc: "Casaco longo com gola ampla e caimento reto.", sizes: { P: false, M: true, G: true, GG: true } },
  { id: 9, name: "T-shirt Branca Básica", cat: "Blusas", price: 49.9, img: "d9.jpg", pos: "50% 30%",
    desc: "Algodão macio, gola careca. A base de qualquer look.", sizes: { P: true, M: true, G: true, GG: true } },
  { id: 10, name: "Kit Suéter Cinza + Gorro", cat: "Blusas", price: 129.9, img: "d10.jpg", pos: "50% 50%", isNew: true,
    desc: "Suéter de tricô cinza com gorro ferrugem. Kit pronto para o frio.", sizes: { P: true, M: true, G: true } },
  { id: 11, name: "Sandália de Couro Branca", cat: "Calçados", price: 159.9, img: "d11.jpg", pos: "50% 50%",
    desc: "Couro legítimo, tiras finas e palmilha macia.", sizes: { "34": true, "35": true, "36": true, "37": false, "38": true } },
  { id: 12, name: "Bolsa Metalizada", cat: "Acessórios", price: 139.9, img: "d12.jpg", pos: "50% 50%",
    desc: "Bolsa compacta com acabamento metalizado e alça de mão.", sizes: { "Único": true } },
];

const $ = (s, el = document) => el.querySelector(s);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const state = { cat: "Todas", q: "", sort: "featured" };
let cart = loadCart();
let current = null;     // produto aberto no modal
let currentSize = null;

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* navegador sem storage */ }
}

// ---------- Vitrine ----------
function renderCats() {
  const cats = ["Todas", ...new Set(PRODUCTS.map((p) => p.cat))];
  $("#cats").innerHTML = cats
    .map((c) => `<button class="chip${c === state.cat ? " is-active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`)
    .join("");
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  let list = PRODUCTS.filter((p) =>
    (state.cat === "Todas" || p.cat === state.cat) &&
    (!q || (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(q)));
  const by = {
    featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.id - b.id,
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    nameAsc: (a, b) => a.name.localeCompare(b.name, "pt-BR"),
  };
  return list.sort(by[state.sort]);
}

function renderGrid() {
  const list = filtered();
  $("#storeTitle").textContent = state.cat === "Todas" ? "Todas as peças" : state.cat;
  $("#storeCount").textContent = `${list.length} ${list.length === 1 ? "peça" : "peças"}`;
  $("#emptyMsg").hidden = list.length > 0;
  $("#grid").innerHTML = list.map((p) => `
    <article class="card" data-id="${p.id}" tabindex="0" aria-label="${esc(p.name)}">
      <div class="card__media">
        <img src="assets/produtos/${p.img}" alt="${esc(p.name)}" loading="lazy" style="object-position:${p.pos || "50% 0%"}" />
        ${p.isNew ? '<span class="badge badge--red">Novidade</span>' : ""}
        <button class="card__quick" data-id="${p.id}">Escolher tamanho</button>
      </div>
      <p class="card__cat">${esc(p.cat)}</p>
      <h3 class="card__name">${esc(p.name)}</h3>
      <p class="card__price">${brl(p.price)}</p>
      <p class="card__parcel">ou 3x de ${brl(p.price / 3)}</p>
    </article>`).join("");
}

// ---------- Modal do produto ----------
function openProduct(id) {
  current = PRODUCTS.find((p) => p.id === id);
  if (!current) return;
  const avail = Object.entries(current.sizes).filter(([, ok]) => ok).map(([s]) => s);
  currentSize = avail.length === 1 ? avail[0] : null;

  $("#pmImg").src = `assets/produtos/${current.img}`;
  $("#pmImg").alt = current.name;
  $("#pmImg").style.objectPosition = current.pos || "50% 0%";
  $("#pmCat").textContent = current.cat;
  $("#pmName").textContent = current.name;
  $("#pmPrice").textContent = brl(current.price);
  $("#pmDesc").textContent = current.desc;
  $("#pmSizes").innerHTML = Object.entries(current.sizes).map(([s, ok]) =>
    `<button class="size${s === currentSize ? " is-active" : ""}" data-size="${esc(s)}" ${ok ? "" : "disabled title=\"Esgotado\""}>${esc(s)}</button>`
  ).join("");
  updateHint();
  toggle("#productModal", true);
}

function updateHint() {
  const sold = Object.values(current.sizes).some((ok) => !ok);
  $("#pmHint").textContent = currentSize
    ? `Tamanho ${currentSize} selecionado.`
    : sold ? "Tamanhos riscados estão esgotados." : "Selecione um tamanho.";
  $("#pmAdd").disabled = !currentSize;
}

// ---------- Carrinho ----------
function addToCart(p, size) {
  const item = cart.find((i) => i.id === p.id && i.size === size);
  if (item) item.qty += 1;
  else cart.push({ id: p.id, size, qty: 1 });
  saveCart();
  renderCart();
  const btn = $("#openCartBtn");
  btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  toast(`${p.name} (${size}) adicionado ao carrinho`);
}

function renderCart() {
  const lines = cart.map((i) => ({ ...i, p: PRODUCTS.find((p) => p.id === i.id) })).filter((i) => i.p);
  const count = lines.reduce((n, i) => n + i.qty, 0);
  const total = lines.reduce((n, i) => n + i.qty * i.p.price, 0);
  $("#cartCount").textContent = count;
  $("#cartSubtotal").textContent = brl(total);
  $("#checkoutBtn").disabled = count === 0;
  $("#cartItems").innerHTML = lines.length ? lines.map((i, idx) => `
    <div class="citem">
      <img src="assets/produtos/${i.p.img}" alt="" style="object-position:${i.p.pos || "50% 0%"}" />
      <div>
        <p class="citem__name">${esc(i.p.name)}</p>
        <p class="citem__meta">Tamanho ${esc(i.size)} · ${brl(i.p.price)}</p>
        <div class="qty">
          <button data-qty="-1" data-idx="${idx}" aria-label="Diminuir">−</button>
          <span>${i.qty}</span>
          <button data-qty="1" data-idx="${idx}" aria-label="Aumentar">+</button>
        </div>
      </div>
      <div>
        <div class="citem__price">${brl(i.qty * i.p.price)}</div>
        <button class="citem__remove" data-remove="${idx}">Remover</button>
      </div>
    </div>`).join("") : '<p class="cart-empty">Seu carrinho está vazio.<br/>Escolha uma peça na vitrine.</p>';
}

function checkout() {
  const lines = cart.map((i) => ({ ...i, p: PRODUCTS.find((p) => p.id === i.id) })).filter((i) => i.p);
  if (!lines.length) return;
  const total = lines.reduce((n, i) => n + i.qty * i.p.price, 0);
  const name = $("#cartName").value.trim();
  const note = $("#cartNote").value.trim();
  const msg = [
    "*Pedido de TESTE · Loja de demonstração RB Tech*",
    name ? `Nome: ${name}` : null,
    "",
    ...lines.map((i) => `• ${i.qty}x ${i.p.name} (Tam. ${i.size}): ${brl(i.qty * i.p.price)}`),
    "",
    `*Subtotal: ${brl(total)}*`,
    note ? `Obs.: ${note}` : null,
    "",
    "Pode confirmar a disponibilidade?",
  ].filter((l) => l !== null).join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

// ---------- Utilidades ----------
function toggle(sel, open) {
  const el = $(sel);
  el.classList.toggle("is-open", open);
  el.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
}

let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 2200);
}

// ---------- Eventos ----------
$("#cats").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]");
  if (!b) return;
  state.cat = b.dataset.cat;
  renderCats();
  renderGrid();
});
$("#searchInput").addEventListener("input", (e) => {
  state.q = e.target.value;
  renderGrid();
  if (state.q) document.getElementById("vitrine").scrollIntoView({ block: "start" });
});
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

$("#grid").addEventListener("click", (e) => {
  const card = e.target.closest("[data-id]");
  if (card) openProduct(Number(card.dataset.id));
});
$("#grid").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches(".card")) openProduct(Number(e.target.dataset.id));
});

$("#pmSizes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-size]");
  if (!b || b.disabled) return;
  currentSize = b.dataset.size;
  $("#pmSizes").querySelectorAll(".size").forEach((x) => x.classList.toggle("is-active", x === b));
  updateHint();
});
$("#pmAdd").addEventListener("click", () => {
  if (!current || !currentSize) return;
  addToCart(current, currentSize);
  toggle("#productModal", false);
});
$("#productModal").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) toggle("#productModal", false); });

$("#openCartBtn").addEventListener("click", () => toggle("#cartDrawer", true));
$("#cartDrawer").addEventListener("click", (e) => {
  if (e.target.closest("[data-close-cart]")) return toggle("#cartDrawer", false);
  const q = e.target.closest("[data-qty]");
  const r = e.target.closest("[data-remove]");
  if (q) {
    const i = cart[Number(q.dataset.idx)];
    i.qty += Number(q.dataset.qty);
    if (i.qty <= 0) cart.splice(Number(q.dataset.idx), 1);
  } else if (r) {
    cart.splice(Number(r.dataset.remove), 1);
  } else return;
  saveCart();
  renderCart();
});
$("#checkoutBtn").addEventListener("click", checkout);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  toggle("#productModal", false);
  toggle("#cartDrawer", false);
});

$("#footerWpp").href = `https://wa.me/${WHATSAPP}`;
$("#year").textContent = new Date().getFullYear();

renderCats();
renderGrid();
renderCart();
