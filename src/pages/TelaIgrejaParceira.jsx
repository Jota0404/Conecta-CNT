import React, { useState, useEffect, useRef } from 'react';
import {
  Landmark, MapPin, Clock, MessageCircle, Sparkles, BadgeCheck, Users,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Design tokens — Identidade "Céu na Terra"                          */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: '#121212',
  bgAlt: '#18181B',
  card: '#1E1E1E',
  cardAlt: '#27272A',
  accent: '#E5B84C',
  cream: '#FAF6ED',
  whatsapp: '#25D366',
};
const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

const CHURCH_NAME = 'Igreja Batista Central';
const CHURCH_REGION = 'Cobrindo Asa Sul, Águas Claras, Taguatinga, Sudoeste e Guará';

/* ------------------------------------------------------------------ */
/* Status — configuração central (label + cor)                        */
/* ------------------------------------------------------------------ */
const STATUS = {
  ESPERANDO: 'Esperando Contato',
  CONTACTADO: 'Contactado',
  MEMBRO: 'Em Igreja Local',
};

const STATUS_CONFIG = {
  [STATUS.ESPERANDO]: { label: 'Esperando Contato', color: '#E5B84C' },
  [STATUS.CONTACTADO]: { label: 'Contactado', color: '#3B82F6' },
  [STATUS.MEMBRO]: { label: 'Em Igreja Local', color: '#10B981' },
};

const STATUS_LIST = [STATUS.ESPERANDO, STATUS.CONTACTADO, STATUS.MEMBRO];
const FILTERS = ['Todos', ...STATUS_LIST];

/* ------------------------------------------------------------------ */
/* Mock data — 5 convertidos em status diferentes                     */
/* ------------------------------------------------------------------ */
const INITIAL_CONVERTS = [
  { id: 1, nome: 'Mariana Costa', bairro: 'Asa Sul', distancia: '1.4 km da igreja', dias: 1, status: STATUS.ESPERANDO },
  { id: 2, nome: 'Pedro Henrique Alves', bairro: 'Águas Claras', distancia: '2.1 km da igreja', dias: 3, status: STATUS.ESPERANDO },
  { id: 3, nome: 'Juliana Ferreira', bairro: 'Taguatinga', distancia: '3.5 km da igreja', dias: 5, status: STATUS.CONTACTADO },
  { id: 4, nome: 'Lucas Martins', bairro: 'Sudoeste', distancia: '0.8 km da igreja', dias: 2, status: STATUS.CONTACTADO },
  { id: 5, nome: 'Camila Rodrigues', bairro: 'Guará', distancia: '2.9 km da igreja', dias: 9, status: STATUS.MEMBRO },
];

