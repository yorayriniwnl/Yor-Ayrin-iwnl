import { SITE_PROFILE } from '../data/personal'

export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
  ip?: string
  timestamp?: string
}

export type EmailTemplate = {
  subject: string
  html: string
  text: string
  replyTo: string
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function contactNotification(data: ContactFormData): EmailTemplate {
  const { name, email, subject, message, ip, timestamp } = data

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#060a14;font-family:system-ui,-apple-system,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060a14;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0f172a;border-radius:12px;overflow:hidden;border:1px solid #1e293b;">
          <tr>
            <td style="padding:32px 36px 0;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                New Contact Message
              </h1>
              <div style="height:2px;background:#6366f1;border-radius:2px;margin-bottom:28px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;">
                    <span style="display:block;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">From</span>
                    <span style="font-size:15px;color:#e2e8f0;">${escapeHtml(name)} &lt;<a href="mailto:${escapeHtml(email)}" style="color:#818cf8;text-decoration:none;">${escapeHtml(email)}</a>&gt;</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;">
                    <span style="display:block;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">Subject</span>
                    <span style="font-size:15px;color:#e2e8f0;">${escapeHtml(subject)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;">
                    <span style="display:block;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">Received</span>
                    <span style="font-size:14px;color:#94a3b8;">${escapeHtml(timestamp || 'Unknown')}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0 16px;">
                    <span style="display:block;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">IP (spam record)</span>
                    <span style="font-size:14px;color:#94a3b8;">${escapeHtml(ip || 'Unknown')}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 28px;">
              <div style="margin-top:8px;background:#0a0f1e;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:18px 20px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Message</p>
                <pre style="margin:0;font-family:'Menlo','Monaco','Courier New',monospace;font-size:13.5px;line-height:1.7;color:#94a3b8;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</pre>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 32px;border-top:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
                Reply directly to this email to respond to <strong style="color:#94a3b8;">${escapeHtml(name)}</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `New message from ${name} (${email})`,
    `Subject: ${subject}`,
    '---',
    message,
    '---',
    `Received: ${timestamp || 'Unknown'}`,
    `IP: ${ip || 'Unknown'}`,
    `Reply to: ${email}`,
  ].join('\n')

  return {
    subject: `[Portfolio] New message from ${name}: ${subject}`,
    html,
    text,
    replyTo: email,
  }
}

export function confirmationEmail(data: ContactFormData): EmailTemplate {
  const { name, message } = data

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Got your message!</title>
</head>
<body style="margin:0;padding:0;background:#060a14;font-family:system-ui,-apple-system,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060a14;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0f172a;border-radius:12px;overflow:hidden;border:1px solid #1e293b;">
          <tr>
            <td style="padding:32px 36px 0;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                Got your message, ${escapeHtml(name)}!
              </h1>
              <div style="height:2px;background:#6366f1;border-radius:2px;margin-bottom:24px;"></div>
              <p style="margin:0 0 20px;font-size:15px;color:#94a3b8;line-height:1.7;">
                Thanks for reaching out. I'll reply within 24 hours.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 32px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#475569;">Your message</p>
              <div style="background:#0a0f1e;border-left:3px solid #334155;border-radius:0 8px 8px 0;padding:16px 18px;">
                <pre style="margin:0;font-family:'Menlo','Monaco','Courier New',monospace;font-size:13px;line-height:1.7;color:#64748b;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</pre>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 32px;border-top:1px solid #1e293b;">
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
                - Ayush Roy &nbsp;·&nbsp; <a href="https://github.com/yorayriniwnl" style="color:#818cf8;text-decoration:none;">GitHub</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `Got your message, ${name}!`,
    '',
    "Thanks for reaching out. I'll reply within 24 hours.",
    '',
    'Your message:',
    '---',
    message,
    '---',
    '- Ayush Roy',
  ].join('\n')

  return {
    subject: `Got your message, ${name}!`,
    html,
    text,
    replyTo: SITE_PROFILE.email,
  }
}

export function isSpam(data: ContactFormData): boolean {
  const { email, message } = data

  if (message.trim().length < 10) return true

  if (!email.includes('@')) return true
  const atIndex = email.indexOf('@')
  const afterAt = email.slice(atIndex + 1)
  if (!afterAt.includes('.')) return true

  const urlMatches = message.match(/https?:\/\//gi)
  if (urlMatches && urlMatches.length >= 3) return true

  return false
}
