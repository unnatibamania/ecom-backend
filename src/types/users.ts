import { z } from 'zod';

export type User = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    age: number;
}

export const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    address: z.string(),
    age: z.number(),
})