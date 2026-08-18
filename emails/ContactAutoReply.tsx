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
  firstName,
  paragraph,
} from './theme';

export interface ContactAutoReplyProps {
  name: string;
  subject?: string;
  message: string;
}

const LINKS: { label: string; description: string; href: string }[] = [
  { label: 'Portfolio', description: 'Projects, experience, and writing', href: SITE },
  { label: 'GitHub', description: 'Source for everything I ship', href: GITHUB },
  { label: 'LinkedIn', description: 'Background and current work', href: LINKEDIN },
];

/**
 * Confirmation sent back to whoever used the contact form. The echoed copy of
 * their own message is the point of the email — it proves the form worked and
 * gives them a record of what they actually sent.
 */
export function ContactAutoReply({ name, subject, message }: ContactAutoReplyProps) {
  const greeting = firstName(name);
  const subjectLine = subject?.trim() || 'General enquiry';

  return (
    <Html lang="en">
      <Head />
      <Preview>{`Your message reached me, ${greeting} — I reply to everything within 24–48 hours.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ padding: '24px 12px 16px' }}>
            <Text style={{ margin: 0, fontSize: '12px', color: color.textFaint }}>
              arnavpratap.tech
            </Text>
          </Section>

          <Section style={card}>
            {/* ── Dark header ─────────────────────────────────────────── */}
            {/* Corners repeated here: `overflow:hidden` on the card does not
                clip in Outlook or Gmail, so the header rounds itself. */}
            <Section
              style={{
                backgroundColor: color.ink,
                padding: '26px 28px',
                borderRadius: '13px 13px 0 0',
              }}
            >
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
                ✓ Message received
              </Text>
              <Heading
                as="h1"
                style={{
                  margin: '10px 0 0',
                  fontSize: '23px',
                  lineHeight: '30px',
                  fontWeight: 600,
                  color: color.onDark,
                }}
              >
                Thanks for reaching out, {greeting}
              </Heading>
              <Text
                style={{
                  margin: '8px 0 0',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: color.onDarkMuted,
                }}
              >
                This one is automatic — a real reply is on its way.
              </Text>
            </Section>

            {/* ── Body copy ───────────────────────────────────────────── */}
            <Section style={{ padding: '26px 28px 0' }}>
              <Text style={paragraph}>
                Your message landed in my inbox. I read every one myself, so you can expect a
                proper response within <strong style={{ color: color.text }}>24–48 hours</strong>
                {' '}— usually sooner.
              </Text>
              <Text style={{ ...paragraph, margin: '0 0 4px' }}>
                If it is time-sensitive, just reply to this email and it will come straight back
                to me.
              </Text>
            </Section>

            {/* ── Echo of their message ───────────────────────────────── */}
            <Section style={{ padding: '20px 28px 0' }}>
              <Text style={eyebrow}>What you sent</Text>
              <Section
                style={{
                  backgroundColor: color.well,
                  border: `1px solid ${color.border}`,
                  borderRadius: '8px',
                  padding: '16px 18px',
                }}
              >
                <Text
                  style={{
                    margin: '0 0 10px',
                    fontSize: '13px',
                    lineHeight: '18px',
                    fontWeight: 600,
                    color: color.textMuted,
                  }}
                >
                  {subjectLine}
                </Text>
                <Hr
                  style={{
                    margin: '0 0 12px',
                    border: 'none',
                    borderTop: `1px solid ${color.borderStrong}`,
                  }}
                />
                <Text
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '24px',
                    color: color.text,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message}
                </Text>
              </Section>
            </Section>

            {/* ── Meanwhile ───────────────────────────────────────────── */}
            <Section style={{ padding: '24px 28px 0' }}>
              <Text style={eyebrow}>In the meantime</Text>
              {LINKS.map((link) => (
                <Row key={link.href} style={{ marginBottom: '10px' }}>
                  <Column>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '15px',
                        lineHeight: '22px',
                        fontWeight: 600,
                        color: color.link,
                        textDecoration: 'none',
                      }}
                    >
                      {link.label} →
                    </Link>
                    <Text
                      style={{
                        margin: '1px 0 0',
                        fontSize: '13px',
                        lineHeight: '19px',
                        color: color.textMuted,
                      }}
                    >
                      {link.description}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* ── CTA ─────────────────────────────────────────────────── */}
            <Section style={{ padding: '22px 28px 26px', textAlign: 'center' }}>
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
                        href={`${SITE}/Arnav_Resume.pdf`}
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
                        Download my resume
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr style={{ margin: 0, border: 'none', borderTop: `1px solid ${color.border}` }} />

            {/* ── Signature ───────────────────────────────────────────── */}
            <Section style={{ padding: '20px 28px' }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: color.textMuted,
                }}
              >
                Best,
              </Text>
              <Text
                style={{
                  margin: '2px 0 0',
                  fontSize: '15px',
                  lineHeight: '22px',
                  fontWeight: 600,
                  color: color.text,
                }}
              >
                Arnav Pratap
              </Text>
              <Text
                style={{
                  margin: '2px 0 0',
                  fontSize: '13px',
                  lineHeight: '19px',
                  color: color.textMuted,
                }}
              >
                Computer Science undergraduate, VIT Vellore
              </Text>
            </Section>
          </Section>

          {/* ── Outside the card ──────────────────────────────────────── */}
          <Section style={{ padding: '16px 12px 0', textAlign: 'center' }}>
            <Text
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: '18px',
                color: color.textFaint,
              }}
            >
              You are receiving this because you used the contact form on{' '}
              <Link href={SITE} style={{ color: color.textMuted }}>
                arnavpratap.tech
              </Link>
              . No further action is needed.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Plain-text alternative, sent alongside the HTML for deliverability. */
export function contactAutoReplyText({ name, subject, message }: ContactAutoReplyProps): string {
  const greeting = firstName(name);
  const subjectLine = subject?.trim() || 'General enquiry';

  return [
    `Thanks for reaching out, ${greeting}.`,
    '',
    'Your message landed in my inbox. I read every one myself, so you can',
    'expect a proper response within 24-48 hours — usually sooner.',
    '',
    'If it is time-sensitive, just reply to this email and it will come',
    'straight back to me.',
    '',
    'WHAT YOU SENT',
    `Subject: ${subjectLine}`,
    '',
    message,
    '',
    'IN THE MEANTIME',
    `Portfolio — ${SITE}`,
    `GitHub   — ${GITHUB}`,
    `LinkedIn — ${LINKEDIN}`,
    `Resume   — ${SITE}/Arnav_Resume.pdf`,
    '',
    'Best,',
    'Arnav Pratap',
    'Computer Science undergraduate, VIT Vellore',
    '',
    '--',
    `You are receiving this because you used the contact form on ${SITE}.`,
  ].join('\n');
}

export default ContactAutoReply;
