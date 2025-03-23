import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible paths for the static files
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(__dirname, "..", "public"),
    path.resolve(__dirname, "public"),
  ];

  // Find the first path that exists
  let distPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      log(`Found build directory at: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Make sure to build the client first.`
    );
  }

  // Serve static files
  log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // Serve index.html for client-side routing
  const indexHtmlPath = path.resolve(process.cwd(), "dist", "index.html");
  const fallbackIndexHtml = fs.existsSync(indexHtmlPath) 
    ? indexHtmlPath 
    : path.resolve(distPath, "index.html");
  
  log(`Using index.html at: ${fallbackIndexHtml}`);
  
  // Fall through to index.html for client-side routing
  app.use("*", (_req, res) => {
    if (fs.existsSync(fallbackIndexHtml)) {
      res.sendFile(fallbackIndexHtml);
    } else {
      res.status(404).send("Not found - Unable to locate index.html");
    }
  });
}
