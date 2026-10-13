import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteDir = path.join(root, "site");
const distDir = path.join(root, "dist");
const serverDir = path.join(distDir, "server");

const [page, feed, manifest, worker] = await Promise.all([
  readFile(path.join(siteDir, "index.html"), "utf8"),
  readFile(path.join(siteDir, "roles.json"), "utf8"),
  readFile(path.join(siteDir, "manifest.json"), "utf8"),
  readFile(path.join(root, "worker", "index.js"), "utf8")
]);

if (!page.includes("const roles = __ROLE_DATA__;")) {
  throw new Error("site/index.html is missing the role data injection marker");
}

JSON.parse(feed);
JSON.parse(manifest);

await mkdir(serverDir, { recursive: true });
const generated = worker
  .replace("__PAGE_JSON__", JSON.stringify(page))
  .replace("__DEFAULT_FEED_JSON__", feed.trim())
  .replace("__MANIFEST_JSON__", manifest.trim());

await writeFile(path.join(serverDir, "index.js"), generated);
await writeFile(path.join(distDir, "manifest.json"), manifest);
await writeFile(path.join(distDir, "roles.json"), feed);
