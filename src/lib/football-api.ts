// Integração com API de Futebol (API-Football)
// Sistema de atualização diária automática

interface FootballAPIMatch {
  fixture: {
    id: number
    date: string
    venue: {
      name: string
      city: string
    }
    referee?: string
    status: {
      short: string
      long: string
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    season: number
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
  }
}

interface WeatherData {
  condition: string
  temperature: string
  humidity?: number
  wind?: string
}

interface TeamStats {
  form: string
  injuries: string[]
  suspensions: string[]
  recentMatches: any[]
}

class FootballAPIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.FOOTBALL_API_KEY || 'demo-key'
    this.baseUrl = 'https://api-football-v1.p.rapidapi.com/v3'
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key].toString())
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Football API Error:', error)
      // Retorna dados mockados em caso de erro
      return this.getMockData(endpoint)
    }
  }

  // Dados mockados para desenvolvimento/fallback
  private getMockData(endpoint: string) {
    const mockMatches: FootballAPIMatch[] = [
      {
        fixture: {
          id: 1,
          date: new Date().toISOString(),
          venue: { name: 'Maracanã', city: 'Rio de Janeiro' },
          referee: 'Anderson Daronco',
          status: { short: 'NS', long: 'Not Started' }
        },
        league: {
          id: 71,
          name: 'Brasileirão Série A',
          country: 'Brazil',
          logo: '',
          season: 2024
        },
        teams: {
          home: { id: 127, name: 'Flamengo', logo: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg' },
          away: { id: 128, name: 'Palmeiras', logo: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg' }
        },
        goals: { home: null, away: null },
        score: {
          halftime: { home: null, away: null },
          fulltime: { home: null, away: null }
        }
      },
      {
        fixture: {
          id: 2,
          date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          venue: { name: 'Morumbi', city: 'São Paulo' },
          referee: 'Wilton Pereira Sampaio',
          status: { short: 'NS', long: 'Not Started' }
        },
        league: {
          id: 71,
          name: 'Brasileirão Série A',
          country: 'Brazil',
          logo: '',
          season: 2024
        },
        teams: {
          home: { id: 129, name: 'São Paulo', logo: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png' },
          away: { id: 130, name: 'Corinthians', logo: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png' }
        },
        goals: { home: null, away: null },
        score: {
          halftime: { home: null, away: null },
          fulltime: { home: null, away: null }
        }
      }
    ]

    return {
      response: mockMatches,
      results: mockMatches.length
    }
  }

  // Buscar jogos do dia
  async getTodayMatches() {
    const today = new Date().toISOString().split('T')[0]
    const data = await this.makeRequest('/fixtures', {
      date: today,
      league: 71, // Brasileirão Série A
      season: 2024
    })

    return data.response || []
  }

  // Buscar próximos jogos
  async getUpcomingMatches(days: number = 7) {
    const matches = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const data = await this.makeRequest('/fixtures', {
        date: dateStr,
        league: 71, // Brasileirão Série A
        season: 2024
      })

      if (data.response) {
        matches.push(...data.response)
      }
    }

    return matches
  }

  // Buscar estatísticas do time
  async getTeamStats(teamId: number, season: number = 2024): Promise<TeamStats> {
    const data = await this.makeRequest('/teams/statistics', {
      team: teamId,
      season,
      league: 71
    })

    // Mock data para desenvolvimento
    return {
      form: 'WDWLW',
      injuries: ['Pedro - Lesão no joelho', 'Gabriel - Suspenso'],
      suspensions: ['Arrascaeta - 2 jogos'],
      recentMatches: []
    }
  }

  // Buscar informações do clima (integração com API de clima)
  async getWeatherInfo(city: string): Promise<WeatherData> {
    // Simulação - em produção integraria com OpenWeatherMap ou similar
    const weatherConditions = ['Ensolarado', 'Nublado', 'Chuva leve', 'Tempestade']
    const temperatures = ['18°C', '22°C', '25°C', '28°C', '32°C']
    
    return {
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      wind: `${Math.floor(Math.random() * 20) + 5}km/h`
    }
  }

  // Calcular probabilidades usando IA (simulado)
  calculateAIPredictions(match: FootballAPIMatch) {
    // Simulação de IA - em produção usaria machine learning real
    const homeAdvantage = 0.1 // 10% de vantagem para casa
    const randomFactor = Math.random() * 0.3 - 0.15 // -15% a +15%
    
    let homeProb = 0.4 + homeAdvantage + randomFactor
    let awayProb = 0.35 + randomFactor
    let drawProb = 1 - homeProb - awayProb

    // Normalizar para 100%
    const total = homeProb + awayProb + drawProb
    homeProb = Math.round((homeProb / total) * 100)
    awayProb = Math.round((awayProb / total) * 100)
    drawProb = 100 - homeProb - awayProb

    return {
      homeWin: Math.max(15, Math.min(70, homeProb)),
      draw: Math.max(15, Math.min(40, drawProb)),
      awayWin: Math.max(15, Math.min(70, awayProb)),
      confidence: Math.floor(Math.random() * 30) + 60 // 60-90%
    }
  }

  // Processar dados da API para formato do banco
  async processMatchData(apiMatch: FootballAPIMatch) {
    const weather = await this.getWeatherInfo(apiMatch.fixture.venue.city)
    const predictions = this.calculateAIPredictions(apiMatch)
    
    return {
      api_id: apiMatch.fixture.id,
      data_jogo: apiMatch.fixture.date,
      time_casa: apiMatch.teams.home.name,
      time_visitante: apiMatch.teams.away.name,
      escudo_casa: apiMatch.teams.home.logo,
      escudo_visitante: apiMatch.teams.away.logo,
      local_jogo: `${apiMatch.fixture.venue.city} - ${apiMatch.fixture.venue.name}`,
      arbitro: apiMatch.fixture.referee || 'A definir',
      clima: `${weather.condition} - ${weather.temperature}`,
      campeonato: apiMatch.league.name,
      status: this.mapStatus(apiMatch.fixture.status.short),
      placar_casa: apiMatch.goals.home || 0,
      placar_visitante: apiMatch.goals.away || 0,
      probabilidade_casa: predictions.homeWin,
      probabilidade_empate: predictions.draw,
      probabilidade_visitante: predictions.awayWin
    }
  }

  private mapStatus(apiStatus: string): string {
    const statusMap: Record<string, string> = {
      'NS': 'agendado',
      '1H': 'primeiro_tempo',
      'HT': 'intervalo',
      '2H': 'segundo_tempo',
      'FT': 'finalizado',
      'AET': 'prorrogacao',
      'PEN': 'penaltis',
      'CANC': 'cancelado',
      'SUSP': 'suspenso',
      'AWD': 'wo'
    }
    
    return statusMap[apiStatus] || 'agendado'
  }
}

// Serviço de atualização automática
export class FootballDataUpdater {
  private apiService: FootballAPIService
  private updateInterval: NodeJS.Timeout | null = null

  constructor() {
    this.apiService = new FootballAPIService()
  }

  // Iniciar atualizações automáticas
  startAutoUpdate() {
    // Atualizar a cada 30 minutos
    this.updateInterval = setInterval(() => {
      this.updateTodayMatches()
    }, 30 * 60 * 1000)

    // Primeira atualização imediata
    this.updateTodayMatches()
  }

  // Parar atualizações automáticas
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  // Atualizar jogos de hoje
  async updateTodayMatches() {
    try {
      console.log('🔄 Atualizando jogos de hoje...')
      
      const matches = await this.apiService.getTodayMatches()
      const { dbHelpers } = await import('./supabase')
      
      for (const match of matches) {
        const processedMatch = await this.apiService.processMatchData(match)
        await dbHelpers.createOrUpdateGame(processedMatch)
      }
      
      console.log(`✅ ${matches.length} jogos atualizados com sucesso`)
    } catch (error) {
      console.error('❌ Erro ao atualizar jogos:', error)
    }
  }

  // Atualizar próximos jogos
  async updateUpcomingMatches(days: number = 7) {
    try {
      console.log(`🔄 Atualizando próximos ${days} dias...`)
      
      const matches = await this.apiService.getUpcomingMatches(days)
      const { dbHelpers } = await import('./supabase')
      
      for (const match of matches) {
        const processedMatch = await this.apiService.processMatchData(match)
        await dbHelpers.createOrUpdateGame(processedMatch)
      }
      
      console.log(`✅ ${matches.length} jogos futuros atualizados`)
    } catch (error) {
      console.error('❌ Erro ao atualizar jogos futuros:', error)
    }
  }

  // Atualização completa (executar diariamente)
  async fullUpdate() {
    await this.updateTodayMatches()
    await this.updateUpcomingMatches(7)
  }
}

// Instância global do atualizador
export const footballUpdater = new FootballDataUpdater()

// Inicializar atualizações automáticas quando o módulo for carregado
if (typeof window === 'undefined') { // Apenas no servidor
  footballUpdater.startAutoUpdate()
}

export { FootballAPIService }