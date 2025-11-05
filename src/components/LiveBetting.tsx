'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, Activity, Clock, Zap, 
  Target, BarChart3, Wifi, WifiOff, RefreshCw,
  Calculator, DollarSign, Trophy, AlertCircle
} from 'lucide-react'
import { useLiveMatches, useLiveOdds, useBettingCalculator } from '@/hooks/useSportsData'
import { formatOdds, calculatePotentialReturn, BET_TYPES } from '@/lib/sportsAPI'

interface LiveBettingProps {
  onClose?: () => void
}

// Mapeamento dos escudos dos times brasileiros com as imagens fornecidas
const TEAM_LOGOS: { [key: string]: string } = {
  // Escudos fornecidos pelo usuário
  'Santos': 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg',
  'Grêmio': 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg',
  'Palmeiras': 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg',
  'São Paulo': 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png',
  'Corinthians': 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png',
  
  // Outros times com escudos genéricos
  'Flamengo': 'https://logoeps.com/wp-content/uploads/2013/03/flamengo-vector-logo.png',
  'Vasco': 'https://logoeps.com/wp-content/uploads/2013/03/vasco-da-gama-vector-logo.png',
  'Botafogo': 'https://logoeps.com/wp-content/uploads/2013/03/botafogo-vector-logo.png',
  'Fluminense': 'https://logoeps.com/wp-content/uploads/2013/03/fluminense-vector-logo.png',
  'Internacional': 'https://logoeps.com/wp-content/uploads/2013/03/internacional-vector-logo.png',
  'Atlético-MG': 'https://logoeps.com/wp-content/uploads/2013/03/atletico-mineiro-vector-logo.png',
  'Cruzeiro': 'https://logoeps.com/wp-content/uploads/2013/03/cruzeiro-vector-logo.png',
  'Bahia': 'https://logoeps.com/wp-content/uploads/2013/03/bahia-vector-logo.png',
  'Vitória': 'https://logoeps.com/wp-content/uploads/2013/03/vitoria-vector-logo.png',
  'Sport': 'https://logoeps.com/wp-content/uploads/2013/03/sport-recife-vector-logo.png',
  'Ceará': 'https://logoeps.com/wp-content/uploads/2013/03/ceara-vector-logo.png',
  'Fortaleza': 'https://logoeps.com/wp-content/uploads/2013/03/fortaleza-vector-logo.png',
  'Athletico-PR': 'https://logoeps.com/wp-content/uploads/2013/03/atletico-paranaense-vector-logo.png',
  'Coritiba': 'https://logoeps.com/wp-content/uploads/2013/03/coritiba-vector-logo.png',
  'Cuiabá': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop&crop=center',
  'Bragantino': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Juventude': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Goiás': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'América-MG': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Avaí': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Chapecoense': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'CRB': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Guarani': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Náutico': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Ponte Preta': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Sampaio Corrêa': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Vila Nova': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Tombense': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Londrina': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Operário-PR': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Ituano': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Mirassol': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'Novorizontino': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center',
  'ABC': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center'
}

const getTeamLogo = (teamName: string): string => {
  // Busca exata primeiro
  if (TEAM_LOGOS[teamName]) {
    return TEAM_LOGOS[teamName]
  }
  
  // Busca parcial (para nomes com variações)
  const partialMatch = Object.keys(TEAM_LOGOS).find(key => 
    teamName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(teamName.toLowerCase())
  )
  
  if (partialMatch) {
    return TEAM_LOGOS[partialMatch]
  }
  
  // Fallback para escudo genérico
  return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center'
}

