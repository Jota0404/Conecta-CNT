import { useState, useEffect, useRef } from 'react';
import {
  Sunrise, MapPin, Calendar, Megaphone, Users, Send, MessageCircle,
  BadgeCheck, TrendingUp, ChevronDown, Download, FileSpreadsheet,
  Plus, ArrowLeft, X
} from 'lucide-react';
import {
  ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

/* ------------------------------------------------------------------ */
/* Design tokens                                                      */
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
  '📊 Visão Geral', '⛪ Igrejas Parceiras', '👥 Lista de Convertidos', '⚙️ Configurações',
];

const DATA_BY_PERIOD = {
  'Últimos 7 dias': { impactados: 312, encaminhados: 290, contatados: 198, membros: 94, taxa: '47.5' },
  'Mensal': { impactados: 1240, encaminhados: 1180, contatados: 842, membros: 415, taxa: '49.2' },
  'Anual': { impactados: 14260, encaminhados: 13580, contatados: 9640, membros: 4870, taxa: '50.5' },
};

const REGIOES = ['Todas as Regiões', 'Brasília', 'Taguatinga', 'Samambaia'];
const ACOES = ['Todas as Ações', 'Blitz Evangelística', 'Culto ao Ar Livre'];

// Dados hierárquicos (Cidade -> Bairros/Zonas) para o gráfico de barras com drill-down
const GEO_HIERARCHY = {
  'Brasília': [
    { zona: 'Plano Piloto', encaminhados: 145 },
    { zona: 'Sudoeste', encaminhados: 62 },
  ],
  'Taguatinga': [
    { zona: 'Taguatinga Sul', encaminhados: 98 },
    { zona: 'Taguatinga N.', encaminhados: 89 },
  ],
  'Samambaia': [
    { zona: 'Samambaia Sul', encaminhados: 74 },
    { zona: 'Samambaia N.', encaminhados: 45 },
  ],
};

// Igrejas parceiras cadastradas na rede (aba "Igrejas Parceiras")
const PARTNER_CHURCHES_INITIAL = [
  { id: 1, nome: 'Comunidade Vida Nova', dataCadastro: '12/01/2025', pastor: 'Pr. João Pereira' },
  { id: 2, nome: 'Igreja Batista Renovada', dataCadastro: '03/03/2025', pastor: 'Pra. Marta Alves' },
  { id: 3, nome: 'Assembleia de Deus Belém', dataCadastro: '22/04/2025', pastor: 'Pr. Carlos Souza' },
  { id: 4, nome: 'Igreja Presbiteriana Esperança', dataCadastro: '15/06/2025', pastor: 'Pr. Rafael Lima' },
  { id: 5, nome: 'Comunidade Cristã Restauração', dataCadastro: '02/08/2025', pastor: 'Pra. Ana Costa' },
];

