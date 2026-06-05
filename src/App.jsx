import { useState, useEffect, useRef } from 'react';
import logoSvg from './assets/logo.svg';
import './App.css';

/* ─── API ─── */
const API_BASE = '';

async function loadData() {
  try {
    const res = await fetch(`${API_BASE}/api/load`);
    if (!res.ok) throw new Error('Load failed');
    return await res.json();
  } catch (e) {
    console.error('API load error:', e);
    try {
      const local = localStorage.getItem('aguayo-backup');
      if (local) return JSON.parse(local);
    } catch (e2) {}
    return { goals: {}, sales: {} };
  }
}

async function saveData(goals, sales) {
  try {
    localStorage.setItem('aguayo-backup', JSON.stringify({ goals, sales }));
  } catch (e) {}
  try {
    await fetch(`${API_BASE}/api/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goals, sales }),
    });
  } catch (e) {
    console.error('API save error:', e);
  }
}

/* ─── CONSTANTS ─── */
const MONTHS_FULL = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];
const DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const QUARTERS = [
  { name: 'Q1', label: 'Ene – Mar', months: [0, 1, 2] },
  { name: 'Q2', label: 'Abr – Jun', months: [3, 4, 5] },
  { name: 'Q3', label: 'Jul – Sep', months: [6, 7, 8] },
  { name: 'Q4', label: 'Oct – Dic', months: [9, 10, 11] },
];
const WEEKS = 4;
const LINES = [
  { id: 'vida', label: 'Vida' },
  { id: 'gmm', label: 'GMM' },
  { id: 'autos', label: 'Autos' },
];
const LC = { vida: '#B83B2E', gmm: '#1B4F9E', autos: '#D4820A' };
const PEOPLE = [
  {
    id: 'claudio',
    name: 'Claudio Aguayo',
    short: 'Claudio',
    initials: 'CA',
    accent: '#1B4F9E',
  },
  {
    id: 'enrique',
    name: 'Enrique Aguayo',
    short: 'Enrique',
    initials: 'EA',
    accent: '#2471A3',
  },
  {
    id: 'diego',
    name: 'Diego Aguayo',
    short: 'Diego',
    initials: 'DA',
    accent: '#5DADE2',
  },
];

const MOTIVATIONAL = [
  'Hoy es un gran día para superar tus metas.',
  'El único límite eres tú mismo.',
  'La perseverancia convierte los sueños en resultados.',
  'Cada pequeño acto de disciplina fortalece tu carácter.',
  'Las metas grandes se alcanzan con hábitos pequeños y constantes.',
  'Cada día de esfuerzo fortalece tu mente y tu espíritu.',
  'La paciencia y la disciplina construyen resultados duraderos.',
  'La constancia diaria siempre supera la motivación momentánea.',
  'El crecimiento personal requiere esfuerzo diario y decisión.',
  'La perseverancia distingue a quienes sueñan de quienes avanzan.',
  'La verdadera transformación comienza en los hábitos diarios.',
  'Cada sacrificio hecho con propósito tiene valor.',
  'Tu futuro se construye con las decisiones que tomas cada día.',
  'La fuerza interior se construye superando pequeñas batallas cada día.',
  'No te rindas en el proceso de convertirte en una mejor persona.',
  'Quien aprende a ser constante puede llegar más lejos de lo que imagina.',
  'La disciplina pesa menos que el arrepentimiento.',
  'El carácter se demuestra más en las acciones que en las palabras.',
  'Las personas fuertes se forman a través de la constancia.',
  'Con fe y disciplina, incluso los objetivos más difíciles pueden alcanzarse.',
  'Con Dios, siempre existe un nuevo comienzo.',
  'La esperanza crece cuando recuerdas que Dios tiene el control.',
  'Dios sigue obrando, incluso en los días en que no lo puedes ver.',
  'La constancia transforma pequeños esfuerzos en grandes resultados',
  'Tu potencial es mucho mayor de lo que imaginas.',
  'La paciencia y la disciplina construyen resultados duraderos.',
  'Cada día es una nueva oportunidad para crecer.',
  'Siempre hay razones para mirar el futuro con esperanza.',
  'La incomodidad de crecer siempre será mejor que la tristeza de estancarte.',
  'A veces avanzar es simplemente no rendirte hoy.',
  'Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora.',
  'El corazón alegre hermosea el rostro.',
  'El que comenzó en ti la buena obra, la perfeccionará.',
  'El amor nunca deja de ser.',
  'Quien domina su mente, domina su vida.',
  'Mejor es adquirir sabiduría que oro preciado.',
  'Las personas exitosas son simplemente aquellas con hábitos exitosos.',
  'Muévete fuera de tu zona de confort. Solo puedes crecer si estás dispuesto a sentir incomodidad.',
  'Tus pensamientos crean tu realidad. Cambia tu manera de pensar y cambiarás tu vida.',
  'La claridad es esencial para el éxito.',
  'Cada minuto dedicado a planificar ahorra horas de trabajo.',
  'La confianza en uno mismo se construye preparándose.',
  'Practica la regla del esfuerzo extra en todo lo que hagas.',
  'La perseverancia es lo que hace posible lo imposible.',
  'Las personas exitosas piensan en soluciones.',
  'La acción es el verdadero indicador de la inteligencia.',
  'Tu vida mejora cuando tú mejoras.',
  'La gente extraordinaria tiene hábitos extraordinarios.',
  'El futuro pertenece a quienes se preparan hoy.',
  'Todo gran logro comienza con la decisión de intentarlo.',
  'La autodisciplina abre más puertas que el talento.',
  'La excelencia es una decisión, no un accidente.',
  'Las personas más felices son las que sienten que avanzan.',
  'El tiempo va a pasar de todas formas; úsalo para crecer.',
  'Haz primero lo más importante.',
  'Tu potencial se desarrolla cuando te exiges más.',
  'Cada día es una nueva oportunidad para convertirte en una mejor versión de ti mismo.',
  'La verdadera libertad llega cuando aprendes a controlarte a ti mismo.',
  'Haz del crecimiento personal una prioridad diaria.',
  'El éxito exterior comienza con la victoria interior.',
  'Tu futuro mejora en el momento en que decides mejorar tú.',
];

/* ─── HELPERS ─── */
const getQ = (m) => QUARTERS.find((q) => q.months.includes(m));
const fmt = (n) =>
  !n || n === 0
    ? '$0'
    : '$' + Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 0 });
const pctVal = (v, g) => (g > 0 ? ((v / g) * 100).toFixed(1) : '0.0');
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
function getDateStr() {
  const d = new Date();
  return `HOY ES ${DAYS[d.getDay()].toUpperCase()} ${d.getDate()} DE ${MONTHS_FULL[d.getMonth()].toUpperCase()}`;
}

/* ─── ICONS ─── */
function ChevronIcon({ up }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.3s',
        transform: up ? 'rotate(180deg)' : 'rotate(0)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function EditIconSvg() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}
function PenMini() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

/* ─── SMALL COMPONENTS ─── */
function PBar({ value, goal, color, h = 5 }) {
  const p = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const bg =
    value >= goal && goal > 0 ? 'var(--success)' : color || 'var(--blue)';
  return (
    <div className="pbar" style={{ height: h }}>
      <div
        className="pbar__fill"
        style={{ height: '100%', width: `${p}%`, background: bg }}
      />
    </div>
  );
}

function StatusText({ value, goal }) {
  if (!goal) return <span className="status status--empty">Sin meta</span>;
  const d = value - goal;
  return (
    <span
      className={`status ${d >= 0 ? 'status--positive' : 'status--negative'}`}
    >
      {d >= 0 ? `+${fmt(d)}` : `-${fmt(Math.abs(d))}`}
    </span>
  );
}

function LockableInput({ value, onCommit, placeholder, accentColor }) {
  const nv = Number(value) || 0;
  const isSaved = nv > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const ref = useRef(null);
  const startEdit = () => {
    setDraft(isSaved ? String(nv) : '');
    setIsEditing(true);
  };
  useEffect(() => {
    if (isEditing && ref.current) ref.current.focus();
  }, [isEditing]);
  const finishEdit = () => {
    const n = Number(draft) || 0;
    if (n > 0) onCommit(n);
    setIsEditing(false);
  };

  if (isSaved && !isEditing) {
    return (
      <div className="lock-display glass">
        <span className="lock-display__value">
          ${nv.toLocaleString('es-MX')}
        </span>
        <button className="lock-display__edit-btn" onClick={startEdit}>
          <PenMini />
        </button>
      </div>
    );
  }

  return (
    <div className="lock-input">
      <span className="lock-input__prefix">$</span>
      <input
        ref={ref}
        type="number"
        className="lock-input__field"
        value={isEditing ? draft : ''}
        onChange={(e) => {
          if (isEditing) setDraft(e.target.value);
          else {
            setDraft(e.target.value);
            setIsEditing(true);
          }
        }}
        onFocus={() => {
          if (!isEditing) {
            setDraft(isSaved ? String(nv) : '');
            setIsEditing(true);
          }
        }}
        onBlur={finishEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') finishEdit();
        }}
        placeholder={placeholder || '0'}
        style={{
          borderColor: isEditing ? accentColor || 'var(--blue)' : undefined,
        }}
      />
    </div>
  );
}

function buildWhatsAppReminder(list, msFn, mgFn, accFn, month, quarter) {
  const mn = MONTHS_FULL[month];
  let msg = `📊 *AGUAYO Y ASOCIADOS*\n📅 Reporte de metas — *${mn} 2026*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  list.forEach((per, idx) => {
    msg += `👤 *${per.name}*\n\n`;
    let tS = 0,
      tG = 0;
    LINES.forEach((l) => {
      const s = msFn(per.id, l.id, month),
        g = mgFn(per.id, l.id),
        d = s - g,
        a = accFn(per.id, l.id, month);
      tS += s;
      tG += g;
      msg += `   *${l.label}*\n   Meta: ${fmt(g)} → Ventas: ${fmt(s)}\n   ${d >= 0 ? '✅ Cumplida' : '⚠️ Pendiente'} (${d >= 0 ? `+${fmt(d)}` : `-${fmt(Math.abs(d))}`})\n`;
      if (a.remaining > 0)
        msg += `   📌 Acumulado trim.: falta ${fmt(a.remaining)}\n`;
      msg += '\n';
    });
    const td = tS - tG,
      tp = tG > 0 ? ((tS / tG) * 100).toFixed(0) : '0';
    msg += `   📈 *Total: ${fmt(tS)} / ${fmt(tG)} (${tp}%)*\n   ${td >= 0 ? '🎉 Va por encima de la meta!' : `💪 Faltan ${fmt(Math.abs(td))} — ¡sí se puede!`}\n`;
    if (idx < list.length - 1) msg += '\n━━━━━━━━━━━━━━━━━━━━\n\n';
  });
  msg += `\n━━━━━━━━━━━━━━━━━━━━\n_${quarter.name} · Aguayo y Asociados_`;
  return msg;
}

/* ═══════════════════════════════════════════════ */
/*                    MAIN APP                     */
/* ═══════════════════════════════════════════════ */
export default function App() {
  const [goals, setGoals] = useState({});
  const [sales, setSales] = useState({});
  const [month, setMonth] = useState(new Date().getMonth());
  const [tab, setTab] = useState(null);
  const [subView, setSubView] = useState('dashboard');
  const [showReminder, setShowReminder] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quote] = useState(
    () => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]
  );
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const d = await loadData();
      setGoals(d.goals);
      setSales(d.sales);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      await saveData(goals, sales);
      setSaving(false);
    }, 1000);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [goals, sales, loaded]);

  const selectTab = (id) => {
    if (tab === id && panelOpen && !editMode) {
      closePanel();
      return;
    }
    setEditMode(false);
    setTab(id);
    setSubView('dashboard');
    setPanelOpen(true);
  };
  const togglePanel = () => {
    if (panelOpen) closePanel();
    else if (tab || editMode) setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => {
      setTab(null);
      setEditMode(false);
    }, 350);
  };
  const openEdit = () => {
    if (editMode && panelOpen) {
      closePanel();
      return;
    }
    setTab(null);
    setEditMode(true);
    setPanelOpen(true);
  };

  /* ─── Data ─── */
  const ag = (pid, lid) => goals[`${pid}-${lid}-year`] || 0;
  const mg = (pid, lid) => ag(pid, lid) / 12;
  const wg = (pid, lid) => ag(pid, lid) / 48;
  const ws = (pid, lid, m, w) => sales[`${pid}-${lid}-m${m}-w${w}`] || 0;
  const ms = (pid, lid, m) => {
    let t = 0;
    for (let w = 0; w < WEEKS; w++) t += ws(pid, lid, m, w);
    return t;
  };
  const mAll = (pid, m) => LINES.reduce((s, l) => s + ms(pid, l.id, m), 0);
  const mgAll = (pid, m) => LINES.reduce((s, l) => s + mg(pid, l.id), 0);
  const gMS = (lid, m) => PEOPLE.reduce((s, p) => s + ms(p.id, lid, m), 0);
  const gMG = (lid, m) => PEOPLE.reduce((s, p) => s + mg(p.id, lid), 0);
  const gAll = (m) => PEOPLE.reduce((s, p) => s + mAll(p.id, m), 0);
  const gGoalAll = (m) => PEOPLE.reduce((s, p) => s + mgAll(p.id, m), 0);
  const qS = (pid, lid, q) => q.months.reduce((s, m) => s + ms(pid, lid, m), 0);
  const qG = (pid, lid) => mg(pid, lid) * 3;
  const yS = (pid, lid) => {
    let t = 0;
    for (let m = 0; m < 12; m++) t += ms(pid, lid, m);
    return t;
  };
  const acc = (pid, lid, upTo) => {
    const q = getQ(upTo);
    let tg = 0,
      ts = 0;
    for (const m of q.months) {
      if (m > upTo) break;
      tg += mg(pid, lid);
      ts += ms(pid, lid, m);
    }
    return {
      goal: tg,
      sales: ts,
      diff: ts - tg,
      remaining: Math.max(0, tg - ts),
    };
  };
  const commitGoal = (pid, lid, v) =>
    setGoals((p) => ({ ...p, [`${pid}-${lid}-year`]: v }));
  const commitSale = (pid, lid, m, w, v) =>
    setSales((p) => ({ ...p, [`${pid}-${lid}-m${m}-w${w}`]: v }));

  const quarter = getQ(month);
  const person = PEOPLE.find((p) => p.id === tab);
  const isOpen = panelOpen && (tab || editMode);

  /* ─── Loading ─── */
  if (!loaded)
    return (
      <div className="app loading">
        <img src={logoSvg} alt="" className="loading__logo" />
        <div className="loading__spinner" />
        <span className="loading__text">Cargando datos...</span>
      </div>
    );

  /* ─── Bar Chart ─── */
  function renderBarChart(isGlobal, pid) {
    const bars = LINES.map((line) => {
      const s = isGlobal ? gMS(line.id, month) : ms(pid, line.id, month);
      const g = isGlobal ? gMG(line.id, month) : mg(pid, line.id);
      return { ...line, sales: s, goal: g, pct: g > 0 ? (s / g) * 100 : 0 };
    });
    const totalS = isGlobal ? gAll(month) : mAll(pid, month);
    const totalG = isGlobal ? gGoalAll(month) : mgAll(pid, month);
    const maxVal = Math.max(...bars.map((b) => Math.max(b.sales, b.goal)), 1);

    return (
      <div className="chart">
        <div className="chart__header">
          <div>
            <div className="chart__label">
              {isGlobal
                ? 'Rendimiento global'
                : PEOPLE.find((p) => p.id === pid)?.name}{' '}
              — {MONTHS_FULL[month]}
            </div>
            <span className="chart__total">{fmt(totalS)}</span>
            <span className="chart__goal">/ {fmt(totalG)}</span>
          </div>
          <span
            className="chart__pct"
            style={{
              color:
                totalS >= totalG && totalG > 0
                  ? 'var(--success)'
                  : totalG > 0
                    ? 'var(--danger)'
                    : 'var(--muted)',
            }}
          >
            {totalG > 0 ? pctVal(totalS, totalG) + '%' : '—'}
          </span>
        </div>
        <div className="chart__bars">
          {bars.map((bar) => {
            const sH = maxVal > 0 ? (bar.sales / maxVal) * 100 : 0;
            const gH = maxVal > 0 ? (bar.goal / maxVal) * 100 : 0;
            const bg =
              bar.pct >= 100
                ? `linear-gradient(180deg, var(--success), ${LC[bar.id]})`
                : LC[bar.id];
            return (
              <div key={bar.id} className="chart__bar-col">
                <div className="chart__bar-value">{fmt(bar.sales)}</div>
                <div className="chart__bar-track">
                  <div
                    className="chart__bar-ghost"
                    style={{ height: `${gH}%` }}
                  />
                  <div
                    className="chart__bar-fill"
                    style={{ height: `${sH}%`, background: bg }}
                  />
                </div>
                <div className="chart__bar-label">{bar.label}</div>
              </div>
            );
          })}
        </div>
        <div className="months">
          {MONTHS_FULL.map((_, i) => {
            const sel = month === i;
            const inQ = getQ(i) === quarter;
            return (
              <button
                key={i}
                className={`mo-pill ${sel ? 'mo-pill--selected' : inQ ? 'mo-pill--in-q' : ''}`}
                onClick={() => setMonth(i)}
              >
                {SHORT[i]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── RENDER ─── */
  return (
    <div className="app">
      {/* HEADER */}
      <header className="header glass">
        <div className="header__inner">
          <div className="header__greeting">
            <div className="header__greeting-text">{getGreeting()},</div>
            <div className="header__date">{getDateStr()}</div>
          </div>
          <div className="header__tabs">
            {PEOPLE.map((p, i) => (
              <button
                key={p.id}
                className={`tab-btn ${i === 0 ? 'tab-btn--first' : ''} ${i === PEOPLE.length - 1 ? 'tab-btn--last' : ''} ${i > 0 && i < PEOPLE.length - 1 ? 'tab-btn--middle' : ''} ${!i && i < PEOPLE.length - 1 ? 'tab-btn--middle' : ''} ${tab === p.id && !editMode ? 'tab-btn--active' : ''}`}
                style={
                  tab === p.id && !editMode
                    ? {
                        background: p.accent,
                        boxShadow: `0 2px 16px ${p.accent}30`,
                      }
                    : undefined
                }
                onClick={() => selectTab(p.id)}
              >
                {p.short}
              </button>
            ))}
          </div>
          <div className="header__actions">
            {saving && <div className="save-dot" />}
            <button
              className={`icon-btn glass ${!tab && !editMode ? 'icon-btn--disabled' : ''}`}
              onClick={togglePanel}
            >
              <ChevronIcon up={isOpen} />
            </button>
            <button
              className={`icon-btn ${editMode ? 'icon-btn--active' : 'glass'}`}
              onClick={openEdit}
            >
              <EditIconSvg />
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="body">
        <div
          className={`panel glass-strong ${isOpen ? 'panel--open' : 'panel--closed'}`}
        >
          {/* EDIT MODE */}
          {editMode && (
            <>
              {renderBarChart(true, null)}
              <div className="content">
                <div className="registro__title">
                  <div className="registro__title-text">Registro de Ventas</div>
                  <div className="registro__title-sub">
                    {MONTHS_FULL[month]} 2026
                  </div>
                </div>
                {PEOPLE.map((per) => (
                  <div key={per.id} className="registro__person">
                    <div className="registro__person-header">
                      <div
                        className="registro__avatar"
                        style={{
                          background: `linear-gradient(135deg, ${per.accent}, ${per.accent}CC)`,
                          boxShadow: `0 2px 8px ${per.accent}25`,
                        }}
                      >
                        {per.initials}
                      </div>
                      <span className="registro__person-name">{per.name}</span>
                    </div>
                    {LINES.map((line) => (
                      <div key={line.id} className="registro__line">
                        <div className="registro__line-header">
                          <span className="registro__line-name">
                            {line.label}
                          </span>
                          <div className="registro__line-meta">
                            Meta: {fmt(mg(per.id, line.id))}
                            <span className="sep-pipe">|</span>
                            Total:{' '}
                            <strong>{fmt(ms(per.id, line.id, month))}</strong>
                            <span style={{ marginLeft: 5 }}>
                              <StatusText
                                value={ms(per.id, line.id, month)}
                                goal={mg(per.id, line.id)}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="registro__weeks">
                          {Array.from({ length: WEEKS }).map((_, w) => (
                            <div key={`${per.id}-${line.id}-${month}-${w}`}>
                              <label className="registro__week-label">
                                Sem {w + 1}
                              </label>
                              <LockableInput
                                value={
                                  sales[`${per.id}-${line.id}-m${month}-w${w}`]
                                }
                                onCommit={(v) =>
                                  commitSale(per.id, line.id, month, w, v)
                                }
                                placeholder="0"
                                accentColor={per.accent}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="registro__sep" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PERSON VIEW */}
          {person && !editMode && (
            <>
              {renderBarChart(false, person.id)}
              <div className="content">
                <div className="sub-tabs">
                  {[
                    { k: 'dashboard', l: 'Dashboard' },
                    { k: 'metas', l: 'Metas' },
                    { k: 'resumen', l: 'Resumen' },
                  ].map((v) => (
                    <button
                      key={v.k}
                      className={`sub-tab ${subView === v.k ? 'sub-tab--active' : ''}`}
                      style={
                        subView === v.k
                          ? {
                              background: person.accent,
                              boxShadow: `0 2px 12px ${person.accent}30`,
                            }
                          : undefined
                      }
                      onClick={() => setSubView(v.k)}
                    >
                      {v.l}
                    </button>
                  ))}
                  <button
                    className="reminder-btn"
                    onClick={() => setShowReminder(true)}
                  >
                    🔔
                  </button>
                </div>

                {/* DASHBOARD */}
                {subView === 'dashboard' &&
                  LINES.map((line) => {
                    const mS = ms(person.id, line.id, month),
                      goal = mg(person.id, line.id),
                      a = acc(person.id, line.id, month);
                    return (
                      <div key={line.id} className="line-row">
                        <div className="line-row__header">
                          <div>
                            <span className="line-row__name">{line.label}</span>
                            <span className="line-row__annual">
                              Anual: {fmt(ag(person.id, line.id))}
                            </span>
                          </div>
                          <StatusText value={mS} goal={goal} />
                        </div>
                        <div className="line-row__progress-info">
                          <span>
                            {fmt(mS)} / {fmt(goal)}
                          </span>
                          <span>{pctVal(mS, goal)}%</span>
                        </div>
                        <PBar
                          value={mS}
                          goal={goal}
                          color={LC[line.id]}
                          h={6}
                        />
                        <div className="line-row__weeks">
                          {Array.from({ length: WEEKS }).map((_, w) => {
                            const wSale = ws(person.id, line.id, month, w);
                            return (
                              <div key={w}>
                                <div className="week-cell__header">
                                  <span className="week-cell__label">
                                    Sem {w + 1}
                                  </span>
                                  <span className="week-cell__value">
                                    {fmt(wSale)}
                                  </span>
                                </div>
                                <PBar
                                  value={wSale}
                                  goal={wg(person.id, line.id)}
                                  color={LC[line.id]}
                                  h={3}
                                />
                              </div>
                            );
                          })}
                        </div>
                        {a.remaining > 0 && (
                          <div
                            className="line-row__accum"
                            style={{ color: 'var(--danger)' }}
                          >
                            Acumulado {quarter.name}: falta {fmt(a.remaining)}{' '}
                            para cerrar trimestre
                          </div>
                        )}
                        {a.diff >= 0 && a.goal > 0 && (
                          <div
                            className="line-row__accum"
                            style={{ color: 'var(--success)' }}
                          >
                            {quarter.name} al corriente — excedente +
                            {fmt(a.diff)}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* METAS */}
                {subView === 'metas' && (
                  <div>
                    <p className="metas__description">
                      Define la meta anual. Se divide automáticamente por mes y
                      semana. Lo no cumplido se acumula en el trimestre.
                    </p>
                    {LINES.map((line) => {
                      const annual = ag(person.id, line.id);
                      return (
                        <div key={line.id} className="metas__line">
                          <div className="metas__line-name">{line.label}</div>
                          <div className="metas__input-wrap">
                            <LockableInput
                              value={goals[`${person.id}-${line.id}-year`]}
                              onCommit={(v) =>
                                commitGoal(person.id, line.id, v)
                              }
                              placeholder="Meta anual"
                              accentColor={person.accent}
                            />
                          </div>
                          {annual > 0 && (
                            <>
                              <div className="metas__breakdown">
                                <span>
                                  Mensual: <strong>{fmt(annual / 12)}</strong>
                                </span>
                                <span>
                                  Semanal: <strong>{fmt(annual / 48)}</strong>
                                </span>
                                <span>
                                  Trimestral: <strong>{fmt(annual / 4)}</strong>
                                </span>
                              </div>
                              <div className="metas__annual-progress">
                                <div className="metas__annual-info">
                                  <span>Progreso anual</span>
                                  <span>
                                    {fmt(yS(person.id, line.id))} /{' '}
                                    {fmt(annual)}
                                  </span>
                                </div>
                                <PBar
                                  value={yS(person.id, line.id)}
                                  goal={annual}
                                  color={LC[line.id]}
                                  h={4}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                    <div style={{ textAlign: 'left', marginTop: 10 }}>
                      <button
                        className="metas__delete-btn"
                        onClick={() => {
                          if (confirm('¿Borrar TODOS los datos?')) {
                            setGoals({});
                            setSales({});
                          }
                        }}
                      >
                        Borrar datos
                      </button>
                    </div>
                  </div>
                )}

                {/* RESUMEN */}
                {subView === 'resumen' &&
                  QUARTERS.map((q) => {
                    const curr = q === quarter;
                    return (
                      <div key={q.name} className="quarter-block">
                        <div className="quarter-block__header">
                          <span className="quarter-block__name">{q.name}</span>
                          <span className="quarter-block__label">
                            {q.label}
                          </span>
                          {curr && (
                            <span className="quarter-block__badge">Actual</span>
                          )}
                        </div>
                        {LINES.map((line) => {
                          const qs = qS(person.id, line.id, q),
                            qGoal = qG(person.id, line.id),
                            diff = qs - qGoal;
                          return (
                            <div key={line.id} className="quarter-line">
                              <div className="quarter-line__header">
                                <span className="quarter-line__name">
                                  {line.label}
                                </span>
                                <div className="quarter-line__values">
                                  <span className="quarter-line__total">
                                    {fmt(qs)} / {fmt(qGoal)}
                                  </span>
                                  <span
                                    className="quarter-line__diff"
                                    style={{
                                      color:
                                        diff >= 0
                                          ? 'var(--success)'
                                          : 'var(--danger)',
                                    }}
                                  >
                                    {diff >= 0 ? '+' : ''}
                                    {fmt(diff)}
                                  </span>
                                </div>
                              </div>
                              <PBar
                                value={qs}
                                goal={qGoal}
                                color={LC[line.id]}
                                h={4}
                              />
                              <div className="quarter-line__months">
                                {q.months.map((m) => {
                                  const mS = ms(person.id, line.id, m),
                                    mGoal = mg(person.id, line.id),
                                    md = mS - mGoal;
                                  return (
                                    <div key={m}>
                                      <div className="quarter-month__header">
                                        <span className="quarter-month__name">
                                          {MONTHS_FULL[m]}
                                        </span>
                                        <span
                                          className="quarter-month__diff"
                                          style={{
                                            color:
                                              md >= 0 && mGoal > 0
                                                ? 'var(--success)'
                                                : mGoal > 0
                                                  ? 'var(--danger)'
                                                  : 'var(--muted)',
                                          }}
                                        >
                                          {mGoal > 0
                                            ? (md >= 0 ? '+' : '') + fmt(md)
                                            : '—'}
                                        </span>
                                      </div>
                                      <PBar
                                        value={mS}
                                        goal={mGoal}
                                        color={LC[line.id]}
                                        h={3}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                        <div className="quarter-block__sep" />
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>

        {/* LANDING */}
        {!isOpen && (
          <div className="landing">
            <img
              src={logoSvg}
              alt="Aguayo y Asociados"
              className="landing__logo"
            />
            <div className="landing__content">
              <p className="landing__quote">"{quote}"</p>
              <p className="landing__hint">
                Selecciona un nombre para ver su panel
              </p>
            </div>
          </div>
        )}
      </div>

      {/* REMINDER MODAL */}
      {showReminder &&
        (() => {
          const list = editMode ? PEOPLE : person ? [person] : PEOPLE;
          const waMsg = buildWhatsAppReminder(
            list,
            ms,
            mg,
            acc,
            month,
            quarter
          );
          return (
            <div
              className="modal-overlay"
              onClick={() => setShowReminder(false)}
            >
              <div
                className="modal glass-strong"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal__header">
                  <div className="modal__icon">🔔</div>
                  <h2 className="modal__title">
                    Recordatorio — {MONTHS_FULL[month]} 2026
                  </h2>
                  <p className="modal__subtitle">
                    Aguayo y Asociados · {quarter.name}
                  </p>
                </div>
                <div className="modal__preview glass">{waMsg}</div>
                <div className="modal__actions">
                  <button
                    className="modal__wa-btn"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(waMsg)
                        .then(() => alert('Copiado — pégalo en WhatsApp'));
                    }}
                  >
                    Copiar para WhatsApp
                  </button>
                  <button
                    className="modal__close-btn glass"
                    onClick={() => setShowReminder(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
