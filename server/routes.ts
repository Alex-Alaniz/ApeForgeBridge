import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Transactions API
  const transactionsRouter = express.Router();

  // Get transactions by wallet address
  transactionsRouter.get("/wallet/:address", async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      if (!address) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      const transactions = await storage.getTransactionsByWallet(address);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get transaction by hash
  transactionsRouter.get("/hash/:hash", async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;
      if (!hash) {
        return res.status(400).json({ message: "Transaction hash is required" });
      }
      
      const transaction = await storage.getTransactionByHash(hash);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Create a new transaction
  transactionsRouter.post("/", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Update transaction status
  transactionsRouter.patch("/:id/status", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, confirmations } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ message: "Transaction ID and status are required" });
      }
      
      const updatedTx = await storage.updateTransactionStatus(
        parseInt(id, 10), 
        status, 
        confirmations
      );
      
      if (!updatedTx) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(updatedTx);
    } catch (error) {
      console.error("Error updating transaction status:", error);
      res.status(500).json({ message: "Failed to update transaction status" });
    }
  });

  app.use("/api/transactions", transactionsRouter);

  const httpServer = createServer(app);
  return httpServer;
}
