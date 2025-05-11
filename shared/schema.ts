import { pgTable, text, serial, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["professor", "favor", "contra"] }).notNull(),
});

// Vote schema for survey data
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  interviewer_name: text("interviewer_name").notNull(),
  interviewee_name: text("interviewee_name").notNull(),
  interviewee_email: text("interviewee_email").notNull(),
  age: integer("age").notNull(),
  profession: text("profession").notNull(),
  case_example: text("case_example"),
  vote_type: text("vote_type", { enum: ["favor", "contra"] }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User insert schema
export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Vote insert schema
export const insertVoteSchema = createInsertSchema(votes).omit({ id: true, created_at: true });
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

// Create a survey form schema with validation
export const surveyFormSchema = z.object({
  interviewer_name: z.string().min(2, { message: "O nome do entrevistador é obrigatório" }),
  interviewee_name: z.string().min(2, { message: "O nome do entrevistado é obrigatório" }),
  interviewee_email: z.string().email({ message: "E-mail inválido" }),
  age: z.number().int().min(18, { message: "Idade mínima é 18 anos" }).max(100, { message: "Idade máxima é 100 anos" }),
  profession: z.string().min(2, { message: "A profissão é obrigatória" }),
  case_example: z.string().optional(),
  vote_type: z.enum(["favor", "contra"])
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginData = z.infer<typeof loginSchema>;
