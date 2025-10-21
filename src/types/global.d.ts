// Global type declarations for the AI Consumer Insights Platform

// CSS imports
declare module "*.css";
declare module "*.scss"; 
declare module "*.sass";

// Image imports
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";
declare module "*.webp";

// Font imports
declare module "*.woff";
declare module "*.woff2";
declare module "*.eot";
declare module "*.ttf";
declare module "*.otf";

// Other asset imports
declare module "*.json";
declare module "*.md";

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GOOGLE_API_KEY?: string;
    OPENAI_API_KEY?: string;
    NEXTAUTH_SECRET?: string;
    NEXTAUTH_URL?: string;
  }
}