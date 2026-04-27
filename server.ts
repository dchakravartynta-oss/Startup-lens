import express from "express";
import { createServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

console.log("Server starting...");
console.log("Environment check - GEMINI_API_KEY defined:", !!process.env.GEMINI_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Request Logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  const apiRouter = express.Router();
  
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const debugLogs: string[] = [];
  apiRouter.use((req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
    debugLogs.push(log);
    if (debugLogs.length > 50) debugLogs.shift();
    console.log(log);
    next();
  });

  apiRouter.get("/debug-logs", (req, res) => {
    res.json(debugLogs);
  });

  apiRouter.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact form Submission:", { name, email, message });
    res.json({ 
      success: true, 
      message: "Thank you for reaching out. Our team will get back to you shortly." 
    });
  });

  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createServer({
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("FATAL: Server failed to start", err);
});
