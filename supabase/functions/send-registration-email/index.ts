import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed" },
      405,
    );
  }

  try {
    const body = await req.json().catch(() => null);

    const email = body?.email?.trim();
    const fullName = body?.fullName?.trim() || "Utilisateur";

    if (!email) {
      return jsonResponse(
        { success: false, error: "Email is required" },
        400,
      );
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
    const senderName = Deno.env.get("BREVO_SENDER_NAME") || "ISET Assistant";

    if (!brevoApiKey) {
      return jsonResponse(
        { success: false, error: "Missing BREVO_API_KEY secret" },
        500,
      );
    }

    if (!senderEmail) {
      return jsonResponse(
        { success: false, error: "Missing BREVO_SENDER_EMAIL secret" },
        500,
      );
    }

    const safeName = escapeHtml(fullName);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>Confirmation d'inscription</title>
        </head>
        <body style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <div style="background:#0f172a;padding:24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">ISET Assistant</h1>
            </div>

            <div style="padding:32px;">
              <h2 style="margin-top:0;color:#111827;">Bienvenue ${safeName} 👋</h2>

              <p style="color:#374151;font-size:16px;line-height:1.6;">
                Votre inscription a bien été enregistrée.
              </p>

              <p style="color:#374151;font-size:16px;line-height:1.6;">
                Vous pouvez maintenant accéder à la plateforme et profiter de ses fonctionnalités.
              </p>

              <div style="margin:24px 0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                <p style="margin:0;color:#111827;"><strong>Email :</strong> ${escapeHtml(email)}</p>
              </div>

              <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email,
            name: fullName,
          },
        ],
        subject: "Confirmation d'inscription",
        htmlContent,
      }),
    });

    const brevoData = await brevoResponse.json().catch(() => ({}));

    if (!brevoResponse.ok) {
      return jsonResponse(
        {
          success: false,
          error: "Brevo request failed",
          details: brevoData,
        },
        brevoResponse.status,
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Registration email sent successfully",
        data: brevoData,
      },
      200,
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}