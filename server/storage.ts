import { users, votes, type User, type InsertUser, type Vote, type InsertVote } from "@shared/schema";
import { db } from "./db";
import { eq, and, like } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getVotes(): Promise<Vote[]>;
  getVotesByType(voteType: "favor" | "contra"): Promise<Vote[]>;
  getVotesByProfession(profession: string): Promise<Vote[]>;
  getVotesByAgeRange(min: number, max: number): Promise<Vote[]>;
  getFilteredVotes(filters: { voteType?: string; profession?: string; ageRange?: string }): Promise<Vote[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Vote operations
  async createVote(insertVote: InsertVote): Promise<Vote> {
    const [vote] = await db
      .insert(votes)
      .values(insertVote)
      .returning();
    return vote;
  }

  async getVotes(): Promise<Vote[]> {
    return db.select().from(votes).orderBy(votes.created_at);
  }

  async getVotesByType(voteType: "favor" | "contra"): Promise<Vote[]> {
    return db.select().from(votes).where(eq(votes.vote_type, voteType));
  }

  async getVotesByProfession(profession: string): Promise<Vote[]> {
    return db.select().from(votes).where(like(votes.profession, `%${profession}%`));
  }

  async getVotesByAgeRange(min: number, max: number): Promise<Vote[]> {
    return db
      .select()
      .from(votes)
      .where(and(
        min ? eq(votes.age >= min, true) : undefined,
        max ? eq(votes.age <= max, true) : undefined
      ));
  }

  async getFilteredVotes(filters: { voteType?: string; profession?: string; ageRange?: string }): Promise<Vote[]> {
    let query = db.select().from(votes);
    
    if (filters.voteType && filters.voteType !== 'all') {
      query = query.where(eq(votes.vote_type, filters.voteType));
    }
    
    if (filters.profession && filters.profession !== 'all') {
      query = query.where(like(votes.profession, `%${filters.profession}%`));
    }
    
    if (filters.ageRange && filters.ageRange !== 'all') {
      const [min, max] = filters.ageRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        query = query.where(and(
          eq(votes.age >= min, true),
          eq(votes.age <= max, true)
        ));
      } else if (filters.ageRange === '51+') {
        query = query.where(eq(votes.age >= 51, true));
      }
    }
    
    return query;
  }
}

export const storage = new DatabaseStorage();
