import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Send, ShieldAlert } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  telephone: '',
  country: '',
  birth_date: '',
  elo: '',
  fide_id: '',
  tournament: 'challenge',
  hotel: '',
  message: '',
  accept_rules: false,
  website: '',
}

const statusStyles = {
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  error: 'border-danger/20 bg-danger/10 text-danger',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
}

export default function RegistrationForm() {
  const { dictionary } = useLanguage()
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const tournamentOptions = useMemo(() => [
    { value: 'magistral', label: 'Magistral · Elo ≥ 2100' },
    { value: 'challenge', label: 'Challenge · Elo ≤ 2150' },
    { value: 'blitz', label: 'Blitz · Open' },
  ], [])

  const hotelOptions = useMemo(() => [
    { value: '', label: '-' },
    { value: 'diar_lemdina', label: 'Diar Lemdina' },
    { value: 'belisaire', label: 'Belisaire & Thalasso' },
    { value: 'solaria', label: 'Solaria' },
    { value: 'sans', label: 'Sans hébergement' },
  ], [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    if (!form.first_name || !form.last_name || !form.email || !form.country || !form.accept_rules) {
      setStatus({ type: 'error', message: dictionary.requiredError })
      return
    }

    if (form.website && form.website.trim() !== '') {
      setStatus({ type: 'warning', message: dictionary.genericError })
      return
    }

    setLoading(true)

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      full_name: `${form.first_name} ${form.last_name}`.trim(),
      email: form.email.trim(),
      telephone: form.telephone.trim(),
      country: form.country.trim(),
      birth_date: form.birth_date || null,
      elo: form.elo.trim(),
      fide_id: form.fide_id.trim(),
      tournament: form.tournament,
      hotel: form.hotel || null,
      message: form.message.trim(),
      accept_rules: form.accept_rules,
      status: 'nouvelle',
    }

    const { error } = await supabase.from('registrations').insert([payload])

    if (error) {
      setStatus({ type: 'error', message: error.message || dictionary.genericError })
      setLoading(false)
      return
    }

    // Optional: send custom emails only when the Edge Function exists and the env flag is enabled.
    const { data: mailData, error: mailError } = await supabase.functions.invoke(
  'send-registration-email',
  { body: payload }
)

console.log('mailData:', mailData)
console.log('mailError:', mailError)

if (mailError) {
  let details = 'Unknown email error'

  try {
    details = await mailError.context.text()
    console.error('Edge Function response body:', details)
  } catch (e) {
    console.error('Could not read function error body:', e)
  }

  setStatus({
    type: 'error',
    message: `Registration saved, but email failed: ${details}`,
  })
  setLoading(false)
  return
}

    setStatus({ type: 'success', message: dictionary.success })
    setForm(initialState)
    setLoading(false)
  }

  const statusIcon = status.type === 'success'
    ? <CheckCircle2 className="h-4 w-4" />
    : status.type === 'warning'
      ? <ShieldAlert className="h-4 w-4" />
      : <AlertCircle className="h-4 w-4" />

  return (
    <Card className="overflow-hidden rounded-[32px] border-white/10 bg-slate-950/65">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge>Supabase Form</Badge>
            <CardTitle className="mt-4 text-3xl">{dictionary.formTitle}</CardTitle>
            <CardDescription className="mt-2 max-w-2xl text-base">{dictionary.formSubtitle}</CardDescription>
          </div>
          <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            <p className="font-semibold">Secure registration flow</p>
            <p className="text-primary/80">Realtime dashboard ready</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input className="hidden" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label={dictionary.firstName}><Input name="first_name" value={form.first_name} onChange={handleChange} required /></Field>
            <Field label={dictionary.lastName}><Input name="last_name" value={form.last_name} onChange={handleChange} required /></Field>
            <Field label={dictionary.email}><Input type="email" name="email" value={form.email} onChange={handleChange} required /></Field>
            <Field label={dictionary.phone}><Input name="telephone" value={form.telephone} onChange={handleChange} /></Field>
            <Field label={dictionary.country}><Input name="country" value={form.country} onChange={handleChange} required /></Field>
            <Field label={dictionary.birthDate}><Input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} /></Field>
            <Field label={dictionary.elo}><Input name="elo" value={form.elo} onChange={handleChange} /></Field>
            <Field label={dictionary.fideId}><Input name="fide_id" value={form.fide_id} onChange={handleChange} /></Field>
            <Field label={dictionary.tournament}>
              <Select name="tournament" value={form.tournament} onChange={handleChange}>
                {tournamentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            </Field>
            <Field label={dictionary.hotel}>
              <Select name="hotel" value={form.hotel} onChange={handleChange}>
                {hotelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            </Field>
            <Field label={dictionary.message} className="md:col-span-2">
              <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your arrival or accommodation preferences." />
            </Field>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            <Checkbox name="accept_rules" checked={form.accept_rules} onChange={handleChange} />
            <span>{dictionary.acceptRules}</span>
          </label>

          {status.message ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm', statusStyles[status.type] || statusStyles.error)}
            >
              {statusIcon}
              <span>{status.message}</span>
            </motion.div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-400">Comments in this component explain the optional email trigger and the anti-spam honeypot.</p>
            <Button type="submit" size="lg" disabled={loading} className="gap-2">
              <Send className="h-4 w-4" />
              {loading ? dictionary.loading : dictionary.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({ label, className, children }) {
  return (
    <label className={cn('grid gap-2', className)}>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  )
}
