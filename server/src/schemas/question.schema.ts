import { z } from 'zod';

export const createQuestionSchema = z.object({
    text: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).min(2, 'At least 2 options are required'),
    correctAnswer: z.number().min(0, 'Correct answer must be a valid index'),
    subject: z.string().min(1, 'Subject is required'),
    chapter: z.string().optional(),
    level: z.string().optional(),
    imageUrl: z.string().optional(),
    year: z.number().optional(),
    isPYQ: z.boolean().optional().default(false),
});

export const bulkCreateQuestionsSchema = z.object({
    questions: z.array(z.any()),
    isCSV: z.boolean().optional().default(false),
    globalIsPYQ: z.boolean().optional(),
    globalYear: z.number().optional(),
    globalLevel: z.string().optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type BulkCreateQuestionsInput = z.infer<typeof bulkCreateQuestionsSchema>;
