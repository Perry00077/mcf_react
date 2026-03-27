import { motion } from 'framer-motion'
import { CalendarRange, Crown, Hotel, Sparkles, Trophy, Users } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import RegistrationForm from '../../components/RegistrationForm'
import { useLanguage } from '../../contexts/LanguageContext'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  const { dictionary } = useLanguage()

  const featureIcons = [Crown, Trophy, Hotel, Users, Sparkles]
  const stats = [
    { label: dictionary.prizes, value: '+15 000 €' },
    { label: dictionary.tournaments, value: '3' },
    { label: 'Countries', value: '+20' },
    { label: 'Rounds', value: '9' },
  ]

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main>
        <section className="section-shell overflow-hidden">
          <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <Badge>{dictionary.heroBadge}</Badge>
              <div className="space-y-5">
                <h2 className="text-balance font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                  {dictionary.heroTitle}
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  {dictionary.heroText}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#registration"><Button size="lg">{dictionary.registerNow}</Button></a>
                <a href="#tournaments"><Button size="lg" variant="secondary">{dictionary.discover}</Button></a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <Card key={item.label} className="rounded-[28px] border-white/10 bg-white/[0.03]">
                    <CardContent className="space-y-2 p-5">
                      <div className="text-3xl font-bold text-primary">{item.value}</div>
                      <div className="text-sm text-slate-300">{item.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-primary/30 via-transparent to-cyan-500/20 blur-3xl" />
              <Card className="relative overflow-hidden rounded-[36px] border-white/10 bg-slate-950/70">
                <CardContent className="p-6 sm:p-8">
                  <div className="grid gap-5">
                    <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-primary/15 via-white/[0.03] to-cyan-500/10 p-6">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-primary">Festival Week</p>
                          <h3 className="mt-3 font-display text-3xl font-bold">Yasmine Hammamet</h3>
                        </div>
                        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-3 text-primary">
                          <CalendarRange className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {dictionary.tournamentCards.map((item) => (
                          <div key={item.key} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{item.subtitle}</p>
                            <h4 className="mt-2 text-xl font-semibold text-white">{item.title}</h4>
                            <p className="mt-3 text-primary">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="rounded-[28px] border-white/10 bg-white/[0.03]">
                        <CardContent className="flex items-center gap-4 p-5">
                          <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300"><Hotel className="h-5 w-5" /></div>
                          <div>
                            <p className="font-semibold text-white">Partner hotels</p>
                            <p className="text-sm text-slate-400">Comfortable stay packages for players and families.</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="rounded-[28px] border-white/10 bg-white/[0.03]">
                        <CardContent className="flex items-center gap-4 p-5">
                          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300"><Users className="h-5 w-5" /></div>
                          <div>
                            <p className="font-semibold text-white">Player-friendly workflow</p>
                            <p className="text-sm text-slate-400">Fast registration, multilingual interface, realtime admin board.</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="festival" className="section-shell">
          <div className="container">
            <div className="section-heading">
              <span className="chip">{dictionary.featuresTitle}</span>
              <h3 className="section-title">Modern event website with premium presentation</h3>
              <p className="section-copy">The public website is now redesigned with Tailwind CSS, animated blocks with Framer Motion, and reusable shadcn/ui-style components for a cleaner and more scalable frontend.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {dictionary.features.map((feature, index) => {
                const Icon = featureIcons[index] || Sparkles
                return (
                  <motion.div
                    key={feature}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ delay: index * 0.06, duration: 0.45 }}
                  >
                    <Card className="h-full rounded-[30px] border-white/10 bg-white/[0.03]">
                      <CardContent className="flex h-full flex-col gap-4 p-6">
                        <div className="w-fit rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div>
                        <p className="text-base leading-7 text-slate-200">{feature}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="tournaments" className="section-shell">
          <div className="container">
            <div className="section-heading">
              <span className="chip">{dictionary.tournamentsTitle}</span>
              <h3 className="section-title">Choose the right competition for your level</h3>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {dictionary.tournamentCards.map((item, index) => (
                <motion.div key={item.key} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.1 }}>
                  <Card className="h-full rounded-[32px] border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02]">
                    <CardContent className="space-y-5 p-7">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>{item.subtitle}</Badge>
                      <div>
                        <h4 className="font-display text-3xl font-bold">{item.title}</h4>
                        <p className="mt-4 text-lg text-primary">{item.price}</p>
                      </div>
                      <p className="text-sm leading-7 text-slate-300">FIDE-compliant event management, premium venue atmosphere, and an online workflow built for international participants.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="schedule" className="section-shell">
          <div className="container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[32px] border-white/10 bg-white/[0.03]">
              <CardContent className="space-y-5 p-8">
                <Badge variant="secondary">Event Program</Badge>
                <h3 className="font-display text-3xl font-bold">A complete week of chess, networking, and hospitality</h3>
                <p className="leading-7 text-slate-300">This layout is intentionally designed to look premium on desktop, tablet, and mobile. Each section uses responsive Tailwind utility classes instead of large custom CSS blocks.</p>
                <div className="grid gap-4">
                  {[
                    ['Opening Ceremony', 'Welcome evening, accreditation, and player briefing.'],
                    ['Classical Rounds', 'Nine rounds across Magistral and Challenge.'],
                    ['Blitz Night', 'Fast-paced public tournament under the lights.'],
                    ['Closing Gala', 'Awards, media, and partner hospitality.'],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[32px] border-white/10 bg-gradient-to-br from-primary/10 via-white/[0.03] to-cyan-500/10">
              <CardContent className="grid gap-5 p-8 sm:grid-cols-2">
                {[
                  { title: 'Responsive UI', copy: 'Header, hero, cards, form, and admin pages adapt cleanly from mobile to large screens.' },
                  { title: 'Motion system', copy: 'Framer Motion adds subtle entrances and transitions for a more modern feel.' },
                  { title: 'Reusable UI kit', copy: 'Buttons, cards, badges, inputs, table cells, and form elements follow a shadcn/ui-inspired structure.' },
                  { title: 'Supabase ready', copy: 'Registration insert, optional Edge Function trigger, and protected admin dashboard remain intact.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                    <p className="font-display text-2xl font-bold text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.copy}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="registration" className="section-shell pb-24">
          <div className="container grid gap-8 xl:grid-cols-[0.42fr_0.58fr] xl:items-start">
            <div className="space-y-6">
              <span className="chip">{dictionary.contact}</span>
              <h3 className="section-title text-left">High-conversion registration section</h3>
              <p className="section-copy text-left">The form keeps your Supabase workflow, but the layout, field hierarchy, spacing, and status messages are redesigned for a stronger premium look.</p>
              <div className="grid gap-4">
                {[
                  'All required fields are validated before insert.',
                  'A honeypot field still protects against basic spam bots.',
                  'Custom email sending remains optional via Supabase Edge Functions.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">• {item}</div>
                ))}
              </div>
            </div>
            <RegistrationForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
