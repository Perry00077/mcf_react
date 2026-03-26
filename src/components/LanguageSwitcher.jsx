import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage, languages, dictionary } = useLanguage()

  return (
    <div className="language-switcher" aria-label={dictionary.language}>
      {Object.entries(languages).map(([code, meta]) => (
        <button
          key={code}
          type="button"
          className={`language-chip ${language === code ? 'active' : ''}`}
          onClick={() => setLanguage(code)}
        >
          {meta.label}
        </button>
      ))}
    </div>
  )
}
