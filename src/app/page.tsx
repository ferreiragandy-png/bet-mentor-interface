'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Shield, Star, Calendar, Clock, Users, Zap, CheckCircle, 
  ArrowRight, Menu, X, Home, User, Settings, Eye, Lock, 
  Unlock, Circle, Play, ChevronRight, Crown, Diamond, Sparkles, 
  BarChart, TrendingDown, AlertTriangle, Gift, Calculator, MessageCircle,
  Phone, Headphones, Activity, FileText, Bell, Globe, Target, CloudRain,
  Grass, UserX, AlertCircle, Thermometer, Wind, Sun, CloudSnow, TrendingUp,
  LogIn, UserPlus, Mail, Key, DollarSign, CreditCard, Smartphone
} from 'lucide-react'
import LiveBetting from '@/components/LiveBetting'

// Sistema de autenticação simulado
const AUTH_STORAGE_KEY = 'bet_mentor_user'

// Dados mockados realistas com escudos reais dos times
const todayMatches = [
  {
    id: 1,
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    homeShield: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg",
    awayShield: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg",
    date: "02/11/2024",
    time: "16:00",
    location: "Rio de Janeiro - Maracanã",
    referee: "Anderson Daronco",
    weather: {
      condition: "Ensolarado",
      temperature: "28°C",
      icon: Sun
    },
    prediction: "Casa",
    confidence: 78,
    odds: 2.45,
    homeWinProb: 65,
    drawProb: 20,
    awayWinProb: 15,
    factors: ["Mando de campo", "Histórico favorável", "Escalação completa"],
    injuries: ["Pedro (Flamengo) - Lesão no joelho", "Rony (Palmeiras) - Suspenso"],
    recentForm: "Flamengo: V-V-E-V-D | Palmeiras: V-E-V-V-E"
  },
  {
    id: 2,
    homeTeam: "São Paulo",
    awayTeam: "Corinthians",
    homeShield: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png",
    awayShield: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png",
    date: "02/11/2024",
    time: "18:30",
    location: "São Paulo - Morumbi",
    referee: "Wilton Pereira Sampaio",
    weather: {
      condition: "Chuva leve",
      temperature: "22°C",
      icon: CloudRain
    },
    prediction: "Empate",
    confidence: 65,
    odds: 3.20,
    homeWinProb: 35,
    drawProb: 40,
    awayWinProb: 25,
    factors: ["Clássico equilibrado", "Ambos com desfalques", "Árbitro experiente"],
    injuries: ["Calleri (São Paulo) - Dúvida", "Yuri Alberto (Corinthians) - Confirmado"],
    recentForm: "São Paulo: E-V-D-E-V | Corinthians: D-E-V-E-D"
  },
  {
    id: 3,
    homeTeam: "Santos",
    awayTeam: "Grêmio",
    homeShield: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg",
    awayShield: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg",
    date: "02/11/2024",
    time: "20:00",
    location: "Santos - Vila Belmiro",
    referee: "Ramon Abatti Abel",
    weather: {
      condition: "Nublado",
      temperature: "25°C",
      icon: CloudSnow
    },
    prediction: "Fora",
    confidence: 72,
    odds: 2.80,
    homeWinProb: 25,
    drawProb: 30,
    awayWinProb: 45,
    factors: ["Visitante em boa fase", "Casa com problemas", "Clima favorável"],
    injuries: ["Marcos Leonardo (Santos) - Lesionado", "Suárez (Grêmio) - Confirmado"],
    recentForm: "Santos: D-D-E-D-V | Grêmio: V-V-E-V-V"
  }
]

