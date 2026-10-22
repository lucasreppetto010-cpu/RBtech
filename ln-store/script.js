// Prévia da loja LN Store (RB Tech). Catálogo fixo; preços e tamanhos ilustrativos.
const WHATSAPP = "553232130223"; // "Comprar pelo WhatsApp" do Linktree da LN Store
const CART_KEY = "lnstore_previa_cart";

const PRODUCTS = [
  { id: 1, name: "Conjunto Kimono + Regata em Tricô", cat: "Conjuntos", price: 189.9, img: "p1.jpg", featured: true, isNew: true,
    desc: "Kimono de ponto vazado com mangas amplas e regata de decote quadrado. Informação de moda sem abrir mão da versatilidade.",
    sizes: { P: true, M: true, G: true, GG: false } },
  { id: 2, name: "Conjunto Kellen Pantalona Floral", cat: "Conjuntos", price: 229.9, img: "p2.jpg", featured: true,
    desc: "Pantalona que alonga a silhueta e blusa com recorte assimétrico. Estampa floral em tons terrosos com blocos de cor.",
    sizes: { P: true, M: true, G: true, GG: true } },
  { id: 3, name: "Vestido Longo com Busto em Renda", cat: "Vestidos", price: 249.9, img: "p3.jpg", pos: "50% 42%", featured: true,
    desc: "Decote com detalhes em renda, alças finas e modelagem longa com caimento fluido. Leve para qualquer ocasião.",
    sizes: { P: true, M: false, G: true, GG: true } },
  { id: 4, name: "Blusa em Tricô Lilás com Pesponto", cat: "Blusas", price: 99.9, img: "p4.jpg", featured: true, isNew: true,
    desc: "Modelagem ampla e cropped, com pesponto contrastante nas mangas. Combina com alfaiataria e jeans.",
    sizes: { "Único": true } },
  { id: 5, name: "Blazer Alongado Azul Serenity", cat: "Blazers", price: 219.9, img: "p5.jpg", featured: true,
    desc: "Blazer alongado com mangas franzidas. Vai do trabalho ao fim de semana.",
    sizes: { P: true, M: true, G: true, GG: false } },
  { id: 6, name: "Macacão Preto com Faixa Estampada", cat: "Conjuntos", price: 199.9, img: "p6.jpg", pos: "50% 22%",
    desc: "Macacão pantalona sem mangas com faixa de cetim estampada amarrada na cintura.",
    sizes: { P: true, M: true, G: true, GG: true } },
  { id: 7, name: "Bata Listrada Rosé", cat: "Blusas", price: 89.9, img: "p7.jpg",
    desc: "Listras verticais em rosé e off-white, com entremeio vazado. Fresca para os dias quentes.",
    sizes: { P: true, M: true, G: true, GG: true } },
  { id: 8, name: "Regata Peplum em Tricô Verde", cat: "Blusas", price: 79.9, img: "p8.jpg", isNew: true,
    desc: "Alças largas, decote quadrado e barra em peplum que marca a cintura.",
    sizes: { P: true, M: true, G: false, GG: false } },
  { id: 9, name: "T-shirt Rosé com Mangas em Crochê", cat: "Blusas", price: 69.9, img: "p9.jpg",
    desc: "Malha macia com mangas em crochê floral. Delicada e fácil de combinar.",
    sizes: { P: true, M: true, G: true, GG: true } },
  { id: 10, name: "Blusa Frente Única em Renda Preta", cat: "Blusas", price: 89.9, img: "p10.jpg",
    desc: "Camadas de babados em renda e amarração no pescoço. Perfeita para a noite.",
    sizes: { P: true, M: true, G: true, GG: false } },
  { id: 11, name: "Body Canelado (6 cores)", cat: "Bodies", price: 59.9, img: "p11.jpg", pos: "50% 30%",
    desc: "Body canelado de alças largas, disponível em rosa, amarelo, azul, verde, nude e preto.",
    sizes: { P: true, M: true, G: true } },
  { id: 12, name: "Blusa Ombro Único Drapeada", cat: "Blusas", price: 29.9, img: "p12.jpg", pos: "50% 25%",
    desc: "A blusa perfeita para aproveitar os dias quentes com muito estilo. Disponível em várias cores.",
    sizes: { "Único": true } },
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
    "*Pedido pelo site · PRÉVIA RB Tech (teste)*",
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
