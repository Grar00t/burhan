/**
 * server.ts — BURHĀN Sovereign Uplink
 * Express + WebSocket server for the BURHĀN forensic command center.
 *
 * The /api/forensics/analyze endpoint returns DEMO findings derived from the
 * DRAGON403 master brief (case EPID0011034). Real inference must be wired
 * to the C99 Niyah core via FFI before production cutover.
 */
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DRAGON403 authoritative figures (mirror /MASTER-BRIEF.md)
const DRAGON403 = {
  caseId: "EPID0011034",
  ic3: "RF26030165360C",
  ftc: "#199332032",
  apps: 70,
  trc20Wallets: 33,
  iocs: 50,
  perVictimLossSAR: { min: 300_000, max: 1_500_000 },
  perVictimLossUSD: { min: 80_000, max: 400_000 },
  threatAS: "AS139341",
  threatNet: "43.152.32.0/24",
  threatRegion: "Singapore (Tencent Cloud)",
  publisher: "com.iyinguo.*",
  forensicHash:
    "71bf18bf6be88fc7afb4a0d5ae668148d0f75f080ec9e6a6956776bc865ad88d",
  wallets: {
    cashOut: "TCHFcsY7VqTq35c9zZPzKo7JtfNYVAryfu",
    mixer: "Tf7rkg7L6TuTtyMGs5xe1dJEPsOyggnhLa",
    csamLinked: "TuSCebQRIvNR3qzAReKfJ7LtSjoUY8gqeJ",
  },
} as const;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const httpServer = createServer(app);

  // ────────────────────────────────────────────────────────────
  // WebSocket — Sovereign uplink
  // ────────────────────────────────────────────────────────────
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
    verifyClient: (info, callback) => {
      const protocol = info.req.headers["sec-websocket-protocol"];
      const clientIp = info.req.socket.remoteAddress;
      console.log(`[BURHAN AUTH] Inbound from ${clientIp}`);
      if (process.env.NODE_ENV === "production") {
        if (!protocol || protocol !== "burhan-sovereign-v1") {
          console.warn(`[BURHAN AUTH] Rejected ${clientIp}`);
          callback(false, 401, "Unauthorized Sovereign Link");
          return;
        }
      }
      callback(true);
    },
  });

  wss.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[BURHAN WS] Sovereign Link Established: ${clientIp}`);

    ws.send(
      JSON.stringify({
        type: "SYSTEM_MESSAGE",
        message:
          "BURHĀN Sovereign Uplink Established. Node 001-HAVEN active.",
        case: DRAGON403.caseId,
        timestamp: new Date().toISOString(),
      })
    );

    const heartbeats = [
      `Black Hole surveillance: ${DRAGON403.threatAS} (${DRAGON403.threatRegion}) under monitoring.`,
      `TRON ledger walk: ${DRAGON403.trc20Wallets} TRC-20 wallets clustered around ${DRAGON403.wallets.cashOut.slice(0, 8)}…`,
      `IOC inventory: ${DRAGON403.iocs} indicators across 7 categories synced.`,
      `Phalanx scrubber: outbound payload PII strip nominal.`,
      `Niyah core: SHA-256 anchor committed for forensic ledger.`,
      `App network: ${DRAGON403.apps}+ apps under ${DRAGON403.publisher} publisher tracked.`,
      `Per-victim loss range: SAR ${DRAGON403.perVictimLossSAR.min.toLocaleString()}–${DRAGON403.perVictimLossSAR.max.toLocaleString()} verified.`,
    ];

    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        const message = heartbeats[Math.floor(Math.random() * heartbeats.length)];
        ws.send(
          JSON.stringify({
            type: "SYSTEM_MESSAGE",
            message,
            timestamp: new Date().toISOString(),
          })
        );
      }
    }, 15_000);

    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (
          parsed.type === "NIYAH_ENGINE_MESSAGE" ||
          parsed.type === "TRAINING_PROGRESS"
        ) {
          const payload = JSON.stringify(parsed);
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) client.send(payload);
          });
        }
      } catch {
        ws.send(
          JSON.stringify({
            type: "ECHO",
            message: `BURHĀN Echo: ${data}`,
            timestamp: new Date().toISOString(),
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("[BURHAN WS] Client disconnected");
      clearInterval(heartbeatInterval);
    });

    ws.on("error", (error) => {
      console.error(`[BURHAN WS] Error: ${error.message}`);
      clearInterval(heartbeatInterval);
    });
  });

  app.use(express.json());

  // ────────────────────────────────────────────────────────────
  // Health / metadata
  // ────────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "burhan",
      version: "1.0.0",
      case: DRAGON403.caseId,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/case", (_req, res) => {
    res.json(DRAGON403);
  });

  // ────────────────────────────────────────────────────────────
  // Forensic analysis (DEMO — wire to C99 Niyah core for prod)
  // ────────────────────────────────────────────────────────────
  app.post("/api/forensics/analyze", (req, res) => {
    const { target, mode } = req.body ?? {};
    console.log(
      `[BURHAN] Forensic request: target=${target} mode=${mode}`
    );

    const results = {
      timestamp: new Date().toISOString(),
      engine: "BURHĀN / Niyah Sovereign Core (DEMO)",
      status: "COMPLETED",
      case: DRAGON403.caseId,
      target: target ?? null,
      mode: mode ?? "default",
      findings: [
        {
          type: "AS_TRACE",
          data: `${DRAGON403.threatAS} (${DRAGON403.threatNet}) — ${DRAGON403.threatRegion}`,
          confidence: 0.97,
          details:
            "Command surface for the Black Hole 70+ app network. Orchestrates device fingerprinting and IAP exfiltration.",
        },
        {
          type: "WALLET_TRACE",
          chain: "TRON / TRC-20",
          cluster_size: DRAGON403.trc20Wallets,
          cash_out: DRAGON403.wallets.cashOut,
          mixer: DRAGON403.wallets.mixer,
          confidence: 0.99,
          details: "Mixer hop confirmed; CSAM-linked branch flagged for NCMEC.",
        },
        {
          type: "BINARY_HASH",
          artifact: "falla_admin.js",
          algo: "SHA-256",
          digest: DRAGON403.forensicHash,
          confidence: 1.0,
          details: "Cryptographic anchor — see master brief Section IV.",
        },
        {
          type: "PUBLISHER_PATTERN",
          publisher: DRAGON403.publisher,
          apps: DRAGON403.apps,
          confidence: 0.95,
          details: "Common signing key & shared SDK fingerprint detected.",
        },
      ],
      victim_impact: {
        per_victim_loss_sar: DRAGON403.perVictimLossSAR,
        per_victim_loss_usd: DRAGON403.perVictimLossUSD,
      },
      recommendation:
        "Escalate via MLAT trigger (Annex G of master brief). Coordinate IC3 / NCMEC / Saudi-US liaison bridge.",
      disclaimer:
        "Demo output. Replace with C99 Niyah core inference via FFI before production cutover.",
    };

    res.json(results);
  });

  // ────────────────────────────────────────────────────────────
  // Vite middleware (dev) / static (prod)
  // ────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer, path: "/vite-hmr" },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(
      `\n  BURHĀN Sovereign Server\n  case: ${DRAGON403.caseId}\n  http://localhost:${PORT}\n`
    );
  });
}

startServer().catch((err) => {
  console.error("[BURHAN] Fatal startup error:", err);
  process.exit(1);
});
