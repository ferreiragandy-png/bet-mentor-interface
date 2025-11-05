'use client'

import { useState } from 'react'
import { 
  Shield, Star, Calendar, Clock, Users, Zap, CheckCircle, 
  ArrowRight, Menu, X, Home, User, Settings, Eye, Lock, 
  Unlock, Circle, Play, ChevronRight, Award, TrendingUp
} from 'lucide-react'

// Dados mockados realistas com escudos reais dos times
const todayMatches = [
  {
    id: 1,
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    homeShield: "https://logoeps.com/wp-content/uploads/2013/03/flamengo-vector-logo.png",
    awayShield: "https://logoeps.com/wp-content/uploads/2013/03/palmeiras-vector-logo.png",
    time: "16:00",
    prediction: "Casa",
    confidence: 78,
    odds: 2.45,
    factors: ["Mando de campo", "Histórico favorável", "Escalação completa"]
  },
  {
    id: 2,
    homeTeam: "São Paulo",
    awayTeam: "Corinthians",
    homeShield: "https://logoeps.com/wp-content/uploads/2013/03/sao-paulo-vector-logo.png",
    awayShield: "https://logoeps.com/wp-content/uploads/2013/03/corinthians-vector-logo.png",
    time: "18:30",
    prediction: "Empate",
    confidence: 65,
    odds: 3.20,
    factors: ["Clássico equilibrado", "Ambos com desfalques", "Árbitro experiente"]
  },
  {
    id: 3,
    homeTeam: "Santos",
    awayTeam: "Grêmio",
    homeShield: "https://logoeps.com/wp-content/uploads/2013/03/santos-vector-logo.png",
    awayShield: "https://logoeps.com/wp-content/uploads/2013/03/gremio-vector-logo.png",
    time: "20:00",
    prediction: "Fora",
    confidence: 72,
    odds: 2.80,
    factors: ["Visitante em boa fase", "Casa com problemas", "Clima favorável"]
  }
]

const multiplesSuggestions = [
  {
    id: 1,
    name: "Combo Seguro",
    matches: ["Flamengo vs Palmeiras", "Internacional vs Bahia", "Atlético-MG vs Botafogo"],
    totalOdds: 4.85,
    confidence: 68,
    investment: "R$ 50",
    potentialReturn: "R$ 242,50"
  },
  {
    id: 2,
    name: "Combo Ousado",
    matches: ["São Paulo vs Corinthians", "Santos vs Grêmio", "Vasco vs Fluminense"],
    totalOdds: 12.40,
    confidence: 45,
    investment: "R$ 20",
    potentialReturn: "R$ 248,00"
  }
]

const previousHits = [
  {
    date: "15/01/2024",
    combo: "Tripla Certeira",
    matches: 3,
    odds: 5.20,
    result: "✅ Acertou",
    profit: "R$ 260,00"
  },
  {
    date: "14/01/2024",
    combo: "Dupla Segura",
    matches: 2,
    odds: 3.40,
    result: "✅ Acertou",
    profit: "R$ 170,00"
  },
  {
    date: "13/01/2024",
    combo: "Quádrupla Premium",
    matches: 4,
    odds: 8.90,
    result: "✅ Acertou",
    profit: "R$ 445,00"
  }
]

