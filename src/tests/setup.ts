// Configuração de setup para os testes
import { jest } from '@jest/globals'

// Mock global do localStorage para testes
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Aplicar mock globalmente
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock global do fetch para testes de API
global.fetch = jest.fn()

// Mock do console para evitar logs desnecessários nos testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}

// Configurar timezone para testes consistentes
process.env.TZ = 'America/Sao_Paulo'

// Mock das variáveis de ambiente
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.FOOTBALL_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Limpar mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

// Configurar timeout para testes assíncronos
jest.setTimeout(10000)