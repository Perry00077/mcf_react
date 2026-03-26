import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function AdminDashboardPage() {
  const { dictionary } = useLanguage()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadRows() {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && mounted) {
        setRows(data || [])
      }
      if (mounted) setLoading(false)
    }

    loadRows()

    const channel = supabase
      .channel('registrations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => loadRows())
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) =>
      [row.full_name, row.email, row.country, row.tournament]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [rows, search])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="dashboard-page">
      <div className="container dashboard-shell">
        <div className="dashboard-topbar">
          <div>
            <h1>{dictionary.dashboardTitle}</h1>
            <p>{dictionary.dashboardSubtitle}</p>
          </div>
          <div className="dashboard-actions">
            <LanguageSwitcher />
            <button className="secondary-button" type="button" onClick={handleSignOut}>{dictionary.signOut}</button>
          </div>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <span>{dictionary.totalRegistrations}</span>
            <strong>{rows.length}</strong>
          </article>
          <article className="stat-card">
            <span>{dictionary.filters}</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          </article>
        </div>

        <section className="table-card">
          <div className="table-head">
            <h2>{dictionary.latestEntries}</h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredRows.length === 0 ? (
            <p>{dictionary.noRows}</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{dictionary.firstName}</th>
                    <th>{dictionary.lastName}</th>
                    <th>{dictionary.email}</th>
                    <th>{dictionary.country}</th>
                    <th>{dictionary.tournament}</th>
                    <th>{dictionary.hotel}</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id.slice(0, 8)}</td>
                      <td>{row.first_name}</td>
                      <td>{row.last_name}</td>
                      <td>{row.email}</td>
                      <td>{row.country}</td>
                      <td>{row.tournament}</td>
                      <td>{row.hotel || '-'}</td>
                      <td>{new Date(row.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
