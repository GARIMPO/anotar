export interface Transacao {
  id: string
  tipo: "receita" | "despesa" | "fixa"
  descricao: string
  valor: number
  data: string // ISO string
  categoria?: string // Opcional
}

