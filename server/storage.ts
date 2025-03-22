import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  getTransactionsByWallet(walletAddress: string): Promise<Transaction[]>;
  getTransactionByHash(hash: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string, confirmations?: number): Promise<Transaction | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  userCurrentId: number;
  transactionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.userCurrentId = 1;
    this.transactionCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => {
        // Sort by timestamp, newest first
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
        return bTime - aTime;
      });
  }

  async getTransactionByHash(hash: string): Promise<Transaction | undefined> {
    return Array.from(this.transactions.values()).find(
      tx => tx.transactionHash.toLowerCase() === hash.toLowerCase()
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const timestamp = new Date();
    // Ensure required fields have default values
    const status = insertTransaction.status || "pending";
    const confirmations = insertTransaction.confirmations ?? 0;
    const requiredConfirmations = insertTransaction.requiredConfirmations ?? 15; // Default to 15 confirmations
    
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      timestamp,
      status,
      confirmations,
      requiredConfirmations
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: number, status: string, confirmations?: number): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTx: Transaction = {
      ...transaction,
      status: status as any,
      confirmations: confirmations !== undefined ? confirmations : transaction.confirmations
    };

    this.transactions.set(id, updatedTx);
    return updatedTx;
  }
}

export const storage = new MemStorage();
