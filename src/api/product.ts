import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createProductSchema } from '../types/product';
import { db } from '../db';
import { productTable } from '../schema';
import { getUser } from '../kinde';
import { randomUUID } from 'crypto';

import { eq } from 'drizzle-orm';

const productRouter = new Hono();

productRouter.post('/', zValidator('json', createProductSchema),
getUser, async (c) => {
    const { name, price, description, image } = c.req.valid('json');
    const product = await db.insert(productTable).values({ id:  randomUUID(),name, price, description, image }).returning();
    return c.json(product);
});


productRouter.get('/', getUser, async (c) => {
    const products = await db.select().from(productTable);
    return c.json(products);
});

productRouter.get('/:id{string}', getUser, async (c) => {
    const { id } = c.req.param();
    const product = await db.select().from(productTable).where(eq(productTable.id, id));
    return c.json(product);
});


productRouter.put('/:id{string}', zValidator('json', createProductSchema), getUser, async (c) => {
    const { id } = c.req.param();
    const { name, price, description, image } = c.req.valid('json');
    const product = await db.update(productTable).set({ name, price, description, image }).where(eq(productTable.id, id));
    return c.json(product);
});



const seedProducts = [
    { id: randomUUID(), name: 'Product 1', price: 100, description: 'Product 1 description', image: 'https://example.com/product1.jpg' },
    { id: randomUUID(), name: 'Product 2', price: 200, description: 'Product 2 description', image: 'https://example.com/product2.jpg' },
    { id: randomUUID(), name: 'Product 3', price: 300, description: 'Product 3 description', image: 'https://example.com/product3.jpg' },    
    { id: randomUUID(), name: 'Product 4', price: 400, description: 'Product 4 description', image: 'https://example.com/product4.jpg' },
    { id: randomUUID(), name: 'Product 5', price: 500, description: 'Product 5 description', image: 'https://example.com/product5.jpg' },
]

productRouter.post('/seed', getUser, async (c) => {
    const products = await db.insert(productTable).values(seedProducts).returning();
    return c.json(products);
});

export default productRouter;