import { Mail, MapPin, Trophy } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { dictionary } = useLanguage()

  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <span className="chip">{dictionary.siteName}</span>
          <h3 className="font-display text-2xl font-bold text-white">International Chess Experience in Yasmine Hammamet</h3>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            React + Vite + Supabase + Tailwind CSS + shadcn/ui style components + Framer Motion.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Yasmine Hammamet, Tunisia</div>
          <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> contact@medinachessfestival.com</div>
          <div className="flex items-center gap-3"><Trophy className="h-4 w-4 text-primary" /> {dictionary.prizes}</div>
        </div>
      </div>
    </footer>
  )
}
