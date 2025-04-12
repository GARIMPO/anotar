// Sistema simples de autenticação usando localStorage
// No ambiente real, isso seria feito com o Supabase Auth ou outro sistema seguro

interface User {
  email: string;
  name: string;
  isAuthenticated: boolean;
}

// Credenciais fixas para este exemplo
const VALID_EMAIL = "marcos.rherculano@gmail.com";
const VALID_PASSWORD = "markinhos";

export function login(email: string, password: string): boolean {
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    const user: User = {
      email: VALID_EMAIL,
      name: "Marcos",
      isAuthenticated: true
    };
    
    // Armazena a sessão no localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function getUser(): User | null {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Erro ao recuperar usuário:', e);
    return null;
  }
}

export function isAuthenticated(): boolean {
  const user = getUser();
  return !!user?.isAuthenticated;
} 