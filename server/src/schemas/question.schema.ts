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
}).superRefine((data, ctx) => {
    if (data.correctAnswer >= data.options.length) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['correctAnswer'],
            message: 'Correct answer must point to one of the provided options',
        });
    }
});

export const bulkCreateQuestionsSchema = z.object({
    questions: z.union([z.array(z.any()), z.string()]),
    isCSV: z.boolean().optional().default(false),
    globalIsPYQ: z.boolean().optional(),
    globalYear: z.number().optional(),
    globalLevel: z.string().optional(),
}).superRefine((data, ctx) => {
    if (typeof data.questions === 'string' && !data.isCSV) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['questions'],
            message: 'CSV text is only accepted when isCSV is true',
        });
    }
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type BulkCreateQuestionsInput = z.infer<typeof bulkCreateQuestionsSchema>;
