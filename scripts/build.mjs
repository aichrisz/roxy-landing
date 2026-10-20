import { mkdir, copyFile, lstat, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { projectRoot, publicFiles, publicPath } from "./public-files.mjs";
// Validate all inputs before replacing only this project's output directory.
const sources = await Promise.all(
  publicFiles.map((file) => publicPath(projectRoot, file)),
);
const out = resolve(projectRoot, "dist");
try {
  if ((await lstat(out)).isSymbolicLink())
    throw new Error("Refusing dist symlink");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await rm(out, { recursive: true, force: true });
let bytes = 0;
for (const [i, file] of publicFiles.entries()) {
  await mkdir(dirname(resolve(out, file)), { recursive: true });
  await copyFile(sources[i], resolve(out, file));
  bytes += (await stat(sources[i])).size;
}
console.log(
  `Built ${publicFiles.length} static files: ${bytes} bytes (uncompressed).`,
);
if (bytes >= 250000) throw new Error("Payload exceeds 250KB goal");
