import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

type DbClient = ReturnType<typeof drizzle>

export const createDb = (databaseUrl: string): DbClient => {
  const sql = neon(databaseUrl)
  return drizzle(sql)
}
