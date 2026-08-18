import { createElement } from 'react';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import {
  ContactAutoReply,
  contactAutoReplyText,
} from '@/emails/ContactAutoReply';
import {
  ContactNotification,
  contactNotificationText,
} from '@/emails/ContactNotification';

// Verify a domain in Resend and set CONTACT_FROM_EMAIL to an address on it
// (e.g. "Portfolio Contact <hello@arnavpratap.tech>"). Until then the shared
// onboarding@resend.dev sender only delivers to the Resend account owner.
const FROM_NOTIFICATION =
  process.env.CONTACT_FROM_EMAIL ?? 'Portfolio Contact <onboarding@resend.dev>';
const FROM_AUTOREPLY =
  process.env.CONTACT_FROM_EMAIL ?? 'Arnav Pratap <onboarding@resend.dev>';
const TO_ADDRESS = process.env.CONTACT_TO_EMAIL ?? 'arnavpratap2003@gmail.com';

// The form already caps these client-side; enforce it again here so a direct
// POST cannot push a novel through the templates.
const MAX = { name: 120, email: 200, subject: 200, message: 5000 };

function clamp(value: unknown, limit: number): string {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Contact API: RESEND_API_KEY is not set in this environment.');
    return NextResponse.json(
      { error: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const payload = await request.json();

    const name = clamp(payload.name, MAX.name);
    const email = clamp(payload.email, MAX.email);
    const subject = clamp(payload.subject, MAX.subject);
    const message = clamp(payload.message, MAX.message);

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

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const subjectLine = subject || 'General enquiry';
    const notification = { name, email, subject, message, timestamp };

    const { data, error } = await resend.emails.send({
      from: FROM_NOTIFICATION,
      to: TO_ADDRESS,
      replyTo: email,                                    // reply goes directly to sender
      // Prefixed so it stays filterable in Gmail, but the sender and their
      // actual subject are now in the line too.
      subject: `[Portfolio] ${name} — ${subjectLine}`,
      html: await render(createElement(ContactNotification, notification)),
      text: contactNotificationText(notification),
    });

    if (error) {
      console.error('Resend error sending notification:', error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    console.log('Contact notification queued:', data?.id);

    // Auto-reply to the sender. Best-effort only: the notification above already
    // succeeded, so a failure here must never turn this into a 500 for the visitor.
    // (With the unverified onboarding@resend.dev sender this call is rejected for
    // every address except the Resend account owner's.)
    try {
      const autoReplyProps = { name, subject, message };

      const autoReply = await resend.emails.send({
        from: FROM_AUTOREPLY,
        to: email,
        replyTo: TO_ADDRESS,
        subject: `Thanks for reaching out, ${name.split(' ')[0]}`,
        html: await render(createElement(ContactAutoReply, autoReplyProps)),
        text: contactAutoReplyText(autoReplyProps),
      });

      if (autoReply.error) {
        console.warn('Resend auto-reply skipped:', autoReply.error);
      }
    } catch (autoReplyError) {
      console.warn('Resend auto-reply threw:', autoReplyError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
