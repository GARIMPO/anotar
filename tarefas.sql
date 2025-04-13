-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    descricao TEXT NOT NULL,
    concluida BOOLEAN DEFAULT false
);

-- Adicionar permissões RLS (Row Level Security)
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso anônimo (você pode ajustar isso em produção)
CREATE POLICY "Permitir acesso completo a anônimos" ON public.tarefas
    USING (true)
    WITH CHECK (true);

-- Adicionar índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_tarefas_concluida ON public.tarefas(concluida);
CREATE INDEX IF NOT EXISTS idx_tarefas_created_at ON public.tarefas(created_at); 