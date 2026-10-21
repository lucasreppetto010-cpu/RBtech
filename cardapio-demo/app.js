// Cardápio digital: lê window.LOJA / TAMANHOS / BORDAS / CARDAPIO (data.js) e monta tudo.
(function () {
  const L = window.LOJA, TAM = window.TAMANHOS, BORDAS = window.BORDAS, MENU = window.CARDAPIO;
  const $ = (s, el = document) => el.querySelector(s);
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-");
  const ITENS = MENU.flatMap((c) => c.itens.map((i) => ({ ...i, cat: c.cat })));
  const KEY = "cardapio_" + L.instagram;

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* sem storage */ } };

  // ---------- Topo ----------
  document.title = L.nome + " | Cardápio";
  $("#cover").style.backgroundImage = `url(${L.capa})`;
  $("#logo").src = L.logo; $("#logoFoot").src = L.logo;
  $("#nome").textContent = L.nome;
  $("#slogan").textContent = L.slogan;
  $("#tempo").textContent = "⏱ " + L.tempoEntrega;
  $("#cidade").textContent = "📍 " + L.cidade;
  $("#horarioTxt").textContent = L.horario.texto;
  $("#igLink").href = "https://www.instagram.com/" + L.instagram + "/";
  $("#igLink").textContent = "@" + L.instagram;
  if (L.aviso) { $("#aviso").textContent = L.aviso; $("#aviso").hidden = false; }

  function aberto() {
    const now = new Date();
    const mins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    const a = mins(L.horario.abre), f = mins(L.horario.fecha), n = now.getHours() * 60 + now.getMinutes();
    const ontem = (now.getDay() + 6) % 7;
    if (f > a) return L.horario.dias.includes(now.getDay()) && n >= a && n < f;
    return (L.horario.dias.includes(now.getDay()) && n >= a) || (L.horario.dias.includes(ontem) && n < f);
  }
  const st = $("#status");
  if (aberto()) { st.textContent = "● Aberto agora"; st.className = "status open"; }
  else { st.textContent = "● Fechado · abre às " + L.horario.abre.replace(":", "h"); st.className = "status closed"; }

  // ---------- Cardápio ----------
  $("#cats").innerHTML = MENU.map((c, i) => `<button class="cat${i === 0 ? " is-on" : ""}" data-go="${slug(c.cat)}">${esc(c.cat)}</button>`).join("");
  const precoMin = (it) => it.preco.unico ?? Math.min(...Object.values(it.preco));
  $("#menu").innerHTML = MENU.map((c) => `
    <section class="sec" id="${slug(c.cat)}">
      <h2>${esc(c.cat)}</h2>
      ${c.itens.map((it) => `
        <button class="item" data-id="${it.id}">
          <div>
            <p class="item__name">${esc(it.nome)}${it.top ? '<span class="tag">Mais pedido</span>' : ""}</p>
            <p class="item__desc">${esc(it.desc)}</p>
            <span class="item__price">${it.preco.unico ? "" : "<small>a partir de </small>"}${brl(precoMin(it))}</span>
          </div>
          <img src="${it.img}" alt="" loading="lazy" style="object-position:${it.pos || "50% 50%"}" />
        </button>`).join("")}
    </section>`).join("");

  $("#cats").addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]"); if (!b) return;
    document.getElementById(b.dataset.go).scrollIntoView({ behavior: "smooth" });
  });
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    document.querySelectorAll(".cat").forEach((b) => b.classList.toggle("is-on", b.dataset.go === en.target.id));
    const on = $(".cat.is-on"), bar = $("#cats");
    // centraliza o botão só dentro da barra de categorias (scrollIntoView mexia na rolagem da página)
    if (on) bar.scrollTo({ left: on.offsetLeft - (bar.clientWidth - on.clientWidth) / 2, behavior: "smooth" });
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll(".sec").forEach((s) => io.observe(s));

  // ---------- Item ----------
  let cur = null, sel = {};
  const pizza = (it) => !it.preco.unico;

  function abrirItem(id) {
    cur = ITENS.find((i) => i.id === id); if (!cur) return;
    sel = { tam: pizza(cur) ? "G" : null, meia: "", borda: 0, qtd: 1 };
    $("#itImg").src = cur.img; $("#itImg").style.objectPosition = cur.pos || "50% 50%";
    $("#itNome").textContent = cur.nome; $("#itDesc").textContent = cur.desc; $("#itObs").value = "";
    $("#blkTam").hidden = !pizza(cur); $("#blkBorda").hidden = !pizza(cur); $("#blkMeia").hidden = !cur.meia;
    if (pizza(cur)) {
      $("#optTam").innerHTML = TAM.map((t) => `<button class="opt-btn${t.id === sel.tam ? " is-on" : ""}" data-tam="${t.id}">${t.nome}<small>${t.info}</small><b>${brl(cur.preco[t.id])}</b></button>`).join("");
      $("#optBorda").innerHTML = BORDAS.map((b, i) => `<button class="opt-btn${i === 0 ? " is-on" : ""}" data-borda="${i}"><span>${esc(b.nome)}</span><span>${b.preco ? "+ " + brl(b.preco) : ""}</span></button>`).join("");
    }
    if (cur.meia) {
      const outros = ITENS.filter((i) => i.cat === cur.cat && i.meia && i.id !== cur.id);
      $("#selMeia").innerHTML = `<option value="">Não, pizza inteira de ${esc(cur.nome)}</option>` + outros.map((o) => `<option value="${o.id}">½ ${esc(cur.nome)} + ½ ${esc(o.nome)}</option>`).join("");
    }
    atualizaItem();
    abrir("#itemSheet");
  }
  function precoItem() {
    if (!pizza(cur)) return cur.preco.unico;
    let p = cur.preco[sel.tam];
    if (sel.meia) p = Math.max(p, ITENS.find((i) => i.id === sel.meia).preco[sel.tam]);
    return p + BORDAS[sel.borda].preco;
  }
  function atualizaItem() {
    $("#qVal").textContent = sel.qtd;
    $("#itPreco").textContent = brl(precoItem() * sel.qtd);
  }
  $("#optTam").addEventListener("click", (e) => { const b = e.target.closest("[data-tam]"); if (!b) return; sel.tam = b.dataset.tam; document.querySelectorAll("#optTam .opt-btn").forEach((x) => x.classList.toggle("is-on", x === b)); atualizaItem(); });
  $("#optBorda").addEventListener("click", (e) => { const b = e.target.closest("[data-borda]"); if (!b) return; sel.borda = Number(b.dataset.borda); document.querySelectorAll("#optBorda .opt-btn").forEach((x) => x.classList.toggle("is-on", x === b)); atualizaItem(); });
  $("#selMeia").addEventListener("change", (e) => { sel.meia = e.target.value; atualizaItem(); });
  $("#qMenos").addEventListener("click", () => { if (sel.qtd > 1) { sel.qtd--; atualizaItem(); } });
  $("#qMais").addEventListener("click", () => { sel.qtd++; atualizaItem(); });
  $("#itAdd").addEventListener("click", () => {
    const tam = pizza(cur) ? TAM.find((t) => t.id === sel.tam) : null;
    const det = [];
    if (tam) det.push(`${tam.nome} (${tam.info})`);
    if (sel.meia) det.push(`½ ${cur.nome} + ½ ${ITENS.find((i) => i.id === sel.meia).nome}`);
    if (pizza(cur) && sel.borda) det.push(BORDAS[sel.borda].nome);
    const obs = $("#itObs").value.trim(); if (obs) det.push("Obs.: " + obs);
    cart.push({ nome: cur.nome, det, unit: precoItem(), qtd: sel.qtd });
    save(); renderCart(); fechar("#itemSheet");
    const bar = $("#cartbar"); bar.classList.remove("bump"); void bar.offsetWidth; bar.classList.add("bump");
    toast("Adicionado ao pedido ✓");
  });

  // ---------- Pedido ----------
  let entrega = "Entrega", pag = "Pix";
  const total = () => cart.reduce((s, i) => s + i.unit * i.qtd, 0);
  function renderCart() {
    const qtd = cart.reduce((s, i) => s + i.qtd, 0);
    $("#cartbar").hidden = qtd === 0;
    $("#cartQty").textContent = qtd; $("#cartTotal").textContent = brl(total());
    $("#cartItems").innerHTML = cart.length ? cart.map((i, k) => `
      <div class="ci">
        <div class="ci__main"><p class="ci__name">${i.qtd}x ${esc(i.nome)}</p><p class="ci__det">${i.det.map(esc).join("<br>")}</p></div>
        <div class="ci__side"><div class="ci__price">${brl(i.unit * i.qtd)}</div><button class="ci__rm" data-rm="${k}">Remover</button></div>
      </div>`).join("") : '<p class="empty">Seu pedido está vazio.</p>';
    $("#sumSub").textContent = brl(total());
    $("#sumTaxa").textContent = entrega === "Entrega" ? L.taxaEntrega : "sem taxa";
    $("#enviar").disabled = cart.length === 0;
  }
  $("#cartItems").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (!b) return; cart.splice(Number(b.dataset.rm), 1); save(); renderCart(); if (!cart.length) fechar("#cartSheet"); });
  $("#optEntrega").addEventListener("click", (e) => { const b = e.target.closest("[data-ent]"); if (!b) return; entrega = b.dataset.ent; document.querySelectorAll("#optEntrega .opt-btn").forEach((x) => x.classList.toggle("is-on", x === b)); $("#blkEnd").hidden = entrega !== "Entrega"; renderCart(); });
  $("#optPag").addEventListener("click", (e) => { const b = e.target.closest("[data-pag]"); if (!b) return; pag = b.dataset.pag; document.querySelectorAll("#optPag .opt-btn").forEach((x) => x.classList.toggle("is-on", x === b)); $("#troco").hidden = pag !== "Dinheiro"; });
  $("#cartbar").addEventListener("click", () => { renderCart(); abrir("#cartSheet"); });
  $("#enviar").addEventListener("click", () => {
    if (!cart.length) return;
    if (entrega === "Entrega" && !$("#endRua").value.trim()) { toast("Informe o endereço de entrega"); $("#endRua").focus(); return; }
    const nome = $("#cliNome").value.trim();
    const linhas = [
      `*Novo pedido · ${L.nome}*`,
      nome ? `Cliente: ${nome}` : null,
      "",
      ...cart.flatMap((i) => [`*${i.qtd}x ${i.nome}* · ${brl(i.unit * i.qtd)}`, ...i.det.map((d) => `   ${d}`)]),
      "",
      `*Subtotal: ${brl(total())}*`,
      entrega === "Entrega" ? `Entrega: ${$("#endRua").value.trim()} - ${$("#endBairro").value.trim()}${$("#endRef").value.trim() ? " (" + $("#endRef").value.trim() + ")" : ""}` : "Retirada no local",
      `Pagamento: ${pag}${pag === "Dinheiro" && $("#troco").value.trim() ? " (troco para " + $("#troco").value.trim() + ")" : ""}`,
    ].filter((l) => l !== null).join("\n");
    window.open(`https://wa.me/${L.whatsapp}?text=${encodeURIComponent(linhas)}`, "_blank", "noopener");
  });

  // ---------- Utilidades ----------
  function abrir(s) { $(s).classList.add("is-open"); $(s).setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function fechar(s) { $(s).classList.remove("is-open"); $(s).setAttribute("aria-hidden", "true"); if (!document.querySelector(".sheet.is-open")) document.body.style.overflow = ""; }
  document.querySelectorAll(".sheet").forEach((sh) => sh.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) fechar("#" + sh.id); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".sheet.is-open").forEach((sh) => fechar("#" + sh.id)); });
  $("#menu").addEventListener("click", (e) => { const b = e.target.closest(".item"); if (b) abrirItem(b.dataset.id); });
  let tt; function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("is-show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("is-show"), 1800); }

  renderCart();
})();
