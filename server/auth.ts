import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const MemoryStore = createMemoryStore(session);

// Using hardcoded credentials for this specific application as requested
const predefinedUsers = [
  { username: "professor", password: "Nlt@@123", role: "professor" },
  { username: "favor", password: "NLS@@25", role: "favor" },
  { username: "contra", password: "KYU##29", role: "contra" }
];

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "voting-system-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // First check if user exists in database
        let user = await storage.getUserByUsername(username);
        
        // If user doesn't exist in database, check predefined credentials
        if (!user) {
          const predefinedUser = predefinedUsers.find(
            u => u.username === username && u.password === password
          );
          
          if (predefinedUser) {
            // Create user in database if it matches predefined credentials
            user = await storage.createUser({
              username: predefinedUser.username,
              password: predefinedUser.password,
              role: predefinedUser.role
            });
          }
        }
        
        // Check if user exists and passwords match
        if (!user || user.password !== password) {
          return done(null, false);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
