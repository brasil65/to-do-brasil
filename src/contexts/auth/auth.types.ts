/**
 * Tipos do contexto de autenticação.
 *
 * @module auth.types
 */

/** Dados do formulário de login */
export interface LoginFormData {
  /** Email do usuário */
  email: string;
  /** Senha do usuário */
  password: string;
}

/** Dados do formulário de cadastro */
export interface RegisterFormData {
  /** Nome completo do usuário */
  fullName: string;
  /** Email do usuário */
  email: string;
  /** Senha do usuário (mínimo 6 caracteres) */
  password: string;
  /** Confirmação de senha - deve ser igual a password */
  confirmPassword: string;
}

/** Estado de retorno das operações de auth */
export interface AuthResult {
  /** Indica se a operação foi bem-sucedida */
  success: boolean;
  /** Mensagem de erro, se houver */
  error?: string;
}