// Múltiplas gratuitas com 5 times cada
const freeMultiples = [
  {
    id: 1,
    name: "Múltipla Segura",
    matches: [
      { home: "Flamengo", away: "Palmeiras", prediction: "Flamengo Vitória", odds: 2.45, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "São Paulo", away: "Corinthians", prediction: "Empate", odds: 3.20, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png" },
      { home: "Santos", away: "Grêmio", prediction: "Grêmio Vitória", odds: 2.80, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "Internacional", away: "Bahia", prediction: "Internacional Vitória + Mais de 2.5 gols", odds: 3.10, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "Atlético-MG", away: "Botafogo", prediction: "Ambos Marcam", odds: 1.85, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png" }
    ],
    totalOdds: 94.73,
    confidence: 72,
    type: "Vitórias e Empates"
  },
  {
    id: 2,
    name: "Múltipla de Gols",
    matches: [
      { home: "Vasco", away: "Fluminense", prediction: "Mais de 2.5 gols", odds: 2.20, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "Cruzeiro", away: "Fortaleza", prediction: "Ambos Marcam", odds: 1.90, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "Bragantino", away: "Cuiabá", prediction: "Bragantino Vitória + Mais de 1.5 gols", odds: 2.65, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png" },
      { home: "Goiás", away: "Vitória", prediction: "Empate + Menos de 3.5 gols", odds: 4.20, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "América-MG", away: "Coritiba", prediction: "América-MG Vitória", odds: 2.10, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" }
    ],
    totalOdds: 115.87,
    confidence: 68,
    type: "Foco em Gols"
  },
  {
    id: 3,
    name: "Múltipla Equilibrada",
    matches: [
      { home: "Athletico-PR", away: "Ceará", prediction: "Athletico-PR Vitória", odds: 1.95, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png" },
      { home: "Juventude", away: "Avaí", prediction: "Empate", odds: 3.00, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "Chapecoense", away: "Londrina", prediction: "Chapecoense Vitória + Ambos Marcam", odds: 3.40, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/3bd43657-523a-4cf6-8a2f-6ffe4bc35a7b.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" },
      { home: "Tombense", away: "Sampaio Corrêa", prediction: "Mais de 1.5 gols", odds: 1.75, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/bc4a2d0b-cdac-4404-9ded-b62d2e6ce365.png", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/133be296-01a9-4fbf-9f24-74051c66bd23.png" },
      { home: "Náutico", away: "Sport", prediction: "Sport Vitória", odds: 2.25, shield1: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/e372f2e9-9bca-425d-97ad-27298e8932ae.jpg", shield2: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1a76e8ea-c7e3-4919-9152-56e2197bfe7d.jpg" }
    ],
    totalOdds: 62.37,
    confidence: 75,
    type: "Mix Estratégico"
  }
]

const previousHits = [
  {
    date: "01/11/2024",
    combo: "Tripla Certeira",
    matches: 3,
    odds: 5.20,
    result: "✅ Acertou",
    profit: "R$ 260,00"
  },
  {
    date: "31/10/2024",
    combo: "Dupla Segura",
    matches: 2,
    odds: 3.40,
    result: "✅ Acertou",
    profit: "R$ 170,00"
  },
  {
    date: "30/10/2024",
    combo: "Quádrupla Premium",
    matches: 4,
    odds: 8.90,
    result: "✅ Acertou",
    profit: "R$ 445,00"
  }
]

// Dados dos planos baseados em pesquisa de mercado
const subscriptionPlans = [
  {
    id: 'vip',
    name: 'VIP',
    icon: Crown,
    price: 67,
    color: 'from-yellow-400 to-amber-500',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-400',
    popular: false,
    features: [
      'Palpites VIP com 85%+ de confiança',
      'Até 3 múltiplas exclusivas por dia',
      'Análises básicas dos jogos',
      'Suporte via chat',
      'Histórico de 30 dias',
      'Notificações push',
      'Acesso mobile completo'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Diamond,
    price: 97,
    color: 'from-purple-500 to-purple-700',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    popular: true,
    features: [
      'Palpites Premium com 90%+ de confiança',
      'Múltiplas ilimitadas por dia',
      'Análises detalhadas com estatísticas',
      'Suporte prioritário 24/7',
      'Histórico completo ilimitado',
      'Alertas personalizados',
      'Estratégias de bankroll',
      'Grupos VIP no Telegram',
      'Cashback de 5% em perdas'
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    icon: Sparkles,
    price: 167,
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    popular: false,
    features: [
      'Palpites Elite com 95%+ de confiança',
      'Múltiplas premium ilimitadas',
      'Análises profissionais completas',
      'Suporte VIP dedicado',
      'Histórico e relatórios avançados',
      'Consultoria personalizada 1:1',
      'Acesso antecipado a novos recursos',
      'Grupo Elite exclusivo',
      'Cashback de 10% em perdas',
      'Bônus de boas-vindas R$ 100',
      'Sinais ao vivo durante os jogos',
      'API para desenvolvedores'
    ]
  }
]

// Componente para escudos dos times com fallback melhorado
const TeamShield = ({ team, shield, className = "w-12 h-12" }) => {
  const [imageError, setImageError] = useState(false)
  
  const getTeamColors = (teamName) => {
    const colors = {
      'Flamengo': 'from-red-500 to-red-700 border-red-400',
      'Palmeiras': 'from-green-500 to-green-700 border-green-400',
      'São Paulo': 'from-red-500 to-white border-red-400',
      'Corinthians': 'from-gray-800 to-black border-gray-600',
      'Santos': 'from-gray-100 to-gray-300 border-gray-400 text-black',
      'Grêmio': 'from-blue-500 to-blue-700 border-blue-400'
    }
    return colors[teamName] || 'from-gray-500 to-gray-700 border-gray-400'
  }

  if (imageError) {
    return (
      <div className={`${className} bg-gradient-to-br ${getTeamColors(team)} rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2`}>
        {team.substring(0, 3).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      <img 
        src={shield}
        alt={`Escudo ${team}`}
        className={`${className} rounded-full object-contain`}
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    </div>
  )
}

// Componente para foto do usuário com upload
const UserPhoto = ({ userPhoto, onPhotoChange, className = "w-12 h-12" }) => {
  const fileInputRef = useRef(null)

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onPhotoChange(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`${className} relative cursor-pointer group`} onClick={handlePhotoClick}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {userPhoto ? (
        <img 
          src={userPhoto}
          alt="Foto do usuário"
          className={`${className} rounded-full object-cover border-2 border-yellow-400`}
        />
      ) : (
        <div className={`${className} bg-yellow-400 rounded-full flex items-center justify-center`}>
          <User className="w-6 h-6 text-black" />
        </div>
      )}
      
      {/* Overlay para mostrar opção de upload */}
      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Eye className="w-4 h-4 text-white" />
      </div>
    </div>
  )
}

// Componente para editar nome do usuário
const EditableUserName = ({ userName, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(userName)

  const handleSave = () => {
    onNameChange(tempName)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempName(userName)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-bold min-w-0 flex-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
        />
        <button
          onClick={handleSave}
          className="text-green-400 hover:text-green-300 p-1"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="text-red-400 hover:text-red-300 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="font-bold">{userName}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all p-1"
      >
        <Settings className="w-3 h-3" />
      </button>
    </div>
  )
}

// Componente para seletor de plano
const PlanSelector = ({ currentPlan, onPlanChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const plans = [
    { id: 'free', name: 'Gratuito', icon: '🆓', color: 'text-gray-400' },
    { id: 'vip', name: 'VIP', icon: '👑', color: 'text-yellow-400' },
    { id: 'premium', name: 'Premium', icon: '💎', color: 'text-purple-400' },
    { id: 'elite', name: 'Elite', icon: '⭐', color: 'text-blue-400' }
  ]

  const currentPlanData = plans.find(p => p.id === currentPlan) || plans[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm hover:bg-gray-800 px-2 py-1 rounded transition-colors"
      >
        <span>{currentPlanData.icon}</span>
        <span className={currentPlanData.color}>{currentPlanData.name}</span>
        <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => {
                onPlanChange(plan.id)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                plan.id === currentPlan ? 'bg-gray-700' : ''
              }`}
            >
              <span>{plan.icon}</span>
              <span className={plan.color}>{plan.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente do card de plano
const PlanCard = ({ plan, isCurrentPlan, onSelectPlan }) => {
  const IconComponent = plan.icon

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      plan.popular ? 'border-purple-500 relative' : plan.borderColor
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            Mais Popular
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-800">R$ {plan.price}</span>
          <span className="text-gray-600">/mês</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelectPlan(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
          isCurrentPlan
            ? 'bg-green-100 text-green-800 cursor-not-allowed'
            : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105`
        }`}
      >
        {isCurrentPlan ? 'Plano Atual' : `Escolher ${plan.name}`}
      </button>
      
      {!isCurrentPlan && (
        <p className="text-center text-xs text-gray-500 mt-3">
          Pagamento seguro • Cancele quando quiser
        </p>
      )}
    </div>
  )
}

// Componente da calculadora de odds
const OddsCalculator = ({ totalOdds }) => {
  const [betAmount, setBetAmount] = useState(10)
  const potentialReturn = (betAmount * totalOdds).toFixed(2)
  const profit = (potentialReturn - betAmount).toFixed(2)

  return (
    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5" />
        <h4 className="font-bold">Calculadora de Retorno</h4>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm opacity-90 mb-1">Valor da Aposta (R$)</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full bg-white/20 text-white placeholder-white/70 px-3 py-2 rounded-lg border border-white/30 focus:border-white focus:outline-none"
            min="1"
            step="0.01"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-sm opacity-90">Retorno Total</p>
            <p className="text-xl font-bold">R$ {potentialReturn}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-sm opacity-90">Lucro Líquido</p>
            <p className="text-xl font-bold">R$ {profit}</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-90">Odd Total: <span className="font-bold">{totalOdds.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  )
}

// Sistema de autenticação
const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar usuário do localStorage
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulação de login - em produção seria uma API real
    if (email && password) {
      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        plan: 'free',
        isPremium: false,
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Email e senha são obrigatórios' }
  }

  const register = async (name, email, password) => {
    // Simulação de registro - em produção seria uma API real
    if (name && email && password) {
      const userData = {
        id: Date.now(),
        name,
        email,
        plan: 'free',
        isPremium: false,
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Todos os campos são obrigatórios' }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return { user, login, register, logout, updateUser, loading }
}

export default function BetMentor() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userPhoto, setUserPhoto] = useState(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formError, setFormError] = useState('')
  
  // Estados individuais para cada campo - CORREÇÃO DEFINITIVA
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  
  // Refs para foco automático - CORREÇÃO DEFINITIVA
  const nameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  
  const { user, login, register, logout, updateUser, loading } = useAuth()

  // Redirecionar para home se já logado
  useEffect(() => {
    if (user && currentScreen === 'welcome') {
      setCurrentScreen('home')
    }
  }, [user, currentScreen])

  // Foco automático nos campos - CORREÇÃO DEFINITIVA
  useEffect(() => {
    if (currentScreen === 'auth') {
      const timer = setTimeout(() => {
        if (!isLoginMode && nameInputRef.current) {
          nameInputRef.current.focus()
        } else if (isLoginMode && emailInputRef.current) {
          emailInputRef.current.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentScreen, isLoginMode])

  const handlePhotoChange = (photoUrl) => {
    setUserPhoto(photoUrl)
  }

  const handleUserNameChange = (newName) => {
    updateUser({ name: newName })
  }

  const handlePlanChange = (newPlan) => {
    updateUser({ plan: newPlan, isPremium: newPlan !== 'free' })
  }

  const handleSelectPlan = (planId) => {
    // Aqui seria integrado com o sistema de pagamento
    console.log(`Selecionado plano: ${planId}`)
    // Por enquanto, apenas simula a mudança
    handlePlanChange(planId)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const result = isLoginMode 
      ? await login(userEmail, userPassword)
      : await register(userName, userEmail, userPassword)

    if (result.success) {
      setCurrentScreen('home')
      // Limpar campos após sucesso
      setUserName('')
      setUserEmail('')
      setUserPassword('')
    } else {
      setFormError(result.error)
    }
  }

  const handleModeChange = () => {
    setIsLoginMode(!isLoginMode)
    setFormError('')
    // Limpar campos ao trocar modo
    setUserName('')
    setUserEmail('')
    setUserPassword('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  // Tela de Boas-vindas
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-black rounded-full mx-auto flex items-center justify-center">
            <span className="text-yellow-400 text-3xl font-bold">BM</span>
          </div>
          <h1 className="text-4xl font-bold text-black">Bet Mentor</h1>
          <p className="text-xl text-black/80 font-medium">
            Sistema completo de apostas esportivas com IA
          </p>
        </div>
        
        <div className="space-y-4 text-black/70">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-black" />
            <span>Análises com Inteligência Artificial</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-black" />
            <span>Taxa de acerto de 87%</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-black" />
            <span>Apostas ao vivo em tempo real</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-black" />
            <span>Sistema seguro e confiável</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('auth')}
          className="w-full bg-black text-yellow-400 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Começar Agora
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Tela de Autenticação (Login/Cadastro) - CORRIGIDA DEFINITIVAMENTE
  const AuthScreen = () => (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-black text-xl font-bold">BM</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </h2>
            <p className="text-gray-400 mt-2">
              {isLoginMode ? 'Acesse sua conta Bet Mentor' : 'Crie sua conta gratuita'}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <input
                  ref={nameInputRef}
                  id="user-name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  required={!isLoginMode}
                  autoComplete="name"
                  inputMode="text"
                />
              </div>
            )}
            
            <div>
              <input
                ref={emailInputRef}
                id="user-email"
                type="email"
                placeholder="Seu e-mail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>
            
            <div>
              <input
                ref={passwordInputRef}
                id="user-password"
                type="password"
                placeholder="Sua senha"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                required
                autoComplete="current-password"
              />
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-xl text-sm">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoginMode ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={handleModeChange}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
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
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-black text-sm font-bold">BM</span>
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
            <div className="flex items-center justify-between">
              <UserPhoto 
                userPhoto={userPhoto}
                onPhotoChange={handlePhotoChange}
                className="w-12 h-12"
              />
              <div className="ml-3 flex-1">
                <EditableUserName 
                  userName={user?.name || 'Usuário'}
                  onNameChange={handleUserNameChange}
                />
                <PlanSelector 
                  currentPlan={user?.plan || 'free'}
                  onPlanChange={handlePlanChange}
                />
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <button
            onClick={() => { setCurrentScreen('home'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Home className="w-5 h-5" />
            <span>Jogos de Hoje</span>
          </button>

          <button
            onClick={() => { setCurrentScreen('live-betting'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left bg-gradient-to-r from-red-600 to-red-700"
          >
            <Activity className="w-5 h-5" />
            <span className="font-bold">🔴 Apostas ao Vivo</span>
          </button>
          
          <button
            onClick={() => { setCurrentScreen('multiples'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Target className="w-5 h-5" />
            <span>Múltiplas Sugeridas</span>
          </button>
          
          <button
            onClick={() => { setCurrentScreen('history'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Histórico de Acertos</span>
          </button>

          <button
            onClick={() => { setCurrentScreen('statistics'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <BarChart className="w-5 h-5" />
            <span>Estatísticas Detalhadas</span>
          </button>

          <button
            onClick={() => { setCurrentScreen('calendar'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Calendar className="w-5 h-5" />
            <span>Calendário de Jogos</span>
          </button>

          <button
            onClick={() => { setCurrentScreen('support'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Suporte</span>
          </button>
          
          <button
            onClick={() => { setCurrentScreen('vip'); setIsMenuOpen(false) }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Planos Premium</span>
          </button>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={() => {
              logout()
              setCurrentScreen('welcome')
              setIsMenuOpen(false)
            }}
            className="w-full bg-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
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

        {/* Banner de Apostas ao Vivo */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-bold">AO VIVO</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Apostas em Tempo Real</h3>
              <p className="text-sm opacity-90">Odds atualizadas automaticamente</p>
            </div>
            <button
              onClick={() => setCurrentScreen('live-betting')}
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Apostar Agora
            </button>
          </div>
        </div>

        {/* Jogos de Hoje */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Jogos de Hoje
          </h3>
          
          <div className="space-y-4">
            {todayMatches.map((match) => {
              const WeatherIcon = match.weather.icon
              return (
                <div key={match.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-lg">
                        <WeatherIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">{match.weather.condition}</span>
                        <span className="text-xs font-bold text-blue-800">{match.weather.temperature}</span>
                      </div>
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
                        <div className="mb-2 mx-auto">
                          <TeamShield team={match.homeTeam} shield={match.homeShield} />
                        </div>
                        <p className="text-sm font-bold text-gray-800">{match.homeTeam}</p>
                        <p className="text-xs text-green-600 font-bold">{match.homeWinProb}%</p>
                      </div>
                    </div>
                    
                    <div className="text-center px-4">
                      <p className="text-lg font-bold text-gray-400">VS</p>
                      <p className="text-xs text-gray-500 font-bold">{match.drawProb}% empate</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="mb-2 mx-auto">
                          <TeamShield team={match.awayTeam} shield={match.awayShield} />
                        </div>
                        <p className="text-sm font-bold text-gray-800">{match.awayTeam}</p>
                        <p className="text-xs text-blue-600 font-bold">{match.awayWinProb}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Local:</span>
                        <p className="font-medium text-gray-800">{match.location}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Árbitro:</span>
                        <p className="font-medium text-gray-800">{match.referee}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">Previsão da IA:</span>
                      <span className="font-bold text-yellow-600">{match.prediction}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Odd sugerida:</span>
                      <span className="font-bold text-green-600">{match.odds}</span>
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Forma recente:</p>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{match.recentForm}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Lesões e suspensões:</p>
                      <div className="space-y-1">
                        {match.injuries.map((injury, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-gray-600">{injury}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Fatores analisados:</p>
                      {match.factors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Múltiplas Gratuitas</h2>
          <p className="text-gray-600">3 múltiplas de 5 times cada - Plano Gratuito</p>
        </div>

        <div className="space-y-4">
          {freeMultiples.map((combo) => (
            <div key={combo.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{combo.name}</h3>
                  <p className="text-sm text-gray-600">{combo.type}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  combo.confidence >= 70 ? 'bg-green-100 text-green-800' :
                  combo.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {combo.confidence}% confiança
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {combo.matches.map((match, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <TeamShield team={match.home} shield={match.shield1} className="w-8 h-8" />
                        <span className="text-sm font-medium text-gray-700">vs</span>
                        <TeamShield team={match.away} shield={match.shield2} className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-green-600">{match.odds}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{match.home} vs {match.away}</span>
                      <span className="text-sm font-medium text-gray-800">{match.prediction}</span>
                    </div>
                  </div>
                ))}
              </div>

              <OddsCalculator totalOdds={combo.totalOdds} />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="bg-black text-yellow-400 py-3 px-6 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300">
                  Copiar Múltipla
                </button>
                <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300">
                  Apostar Agora
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 text-white text-center">
          <Crown className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Quer mais múltiplas?</h3>
          <p className="mb-4 opacity-90">Upgrade para VIP e tenha acesso a múltiplas ilimitadas com maior taxa de acerto!</p>
          <button 
            onClick={() => setCurrentScreen('vip')}
            className="bg-white text-purple-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300"
          >
            Ver Planos Premium
          </button>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Histórico de Acertos</h2>
          <p className="text-gray-600">Palpites anteriores comprovados</p>
        </div>

        <div className="bg-green-100 border border-green-200 rounded-2xl p-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
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
        <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl p-8 text-black text-center">
          <Star className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Planos Premium</h2>
          <p className="text-lg opacity-90">Escolha o plano ideal para maximizar seus lucros</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Escolha Seu Plano</h3>
            <p className="text-gray-600">Todos os planos incluem garantia de 7 dias</p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={user?.plan === plan.id}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Tela de Suporte
  const SupportScreen = () => (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SideMenu />
      
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Central de Suporte</h2>
          <p className="text-gray-600">Estamos aqui para ajudar você</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-800">Chat Online</h3>
                <p className="text-sm text-gray-600">Resposta imediata</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Converse conosco em tempo real para tirar suas dúvidas sobre apostas e funcionalidades.
            </p>
            <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-600 transition-all">
              Iniciar Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-800">E-mail</h3>
                <p className="text-sm text-gray-600">Resposta em até 2h</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Envie sua dúvida por e-mail e receba uma resposta detalhada da nossa equipe.
            </p>
            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-600 transition-all">
              Enviar E-mail
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-800">Telefone</h3>
                <p className="text-sm text-gray-600">Seg-Sex 8h às 18h</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Ligue para nossa central de atendimento e fale diretamente com um especialista.
            </p>
            <button className="w-full bg-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-purple-600 transition-all">
              (11) 9999-9999
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Headphones className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-800">FAQ</h3>
                <p className="text-sm text-gray-600">Respostas rápidas</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Consulte nossa base de conhecimento com as perguntas mais frequentes.
            </p>
            <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-orange-600 transition-all">
              Ver FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Renderização condicional das telas
  const renderScreen = () => {
    if (!user && currentScreen !== 'welcome' && currentScreen !== 'auth') {
      return <WelcomeScreen />
    }

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />
      case 'auth':
        return <AuthScreen />
      case 'home':
        return <HomeScreen />
      case 'multiples':
        return <MultiplesScreen />
      case 'history':
        return <HistoryScreen />
      case 'vip':
        return <VipScreen />
      case 'support':
        return <SupportScreen />
      case 'live-betting':
        return <LiveBetting onClose={() => setCurrentScreen('home')} />
      default:
        return <HomeScreen />
    }
  }

  return renderScreen()
}