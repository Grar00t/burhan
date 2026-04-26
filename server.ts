import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);

  // Initialize WebSocket server on the same HTTP server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/ws",
    verifyClient: (info, callback) => {
      // Sovereign Auth Verification
      const protocol = info.req.headers['sec-websocket-protocol'];
      const clientIp = info.req.socket.remoteAddress;
      
      console.log(`[NIYAH AUTH] Inbound connection attempt from ${clientIp}`);
      
      if (process.env.NODE_ENV === 'production') {
        if (!protocol || protocol !== 'niyah-sovereign-v1') {
          console.warn(`[NIYAH AUTH] Rejected unauthorized connection from ${clientIp}`);
          callback(false, 401, 'Unauthorized Sovereign Link');
          return;
        }
      }
      callback(true);
    }
  });

  wss.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[NIYAH WS] Sovereign Link Established: ${clientIp}`);
    
    // Send initial welcome
    ws.send(JSON.stringify({
      type: 'SYSTEM_MESSAGE',
      message: 'NIYAH Sovereign Uplink Established. Node 001-HAVEN active.',
      timestamp: new Date().toISOString()
    }));

    // Periodic heartbeats
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        const heartbeats = [
          "Scanning Black Hole Network: AS139341 isolated...",
          "ALPHA-7-EXFIL: Intercepting IceStark micro-frontend packets...",
          "TRON Node Alpha: TCHFcs... SAR 600M hemorrhage tracked.",
          "PDPL Audit: Unauthorized TMT child audio sync detected.",
          "HAVEN Microkernel: Committing cryptographic anchors to ledger...",
          "Sovereign Node 001: BGP Route Withdrawal protocol ready."
        ];
        const message = heartbeats[Math.floor(Math.random() * heartbeats.length)];
        ws.send(JSON.stringify({
          type: 'SYSTEM_MESSAGE',
          message,
          timestamp: new Date().toISOString()
        }));
      }
    }, 15000);
    
    ws.on("message", (data) => {
      console.log(`[NIYAH WS] Received: ${data}`);
      try {
        const parsed = JSON.parse(data.toString());
        // Broadcast messages of specific types to all connected clients
        if (parsed.type === 'NIYAH_ENGINE_MESSAGE' || parsed.type === 'TRAINING_PROGRESS') {
          const broadcastData = JSON.stringify(parsed);
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(broadcastData);
            }
          });
        }
      } catch (err) {
        // Fallback for non-JSON messages
        ws.send(JSON.stringify({
          type: 'ECHO',
          message: `NIYAH Echo: ${data}`,
          timestamp: new Date().toISOString()
        }));
      }
    });

    ws.on("close", () => {
      console.log("[NIYAH WS] Client disconnected");
      clearInterval(heartbeatInterval);
    });

    ws.on("error", (error) => {
      console.error(`[NIYAH WS] Error: ${error.message}`);
      clearInterval(heartbeatInterval);
    });
  });

  app.use(express.json());

  // --- Sovereign Forensic API ---
  app.post("/api/forensics/analyze", (req, res) => {
    const { target, mode } = req.body;
    
    // Simulate NIYAH v3.0 Analysis via Sovereign Engine
    console.log(`[NIYAH v3.0] Initializing Sovereign Engine...`);
    console.log(`[NIYAH v3.0] SIMD Path: AVX2+FMA (Detected)`);
    console.log(`[NIYAH v3.0] Analyzing target: ${target} in ${mode} mode...`);
    
    const results = {
      timestamp: new Date().toISOString(),
      engine: "NIYAH v3.0 (Sovereign Core)",
      status: "COMPLETED",
      findings: [
        {
          type: "IP_TRACKING",
          data: "192.168.1.45 (Proxy: Seychelles)",
          confidence: 0.92,
          details: "Detected hop via Fella Gang cluster node."
        },
        {
          type: "WALLET_TRACE",
          data: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          amount: "12.45 BTC",
          link: "Fella Gang Cluster (Confirmed)"
        },
        {
          type: "PATTERN_MATCH",
          data: "Digital Signature matches 'Fella' gang encryption style.",
          confidence: 0.98,
          details: "Unique byte sequence 0xFE 0x11 0xA1 found in payload."
        }
      ],
      recommendation: "Initiate sovereign recovery protocol via HAVEN node 0x4. Target assets identified in cluster."
    };

    res.json(results);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server: httpServer,
          path: "/vite-hmr"
        }
      },
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`HAVEN Sovereign Server running on http://localhost:${PORT}`);
  });
}

startServer();