export default function BetMentor() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  // Tela de Boas-vindas
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-black">Bet Mentor</h1>
          <p className="text-xl text-black/80 font-medium">
            Previsões de IA para suas apostas esportivas
          </p>
        </div>
        
        <div className="space-y-4 text-black/70">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-black" />
            <span>Análise com Inteligência Artificial</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-black" />
            <span>Histórico comprovado de acertos</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-black" />
            <span>Múltiplas com alta probabilidade</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('login')}
          className="w-full bg-black text-yellow-400 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Começar Agora
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Tela de Login/Cadastro
  const LoginScreen = () => (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-white">Entrar</h2>
            <p className="text-gray-400 mt-2">Acesse sua conta Bet Mentor</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Sua senha"
                className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setUser({ name: 'João Silva', isPremium: false })
                setCurrentScreen('home')
              }}
              className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all duration-300"
            >
              Entrar
            </button>
            
            <button className="w-full bg-transparent border-2 border-yellow-400 text-yellow-400 py-4 px-6 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition-all duration-300">
              Criar Conta Grátis
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Ao continuar, você aceita nossos termos de uso
          </p>
        </div>
      </div>
    </div>
  )

  // Header com navegação
  const Header = () => (
    <div className="bg-black text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-lg">Bet Mentor</span>
      </div>
      
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 hover:bg-gray-800 rounded-lg"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  )

  // Menu lateral
  const SideMenu = () => (
    <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed right-0 top-0 h-full w-80 bg-black text-white transform transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="font-bold">{user?.name}</p>
                <p className="text-sm text-gray-400">
                  {user?.isPremium ? '👑 Premium' : '🆓 Gratuito'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => { setCurrentScreen('home'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Home className="w-5 h-5" />
            <span>Jogos de Hoje</span>
          </button>
          
          <button
            onClick={() => { setCurrentScreen('multiples'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Circle className="w-5 h-5" />
            <span>Múltiplas Sugeridas</span>
          </button>
          
          <button
            onClick={() => { setCurrentScreen('history'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Palpites Anteriores</span>
          </button>
          
          <button
            onClick={() => { setCurrentScreen('vip'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Área VIP</span>
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full bg-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-2">
            <Circle className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  )

  // Tela Principal - Jogos de Hoje
  const HomeScreen = () => (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SideMenu />
      
      <div className="p-4 space-y-6">
        {/* Stats Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-6 text-black">
          <h2 className="text-2xl font-bold mb-4">Performance da IA</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">87%</p>
              <p className="text-sm opacity-80">Taxa de Acerto</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">156</p>
              <p className="text-sm opacity-80">Palpites Certos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">R$ 12.4k</p>
              <p className="text-sm opacity-80">Lucro Gerado</p>
            </div>
          </div>
        </div>

        {/* Jogos de Hoje */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Jogos de Hoje
          </h3>
          
          <div className="space-y-4">
            {todayMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{match.time}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    match.confidence >= 70 ? 'bg-green-100 text-green-800' :
                    match.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {match.confidence}% confiança
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="w-12 h-12 mb-2 mx-auto">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flamengo_braz_logo.svg"
                          alt="Escudo do Flamengo"
                          className="w-12 h-12 rounded-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-red-400 hidden"
                        >
                          {match.homeTeam.substring(0, 3).toUpperCase()}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{match.homeTeam}</p>
                    </div>
                  </div>
                  
                  <div className="text-center px-4">
                    <p className="text-lg font-bold text-gray-400">VS</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="w-12 h-12 mb-2 mx-auto">
                        <img 
                          src={`https://logoeps.com/wp-content/uploads/2013/03/${match.awayTeam.toLowerCase().replace(' ', '-')}-vector-logo.png`}
                          alt={`Escudo ${match.awayTeam}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-green-400 hidden"
                        >
                          {match.awayTeam.substring(0, 3).toUpperCase()}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{match.awayTeam}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">Previsão da IA:</span>
                    <span className="font-bold text-yellow-600">{match.prediction}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Odd sugerida:</span>
                    <span className="font-bold text-green-600">{match.odds}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Fatores analisados:</p>
                  {match.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Tela de Múltiplas
  const MultiplesScreen = () => (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SideMenu />
      
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Múltiplas Sugeridas</h2>
          <p className="text-gray-600">Combos criados pela nossa IA para maximizar seus ganhos</p>
        </div>

        <div className="space-y-4">
          {multiplesSuggestions.map((combo) => (
            <div key={combo.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{combo.name}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  combo.confidence >= 60 ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {combo.confidence}% confiança
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {combo.matches.map((match, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{match}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-4 text-black">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">Odd Total</p>
                    <p className="text-2xl font-bold">{combo.totalOdds}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Retorno Potencial</p>
                    <p className="text-2xl font-bold">{combo.potentialReturn}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-black/20">
                  <p className="text-sm">Investimento sugerido: <span className="font-bold">{combo.investment}</span></p>
                </div>
              </div>

              <button className="w-full mt-4 bg-black text-yellow-400 py-3 px-6 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300">
                Copiar Múltipla
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Tela de Histórico
  const HistoryScreen = () => (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SideMenu />
      
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Palpites Anteriores</h2>
          <p className="text-gray-600">Histórico de acertos comprovados</p>
        </div>

        <div className="bg-green-100 border border-green-200 rounded-2xl p-6">
          <div className="text-center">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Sequência de Vitórias</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">12 acertos</p>
            <p className="text-sm text-green-700">consecutivos nos últimos dias</p>
          </div>
        </div>

        <div className="space-y-4">
          {previousHits.map((hit, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-800">{hit.combo}</p>
                  <p className="text-sm text-gray-600">{hit.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl">{hit.result.includes('✅') ? '✅' : '❌'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Jogos</p>
                  <p className="font-bold text-gray-800">{hit.matches}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Odd</p>
                  <p className="font-bold text-gray-800">{hit.odds}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Lucro</p>
                  <p className="font-bold text-green-600">{hit.profit}</p>
                </div>
              </div>

              <div className={`p-3 rounded-xl text-center font-bold ${
                hit.result.includes('✅') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hit.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Tela VIP
  const VipScreen = () => (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SideMenu />
      
      <div className="p-4 space-y-6">
        {!user?.isPremium ? (
          <>
            <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl p-8 text-black text-center">
              <Star className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Área VIP</h2>
              <p className="text-lg opacity-90">Acesso exclusivo aos melhores palpites</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Benefícios Premium</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Palpites VIP com 90%+ de confiança</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Múltiplas exclusivas de alto valor</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Análises detalhadas dos jogos</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Suporte prioritário 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Histórico completo de performance</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Plano Premium</p>
                  <p className="text-4xl font-bold text-gray-800 mb-1">R$ 97</p>
                  <p className="text-sm text-gray-600">por mês</p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300">
                Upgrade para Premium
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                Pagamento seguro via Kiwify • Cancele quando quiser
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo, Premium!</h2>
            <p className="text-gray-600">Você tem acesso completo a todos os recursos VIP</p>
          </div>
        )}
      </div>
    </div>
  )

  // Renderização condicional das telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />
      case 'login':
        return <LoginScreen />
      case 'home':
        return <HomeScreen />
      case 'multiples':
        return <MultiplesScreen />
      case 'history':
        return <HistoryScreen />
      case 'vip':
        return <VipScreen />
      default:
        return <HomeScreen />
    }
  }

  return renderScreen()
}