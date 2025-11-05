import axios from 'axios'

// API de dados esportivos em tempo real
const SPORTS_API_KEY = process.env.NEXT_PUBLIC_SPORTS_API_KEY || 'demo-key'
const BASE_URL = 'https://api.the-odds-api.com/v4'

export interface LiveMatch {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Array<{
    key: string
    title: string
    markets: Array<{
      key: string
      outcomes: Array<{
        name: string
        price: number
      }>
    }>
  }>
}

export interface LiveOdds {
  match_id: string
  home_win: number
  away_win: number
  draw: number
  over_2_5: number
  under_2_5: number
  both_teams_score_yes: number
  both_teams_score_no: number
  updated_at: string
}

// Simulador de API em tempo real (para demonstração)
export class SportsDataAPI {
  private static instance: SportsDataAPI
  private matches: LiveMatch[] = []
  private odds: Map<string, LiveOdds> = new Map()
  private updateInterval: NodeJS.Timeout | null = null

  static getInstance(): SportsDataAPI {
    if (!SportsDataAPI.instance) {
      SportsDataAPI.instance = new SportsDataAPI()
    }
    return SportsDataAPI.instance
  }

  // Dados simulados realistas
  private generateMockMatches(): LiveMatch[] {
    const teams = [
      { name: 'Flamengo', country: 'Brazil' },
      { name: 'Palmeiras', country: 'Brazil' },
      { name: 'São Paulo', country: 'Brazil' },
      { name: 'Corinthians', country: 'Brazil' },
      { name: 'Santos', country: 'Brazil' },
      { name: 'Grêmio', country: 'Brazil' },
      { name: 'Internacional', country: 'Brazil' },
      { name: 'Atlético-MG', country: 'Brazil' },
      { name: 'Botafogo', country: 'Brazil' },
      { name: 'Vasco', country: 'Brazil' },
      { name: 'Fluminense', country: 'Brazil' },
      { name: 'Cruzeiro', country: 'Brazil' }
    ]

    const matches: LiveMatch[] = []
    const today = new Date()
    
    for (let i = 0; i < 8; i++) {
      const homeTeam = teams[Math.floor(Math.random() * teams.length)]
      let awayTeam = teams[Math.floor(Math.random() * teams.length)]
      
      // Garantir que não seja o mesmo time
      while (awayTeam.name === homeTeam.name) {
        awayTeam = teams[Math.floor(Math.random() * teams.length)]
      }

      const matchTime = new Date(today)
      matchTime.setHours(14 + i * 2, Math.floor(Math.random() * 60), 0, 0)

      matches.push({
        id: `match_${i + 1}`,
        sport_key: 'soccer_brazil_serie_a',
        sport_title: 'Brasileirão Série A',
        commence_time: matchTime.toISOString(),
        home_team: homeTeam.name,
        away_team: awayTeam.name,
        bookmakers: [{
          key: 'bet365',
          title: 'Bet365',
          markets: [{
            key: 'h2h',
            outcomes: [
              { name: homeTeam.name, price: 1.8 + Math.random() * 2 },
              { name: awayTeam.name, price: 1.8 + Math.random() * 2 },
              { name: 'Draw', price: 2.8 + Math.random() * 1.5 }
            ]
          }]
        }]
      })
    }

    return matches
  }

  private generateLiveOdds(matchId: string): LiveOdds {
    return {
      match_id: matchId,
      home_win: 1.5 + Math.random() * 3,
      away_win: 1.5 + Math.random() * 3,
      draw: 2.8 + Math.random() * 1.5,
      over_2_5: 1.4 + Math.random() * 1.2,
      under_2_5: 2.2 + Math.random() * 1.8,
      both_teams_score_yes: 1.6 + Math.random() * 1.0,
      both_teams_score_no: 2.0 + Math.random() * 1.5,
      updated_at: new Date().toISOString()
    }
  }

  // Inicializar dados
  async initialize(): Promise<void> {
    this.matches = this.generateMockMatches()
    
    // Gerar odds iniciais para todos os jogos
    this.matches.forEach(match => {
      this.odds.set(match.id, this.generateLiveOdds(match.id))
    })

    // Iniciar atualizações automáticas a cada 30 segundos
    this.startLiveUpdates()
  }

  // Atualizações em tempo real
  private startLiveUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }

    this.updateInterval = setInterval(() => {
      // Atualizar odds com pequenas variações
      this.matches.forEach(match => {
        const currentOdds = this.odds.get(match.id)
        if (currentOdds) {
          // Pequenas variações nas odds (simulando mercado real)
          const variation = 0.95 + Math.random() * 0.1 // ±5%
          
          this.odds.set(match.id, {
            ...currentOdds,
            home_win: Math.max(1.1, currentOdds.home_win * variation),
            away_win: Math.max(1.1, currentOdds.away_win * variation),
            draw: Math.max(1.1, currentOdds.draw * variation),
            over_2_5: Math.max(1.1, currentOdds.over_2_5 * variation),
            under_2_5: Math.max(1.1, currentOdds.under_2_5 * variation),
            both_teams_score_yes: Math.max(1.1, currentOdds.both_teams_score_yes * variation),
            both_teams_score_no: Math.max(1.1, currentOdds.both_teams_score_no * variation),
            updated_at: new Date().toISOString()
          })
        }
      })

      // Disparar evento customizado para componentes React
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('oddsUpdated', {
          detail: { odds: Array.from(this.odds.entries()) }
        }))
      }
    }, 30000) // Atualizar a cada 30 segundos
  }

  // Métodos públicos
  async getTodayMatches(): Promise<LiveMatch[]> {
    if (this.matches.length === 0) {
      await this.initialize()
    }
    return this.matches
  }

  async getLiveOdds(matchId?: string): Promise<LiveOdds[]> {
    if (matchId) {
      const odds = this.odds.get(matchId)
      return odds ? [odds] : []
    }
    return Array.from(this.odds.values())
  }

  async getMatchById(matchId: string): Promise<LiveMatch | null> {
    return this.matches.find(match => match.id === matchId) || null
  }

  // Limpar recursos
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }
}

// Instância singleton
export const sportsAPI = SportsDataAPI.getInstance()

// Funções utilitárias
export const formatOdds = (odds: number): string => {
  return odds.toFixed(2)
}

export const calculatePotentialReturn = (stake: number, odds: number): number => {
  return stake * odds
}

export const calculateProfit = (stake: number, odds: number): number => {
  return calculatePotentialReturn(stake, odds) - stake
}

// Tipos de aposta disponíveis
export const BET_TYPES = {
  HOME_WIN: 'home_win',
  AWAY_WIN: 'away_win',
  DRAW: 'draw',
  OVER_2_5: 'over_2_5',
  UNDER_2_5: 'under_2_5',
  BOTH_TEAMS_SCORE_YES: 'both_teams_score_yes',
  BOTH_TEAMS_SCORE_NO: 'both_teams_score_no'
} as const

export type BetType = typeof BET_TYPES[keyof typeof BET_TYPES]