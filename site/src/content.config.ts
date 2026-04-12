import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dateSchema = z.union([
  z.string(),
  z.coerce.date().transform((d) => d.toISOString().slice(0, 4)),
]);

const statusEnum = z.enum([
  'published',
  'preprint',
  'completed',
  'in-progress',
  'archived',
]);

const paperSchema = z.object({
  title: z.string(),
  type: z.literal('paper').default('paper'),
  status: statusEnum,
  date: dateSchema,
  tags: z.array(z.string()).default([]),
  venue: z.string().optional(),
  summary: z.string().optional(),
  cover: z.string().optional(),  // relative to /media/ — add later
});

const projectSchema = z.object({
  title: z.string(),
  type: z.union([z.literal('project'), z.literal('paper')]).default('project'),
  status: statusEnum,
  date: dateSchema,
  tags: z.array(z.string()).default([]),
  collaborator: z.string().optional(),
  summary: z.string().optional(),
  cover: z.string().optional(),  // relative to /media/ — add later
});

export const collections = {
  papers: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/papers' }),
    schema: paperSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/projects' }),
    schema: projectSchema,
  }),
};
