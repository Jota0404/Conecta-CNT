import React, { useState, useEffect, useRef } from 'react';
import {
  Sunrise, MapPin, Calendar, Megaphone, Users, Send, MessageCircle,
  BadgeCheck, TrendingUp, ChevronDown, RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList, Tooltip,
} from 'recharts';

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
};
const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  '📊 Visão Geral', '📍 Mapa de Calor', '⛪ Igrejas Parceiras', '👥 Lista de Convertidos', '⚙️ Configurações',
];

const DATA_BY_PERIOD = {
  'Últimos 7 dias': { impactados: 312, encaminhados: 290, contatados: 198, membros: 94, taxa: '47.5' },
  'Mensal': { impactados: 1240, encaminhados: 1180, contatados: 842, membros: 415, taxa: '49.2' },
  'Anual': { impactados: 14260, encaminhados: 13580, contatados: 9640, membros: 4870, taxa: '50.5' },
};

const REGIOES = ['Todas as Regiões', 'Asa Sul', 'Águas Claras', 'Taguatinga', 'Sudoeste', 'Guará'];
const ACOES = ['Todas as Ações', 'Blitz Evangelística Centro', 'Culto ao Ar Livre - Parque da Cidade', 'Distribuição de Folhetos - Conic'];

const STATUS_CYCLE = ['Pendente', 'Contactado', 'Em Igreja Local'];
const TABLE_STATUS_CONFIG = {
  'Pendente': { color: '#E5B84C' },
  'Contactado': { color: '#3B82F6' },
  'Em Igreja Local': { color: '#10B981' },
};

const INITIAL_TABLE_ROWS = [
  { id: 1, nome: 'Mariana Costa', bairro: 'Asa Sul', endereco: 'SQS 308, Bloco C', igreja: 'Comunidade Vida Nova', status: 'Pendente' },
  { id: 2, nome: 'Pedro Henrique Alves', bairro: 'Águas Claras', endereco: 'Av. Araucárias, 450', igreja: 'Igreja Batista Renovada', status: 'Pendente' },
  { id: 3, nome: 'Juliana Ferreira', bairro: 'Taguatinga', endereco: 'QNL 12, Casa 5', igreja: 'Assembleia de Deus Belém', status: 'Contactado' },
  { id: 4, nome: 'Lucas Martins', bairro: 'Sudoeste', endereco: 'CLSW 104, Bloco A', igreja: 'Igreja Presbiteriana Esperança', status: 'Contactado' },
  { id: 5, nome: 'Camila Rodrigues', bairro: 'Guará', endereco: 'QE 24, Casa 12', igreja: 'Comunidade Cristã Restauração', status: 'Em Igreja Local' },
  { id: 6, nome: 'Rafael Souza', bairro: 'Taguatinga', endereco: 'QSD 8, Lote 3', igreja: 'Assembleia de Deus Belém', status: 'Em Igreja Local' },
  { id: 7, nome: 'Beatriz Lima', bairro: 'Asa Sul', endereco: 'SQS 210, Bloco B', igreja: 'Comunidade Vida Nova', status: 'Contactado' },
];

/* ------------------------------------------------------------------ */
/* Global styles (fonts)                                              */
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
      @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      .anim-fade { animation: fadeIn 0.15s ease-out; }
      table { border-collapse: collapse; }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */
