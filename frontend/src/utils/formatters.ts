/**
 * Formata número de telefone
 * @param phone - Telefone sem formatação (27999999999)
 * @returns Telefone formatado (27) 99999-9999
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

/**
 * Formata valor monetário
 * @param value - Valor numérico
 * @returns Valor formatado R$ 110,00
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata data
 * @param date - Data em string ISO
 * @returns Data formatada 29/09/2025
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR')
}

/**
 * Formata data e hora
 * @param date - Data em string ISO
 * @returns Data e hora formatadas 29/09/2025 14:30
 */
export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}