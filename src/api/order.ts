import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createOrderSchema } from '../types/orders';
import { db } from '../db';
import { orderTable } from '../schema';
import { getUser } from '../kinde';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

const orderRouter = new Hono();

orderRouter.post('/', zValidator('json', createOrderSchema), getUser, async (c) => {
    const { userId, productId, quantity, totalPrice } = c.req.valid('json');
    const order = await db.insert(orderTable).values({ id: randomUUID(), userId, productId, quantity, totalPrice }).returning();
    return c.json(order);
});

orderRouter.get('/', getUser, async(c)=>{
    const orders = await db.select().from(orderTable);
    return c.json(orders);
});

orderRouter.get('/:id{string}', getUser, async(c)=>{
    const { id } = c.req.param();
    const order = await db.select().from(orderTable).where(eq(orderTable.id, id));
    return c.json(order);
});



export default orderRouter;