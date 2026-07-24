import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Cache resolved image buffers in memory (10 minutes TTL)
const imageCache = new Map<string, { contentType: string; buffer: Buffer; expiresAt: number }>();

async function resolveSynologyImage(url: string): Promise<{ contentType: string; buffer: Buffer } | null> {
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
            serverID: serverID,
            is_gofile: true,
            path: "/" + serverID + "/" + sharingId,
          },
        ]),
      }).then((r) => r.json());

      if (!servRes || !servRes[0] || servRes[0].errno !== 0) return null;

      const host =
        servRes[0].smartdns?.host ||
        servRes[0].service?.relay_dn ||
        servRes[0].server?.ddns;
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

    // 1. Login to get sharing_sid
    const loginUrl =
      nasBaseUrl +
      "webapi/entry.cgi?api=SYNO.Core.Sharing.Login&version=1&method=login&sharing_id=" +
      encodeURIComponent(JSON.stringify(sharingId));
    const loginData = await fetch(loginUrl).then((r) => r.json());
    if (!loginData.success || !loginData.data?.sharing_sid) return null;

    const sid = loginData.data.sharing_sid;

    // 2. Get Session to find filename
    const sessionUrl =
      nasBaseUrl +
      "webapi/entry.cgi?api=SYNO.Core.Sharing.Session&version=1&method=get&sharing_id=" +
      encodeURIComponent(JSON.stringify(sharingId));
    const sessionText = await fetch(sessionUrl).then((r) => r.text());

    let filename = "";
    const fnMatch = sessionText.match(/\"filename\"\s*:\s*\"([^\"]+)\"/);
    if (fnMatch) filename = fnMatch[1];

    // 3. Fetch image thumbnail payload
    const thumbUrl =
      nasBaseUrl +
      "webapi/entry.cgi?api=SYNO.FolderSharing.Thumb&version=2&method=get&size=large&path=" +
      encodeURIComponent(JSON.stringify("/" + filename));
    const imgRes = await fetch(thumbUrl, {
      headers: {
        Cookie: "sharing_sid=" + sid,
        "X-SYNO-SHARING": sharingId,
      },
    });

    if (imgRes.ok && imgRes.headers.get("content-type")?.startsWith("image/")) {
      const buffer = await imgRes.arrayBuffer();
      return {
        contentType: imgRes.headers.get("content-type") || "image/jpeg",
        buffer: Buffer.from(buffer),
      };
    }
  } catch (e: any) {
    console.error("Synology proxy resolution error:", e?.message || e);
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Synology NAS Share Link Proxy API Route
  app.get("/api/synology-proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("Missing url parameter");
    }

    // 1. Check in-memory cache
    const cached = imageCache.get(targetUrl);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("Content-Type", cached.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(cached.buffer);
    }

    // 2. Resolve via Synology API
    const resolved = await resolveSynologyImage(targetUrl);
    if (resolved) {
      imageCache.set(targetUrl, {
        contentType: resolved.contentType,
        buffer: resolved.buffer,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      res.setHeader("Content-Type", resolved.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(resolved.buffer);
    }

    // 3. Fallback: try direct fetch
    try {
      const directRes = await fetch(targetUrl);
      if (directRes.ok && directRes.headers.get("content-type")?.startsWith("image/")) {
        const arrayBuf = await directRes.arrayBuffer();
        res.setHeader("Content-Type", directRes.headers.get("content-type") || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(Buffer.from(arrayBuf));
      }
    } catch {
      // Ignore
    }

    // 4. Redirect if resolution failed
    return res.redirect(targetUrl);
  });

  // Serve static files in production or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