const CHURCH_TABLE_ROWS = [
  { id: 1, igreja: 'Comunidade Vida Nova', local: 'Brasília / Asa Sul', encaminhados: 45, contactados: 38, membros: 22 },
  { id: 2, igreja: 'Igreja Batista Renovada', local: 'Taguatinga / Sul', encaminhados: 32, contactados: 25, membros: 18 },
  { id: 3, igreja: 'Assembleia de Deus Belém', local: 'Samambaia / Norte', encaminhados: 28, contactados: 20, membros: 12 },
  { id: 4, igreja: 'Igreja Presbiteriana Esperança', local: 'Brasília / Sudoeste', encaminhados: 19, contactados: 19, membros: 15 },
  { id: 5, igreja: 'Comunidade Cristã Restauração', local: 'Samambaia / Sul', encaminhados: 22, contactados: 14, membros: 8 },
];

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
      html, body, #root {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        height: 100%;
        background-color: ${COLORS.bg};
        overflow: hidden;
      }
      *, *::before, *::after { box-sizing: border-box; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      .anim-fade { animation: fadeIn 0.15s ease-out; }
      table { border-collapse: collapse; }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/* Layout Base Components                                             */
/* ------------------------------------------------------------------ */
function Sidebar({ active, onNavigate }) {
  return (
    <aside className="w-64 flex-shrink-0 h-full flex flex-col" style={{ backgroundColor: COLORS.bgAlt, borderRight: '1px solid rgba(229,184,76,0.12)' }}>
      <div className="px-6 py-7 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(229,184,76,0.1)' }}>
        <Sunrise size={22} style={{ color: COLORS.accent }} />
        <span className="text-lg font-extrabold" style={{ color: COLORS.accent, fontFamily: FONT_DISPLAY }}>Céu na Terra</span>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item} onClick={() => onNavigate(item)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left transition-colors"
            style={{ backgroundColor: active === item ? 'rgba(229,184,76,0.1)' : 'transparent', color: active === item ? COLORS.accent : 'rgba(250,246,237,0.7)', borderLeft: active === item ? `3px solid ${COLORS.accent}` : '3px solid transparent' }}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(229,184,76,0.1)' }}>
        <p className="text-xs" style={{ color: 'rgba(250,246,237,0.35)' }}>Conecta Céu na Terra © 2026</p>
      </div>
    </aside>
  );
}

function Dropdown({ icon: Icon, options, value, onChange, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors" style={{ backgroundColor: COLORS.card, color: COLORS.cream, border: `1px solid ${isOpen ? COLORS.accent : 'rgba(250,246,237,0.12)'}` }}>
        {Icon && <Icon size={14} style={{ color: COLORS.accent }} />}
        <span className="whitespace-nowrap">{value}</span>
        <ChevronDown size={14} style={{ color: 'rgba(250,246,237,0.5)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-20 anim-fade" style={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(250,246,237,0.1)', minWidth: '100%', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
          {options.map((opt) => (
            <button key={opt} onClick={() => onChange(opt)} className="block w-full text-left px-4 py-2.5 text-sm whitespace-nowrap" style={{ color: opt === value ? COLORS.accent : COLORS.cream, backgroundColor: opt === value ? 'rgba(229,184,76,0.08)' : 'transparent', fontWeight: opt === value ? 600 : 400 }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Topbar({ periodo, setPeriodo, regiao, setRegiao, acao, setAcao, openDropdown, setOpenDropdown, filterBarRef }) {
  return (
    <div className="flex-shrink-0 px-6 py-5 flex items-center justify-between flex-wrap gap-4" style={{ backgroundColor: COLORS.bgAlt, borderBottom: '1px solid rgba(229,184,76,0.1)' }}>
      <h1 className="text-xl font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Painel de Controle Evangelístico</h1>
      <div ref={filterBarRef} className="flex items-center gap-3 flex-wrap">
        <Dropdown icon={Calendar} options={['Últimos 7 dias', 'Mensal', 'Anual']} value={periodo} onChange={(v) => { setPeriodo(v); setOpenDropdown(null); }} isOpen={openDropdown === 'periodo'} onToggle={() => setOpenDropdown((p) => p === 'periodo' ? null : 'periodo')} />
        <Dropdown icon={MapPin} options={REGIOES} value={regiao} onChange={(v) => { setRegiao(v); setOpenDropdown(null); }} isOpen={openDropdown === 'regiao'} onToggle={() => setOpenDropdown((p) => p === 'regiao' ? null : 'regiao')} />
        <Dropdown icon={Megaphone} options={ACOES} value={acao} onChange={(v) => { setAcao(v); setOpenDropdown(null); }} isOpen={openDropdown === 'acao'} onToggle={() => setOpenDropdown((p) => p === 'acao' ? null : 'acao')} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Widgets de Visão Geral                                             */
/* ------------------------------------------------------------------ */
function KpiRow({ data }) {
  const kpis = [
    { label: 'Total de Cadastros', value: data.impactados, icon: Users },
    { label: 'Encaminhados', value: data.encaminhados, icon: Send },
    { label: 'Contatados', value: data.contatados, icon: MessageCircle },
    { label: 'Em Igreja Local / Membros', value: data.membros, icon: BadgeCheck },
    { label: 'Taxa de Consolidação', value: `${data.taxa}%`, icon: TrendingUp, isRate: true },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(229,184,76,0.25)' }}>
          <div className="flex items-center justify-center rounded-lg mb-3" style={{ width: 34, height: 34, backgroundColor: 'rgba(229,184,76,0.12)' }}>
            <k.icon size={17} style={{ color: COLORS.accent }} />
          </div>
          <p className="text-2xl font-extrabold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{k.isRate ? k.value : k.value.toLocaleString('pt-BR')}</p>
          <p className="text-xs mt-1 leading-tight" style={{ color: 'rgba(250,246,237,0.55)' }}>{k.label}</p>
        </div>
      ))}
    </div>
  );
}

function FunnelPanel({ data }) {
  const funnelData = [
    { name: 'Impactados', value: data.impactados, fill: '#D9A02A' },
    { name: 'Encaminhados', value: data.encaminhados, fill: '#E5B84C' },
    { name: 'Contatados', value: data.contatados, fill: '#EDC97A' },
    { name: 'Em Igreja Local', value: data.membros, fill: '#FAF6ED' },
  ];
  const rate = (a, b) => ((b / a) * 100).toFixed(1);
  const steps = [
    { label: 'Cadastros → Encaminhados', value: rate(data.impactados, data.encaminhados) },
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
      <div style={{ height: 280, overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart margin={{ top: 12, right: 130, bottom: 12, left: 12 }}>
            <Tooltip
              contentStyle={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(229,184,76,0.3)', borderRadius: 8, padding: '8px 12px' }}
              labelStyle={{ color: COLORS.cream, marginBottom: 4 }}
              itemStyle={{ color: COLORS.cream }}
              formatter={(value) => value.toLocaleString('pt-BR')}
            />
            <Funnel dataKey="value" data={funnelData} isAnimationActive={false}>
              {funnelData.map((entry) => <Cell key={entry.name} fill={entry.fill} stroke={COLORS.card} strokeWidth={2} />)}
              <LabelList dataKey="name" position="right" offset={12} style={{ fill: COLORS.cream, fontSize: 12, fontWeight: 600 }} />
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

function GeographicBarChartPanel({ selectedRegion }) {
  const [drilledCity, setDrilledCity] = useState(null);

  // Se o filtro externo de região mudar, reinicia o drill-down local
  useEffect(() => { setDrilledCity(null); }, [selectedRegion]);

  const isRegionLocked = !!selectedRegion && selectedRegion !== 'Todas as Regiões';
  const activeCity = isRegionLocked ? selectedRegion : drilledCity;
  const isDrillable = !isRegionLocked; // só permite clicar para detalhar quando não há filtro externo fixo

  // Nível 1: totais por cidade (soma das zonas)
  const cityTotals = Object.entries(GEO_HIERARCHY).map(([cidade, zonas]) => ({
    cidade,
    encaminhados: zonas.reduce((sum, z) => sum + z.encaminhados, 0),
  }));

  // Nível 2: bairros/zonas da cidade ativa
  const chartData = activeCity ? (GEO_HIERARCHY[activeCity] || []) : cityTotals;
  const labelKey = activeCity ? 'zona' : 'cidade';

  const handleBarClick = (data) => {
    if (!isDrillable || activeCity) return;
    setDrilledCity(data.cidade);
  };

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Distribuição por Zonas</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(250,246,237,0.5)' }}>
            {activeCity ? `Bairros de ${activeCity}` : isDrillable ? 'Por cidade — clique numa barra para detalhar os bairros' : 'Volume de convertidos encaminhados'}
          </p>
        </div>
        {activeCity && isDrillable ? (
          <button
            onClick={() => setDrilledCity(null)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: COLORS.cardAlt, color: COLORS.accent, border: '1px solid rgba(229,184,76,0.25)' }}
          >
            <ArrowLeft size={13} /> Cidades
          </button>
        ) : (
          <MapPin size={18} style={{ color: COLORS.accent }} />
        )}
      </div>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 40, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(250,246,237,0.05)" />
            <XAxis type="number" stroke="rgba(250,246,237,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey={labelKey} type="category" stroke="rgba(250,246,237,0.7)" fontSize={12} tickLine={false} axisLine={false} width={90} />
            <Tooltip
              cursor={{ fill: 'rgba(229,184,76,0.05)' }}
              contentStyle={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(229,184,76,0.3)', borderRadius: 8, color: COLORS.cream }}
              formatter={(value) => [value.toLocaleString('pt-BR'), 'Encaminhados']}
            />
            <Bar
              dataKey="encaminhados"
              fill={COLORS.accent}
              radius={[0, 4, 4, 0]}
              barSize={24}
              onClick={handleBarClick}
              cursor={!activeCity && isDrillable ? 'pointer' : 'default'}
            >
              <LabelList dataKey="encaminhados" position="right" fill={COLORS.cream} fontSize={12} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChurchMonitoringTable({ rows, selectedRegion }) {
  const visibleRows = !selectedRegion || selectedRegion === 'Todas as Regiões'
    ? rows : rows.filter((r) => r.local.includes(selectedRegion));

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(250,246,237,0.06)' }}>
        <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Monitoramento de Igrejas Parceiras</h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(250,246,237,0.5)' }}>Acompanhamento de conversão por congregação</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: COLORS.bgAlt }}>
              {['Nome da Igreja', 'Cidade / Bairro', 'Encaminhados', 'Contactados', 'Tornados Membros'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold tracking-wide whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.5)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: 'rgba(250,246,237,0.4)' }}>Nenhuma igreja cadastrada nesta região.</td></tr>
            ) : (
              visibleRows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid rgba(250,246,237,0.05)' }}>
                  <td className="px-5 py-4 font-semibold whitespace-nowrap" style={{ color: COLORS.cream }}>{r.igreja}</td>
                  <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.65)' }}>{r.local}</td>
                  <td className="px-5 py-4 font-bold" style={{ color: '#E5B84C' }}>{r.encaminhados}</td>
                  <td className="px-5 py-4 font-bold" style={{ color: '#3B82F6' }}>{r.contactados}</td>
                  <td className="px-5 py-4 font-bold" style={{ color: '#10B981' }}>{r.membros}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aba de Exportação                                                  */
/* ------------------------------------------------------------------ */
function ExportListPanel() {
  const handleExportExcel = () => {
    // Implementação mockada usando XLSX (SheetJS) ou similar
    // ex: const ws = XLSX.utils.json_to_sheet(data); ... XLSX.writeFile(wb, "convertidos.xlsx");
    alert('Função acionada: Exportando .xlsx (Requer SheetJS / XLSX na pipeline de build)');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <FileSpreadsheet size={48} style={{ color: 'rgba(37,211,102,0.8)' }} className="mb-4" />
      <h3 className="text-xl font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Lista de Convertidos</h3>
      <p className="text-sm mt-2 max-w-md" style={{ color: 'rgba(250,246,237,0.55)' }}>
        Baixe o relatório completo de convertidos no formato Excel (.xlsx) para integrações ou análises aprofundadas.
      </p>
      <button 
        onClick={handleExportExcel}
        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-transform active:scale-95"
        style={{ backgroundColor: '#25D366', color: '#0b2b16', boxShadow: '0 8px 24px rgba(37,211,102,0.2)' }}
      >
        <Download size={18} /> Exportar Base Completa (.xlsx)
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aba "Igrejas Parceiras" — listagem + cadastro (CRUD parcial)       */
/* ------------------------------------------------------------------ */
function NewChurchModal({ onClose, onCreate }) {
  const [nome, setNome] = useState('');
  const [pastor, setPastor] = useState('');
  const isValid = !!(nome.trim() && pastor.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onCreate({ nome: nome.trim(), pastor: pastor.trim() });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-6 z-50 anim-fade" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.08)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Cadastrar nova igreja</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1" style={{ color: 'rgba(250,246,237,0.5)' }}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(250,246,237,0.55)' }}>Nome da igreja parceira</label>
            <input
              value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Igreja Batista Central" autoFocus
              className="w-full rounded-xl px-3.5 py-3 text-sm bg-transparent outline-none"
              style={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(250,246,237,0.1)', color: COLORS.cream }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(250,246,237,0.55)' }}>Nome do pastor</label>
            <input
              value={pastor} onChange={(e) => setPastor(e.target.value)} placeholder="Ex: Pr. Fulano de Tal"
              className="w-full rounded-xl px-3.5 py-3 text-sm bg-transparent outline-none"
              style={{ backgroundColor: COLORS.cardAlt, border: '1px solid rgba(250,246,237,0.1)', color: COLORS.cream }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ color: 'rgba(250,246,237,0.6)', border: '1px solid rgba(250,246,237,0.12)' }}>
            Cancelar
          </button>
          <button type="submit" disabled={!isValid} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity" style={{ backgroundColor: COLORS.accent, color: '#121212', opacity: isValid ? 1 : 0.4, cursor: isValid ? 'pointer' : 'not-allowed' }}>
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

function PartnerChurchesPanel() {
  const [churches, setChurches] = useState(PARTNER_CHURCHES_INITIAL);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = ({ nome, pastor }) => {
    const dataCadastro = new Date().toLocaleDateString('pt-BR');
    setChurches((prev) => [{ id: Date.now(), nome, dataCadastro, pastor }, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>Igrejas Parceiras</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(250,246,237,0.5)' }}>{churches.length} igrejas cadastradas na rede</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95"
          style={{ backgroundColor: COLORS.accent, color: '#121212' }}
        >
          <Plus size={16} /> Cadastrar nova igreja
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.bgAlt }}>
                {['Nome da Igreja Parceira', 'Data de Cadastro', 'Nome do Pastor'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold tracking-wide whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.5)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {churches.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-sm" style={{ color: 'rgba(250,246,237,0.4)' }}>Nenhuma igreja parceira cadastrada.</td></tr>
              ) : (
                churches.map((c) => (
                  <tr key={c.id} style={{ borderTop: '1px solid rgba(250,246,237,0.05)' }}>
                    <td className="px-5 py-4 font-semibold whitespace-nowrap" style={{ color: COLORS.cream }}>{c.nome}</td>
                    <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.65)' }}>{c.dataCadastro}</td>
                    <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'rgba(250,246,237,0.65)' }}>{c.pastor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <NewChurchModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}

function ComingSoon({ page }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl" style={{ backgroundColor: COLORS.card, border: '1px solid rgba(250,246,237,0.06)' }}>
      <Sunrise size={32} style={{ color: 'rgba(229,184,76,0.4)' }} />
      <h3 className="text-base font-bold mt-4" style={{ color: COLORS.cream, fontFamily: FONT_DISPLAY }}>{page}</h3>
      <p className="text-sm mt-1" style={{ color: 'rgba(250,246,237,0.45)' }}>Esta seção está em construção.</p>
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
  const filterBarRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const data = DATA_BY_PERIOD[periodo];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: COLORS.bg, fontFamily: FONT_BODY }}>
      <GlobalStyles />
      <Sidebar active={activePage} onNavigate={setActivePage} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Topbar
          periodo={periodo} setPeriodo={setPeriodo} regiao={regiao} setRegiao={setRegiao}
          acao={acao} setAcao={setAcao} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} filterBarRef={filterBarRef}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          {activePage === '📊 Visão Geral' && (
            <>
              <KpiRow data={data} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <FunnelPanel data={data} />
                <GeographicBarChartPanel selectedRegion={regiao} />
              </div>
              <ChurchMonitoringTable rows={CHURCH_TABLE_ROWS} selectedRegion={regiao} />
            </>
          )}
          {activePage === '⛪ Igrejas Parceiras' && <PartnerChurchesPanel />}
          {activePage === '👥 Lista de Convertidos' && <ExportListPanel />}
          {activePage !== '📊 Visão Geral' && activePage !== '⛪ Igrejas Parceiras' && activePage !== '👥 Lista de Convertidos' && <ComingSoon page={activePage} />}
        </main>
      </div>
    </div>
  );
}