import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { projectRoot, publicPath } from "./public-files.mjs";
const root = process.env.SERVE_DIST
  ? resolve(projectRoot, "dist")
  : projectRoot;
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
http
  .createServer(async (req, res) => {
    if (req.url === "/health") {
      res.writeHead(200);
      res.end("ok");
      return;
    }
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      ).replace(/^\/roxy-landing(?=\/)/, "");
      const name = pathname === "/" ? "index.html" : pathname.slice(1);
      const file = await publicPath(root, name);
      const content = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
      });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(4173, "127.0.0.1");
