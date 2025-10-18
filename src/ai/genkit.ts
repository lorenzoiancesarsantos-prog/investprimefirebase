
'use client';
import { genkit, type GenkitOptions } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { firebase } from '@genkit-ai/firebase';
import {
  definePrompt,
  generate,
  type GenerationCommonOptions,
  type GenerationOptions,
  type GenerateResponse,
} from 'genkit/generate';
import {
  defineFlow,
  run,
  stream,
  type Flow,
  type FlowInput,
  type FlowOutput,
} from 'genkit/flow';
import { z, type ZodType, type ZodTypeDef } from 'zod';
import {
  defineTool,
  type ToolAction,
  type ToolDefinition,
} from 'genkit/tool';

// NOTE: This file is a temporary workaround for an apparent issue with Genkit's
//       support for Turbopack. It duplicates the Genkit API so that it can be
//       used in both client and server components.

const genkitOptions: GenkitOptions = {
  plugins: [googleAI(), firebase()],
  logLevel: 'debug',
  enableTracing: true,
};

const ai = genkit(genkitOptions);

export {
  ai,
  defineFlow,
  run,
  stream,
  generate,
  defineTool,
  definePrompt,
  z,
  type Flow,
  type FlowInput,
  type FlowOutput,
  type GenerationCommonOptions,
  type GenerationOptions,
  type ToolAction,
  type ToolDefinition,
  type GenerateResponse,
  type ZodType,
  type ZodTypeDef,
};
