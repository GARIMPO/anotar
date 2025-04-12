"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Mail, Phone } from "lucide-react"
import type { Contato } from "@/types/contato"

interface EmailsSalvosViewProps {
  contatos: Contato[]
  onAdd: (contato: Contato) => Promise<void>
  onEdit: (id: string, contato: Contato) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function EmailsSalvosView({ contatos, onAdd, onEdit, onDelete }: EmailsSalvosViewProps) {
  const [editingContato, setEditingContato] = useState<Contato | null>(null)
  const [editForm, setEditForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const { toast } = useToast()

  const handleEdit = (contato: Contato) => {
    setEditingContato(contato)
    setEditForm({
      nome: contato.nome || '',
      email: contato.email || '',
      telefone: contato.telefone || '',
      mensagem: contato.mensagem || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingContato) return

    try {
      await onEdit(editingContato.id, {
        ...editingContato,
        nome: editForm.nome,
        email: editForm.email,
        telefone: editForm.telefone,
        mensagem: editForm.mensagem
      })
      
      setEditingContato(null)
      toast({
        title: "Sucesso",
        description: "Contato atualizado com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o contato.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id)
      // O toast de sucesso será exibido no componente pai (Dashboard)
    } catch (error) {
      console.error('Erro ao excluir contato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contato.",
        variant: "destructive",
      })
    }
  }

  const abrirEmail = (email: string, nome: string, e: React.MouseEvent) => {
    e.preventDefault()
    const assunto = encodeURIComponent(`Contato - ${nome}`)
    const mensagem = encodeURIComponent(`Olá ${nome},\n\nEntro em contato para informar...`)
    window.open(`mailto:${email}?subject=${assunto}&body=${mensagem}`, "_blank")
  }

  const abrirWhatsApp = (telefone: string, nome: string, e: React.MouseEvent) => {
    e.preventDefault()
    const numeroLimpo = telefone.replace(/\D/g, "")
    // Adicionar o código do país caso não exista
    const numeroCompleto = numeroLimpo.startsWith("55") ? numeroLimpo : `55${numeroLimpo}`
    const mensagem = encodeURIComponent(`Olá ${nome}! Temos novidades para você.`)
    window.open(`https://wa.me/${numeroCompleto}?text=${mensagem}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contatos e E-mails</CardTitle>
        </CardHeader>
        <CardContent>
          {contatos.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Nenhum contato registrado.</p>
          ) : (
            <div className="space-y-4">
              {contatos.map((contato) => (
                <div key={contato.id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
                  <div>
                    <p className="font-medium">{contato.nome}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a 
                        href={`mailto:${contato.email}`} 
                        className="text-blue-600 hover:underline"
                        onClick={(e) => abrirEmail(contato.email, contato.nome, e)}
                      >
                        {contato.email}
                      </a>
                    </p>
                    {contato.telefone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a 
                          href={`https://wa.me/${contato.telefone.replace(/\D/g, "")}`} 
                          className="text-green-600 hover:underline"
                          onClick={(e) => abrirWhatsApp(contato.telefone, contato.nome, e)}
                        >
                          {contato.telefone}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contato)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contato.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingContato} onOpenChange={(open) => !open && setEditingContato(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={editForm.nome}
                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={editForm.telefone}
                onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingContato(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 