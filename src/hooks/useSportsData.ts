import { useState, useEffect } from 'react'
import { sportsAPI, LiveMatch, LiveOdds } from '@/lib/sportsAPI'

export const useLiveMatches = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const data = await sportsAPI.getTodayMatches()
        setMatches(data)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar jogos')
        console.error('Erro ao buscar jogos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  return { matches, loading, error, refetch: () => setLoading(true) }
}

export const useLiveOdds = (matchId?: string) => {
  const [odds, setOdds] = useState<LiveOdds[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const data = await sportsAPI.getLiveOdds(matchId)
        setOdds(data)
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Erro ao buscar odds:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOdds()

    // Escutar atualizações em tempo real
    const handleOddsUpdate = (event: CustomEvent) => {
      const updatedOdds = event.detail.odds as [string, LiveOdds][]
      
      if (matchId) {
        const matchOdds = updatedOdds.find(([id]) => id === matchId)
        if (matchOdds) {
          setOdds([matchOdds[1]])
          setLastUpdate(new Date())
        }
      } else {
        setOdds(updatedOdds.map(([, odds]) => odds))
        setLastUpdate(new Date())
      }
    }

    window.addEventListener('oddsUpdated', handleOddsUpdate as EventListener)

    return () => {
      window.removeEventListener('oddsUpdated', handleOddsUpdate as EventListener)
    }
  }, [matchId])

  return { odds, loading, lastUpdate }
}

export const useBettingCalculator = () => {
  const [stake, setStake] = useState(10)
  
  const calculateReturns = (odds: number) => {
    const potentialReturn = stake * odds
    const profit = potentialReturn - stake
    
    return {
      stake,
      odds,
      potentialReturn: Number(potentialReturn.toFixed(2)),
      profit: Number(profit.toFixed(2))
    }
  }

  return {
    stake,
    setStake,
    calculateReturns
  }
}