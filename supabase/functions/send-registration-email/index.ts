import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json().catch(() => null);

    const email = body?.email?.trim();
    const fullName = body?.fullName?.trim() || "Utilisateur";

    if (!email) {
      return jsonResponse({ success: false, error: "Email is required" }, 400);
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
    const senderName = Deno.env.get("BREVO_SENDER_NAME") || "Medina Chess Festival";
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
    const replyToEmail = Deno.env.get("BREVO_REPLY_TO_EMAIL") || senderEmail;

    if (!brevoApiKey) {
      return jsonResponse({ success: false, error: "Missing BREVO_API_KEY secret" }, 500);
    }

    if (!senderEmail) {
      return jsonResponse({ success: false, error: "Missing BREVO_SENDER_EMAIL secret" }, 500);
    }

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const registeredAt = new Date();

    const userHtml = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Confirmation d'inscription</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
          <div style="max-width:640px;margin:32px auto;padding:0 16px;">
            <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:20px 20px 0 0;padding:32px 24px;text-align:center;">
              <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.12);color:#ffffff;font-size:12px;font-weight:bold;letter-spacing:0.6px;">
                MEDINA CHESS FESTIVAL
              </div>
              <h1 style="margin:18px 0 8px;color:#ffffff;font-size:30px;line-height:1.2;">
                Inscription confirmée ♟️
              </h1>
              <p style="margin:0;color:#dbeafe;font-size:15px;line-height:1.6;">
                Merci pour votre inscription. Nous sommes ravis de vous compter parmi les participants.
              </p>
            </div>

            <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 20px 20px;padding:32px 24px;">
              <p style="margin:0 0 18px;font-size:17px;line-height:1.7;">
                Bonjour <strong>${safeName}</strong>,
              </p>

              <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#374151;">
                Votre demande d'inscription a bien été enregistrée avec succès pour <strong>Medina Chess Festival</strong>.
              </p>

              <div style="margin:24px 0;padding:18px;border:1px solid #e5e7eb;border-radius:16px;background:#f9fafb;">
                <h2 style="margin:0 0 12px;font-size:16px;color:#111827;">Récapitulatif</h2>
                <p style="margin:6px 0;font-size:14px;color:#374151;"><strong>Nom :</strong> ${safeName}</p>
                <p style="margin:6px 0;font-size:14px;color:#374151;"><strong>Email :</strong> ${safeEmail}</p>
                <p style="margin:6px 0;font-size:14px;color:#374151;"><strong>Statut :</strong> Inscription reçue</p>
              </div>

              <div style="margin:24px 0;padding:18px;border-left:4px solid #0f172a;background:#f8fafc;border-radius:10px;">
                <p style="margin:0;font-size:14px;line-height:1.8;color:#334155;">
                  Conservez cet email comme confirmation. Vous recevrez d'autres informations si nécessaire.
                </p>
              </div>

              <p style="margin:24px 0 0;font-size:14px;line-height:1.8;color:#6b7280;">
                Si vous n'êtes pas à l'origine de cette inscription, vous pouvez simplement ignorer ce message.
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

              <p style="margin:0;font-size:13px;line-height:1.7;color:#9ca3af;text-align:center;">
                © ${registeredAt.getFullYear()} Medina Chess Festival — Email automatique de confirmation
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const adminHtml = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nouvelle inscription</title>
        </head>
        <body style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;">
            <div style="background:#111827;padding:22px 24px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">Nouvelle inscription reçue</h1>
            </div>

            <div style="padding:24px;">
              <p style="margin:0 0 16px;font-size:15px;color:#374151;">
                Une nouvelle inscription a été enregistrée sur <strong>Medina Chess Festival</strong>.
              </p>

              <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                <tr>
                  <td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;width:180px;">Nom complet</td>
                  <td style="padding:12px;border:1px solid #e5e7eb;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Email</td>
                  <td style="padding:12px;border:1px solid #e5e7eb;">${safeEmail}</td>
                </tr>
                <tr>
                  <td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Date</td>
                  <td style="padding:12px;border:1px solid #e5e7eb;">${escapeHtml(registeredAt.toISOString())}</td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#6b7280;">
                Notification automatique envoyée par la fonction Edge.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const userSend = await sendBrevoEmail({
      apiKey: brevoApiKey,
      senderEmail,
      senderName,
      replyToEmail,
      to: [{ email, name: fullName }],
      subject: "Confirmation d'inscription - Medina Chess Festival",
      htmlContent: userHtml,
    });

    if (!userSend.ok) {
      return jsonResponse(
        {
          success: false,
          error: "User email failed",
          details: userSend.data,
        },
        userSend.status,
      );
    }

    let adminResult: {
      attempted: boolean;
      success: boolean;
      data?: unknown;
      error?: unknown;
    } = {
      attempted: false,
      success: false,
    };

    if (adminEmail) {
      adminResult.attempted = true;

      const adminSend = await sendBrevoEmail({
        apiKey: brevoApiKey,
        senderEmail,
        senderName,
        replyToEmail,
        to: [{ email: adminEmail, name: "Admin" }],
        subject: "Nouvelle inscription - Medina Chess Festival",
        htmlContent: adminHtml,
      });

      adminResult = {
        attempted: true,
        success: adminSend.ok,
        data: adminSend.ok ? adminSend.data : undefined,
        error: adminSend.ok ? undefined : adminSend.data,
      };
    }

    return jsonResponse(
      {
        success: true,
        message: "Registration email sent successfully",
        userEmail: {
          success: true,
          data: userSend.data,
        },
        adminEmail: adminResult,
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

async function sendBrevoEmail({
  apiKey,
  senderEmail,
  senderName,
  replyToEmail,
  to,
  subject,
  htmlContent,
}: {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  replyToEmail?: string | null;
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
}) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      replyTo: replyToEmail
        ? {
            email: replyToEmail,
            name: senderName,
          }
        : undefined,
      to,
      subject,
      htmlContent,
    }),
  });

  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

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
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}