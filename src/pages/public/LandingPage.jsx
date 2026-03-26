import Header from '../../components/Header'
import Footer from '../../components/Footer'
import RegistrationForm from '../../components/RegistrationForm'
import { useLanguage } from '../../contexts/LanguageContext'

export default function LandingPage() {
  const { dictionary } = useLanguage()

  return (
    <div className="page-shell">
      <Header />

      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">{dictionary.heroBadge}</p>
              <h2 className="hero-title">{dictionary.heroTitle}</h2>
              <p className="hero-text">{dictionary.heroText}</p>
              <div className="hero-actions">
                <a className="primary-button" href="#registration">{dictionary.registerNow}</a>
                <a className="secondary-button" href="#tournaments">{dictionary.discover}</a>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-stats">
                <article>
                  <strong>+15 000 €</strong>
                  <span>{dictionary.prizes}</span>
                </article>
                <article>
                  <strong>3</strong>
                  <span>{dictionary.tournaments}</span>
                </article>
                <article>
                  <strong>9</strong>
                  <span>Nights</span>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="festival" className="content-section">
          <div className="container narrow-section">
            <h3 className="section-title">{dictionary.featuresTitle}</h3>
            <div className="feature-grid">
              {dictionary.features.map((feature) => (
                <article key={feature} className="feature-card">{feature}</article>
              ))}
            </div>
          </div>
        </section>

        <section id="tournaments" className="content-section alt-section">
          <div className="container narrow-section">
            <h3 className="section-title">{dictionary.tournamentsTitle}</h3>
            <div className="cards-grid">
              {dictionary.tournamentCards.map((item) => (
                <article key={item.key} className="tournament-card">
                  <span className="badge">{item.subtitle}</span>
                  <h4>{item.title}</h4>
                  <p>{item.price}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="registration" className="content-section">
          <div className="container form-shell">
            <div>
              <h3 className="section-title">{dictionary.formTitle}</h3>
              <p className="section-text">{dictionary.formSubtitle}</p>
            </div>
            <RegistrationForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
