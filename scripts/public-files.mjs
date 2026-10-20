import { lstat, realpath } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
export const projectRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const publicFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "assets/current.svg",
  "assets/roxy-official.png",
];
export async function publicPath(root, name) {
  if (!publicFiles.includes(name)) throw new Error("Not public");
  const rootInfo = await lstat(root);
  if (rootInfo.isSymbolicLink() || !rootInfo.isDirectory())
    throw new Error("Invalid root");
  const canonicalRoot = await realpath(root);
  let candidate = root;
  for (const segment of name.split("/")) {
    candidate = resolve(candidate, segment);
    if ((await lstat(candidate)).isSymbolicLink())
      throw new Error("Symlink denied");
  }
  const canonical = await realpath(candidate);
  if (
    !canonical.startsWith(canonicalRoot + sep) ||
    !(await lstat(candidate)).isFile()
  )
    throw new Error("Outside public root");
  return canonical;
}