function Sidebar({ active, onNavigate }) {
  return (
    <aside className="w-64 flex-shrink-0 h-screen flex flex-col" style={{ backgroundColor: COLORS.bgAlt, borderRight: '1px solid rgba(229,184,76,0.12)' }}>
      <div className="px-6 py-7 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(229,184,76,0.1)' }}>
        <Sunrise size={22} style={{ color: COLORS.accent }} />
        <span className="text-lg font-extrabold" style={{ color: COLORS.accent, fontFamily: FONT_DISPLAY }}>Céu na Terra</span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item;
          return (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left transition-colors"
              style={{
                backgroundColor: isActive ? 'rgba(229,184,76,0.1)' : 'transparent',
                color: isActive ? COLORS.accent : 'rgba(250,246,237,0.7)',
                borderLeft: isActive ? `3px solid ${COLORS.accent}` : '3px solid transparent',
              }}
            >
              {item}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(229,184,76,0.1)' }}>
        <p className="text-xs" style={{ color: 'rgba(250,246,237,0.35)' }}>Conecta Céu na Terra © 2026</p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Dropdown reutilizável                                              */
/* ------------------------------------------------------------------ */
function Dropdown({ icon: Icon, options, value, onChange, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors"
        style={{ backgroundColor: COLORS.card, color: COLORS.cream, border: `1px solid ${isOpen ? COLORS.accent : 'rgba(250,246,237,0.12)'}` }}
      >
        {Icon && <Icon size={14} style={{ color: COLORS.accent }} />}
        <span className="whitespace-nowrap">{value}</span>
        <ChevronDown size={14} style={{ color: 'rgba(250,246,237,0.5)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-20 anim-fade"
          style={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(250,246,237,0.1)', minWidth: '100%', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="block w-full text-left px-4 py-2.5 text-sm whitespace-nowrap"
              style={{
                color: opt === value ? COLORS.accent : COLORS.cream,
                backgroundColor: opt === value ? 'rgba(229,184,76,0.08)' : 'transparent',
                fontWeight: opt === value ? 600 : 400,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Topbar                                                             */
/* ------------------------------------------------------------------ */
function Topbar({ periodo, setPeriodo, regiao, setRegiao, acao, setAcao, openDropdown, setOpenDropdown, filterBarRef }) {
  return (
    <div className="flex-shrink-0 px-6 py-5 flex items-center justify-between flex-wrap gap-4" style={{ backgroundColor: COLORS.bgAlt, borderBottom: '1px solid rgba(229,184,76,0.1)' }}>
      <h1 className="text-xl font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Painel de Controle Evangelístico</h1>
      <div ref={filterBarRef} className="flex items-center gap-3 flex-wrap">
        <Dropdown
          icon={Calendar}
          options={['Últimos 7 dias', 'Mensal', 'Anual']}
          value={periodo}
          onChange={(v) => { setPeriodo(v); setOpenDropdown(null); }}
          isOpen={openDropdown === 'periodo'}
          onToggle={() => setOpenDropdown((prev) => (prev === 'periodo' ? null : 'periodo'))}
        />
        <Dropdown
          icon={MapPin}
          options={REGIOES}
          value={regiao}
          onChange={(v) => { setRegiao(v); setOpenDropdown(null); }}
          isOpen={openDropdown === 'regiao'}
          onToggle={() => setOpenDropdown((prev) => (prev === 'regiao' ? null : 'regiao'))}
        />
        <Dropdown
          icon={Megaphone}
          options={ACOES}
          value={acao}
          onChange={(v) => { setAcao(v); setOpenDropdown(null); }}
          isOpen={openDropdown === 'acao'}
          onToggle={() => setOpenDropdown((prev) => (prev === 'acao' ? null : 'acao'))}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* KPI cards                                                          */
/* ------------------------------------------------------------------ */
function KpiRow({ data }) {
  const kpis = [
    { label: 'Impactados na Rua', value: data.impactados, icon: Users },
    { label: 'Encaminhados', value: data.encaminhados, icon: Send },
    { label: 'Contatados', value: data.contatados, icon: MessageCircle },
    { label: 'Em Igreja Local / Membros', value: data.membros, icon: BadgeCheck },
    { label: 'Taxa de Consolidação', value: `${data.taxa}%`, icon: TrendingUp, isRate: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(229,184,76,0.25)' }}>
            <div className="flex items-center justify-center rounded-lg mb-3" style={{ width: 34, height: 34, backgroundColor: 'rgba(229,184,76,0.12)' }}>
              <Icon size={17} style={{ color: COLORS.accent }} />
            </div>
            <p className="text-2xl font-extrabold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>
              {k.isRate ? k.value : k.value.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs mt-1 leading-tight" style={{ color: 'rgba(250,246,237,0.55)' }}>{k.label}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Funil de Conversão (recharts)                                      */
/* ------------------------------------------------------------------ */
function FunnelPanel({ data }) {
  const funnelData = [
    { name: 'Impactados', value: data.impactados, fill: '#D9A02A' },
    { name: 'Encaminhados', value: data.encaminhados, fill: '#E5B84C' },
    { name: 'Contatados', value: data.contatados, fill: '#EDC97A' },
    { name: 'Em Igreja Local', value: data.membros, fill: '#FAF6ED' },
  ];

  const rate = (a, b) => ((b / a) * 100).toFixed(1);
  const steps = [
    { label: 'Impactados → Encaminhados', value: rate(data.impactados, data.encaminhados) },
    { label: 'Encaminhados → Contatados', value: rate(data.encaminhados, data.contatados) },
    { label: 'Contatados → Em Igreja Local', value: rate(data.contatados, data.membros) },
  ];

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Funil de Conversão</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(250,246,237,0.5)' }}>Da rua até a igreja local</p>
        </div>
        <TrendingUp size={18} style={{ color: COLORS.accent }} />
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              contentStyle={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(229,184,76,0.3)', borderRadius: 8 }}
              labelStyle={{ color: COLORS.cream }}
              itemStyle={{ color: COLORS.cream }}
              formatter={(value) => value.toLocaleString('pt-BR')}
            />
            <Funnel dataKey="value" data={funnelData}>
              {funnelData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              <LabelList dataKey="name" position="right" style={{ fill: COLORS.cream, fontSize: 12, fontWeight: 600 }} />
              <LabelList dataKey="value" position="center" style={{ fill: '#121212', fontSize: 13, fontWeight: 700 }} formatter={(v) => v.toLocaleString('pt-BR')} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {steps.map((s) => (
          <div key={s.label} className="rounded-lg px-2 py-2 text-center" style={{ backgroundColor: COLORS.cardAlt }}>
            <p className="text-sm font-bold" style={{ color: COLORS.accent, fontFamily: FONT_DISPLAY }}>{s.value}%</p>
            <p className="text-xs mt-0.5 leading-tight" style={{ color: 'rgba(250,246,237,0.5)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mapa de Calor (simulado em SVG)                                    */
/* ------------------------------------------------------------------ */
function HeatmapPanel({ selectedRegion }) {
  const points = [
    { name: 'Taguatinga', count: 187, cx: 95, cy: 205, r: 34 },
    { name: 'Águas Claras', count: 98, cx: 165, cy: 125, r: 24 },
    { name: 'Asa Sul', count: 145, cx: 245, cy: 85, r: 29 },
    { name: 'Sudoeste', count: 62, cx: 200, cy: 195, r: 18 },
    { name: 'Guará', count: 74, cx: 290, cy: 215, r: 20 },
  ];
  const isFiltering = selectedRegion && selectedRegion !== 'Todas as Regiões';

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Mapa de Calor Geográfico</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(250,246,237,0.5)' }}>Densidade de residência dos convertidos</p>
        </div>
        <MapPin size={18} style={{ color: COLORS.accent }} />
      </div>

      <div className="rounded-xl overflow-hidden relative" style={{ backgroundColor: '#0d0d0d', height: 260 }}>
        <svg viewBox="0 0 360 260" className="w-full h-full">
          <defs>
            <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E5B84C" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#E5B84C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#E5B84C" stopOpacity="0" />
            </radialGradient>
            <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(250,246,237,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="360" height="260" fill="url(#gridPattern)" />
          {points.map((p) => {
            const dim = isFiltering && p.name !== selectedRegion;
            return (
              <g key={p.name} style={{ opacity: dim ? 0.2 : 1 }}>
                <circle cx={p.cx} cy={p.cy} r={p.r * 1.8} fill="url(#heatGlow)" />
                <circle cx={p.cx} cy={p.cy} r={Math.max(5, p.r * 0.28)} fill="#E5B84C" stroke="#121212" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        {points.map((p) => {
          const dim = isFiltering && p.name !== selectedRegion;
          return (
            <div
              key={p.name}
              className="absolute flex flex-col items-center"
              style={{
                left: `${(p.cx / 360) * 100}%`,
                top: `${(p.cy / 260) * 100}%`,
                transform: 'translate(-50%, calc(-100% - 8px))',
                opacity: dim ? 0.2 : 1,
              }}
            >
              <div className="px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: 'rgba(24,24,27,0.9)', color: COLORS.cream, border: '1px solid rgba(229,184,76,0.3)' }}>
                {p.name} · {p.count}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs" style={{ color: 'rgba(250,246,237,0.5)' }}>Baixa densidade</span>
        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundImage: 'linear-gradient(90deg, rgba(229,184,76,0.15), #E5B84C)' }} />
        <span className="text-xs" style={{ color: 'rgba(250,246,237,0.5)' }}>Alta densidade</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabela de Monitoramento                                            */
/* ------------------------------------------------------------------ */
function MonitoringTable({ rows, onCycleStatus, selectedRegion }) {
  const visibleRows = !selectedRegion || selectedRegion === 'Todas as Regiões'
    ? rows
    : rows.filter((r) => r.bairro === selectedRegion);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(250,246,237,0.06)' }}>
        <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Monitoramento de Convertidos</h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(250,246,237,0.5)' }}>Acompanhamento individual por região</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: COLORS.bgAlt }}>
              {['Nome', 'Bairro/Endereço', 'Igreja Destino', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold tracking-wide whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.5)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: 'rgba(250,246,237,0.4)' }}>
                  Nenhum convertido cadastrado nesta região.
                </td>
              </tr>
            ) : (
              visibleRows.map((r) => {
                const cfg = TABLE_STATUS_CONFIG[r.status];
                const initials = r.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid rgba(250,246,237,0.05)' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ width: 32, height: 32, backgroundColor: COLORS.cardAlt, color: COLORS.accent, fontFamily: FONT_DISPLAY }}>
                          {initials}
                        </div>
                        <span className="font-semibold whitespace-nowrap" style={{ color: COLORS.cream }}>{r.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.65)' }}>{r.bairro}, {r.endereco}</td>
                    <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.65)' }}>{r.igreja}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ backgroundColor: `${cfg.color}26`, color: cfg.color, border: `1px solid ${cfg.color}55` }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => onCycleStatus(r.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                        style={{ border: '1px solid rgba(229,184,76,0.35)', color: COLORS.accent }}
                      >
                        <RefreshCw size={12} /> Mudar Status
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página placeholder para os demais itens do menu                    */
/* ------------------------------------------------------------------ */
function ComingSoon({ page }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <Sunrise size={32} style={{ color: 'rgba(229,184,76,0.4)' }} />
      <h3 className="text-base font-bold mt-4" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{page}</h3>
      <p className="text-sm mt-1" style={{ color: 'rgba(250,246,237,0.45)' }}>Esta seção está em construção. Em breve, novos dados por aqui.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App principal                                                      */
/* ------------------------------------------------------------------ */
export default function App() {
  const [activePage, setActivePage] = useState('📊 Visão Geral');
  const [periodo, setPeriodo] = useState('Mensal');
  const [regiao, setRegiao] = useState('Todas as Regiões');
  const [acao, setAcao] = useState('Todas as Ações');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [tableRows, setTableRows] = useState(INITIAL_TABLE_ROWS);
  const filterBarRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCycleStatus = (id) => {
    setTableRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const idx = STATUS_CYCLE.indexOf(r.status);
      return { ...r, status: STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] };
    }));
  };

  const data = DATA_BY_PERIOD[periodo];

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: COLORS.bg, fontFamily: FONT_BODY }}>
      <GlobalStyles />
      <Sidebar active={activePage} onNavigate={setActivePage} />

      <div className="flex-1 flex flex-col h-screen min-w-0">
        <Topbar
          periodo={periodo} setPeriodo={setPeriodo}
          regiao={regiao} setRegiao={setRegiao}
          acao={acao} setAcao={setAcao}
          openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
          filterBarRef={filterBarRef}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          {activePage === '📊 Visão Geral' ? (
            <>
              <KpiRow data={data} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <FunnelPanel data={data} />
                <HeatmapPanel selectedRegion={regiao} />
              </div>
              <MonitoringTable rows={tableRows} onCycleStatus={handleCycleStatus} selectedRegion={regiao} />
            </>
          ) : (
            <ComingSoon page={activePage} />
          )}
        </main>
      </div>
    </div>
  );
}