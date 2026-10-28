(() => {
  const CFG = window.OFICINA_CONFIG || {};
  const DEMO = !CFG.supabaseUrl || !CFG.supabaseAnonKey;
  const $ = (s, el = document) => el.querySelector(s);

  // ================= Utilidades =================
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const hoje = () => ymd(new Date());
  const addDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const MES_CURTO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const DIA_SEM = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const dinheiro = v => brl.format(Number(v) || 0);
  const dataBR = s => { const d = parseYmd(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
  const valorInput = v => (Number(v) || 0) ? (Number(v)).toFixed(2).replace(".", ",") : "";

  function lerDinheiro(s) {
    s = String(s || "").trim().replace(/[R$\s]/g, "");
    if (!s) return 0;
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
    const n = parseFloat(s);
    return isFinite(n) ? Math.round(n * 100) / 100 : 0;
  }

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const iniciais = nome => String(nome || "?").trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
  const soDigitos = s => String(s || "").replace(/\D/g, "");
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2600);
  }

  // ================= Períodos =================
  function intervalo(tipo, ref) {
    const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
    if (tipo === "dia") return [ymd(d), ymd(d)];
    if (tipo === "semana") { const ini = addDias(d, -((d.getDay() + 6) % 7)); return [ymd(ini), ymd(addDias(ini, 6))]; }
    if (tipo === "mes") return [ymd(new Date(d.getFullYear(), d.getMonth(), 1)), ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0))];
    return [`${d.getFullYear()}-01-01`, `${d.getFullYear()}-12-31`];
  }
  function moverPeriodo(tipo, ref, dir) {
    const d = new Date(ref);
    if (tipo === "dia") d.setDate(d.getDate() + dir);
    else if (tipo === "semana") d.setDate(d.getDate() + 7 * dir);
    else if (tipo === "mes") { d.setDate(1); d.setMonth(d.getMonth() + dir); }
    else d.setFullYear(d.getFullYear() + dir);
    return d;
  }
  function nomePeriodo(tipo, ref) {
    const [a, b] = intervalo(tipo, ref);
    const da = parseYmd(a), db = parseYmd(b);
    if (tipo === "dia") return a === hoje() ? "Hoje" : `${DIA_SEM[da.getDay()]}, ${dataBR(a)}`;
    if (tipo === "semana") return `${pad(da.getDate())}/${pad(da.getMonth() + 1)} a ${pad(db.getDate())}/${pad(db.getMonth() + 1)}`;
    if (tipo === "mes") return `${MESES[da.getMonth()][0].toUpperCase() + MESES[da.getMonth()].slice(1)} ${da.getFullYear()}`;
    return String(da.getFullYear());
  }
  const noIntervalo = (s, [a, b]) => s >= a && s <= b;

  // ================= Armazenamento =================
  const TABELAS = ["clientes", "servicos", "despesas"];

  const bancoLocal = {
    chave: t => "oficina_" + t,
    ler(t) { try { return JSON.parse(localStorage.getItem(this.chave(t)) || "[]"); } catch { return []; } },
    gravar(t, linhas) { localStorage.setItem(this.chave(t), JSON.stringify(linhas)); },
    async entrar(email) { localStorage.setItem("oficina_sessao", email); },
    async usuario() { return localStorage.getItem("oficina_sessao"); },
    async sair() { localStorage.removeItem("oficina_sessao"); },
    async todos(t) { return this.ler(t); },
    async inserir(t, linha) {
      const nova = { ...linha, id: uid(), created_at: new Date().toISOString() };
      this.gravar(t, [...this.ler(t), nova]); return nova;
    },
    async atualizar(t, id, dados) {
      let nova;
      this.gravar(t, this.ler(t).map(r => r.id === id ? (nova = { ...r, ...dados }) : r));
      return nova;
    },
    async remover(t, id) { this.gravar(t, this.ler(t).filter(r => r.id !== id)); },
  };

  function bancoSupabase() {
    const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    const ok = ({ data, error }) => { if (error) throw error; return data; };
    return {
      async entrar(email, senha) { ok(await sb.auth.signInWithPassword({ email, password: senha })); },
      async usuario() { const { data } = await sb.auth.getSession(); return data.session?.user?.email || null; },
      async sair() { await sb.auth.signOut(); },
      async todos(t) {
        const linhas = [];
        for (let de = 0; ; de += 1000) {
          const parte = ok(await sb.from(t).select("*").order("created_at").range(de, de + 999));
          linhas.push(...parte);
          if (parte.length < 1000) return linhas;
        }
      },
      async inserir(t, linha) { return ok(await sb.from(t).insert(linha).select().single()); },
      async atualizar(t, id, dados) { return ok(await sb.from(t).update(dados).eq("id", id).select().single()); },
      async remover(t, id) { ok(await sb.from(t).delete().eq("id", id)); },
    };
  }

  const banco = DEMO ? bancoLocal : bancoSupabase();
  const S = { clientes: [], servicos: [], despesas: [] };
  const ui = { periodo: "mes", ref: new Date(), filtroServ: "todos", buscaServ: "", buscaCli: "", refDesp: new Date() };

  async function carregarTudo() {
    const [c, s, d] = await Promise.all(TABELAS.map(t => banco.todos(t)));
    S.clientes = c; S.servicos = s; S.despesas = d;
  }

  async function salvar(t, id, dados) {
    if (id) {
      const r = await banco.atualizar(t, id, dados);
      S[t] = S[t].map(x => x.id === id ? r : x);
      return r;
    }
    const r = await banco.inserir(t, dados);
    S[t].push(r);
    return r;
  }
  async function apagar(t, id) {
    await banco.remover(t, id);
    S[t] = S[t].filter(x => x.id !== id);
  }

  function erroAmigavel(e) {
    console.error(e);
    const m = String(e?.message || e);
    if (/Invalid login/i.test(m)) return "E-mail ou senha incorretos.";
    if (/fetch|network/i.test(m)) return "Sem conexão com a internet. Tente de novo.";
    if (/row-level security|permission/i.test(m)) return "Este usuário não tem permissão de dono.";
    return "Algo deu errado: " + m;
  }

  // ================= Dados de exemplo (modo demo) =================
  function semearDemo() {
    if (localStorage.getItem("oficina_semeado") === "2") return;
    const nomes = [
      ["Carlos Pereira", "(53) 99112-3344", "Gol 1.6 2015", "IXT4B21"],
      ["Mariana Souza", "(53) 98455-1020", "Onix 1.0 2020", "QHK8C77"],
      ["João Batista", "(53) 99930-7788", "Hilux 2.8 2019", "JBA2D45"],
      ["Fernanda Lima", "(53) 98120-5566", "HB20 1.0 2018", "IZP9E12"],
      ["Roberto Alves", "(53) 99701-4433", "Strada 1.4 2016", "IVR3F08"],
      ["Patrícia Gomes", "(53) 98877-2211", "Corolla 2.0 2021", "RTG5H63"],
      ["André Martins", "(53) 99345-6677", "Saveiro 1.6 2014", "IRS7J90"],
      ["Luciana Rocha", "(53) 98002-9988", "Kwid 1.0 2022", "SBC1K34"],
    ];
    const servs = [
      ["Troca de óleo e filtros", 180, 60], ["Revisão completa", 420, 250], ["Pastilhas de freio dianteiras", 190, 120],
      ["Alinhamento e balanceamento", 0, 120], ["Troca de correia dentada", 380, 300], ["Troca de amortecedores", 900, 350],
      ["Diagnóstico eletrônico", 0, 150], ["Troca de embreagem", 850, 450], ["Limpeza de bicos", 60, 180],
      ["Troca de bateria", 520, 40], ["Reparo no ar-condicionado", 280, 220], ["Troca de velas e cabos", 160, 90],
    ];
    const problemas = {
      "Pastilhas de freio dianteiras": "Freio chiando e pedal baixo", "Troca de amortecedores": "Barulho na suspensão em buraco",
      "Diagnóstico eletrônico": "Luz da injeção acesa no painel", "Troca de embreagem": "Embreagem patinando na subida",
      "Limpeza de bicos": "Motor falhando em marcha lenta", "Troca de bateria": "Carro não dava partida de manhã",
      "Reparo no ar-condicionado": "Ar-condicionado não gela", "Troca de velas e cabos": "Motor falhando e consumo alto",
      "Alinhamento e balanceamento": "Volante tremendo e carro puxando para a direita",
    };
    const pagto = ["Pix", "Pix", "Pix", "À vista", "Cartão", "Cartão", "A prazo"];
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const agora = new Date().toISOString();
    const clientes = nomes.map(([nome, telefone, veiculo, placa]) => ({ id: uid(), nome, telefone, veiculo, placa, observacoes: "", created_at: agora }));
    const servicos = [];
    const hojeD = new Date();
    for (let i = 0; i < 300; i++) {
      const dias = i < 14 ? Math.floor(rnd() * 6) : Math.floor(rnd() * 400);
      const data = ymd(addDias(hojeD, -dias));
      const c = clientes[Math.floor(rnd() * clientes.length)];
      const [descricao, pecas, mao] = servs[Math.floor(rnd() * servs.length)];
      const ajuste = 0.85 + rnd() * 0.3;
      const vp = Math.round(pecas * ajuste), vm = Math.round(mao * ajuste), total = vp + vm;
      const forma = pagto[Math.floor(rnd() * pagto.length)];
      let pagamentos = [{ data, valor: total, forma }];
      if (forma === "A prazo") {
        const entrada = Math.round(total * 0.4);
        pagamentos = [{ data, valor: entrada, forma: "Entrada · Dinheiro" }];
        const depois = addDias(parseYmd(data), 12);
        if (depois <= hojeD) pagamentos.push({ data: ymd(depois), valor: Math.round(total * 0.3), forma: "Pix" });
        const fim = addDias(parseYmd(data), 30);
        if (fim <= hojeD) pagamentos.push({ data: ymd(fim), valor: total - entrada - Math.round(total * 0.3), forma: "Pix" });
      }
      servicos.push({
        id: uid(), cliente_id: c.id, data, veiculo: c.veiculo, placa: c.placa, km: String(40000 + Math.floor(rnd() * 90000)),
        problema: problemas[descricao] || "Revisão preventiva", descricao, valor_pecas: vp, valor_mao_obra: vm, valor_total: total,
        forma_pagamento: forma, pagamentos, pago: soma(pagamentos, "valor") >= total, observacoes: "", created_at: agora,
      });
    }
    const despesas = [];
    for (let m = 0; m < 13; m++) {
      const base = new Date(hojeD.getFullYear(), hojeD.getMonth() - m, 1);
      const em = dia => { const d = new Date(base.getFullYear(), base.getMonth(), dia); return d <= hojeD ? ymd(d) : null; };
      [[5, "Aluguel do galpão", "Aluguel", 2200], [10, "Conta de luz", "Contas (luz, água, internet)", 380 + Math.round(rnd() * 120)],
       [12, "Peças - distribuidora", "Peças", 1500 + Math.round(rnd() * 1500)], [20, "Ajudante", "Funcionários", 1800]]
        .forEach(([dia, descricao, categoria, valor]) => { const data = em(dia); if (data) despesas.push({ id: uid(), data, descricao, categoria, valor, created_at: agora }); });
    }
    bancoLocal.gravar("clientes", clientes);
    bancoLocal.gravar("servicos", servicos);
    bancoLocal.gravar("despesas", despesas);
    localStorage.setItem("oficina_semeado", "2");
  }

  // ================= Cálculos =================
  const cliPorId = id => id ? S.clientes.find(c => c.id === id) : undefined;
  // Serviço pode ter cliente cadastrado ou só um nome digitado (cliente avulso)
  const nomeServ = s => cliPorId(s.cliente_id)?.nome || s.cliente_nome || "Cliente não informado";
  const soma = (arr, campo) => arr.reduce((t, x) => t + (Number(x[campo]) || 0), 0);
  const centavos = v => Math.round(v * 100) / 100;

  // Pagamentos recebidos de um serviço (registros antigos sem a lista contam como pagos na data do serviço)
  function pagamentosDe(s) {
    if (Array.isArray(s.pagamentos)) return s.pagamentos;
    return s.pago ? [{ data: s.data, valor: Number(s.valor_total) || 0, forma: s.forma_pagamento || "" }] : [];
  }
  const pagoDe = s => centavos(soma(pagamentosDe(s), "valor"));
  const faltaDe = s => Math.max(0, centavos((Number(s.valor_total) || 0) - pagoDe(s)));

  // "Entrou" conta pelo dia em que o dinheiro foi recebido, não pelo dia do serviço
  function recebidoEm(int) {
    let t = 0;
    S.servicos.forEach(s => pagamentosDe(s).forEach(p => { if (noIntervalo(p.data, int)) t += Number(p.valor) || 0; }));
    return centavos(t);
  }
  function resumo(int) {
    const servs = S.servicos.filter(s => noIntervalo(s.data, int));
    const desp = S.despesas.filter(d => noIntervalo(d.data, int));
    const entrou = recebidoEm(int);
    const saiu = soma(desp, "valor");
    return { servs, entrou, saiu, saldo: entrou - saiu, aReceber: centavos(servs.reduce((t, s) => t + faltaDe(s), 0)), qtd: servs.length };
  }

  // ================= Telas =================
  const main = () => $("#main");
  function setTopo(titulo, sub = CFG.nomeOficina || "") {
    $("#topoTitulo").textContent = titulo;
    $("#topoSub").textContent = sub;
  }

  function telaInicio() {
    setTopo("Resumo");
    const agora = new Date();
    const tiles = [["dia", "Hoje"], ["semana", "Esta semana"], ["mes", "Este mês"], ["ano", "Este ano"]].map(([tipo, rot]) => {
      const r = resumo(intervalo(tipo, agora));
      return `<button class="tile ${ui.periodo === tipo ? "ativo" : ""}" data-acao="tile" data-tipo="${tipo}">
        <div class="tile__rot">${rot}</div>
        <div class="tile__val num">${dinheiro(r.entrou)}</div>
        <div class="tile__info">${r.qtd} serviço${r.qtd === 1 ? "" : "s"}</div>
      </button>`;
    }).join("");

    const int = intervalo(ui.periodo, ui.ref);
    const r = resumo(int);
    const noFuturo = intervalo(ui.periodo, moverPeriodo(ui.periodo, ui.ref, 1))[0] > hoje();
    const ticket = r.qtd ? soma(r.servs, "valor_total") / r.qtd : 0;

    main().innerHTML = `
      <div class="tiles">${tiles}</div>

      <div class="secao">
        <div class="card">
          <div class="periodo">
            <button class="seta" data-acao="periodo" data-dir="-1" aria-label="Anterior">‹</button>
            <div class="periodo__nome">${esc(nomePeriodo(ui.periodo, ui.ref))}</div>
            <button class="seta" data-acao="periodo" data-dir="1" aria-label="Próximo" ${noFuturo ? "disabled" : ""}>›</button>
          </div>
          <div class="resumo-linhas">
            <div class="linha"><span>Entrou (recebido)</span><strong class="num pos">${dinheiro(r.entrou)}</strong></div>
            <div class="linha"><span>Despesas</span><strong class="num neg">− ${dinheiro(r.saiu)}</strong></div>
            <div class="linha linha--total"><span>Saldo</span><strong class="num ${r.saldo < 0 ? "neg" : ""}">${dinheiro(r.saldo)}</strong></div>
            ${r.aReceber ? `<div class="linha"><span>Falta receber destes serviços</span><strong class="num alerta">${dinheiro(r.aReceber)}</strong></div>` : ""}
            <div class="linha"><span>Serviços · ticket médio</span><strong class="num">${r.qtd} · ${dinheiro(ticket)}</strong></div>
          </div>
          ${grafico(ui.periodo, int)}
        </div>
      </div>

      <div class="secao">
        <div class="secao__titulo">Serviços do período</div>
        ${listaServicos(r.servs, true)}
      </div>`;
  }

  function grafico(tipo, [a, b]) {
    if (tipo === "dia") return "";
    let cols = [];
    if (tipo === "ano") {
      const ano = a.slice(0, 4);
      cols = MES_CURTO.map((m, i) => ({ rot: m, chave: `${ano}-${pad(i + 1)}` }));
    } else {
      for (let d = parseYmd(a); ymd(d) <= b; d = addDias(d, 1)) {
        const dia = d.getDate();
        cols.push({ rot: tipo === "semana" ? DIA_SEM[d.getDay()] : (dia === 1 || dia % 5 === 0 ? dia : ""), chave: ymd(d) });
      }
    }
    const totais = cols.map(() => 0);
    const idx = Object.fromEntries(cols.map((c, i) => [c.chave, i]));
    S.servicos.forEach(s => pagamentosDe(s).forEach(p => {
      const i = idx[tipo === "ano" ? p.data.slice(0, 7) : p.data];
      if (i !== undefined) totais[i] += Number(p.valor) || 0;
    }));
    const max = Math.max(...totais, 1);
    return `<div class="grafico" aria-label="Entradas por ${tipo === "ano" ? "mês" : "dia"}">${cols.map((c, i) => `
      <div class="grafico__col" title="${esc(c.rot || c.chave.slice(-2))}: ${dinheiro(totais[i])}">
        <div class="grafico__barra ${totais[i] ? "" : "zero"}" style="height:${(totais[i] / max) * 100}%"></div>
        <div class="grafico__rot">${c.rot}</div>
      </div>`).join("")}</div>`;
  }

  function listaServicos(servs, agrupar) {
    if (!servs.length) return `<div class="lista"><div class="vazio">Nenhum serviço aqui.</div></div>`;
    const ord = [...servs].sort((x, y) => y.data.localeCompare(x.data) || String(y.created_at).localeCompare(String(x.created_at)));
    const item = s => {
      const falta = faltaDe(s);
      return `<button class="item" data-acao="ver-servico" data-id="${s.id}">
        <div class="avatar">${esc(iniciais(nomeServ(s)))}</div>
        <div class="item__corpo">
          <div class="item__titulo">${esc(nomeServ(s))}</div>
          <div class="item__sub">${esc(s.descricao)}${s.placa ? " · " + esc(s.placa) : ""}</div>
        </div>
        <div style="text-align:right"><div class="item__valor num">${dinheiro(s.valor_total)}</div>${falta ? `<span class="badge badge--pend num">Falta ${dinheiro(falta)}</span>` : ""}</div>
      </button>`;
    };
    if (!agrupar) return `<div class="lista">${ord.map(item).join("")}</div>`;
    const grupos = {};
    ord.forEach(s => (grupos[s.data] ||= []).push(s));
    return Object.entries(grupos).map(([data, lista]) => {
      const d = parseYmd(data);
      const rot = data === hoje() ? "Hoje" : data === ymd(addDias(new Date(), -1)) ? "Ontem" : `${DIA_SEM[d.getDay()]}, ${dataBR(data)}`;
      return `<div class="dia"><span>${rot}</span><span class="num">${dinheiro(soma(lista, "valor_total"))}</span></div>
        <div class="lista">${lista.map(item).join("")}</div>`;
    }).join("");
  }

  function telaServicos() {
    setTopo("Serviços");
    const q = norm(ui.buscaServ);
    let servs = S.servicos;
    if (ui.filtroServ === "pendentes") servs = servs.filter(s => faltaDe(s) > 0);
    if (q) servs = servs.filter(s => {
      return norm([nomeServ(s), s.problema, s.descricao, s.placa, s.veiculo].join(" ")).includes(q);
    });
    const totalPend = centavos(S.servicos.reduce((t, s) => t + faltaDe(s), 0));
    const limite = 150;
    main().innerHTML = `
      <button class="btn btn--primary btn--full btn--grande" data-acao="novo-servico">+ Novo serviço (carro pronto)</button>
      <div class="busca">${icBusca}<input type="search" id="buscaServ" placeholder="Buscar cliente, serviço ou placa" value="${esc(ui.buscaServ)}" /></div>
      <div class="filtros">
        <button class="chip ${ui.filtroServ === "todos" ? "ativo" : ""}" data-acao="filtro-serv" data-f="todos">Todos</button>
        <button class="chip ${ui.filtroServ === "pendentes" ? "ativo" : ""}" data-acao="filtro-serv" data-f="pendentes">A receber · ${dinheiro(totalPend)}</button>
      </div>
      <div id="listaServ">${listaServicos([...servs].sort((x, y) => y.data.localeCompare(x.data)).slice(0, limite), true)}</div>
      ${servs.length > limite ? `<p class="muted" style="text-align:center;margin-top:12px;font-size:13px">Mostrando os ${limite} mais recentes. Use a busca para achar os antigos.</p>` : ""}`;
    ligarBusca("#buscaServ", v => (ui.buscaServ = v), telaServicos);
  }

  function telaClientes() {
    setTopo("Clientes", `${S.clientes.length} cadastrado${S.clientes.length === 1 ? "" : "s"}`);
    const q = norm(ui.buscaCli), qd = soDigitos(ui.buscaCli);
    const lista = S.clientes
      .filter(c => !q || norm([c.nome, c.placa, c.veiculo].join(" ")).includes(q) || (qd.length >= 3 && soDigitos(c.telefone).includes(qd)))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    main().innerHTML = `
      <div class="busca">${icBusca}<input type="search" id="buscaCli" placeholder="Buscar nome, placa ou telefone" value="${esc(ui.buscaCli)}" /></div>
      <button class="btn btn--escuro btn--full" data-acao="novo-cliente" style="margin-bottom:12px">+ Novo cliente</button>
      ${lista.length ? `<div class="lista">${lista.map(c => {
        const servs = S.servicos.filter(s => s.cliente_id === c.id);
        return `<a class="item" href="#cliente/${c.id}" style="text-decoration:none;color:inherit">
          <div class="avatar">${esc(iniciais(c.nome))}</div>
          <div class="item__corpo">
            <div class="item__titulo">${esc(c.nome)}</div>
            <div class="item__sub">${esc([c.veiculo, c.placa].filter(Boolean).join(" · ") || c.telefone || "")}</div>
          </div>
          <div class="item__valor num" style="font-weight:600;font-size:13px;color:var(--ink-2)">${servs.length} serv.</div>
        </a>`;
      }).join("")}</div>` : `<div class="lista"><div class="vazio">${S.clientes.length ? "Nenhum cliente encontrado." : "Nenhum cliente ainda. Cadastre o primeiro!"}</div></div>`}`;
    ligarBusca("#buscaCli", v => (ui.buscaCli = v), telaClientes);
  }

  function telaCliente(id) {
    const c = cliPorId(id);
    if (!c) { location.hash = "#clientes"; return; }
    setTopo("Ficha do cliente");
    const servs = S.servicos.filter(s => s.cliente_id === id);
    const gasto = soma(servs, "valor_total");
    const pend = centavos(servs.reduce((t, s) => t + faltaDe(s), 0));
    const tel = soDigitos(c.telefone);
    const wa = tel ? `https://wa.me/${tel.length <= 11 ? "55" + tel : tel}` : "";
    main().innerHTML = `
      <a class="voltar" href="#clientes">‹ Clientes</a>
      <div class="card">
        <div class="ficha__topo">
          <div class="avatar">${esc(iniciais(c.nome))}</div>
          <div><div class="ficha__nome">${esc(c.nome)}</div><div class="muted" style="font-size:13px">Cliente desde ${dataBR(String(c.created_at).slice(0, 10))}</div></div>
        </div>
        <div class="ficha__dados">
          ${c.telefone ? `<div><span>Telefone</span><strong>${esc(c.telefone)}</strong></div>` : ""}
          ${c.veiculo ? `<div><span>Veículo</span><strong>${esc(c.veiculo)}</strong></div>` : ""}
          ${c.placa ? `<div><span>Placa</span><strong>${esc(c.placa)}</strong></div>` : ""}
          ${c.observacoes ? `<div style="display:block"><span>Observações</span><p style="margin-top:4px">${esc(c.observacoes)}</p></div>` : ""}
        </div>
        <div class="ficha__acoes">
          ${wa ? `<a class="btn btn--claro" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
          ${tel ? `<a class="btn btn--claro" href="tel:${tel}">Ligar</a>` : ""}
          <button class="btn btn--claro" data-acao="editar-cliente" data-id="${c.id}">Editar dados</button>
          <button class="btn btn--primary" data-acao="novo-servico" data-cliente="${c.id}">+ Serviço</button>
        </div>
      </div>
      <div class="ficha__totais">
        <div class="tile"><div class="tile__rot">Total em serviços</div><div class="tile__val num">${dinheiro(gasto)}</div><div class="tile__info">${servs.length} serviço${servs.length === 1 ? "" : "s"}</div></div>
        <div class="tile"><div class="tile__rot">A receber</div><div class="tile__val num ${pend ? "alerta" : ""}">${dinheiro(pend)}</div><div class="tile__info">${servs.length ? "Último: " + dataBR(servs.map(s => s.data).sort().pop()) : "—"}</div></div>
      </div>
      <div class="secao">
        <div class="secao__titulo">Histórico de serviços</div>
        ${listaServicos(servs, true)}
      </div>`;
  }

  function telaDespesas() {
    setTopo("Despesas");
    const int = intervalo("mes", ui.refDesp);
    const lista = S.despesas.filter(d => noIntervalo(d.data, int)).sort((a, b) => b.data.localeCompare(a.data));
    const noFuturo = intervalo("mes", moverPeriodo("mes", ui.refDesp, 1))[0] > hoje();
    const porCat = {};
    lista.forEach(d => (porCat[d.categoria || "Outros"] = (porCat[d.categoria || "Outros"] || 0) + Number(d.valor)));
    main().innerHTML = `
      <div class="card">
        <div class="periodo">
          <button class="seta" data-acao="mes-desp" data-dir="-1" aria-label="Mês anterior">‹</button>
          <div class="periodo__nome">${esc(nomePeriodo("mes", ui.refDesp))}</div>
          <button class="seta" data-acao="mes-desp" data-dir="1" aria-label="Próximo mês" ${noFuturo ? "disabled" : ""}>›</button>
        </div>
        <div class="resumo-linhas">
          ${Object.entries(porCat).sort((a, b) => b[1] - a[1]).map(([cat, v]) => `<div class="linha"><span>${esc(cat)}</span><span class="num">${dinheiro(v)}</span></div>`).join("")}
          <div class="linha linha--total"><span>Total do mês</span><strong class="num neg">${dinheiro(soma(lista, "valor"))}</strong></div>
        </div>
      </div>
      <button class="btn btn--escuro btn--full" data-acao="nova-despesa" style="margin-top:12px">+ Nova despesa</button>
      <div class="secao">
        ${lista.length ? `<div class="lista">${lista.map(d => `
          <button class="item" data-acao="editar-despesa" data-id="${d.id}">
            <div class="item__corpo">
              <div class="item__titulo">${esc(d.descricao)}</div>
              <div class="item__sub" style="white-space:normal">${dataBR(d.data)} · <span class="badge badge--cat">${esc(d.categoria || "Outros")}</span></div>
            </div>
            <div class="item__valor num neg">${dinheiro(d.valor)}</div>
          </button>`).join("")}</div>` : `<div class="lista"><div class="vazio">Nenhuma despesa neste mês.</div></div>`}
      </div>`;
  }

  const icBusca = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;
  function ligarBusca(sel, set, rerender) {
    const inp = $(sel);
    inp.addEventListener("input", () => {
      set(inp.value);
      const pos = inp.selectionStart;
      rerender();
      const novo = $(sel); novo.focus(); try { novo.setSelectionRange(pos, pos); } catch {}
    });
  }

  // ================= Bottom sheet =================
  function abrirSheet(titulo, html, aoMontar) {
    const sh = $("#sheet");
    sh.innerHTML = `<div class="sheet__puxador"></div>
      <div class="sheet__titulo"><span>${esc(titulo)}</span><button class="fechar" data-acao="fechar" aria-label="Fechar">✕</button></div>${html}`;
    sh.hidden = false; $("#sheetFundo").hidden = false;
    document.body.style.overflow = "hidden";
    aoMontar && aoMontar(sh);
  }
  function fecharSheet() {
    $("#sheet").hidden = true; $("#sheetFundo").hidden = true; $("#sheet").innerHTML = "";
    document.body.style.overflow = "";
  }

  async function comBotao(btn, fn) {
    btn.disabled = true;
    try { await fn(); } catch (e) { alert(erroAmigavel(e)); } finally { btn.disabled = false; }
  }

  const FORMAS = ["À vista", "Cartão", "Pix", "A prazo"];
  const FORMAS_PARCELA = ["Dinheiro", "Pix", "Cartão"];
  const radios = (nome, opcoes, sel, extra = "") => `<div class="segmento segmento--${opcoes.length}" ${extra}>${opcoes.map((o, i) =>
    `<input type="radio" name="${nome}" id="${nome}${i}" value="${o}" ${o === sel ? "checked" : ""}><label for="${nome}${i}">${o}</label>`).join("")}</div>`;
  const CATEGORIAS = ["Peças", "Aluguel", "Funcionários", "Contas (luz, água, internet)", "Ferramentas e equipamentos", "Impostos e taxas", "Combustível", "Outros"];

  function formServico(id, clientePre) {
    const s = id ? S.servicos.find(x => x.id === id) : null;
    let cliId = cliPorId(s?.cliente_id || clientePre)?.id || null;
    let cadastrar = false;
    const formaSel = FORMAS.includes(s?.forma_pagamento) ? s.forma_pagamento : "Pix";
    // Num serviço a prazo já salvo, os pagamentos seguintes entram pela tela do serviço
    const usaEntrada = !s || s.forma_pagamento !== "A prazo";
    abrirSheet(s ? "Editar serviço" : "Novo serviço", `
      <form class="form" id="fServ">
        <div>
          <div class="form-rot" style="margin-bottom:6px">Cliente <span class="muted" style="font-weight:500">(opcional)</span></div>
          <div class="cli-escolhido" id="cliEscolhido" hidden></div>
          <div id="cliBuscaBox">
            <input name="cli_busca" autocomplete="off" placeholder="Digite o nome ou a placa" value="${esc(s && !s.cliente_id ? s.cliente_nome || "" : "")}" />
            <div class="sugestoes" id="cliSug"></div>
            <p class="dica" id="cliDica">Pode deixar em branco ou só escrever o nome, sem cadastrar.</p>
          </div>
          <div class="grupo-novo" id="novoCli" hidden>
            <div class="linha"><strong>Novo cliente</strong><button type="button" class="pag__x" id="cancelaNovoCli">✕ não cadastrar</button></div>
            <label>Nome<input name="n_nome" autocomplete="off" /></label>
            <label>Telefone / WhatsApp<input name="n_telefone" type="tel" inputmode="tel" autocomplete="off" /></label>
          </div>
        </div>
        <div class="duas">
          <label>Veículo<input name="veiculo" value="${esc(s?.veiculo || "")}" placeholder="Ex.: Gol 1.6 2015" /></label>
          <label>Placa<input name="placa" value="${esc(s?.placa || "")}" style="text-transform:uppercase" /></label>
        </div>
        <div class="duas">
          <label>Data<input type="date" name="data" required value="${s?.data || hoje()}" /></label>
          <label>KM<input name="km" inputmode="numeric" value="${esc(s?.km || "")}" /></label>
        </div>
        <label>O que aconteceu com o carro<textarea name="problema" placeholder="Ex.: Barulho no freio, luz da injeção acesa…">${esc(s?.problema || "")}</textarea></label>
        <label>O que foi feito / arrumado<textarea name="descricao" required placeholder="Ex.: Troca das pastilhas e disco dianteiro">${esc(s?.descricao || "")}</textarea></label>
        <div class="duas">
          <label>Peças (R$)<input name="valor_pecas" inputmode="decimal" placeholder="0,00" value="${valorInput(s?.valor_pecas)}" /></label>
          <label>Mão de obra (R$)<input name="valor_mao_obra" inputmode="decimal" placeholder="0,00" value="${valorInput(s?.valor_mao_obra)}" /></label>
        </div>
        <div class="total-box"><span>Total do serviço</span><strong class="num" id="totalServ">R$ 0,00</strong></div>
        <div class="form-rot">Pagamento</div>
        ${radios("forma", FORMAS, formaSel)}
        <div class="grupo-novo" id="prazoBox" hidden>
          ${usaEntrada ? `
          <div class="duas">
            <label>Entrada (R$)<input name="entrada" inputmode="decimal" placeholder="0,00" /></label>
            <label>Entrada paga em<select name="entrada_forma">${FORMAS_PARCELA.map(x => `<option>${x}</option>`).join("")}</select></label>
          </div>
          <div class="linha"><span>Fica faltando</span><strong class="num alerta" id="faltaPrev">R$ 0,00</strong></div>` : `
          <div class="linha"><span>Já pago</span><strong class="num pos">${dinheiro(pagoDe(s))}</strong></div>
          <p class="muted" style="font-size:13px">Para lançar o que o cliente pagou depois, use <b>Registrar pagamento</b> na tela do serviço.</p>`}
        </div>
        <label>Observações<textarea name="observacoes" placeholder="Opcional">${esc(s?.observacoes || "")}</textarea></label>
        <div class="acoes-form">
          <button class="btn btn--primary btn--full" type="submit">${s ? "Salvar alterações" : "Salvar serviço"}</button>
          ${s ? `<button class="btn btn--perigo btn--full" type="button" id="excluirServ">Excluir serviço</button>` : ""}
        </div>
      </form>`, sh => {
      const f = $("#fServ", sh);
      const total = () => centavos(lerDinheiro(f.valor_pecas.value) + lerDinheiro(f.valor_mao_obra.value));
      const atualizaTotal = () => {
        $("#totalServ", sh).textContent = dinheiro(total());
        if (usaEntrada) $("#faltaPrev", sh).textContent = dinheiro(Math.max(0, total() - lerDinheiro(f.entrada.value)));
      };
      const trocaForma = () => ($("#prazoBox", sh).hidden = f.forma.value !== "A prazo");
      f.querySelectorAll("[name=forma]").forEach(r => r.addEventListener("change", trocaForma));
      if (usaEntrada) f.entrada.addEventListener("input", atualizaTotal);
      trocaForma();
      const desenhaCliente = () => {
        const c = cliPorId(cliId);
        $("#cliEscolhido", sh).hidden = !c;
        $("#cliBuscaBox", sh).hidden = !!c || cadastrar;
        $("#novoCli", sh).hidden = !cadastrar;
        f.n_nome.required = cadastrar;
        if (c) $("#cliEscolhido", sh).innerHTML = `
          <div class="avatar">${esc(iniciais(c.nome))}</div>
          <div class="item__corpo"><div class="item__titulo">${esc(c.nome)}</div><div class="item__sub">${esc([c.veiculo, c.placa].filter(Boolean).join(" · ") || c.telefone || "")}</div></div>
          <button type="button" class="btn btn--claro" data-cli="trocar" style="padding:8px 12px">Trocar</button>`;
        if (!c && !cadastrar) sugerir();
      };
      const sugerir = () => {
        const txt = f.cli_busca.value.trim(), q = norm(txt), qd = soDigitos(txt);
        const achados = !q ? [] : S.clientes
          .filter(c => norm([c.nome, c.placa].join(" ")).includes(q) || (qd.length >= 3 && soDigitos(c.telefone).includes(qd)))
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).slice(0, 5);
        const exato = achados.some(c => norm(c.nome) === q);
        $("#cliSug", sh).innerHTML = achados.map(c => `
          <button type="button" class="sugestao" data-cli="${c.id}">
            <strong>${esc(c.nome)}</strong><span>${esc([c.veiculo, c.placa].filter(Boolean).join(" · "))}</span>
          </button>`).join("") +
          (q && !exato ? `<button type="button" class="sugestao sugestao--novo" data-cli="novo">+ Cadastrar “${esc(txt)}” como cliente</button>` : "");
        $("#cliDica", sh).hidden = !!q;
      };
      sh.addEventListener("click", ev => {
        const b = ev.target.closest("[data-cli]");
        if (!b) return;
        const v = b.dataset.cli;
        if (v === "trocar") { cliId = null; f.cli_busca.value = ""; desenhaCliente(); f.cli_busca.focus(); return; }
        if (v === "novo") { cadastrar = true; f.n_nome.value = f.cli_busca.value.trim(); desenhaCliente(); f.n_telefone.focus(); return; }
        cliId = v;
        const c = cliPorId(v);
        if (c && !s) { f.veiculo.value = c.veiculo || ""; f.placa.value = c.placa || ""; }
        desenhaCliente();
      });
      $("#cancelaNovoCli", sh).addEventListener("click", () => { cadastrar = false; desenhaCliente(); });
      f.cli_busca.addEventListener("input", sugerir);
      f.valor_pecas.addEventListener("input", atualizaTotal);
      f.valor_mao_obra.addEventListener("input", atualizaTotal);
      atualizaTotal(); desenhaCliente();

      f.addEventListener("submit", ev => {
        ev.preventDefault();
        comBotao(f.querySelector("[type=submit]"), async () => {
          let clienteId = cliId;
          const placa = f.placa.value.trim().toUpperCase();
          if (!clienteId && cadastrar) {
            const novo = await salvar("clientes", null, {
              nome: f.n_nome.value.trim(), telefone: f.n_telefone.value.trim(),
              veiculo: f.veiculo.value.trim(), placa, observacoes: "",
            });
            clienteId = novo.id;
          }
          const vp = lerDinheiro(f.valor_pecas.value), vm = lerDinheiro(f.valor_mao_obra.value), vt = centavos(vp + vm);
          if (vt <= 0 && !confirm("O valor do serviço está zerado. Salvar mesmo assim?")) return;
          const forma = f.forma.value;
          let pagamentos;
          if (forma !== "A prazo") pagamentos = [{ data: f.data.value, valor: vt, forma }];
          else if (usaEntrada) {
            const entrada = lerDinheiro(f.entrada.value);
            if (entrada > vt) { alert("A entrada é maior que o total do serviço."); return; }
            pagamentos = entrada > 0 ? [{ data: f.data.value, valor: entrada, forma: "Entrada · " + f.entrada_forma.value }] : [];
          } else pagamentos = pagamentosDe(s);
          const salvo = await salvar("servicos", s?.id, {
            cliente_id: clienteId || null, cliente_nome: clienteId ? null : f.cli_busca.value.trim() || null, data: f.data.value, veiculo: f.veiculo.value.trim(), placa, km: f.km.value.trim(),
            problema: f.problema.value.trim(), descricao: f.descricao.value.trim(), valor_pecas: vp, valor_mao_obra: vm, valor_total: vt,
            forma_pagamento: forma, pagamentos, pago: soma(pagamentos, "valor") >= vt, observacoes: f.observacoes.value.trim(),
          });
          render(); verServico(salvo.id); toast(s ? "Serviço atualizado" : "Serviço salvo");
        });
      });
      const exc = $("#excluirServ", sh);
      exc && exc.addEventListener("click", () => {
        if (!confirm("Excluir este serviço? Não dá para desfazer.")) return;
        comBotao(exc, async () => { await apagar("servicos", s.id); fecharSheet(); render(); toast("Serviço excluído"); });
      });
    });
  }

  function verServico(id) {
    const s = S.servicos.find(x => x.id === id);
    if (!s) return fecharSheet();
    const c = cliPorId(s.cliente_id);
    const total = Number(s.valor_total) || 0, pago = pagoDe(s), falta = faltaDe(s);
    const aPrazo = s.forma_pagamento === "A prazo";
    const pags = pagamentosDe(s).map((p, i) => ({ ...p, i })).sort((a, b) => a.data.localeCompare(b.data));
    const carro = [s.veiculo, s.placa, s.km ? s.km + " km" : ""].filter(Boolean).join(" · ");
    abrirSheet("Serviço", `
      <div class="det">
        ${c ? `<a class="det__cli" href="#cliente/${c.id}">${esc(c.nome)} ›</a>` : `<div class="det__cli">${esc(nomeServ(s))}</div>`}
        <div class="muted" style="font-size:13px">${dataBR(s.data)}${carro ? " · " + esc(carro) : ""}</div>

        ${s.problema ? `<div class="det__bloco"><div class="det__rot">O que aconteceu</div><p>${esc(s.problema)}</p></div>` : ""}
        <div class="det__bloco"><div class="det__rot">O que foi feito</div><p>${esc(s.descricao)}</p></div>
        ${s.observacoes ? `<div class="det__bloco"><div class="det__rot">Observações</div><p>${esc(s.observacoes)}</p></div>` : ""}

        <div class="det__valores resumo-linhas">
          <div class="linha"><span>Peças</span><span class="num">${dinheiro(s.valor_pecas)}</span></div>
          <div class="linha"><span>Mão de obra</span><span class="num">${dinheiro(s.valor_mao_obra)}</span></div>
          <div class="linha linha--total"><span>Total</span><strong class="num">${dinheiro(total)}</strong></div>
        </div>

        <div class="pag">
          <div class="linha"><span>Pagamento</span><strong>${esc(s.forma_pagamento || "—")}</strong></div>
          ${aPrazo || falta ? `
            <div class="pag__barra"><span style="width:${total ? Math.min(100, (pago / total) * 100) : 100}%"></span></div>
            <div class="pag__nums">
              <div><span>Pago</span><strong class="num pos">${dinheiro(pago)}</strong></div>
              <div><span>Falta</span><strong class="num ${falta ? "alerta" : "pos"}">${dinheiro(falta)}</strong></div>
            </div>
            ${pags.length ? `<div class="pag__hist">${pags.map(p => `
              <div class="pag__item">
                <span>${dataBR(p.data).slice(0, 5)} · ${esc(p.forma || "")}</span>
                <span class="num">${dinheiro(p.valor)} <button class="pag__x" data-acao="remover-pag" data-id="${s.id}" data-i="${p.i}" aria-label="Remover pagamento">✕</button></span>
              </div>`).join("")}</div>` : `<p class="muted" style="font-size:13px;margin-top:8px">Nenhum pagamento ainda.</p>`}
          ` : ""}
          ${!falta ? `<div class="quitado">✓ Pago</div>` : ""}
        </div>

        ${falta ? `
          <button class="btn btn--primary btn--full" id="abrirReceber">Registrar pagamento</button>
          <form class="grupo-novo form" id="fReceber" hidden>
            <div class="duas">
              <label>Valor recebido<input name="valor" inputmode="decimal" value="${valorInput(falta)}" /></label>
              <label>Data<input type="date" name="data" value="${hoje()}" /></label>
            </div>
            ${radios("forma", FORMAS_PARCELA, "Dinheiro")}
            <div class="duas">
              <button class="btn btn--claro" type="button" id="cancelaReceber">Cancelar</button>
              <button class="btn btn--primary" type="submit">Confirmar</button>
            </div>
          </form>` : ""}
        ${c ? "" : `<button class="btn btn--claro btn--full" data-acao="cadastrar-do-servico" data-id="${s.id}">+ Cadastrar como cliente</button>`}
        <button class="btn btn--claro btn--full" data-acao="editar-servico" data-id="${s.id}">Editar serviço</button>
      </div>`, sh => {
      const f = $("#fReceber", sh);
      if (!f) return;
      const abrir = $("#abrirReceber", sh);
      abrir.addEventListener("click", () => { abrir.hidden = true; f.hidden = false; f.valor.focus(); f.valor.select(); });
      $("#cancelaReceber", sh).addEventListener("click", () => { abrir.hidden = false; f.hidden = true; });
      f.addEventListener("submit", ev => {
        ev.preventDefault();
        const valor = lerDinheiro(f.valor.value);
        if (valor <= 0) { alert("Informe o valor recebido."); return; }
        if (valor > falta + 0.001) { alert(`O valor é maior do que falta (${dinheiro(falta)}).`); return; }
        comBotao(f.querySelector("[type=submit]"), async () => {
          const pagamentos = [...pagamentosDe(s), { data: f.data.value || hoje(), valor, forma: f.forma.value }];
          await salvar("servicos", s.id, { pagamentos, pago: soma(pagamentos, "valor") >= total - 0.001 });
          render(); verServico(s.id);
          toast(valor >= falta - 0.001 ? "Pagamento registrado — serviço quitado!" : `Pagamento registrado. Falta ${dinheiro(falta - valor)}`);
        });
      });
    });
  }

  // Transforma um cliente avulso (só nome digitado) em cliente cadastrado
  function cadastrarDoServico(id) {
    const s = S.servicos.find(x => x.id === id);
    abrirSheet("Cadastrar cliente", `
      <form class="form" id="fCadServ">
        <label>Nome<input name="nome" required value="${esc(s.cliente_nome || "")}" /></label>
        <label>Telefone / WhatsApp<input name="telefone" type="tel" inputmode="tel" /></label>
        <div class="duas">
          <label>Veículo<input name="veiculo" value="${esc(s.veiculo || "")}" /></label>
          <label>Placa<input name="placa" value="${esc(s.placa || "")}" style="text-transform:uppercase" /></label>
        </div>
        <button class="btn btn--primary btn--full" type="submit">Cadastrar e ligar a este serviço</button>
      </form>`, sh => {
      const f = $("#fCadServ", sh);
      f.addEventListener("submit", ev => {
        ev.preventDefault();
        comBotao(f.querySelector("[type=submit]"), async () => {
          const c = await salvar("clientes", null, {
            nome: f.nome.value.trim(), telefone: f.telefone.value.trim(), veiculo: f.veiculo.value.trim(),
            placa: f.placa.value.trim().toUpperCase(), observacoes: "",
          });
          await salvar("servicos", s.id, { cliente_id: c.id, cliente_nome: null });
          render(); verServico(s.id); toast("Cliente cadastrado");
        });
      });
    });
  }

  async function removerPagamento(id, i) {
    const s = S.servicos.find(x => x.id === id);
    const p = pagamentosDe(s)[i];
    if (!p || !confirm(`Remover o pagamento de ${dinheiro(p.valor)} do dia ${dataBR(p.data)}?`)) return;
    try {
      const pagamentos = pagamentosDe(s).filter((_, j) => j !== i);
      await salvar("servicos", id, { pagamentos, pago: soma(pagamentos, "valor") >= (Number(s.valor_total) || 0) - 0.001 });
      render(); verServico(id); toast("Pagamento removido");
    } catch (e) { alert(erroAmigavel(e)); }
  }

  function formCliente(id) {
    const c = id ? cliPorId(id) : null;
    abrirSheet(c ? "Editar cliente" : "Novo cliente", `
      <form class="form" id="fCli">
        <label>Nome<input name="nome" required value="${esc(c?.nome || "")}" /></label>
        <label>Telefone / WhatsApp<input name="telefone" type="tel" inputmode="tel" value="${esc(c?.telefone || "")}" placeholder="(53) 99999-9999" /></label>
        <div class="duas">
          <label>Veículo<input name="veiculo" value="${esc(c?.veiculo || "")}" placeholder="Modelo e ano" /></label>
          <label>Placa<input name="placa" value="${esc(c?.placa || "")}" style="text-transform:uppercase" /></label>
        </div>
        <label>Observações<textarea name="observacoes" placeholder="Opcional">${esc(c?.observacoes || "")}</textarea></label>
        <div class="acoes-form">
          <button class="btn btn--primary btn--full" type="submit">Salvar</button>
          ${c ? `<button class="btn btn--perigo btn--full" type="button" id="excluirCli">Excluir cliente</button>` : ""}
        </div>
      </form>`, sh => {
      const f = $("#fCli", sh);
      f.addEventListener("submit", ev => {
        ev.preventDefault();
        comBotao(f.querySelector("[type=submit]"), async () => {
          const r = await salvar("clientes", c?.id, {
            nome: f.nome.value.trim(), telefone: f.telefone.value.trim(), veiculo: f.veiculo.value.trim(),
            placa: f.placa.value.trim().toUpperCase(), observacoes: f.observacoes.value.trim(),
          });
          fecharSheet(); toast("Cliente salvo");
          if (c) render(); else location.hash = "#cliente/" + r.id;
        });
      });
      const exc = $("#excluirCli", sh);
      exc && exc.addEventListener("click", () => {
        const n = S.servicos.filter(s => s.cliente_id === c.id).length;
        if (n) { alert(`Este cliente tem ${n} serviço(s) registrado(s). Exclua os serviços antes de excluir o cliente.`); return; }
        if (!confirm(`Excluir ${c.nome}?`)) return;
        comBotao(exc, async () => { await apagar("clientes", c.id); fecharSheet(); location.hash = "#clientes"; toast("Cliente excluído"); });
      });
    });
  }

  function formDespesa(id) {
    const d = id ? S.despesas.find(x => x.id === id) : null;
    abrirSheet(d ? "Editar despesa" : "Nova despesa", `
      <form class="form" id="fDesp">
        <label>Descrição<input name="descricao" required value="${esc(d?.descricao || "")}" placeholder="Ex.: Conta de luz" /></label>
        <div class="duas">
          <label>Valor (R$)<input name="valor" required inputmode="decimal" placeholder="0,00" value="${valorInput(d?.valor)}" /></label>
          <label>Data<input type="date" name="data" required value="${d?.data || hoje()}" /></label>
        </div>
        <label>Categoria<select name="categoria">${CATEGORIAS.map(c => `<option ${c === (d?.categoria || "Peças") ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <div class="acoes-form">
          <button class="btn btn--primary btn--full" type="submit">Salvar</button>
          ${d ? `<button class="btn btn--perigo btn--full" type="button" id="excluirDesp">Excluir despesa</button>` : ""}
        </div>
      </form>`, sh => {
      const f = $("#fDesp", sh);
      f.addEventListener("submit", ev => {
        ev.preventDefault();
        const valor = lerDinheiro(f.valor.value);
        if (valor <= 0) { alert("Informe o valor da despesa."); return; }
        comBotao(f.querySelector("[type=submit]"), async () => {
          await salvar("despesas", d?.id, { descricao: f.descricao.value.trim(), valor, data: f.data.value, categoria: f.categoria.value });
          ui.refDesp = parseYmd(f.data.value);
          fecharSheet(); render(); toast("Despesa salva");
        });
      });
      const exc = $("#excluirDesp", sh);
      exc && exc.addEventListener("click", () => {
        if (!confirm("Excluir esta despesa?")) return;
        comBotao(exc, async () => { await apagar("despesas", d.id); fecharSheet(); render(); toast("Despesa excluída"); });
      });
    });
  }

  function menu() {
    abrirSheet("Menu", `
      <div class="menu-lista">
        <button class="btn btn--claro btn--full" data-acao="exportar">Baixar planilha de serviços (CSV)</button>
        <button class="btn btn--claro btn--full" data-acao="exportar-desp">Baixar planilha de despesas (CSV)</button>
        <button class="btn btn--claro btn--full" data-acao="atualizar">Atualizar dados</button>
        ${DEMO ? `<button class="btn btn--perigo btn--full" data-acao="restaurar">Restaurar dados de exemplo</button>
        <p class="muted" style="text-align:center;font-size:12px;margin-top:6px">Demonstração · sistema feito pela RB Tech</p>` : `<button class="btn btn--perigo btn--full" data-acao="sair">Sair da conta</button>
        <p class="muted" style="text-align:center;font-size:12px;margin-top:6px">Conectado como ${esc(ui.usuario || "")}</p>`}
      </div>`);
  }

  function baixarCSV(nome, linhas) {
    const csv = "﻿" + linhas.map(l => l.map(v => `"${String(v ?? "").replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = nome; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const numBR = v => (Number(v) || 0).toFixed(2).replace(".", ",");

  // ================= Roteamento e eventos =================
  function render() {
    const h = location.hash.replace("#", "") || "inicio";
    const [rota, id] = h.split("/");
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("ativo", a.dataset.tab === (rota === "cliente" ? "clientes" : rota)));
    if (rota === "servicos") telaServicos();
    else if (rota === "clientes") telaClientes();
    else if (rota === "cliente") telaCliente(id);
    else if (rota === "despesas") telaDespesas();
    else telaInicio();
  }

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-acao]");
    if (!el) return;
    const a = el.dataset.acao;
    if (a === "fechar") fecharSheet();
    else if (a === "tile") { ui.periodo = el.dataset.tipo; ui.ref = new Date(); render(); }
    else if (a === "periodo") { ui.ref = moverPeriodo(ui.periodo, ui.ref, Number(el.dataset.dir)); render(); }
    else if (a === "mes-desp") { ui.refDesp = moverPeriodo("mes", ui.refDesp, Number(el.dataset.dir)); render(); }
    else if (a === "filtro-serv") { ui.filtroServ = el.dataset.f; render(); }
    else if (a === "ver-servico") verServico(el.dataset.id);
    else if (a === "editar-servico") formServico(el.dataset.id);
    else if (a === "cadastrar-do-servico") cadastrarDoServico(el.dataset.id);
    else if (a === "remover-pag") removerPagamento(el.dataset.id, Number(el.dataset.i));
    else if (a === "novo-servico") formServico(null, el.dataset.cliente);
    else if (a === "novo-cliente") formCliente();
    else if (a === "editar-cliente") formCliente(el.dataset.id);
    else if (a === "nova-despesa") formDespesa();
    else if (a === "editar-despesa") formDespesa(el.dataset.id);
    else if (a === "exportar") {
      baixarCSV(`servicos-${hoje()}.csv`, [["Data", "Cliente", "Telefone", "Veículo", "Placa", "KM", "O que aconteceu", "O que foi feito", "Peças", "Mão de obra", "Total", "Pagamento", "Pago", "Falta", "Pagamentos", "Observações"],
        ...[...S.servicos].sort((x, y) => x.data.localeCompare(y.data)).map(s => {
          const c = cliPorId(s.cliente_id) || {};
          return [dataBR(s.data), nomeServ(s), c.telefone, s.veiculo, s.placa, s.km, s.problema, s.descricao, numBR(s.valor_pecas), numBR(s.valor_mao_obra), numBR(s.valor_total), s.forma_pagamento,
            numBR(pagoDe(s)), numBR(faltaDe(s)), pagamentosDe(s).map(p => `${dataBR(p.data)} ${p.forma} ${numBR(p.valor)}`).join(" | "), s.observacoes];
        })]);
    } else if (a === "exportar-desp") {
      baixarCSV(`despesas-${hoje()}.csv`, [["Data", "Descrição", "Categoria", "Valor"],
        ...[...S.despesas].sort((x, y) => x.data.localeCompare(y.data)).map(d => [dataBR(d.data), d.descricao, d.categoria, numBR(d.valor)])]);
    } else if (a === "atualizar") {
      fecharSheet();
      carregarTudo().then(() => { render(); toast("Dados atualizados"); }).catch(err => alert(erroAmigavel(err)));
    } else if (a === "restaurar") {
      if (!confirm("Apagar o que você lançou e voltar aos dados de exemplo?")) return;
      ["semeado", ...TABELAS].forEach(t => localStorage.removeItem("oficina_" + t));
      location.reload();
    } else if (a === "sair") {
      if (!confirm("Sair da conta neste aparelho?")) return;
      banco.sair().then(() => location.reload());
    }
  });

  $("#sheetFundo").addEventListener("click", fecharSheet);
  document.addEventListener("keydown", e => { if (e.key === "Escape") fecharSheet(); });
  $("#fab").addEventListener("click", () => {
    if (location.hash === "#despesas") return formDespesa();
    formServico(null, location.hash.startsWith("#cliente/") ? location.hash.split("/")[1] : "");
  });
  $("#menuBtn").addEventListener("click", menu);
  window.addEventListener("hashchange", () => { fecharSheet(); render(); window.scrollTo(0, 0); });

  // Recarrega ao voltar para o app (o outro dono pode ter lançado algo)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !DEMO && ui.usuario && $("#sheet").hidden) carregarTudo().then(render).catch(() => {});
  });

  // ================= Início =================
  async function entrarNoApp() {
    $("#login").hidden = true;
    $("#carregando").hidden = false;
    try {
      if (DEMO) semearDemo();
      await carregarTudo();
      $("#app").hidden = false;
      $("#faixaDemo").hidden = !DEMO;
      render();
    } catch (e) {
      alert(erroAmigavel(e));
      $("#login").hidden = false;
    } finally {
      $("#carregando").hidden = true;
    }
  }

  async function iniciar() {
    if (!DEMO) document.title = CFG.nomeOficina || document.title;
    $("#demoLogin").hidden = !DEMO;
    ui.usuario = await banco.usuario().catch(() => null);
    if (DEMO && !ui.usuario) { await banco.entrar("demonstracao"); ui.usuario = "demonstracao"; }
    if (ui.usuario) return entrarNoApp();
    $("#carregando").hidden = true;
    $("#login").hidden = false;
    $("#loginForm").addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.target, btn = f.querySelector("button");
      $("#loginErro").hidden = true; btn.disabled = true; btn.textContent = "Entrando…";
      try {
        await banco.entrar(f.email.value.trim(), f.senha.value);
        ui.usuario = await banco.usuario();
        await entrarNoApp();
      } catch (err) {
        $("#loginErro").textContent = erroAmigavel(err); $("#loginErro").hidden = false;
      } finally { btn.disabled = false; btn.textContent = "Entrar"; }
    });
  }
  iniciar();
})();