const LiveBetting = ({ onClose }: LiveBettingProps) => {
  const { matches, loading: matchesLoading, error } = useLiveMatches()
  const { odds, loading: oddsLoading, lastUpdate } = useLiveOdds()
  const { stake, setStake, calculateReturns } = useBettingCalculator()
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [selectedBet, setSelectedBet] = useState<{ type: string; odds: number } | null>(null)
  const [isConnected, setIsConnected] = useState(true)

  // Simular status de conexão
  useEffect(() => {
    const interval = setInterval(() => {
      // 95% chance de estar conectado (simula conexão estável)
      setIsConnected(Math.random() > 0.05)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMatchOdds = (matchId: string) => {
    return odds.find(o => o.match_id === matchId)
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const getBetTypeLabel = (type: string) => {
    const labels = {
      [BET_TYPES.HOME_WIN]: 'Vitória Casa',
      [BET_TYPES.AWAY_WIN]: 'Vitória Fora',
      [BET_TYPES.DRAW]: 'Empate',
      [BET_TYPES.OVER_2_5]: 'Mais de 2.5 gols',
      [BET_TYPES.UNDER_2_5]: 'Menos de 2.5 gols',
      [BET_TYPES.BOTH_TEAMS_SCORE_YES]: 'Ambos marcam',
      [BET_TYPES.BOTH_TEAMS_SCORE_NO]: 'Ambos não marcam'
    }
    return labels[type as keyof typeof labels] || type
  }

  const placeBet = () => {
    if (!selectedBet || !selectedMatch) return
    
    // Aqui seria integrado com o sistema de apostas real
    alert(`Aposta realizada!\nJogo: ${selectedMatch}\nTipo: ${getBetTypeLabel(selectedBet.type)}\nOdd: ${formatOdds(selectedBet.odds)}\nValor: R$ ${stake}\nRetorno potencial: R$ ${calculatePotentialReturn(stake, selectedBet.odds).toFixed(2)}`)
    
    // Resetar seleção
    setSelectedBet(null)
    setSelectedMatch(null)
  }

  if (matchesLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto text-yellow-400" />
          <p className="text-lg">Carregando apostas em tempo real...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
          <p className="text-lg text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header com status de conexão */}
      <div className="bg-black p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            {lastUpdate && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs">
                  Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-full">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-bold">AO VIVO</span>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats em tempo real */}
      <div className="p-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Jogos Ativos</span>
            </div>
            <p className="text-2xl font-bold">{matches.length}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Odds Médias</span>
            </div>
            <p className="text-2xl font-bold">
              {odds.length > 0 ? 
                (odds.reduce((acc, o) => acc + o.home_win, 0) / odds.length).toFixed(2) : 
                '0.00'
              }
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Atualizações</span>
            </div>
            <p className="text-2xl font-bold">30s</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Mercados</span>
            </div>
            <p className="text-2xl font-bold">{matches.length * 7}</p>
          </div>
        </div>
      </div>

      {/* Lista de jogos com odds em tempo real */}
      <div className="p-4 space-y-4">
        {matches.map((match) => {
          const matchOdds = getMatchOdds(match.id)
          const isSelected = selectedMatch === match.id

          return (
            <div 
              key={match.id} 
              className={`bg-gray-800 rounded-xl p-6 border-2 transition-all ${
                isSelected ? 'border-yellow-400 bg-gray-700' : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Cabeçalho do jogo */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 px-2 py-1 rounded text-xs font-bold">
                    AO VIVO
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatDate(match.commence_time)} • {formatTime(match.commence_time)}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-400">{match.sport_title}</p>
                </div>
              </div>

              {/* Times com escudos reais fornecidos pelo usuário */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 mx-auto mb-3 relative">
                    <img 
                      src={getTeamLogo(match.home_team)}
                      alt={`Escudo ${match.home_team}`}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-600 shadow-lg"
                      onError={(e) => {
                        // Fallback se a imagem não carregar
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center'
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">H</span>
                    </div>
                  </div>
                  <p className="font-bold text-lg">{match.home_team}</p>
                  <p className="text-xs text-gray-400">Casa</p>
                </div>
                
                <div className="text-center px-4">
                  <p className="text-3xl font-bold text-gray-400 mb-2">VS</p>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Live</span>
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="w-16 h-16 mx-auto mb-3 relative">
                    <img 
                      src={getTeamLogo(match.away_team)}
                      alt={`Escudo ${match.away_team}`}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-600 shadow-lg"
                      onError={(e) => {
                        // Fallback se a imagem não carregar
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop&crop=center'
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">A</span>
                    </div>
                  </div>
                  <p className="font-bold text-lg">{match.away_team}</p>
                  <p className="text-xs text-gray-400">Fora</p>
                </div>
              </div>

              {/* Odds em tempo real */}
              {matchOdds && (
                <div className="space-y-4">
                  {/* Resultado Final */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Resultado Final</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.HOME_WIN, odds: matchOdds.home_win })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.HOME_WIN && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Casa</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.home_win)}</p>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.DRAW, odds: matchOdds.draw })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.DRAW && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Empate</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.draw)}</p>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.AWAY_WIN, odds: matchOdds.away_win })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.AWAY_WIN && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Fora</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.away_win)}</p>
                      </button>
                    </div>
                  </div>

                  {/* Mercado de Gols */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Total de Gols</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.OVER_2_5, odds: matchOdds.over_2_5 })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.OVER_2_5 && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Mais de 2.5</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.over_2_5)}</p>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.UNDER_2_5, odds: matchOdds.under_2_5 })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.UNDER_2_5 && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Menos de 2.5</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.under_2_5)}</p>
                      </button>
                    </div>
                  </div>

                  {/* Ambos Marcam */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Ambos os Times Marcam</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.BOTH_TEAMS_SCORE_YES, odds: matchOdds.both_teams_score_yes })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.BOTH_TEAMS_SCORE_YES && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Sim</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.both_teams_score_yes)}</p>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id)
                          setSelectedBet({ type: BET_TYPES.BOTH_TEAMS_SCORE_NO, odds: matchOdds.both_teams_score_no })
                        }}
                        className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all ${
                          selectedBet?.type === BET_TYPES.BOTH_TEAMS_SCORE_NO && selectedMatch === match.id
                            ? 'ring-2 ring-yellow-400 bg-yellow-400/20'
                            : ''
                        }`}
                      >
                        <p className="text-xs text-gray-400 mb-1">Não</p>
                        <p className="font-bold text-green-400">{formatOdds(matchOdds.both_teams_score_no)}</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Calculadora de aposta flutuante */}
      {selectedBet && selectedMatch && (
        <div className="fixed bottom-4 left-4 right-4 bg-black border border-yellow-400 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-yellow-400">Calculadora de Aposta</h3>
            </div>
            <button
              onClick={() => {
                setSelectedBet(null)
                setSelectedMatch(null)
              }}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Aposta Selecionada</p>
              <p className="font-medium">{getBetTypeLabel(selectedBet.type)}</p>
              <p className="text-sm text-green-400">Odd: {formatOdds(selectedBet.odds)}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Valor da Aposta (R$)</label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                min="1"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Retorno Total</p>
                <p className="font-bold text-green-400">
                  R$ {calculatePotentialReturn(stake, selectedBet.odds).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Lucro Líquido</p>
                <p className="font-bold text-yellow-400">
                  R$ {(calculatePotentialReturn(stake, selectedBet.odds) - stake).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={placeBet}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Confirmar Aposta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveBetting