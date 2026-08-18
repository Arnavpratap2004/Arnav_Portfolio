import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import {
  GITHUB,
  LINKEDIN,
  SITE,
  body,
  card,
  color,
  container,
  eyebrow,
  font,
  initials,
} from './theme';

export interface ContactNotificationProps {
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
}

/**
 * The "someone contacted you" notification. Optimised for triage rather than
 * for looks: sender, subject, and the message itself should all be legible
 * from the inbox preview without opening anything.
 */
export function ContactNotification({
  name,
  email,
  subject,
  message,
  timestamp,
}: ContactNotificationProps) {
  const subjectLine = subject?.trim() || 'General enquiry';
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subjectLine}`)}`;

  return (
    <Html lang="en">
      <Head />
      {/* Shown next to the subject in the inbox list — the most valuable
          ~90 characters in the whole email. */}
      <Preview>{`${subjectLine} — ${name} <${email}>`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ padding: '24px 12px 16px' }}>
            <Text style={{ margin: 0, fontSize: '12px', color: color.textFaint }}>
              Portfolio contact form
            </Text>
          </Section>

          <Section style={card}>
            {/* ── Dark header ─────────────────────────────────────────── */}
            {/* Corners repeated here: `overflow:hidden` on the card does not
                clip in Outlook or Gmail, so the header rounds itself. */}
            <Section
              style={{
                backgroundColor: color.ink,
                padding: '22px 28px',
                borderRadius: '13px 13px 0 0',
              }}
            >
              <Row>
                <Column>
                  <Text
                    style={{
                      margin: 0,
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: color.green,
                    }}
                  >
                    ● New message
                  </Text>
                  <Heading
                    as="h1"
                    style={{
                      margin: '8px 0 0',
                      fontSize: '21px',
                      lineHeight: '28px',
                      fontWeight: 600,
                      color: color.onDark,
                    }}
                  >
                    {subjectLine}
                  </Heading>
                </Column>
              </Row>
            </Section>

            {/* ── Sender ──────────────────────────────────────────────── */}
            <Section style={{ padding: '22px 28px 0' }}>
              <Row>
                <Column style={{ width: '44px', verticalAlign: 'top' }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: color.inkSoft,
                            borderRadius: '20px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            fontFamily: font,
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            color: color.onDark,
                          }}
                        >
                          {initials(name)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Column>
                <Column style={{ paddingLeft: '14px', verticalAlign: 'top' }}>
                  <Text
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      lineHeight: '22px',
                      fontWeight: 600,
                      color: color.text,
                    }}
                  >
                    {name}
                  </Text>
                  <Link
                    href={`mailto:${email}`}
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: color.link,
                      textDecoration: 'none',
                    }}
                  >
                    {email}
                  </Link>
                </Column>
              </Row>

              <Text
                style={{
                  margin: '14px 0 0',
                  fontSize: '13px',
                  lineHeight: '18px',
                  color: color.textMuted,
                }}
              >
                {timestamp}
              </Text>
            </Section>

            {/* ── Message ─────────────────────────────────────────────── */}
            <Section style={{ padding: '18px 28px 0' }}>
              <Text style={eyebrow}>Message</Text>
              <Section
                style={{
                  backgroundColor: color.well,
                  border: `1px solid ${color.border}`,
                  borderLeft: `3px solid ${color.cyanSoft}`,
                  borderRadius: '8px',
                  padding: '16px 18px',
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    lineHeight: '25px',
                    color: color.text,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message}
                </Text>
              </Section>
            </Section>

            {/* ── Reply ───────────────────────────────────────────────── */}
            <Section style={{ padding: '22px 28px 26px', textAlign: 'center' }}>
              {/* Hand-rolled rather than <Button> so Outlook's Word engine keeps
                  the vertical padding instead of collapsing the anchor. */}
              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                style={{ margin: '0 auto' }}
              >
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: color.ink, borderRadius: '8px' }}>
                      <Link
                        href={replyHref}
                        style={{
                          display: 'inline-block',
                          padding: '12px 30px',
                          fontFamily: font,
                          fontSize: '14px',
                          fontWeight: 600,
                          color: color.onDark,
                          textDecoration: 'none',
                        }}
                      >
                        Reply to {name.split(' ')[0]} →
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Text
                style={{
                  margin: '10px 0 0',
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: color.textFaint,
                }}
              >
                Replying to this email also goes straight to {email}
              </Text>
            </Section>

            <Hr style={{ margin: 0, border: 'none', borderTop: `1px solid ${color.border}` }} />

            {/* ── Footer ──────────────────────────────────────────────── */}
            <Section
              style={{
                backgroundColor: color.well,
                padding: '14px 28px',
                borderRadius: '0 0 13px 13px',
              }}
            >
              <Row>
                <Column>
                  <Link
                    href={SITE}
                    style={{ fontSize: '12px', color: color.textMuted, textDecoration: 'none' }}
                  >
                    arnavpratap.tech
                  </Link>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Link
                    href={GITHUB}
                    style={{
                      fontSize: '12px',
                      color: color.textMuted,
                      textDecoration: 'none',
                      paddingLeft: '14px',
                    }}
                  >
                    GitHub
                  </Link>
                  <Link
                    href={LINKEDIN}
                    style={{
                      fontSize: '12px',
                      color: color.textMuted,
                      textDecoration: 'none',
                      paddingLeft: '14px',
                    }}
                  >
                    LinkedIn
                  </Link>
                </Column>
              </Row>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Plain-text alternative, sent alongside the HTML for deliverability. */
export function contactNotificationText({
  name,
  email,
  subject,
  message,
  timestamp,
}: ContactNotificationProps): string {
  const subjectLine = subject?.trim() || 'General enquiry';

  return [
    'NEW MESSAGE — portfolio contact form',
    '',
    `From:    ${name} <${email}>`,
    `Subject: ${subjectLine}`,
    `Sent:    ${timestamp}`,
    '',
    '----------------------------------------',
    message,
    '----------------------------------------',
    '',
    `Reply directly to this email, or write to ${email}.`,
    '',
    'arnavpratap.tech',
  ].join('\n');
}

export default ContactNotification;
