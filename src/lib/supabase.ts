import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  vip: boolean
  data_cadastro: string
}

export interface Pagamento {
  id: string
  usuario_id: string
  valor: number
  data_pagamento: string
  status: 'pendente' | 'pago' | 'cancelado'
}

export interface Jogo {
  id: string
  api_id?: number
  data_jogo: string
  time_casa: string
  time_visitante: string
  escudo_casa?: string
  escudo_visitante?: string
  local_jogo?: string
  arbitro?: string
  clima?: string
  campeonato?: string
  status: string
  placar_casa: number
  placar_visitante: number
  probabilidade_casa?: number
  probabilidade_empate?: number
  probabilidade_visitante?: number
  created_at: string
  updated_at: string
}

// Funções auxiliares para o banco
export const dbHelpers = {
  // Usuários
  async createUser(userData: Omit<Usuario, 'id' | 'data_cadastro'>) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUserVipStatus(userId: string, vip: boolean) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ vip })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Pagamentos
  async createPayment(paymentData: Omit<Pagamento, 'id'>) {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert([paymentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePaymentStatus(paymentId: string, status: Pagamento['status']) {
    const { data, error } = await supabase
      .from('pagamentos')
      .update({ status, data_pagamento: new Date().toISOString() })
      .eq('id', paymentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserPayments(userId: string) {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('usuario_id', userId)
      .order('data_pagamento', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Jogos
  async createOrUpdateGame(gameData: Omit<Jogo, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('jogos')
      .upsert([gameData], { 
        onConflict: 'api_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTodayGames() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .gte('data_jogo', `${today}T00:00:00`)
      .lt('data_jogo', `${today}T23:59:59`)
      .order('data_jogo', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getUpcomingGames(days: number = 7) {
    const today = new Date()
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .gte('data_jogo', today.toISOString())
      .lte('data_jogo', futureDate.toISOString())
      .order('data_jogo', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getGamesByChampionship(championship: string) {
    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .eq('campeonato', championship)
      .order('data_jogo', { ascending: true })
    
    if (error) throw error
    return data
  }
}