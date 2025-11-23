/**
 * Prisma type definitions for static builds
 * These are used when @prisma/client is not available (e.g., GitHub Pages static export)
 */

export enum PUBLISHED_STATE {
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  DRAFT = "DRAFT",
}

export enum PALETTE_TYPE {
  SEQUENTIAL = "SEQUENTIAL",
  DIVERGING = "DIVERGING",
  CATEGORICAL = "CATEGORICAL",
}

export interface User {
  id: number;
  sub: string | null;
  name: string | null;
}

export interface Config {
  id: number;
  key: string;
  data: any; // JSON type
  created_at: Date;
  updated_at: Date;
  user_id: number | null;
  published_state: PUBLISHED_STATE;
}

export interface ConfigView {
  id: number;
  viewed_at: Date;
  config_key: string | null;
}

export interface Palette {
  paletteId: string;
  name: string;
  type: PALETTE_TYPE;
  colors: string[];
  created_at: Date;
  updated_at: Date;
  user_id: number | null;
}

// Re-export PrismaClient type (will be mocked for static builds)
export type PrismaClient = any;

// Define Prisma namespace for type annotations
export namespace Prisma {
  export type ConfigCreateInput = {
    data: any;
    key?: string;
    user_id?: number;
    published_state?: PUBLISHED_STATE;
  };

  export type ConfigUpdateInput = {
    data?: any;
    published_state?: PUBLISHED_STATE;
    user_id?: number;
  };
}
