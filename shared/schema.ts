import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nomeCliente: text("nome_cliente").notNull(),
  cidadeUf: text("cidade_uf"),
  dataProposta: text("data_proposta").notNull(),
  validadeDias: integer("validade_dias").notNull().default(4),
  potenciaKwp: real("potencia_kwp").notNull(),
  geracaoEstimadaKwh: real("geracao_estimada_kwh").notNull(),
  areaUtilM2: real("area_util_m2"),
  modeloModulo: text("modelo_modulo").notNull(),
  quantidadeModulo: integer("quantidade_modulo").notNull(),
  modeloInversor: text("modelo_inversor").notNull(),
  quantidadeInversor: integer("quantidade_inversor").notNull(),
  outrosItens: text("outros_itens"),
  garantiaServicos: text("garantia_servicos").notNull().default("Instalação – 1 ano"),
  garantiaModulosEquipamento: text("garantia_modulos_equipamento").notNull().default("Equipamento – 15 anos"),
  garantiaModulosPerformance: text("garantia_modulos_performance").notNull().default("Performance – 25 anos"),
  garantiaInversor: text("garantia_inversor").notNull().default("Inversor – 10 anos"),
  valorTotalAvista: real("valor_total_avista").notNull(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;
