// Servidor intermediário do Estúdio de Anúncios.
// Use só se o navegador bloquear a chamada direta à Speko (erro de CORS).
// No Railway: crie um serviço Node com este arquivo, defina SPEKO_API_KEY nas variáveis
// e rode `node speko-proxy.js`. No app, coloque a URL do serviço em "Endereço da API"
// e qualquer texto no campo da chave (a chave real fica no servidor).
// Confira o endereço e o formato da API na documentação atual da Speko antes de usar.
const http = require("http");
const SPEKO = process.env.SPEKO_BASE_URL || "https://api.speko.dev";
const KEY = process.env.SPEKO_API_KEY;
const ORIGEM = process.env.ALLOW_ORIGIN || "https://jjsilvamape2014-ui.github.io";
http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGEM);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (req.method !== "POST" || req.url !== "/v1/synthesize") { res.writeHead(404); return res.end("Rota não encontrada"); }
  let body = ""; for await (const c of req) body += c;
  try {
    const r = await fetch(SPEKO + "/v1/synthesize", {
      method: "POST",
      headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body,
    });
    res.writeHead(r.status, { "Content-Type": r.headers.get("content-type") || "application/octet-stream" });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.writeHead(502); res.end("Falha ao falar com a Speko: " + e.message);
  }
}).listen(process.env.PORT || 3000);
