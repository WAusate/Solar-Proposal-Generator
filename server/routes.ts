import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProposalSchema } from "@shared/schema";
import { generateProposalPDF } from "./pdfGenerator";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: "Nao autorizado" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPassword) {
      console.error("ADMIN_USER and ADMIN_PASSWORD must be set in environment variables");
      return res.status(500).json({ error: "Configuracao de autenticacao ausente" });
    }

    if (username === adminUser && password === adminPassword) {
      req.session.isAuthenticated = true;
      req.session.user = username;
      return res.json({ success: true, user: username });
    }
    return res.status(401).json({ error: "Usuario ou senha incorretos" });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (req.session && req.session.isAuthenticated) {
      return res.json({ authenticated: true, user: req.session.user });
    }
    return res.json({ authenticated: false });
  });

  app.get("/api/proposals", requireAuth, async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:id", requireAuth, async (req, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.post("/api/proposals", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(validatedData);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid proposal data", details: error });
      }
      res.status(500).json({ error: "Failed to create proposal" });
    }
  });

  app.delete("/api/proposals/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteProposal(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting proposal:", error);
      res.status(500).json({ error: "Failed to delete proposal" });
    }
  });

  app.get("/api/proposals/:id/pdf", requireAuth, async (req, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }

      const doc = generateProposalPDF(proposal);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="proposta_${proposal.nomeCliente.replace(/\s+/g, "_")}.pdf"`
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  return httpServer;
}
