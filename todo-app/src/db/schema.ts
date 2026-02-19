import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  done: boolean('done').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export type Todo = InferSelectModel<typeof todosTable>
export type NewTodo = InferInsertModel<typeof todosTable>
