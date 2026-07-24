var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var imageCache = /* @__PURE__ */ new Map();
async function resolveSynologyImage(url) {
  try {
    const cleanUrl = url.trim();
    let nasBaseUrl = "";
    let sharingId = "";
    if (cleanUrl.includes("gofile.me/")) {
      const urlObj = new URL(cleanUrl);
      const parts = urlObj.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return null;
      const serverID = parts[0];
      sharingId = parts[1];
      const servRes = await fetch("https://global.quickconnect.to/Serv.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify([
          {
            version: 1,
            command: "request_tunnel",
            stop_when_error: false,
            stop_when_success: true,
            id: "file_sharing_https",
            serverID,
            is_gofile: true,
            path: "/" + serverID + "/" + sharingId
          }
        ])
      }).then((r) => r.json());
      if (!servRes || !servRes[0] || servRes[0].errno !== 0) return null;
      const host = servRes[0].smartdns?.host || servRes[0].service?.relay_dn || servRes[0].server?.ddns;
      if (!host) return null;
      nasBaseUrl = "https://" + host + ":5001/sharing/";
    } else if (cleanUrl.includes("/sharing/")) {
      const parts = cleanUrl.split("/sharing/");
      const origin = parts[0];
      sharingId = parts[1].split("?")[0].split("#")[0];
      nasBaseUrl = origin + "/sharing/";
    } else {
      return null;
    }
    const loginUrl = nasBaseUrl + "webapi/entry.cgi?api=SYNO.Core.Sharing.Login&version=1&method=login&sharing_id=" + encodeURIComponent(JSON.stringify(sharingId));
    const loginData = await fetch(loginUrl).then((r) => r.json());
    if (!loginData.success || !loginData.data?.sharing_sid) return null;
    const sid = loginData.data.sharing_sid;
    const sessionUrl = nasBaseUrl + "webapi/entry.cgi?api=SYNO.Core.Sharing.Session&version=1&method=get&sharing_id=" + encodeURIComponent(JSON.stringify(sharingId));
    const sessionText = await fetch(sessionUrl).then((r) => r.text());
    let filename = "";
    const fnMatch = sessionText.match(/\"filename\"\s*:\s*\"([^\"]+)\"/);
    if (fnMatch) filename = fnMatch[1];
    const thumbUrl = nasBaseUrl + "webapi/entry.cgi?api=SYNO.FolderSharing.Thumb&version=2&method=get&size=large&path=" + encodeURIComponent(JSON.stringify("/" + filename));
    const imgRes = await fetch(thumbUrl, {
      headers: {
        Cookie: "sharing_sid=" + sid,
        "X-SYNO-SHARING": sharingId
      }
    });
    if (imgRes.ok && imgRes.headers.get("content-type")?.startsWith("image/")) {
      const buffer = await imgRes.arrayBuffer();
      return {
        contentType: imgRes.headers.get("content-type") || "image/jpeg",
        buffer: Buffer.from(buffer)
      };
    }
  } catch (e) {
    console.error("Synology proxy resolution error:", e?.message || e);
  }
  return null;
}
async function startServer() {
  const app = (0, import_express.default)();
  const rawPort = process.env.PORT || process.env.APP_PORT || process.env.SERVER_PORT || "3000";
  const PORT = parseInt(rawPort, 10);
  const distPath = import_path.default.join(process.cwd(), "dist");
  const hasDist = import_fs.default.existsSync(import_path.default.join(distPath, "index.html"));
  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV !== "development" && hasDist;
  app.get("/api/synology-proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).send("Missing url parameter");
    }
    const cached = imageCache.get(targetUrl);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("Content-Type", cached.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(cached.buffer);
    }
    const resolved = await resolveSynologyImage(targetUrl);
    if (resolved) {
      imageCache.set(targetUrl, {
        contentType: resolved.contentType,
        buffer: resolved.buffer,
        expiresAt: Date.now() + 10 * 60 * 1e3
      });
      res.setHeader("Content-Type", resolved.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(resolved.buffer);
    }
    try {
      const directRes = await fetch(targetUrl);
      if (directRes.ok && directRes.headers.get("content-type")?.startsWith("image/")) {
        const arrayBuf = await directRes.arrayBuffer();
        res.setHeader("Content-Type", directRes.headers.get("content-type") || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(Buffer.from(arrayBuf));
      }
    } catch {
    }
    return res.redirect(targetUrl);
  });
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath2 = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath2));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath2, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (mode: ${isProduction ? "production" : "development"})`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
