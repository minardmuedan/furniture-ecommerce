import { Category, SubCategory } from '@/lib/categories'
import { integer, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const productsTable = pgTable('products', {
  id: varchar().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  imgSrc: varchar('img_src').notNull(),
  category: varchar().$type<Category>().notNull(),
  subCategory: varchar('sub_category').$type<SubCategory>().notNull(),
  stocks: integer().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
