import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { dictionary } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div>
          <h3>{dictionary.siteName}</h3>
          <p>{dictionary.heroBadge}</p>
        </div>
        <p>React + Vite + Supabase</p>
      </div>
    </footer>
  )
}
