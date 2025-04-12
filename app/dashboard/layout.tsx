"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, logout, getUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string, email: string } | null>(null)
  
  useEffect(() => {
    // Verificar autenticação
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    
    // Obter informações do usuário
    setUser(getUser())
  }, [router])
  
  const handleLogout = () => {
    logout()
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com informações do usuário e botão de logout */}
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="font-medium">Sistema de Gestão Financeira</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{user?.name || 'Usuário'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>
      
      {/* Conteúdo do dashboard */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
} 