// Resuelve "@/x" y las importaciones relativas sin extensión a .ts para correr los módulos del
// proyecto con Node (que quita los tipos de TypeScript por sí solo).
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function tryFile(base) {
  for (const ext of [".ts", "/index.ts", ""]) {
    const file = base + ext;
    if (existsSync(file) && /\.[cm]?[jt]s$/.test(file)) return file;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    const file = tryFile(path.join(SRC, specifier.slice(2)));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:") && context.parentURL.includes("/src/")) {
    const file = tryFile(path.join(path.dirname(fileURLToPath(context.parentURL)), specifier));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return next(specifier, context);
}
