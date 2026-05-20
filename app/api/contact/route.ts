import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const now = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // change after domain verification
      to: 'arnavpratap2003@gmail.com',
      replyTo: email,                                    // reply goes directly to sender
      subject: `Portfolio Contact — ${name}`,
      html: buildEmailHtml({ name, email, subject, message, timestamp: now }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    // Auto-reply to the sender
    await resend.emails.send({
      from: 'Arnav Pratap <onboarding@resend.dev>',
      to: email,
      subject: `Got your message, ${name.split(' ')[0]}!`,
      html: buildAutoReplyHtml({ name }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// ─── Main notification email to Arnav ────────────────────────────────────────

function buildEmailHtml({
  name,
  email,
  subject,
  message,
  timestamp,
}: {
  name: string
  email: string
  subject?: string
  message: string
  timestamp: string
}) {
  const subjectLine = subject ? subject : 'General enquiry';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Contact</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="background:#0f0f0f;padding:28px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;height:40px;background:#1e1e1e;border:1.5px solid #333;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#e0e0e0;font-size:14px;font-weight:500;line-height:40px;">AP</span>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:500;">Arnav Pratap</p>
                          <p style="margin:0;color:#888;font-size:12px;">arnavpratap.tech</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:20px 0 4px;color:#ffffff;font-size:20px;font-weight:500;">New message from your portfolio</p>
                    <p style="margin:0;color:#888;font-size:13px;">Someone reached out through your contact form</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;">

              <!-- Timestamp alert -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e5e5;border-left:3px solid #4ade80;border-radius:6px;margin-bottom:20px;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#666;">
                    &#128336; Sent on ${timestamp} &mdash; reply within 24h for best conversion
                  </td>
                </tr>
              </table>

              <!-- Name + Email grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="50%" style="padding-right:8px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:500;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Name</p>
                    <p style="margin:0;font-size:15px;font-weight:500;color:#111;">${escapeHtml(name)}</p>
                  </td>
                  <td width="50%" style="padding-left:8px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:500;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Email</p>
                    <p style="margin:0;font-size:14px;color:#2563eb;">
                      <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;font-weight:500;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Subject</p>
                    <p style="margin:0;font-size:14px;color:#111;">${escapeHtml(subjectLine)}</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f9fafb;border:1px solid #e5e5e5;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:500;color:#999;text-transform:uppercase;letter-spacing:0.06em;">&#128172; Message</p>
                    <p style="margin:0;font-size:14px;color:#111;line-height:1.65;white-space:pre-wrap;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}?subject=Re: ${encodeURIComponent(subjectLine)}"
                       style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:500;padding:10px 28px;border-radius:6px;text-decoration:none;border:1px solid #333;">
                      &#8594; Reply to ${escapeHtml(name.split(' ')[0])}
                    </a>
                    <p style="margin:8px 0 0;font-size:11px;color:#999;">Clicking reply goes directly to ${escapeHtml(email)}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e5e5;padding:16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px;color:#999;">
                    &#128737; Sent from arnavpratap.tech
                  </td>
                  <td align="right">
                    <a href="https://github.com/Arnavpratap2004" style="font-size:12px;color:#999;text-decoration:none;margin-left:12px;">GitHub</a>
                    <a href="https://www.linkedin.com/in/arnavpratap2004/" style="font-size:12px;color:#999;text-decoration:none;margin-left:12px;">LinkedIn</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ─── Auto-reply email to sender ───────────────────────────────────────────────

function buildAutoReplyHtml({ name }: { name: string }) {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thanks for reaching out</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
          <tr>
            <td style="background:#0f0f0f;padding:28px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:500;">Thanks for reaching out, ${escapeHtml(firstName)}!</p>
              <p style="margin:8px 0 0;color:#888;font-size:13px;">I've received your message and will get back to you within 24&ndash;48 hours.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.65;">
                While you wait, feel free to explore my work:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 0;">
                    <a href="https://github.com/Arnavpratap2004" style="font-size:14px;color:#2563eb;text-decoration:none;">&#8594; GitHub — see my projects</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <a href="https://www.linkedin.com/in/arnavpratap2004/" style="font-size:14px;color:#2563eb;text-decoration:none;">&#8594; LinkedIn profile</a>
                  </td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
              <p style="margin:0;font-size:13px;color:#999;">
                Best,<br />
                <strong style="color:#111;">Arnav Pratap</strong><br />
                arnavpratap.tech
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
