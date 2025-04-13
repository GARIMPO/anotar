"use client"

import { useState } from "react"
import { Pencil, Plus, Trash, CheckCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Tarefa } from "@/types/tarefa"

interface TarefasViewProps {
  tarefas: Tarefa[]
  onAdd: (tarefa: { descricao: string, concluida: boolean }) => void
  onDelete: (id: string) => void
  onEdit: (id: string, tarefa: { descricao?: string, concluida?: boolean }) => void
}

export default function TarefasView({
  tarefas,
  onAdd,
  onDelete,
  onEdit,
}: TarefasViewProps) {
  const [novaTarefa, setNovaTarefa] = useState("")
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<string | null>(null)
  const [tarefaParaEditar, setTarefaParaEditar] = useState<Tarefa | null>(null)
  const [editDescricao, setEditDescricao] = useState("")
  const [dialogoEdicaoAberto, setDialogoEdicaoAberto] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!novaTarefa.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma descrição para a tarefa",
        variant: "destructive",
      })
      return
    }
    
    onAdd({
      descricao: novaTarefa,
      concluida: false
    })
    
    setNovaTarefa("")
    
    toast({
      title: "Sucesso",
      description: "Tarefa adicionada com sucesso",
    })
  }

  const toggleConcluida = (id: string, concluida: boolean) => {
    onEdit(id, { concluida: !concluida })
  }

  const handleEditarTarefa = (tarefa: Tarefa) => {
    setTarefaParaEditar(tarefa)
    setEditDescricao(tarefa.descricao)
    setDialogoEdicaoAberto(true)
  }

  const salvarEdicao = () => {
    if (!tarefaParaEditar) return
    
    if (!editDescricao.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma descrição para a tarefa",
        variant: "destructive",
      })
      return
    }
    
    onEdit(tarefaParaEditar.id, { descricao: editDescricao })
    setDialogoEdicaoAberto(false)
    setTarefaParaEditar(null)
    
    toast({
      title: "Sucesso",
      description: "Tarefa atualizada com sucesso",
    })
  }

  const confirmarExclusao = (id: string) => {
    setTarefaParaExcluir(id)
  }

  const executarExclusao = () => {
    if (!tarefaParaExcluir) return
    
    onDelete(tarefaParaExcluir)
    setTarefaParaExcluir(null)
    
    toast({
      title: "Sucesso",
      description: "Tarefa excluída com sucesso",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Lista de Tarefas</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Digite uma nova tarefa..."
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        {tarefas.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Nenhuma tarefa registrada.</p>
        ) : (
          tarefas.map((tarefa) => (
            <Card key={tarefa.id} className={tarefa.concluida ? "border-green-200 bg-green-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => toggleConcluida(tarefa.id, tarefa.concluida)}
                    >
                      {tarefa.concluida ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </Button>
                    <p className={`flex-1 ${tarefa.concluida ? 'line-through text-muted-foreground' : ''}`}>
                      {tarefa.descricao}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditarTarefa(tarefa)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => confirmarExclusao(tarefa.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Diálogo de Edição */}
      <Dialog open={dialogoEdicaoAberto} onOpenChange={setDialogoEdicaoAberto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Altere a descrição da tarefa e clique em salvar para confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Digite a descrição da tarefa..."
              value={editDescricao}
              onChange={(e) => setEditDescricao(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogoEdicaoAberto(false)
                setTarefaParaEditar(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={salvarEdicao}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Confirmação para Exclusão */}
      <AlertDialog open={!!tarefaParaExcluir} onOpenChange={() => setTarefaParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executarExclusao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 