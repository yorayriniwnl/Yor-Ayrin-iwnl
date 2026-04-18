import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import {
  contactNotification,
  confirmationEmail,
  isSpam,
  type ContactFormData,
} from '../../../lib/emailTemplates'

// ─── In-memory rate limit store ───────────────────────────────────────────────

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMIT_MAX    = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 60 minutes in ms

function getRateLimitEntry(ip: string): RateLimitEntry {
  const now = Date.now()

  // Purge stale entries on every request
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) rateLimitMap.delete(key)
  }

  const existing = rateLimitMap.get(ip)
  if (!existing || existing.resetAt < now) {
    const fresh: RateLimitEntry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW }
    rateLimitMap.set(ip, fresh)
    return fresh
  }
  return existing
}

// ─── Validation ───────────────────────────────────────────────────────────────

type FieldErrors = Record<string, string>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateFields(body: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {}
  const { name, email, subject, message } = body

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or fewer.'
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
    errors.subject = 'Please select a subject.'
  } else if (subject.trim().length > 200) {
    errors.subject = 'Subject must be 200 characters or fewer.'
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  } else if (message.trim().length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer.'
  }

  return errors
}

// ─── GET → 405 ────────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse JSON body
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  // 2. Validate fields
  const fieldErrors = validateFields(body)
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, errors: fieldErrors }, { status: 400 })
  }

  const name    = (body.name    as string).trim()
  const email   = (body.email   as string).trim()
  const subject = (body.subject as string).trim()
  const message = (body.message as string).trim()

  // 3. Rate limiting
  const forwarded = req.headers.get('x-forwarded-for')
  const ip        = (forwarded ? forwarded.split(',')[0] : '127.0.0.1').trim()
  const entry     = getRateLimitEntry(ip)

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { ok: false, error: 'Too many messages', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  // Increment before sending to block concurrent duplicate requests
  entry.count++

  // 4. Spam check
  const formData: ContactFormData = {
    name,
    email,
    subject,
    message,
    ip,
    timestamp: new Date().toISOString(),
  }

  if (isSpam(formData)) {
    return NextResponse.json({ ok: false, error: 'Message flagged as spam' }, { status: 400 })
  }

  // 5. Development short-circuit — skip actual send
  if (process.env.NODE_ENV !== 'production') {
    const template = contactNotification(formData)
    console.log('[contact] DEV mode — email send skipped')
    console.log('[contact] To:     ', process.env.EMAIL_TO ?? '(EMAIL_TO not set)')
    console.log('[contact] Subject:', template.subject)
    console.log('[contact] Body:\n', template.text)
    return NextResponse.json({ ok: true, message: 'Message sent successfully' })
  }

  // 6. Send via Nodemailer
  try {
    const transport = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   Number(process.env.EMAIL_PORT ?? 587),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const notification = contactNotification(formData)

    await transport.sendMail({
      from:    process.env.EMAIL_USER,
      to:      process.env.EMAIL_TO,
      replyTo: email,
      subject: notification.subject,
      html:    notification.html,
      text:    notification.text,
    })

    // 7. Optional confirmation email to sender
    if (process.env.SEND_CONFIRMATION === 'true') {
      const confirmation = confirmationEmail(formData)
      await transport.sendMail({
        from:    process.env.EMAIL_USER,
        to:      email,
        replyTo: process.env.EMAIL_USER,
        subject: confirmation.subject,
        html:    confirmation.html,
        text:    confirmation.text,
      })
    }
  } catch (err: unknown) {
    console.error('[contact] Nodemailer send error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: 'Message sent successfully' })
}
