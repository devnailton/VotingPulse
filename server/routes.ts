import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { setupWebSocketServer, broadcastMessage } from "./websocket";
import { insertVoteSchema } from "@shared/schema";
import { z } from "zod";
import * as XLSX from 'xlsx';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up authentication routes
  setupAuth(app);
  
  // Set up WebSocket server
  const wss = setupWebSocketServer(httpServer);
  
  // API routes
  // Create vote
  app.post("/api/votes", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      // Validate request body
      const voteData = insertVoteSchema.parse(req.body);
      
      try {
        // Create vote in database
        const vote = await storage.createVote(voteData);
        
        // Broadcast new vote to all connected clients
        broadcastMessage(wss, {
          type: 'new_vote',
          data: vote
        });
        
        res.status(201).json(vote);
      } catch (storageError: any) {
        // Handle specific error for duplicate email
        if (storageError.message === "Já existe um voto registrado com este e-mail") {
          return res.status(400).json({ 
            message: storageError.message
          });
        }
        throw storageError;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });
  
  // Get all votes
  app.get("/api/votes", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      if (req.user?.role !== 'professor' && 
          !(req.user?.role === 'favor' && req.query.type === 'favor') && 
          !(req.user?.role === 'contra' && req.query.type === 'contra')) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      
      // Get votes with filters
      const votes = await storage.getFilteredVotes({
        voteType: req.query.type as string,
        profession: req.query.profession as string,
        ageRange: req.query.ageRange as string
      });
      
      res.json(votes);
    } catch (error) {
      next(error);
    }
  });
  
  // Get votes statistics
  app.get("/api/votes/stats", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      if (req.user?.role !== 'professor') {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      
      const allVotes = await storage.getVotes();
      const favorVotes = allVotes.filter(vote => vote.vote_type === 'favor');
      const contraVotes = allVotes.filter(vote => vote.vote_type === 'contra');
      
      // Calculate age distribution
      const ageGroups = {
        '18-25': { favor: 0, contra: 0 },
        '26-35': { favor: 0, contra: 0 },
        '36-50': { favor: 0, contra: 0 },
        '51+': { favor: 0, contra: 0 }
      };
      
      // Calculate profession distribution
      const professions = new Map<string, { favor: number, contra: number }>();
      
      allVotes.forEach(vote => {
        // Age distribution
        if (vote.age >= 18 && vote.age <= 25) {
          ageGroups['18-25'][vote.vote_type]++;
        } else if (vote.age >= 26 && vote.age <= 35) {
          ageGroups['26-35'][vote.vote_type]++;
        } else if (vote.age >= 36 && vote.age <= 50) {
          ageGroups['36-50'][vote.vote_type]++;
        } else if (vote.age >= 51) {
          ageGroups['51+'][vote.vote_type]++;
        }
        
        // Profession distribution
        if (!professions.has(vote.profession)) {
          professions.set(vote.profession, { favor: 0, contra: 0 });
        }
        professions.get(vote.profession)![vote.vote_type]++;
      });
      
      // Convert professions map to array for response
      const professionsArray = Array.from(professions.entries()).map(([name, counts]) => ({
        name,
        ...counts
      }));
      
      res.json({
        totalVotes: allVotes.length,
        favorVotes: favorVotes.length,
        contraVotes: contraVotes.length,
        ageDistribution: ageGroups,
        professionDistribution: professionsArray
      });
    } catch (error) {
      next(error);
    }
  });

  // Download votes as XLSX
  app.get("/api/votes/download", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      if (req.user?.role !== 'professor') {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      
      const allVotes = await storage.getVotes();
      
      // Prepare workbook and worksheet
      const workbook = XLSX.utils.book_new();
      
      // Transform data for Excel export (format the dates and remove unnecessary fields)
      const votesForExport = allVotes.map(vote => ({
        ID: vote.id,
        'Tipo de Voto': vote.vote_type === 'favor' ? 'A Favor' : 'Contra',
        'Nome do Entrevistador': vote.interviewer_name,
        'Nome do Entrevistado': vote.interviewee_name,
        'E-mail do Entrevistado': vote.interviewee_email,
        'Idade': vote.age,
        'Profissão': vote.profession,
        'Exemplo de Caso': vote.case_example || '',
        'Data de Criação': new Date(vote.created_at).toLocaleString('pt-BR')
      }));
      
      // Create worksheet from votes data
      const worksheet = XLSX.utils.json_to_sheet(votesForExport);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Votos");
      
      // Generate buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      // Set headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename=votos.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      // Send the file
      res.send(excelBuffer);
    } catch (error) {
      next(error);
    }
  });

  // Get professions for filter
  app.get("/api/professions", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      // Get all actual professions from votes
      const allVotes = await storage.getVotes();
      
      // Extract unique professions
      const uniqueProfessions = [...new Set(allVotes.map(vote => vote.profession))];
      
      // Sort professions alphabetically
      uniqueProfessions.sort();
      
      res.json(uniqueProfessions);
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
