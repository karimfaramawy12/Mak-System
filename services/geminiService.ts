
import { GoogleGenAI, Type } from "@google/genai";
import { Task, User, Project, Department } from '../types';
import { Locale } from '../translations';

// Initialize the Google GenAI client using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (
  prompt: string, 
  context: { tasks: Task[], users: User[], projects: Project[], departments: Department[] },
  locale: Locale = 'en'
) => {
  const langName = locale === 'ar' ? 'Arabic' : 'English';
  
  // Use ai.models.generateContent to query the Gemini 3 Flash model with both model name and prompt.
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      You are the MAK Work OS AI Assistant.
      LANGUAGE: You MUST respond in ${langName}.
      
      Context Data:
      - Total Tasks: ${context.tasks.length}
      - Departments: ${context.departments.map(d => d.name).join(', ')}
      - Projects: ${context.projects.map(p => p.name).join(', ')}
      - Tasks Detail: ${JSON.stringify(context.tasks.map(t => ({ 
          title: t.title, 
          status: t.status, 
          priority: t.priority, 
          due: t.dueDate 
        })))}

      Rules:
      1. Responses must be short, actionable, and clear.
      2. Prioritize urgent and overdue tasks first.
      3. No unnecessary explanations.
      4. Format with markdown (bullets, bold text).

      User Prompt: ${prompt}
    `,
  });

  const response = await model;
  return response.text;
};

export const generateTaskDescription = async (shortInput: string, locale: Locale = 'en') => {
  const langName = locale === 'ar' ? 'Arabic' : 'English';
  // Use ai.models.generateContent for single-turn text generation tasks.
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Transform this short task title or idea into a professional 2-sentence description for a task management system. Respond in ${langName}. Input: "${shortInput}"`,
  });
  const response = await model;
  return response.text;
};
