import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { texts } from '../i18n.js'

const EMAILJS_SERVICE = 'service_lb0kxnq'
const EMAILJS_TEMPLATE = 'template_6e5orcz'
const EMAILJS_PUBLIC_KEY = 'HDEb-BFZUK_NeQ3bL'

const GOOGLE_CALENDAR_ID = 'gabrielacampc@gmail.com'

export default function Panel({ focus, lang }) {
  const tr = texts[lang]
  const formRef = useRef()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (EMAILJS_SERVICE === 'SEU_SERVICE_ID') {
      alert(lang === 'pt'
        ? 'Configure os IDs do EmailJS no arquivo Panel.jsx para enviar e-mails.'
        : 'Configure EmailJS IDs in Panel.jsx to send emails.')
      return
    }
    setSending(true)
    setError(false)
    emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => { setSending(false); setSent(true); formRef.current.reset() })
      .catch(() => { setSending(false); setError(true) })
  }

  if (focus === 'about') {
    return (
      <aside className="panel">
        <h2>{tr.about.title}</h2>
        <div className="about-head">
          <img className="avatar" src="/img/perfil.png" alt="Gabriela Campelo" />
          <div>
            <strong>Gabriela Campelo</strong>
            <p>{tr.role}</p>
          </div>
        </div>
        <p>{tr.about.body}</p>
        <h3>{tr.about.skills}</h3>
        <div className="tags">
          {['PHP', 'Python', 'Flask', 'Node.js', 'React', 'JavaScript', 'Flutter', 'Dart', 'MySQL', 'SQLite', 'Git', 'Scrum', 'APIs REST', 'scikit-learn'].map((s) => (
            <em key={s}>{s}</em>
          ))}
        </div>
      </aside>
    )
  }

  if (focus === 'experience') {
    return (
      <aside className="panel">
        <h2>{tr.experience.title}</h2>
        {tr.experience.items.map((it, i) => (
          <div className="card" key={i}>
            <div className="card-top">
              <strong>{it.org}</strong>
              <span>{it.period}</span>
            </div>
            <div className="card-role">{it.role}</div>
            <p>{it.desc}</p>
          </div>
        ))}
      </aside>
    )
  }

  if (focus === 'contact') {
    return (
      <aside className="panel">
        <h2>{tr.contact.title}</h2>
        <div className="icons">
          {[
            ['✉', 'E-mail', 'mailto:gabrielacampc@gmail.com'],
            ['☎', 'WhatsApp', 'https://wa.me/5531989116569'],
            ['in', 'LinkedIn', 'https://www.linkedin.com/in/gabriela-campelo'],
            ['⌥', 'GitHub', 'https://github.com/gabiscamp'],
          ].map(([ic, label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}>
              <span>{ic}</span>
              {label}
            </a>
          ))}
        </div>

        {sent ? (
          <div style={{ background: 'rgba(63,158,90,0.15)', border: '1px solid rgba(63,158,90,0.3)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
            <p style={{ color: '#3f9e5a', fontWeight: 600, margin: 0 }}>
              {lang === 'pt' ? 'Mensagem enviada com sucesso!' : 'Message sent successfully!'}
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <label>
              {tr.contact.name}
              <input type="text" name="from_name" required />
            </label>
            <label>
              {tr.contact.email}
              <input type="email" name="reply_to" required />
            </label>
            <label>
              {tr.contact.message}
              <textarea rows="4" name="message" required />
            </label>
            <button type="submit" disabled={sending}>
              {sending
                ? (lang === 'pt' ? 'Enviando...' : 'Sending...')
                : tr.contact.send}
            </button>
            {error && (
              <small style={{ color: '#f87171' }}>
                {lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Failed to send. Try again.'}
              </small>
            )}
          </form>
        )}
      </aside>
    )
  }

  if (focus === 'agenda') {
    const calSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(GOOGLE_CALENDAR_ID)}&ctz=America/Sao_Paulo&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&bgcolor=%231e1a2e`
    return (
      <aside className="panel" style={{ width: 'min(620px, calc(100vw - 32px))' }}>
        <h2>{lang === 'pt' ? 'Minha Agenda' : 'My Schedule'}</h2>
        <p style={{ marginBottom: 14 }}>
          {lang === 'pt'
            ? 'Veja meus horários disponíveis e entre em contato para agendar!'
            : 'Check my availability and get in touch to schedule!'}
        </p>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <iframe
            src={calSrc}
            style={{ width: '100%', height: 400, border: 0 }}
            title="Google Calendar"
          />
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <a
            href="https://wa.me/5531989116569"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, textAlign: 'center', padding: '10px 16px',
              background: 'rgba(63,158,90,0.15)', border: '1px solid rgba(63,158,90,0.3)',
              borderRadius: 999, color: '#3f9e5a', fontWeight: 600, fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {lang === 'pt' ? '☎ Agendar via WhatsApp' : '☎ Schedule via WhatsApp'}
          </a>
          <a
            href="mailto:gabrielacampc@gmail.com"
            style={{
              flex: 1, textAlign: 'center', padding: '10px 16px',
              background: 'rgba(124,92,191,0.15)', border: '1px solid rgba(124,92,191,0.3)',
              borderRadius: 999, color: '#c4b5e0', fontWeight: 600, fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {lang === 'pt' ? '✉ Agendar via E-mail' : '✉ Schedule via E-mail'}
          </a>
        </div>
      </aside>
    )
  }

  return null
}
