'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(4, 'Informe a senha'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    try {
      await login(data.email, data.password)
      router.replace(from)
    } catch {
      setError('root', { message: 'Credenciais inválidas ou serviço indisponível.' })
    }
  }

  return (
    <>
      <PageMeta title="Login Admin" />
      <div className="grid min-h-screen place-items-center bg-surface-alt px-4">
        <div className="w-full max-w-sm rounded-theme border border-black/5 bg-surface p-8 shadow-sm">
          <h1 className="text-xl font-bold text-primary">{theme.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">Painel administrativo</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">E-mail</label>
              <input id="email" type="email" {...register('email')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
              {errors.email && <p className="mt-1 text-sm text-secondary-dark">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">Senha</label>
              <input id="password" type="password" {...register('password')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
              {errors.password && <p className="mt-1 text-sm text-secondary-dark">{errors.password.message}</p>}
            </div>
            {errors.root && <p className="text-sm text-secondary-dark">{errors.root.message}</p>}
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Credenciais de demonstracao (remover quando o backend existir) */}
          <div className="mt-6 rounded-xl bg-surface-alt px-4 py-3 text-xs text-ink-muted">
            <p className="font-semibold text-ink">Acesso de demonstração</p>
            <p className="mt-1">E-mail: <span className="font-mono">admin@apae.org</span></p>
            <p>Senha: <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    </>
  )
}
