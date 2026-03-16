import fs from "fs";
import path from "path";
import { ProjectState, ProjectStateSchema } from "./state";

// Define our hidden storage directory at the root of the monorepo
const STORAGE_DIR = path.resolve(process.cwd(), "../../.agency");
const PROJECTS_DIR = path.join(STORAGE_DIR, "projects");
const GLOBAL_MEMORY_FILE = path.join(STORAGE_DIR, "global-memory.json");

// Ensure the storage directories exist when this module is loaded
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

// ---------------------------------------------------------
// 1. ISOLATED PROJECT MEMORY
// ---------------------------------------------------------

/**
 * Saves a specific project's state to its own dedicated, isolated JSON file.
 */
export function saveProjectState(projectId: string, state: ProjectState) {
  const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Loads a specific project's state. Uses Zod to validate the data hasn't been corrupted.
 */
export function loadProjectState(projectId: string): ProjectState | null {
  const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(rawData);
    // Validate against our strict Zod schema
    return ProjectStateSchema.parse(parsed);
  } catch (error) {
    console.error(`Error loading project state for ${projectId}:`, error);
    return null;
  }
}

/**
 * Lists all existing project IDs.
 */
export function listProjects(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR)
    .filter(file => file.endsWith(".json"))
    .map(file => file.replace(".json", ""));
}

// ---------------------------------------------------------
// 2. GLOBAL AGENCY MEMORY (THE PLAYBOOK)
// ---------------------------------------------------------

export interface GlobalMemory {
  lessonsLearned: string[];
}

/**
 * Loads the shared global memory that all agents have access to.
 */
export function loadGlobalMemory(): GlobalMemory {
  if (!fs.existsSync(GLOBAL_MEMORY_FILE)) {
    return { lessonsLearned: [] };
  }
  try {
    const rawData = fs.readFileSync(GLOBAL_MEMORY_FILE, "utf-8");
    return JSON.parse(rawData) as GlobalMemory;
  } catch (error) {
    return { lessonsLearned: [] };
  }
}

/**
 * Adds a new critique/lesson to the global memory so future agents avoid the mistake.
 */
export function addGlobalLesson(lesson: string) {
  const memory = loadGlobalMemory();
  
  // Prevent duplicate lessons
  if (!memory.lessonsLearned.includes(lesson)) {
    memory.lessonsLearned.push(lesson);
    fs.writeFileSync(GLOBAL_MEMORY_FILE, JSON.stringify(memory, null, 2), "utf-8");
  }
}
