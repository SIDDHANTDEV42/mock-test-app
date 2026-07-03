import { z } from 'zod';

export const createTestSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    questionIds: z.array(z.string()).min(1, 'At least one question is required'),
    correctPoints: z.number().optional().default(4),
    negativePoints: z.number().optional().default(1),
    type: z.string().optional().default('MOCK'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    isLocked: z.boolean().optional().default(false),
    isAlwaysAvailable: z.boolean().optional().default(true),
    subjectMarks: z.string().optional(),
});

export const createCustomTestSchema = z.object({
    subjects: z.array(z.string()).optional(),
    chapters: z.array(z.string()).optional(),
    questionCount: z.number().min(1, 'Question count must be at least 1'),
    title: z.string().min(1, 'Title is required'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    isPYQOnly: z.boolean().optional(),
    priority: z.enum(['RANDOM', 'NEWEST', 'OLDEST']).optional().default('RANDOM'),
    level: z.string().optional(),
});

export const submitResultSchema = z.object({
    answers: z.record(z.string(), z.number().int().min(0)),
    spentTime: z.number().int().min(0),
    timePerQuestion: z.record(z.string(), z.number()).optional(),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;
export type CreateCustomTestInput = z.infer<typeof createCustomTestSchema>;
export type SubmitResultInput = z.infer<typeof submitResultSchema>;
