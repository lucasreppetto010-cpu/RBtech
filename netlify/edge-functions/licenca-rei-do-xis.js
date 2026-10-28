// Licença RB Tech: antes de entregar qualquer arquivo do app, o servidor do Netlify
// pergunta ao Supabase do cliente se a licença está ativa. Suspensa (pelo Alfred),
// nada do cardápio nem do painel da loja é enviado, só a página de "fora do ar". Reativou, volta na hora.

const SUPABASE = "https://vumenohrsvnsjhycdlex.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1bWVub2hyc3Zuc2poeWNkbGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzA1NTYsImV4cCI6MjEwODcwNjU1Nn0.g7uScmq2jGTz-Q5-2n7K1eupkDpgXEZ-LXKIuR4Q_gQ";
const NOME = "Rei do Xis";
const GUARDA_MS = 15000;   // consulta o Supabase no máximo a cada 15 s por servidor

let ultima = { quando: 0, estado: "ativo" };

async function estadoLicenca() {
  if (Date.now() - ultima.quando < GUARDA_MS) return ultima.estado;
  let estado;
  try {
    const r = await fetch(`${SUPABASE}/rest/v1/rbtech_licenca?select=ativo&id=eq.1`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      signal: AbortSignal.timeout(3000),
    });
    const linhas = r.ok ? await r.json() : null;
    // sem resposta do Supabase o site fica no ar (o cliente que paga nunca é bloqueado por engano)
    estado = !linhas ? "sem-resposta" : linhas.length && linhas[0].ativo === false ? "suspenso" : "ativo";
  } catch (e) {
    estado = "sem-resposta";
  }
  ultima = { quando: Date.now(), estado };
  return estado;
}

export default async (request, context) => {
  const estado = await estadoLicenca();
  if (estado !== "suspenso") {
    const resposta = await context.next();
    resposta.headers.set("x-rbtech-licenca", estado);
    return resposta;
  }
  return new Response(paginaSuspensa(), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-rbtech-licenca": "suspenso",
      "x-robots-tag": "noindex",
    },
  });
};

export const config = { path: ["/rei-do-xis", "/rei-do-xis/*"] };

function paginaSuspensa() {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${NOME} · fora do ar</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#0b0d12; color:#e8eaf0;
         font:16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding:24px; box-sizing:border-box; }
  main { max-width:420px; text-align:center; }
  h1 { font-size:22px; margin:0 0 10px; }
  p { color:#a3a9b8; margin:0 0 22px; }
  a { display:inline-block; background:#1f6bff; color:#fff; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:600; }
  small { display:block; margin-top:28px; color:#5d6475; font-size:12px; }
  a.mini { display:inline; background:none; padding:0; color:#8fb3ff; font-weight:500; }
</style></head>
<body><main>
  <h1>Cardápio temporariamente indisponível</h1>
  <p>O cardápio on-line do ${NOME} está fora do ar no momento.</p>
  <small>Responsável pelo site? <a class="mini" href="https://wa.me/5555996822565">Fale com a RB Tech</a></small>
</main></body></html>`;
}
