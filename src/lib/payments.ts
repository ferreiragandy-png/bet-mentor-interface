// Sistema de pagamentos integrado com gateways populares

import { dbHelpers, Pagamento } from './supabase'
import { authService } from './auth'

export interface PaymentData {
  userId: string
  planId: 'vip' | 'premium' | 'elite'
  amount: number
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  customerInfo: {
    name: string
    email: string
    document: string
    phone?: string
  }
}

export interface PaymentResponse {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  qrCode?: string
  barCode?: string
  error?: string
}

export interface PlanConfig {
  id: string
  name: string
  price: number
  duration: number // dias
  features: string[]
}

// Configuração dos planos
export const PLANS: Record<string, PlanConfig> = {
  vip: {
    id: 'vip',
    name: 'VIP',
    price: 67,
    duration: 30,
    features: [
      'Palpites VIP com 85%+ de confiança',
      'Até 3 múltiplas exclusivas por dia',
      'Análises básicas dos jogos',
      'Suporte via chat'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 97,
    duration: 30,
    features: [
      'Palpites Premium com 90%+ de confiança',
      'Múltiplas ilimitadas por dia',
      'Análises detalhadas com estatísticas',
      'Suporte prioritário 24/7',
      'Grupos VIP no Telegram'
    ]
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 167,
    duration: 30,
    features: [
      'Palpites Elite com 95%+ de confiança',
      'Múltiplas premium ilimitadas',
      'Análises profissionais completas',
      'Consultoria personalizada 1:1',
      'Cashback de 10% em perdas',
      'Bônus de boas-vindas R$ 100'
    ]
  }
}

class PaymentService {
  // Mercado Pago Integration
  private async createMercadoPagoPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const plan = PLANS[paymentData.planId]
      
      // Configuração do Mercado Pago (simulado)
      const preference = {
        items: [{
          title: `Bet Mentor - Plano ${plan.name}`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: 'BRL'
        }],
        payer: {
          name: paymentData.customerInfo.name,
          email: paymentData.customerInfo.email,
          identification: {
            type: 'CPF',
            number: paymentData.customerInfo.document
          }
        },
        payment_methods: {
          excluded_payment_types: [],
          installments: paymentData.paymentMethod === 'credit_card' ? 12 : 1
        },
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`
        },
        auto_return: 'approved'
      }

      // Simular resposta do Mercado Pago
      const mockResponse = {
        id: `MP_${Date.now()}`,
        init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock_${Date.now()}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=mock_${Date.now()}`
      }

      // Criar registro no banco
      const payment = await dbHelpers.createPayment({
        usuario_id: paymentData.userId,
        valor: plan.price,
        data_pagamento: new Date().toISOString(),
        status: 'pendente'
      })

      return {
        success: true,
        paymentId: payment.id,
        paymentUrl: mockResponse.init_point
      }

    } catch (error) {
      console.error('Erro no Mercado Pago:', error)
      return { success: false, error: 'Erro ao processar pagamento' }
    }
  }

  // PIX Integration
  private async createPixPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const plan = PLANS[paymentData.planId]
      
      // Simular geração de PIX
      const pixData = {
        qrCode: `00020126580014BR.GOV.BCB.PIX0136${Date.now()}5204000053039865802BR5925BET MENTOR LTDA6009SAO PAULO62070503***6304${Math.random().toString().substr(2, 4)}`,
        pixKey: 'pix@betmentor.com.br',
        amount: plan.price,
        expiresIn: 30 // minutos
      }

      // Criar registro no banco
      const payment = await dbHelpers.createPayment({
        usuario_id: paymentData.userId,
        valor: plan.price,
        data_pagamento: new Date().toISOString(),
        status: 'pendente'
      })

      return {
        success: true,
        paymentId: payment.id,
        qrCode: pixData.qrCode
      }

    } catch (error) {
      console.error('Erro no PIX:', error)
      return { success: false, error: 'Erro ao gerar PIX' }
    }
  }

  // Stripe Integration
  private async createStripePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const plan = PLANS[paymentData.planId]
      
      // Configuração do Stripe (simulado)
      const session = {
        id: `cs_${Date.now()}`,
        url: `https://checkout.stripe.com/pay/cs_${Date.now()}`,
        payment_intent: `pi_${Date.now()}`
      }

      // Criar registro no banco
      const payment = await dbHelpers.createPayment({
        usuario_id: paymentData.userId,
        valor: plan.price,
        data_pagamento: new Date().toISOString(),
        status: 'pendente'
      })

      return {
        success: true,
        paymentId: payment.id,
        paymentUrl: session.url
      }

    } catch (error) {
      console.error('Erro no Stripe:', error)
      return { success: false, error: 'Erro ao processar pagamento' }
    }
  }

  // Método principal para criar pagamento
  async createPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      // Validar dados
      if (!PLANS[paymentData.planId]) {
        return { success: false, error: 'Plano inválido' }
      }

      // Escolher gateway baseado no método de pagamento
      switch (paymentData.paymentMethod) {
        case 'pix':
          return await this.createPixPayment(paymentData)
        case 'credit_card':
          return await this.createStripePayment(paymentData)
        case 'boleto':
          return await this.createMercadoPagoPayment(paymentData)
        default:
          return { success: false, error: 'Método de pagamento não suportado' }
      }

    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // Confirmar pagamento (webhook)
  async confirmPayment(paymentId: string, externalId: string): Promise<boolean> {
    try {
      // Atualizar status do pagamento
      await dbHelpers.updatePaymentStatus(paymentId, 'pago')

      // Buscar dados do pagamento
      const { data: payment } = await dbHelpers.supabase
        .from('pagamentos')
        .select('usuario_id, valor')
        .eq('id', paymentId)
        .single()

      if (payment) {
        // Ativar plano VIP do usuário
        await authService.updateUserPlan(payment.usuario_id, 'vip')

        // Enviar email de confirmação (simulado)
        await this.sendPaymentConfirmationEmail(payment.usuario_id)
      }

      return true

    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error)
      return false
    }
  }

  // Cancelar pagamento
  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await dbHelpers.updatePaymentStatus(paymentId, 'cancelado')
      return true
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error)
      return false
    }
  }

  // Buscar histórico de pagamentos do usuário
  async getUserPayments(userId: string): Promise<Pagamento[]> {
    try {
      return await dbHelpers.getUserPayments(userId)
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
      return []
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId: string): Promise<string> {
    try {
      const { data, error } = await dbHelpers.supabase
        .from('pagamentos')
        .select('status')
        .eq('id', paymentId)
        .single()

      if (error) throw error
      return data.status

    } catch (error) {
      console.error('Erro ao verificar status:', error)
      return 'erro'
    }
  }

  // Simular envio de email de confirmação
  private async sendPaymentConfirmationEmail(userId: string): Promise<void> {
    try {
      const { data: user } = await dbHelpers.supabase
        .from('usuarios')
        .select('nome, email')
        .eq('id', userId)
        .single()

      if (user) {
        console.log(`📧 Email de confirmação enviado para ${user.email}`)
        console.log(`✅ Usuário ${user.nome} agora tem acesso VIP`)
      }

    } catch (error) {
      console.error('Erro ao enviar email:', error)
    }
  }

  // Gerar link de download protegido (integração com Kiwify/Hotmart)
  async generateDownloadLink(userId: string): Promise<string> {
    try {
      // Verificar se usuário tem acesso VIP
      const hasVipAccess = await authService.checkVipAccess(userId)
      
      if (!hasVipAccess) {
        throw new Error('Usuário não tem acesso VIP')
      }

      // Gerar token temporário para download
      const downloadToken = this.generateDownloadToken(userId)
      
      // Em produção, integraria com Kiwify/Hotmart
      const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/download?token=${downloadToken}`
      
      return downloadUrl

    } catch (error) {
      console.error('Erro ao gerar link de download:', error)
      throw error
    }
  }

  private generateDownloadToken(userId: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    return Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64')
  }
}

// Instância global do serviço de pagamentos
export const paymentService = new PaymentService()

// Hook para React
export const usePaymentService = () => {
  return paymentService
}