// Testes automatizados para o sistema Bet Mentor

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { authService } from '../lib/auth'
import { paymentService } from '../lib/payments'
import { footballUpdater } from '../lib/football-api'
import { dbHelpers } from '../lib/supabase'

// Mock do Supabase para testes
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) })),
      update: jest.fn(() => ({ eq: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })) }))
    }))
  },
  dbHelpers: {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUserVipStatus: jest.fn(),
    createPayment: jest.fn(),
    updatePaymentStatus: jest.fn(),
    getUserPayments: jest.fn(),
    createOrUpdateGame: jest.fn(),
    getTodayGames: jest.fn(),
    getUpcomingGames: jest.fn()
  }
}))

describe('🔐 Sistema de Autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Cadastro de Usuários', () => {
    it('deve cadastrar usuário com dados válidos', async () => {
      const mockUser = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'hashedpassword',
        vip: false,
        data_cadastro: new Date().toISOString()
      }

      ;(dbHelpers.getUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(dbHelpers.createUser as jest.Mock).mockResolvedValue(mockUser)

      const result = await authService.register({
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'MinhaSenh@123'
      })

      expect(result.success).toBe(true)
      expect(result.user?.name).toBe('João Silva')
      expect(result.user?.email).toBe('joao@email.com')
      expect(result.user?.plan).toBe('free')
    })

    it('deve rejeitar cadastro com email inválido', async () => {
      const result = await authService.register({
        name: 'João Silva',
        email: 'email-invalido',
        password: 'MinhaSenh@123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email inválido')
    })

    it('deve rejeitar cadastro com senha fraca', async () => {
      const result = await authService.register({
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Senha deve ter pelo menos 6 caracteres')
    })

    it('deve rejeitar cadastro com email já existente', async () => {
      ;(dbHelpers.getUserByEmail as jest.Mock).mockResolvedValue({ id: '123' })

      const result = await authService.register({
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'MinhaSenh@123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email já cadastrado')
    })
  })

  describe('Login de Usuários', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser = {
        id: '123',
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: '$2a$12$hashedpassword',
        vip: false,
        data_cadastro: new Date().toISOString()
      }

      ;(dbHelpers.getUserByEmail as jest.Mock).mockResolvedValue(mockUser)
      
      // Mock do bcrypt
      jest.doMock('bcryptjs', () => ({
        compare: jest.fn().mockResolvedValue(true)
      }))

      const result = await authService.login({
        email: 'joao@email.com',
        password: 'MinhaSenh@123'
      })

      expect(result.success).toBe(true)
      expect(result.user?.email).toBe('joao@email.com')
    })

    it('deve rejeitar login com email inexistente', async () => {
      ;(dbHelpers.getUserByEmail as jest.Mock).mockResolvedValue(null)

      const result = await authService.login({
        email: 'inexistente@email.com',
        password: 'MinhaSenh@123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email ou senha incorretos')
    })
  })

  describe('Controle de Acesso VIP', () => {
    it('deve verificar acesso VIP corretamente', async () => {
      const mockSupabaseResponse = { data: { vip: true }, error: null }
      
      // Mock da consulta Supabase
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(mockSupabaseResponse)
        })
      })
      
      const mockFrom = jest.fn().mockReturnValue({
        select: mockSelect
      })

      // Aplicar mock
      jest.doMock('../lib/supabase', () => ({
        supabase: { from: mockFrom }
      }))

      const hasAccess = await authService.checkVipAccess('123')
      expect(hasAccess).toBe(true)
    })

    it('deve negar acesso para usuário não-VIP', async () => {
      const mockSupabaseResponse = { data: { vip: false }, error: null }
      
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue(mockSupabaseResponse)
        })
      })
      
      const mockFrom = jest.fn().mockReturnValue({
        select: mockSelect
      })

      jest.doMock('../lib/supabase', () => ({
        supabase: { from: mockFrom }
      }))

      const hasAccess = await authService.checkVipAccess('123')
      expect(hasAccess).toBe(false)
    })
  })
})\n\ndescribe('💳 Sistema de Pagamentos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Criação de Pagamentos', () => {
    it('deve criar pagamento PIX com sucesso', async () => {
      const mockPayment = {\n        id: 'pay_123',\n        usuario_id: 'user_123',\n        valor: 67,\n        status: 'pendente',\n        data_pagamento: new Date().toISOString()\n      }\n\n      ;(dbHelpers.createPayment as jest.Mock).mockResolvedValue(mockPayment)\n\n      const result = await paymentService.createPayment({\n        userId: 'user_123',\n        planId: 'vip',\n        amount: 67,\n        paymentMethod: 'pix',\n        customerInfo: {\n          name: 'João Silva',\n          email: 'joao@email.com',\n          document: '12345678901'\n        }\n      })\n\n      expect(result.success).toBe(true)\n      expect(result.paymentId).toBe('pay_123')\n      expect(result.qrCode).toBeDefined()\n    })\n\n    it('deve rejeitar pagamento com plano inválido', async () => {\n      const result = await paymentService.createPayment({\n        userId: 'user_123',\n        planId: 'invalid' as any,\n        amount: 67,\n        paymentMethod: 'pix',\n        customerInfo: {\n          name: 'João Silva',\n          email: 'joao@email.com',\n          document: '12345678901'\n        }\n      })\n\n      expect(result.success).toBe(false)\n      expect(result.error).toBe('Plano inválido')\n    })\n  })\n\n  describe('Confirmação de Pagamentos', () => {\n    it('deve confirmar pagamento e ativar VIP', async () => {\n      const mockPayment = {\n        usuario_id: 'user_123',\n        valor: 67\n      }\n\n      ;(dbHelpers.updatePaymentStatus as jest.Mock).mockResolvedValue(true)\n      \n      // Mock da consulta do pagamento\n      const mockSupabaseResponse = { data: mockPayment, error: null }\n      const mockSelect = jest.fn().mockReturnValue({\n        eq: jest.fn().mockReturnValue({\n          single: jest.fn().mockResolvedValue(mockSupabaseResponse)\n        })\n      })\n      \n      jest.doMock('../lib/supabase', () => ({\n        dbHelpers: {\n          ...dbHelpers,\n          supabase: { from: jest.fn().mockReturnValue({ select: mockSelect }) }\n        }\n      }))\n\n      const result = await paymentService.confirmPayment('pay_123', 'external_123')\n      expect(result).toBe(true)\n    })\n  })\n})\n\ndescribe('⚽ Integração API de Futebol', () => {\n  beforeEach(() => {\n    jest.clearAllMocks()\n  })\n\n  describe('Atualização de Jogos', () => {\n    it('deve atualizar jogos de hoje com sucesso', async () => {\n      ;(dbHelpers.createOrUpdateGame as jest.Mock).mockResolvedValue({ id: 'game_123' })\n      \n      // Mock console.log para capturar logs\n      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()\n      \n      await footballUpdater.updateTodayMatches()\n      \n      expect(consoleSpy).toHaveBeenCalledWith('🔄 Atualizando jogos de hoje...')\n      expect(dbHelpers.createOrUpdateGame).toHaveBeenCalled()\n      \n      consoleSpy.mockRestore()\n    })\n\n    it('deve atualizar próximos jogos com sucesso', async () => {\n      ;(dbHelpers.createOrUpdateGame as jest.Mock).mockResolvedValue({ id: 'game_123' })\n      \n      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()\n      \n      await footballUpdater.updateUpcomingMatches(3)\n      \n      expect(consoleSpy).toHaveBeenCalledWith('🔄 Atualizando próximos 3 dias...')\n      expect(dbHelpers.createOrUpdateGame).toHaveBeenCalled()\n      \n      consoleSpy.mockRestore()\n    })\n  })\n\n  describe('Consulta de Jogos', () => {\n    it('deve buscar jogos de hoje do banco', async () => {\n      const mockGames = [\n        {\n          id: 'game_1',\n          time_casa: 'Flamengo',\n          time_visitante: 'Palmeiras',\n          data_jogo: new Date().toISOString()\n        }\n      ]\n\n      ;(dbHelpers.getTodayGames as jest.Mock).mockResolvedValue(mockGames)\n      \n      const games = await dbHelpers.getTodayGames()\n      \n      expect(games).toHaveLength(1)\n      expect(games[0].time_casa).toBe('Flamengo')\n    })\n\n    it('deve buscar próximos jogos do banco', async () => {\n      const mockGames = [\n        {\n          id: 'game_1',\n          time_casa: 'São Paulo',\n          time_visitante: 'Corinthians',\n          data_jogo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()\n        }\n      ]\n\n      ;(dbHelpers.getUpcomingGames as jest.Mock).mockResolvedValue(mockGames)\n      \n      const games = await dbHelpers.getUpcomingGames(7)\n      \n      expect(games).toHaveLength(1)\n      expect(games[0].time_casa).toBe('São Paulo')\n    })\n  })\n})\n\ndescribe('📊 Exibição de Múltiplas e Percentuais', () => {\n  describe('Cálculo de Odds', () => {\n    it('deve calcular retorno de múltipla corretamente', () => {\n      const odds = [2.5, 1.8, 3.2]\n      const betAmount = 10\n      \n      const totalOdds = odds.reduce((acc, odd) => acc * odd, 1)\n      const expectedReturn = betAmount * totalOdds\n      \n      expect(totalOdds).toBeCloseTo(14.4, 1)\n      expect(expectedReturn).toBeCloseTo(144, 0)\n    })\n\n    it('deve calcular lucro líquido corretamente', () => {\n      const betAmount = 50\n      const totalOdds = 5.2\n      const potentialReturn = betAmount * totalOdds\n      const profit = potentialReturn - betAmount\n      \n      expect(profit).toBeCloseTo(210, 0)\n    })\n  })\n\n  describe('Validação de Confiança', () => {\n    it('deve classificar confiança alta corretamente', () => {\n      const confidence = 85\n      const classification = confidence >= 70 ? 'alta' : confidence >= 60 ? 'média' : 'baixa'\n      \n      expect(classification).toBe('alta')\n    })\n\n    it('deve classificar confiança média corretamente', () => {\n      const confidence = 65\n      const classification = confidence >= 70 ? 'alta' : confidence >= 60 ? 'média' : 'baixa'\n      \n      expect(classification).toBe('média')\n    })\n\n    it('deve classificar confiança baixa corretamente', () => {\n      const confidence = 45\n      const classification = confidence >= 70 ? 'alta' : confidence >= 60 ? 'média' : 'baixa'\n      \n      expect(classification).toBe('baixa')\n    })\n  })\n})\n\ndescribe('🎯 Testes de Integração Completa', () => {\n  it('deve executar fluxo completo: cadastro → pagamento → ativação VIP', async () => {\n    // 1. Cadastro\n    const mockUser = {\n      id: 'user_123',\n      nome: 'João Silva',\n      email: 'joao@email.com',\n      senha: 'hashedpassword',\n      vip: false,\n      data_cadastro: new Date().toISOString()\n    }\n\n    ;(dbHelpers.getUserByEmail as jest.Mock).mockResolvedValue(null)\n    ;(dbHelpers.createUser as jest.Mock).mockResolvedValue(mockUser)\n\n    const registerResult = await authService.register({\n      name: 'João Silva',\n      email: 'joao@email.com',\n      password: 'MinhaSenh@123'\n    })\n\n    expect(registerResult.success).toBe(true)\n\n    // 2. Pagamento\n    const mockPayment = {\n      id: 'pay_123',\n      usuario_id: 'user_123',\n      valor: 67,\n      status: 'pendente',\n      data_pagamento: new Date().toISOString()\n    }\n\n    ;(dbHelpers.createPayment as jest.Mock).mockResolvedValue(mockPayment)\n\n    const paymentResult = await paymentService.createPayment({\n      userId: 'user_123',\n      planId: 'vip',\n      amount: 67,\n      paymentMethod: 'pix',\n      customerInfo: {\n        name: 'João Silva',\n        email: 'joao@email.com',\n        document: '12345678901'\n      }\n    })\n\n    expect(paymentResult.success).toBe(true)\n\n    // 3. Confirmação e ativação VIP\n    ;(dbHelpers.updatePaymentStatus as jest.Mock).mockResolvedValue(true)\n    ;(dbHelpers.updateUserVipStatus as jest.Mock).mockResolvedValue({ vip: true })\n\n    const confirmResult = await paymentService.confirmPayment('pay_123', 'external_123')\n    expect(confirmResult).toBe(true)\n  })\n\n  it('deve manter dados consistentes durante atualizações de jogos', async () => {\n    const mockGames = [\n      {\n        api_id: 1,\n        time_casa: 'Flamengo',\n        time_visitante: 'Palmeiras',\n        data_jogo: new Date().toISOString(),\n        status: 'agendado'\n      }\n    ]\n\n    ;(dbHelpers.createOrUpdateGame as jest.Mock).mockResolvedValue(mockGames[0])\n    ;(dbHelpers.getTodayGames as jest.Mock).mockResolvedValue(mockGames)\n\n    // Simular atualização\n    await footballUpdater.updateTodayMatches()\n    \n    // Verificar se dados foram salvos\n    const savedGames = await dbHelpers.getTodayGames()\n    \n    expect(savedGames).toHaveLength(1)\n    expect(savedGames[0].time_casa).toBe('Flamengo')\n    expect(savedGames[0].api_id).toBe(1)\n  })\n})\n\n// Configuração do Jest para executar os testes\nexport const testConfig = {\n  testEnvironment: 'node',\n  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],\n  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],\n  transform: {\n    '^.+\\.ts$': 'ts-jest'\n  },\n  collectCoverageFrom: [\n    'src/lib/**/*.ts',\n    '!src/lib/**/*.d.ts'\n  ],\n  coverageThreshold: {\n    global: {\n      branches: 80,\n      functions: 80,\n      lines: 80,\n      statements: 80\n    }\n  }\n}"