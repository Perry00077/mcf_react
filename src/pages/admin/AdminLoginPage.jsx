import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'

export default function AdminLoginPage() {
  const { dictionary } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!adminRow) {
      await supabase.auth.signOut()
      setError('This account is not allowed to access the admin dashboard.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <Card className="overflow-hidden rounded-[36px] border-white/10 bg-slate-950/70">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-white/10 bg-gradient-to-br from-primary/15 via-transparent to-cyan-500/15 p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <span className="chip">Supabase Auth</span>
                  <h1 className="font-display text-4xl font-bold text-white">{dictionary.adminLoginTitle}</h1>
                  <p className="max-w-md text-sm leading-7 text-slate-300">{dictionary.adminLoginText}</p>
                </div>
                <LanguageSwitcher />
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-3 text-2xl"><LockKeyhole className="h-5 w-5 text-primary" /> Secure dashboard access</CardTitle>
                <CardDescription>Only users listed in the <code className="rounded bg-white/10 px-1.5 py-0.5">admin_users</code> table can enter.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-300">{dictionary.email}</span>
                    <Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-300">{dictionary.password}</span>
                    <Input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required />
                  </label>
                  {error ? <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? dictionary.loading : dictionary.signIn}
                  </Button>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
