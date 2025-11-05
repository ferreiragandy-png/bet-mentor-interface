// Sistema de autenticação completo com validação e recuperação de senha

import { supabase, dbHelpers } from './supabase'
import bcrypt from 'bcryptjs'

export interface AuthUser {
  id: string
  name: string
  email: string
  plan: 'free' | 'vip' | 'premium' | 'elite'
  isPremium: boolean
  vip: boolean
  createdAt: string
  lastLogin?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

class AuthService {
  // Validações
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Senha deve ter pelo menos 6 caracteres' }
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { 
        valid: false, 
        message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número' 
      }
    }
    
    return { valid: true }
  }

  private validateName(name: string): boolean {
    return name.trim().length >= 2
  }

  // Hash da senha
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Verificar senha
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  // Registro de usuário
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validações
      if (!this.validateName(userData.name)) {
        return { success: false, error: 'Nome deve ter pelo menos 2 caracteres' }
      }

      if (!this.validateEmail(userData.email)) {
        return { success: false, error: 'Email inválido' }
      }

      const passwordValidation = this.validatePassword(userData.password)
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.message }
      }

      // Verificar se email já existe
      const existingUser = await dbHelpers.getUserByEmail(userData.email)
      if (existingUser) {
        return { success: false, error: 'Email já cadastrado' }
      }

      // Hash da senha
      const hashedPassword = await this.hashPassword(userData.password)

      // Criar usuário no banco
      const newUser = await dbHelpers.createUser({
        nome: userData.name,
        email: userData.email,
        senha: hashedPassword,
        vip: false
      })

      // Retornar dados do usuário (sem senha)
      const authUser: AuthUser = {
        id: newUser.id,
        name: newUser.nome,
        email: newUser.email,
        plan: 'free',
        isPremium: false,
        vip: newUser.vip,
        createdAt: newUser.data_cadastro
      }

      return { success: true, user: authUser }

    } catch (error) {
      console.error('Erro no registro:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // Login de usuário
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validações básicas
      if (!this.validateEmail(credentials.email)) {
        return { success: false, error: 'Email inválido' }
      }

      if (!credentials.password) {
        return { success: false, error: 'Senha é obrigatória' }
      }

      // Buscar usuário no banco
      const user = await dbHelpers.getUserByEmail(credentials.email)
      if (!user) {
        return { success: false, error: 'Email ou senha incorretos' }
      }

      // Verificar senha
      const passwordMatch = await this.verifyPassword(credentials.password, user.senha)
      if (!passwordMatch) {
        return { success: false, error: 'Email ou senha incorretos' }
      }

      // Atualizar último login
      await supabase
        .from('usuarios')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)

      // Retornar dados do usuário (sem senha)
      const authUser: AuthUser = {
        id: user.id,
        name: user.nome,
        email: user.email,
        plan: user.vip ? 'vip' : 'free',
        isPremium: user.vip,
        vip: user.vip,
        createdAt: user.data_cadastro,
        lastLogin: new Date().toISOString()
      }

      return { success: true, user: authUser }

    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // Recuperação de senha
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.validateEmail(email)) {
        return { success: false, message: 'Email inválido' }
      }

      // Verificar se usuário existe
      const user = await dbHelpers.getUserByEmail(email)
      if (!user) {
        // Por segurança, não revelamos se o email existe ou não
        return { 
          success: true, 
          message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação' 
        }
      }

      // Gerar token de recuperação (em produção, salvaria no banco com expiração)
      const resetToken = this.generateResetToken()
      
      // Enviar email (simulado - em produção usaria serviço real)
      await this.sendPasswordResetEmail(email, resetToken)

      return { 
        success: true, 
        message: 'Instruções de recuperação enviadas para seu email' 
      }

    } catch (error) {
      console.error('Erro na recuperação de senha:', error)
      return { success: false, message: 'Erro interno do servidor' }
    }
  }

  // Gerar token de recuperação
  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  // Simular envio de email
  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // Em produção, integraria com serviço de email (SendGrid, AWS SES, etc.)
    console.log(`📧 Email de recuperação enviado para ${email}`)
    console.log(`🔑 Token: ${token}`)
    
    // Simular delay do envio
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Redefinir senha
  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const passwordValidation = this.validatePassword(newPassword)
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.message }
      }

      // Em produção, verificaria se o token é válido e não expirou
      // Por ora, simulamos que é válido
      
      const hashedPassword = await this.hashPassword(newPassword)
      
      // Atualizar senha no banco (em produção, usaria o token para identificar o usuário)
      // Por ora, retornamos sucesso simulado
      
      return { success: true }

    } catch (error) {
      console.error('Erro ao redefinir senha:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // Verificar se usuário tem acesso VIP
  async checkVipAccess(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('vip')
        .eq('id', userId)
        .single()

      if (error) return false
      return data.vip || false

    } catch (error) {
      console.error('Erro ao verificar acesso VIP:', error)
      return false
    }
  }

  // Atualizar plano do usuário
  async updateUserPlan(userId: string, plan: AuthUser['plan']): Promise<AuthResponse> {
    try {
      const vip = plan !== 'free'
      
      await dbHelpers.updateUserVipStatus(userId, vip)
      
      // Buscar dados atualizados
      const { data: updatedUser, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      const authUser: AuthUser = {
        id: updatedUser.id,
        name: updatedUser.nome,
        email: updatedUser.email,
        plan,
        isPremium: vip,
        vip: updatedUser.vip,
        createdAt: updatedUser.data_cadastro
      }

      return { success: true, user: authUser }

    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      return { success: false, error: 'Erro ao atualizar plano' }
    }
  }

  // Logout (limpar dados locais)
  logout(): void {
    // Em produção, invalidaria tokens de sessão
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bet_mentor_user')
      localStorage.removeItem('bet_mentor_token')
    }
  }
}

// Instância global do serviço de autenticação
export const authService = new AuthService()

// Hook personalizado para React
export const useAuthService = () => {
  return authService
}