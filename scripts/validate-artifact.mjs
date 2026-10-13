import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const hosting = JSON.parse(await readFile(".openai/hosting.json", "utf8"));
const feed = JSON.parse(await readFile("dist/roles.json", "utf8"));

if (hosting.static) throw new Error("static hosting must not be present for the worker build");
if (!hosting.r2 || !Object.hasOwn(hosting.r2, "BUCKET")) throw new Error("R2 binding is missing");
if (!hosting.capabilities?.includes("mcp")) throw new Error("MCP capability is missing");
if (!Array.isArray(feed.roles) || feed.roles.length === 0) throw new Error("feed is empty");
if (feed.roles.some(role => /dreamworkhq\.com/i.test(role.url))) throw new Error("Dreamwork URL remains in feed");

await execFileAsync(process.execPath, ["--check", "dist/server/index.js"]);
console.log(`Validated worker artifact with ${feed.roles.length} roles.`);
