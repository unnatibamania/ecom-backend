import { z } from 'zod';

export type Order = {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
}


export const createOrderSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    totalPrice: z.number(),
})