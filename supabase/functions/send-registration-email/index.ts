const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL')

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!RESEND_API_KEY) {
  return new Response(
    JSON.stringify({ success: false, error: 'Missing RESEND_API_KEY secret' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

if (!ADMIN_EMAIL) {
  return new Response(
    JSON.stringify({ success: false, error: 'Missing ADMIN_EMAIL secret' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

if (!FROM_EMAIL) {
  return new Response(
    JSON.stringify({ success: false, error: 'Missing FROM_EMAIL secret' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

    const body = await req.json()

    const {
      first_name,
      last_name,
      full_name,
      email,
      telephone,
      country,
      birth_date,
      elo,
      fide_id,
      tournament,
      hotel,
      message,
    } = body

    if (!email || !first_name || !last_name || !country || !tournament) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
          received: { first_name, last_name, email, country, tournament }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const safeFullName = full_name || `${first_name} ${last_name}`

    const adminHtml = `
      <h2>Nouvelle inscription</h2>
      <p><strong>Nom complet:</strong> ${safeFullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${telephone || '-'}</p>
      <p><strong>Pays:</strong> ${country}</p>
      <p><strong>Date de naissance:</strong> ${birth_date || '-'}</p>
      <p><strong>ELO:</strong> ${elo || '-'}</p>
      <p><strong>FIDE ID:</strong> ${fide_id || '-'}</p>
      <p><strong>Tournoi:</strong> ${tournament}</p>
      <p><strong>Hôtel:</strong> ${hotel || '-'}</p>
      <p><strong>Message:</strong> ${message || '-'}</p>
    `

    const playerHtml = `
      <h2>Confirmation d'inscription</h2>
      <p>Bonjour ${first_name} ${last_name},</p>
      <p>Votre inscription a bien été reçue.</p>
      <p><strong>Tournoi:</strong> ${tournament}</p>
      <p><strong>Hôtel:</strong> ${hotel || '-'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Pays:</strong> ${country}</p>
      <p>Nous vous contacterons si nécessaire.</p>
      <p>Cordialement,<br/>Medina Chess Festival</p>
    `

    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: 'Nouvelle inscription - Medina Chess Festival',
        html: adminHtml,
      }),
    })

    const adminText = await adminRes.text()
    let adminData: unknown
    try {
      adminData = JSON.parse(adminText)
    } catch {
      adminData = adminText
    }

    if (!adminRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          step: 'admin_email',
          resend_status: adminRes.status,
          resend_data: adminData,
          debug: { FROM_EMAIL, ADMIN_EMAIL }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const playerRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Confirmation de votre inscription - Medina Chess Festival',
        html: playerHtml,
      }),
    })

    const playerText = await playerRes.text()
    let playerData: unknown
    try {
      playerData = JSON.parse(playerText)
    } catch {
      playerData = playerText
    }

    if (!playerRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          step: 'player_email',
          resend_status: playerRes.status,
          resend_data: playerData,
          debug: { FROM_EMAIL, player_email: email }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminData,
        playerData
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})