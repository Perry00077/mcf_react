import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'

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

export default function RegistrationForm() {
  const { dictionary } = useLanguage()
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const tournamentOptions = useMemo(() => [
    { value: 'magistral', label: 'Magistral' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'blitz', label: 'Blitz' },
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
    setStatus({ type: 'error', message: dictionary.genericError })
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

  const { error: mailError } = await supabase.functions.invoke('send-registration-email', {
    body: payload,
  })

  if (mailError) {
    console.error('Email sending failed:', mailError)
  }

  setStatus({ type: 'success', message: dictionary.success })
  setForm(initialState)
  setLoading(false)
}

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>{dictionary.firstName}</span>
          <input name="first_name" value={form.first_name} onChange={handleChange} required />
        </label>
        <label>
          <span>{dictionary.lastName}</span>
          <input name="last_name" value={form.last_name} onChange={handleChange} required />
        </label>
        <label>
          <span>{dictionary.email}</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          <span>{dictionary.phone}</span>
          <input name="telephone" value={form.telephone} onChange={handleChange} />
        </label>
        <label>
          <span>{dictionary.country}</span>
          <input name="country" value={form.country} onChange={handleChange} required />
        </label>
        <label>
          <span>{dictionary.birthDate}</span>
          <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} />
        </label>
        <label>
          <span>{dictionary.elo}</span>
          <input name="elo" value={form.elo} onChange={handleChange} />
        </label>
        <label>
          <span>{dictionary.fideId}</span>
          <input name="fide_id" value={form.fide_id} onChange={handleChange} />
        </label>
        <label>
          <span>{dictionary.tournament}</span>
          <select name="tournament" value={form.tournament} onChange={handleChange}>
            {tournamentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>{dictionary.hotel}</span>
          <select name="hotel" value={form.hotel} onChange={handleChange}>
            {hotelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="full-width">
          <span>{dictionary.message}</span>
          <textarea name="message" value={form.message} onChange={handleChange} rows="5" />
        </label>
        <input className="honeypot" name="website" value={form.website} onChange={handleChange} autoComplete="off" tabIndex="-1" />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" name="accept_rules" checked={form.accept_rules} onChange={handleChange} />
        <span>{dictionary.acceptRules}</span>
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? dictionary.loading : dictionary.submit}
      </button>

      {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
    </form>
  )
}
