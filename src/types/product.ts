import { z } from 'zod';

export type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}


export const createProductSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    image: z.string(),
})