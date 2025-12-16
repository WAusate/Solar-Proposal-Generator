import { type User, type InsertUser, type Proposal, type InsertProposal } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProposals(): Promise<Proposal[]>;
  getProposal(id: string): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  deleteProposal(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private proposals: Map<string, Proposal>;

  constructor() {
    this.users = new Map();
    this.proposals = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProposals(): Promise<Proposal[]> {
    const proposals = Array.from(this.proposals.values());
    return proposals.sort((a, b) => {
      const dateA = new Date(a.dataProposta);
      const dateB = new Date(b.dataProposta);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = { 
      ...insertProposal, 
      id,
      cidadeUf: insertProposal.cidadeUf ?? null,
      areaUtilM2: insertProposal.areaUtilM2 ?? null,
      outrosItens: insertProposal.outrosItens ?? null,
      validadeDias: insertProposal.validadeDias ?? 4,
      garantiaServicos: insertProposal.garantiaServicos ?? "Instalação – 1 ano",
      garantiaModulosEquipamento: insertProposal.garantiaModulosEquipamento ?? "Equipamento – 15 anos",
      garantiaModulosPerformance: insertProposal.garantiaModulosPerformance ?? "Performance – 25 anos",
      garantiaInversor: insertProposal.garantiaInversor ?? "Inversor – 10 anos",
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async deleteProposal(id: string): Promise<boolean> {
    return this.proposals.delete(id);
  }
}

export const storage = new MemStorage();
