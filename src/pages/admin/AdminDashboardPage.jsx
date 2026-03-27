import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Globe2, LogOut, Search, Sparkles, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { formatDate } from '@/lib/utils'

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
      [row.full_name, row.email, row.country, row.tournament, row.hotel]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [rows, search])

  const stats = useMemo(() => {
    const countries = new Set(rows.map((row) => row.country).filter(Boolean)).size
    const latest = rows[0]?.created_at ? formatDate(rows[0].created_at) : '-'
    return [
      { label: dictionary.totalRegistrations, value: rows.length, icon: Users },
      { label: 'Countries', value: countries, icon: Globe2 },
      { label: 'Latest entry', value: latest, icon: Activity },
    ]
  }, [rows, dictionary.totalRegistrations])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="container space-y-6">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Badge>Realtime Dashboard</Badge>
              <Badge variant="secondary">Supabase</Badge>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold text-white">{dictionary.dashboardTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{dictionary.dashboardSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            <Button variant="secondary" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              {dictionary.signOut}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.3fr]">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="h-full rounded-[28px] border-white/10 bg-white/[0.03]">
                  <CardContent className="flex h-full items-center gap-4 p-5">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
          <Card className="rounded-[28px] border-white/10 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10">
            <CardContent className="flex h-full flex-col justify-center gap-4 p-5">
              <div className="flex items-center gap-3 text-primary"><Sparkles className="h-5 w-5" /> Search registrations instantly</div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder="Search by player, email, country, tournament..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[32px] border-white/10 bg-slate-950/70">
          <CardHeader>
            <CardTitle>{dictionary.latestEntries}</CardTitle>
            <CardDescription>Responsive table built with reusable UI primitives and fed by Supabase realtime subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-slate-300">Loading registrations...</div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-slate-300">{dictionary.noRows}</div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{dictionary.firstName}</TableHead>
                        <TableHead>{dictionary.lastName}</TableHead>
                        <TableHead>{dictionary.email}</TableHead>
                        <TableHead>{dictionary.country}</TableHead>
                        <TableHead>{dictionary.tournament}</TableHead>
                        <TableHead>{dictionary.hotel}</TableHead>
                        <TableHead>{dictionary.message}</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-xs text-slate-400">{row.id.slice(0, 8)}</TableCell>
                          <TableCell>{row.first_name}</TableCell>
                          <TableCell>{row.last_name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.country}</TableCell>
                          <TableCell><Badge variant="secondary">{row.tournament}</Badge></TableCell>
                          <TableCell>{row.hotel || '-'}</TableCell>
                          <TableCell className="max-w-[240px] truncate text-slate-300">{row.message || '-'}</TableCell>
                          <TableCell className="text-slate-300">{formatDate(row.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
