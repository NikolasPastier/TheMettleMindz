import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

interface DbTable {
  get: (id: string) => Promise<any>
  insert: (data: any) => Promise<any>
  update: (id: string, data: any) => Promise<any>
  delete: (id: string) => Promise<any>
  findBy: (field: string, value: any) => Promise<any[]>
  findOne: (field: string, value: any) => Promise<any>
}

function createTable(tableName: string): DbTable {
  return {
    async get(id: string) {
      const result = await sql`SELECT * FROM ${sql.unsafe(tableName)} WHERE id = ${id}`
      return result[0] || null
    },

    async insert(data: any) {
      const keys = Object.keys(data)
      const values = Object.values(data)
      const placeholders = keys.map(() => "?").join(", ")
      const columns = keys.join(", ")

      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`
      const result = await sql.query(query, values)
      return result.rows[0]
    },

    async update(id: string, data: any) {
      const keys = Object.keys(data)
      const values = Object.values(data)
      const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ")

      const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING *`
      const result = await sql.query(query, [id, ...values])
      return result.rows[0]
    },

    async delete(id: string) {
      const result = await sql`DELETE FROM ${sql.unsafe(tableName)} WHERE id = ${id} RETURNING *`
      return result[0]
    },

    async findBy(field: string, value: any) {
      const query = `SELECT * FROM ${tableName} WHERE ${field} = $1`
      const result = await sql.query(query, [value])
      return result.rows
    },

    async findOne(field: string, value: any) {
      const query = `SELECT * FROM ${tableName} WHERE ${field} = $1 LIMIT 1`
      const result = await sql.query(query, [value])
      return result.rows[0] || null
    },
  }
}

export const db = {
  checkout_sessions: createTable("checkout_sessions"),
  purchases: createTable("purchases"),
  users: createTable("users"),
  cart: createTable("cart"),
  products: createTable("products"),
  course_progress: createTable("course_progress"),
  subscribers: createTable("subscribers"),
}
