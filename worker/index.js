const PAGE = __PAGE_JSON__;
const DEFAULT_FEED = __DEFAULT_FEED_JSON__;
const MANIFEST = __MANIFEST_JSON__;

const ROLE_KEY = "roles.json";
const MAX_FEED_BYTES = 512 * 1024;
const MCP_VERSION = "2026-07-28";
const REQUIRED_FIELDS = [
  "id",
  "company",
  "title",
  "city",
  "mode",
  "category",
  "level",
  "fit",
  "fitLabel",
  "salary",
  "posted",
  "why",
  "url"
];

const TEXT_LIMITS = {
  id: 120,
  company: 120,
  title: 240,
  city: 120,
  mode: 80,
  category: 40,
  level: 80,
  fit: 40,
  fitLabel: 80,
  salary: 120,
  posted: 80,
  why: 420
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function textResponse(body, status = 200, contentType = "text/plain; charset=utf-8") {
  return new Response(body, {
    status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store"
    }
  });
}

function rpcResult(id, result) {
  return jsonResponse({ jsonrpc: "2.0", id, result });
}

function rpcError(id, code, message) {
  return jsonResponse({ jsonrpc: "2.0", id, error: { code, message } }, 400);
}

function toolFailure(message) {
  return {
    content: [{ type: "text", text: message }],
    isError: true
  };
}

function cleanText(value, field) {
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  const text = value.trim();
  const limit = TEXT_LIMITS[field] || 500;
  if (!text || text.length > limit) throw new Error(`${field} is empty or too long`);
  if (/[<>]/.test(text)) throw new Error(`${field} contains unsupported markup`);
  return text;
}

function cleanUrl(value) {
  if (typeof value !== "string" || value.length > 2000 || /[<>"'`]/.test(value)) {
    throw new Error("url must be a valid direct HTTPS URL");
  }
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("url must use HTTPS");
  if (url.hostname === "dreamworkhq.com" || url.hostname.endsWith(".dreamworkhq.com")) {
    throw new Error("url must point directly to the employer or ATS listing");
  }
  return url.toString();
}

function normalizeFeed(input) {
  const source = Array.isArray(input) ? { roles: input } : input;
  if (!source || !Array.isArray(source.roles)) throw new Error("feed.roles must be an array");
  if (source.roles.length > 200) throw new Error("feed.roles cannot contain more than 200 roles");

  const ids = new Set();
  const roles = source.roles.map((role, index) => {
    if (!role || typeof role !== "object") throw new Error(`role ${index + 1} is invalid`);
    const normalized = {};
    for (const field of REQUIRED_FIELDS) {
      normalized[field] = field === "url" ? cleanUrl(role[field]) : cleanText(role[field], field);
    }
    if (ids.has(normalized.id)) throw new Error(`duplicate role id: ${normalized.id}`);
    ids.add(normalized.id);
    if (!["design", "pm", "architecture"].includes(normalized.category)) {
      throw new Error(`unsupported category for ${normalized.id}`);
    }
    if (!["strong", "good", "reach", "stretch"].includes(normalized.fit)) {
      throw new Error(`unsupported fit for ${normalized.id}`);
    }
    return normalized;
  });

  const updated = typeof source.updated === "string" && source.updated.trim()
    ? cleanText(source.updated, "updated")
    : new Date().toISOString().slice(0, 10);
  return { updated, roles };
}

async function loadFeed(env) {
  if (!env.BUCKET) return normalizeFeed(DEFAULT_FEED);
  const object = await env.BUCKET.get(ROLE_KEY);
  if (!object) return normalizeFeed(DEFAULT_FEED);
  if (object.size > MAX_FEED_BYTES) throw new Error("stored feed is too large");
  return normalizeFeed(JSON.parse(await object.text()));
}

function rolesJson(feed) {
  return JSON.stringify(feed);
}

async function saveFeed(env, feed) {
  if (!env.BUCKET) throw new Error("persistent feed storage is not configured");
  const body = rolesJson(feed);
  await env.BUCKET.put(ROLE_KEY, body, {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "no-store"
    }
  });
  return feed;
}

function toolDefinitions() {
  return [
    {
      name: "get_roles",
      description: "Read the current Signal Job Radar feed.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }
    },
    {
      name: "update_roles",
      description: "Replace the Signal Job Radar feed with validated roles. Use direct employer or ATS URLs, never Dreamwork listing URLs.",
      inputSchema: {
        type: "object",
        properties: {
          feed: {
            type: "object",
            description: "A feed object with an updated label and a roles array.",
            properties: {
              updated: { type: "string" },
              roles: { type: "array", items: { type: "object" } }
            },
            required: ["roles"],
            additionalProperties: true
          }
        },
        required: ["feed"],
        additionalProperties: false
      }
    }
  ];
}

async function handleMcp(request, env) {
  if (request.method !== "POST") return textResponse("Method Not Allowed", 405);
  if (!request.headers.get("oai-authenticated-user-id")) {
    return jsonResponse({ error: "MCP authentication required" }, 401);
  }

  const raw = await request.text();
  if (raw.length > MAX_FEED_BYTES * 2) return jsonResponse({ error: "Request too large" }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return rpcError(null, -32700, "Invalid JSON");
  }

  const id = body.id ?? null;
  if (body.method === "server/discover") {
    return rpcResult(id, {
      supportedVersions: [MCP_VERSION],
      capabilities: { tools: {} }
    });
  }
  if (body.method === "tools/list") {
    return rpcResult(id, { tools: toolDefinitions() });
  }
  if (body.method !== "tools/call") return rpcError(id, -32601, "Method not found");

  const name = body.params?.name;
  try {
    if (name === "get_roles") {
      const feed = await loadFeed(env);
      return rpcResult(id, {
        content: [{ type: "text", text: JSON.stringify(feed) }],
        structuredContent: feed
      });
    }
    if (name === "update_roles") {
      const feed = normalizeFeed(body.params?.arguments?.feed);
      const saved = await saveFeed(env, feed);
      return rpcResult(id, {
        content: [{ type: "text", text: `Updated ${saved.roles.length} roles.` }],
        structuredContent: saved
      });
    }
    return rpcResult(id, toolFailure(`Unknown tool: ${name || "(missing name)"}`));
  } catch (error) {
    return rpcResult(id, toolFailure(error instanceof Error ? error.message : "Tool failed"));
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/mcp") return handleMcp(request, env);
  if (request.method !== "GET") return textResponse("Method Not Allowed", 405);

  if (url.pathname === "/roles.json") {
    const feed = await loadFeed(env);
    return textResponse(rolesJson(feed), 200, "application/json; charset=utf-8");
  }
  if (url.pathname === "/manifest.json") {
    return textResponse(JSON.stringify(MANIFEST), 200, "application/manifest+json; charset=utf-8");
  }
  if (url.pathname !== "/" && url.pathname !== "/index.html") return textResponse("Not Found", 404);

  const feed = await loadFeed(env);
  const rendered = PAGE.replace("const roles = __ROLE_DATA__;", `const roles = ${rolesJson(feed)};`);
  if (rendered === PAGE) throw new Error("dashboard role injection marker is missing");
  return textResponse(rendered, 200, "text/html; charset=utf-8");
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error(error);
      return textResponse("Signal Job Radar is temporarily unavailable.", 500);
    }
  }
};
