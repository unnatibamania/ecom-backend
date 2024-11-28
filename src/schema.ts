import { integer, pgTable, text, uuid, varchar, } from 'drizzle-orm/pg-core';



export const usersTable = pgTable('users_table', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull().unique(),
    phoneNumber: varchar('phoneNumber', {length:45}),
    address: text('address').notNull(),
  });


export const productTable = pgTable('product_table', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    price: integer().notNull(),
})

export const orderTable = pgTable('order_table', {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').references(() => usersTable.id),
    productId: uuid('product_id').references(() => productTable.id),
    
})