/* ------------------------------------------------------------------ */
/* Global styles (fonts, keyframes, scrollbar)                        */
/* ------------------------------------------------------------------ */
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <style>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .anim-fade { animation: fadeIn 0.2s ease-out; }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/* Cabeçalho + estatísticas rápidas                                   */
/* ------------------------------------------------------------------ */
function Header({ counts }) {
  return (
    <div className="flex-shrink-0 px-5 pt-8 pb-4" style={{ backgroundColor: COLORS.bgAlt, borderBottom: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Landmark size={16} style={{ color: COLORS.accent }} />
        <span className="text-xs font-bold tracking-widest" style={{ color: COLORS.accent }}>PAINEL DA IGREJA PARCEIRA</span>
      </div>
      <h1 className="text-xl font-extrabold" style={{ color: COLORS.accent, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em' }}>
        {CHURCH_NAME}
      </h1>
      <p className="text-sm mt-0.5" style={{ color: COLORS.cream }}>{CHURCH_REGION}</p>

      <div className="h-1 w-14 rounded-full mt-3 mb-4" style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.bgAlt}, ${COLORS.accent})` }} />

      <div className="grid grid-cols-3 gap-2">
        {STATUS_LIST.map((s) => (
          <div key={s} className="rounded-xl px-2 py-2.5 text-center" style={{ backgroundColor: COLORS.card, border: `1px solid ${STATUS_CONFIG[s].color}33` }}>
            <p className="text-lg font-extrabold" style={{ color: STATUS_CONFIG[s].color, fontFamily: FONT_DISPLAY }}>{counts[s] || 0}</p>
            <p className="text-xs mt-0.5 leading-tight" style={{ color: 'rgba(250,246,237,0.55)' }}>{STATUS_CONFIG[s].label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filtros de status                                                  */
/* ------------------------------------------------------------------ */
function FilterPills({ active, onChange }) {
  return (
    <div className="flex-shrink-0 px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar" style={{ backgroundColor: COLORS.bgAlt, borderBottom: '1px solid rgba(250,246,237,0.06)' }}>
      {FILTERS.map((f) => {
        const isActive = active === f;
        const label = f === 'Todos' ? 'Todos' : STATUS_CONFIG[f].label;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
            style={{
              backgroundColor: isActive ? COLORS.accent : COLORS.card,
              color: isActive ? '#121212' : COLORS.cream,
              border: `1px solid ${isActive ? COLORS.accent : 'rgba(250,246,237,0.12)'}`,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Badge de status                                                    */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: `${cfg.color}26`, color: cfg.color, border: `1px solid ${cfg.color}55` }}
    >
      {cfg.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Card de convertido                                                 */
/* ------------------------------------------------------------------ */
function ConvertCard({ person, index, onContact, onMarkMember }) {
  const initials = person.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const avatarBg = index % 2 === 0 ? COLORS.accent : COLORS.cardAlt;
  const avatarColor = index % 2 === 0 ? '#121212' : COLORS.cream;
  const isMember = person.status === STATUS.MEMBRO;

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{ width: 42, height: 42, backgroundColor: avatarBg, color: avatarColor, fontFamily: FONT_DISPLAY }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold truncate" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{person.nome}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={12} style={{ color: 'rgba(250,246,237,0.5)', flexShrink: 0 }} />
              <span className="text-xs truncate" style={{ color: 'rgba(250,246,237,0.55)' }}>{person.bairro} · {person.distancia}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={person.status} />
      </div>

      <div className="flex items-center gap-1 mb-4">
        <Clock size={12} style={{ color: 'rgba(250,246,237,0.4)' }} />
        <span className="text-xs" style={{ color: 'rgba(250,246,237,0.4)' }}>
          Cadastrado há {person.dias} {person.dias === 1 ? 'dia' : 'dias'}
        </span>
      </div>

      {isMember ? (
        <div
          className="flex items-center justify-center gap-2 rounded-xl py-2.5"
          style={{ backgroundColor: `${STATUS_CONFIG[STATUS.MEMBRO].color}1A`, border: `1px solid ${STATUS_CONFIG[STATUS.MEMBRO].color}40` }}
        >
          <BadgeCheck size={16} style={{ color: STATUS_CONFIG[STATUS.MEMBRO].color }} />
          <span className="text-xs font-semibold" style={{ color: STATUS_CONFIG[STATUS.MEMBRO].color }}>Já é membro da comunidade</span>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onContact(person)}
            className="flex-1 flex items-center justify-center text-center rounded-xl py-2.5 font-bold text-xs leading-tight transition-transform active:scale-95"
            style={{ backgroundColor: COLORS.whatsapp, color: '#0b2b16' }}
          >
            🟢 Entrar em Contato (WhatsApp)
          </button>
          <button
            onClick={() => onMarkMember(person)}
            className="flex-1 flex items-center justify-center text-center rounded-xl py-2.5 font-bold text-xs leading-tight transition-transform active:scale-95"
            style={{ backgroundColor: COLORS.accent, color: '#121212' }}
          >
            ✨ Marcar como Membro Local
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Estado vazio                                                       */
/* ------------------------------------------------------------------ */
function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <Users size={30} style={{ color: 'rgba(250,246,237,0.25)' }} />
      <p className="text-sm mt-3" style={{ color: 'rgba(250,246,237,0.45)' }}>Nenhum convertido em "{label}" no momento.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast                                                              */
/* ------------------------------------------------------------------ */
function Toast({ message }) {
  return (
    <div className="absolute left-0 right-0 flex justify-center anim-fade" style={{ bottom: 20 }}>
      <div
        className="px-4 py-2.5 rounded-full text-sm font-medium max-w-xs text-center"
        style={{ backgroundColor: COLORS.cardAlt, color: COLORS.cream, border: '1px solid rgba(229,184,76,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
      >
        {message}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App principal                                                      */
/* ------------------------------------------------------------------ */
export default function App() {
  const [converts, setConverts] = useState(INITIAL_CONVERTS);
  const [filter, setFilter] = useState('Todos');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  };

  const handleContact = (person) => {
    const firstName = person.nome.split(' ')[0];
    const message = `Olá, ${firstName}! Que alegria saber da sua decisão! Somos da ${CHURCH_NAME} e estamos aqui para te acompanhar nessa nova caminhada de fé. 🙏`;
    const url = `https://wa.me/5561999999999?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setConverts((prev) => prev.map((c) => (
      c.id === person.id && c.status === STATUS.ESPERANDO ? { ...c, status: STATUS.CONTACTADO } : c
    )));
    showToast(`Conversa iniciada com ${firstName}`);
  };

  const handleMarkMember = (person) => {
    const firstName = person.nome.split(' ')[0];
    setConverts((prev) => prev.map((c) => (c.id === person.id ? { ...c, status: STATUS.MEMBRO } : c)));
    showToast(`🎉 ${firstName} agora é membro local!`);
  };

  const counts = converts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const filtered = filter === 'Todos' ? converts : converts.filter((c) => c.status === filter);

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ backgroundColor: '#0a0a0a', fontFamily: FONT_BODY }}>
      <div className="w-full max-w-md flex flex-col relative min-h-screen sm:border-x" style={{ backgroundColor: COLORS.bg, borderColor: 'rgba(250,246,237,0.08)' }}>
        <GlobalStyles />

        <Header counts={counts} />
        <FilterPills active={filter} onChange={setFilter} />

        <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3" style={{ backgroundColor: COLORS.bg }}>
          {filtered.length === 0 ? (
            <EmptyState label={filter === 'Todos' ? 'Todos' : STATUS_CONFIG[filter].label} />
          ) : (
            filtered.map((p, i) => (
              <ConvertCard key={p.id} person={p} index={i} onContact={handleContact} onMarkMember={handleMarkMember} />
            ))
          )}
        </main>

        {toast && <Toast message={toast} />}
      </div>
    </div>
  );
}