import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 240;

const here = dirname(fileURLToPath(import.meta.url));
const pitch = readFileSync(join(here, "entry.txt"), "utf8");

const chars = [...pitch].length;
if (chars < 1 || chars > MAX_CHARS) {
  throw new Error(`entry.txt must be 1-${MAX_CHARS} characters, got ${chars}`);
}
if (pitch.trim().length === 0) {
  throw new Error("entry.txt must not be only whitespace");
}
if (pitch.includes("\n") || pitch.includes("\r")) {
  throw new Error("entry.txt must be a single line");
}
if (/[.!?]\s+[A-Z]/.test(pitch)) {
  throw new Error("entry.txt must be exactly one sentence");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, pitch, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== pitch) {
  throw new Error("read-back mismatch: output differs from entry.txt");
}

console.log(`wrote ${chars} characters to ${outPath}`);
