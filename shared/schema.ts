import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const networkEnum = pgEnum("network", ["ethereum", "apechain"]);
export const assetEnum = pgEnum("asset", ["eth", "ape"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "confirming", "completed", "failed"]);

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  fromNetwork: networkEnum("from_network").notNull(),
  toNetwork: networkEnum("to_network").notNull(),
  asset: assetEnum("asset").notNull(),
  amount: text("amount").notNull(),
  status: transactionStatusEnum("status").notNull().default("pending"),
  confirmations: integer("confirmations").default(0),
  requiredConfirmations: integer("required_confirmations").default(15),
  fee: text("fee"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  type: transactionTypeEnum("type").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export type Network = "ethereum" | "apechain";
export type Asset = "eth" | "ape";
export type TransactionType = "deposit" | "withdrawal";
export type TransactionStatus = "pending" | "confirming" | "completed" | "failed";

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
