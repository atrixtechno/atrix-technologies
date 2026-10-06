// Corre módulos TypeScript/TSX del proyecto con Node (para scripts locales, no para el sitio):
// resuelve "@/x" y las rutas sin extensión, y transpila .ts/.tsx con el TypeScript del proyecto.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function tryFile(base) {
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    const file = base + ext;
    if (existsSync(file) && /\.(ts|tsx|js|mjs)$/.test(file)) return file;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  // Fuera de Next, "next/og" es la versión de Node de @vercel/og (la misma que usa el sitio).
  if (specifier === "next/og") return next("next/dist/compiled/@vercel/og/index.node.js", context);
  if (specifier.startsWith("@/")) {
    const file = tryFile(path.join(SRC, specifier.slice(2)));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.includes("/src/")) {
    const file = tryFile(path.join(path.dirname(fileURLToPath(context.parentURL)), specifier));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (/\.(ts|tsx)$/.test(url) && url.includes("/src/")) {
    const source = readFileSync(fileURLToPath(url), "utf8");
    const { outputText } = ts.transpileModule(source, {
      fileName: fileURLToPath(url),
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, verbatimModuleSyntax: false },
    });
    return { format: "module", source: outputText, shortCircuit: true };
  }
  return next(url, context);
}
