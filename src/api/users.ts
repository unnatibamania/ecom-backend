import { z } from 'zod';
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db';
import { usersTable } from '../schema';
import { createUserSchema } from '../types/users';

import { getUser } from '../kinde';

import { randomUUID } from 'crypto' // Add this import


const usersRouter = new Hono();

// fake users

usersRouter.post('/', zValidator('json', createUserSchema),async (c) => {

    const { name, email, phoneNumber, address, age } = c.req.valid('json');

    try {
        const createdUser = await db.insert(usersTable).values({ id:  randomUUID(), name, email, phoneNumber, address, age }).returning();
        return c.json(createdUser);
    } catch (error) {
        console.error(error)
        return c.json({ error: 'Failed to create user' }, 500);
    }
  
});


usersRouter.get('/', async(c)=>{
    const users = await db.select().from(usersTable);
    return c.json(users);
})

usersRouter.get('/:id{string}', async(c)=>{
    const {id} = c.req.param();
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return c.json(user);
});

usersRouter.put('/:id', async(c)=>{
    const {id} = c.req.param();
    const body = await c.req.json();
    const {name, email, phoneNumber, address, age} = body;
    const updatedUser = await db.update(usersTable).set({name, email, phoneNumber, address, age}).where(eq(usersTable.id, id));
    if(!updatedUser) return c.json({error: 'User not found'}, 404);
    return c.json(updatedUser);
});

usersRouter.delete('/:id', async(c)=>{
    const {id} = c.req.param();
    const deletedUser = await db.delete(usersTable).where(eq(usersTable.id, id));
    return c.json(deletedUser);
});

const seedUsers = [
    { id: randomUUID(), name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890', address: '123 Main St', age: 25, isAdmin: false },
    { id: randomUUID(), name: 'Jane Doe', email: 'jane@example.com', phoneNumber: '1234567890', address: '123 Main St', age: 25, isAdmin: false },
    { id: randomUUID(), name: 'Jim Beam', email: 'jim@example.com', phoneNumber: '1234567890', address: '123 Main St', age: 25, isAdmin: false },
    {id:randomUUID(), name:'admin', email:'admin@example.com', phoneNumber:'1234567890', address:'123 Main St', age:25, isAdmin:true}
]

usersRouter.post('/seed', getUser, async (c) => {
    const users = await db.insert(usersTable).values(seedUsers).returning();
    return c.json(users);
});

export default usersRouter;