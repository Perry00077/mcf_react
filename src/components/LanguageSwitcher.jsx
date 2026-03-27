import { Globe2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage, languages, dictionary } = useLanguage()

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1" aria-label={dictionary.language}>
      <div className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <Globe2 className="h-3.5 w-3.5" />
        {dictionary.language}
      </div>
      {Object.entries(languages).map(([code, meta]) => {
        const active = language === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            className="relative rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"
          >
            {active ? (
              <motion.span
                layoutId="language-active"
                className="absolute inset-0 rounded-full bg-primary text-primary-foreground"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            ) : null}
            <span className="relative z-10">{meta.label}</span>
          </button>
        )
      })}
    </div>
  )
}
