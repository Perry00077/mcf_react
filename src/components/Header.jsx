import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import { Button } from './ui/button'
import { useLanguage } from '../contexts/LanguageContext'

export default function Header() {
  const { dictionary } = useLanguage()
  const [open, setOpen] = useState(false)

  const navItems = [
    ['#festival', dictionary.festival],
    ['#tournaments', dictionary.tournaments],
    ['#schedule', dictionary.programme],
    ['#registration', dictionary.contact],
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-2xl text-primary shadow-lg shadow-primary/20">♛</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Tunisia · 2026</p>
            <h1 className="font-display text-xl font-bold text-white">{dictionary.siteName}</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map(([href, label]) => (
            <a key={href} href={href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {label}
            </a>
          ))}
          <Link to="/admin/login">
            <Button variant="outline" size="sm" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              {dictionary.admin}
            </Button>
          </Link>
        </nav>

        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>

        <Button variant="secondary" size="icon" className="lg:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-slate-950/90 lg:hidden"
          >
            <div className="container flex flex-col gap-4 py-4">
              {navItems.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm font-medium text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
              <Link to="/admin/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  {dictionary.admin}
                </Button>
              </Link>
              <LanguageSwitcher />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
