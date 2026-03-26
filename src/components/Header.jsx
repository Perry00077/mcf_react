import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'

export default function Header() {
  const { dictionary } = useLanguage()

  const navItems = [
    ['#festival', dictionary.festival],
    ['#tournaments', dictionary.tournaments],
    ['#registration', dictionary.contact],
  ]

  return (
    <header className="site-header">
      <div className="container header-shell">
        <div>
          <p className="logo-mark">♛</p>
          <h1 className="logo-text">{dictionary.siteName}</h1>
        </div>

        <nav className="main-nav">
          {navItems.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <Link to="/admin/login" className="admin-link">{dictionary.admin}</Link>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  )
}
