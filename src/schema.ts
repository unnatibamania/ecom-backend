import { integer, pgTable, text, uuid, varchar, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull().unique(),
    phoneNumber: varchar('phoneNumber', {length:45}),
    address: text('address').notNull(),
    isAdmin: boolean('is_admin').notNull().default(false),
  });


export const productTable = pgTable('product_table', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    price: integer().notNull(),
    description: text('description').notNull(),
    image: text('image'),
})

export const orderTable = pgTable('order_table', {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').references(() => usersTable.id),
    productId: uuid('product_id').references(() => productTable.id),
    quantity: integer('quantity').notNull(),
    totalPrice: integer('total_price').notNull(),
})




