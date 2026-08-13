import React, { useState, useEffect, useRef } from 'react';
import {
  Sunrise, User, Phone, MapPin, Check, MessageCircle,
  Landmark, Video, BookOpen, Play, ExternalLink,
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

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */
const CHURCHES = [
  { id: 1, name: 'Comunidade Vida Nova', pastor: 'Pr. João Pereira', distance: '1.2 km de você', denom: 'Presbiteriana', endereco: 'SQS 308, Asa Sul, Brasília - DF', tags: ['Culto de Jovens', 'Estudo Bíblico'] },
  { id: 2, name: 'Igreja Batista Renovada', pastor: 'Pra. Marta Alves', distance: '1.8 km de você', denom: 'Batista', endereco: 'QNM 24, Taguatinga Norte, Brasília - DF', tags: ['Ação Social', 'Culto de Jovens'] },
  { id: 3, name: 'Assembleia de Deus Belém', pastor: 'Pr. Carlos Souza', distance: '2.4 km de você', denom: 'Assembleia de Deus', endereco: 'QNA 15, Taguatinga, Brasília - DF', tags: ['Estudo Bíblico', 'Ação Social'] },
  { id: 4, name: 'Igreja Presbiteriana Esperança', pastor: 'Pr. Rafael Lima', distance: '3.1 km de você', denom: 'Presbiteriana', endereco: 'SQSW 105, Sudoeste, Brasília - DF', tags: ['Culto de Jovens', 'Estudo Bíblico', 'Ação Social'] },
  { id: 5, name: 'Comunidade Cristã Restauração', pastor: 'Pra. Ana Costa', distance: '3.6 km de você', denom: 'Interdenominacional', endereco: 'QE 38, Guará, Brasília - DF', tags: ['Ação Social', 'Estudo Bíblico'] },
];

const VIDEOS = [
  { id: 1, eyebrow: 'PRIMEIROS PASSOS', title: 'Como a Bíblia é dividida?', caption: 'Antigo e Novo Testamento explicados de um jeito simples.', likes: 842, shares: 96 },
  { id: 2, eyebrow: 'VIDA DE ORAÇÃO', title: 'Como começar a orar?', caption: 'Um guia simples para sua primeira conversa com Deus.', likes: 1204, shares: 158 },
  { id: 3, eyebrow: 'HÁBITOS DE FÉ', title: 'Dicas para o devocional', caption: 'Como criar o hábito de ler a Bíblia todos os dias.', likes: 673, shares: 71 },
  { id: 5, eyebrow: 'COMUNIDADE', title: 'Por que fazer parte de uma igreja?', caption: 'A importância de caminhar acompanhado na fé.', likes: 389, shares: 42 },
];

const MATERIALS = [
  { id: 1, title: 'Bíblia de Estudo NVI', publisher: 'Editora Vida', price: 'R$ 89,90' },
  { id: 2, title: 'Novo Começo: Guia do Convertido', publisher: 'Ed. Plenitude', price: 'R$ 39,90' },
  { id: 3, title: 'Devocional 365 Dias com Deus', publisher: 'Ed. Mundo Cristão', price: 'R$ 44,90' },
  { id: 4, title: 'Meu Primeiro Passo na Fé', publisher: 'Ed. Plenitude', price: 'R$ 24,90' },
  { id: 5, title: 'Bíblia King James Slim', publisher: 'Ed. BVBooks', price: 'R$ 69,90' },
  { id: 6, title: 'Fundamentos da Fé Cristã', publisher: 'Ed. Vida Nova', price: 'R$ 34,90' },
];

const TABS = [
  { key: 'igrejas', label: 'Igrejas', icon: Landmark },
  { key: 'videos', label: 'Vídeos', icon: Video },
  { key: 'materiais', label: 'Materiais', icon: BookOpen },
];

/* ------------------------------------------------------------------ */
/* Global styles (fonts, keyframes, scrollbar) — plain CSS, no        */
/* build-time Tailwind dependency                                     */
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
      @keyframes modalIn { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .anim-fade { animation: fadeIn 0.2s ease-out; }
      .anim-modal { animation: modalIn 0.25s ease-out; }
      input::placeholder { color: rgba(250,246,237,0.35); }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                              */
/* ------------------------------------------------------------------ */
function TextField({ label, value, onChange, placeholder, type = 'text', icon: Icon, inputMode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'rgba(250,246,237,0.55)' }}>
        {label}
      </label>
      <div className="flex items-center rounded-xl px-3.5 py-3 gap-2.5" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.08)' }}>
        {Icon && <Icon size={17} style={{ color: COLORS.accent, flexShrink: 0 }} />}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none flex-1 text-sm w-full"
          style={{ color: COLORS.cream }}
        />
      </div>
    </div>
  );
}

function PillSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'rgba(250,246,237,0.55)' }}>
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? COLORS.accent : COLORS.card,
                color: active ? '#121212' : COLORS.cream,
                border: `1px solid ${active ? COLORS.accent : 'rgba(250,246,237,0.12)'}`,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CustomCheckbox({ checked, onChange, children }) {
  return (
    <div className="flex items-start gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-md transition-colors"
        style={{
          width: 22,
          height: 22,
          marginTop: 1,
          backgroundColor: checked ? COLORS.accent : 'transparent',
          border: `2px solid ${checked ? COLORS.accent : 'rgba(250,246,237,0.3)'}`,
        }}
      >
        {checked && <Check size={14} strokeWidth={3} style={{ color: '#121212' }} />}
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(250,246,237,0.75)' }}>{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tela 1 — Cadastro Inicial                                          */
/* ------------------------------------------------------------------ */
function CadastroScreen({ form, updateField, onSubmit, isValid, onWhatsappChange, onIdadeChange, onCepChange }) {
  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 pt-12 pb-7 flex flex-col items-center text-center" style={{ backgroundColor: COLORS.bgAlt, borderBottom: '1px solid rgba(250,246,237,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Sunrise size={24} style={{ color: COLORS.accent }} />
          <span className="text-2xl font-extrabold" style={{ color: COLORS.accent, fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}>
            Céu na Terra
          </span>
        </div>
        <div className="h-1 w-16 rounded-full mb-4" style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.bgAlt}, ${COLORS.accent})` }} />
        <p className="text-sm max-w-xs leading-relaxed" style={{ color: COLORS.cream }}>
          Que alegria ter você aqui! Vamos te conhecer melhor para começar sua jornada de fé.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex-1 px-6 py-7 space-y-7">
        <div className="space-y-4">
          <p className="text-xs font-bold tracking-widest" style={{ color: COLORS.accent }}>SEUS DADOS</p>
          <TextField label="Nome completo" value={form.nome} onChange={(v) => updateField('nome', v)} placeholder="Digite seu nome completo" icon={User} />
          <TextField label="WhatsApp" value={form.whatsapp} onChange={onWhatsappChange} placeholder="(61) 99999-9999" type="tel" icon={Phone} inputMode="numeric" />
          <TextField label="Idade" value={form.idade} onChange={onIdadeChange} placeholder="Ex: 28" type="text" inputMode="numeric" />
          <PillSelect label="Sexo" options={['Masculino', 'Feminino']} value={form.sexo} onChange={(v) => updateField('sexo', v)} />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold tracking-widest" style={{ color: COLORS.accent }}>ONDE VOCÊ MORA</p>
          <TextField label="Endereço residencial" value={form.endereco} onChange={(v) => updateField('endereco', v)} placeholder="Rua, número" icon={MapPin} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Bairro" value={form.bairro} onChange={(v) => updateField('bairro', v)} placeholder="Ex: Asa Sul" />
            <TextField label="CEP" value={form.cep} onChange={onCepChange} placeholder="70000-000" inputMode="numeric" />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(250,246,237,0.55)' }}>
            Usamos seu endereço de casa para indicar as igrejas mais próximas de onde você mora.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold tracking-widest" style={{ color: COLORS.accent }}>PRIVACIDADE</p>
          <CustomCheckbox checked={form.lgpd} onChange={(v) => updateField('lgpd', v)}>
            Li e aceito os Termos de Uso e a Política de Privacidade, em conformidade com a LGPD.
          </CustomCheckbox>
          <div className="flex items-center gap-4" style={{ paddingLeft: 34 }}>
            <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline underline-offset-2" style={{ color: COLORS.accent }}>
              Termos de Uso
            </a>
            <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline underline-offset-2" style={{ color: COLORS.accent }}>
              Política de Privacidade
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-xl py-4 font-bold text-sm transition-opacity"
          style={{
            backgroundColor: COLORS.accent,
            color: '#121212',
            opacity: isValid ? 1 : 0.4,
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Concluir e Ver Conteúdos
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tela 2 — Feed principal                                            */
/* ------------------------------------------------------------------ */
function TopBar({ firstName }) {
  return (
    <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: COLORS.bgAlt, borderBottom: '1px solid rgba(250,246,237,0.06)' }}>
      <div>
        <p className="text-xs" style={{ color: 'rgba(250,246,237,0.5)' }}>Bem-vindo(a) de volta</p>
        <p className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Olá, {firstName} 👋</p>
      </div>
      <div className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.accent}` }}>
        <Sunrise size={17} style={{ color: COLORS.accent }} />
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  return (
    <div className="flex" style={{ backgroundColor: COLORS.bgAlt, borderTop: '1px solid rgba(250,246,237,0.08)' }}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex-1 flex flex-col items-center gap-1 py-3"
          >
            <div className="h-0.5 w-5 rounded-full mb-0.5" style={{ backgroundColor: isActive ? COLORS.accent : 'transparent' }} />
            <Icon size={21} style={{ color: isActive ? COLORS.accent : 'rgba(250,246,237,0.45)' }} />
            <span className="text-xs font-medium" style={{ color: isActive ? COLORS.accent : 'rgba(250,246,237,0.45)' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---- Aba 1: Igrejas Próximas -------------------------------------- */
function ChurchCard({ church, onWhatsApp }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.name}, ${church.endereco}`)}`;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Abrir ${church.name} no Google Maps`}
        className="relative h-28 flex items-center justify-center cursor-pointer"
        style={{
          backgroundColor: '#15171C',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(250,246,237,0.05) 0px, rgba(250,246,237,0.05) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(90deg, rgba(250,246,237,0.05) 0px, rgba(250,246,237,0.05) 1px, transparent 1px, transparent 22px)',
        }}
      >
        <MapPin size={30} strokeWidth={2} style={{ color: '#EF4444', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }} />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: COLORS.accent, color: '#121212' }}>
          {church.distance}
        </span>
      </a>
      <div className="p-4">
        <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{church.name}</h3>
        <div className="flex items-center gap-1.5 mt-1 mb-3">
          <User size={13} style={{ color: 'rgba(250,246,237,0.5)' }} />
          <span className="text-xs" style={{ color: 'rgba(250,246,237,0.55)' }}>{church.pastor}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: COLORS.accent, color: '#121212' }}>{church.denom}</span>
          {church.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs" style={{ border: '1px solid rgba(229,184,76,0.4)', color: COLORS.accent }}>{tag}</span>
          ))}
        </div>
        <button
          onClick={() => onWhatsApp(church)}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm transition-transform active:scale-95"
          style={{ backgroundColor: COLORS.whatsapp, color: '#0b2b16' }}
        >
          <MessageCircle size={17} />
          Quero Conhecer (WhatsApp)
        </button>
      </div>
    </div>
  );
}

function IgrejasTab({ bairro, onWhatsApp }) {
  return (
    <div className="px-4 py-5 space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>
          Igrejas perto {bairro ? `de ${bairro}` : 'de você'}
        </h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(250,246,237,0.5)' }}>Encontramos comunidades para você conhecer</p>
      </div>
      {CHURCHES.map((c) => <ChurchCard key={c.id} church={c} onWhatsApp={onWhatsApp} />)}
    </div>
  );
}

function WhatsAppModal({ church, onClose }) {
  const message = `Olá! Vim através do app Conecta Céu na Terra e gostaria de conhecer a ${church.name}. 🙏`;
  const waUrl = `https://wa.me/5561999999999?text=${encodeURIComponent(message)}`;
  return (
    <div className="fixed inset-0 flex items-center justify-center px-6 z-50 anim-fade" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-6 anim-modal" style={{ backgroundColor: COLORS.card }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center rounded-full mx-auto mb-4" style={{ width: 52, height: 52, backgroundColor: 'rgba(37,211,102,0.15)' }}>
          <MessageCircle size={24} style={{ color: COLORS.whatsapp }} />
        </div>
        <h3 className="text-center text-base font-bold mb-2" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Falar com {church.name}</h3>
        <p className="text-center text-xs mb-4" style={{ color: 'rgba(250,246,237,0.6)' }}>Você será direcionado ao WhatsApp com esta mensagem:</p>
        <div className="rounded-xl p-3 mb-5 italic text-sm" style={{ backgroundColor: COLORS.cardAlt, color: COLORS.cream, border: '1px solid rgba(250,246,237,0.06)' }}>
          "{message}"
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm mb-2"
          style={{ backgroundColor: COLORS.whatsapp, color: '#0b2b16' }}
        >
          Abrir WhatsApp
        </a>
        <button onClick={onClose} className="w-full py-2.5 text-sm font-medium" style={{ color: 'rgba(250,246,237,0.6)' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

/* ---- Aba 2: Vídeos (estilo Reels) ---------------------------------- */
function VideoSlide({ video }) {
  return (
    <div
      className="h-full w-full snap-start relative flex flex-col justify-end flex-shrink-0"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, rgba(229,184,76,0.38), transparent 62%), linear-gradient(180deg, #121212 0%, #16161a 55%, #1E1E1E 100%)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full flex items-center justify-center" style={{ width: 72, height: 72, backgroundColor: 'rgba(250,246,237,0.1)', border: '1.5px solid rgba(250,246,237,0.3)' }}>
          <Play size={28} style={{ color: COLORS.cream, marginLeft: 3 }} fill={COLORS.cream} />
        </div>
      </div>

      <div className="px-5 pb-8 relative">
        <span className="text-xs font-bold tracking-widest" style={{ color: COLORS.accent }}>{video.eyebrow}</span>
        <h3 className="text-xl font-bold mt-1" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{video.title}</h3>
        <p className="text-sm mt-1.5" style={{ color: 'rgba(250,246,237,0.7)' }}>{video.caption}</p>
      </div>
    </div>
  );
}

function VideosTab() {
  return (
    <div className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {VIDEOS.map((v) => (
        <VideoSlide key={v.id} video={v} />
      ))}
    </div>
  );
}

/* ---- Aba 3: Bíblias e Materiais ------------------------------------ */
function MaterialCard({ item, onBuy }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="h-40 flex flex-col items-center justify-center px-3 text-center" style={{ backgroundColor: COLORS.cardAlt, borderTop: `3px solid ${COLORS.accent}` }}>
        <span className="text-sm font-bold leading-snug" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{item.title}</span>
        <div className="h-px w-8 my-2" style={{ backgroundColor: COLORS.accent }} />
        <span className="text-xs uppercase tracking-wide" style={{ color: 'rgba(250,246,237,0.45)' }}>{item.publisher}</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold mb-2" style={{ color: COLORS.accent }}>{item.price}</p>
        <div className="space-y-1.5">
          <button onClick={() => onBuy('Amazon')} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold" style={{ backgroundColor: COLORS.accent, color: '#121212' }}>
            <ExternalLink size={12} /> Ver na Amazon
          </button>
          <button onClick={() => onBuy('Editora Plenitude')} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold" style={{ border: '1px solid rgba(229,184,76,0.4)', color: COLORS.accent }}>
            <ExternalLink size={12} /> Ver na Editora Plenitude
          </button>
        </div>
      </div>
    </div>
  );
}

function MateriaisTab({ onBuy }) {
  return (
    <div className="px-4 py-5">
      <h2 className="text-lg font-bold mb-1" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Bíblias e Materiais</h2>
      <p className="text-xs mb-4" style={{ color: 'rgba(250,246,237,0.5)' }}>Recomendados para o início da sua caminhada</p>
      <div className="grid grid-cols-2 gap-3">
        {MATERIALS.map((item) => <MaterialCard key={item.id} item={item} onBuy={onBuy} />)}
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="absolute left-0 right-0 flex justify-center anim-fade" style={{ bottom: 88 }}>
      <div className="px-4 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: COLORS.cardAlt, color: COLORS.cream, border: '1px solid rgba(229,184,76,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
        {message}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App principal                                                      */
/* ------------------------------------------------------------------ */
export default function App() {
  const [screen, setScreen] = useState('cadastro');
  const [form, setForm] = useState({ nome: '', whatsapp: '', idade: '', sexo: '', endereco: '', bairro: '', cep: '', lgpd: false });
  const [activeTab, setActiveTab] = useState('igrejas');
  const [modalChurch, setModalChurch] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Sanitização: WhatsApp aceita estritamente dígitos
  const handleWhatsappChange = (value) => {
    let valor = value.replace(/\D/g, ''); // remove tudo que não é número
    valor = valor.slice(0, 11); // limita a 11 dígitos (DDD + 9 dígitos)
    if (valor.length > 10) {
      // celular: (XX) XXXXX-XXXX
      valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
      // fixo: (XX) XXXX-XXXX
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, '($1');
    }
    updateField('whatsapp', valor);
  };

  // Sanitização: Idade aceita apenas dígitos (remove "-", "e", "." etc.), limitada a 3 dígitos
  const handleIdadeChange = (value) => {
    updateField('idade', value.replace(/\D/g, '').slice(0, 3));
  };

  // Sanitização: CEP aceita apenas dígitos, limitado a 8 caracteres.
  // Ao atingir 8 dígitos, consulta o ViaCEP e autopreenche endereco/bairro.
  const handleCepChange = async (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    updateField('cep', digitsOnly);

    if (digitsOnly.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${digitsOnly}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setForm((prev) => ({
            ...prev,
            endereco: data.logradouro || prev.endereco,
            bairro: data.bairro || prev.bairro,
          }));
        }
      } catch (err) {
        console.error('Erro ao consultar ViaCEP:', err);
      }
    }
  };

  const isValid = !!(form.nome.trim() && form.whatsapp.trim() && form.idade && form.sexo && form.endereco.trim() && form.bairro.trim() && form.cep.trim() && form.lgpd);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) setScreen('feed');
  };

  const showToast = (label) => {
    setToast(`Abrindo ${label}...`);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2000);
  };

  const firstName = (form.nome || '').trim().split(' ')[0] || 'Amigo(a)';

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ backgroundColor: '#0a0a0a', fontFamily: FONT_BODY }}>
      <div className="w-full max-w-md flex flex-col relative min-h-screen sm:border-x" style={{ backgroundColor: COLORS.bg, borderColor: 'rgba(250,246,237,0.08)' }}>
        <GlobalStyles />

        {screen === 'cadastro' ? (
          <CadastroScreen
            form={form}
            updateField={updateField}
            onSubmit={handleSubmit}
            isValid={isValid}
            onWhatsappChange={handleWhatsappChange}
            onIdadeChange={handleIdadeChange}
            onCepChange={handleCepChange}
          />
        ) : (
          <>
            <TopBar firstName={firstName} />
            <main className="flex-1 min-h-0 overflow-y-auto" style={{ backgroundColor: COLORS.bg }}>
              {activeTab === 'igrejas' && <IgrejasTab bairro={form.bairro} onWhatsApp={setModalChurch} />}
              {activeTab === 'videos' && <VideosTab />}
              {activeTab === 'materiais' && <MateriaisTab onBuy={showToast} />}
            </main>
            <BottomNav active={activeTab} onChange={setActiveTab} />
            {modalChurch && <WhatsAppModal church={modalChurch} onClose={() => setModalChurch(null)} />}
            {toast && <Toast message={toast} />}
          </>
        )}
      </div>
    </div>
  );
}