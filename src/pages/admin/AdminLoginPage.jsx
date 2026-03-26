import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

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
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-head">
          <h1>{dictionary.adminLoginTitle}</h1>
          <LanguageSwitcher />
        </div>
        <p>{dictionary.adminLoginText}</p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <label>
            <span>{dictionary.email}</span>
            <input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
          </label>
          <label>
            <span>{dictionary.password}</span>
            <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? dictionary.loading : dictionary.signIn}</button>
          {error && <p className="form-status error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
