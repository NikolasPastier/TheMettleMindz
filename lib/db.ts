import { createClient } from "@/lib/supabase/server"

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
      const supabase = await createClient()
      const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single()

      if (error) throw error
      return data
    },

    async insert(data: any) {
      const supabase = await createClient()
      const { data: result, error } = await supabase.from(tableName).insert(data).select().single()

      if (error) throw error
      return result
    },

    async update(id: string, data: any) {
      const supabase = await createClient()
      const { data: result, error } = await supabase.from(tableName).update(data).eq("id", id).select().single()

      if (error) throw error
      return result
    },

    async delete(id: string) {
      const supabase = await createClient()
      const { data, error } = await supabase.from(tableName).delete().eq("id", id).select().single()

      if (error) throw error
      return data
    },

    async findBy(field: string, value: any) {
      const supabase = await createClient()
      const { data, error } = await supabase.from(tableName).select("*").eq(field, value)

      if (error) throw error
      return data || []
    },

    async findOne(field: string, value: any) {
      const supabase = await createClient()
      const { data, error } = await supabase.from(tableName).select("*").eq(field, value).single()

      if (error && error.code !== "PGRST116") throw error // PGRST116 is "not found"
      return data
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
