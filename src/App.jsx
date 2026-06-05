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
      const l = localStorage.getItem('aguayo-backup');
      if (l) return JSON.parse(l);
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

/* ─── Constants ─── */
const MF = [
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
const MS = [
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
const DY = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const QT = [
  { name: 'Q1', label: 'Ene – Mar', months: [0, 1, 2] },
  { name: 'Q2', label: 'Abr – Jun', months: [3, 4, 5] },
  { name: 'Q3', label: 'Jul – Sep', months: [6, 7, 8] },
  { name: 'Q4', label: 'Oct – Dic', months: [9, 10, 11] },
];
const WK = 4;
const LN = [
  { id: 'vida', label: 'Vida' },
  { id: 'gmm', label: 'GMM' },
  { id: 'autos', label: 'Autos' },
];
const LC = { vida: 'var(--vida)', gmm: 'var(--gmm)', autos: 'var(--autos)' };
const PP = [
  { id: 'claudio', name: 'Claudio Aguayo', short: 'Claudio', ini: 'CA' },
  { id: 'enrique', name: 'Enrique Aguayo', short: 'Enrique', ini: 'EA' },
  { id: 'diego', name: 'Diego Aguayo', short: 'Diego', ini: 'DA' },
];
const MOT = [
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

/* ─── Helpers ─── */
const getQ = (m) => QT.find((q) => q.months.includes(m));
const fmt = (n) =>
  !n || n === 0
    ? '$0'
    : '$' + Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 0 });
const pct = (v, g) => (g > 0 ? ((v / g) * 100).toFixed(1) : '0.0');
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
function dateStr() {
  const d = new Date();
  return `HOY ES ${DY[d.getDay()].toUpperCase()} ${d.getDate()} DE ${MF[d.getMonth()].toUpperCase()}`;
}

/* ─── Icons ─── */
const Chev = ({ up }) => (
  <svg
    width="16"
    height="16"
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
const Pen = () => (
  <svg
    width="16"
    height="16"
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
const PenS = () => (
  <svg
    width="11"
    height="11"
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

/* ─── Small components ─── */
function PBar({ value, goal, color, h = 4 }) {
  const p = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const bg =
    value >= goal && goal > 0 ? 'var(--success)' : color || 'var(--ink)';
  return (
    <div className="pbar" style={{ height: h }}>
      <div
        className="pbar__fill"
        style={{ height: '100%', width: `${p}%`, background: bg }}
      />
    </div>
  );
}
function Status({ value, goal }) {
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
function LockInput({ value, onCommit, placeholder, accentColor }) {
  const nv = Number(value) || 0,
    saved = nv > 0;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const ref = useRef(null);
  const open = () => {
    setDraft(saved ? String(nv) : '');
    setEditing(true);
  };
  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);
  const done = () => {
    const n = Number(draft) || 0;
    if (n > 0) onCommit(n);
    setEditing(false);
  };
  if (saved && !editing)
    return (
      <div className="lock-display">
        <span className="lock-display__value">
          ${nv.toLocaleString('es-MX')}
        </span>
        <button className="lock-display__edit-btn" onClick={open}>
          <PenS />
        </button>
      </div>
    );
  return (
    <div className="lock-input">
      <span className="lock-input__prefix">$</span>
      <input
        ref={ref}
        type="number"
        className="lock-input__field"
        value={editing ? draft : ''}
        onChange={(e) => {
          if (editing) setDraft(e.target.value);
          else {
            setDraft(e.target.value);
            setEditing(true);
          }
        }}
        onFocus={() => {
          if (!editing) {
            setDraft(saved ? String(nv) : '');
            setEditing(true);
          }
        }}
        onBlur={done}
        onKeyDown={(e) => {
          if (e.key === 'Enter') done();
        }}
        placeholder={placeholder || '0'}
        style={{
          borderColor: editing ? accentColor || 'var(--ink)' : undefined,
        }}
      />
    </div>
  );
}

function waReminder(list, msFn, mgFn, accFn, month, quarter) {
  let msg = `📊 *AGUAYO Y ASOCIADOS*\n📅 Reporte — *${MF[month]} 2026*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  list.forEach((p, i) => {
    msg += `👤 *${p.name}*\n\n`;
    let tS = 0,
      tG = 0;
    LN.forEach((l) => {
      const s = msFn(p.id, l.id, month),
        g = mgFn(p.id, l.id),
        d = s - g,
        a = accFn(p.id, l.id, month);
      tS += s;
      tG += g;
      msg += `   *${l.label}*\n   Meta: ${fmt(g)} → Ventas: ${fmt(s)}\n   ${d >= 0 ? '✅ Cumplida' : '⚠️ Pendiente'} (${d >= 0 ? `+${fmt(d)}` : `-${fmt(Math.abs(d))}`})\n`;
      if (a.remaining > 0)
        msg += `   📌 Acum. trim.: falta ${fmt(a.remaining)}\n`;
      msg += '\n';
    });
    const td = tS - tG,
      tp = tG > 0 ? ((tS / tG) * 100).toFixed(0) : '0';
    msg += `   📈 *Total: ${fmt(tS)} / ${fmt(tG)} (${tp}%)*\n   ${td >= 0 ? '🎉 Encima de la meta!' : '💪 Faltan ' + fmt(Math.abs(td)) + ' — ¡sí se puede!'}\n`;
    if (i < list.length - 1) msg += '\n━━━━━━━━━━━━━━━━━━━━\n\n';
  });
  msg += `\n━━━━━━━━━━━━━━━━━━━━\n_${quarter.name} · Aguayo y Asociados_`;
  return msg;
}

/* ═══════════════════════════════════════════════ */
export default function App() {
  const [goals, setGoals] = useState({}),
    [sales, setSales] = useState({});
  const [month, setMonth] = useState(new Date().getMonth());
  const [tab, setTab] = useState(null),
    [sub, setSub] = useState('dashboard');
  const [reminder, setReminder] = useState(false),
    [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false),
    [loaded, setLoaded] = useState(false),
    [saving, setSaving] = useState(false);
  const [quote] = useState(() => MOT[Math.floor(Math.random() * MOT.length)]);
  const timer = useRef(null);

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
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaving(true);
      await saveData(goals, sales);
      setSaving(false);
    }, 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [goals, sales, loaded]);

  const selTab = (id) => {
    if (tab === id && open && !edit) {
      close();
      return;
    }
    setEdit(false);
    setTab(id);
    setSub('dashboard');
    setOpen(true);
  };
  const toggle = () => {
    if (open) close();
    else if (tab || edit) setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setTab(null);
      setEdit(false);
    }, 350);
  };
  const openEdit = () => {
    if (edit && open) {
      close();
      return;
    }
    setTab(null);
    setEdit(true);
    setOpen(true);
  };

  const ag = (p, l) => goals[`${p}-${l}-year`] || 0;
  const mg = (p, l) => ag(p, l) / 12,
    wg = (p, l) => ag(p, l) / 48;
  const ws = (p, l, m, w) => sales[`${p}-${l}-m${m}-w${w}`] || 0;
  const ms = (p, l, m) => {
    let t = 0;
    for (let w = 0; w < WK; w++) t += ws(p, l, m, w);
    return t;
  };
  const mAll = (p, m) => LN.reduce((s, l) => s + ms(p, l.id, m), 0);
  const mgAll = (p, m) => LN.reduce((s, l) => s + mg(p, l.id), 0);
  const gMS = (l, m) => PP.reduce((s, p) => s + ms(p.id, l, m), 0);
  const gMG = (l, m) => PP.reduce((s, p) => s + mg(p.id, l), 0);
  const gAll = (m) => PP.reduce((s, p) => s + mAll(p.id, m), 0);
  const gGoalAll = (m) => PP.reduce((s, p) => s + mgAll(p.id, m), 0);
  const qS = (p, l, q) => q.months.reduce((s, m) => s + ms(p, l, m), 0);
  const qG = (p, l) => mg(p, l) * 3;
  const yS = (p, l) => {
    let t = 0;
    for (let m = 0; m < 12; m++) t += ms(p, l, m);
    return t;
  };
  const acc = (p, l, u) => {
    const q = getQ(u);
    let tg = 0,
      ts = 0;
    for (const m of q.months) {
      if (m > u) break;
      tg += mg(p, l);
      ts += ms(p, l, m);
    }
    return {
      goal: tg,
      sales: ts,
      diff: ts - tg,
      remaining: Math.max(0, tg - ts),
    };
  };
  const cG = (p, l, v) => setGoals((x) => ({ ...x, [`${p}-${l}-year`]: v }));
  const cS = (p, l, m, w, v) =>
    setSales((x) => ({ ...x, [`${p}-${l}-m${m}-w${w}`]: v }));

  const quarter = getQ(month),
    person = PP.find((p) => p.id === tab),
    isOpen = open && (tab || edit);

  if (!loaded)
    return (
      <div className="app loading">
        <img src={logoSvg} alt="" className="loading__logo" />
        <div className="loading__spinner" />
        <span className="loading__text">Cargando...</span>
      </div>
    );

  function barChart(global, pid) {
    const bars = LN.map((l) => {
      const s = global ? gMS(l.id, month) : ms(pid, l.id, month),
        g = global ? gMG(l.id, month) : mg(pid, l.id);
      return { ...l, sales: s, goal: g, p: g > 0 ? (s / g) * 100 : 0 };
    });
    const tS = global ? gAll(month) : mAll(pid, month),
      tG = global ? gGoalAll(month) : mgAll(pid, month);
    const mx = Math.max(...bars.map((b) => Math.max(b.sales, b.goal)), 1);
    return (
      <div className="chart">
        <div className="chart__header">
          <div>
            <div className="chart__label">
              {global
                ? 'Rendimiento global'
                : PP.find((p) => p.id === pid)?.name}{' '}
              — {MF[month]}
            </div>
            <span className="chart__total">{fmt(tS)}</span>
            <span className="chart__goal">/ {fmt(tG)}</span>
          </div>
          <span
            className="chart__pct"
            style={{
              color:
                tS >= tG && tG > 0
                  ? 'var(--success)'
                  : tG > 0
                    ? 'var(--danger)'
                    : 'var(--ink-muted)',
            }}
          >
            {tG > 0 ? pct(tS, tG) + '%' : '—'}
          </span>
        </div>
        <div className="chart__bars">
          {bars.map((b) => {
            const sH = mx > 0 ? (b.sales / mx) * 100 : 0,
              gH = mx > 0 ? (b.goal / mx) * 100 : 0;
            return (
              <div key={b.id} className="chart__bar-col">
                <div className="chart__bar-value">{fmt(b.sales)}</div>
                <div className="chart__bar-track">
                  <div
                    className="chart__bar-ghost"
                    style={{ height: `${gH}%` }}
                  />
                  <div
                    className="chart__bar-fill"
                    style={{ height: `${sH}%`, background: LC[b.id] }}
                  />
                </div>
                <div className="chart__bar-label">{b.label}</div>
              </div>
            );
          })}
        </div>
        <div className="months">
          {MF.map((_, i) => (
            <button
              key={i}
              className={`mo-pill ${month === i ? 'mo-pill--selected' : getQ(i) === quarter ? 'mo-pill--in-q' : ''}`}
              onClick={() => setMonth(i)}
            >
              {MS[i]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__greeting">
            <div className="header__greeting-text">{greeting()},</div>
            <div className="header__date">{dateStr()}</div>
          </div>
          <div className="header__tabs">
            {PP.map((p, i) => (
              <button
                key={p.id}
                className={`tab-btn ${i === 0 ? 'tab-btn--first' : ''} ${i === PP.length - 1 ? 'tab-btn--last' : ''} ${i > 0 && i < PP.length - 1 ? 'tab-btn--middle' : ''} ${!i && i < PP.length - 1 ? 'tab-btn--middle' : ''} ${tab === p.id && !edit ? 'tab-btn--active' : ''}`}
                onClick={() => selTab(p.id)}
              >
                {p.short}
              </button>
            ))}
          </div>
          <div className="header__actions">
            {saving && <div className="save-dot" />}
            <button
              className={`icon-btn ${!tab && !edit ? 'icon-btn--disabled' : ''}`}
              onClick={toggle}
            >
              <Chev up={isOpen} />
            </button>
            <button
              className={`icon-btn ${edit ? 'icon-btn--active' : ''}`}
              onClick={openEdit}
            >
              <Pen />
            </button>
          </div>
        </div>
      </header>

      <div className="body">
        <div className={`panel ${isOpen ? 'panel--open' : 'panel--closed'}`}>
          {edit && (
            <>
              {barChart(true, null)}
              <div className="content">
                <div className="registro__title">
                  <div className="registro__title-text">Registro de Ventas</div>
                  <div className="registro__title-sub">{MF[month]} 2026</div>
                </div>
                {PP.map((p) => (
                  <div key={p.id} className="registro__person">
                    <div className="registro__person-header">
                      <div className="registro__avatar">{p.ini}</div>
                      <span className="registro__person-name">{p.name}</span>
                    </div>
                    {LN.map((l) => (
                      <div key={l.id} className="registro__line">
                        <div className="registro__line-header">
                          <span className="registro__line-name">{l.label}</span>
                          <div className="registro__line-meta">
                            Meta: {fmt(mg(p.id, l.id))}
                            <span className="sep-pipe">|</span>Total:{' '}
                            <strong>{fmt(ms(p.id, l.id, month))}</strong>{' '}
                            <Status
                              value={ms(p.id, l.id, month)}
                              goal={mg(p.id, l.id)}
                            />
                          </div>
                        </div>
                        <div className="registro__weeks">
                          {Array.from({ length: WK }).map((_, w) => (
                            <div key={`${p.id}-${l.id}-${month}-${w}`}>
                              <label className="registro__week-label">
                                Sem {w + 1}
                              </label>
                              <LockInput
                                value={sales[`${p.id}-${l.id}-m${month}-w${w}`]}
                                onCommit={(v) => cS(p.id, l.id, month, w, v)}
                                placeholder="0"
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

          {person && !edit && (
            <>
              {barChart(false, person.id)}
              <div className="content">
                <div className="sub-tabs">
                  {[
                    { k: 'dashboard', l: 'Dashboard' },
                    { k: 'metas', l: 'Metas' },
                    { k: 'resumen', l: 'Resumen' },
                  ].map((v) => (
                    <button
                      key={v.k}
                      className={`sub-tab ${sub === v.k ? 'sub-tab--active' : ''}`}
                      onClick={() => setSub(v.k)}
                    >
                      {v.l}
                    </button>
                  ))}
                  <button
                    className="reminder-btn"
                    onClick={() => setReminder(true)}
                  >
                    🔔
                  </button>
                </div>

                {sub === 'dashboard' &&
                  LN.map((l) => {
                    const mS = ms(person.id, l.id, month),
                      goal = mg(person.id, l.id),
                      a = acc(person.id, l.id, month);
                    return (
                      <div key={l.id} className="line-row">
                        <div className="line-row__header">
                          <div>
                            <span className="line-row__name">{l.label}</span>
                            <span className="line-row__annual">
                              Anual: {fmt(ag(person.id, l.id))}
                            </span>
                          </div>
                          <Status value={mS} goal={goal} />
                        </div>
                        <div className="line-row__progress-info">
                          <span>
                            {fmt(mS)} / {fmt(goal)}
                          </span>
                          <span>{pct(mS, goal)}%</span>
                        </div>
                        <PBar value={mS} goal={goal} color={LC[l.id]} h={5} />
                        <div className="line-row__weeks">
                          {Array.from({ length: WK }).map((_, w) => {
                            const wSale = ws(person.id, l.id, month, w);
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
                                  goal={wg(person.id, l.id)}
                                  color={LC[l.id]}
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

                {sub === 'metas' && (
                  <div>
                    <p className="metas__description">
                      Define la meta anual. Se divide automáticamente por mes y
                      semana. Lo no cumplido se acumula en el trimestre.
                    </p>
                    {LN.map((l) => {
                      const an = ag(person.id, l.id);
                      return (
                        <div key={l.id} className="metas__line">
                          <div className="metas__line-name">{l.label}</div>
                          <div className="metas__input-wrap">
                            <LockInput
                              value={goals[`${person.id}-${l.id}-year`]}
                              onCommit={(v) => cG(person.id, l.id, v)}
                              placeholder="Meta anual"
                            />
                          </div>
                          {an > 0 && (
                            <>
                              <div className="metas__breakdown">
                                <span>
                                  Mensual: <strong>{fmt(an / 12)}</strong>
                                </span>
                                <span>
                                  Semanal: <strong>{fmt(an / 48)}</strong>
                                </span>
                                <span>
                                  Trimestral: <strong>{fmt(an / 4)}</strong>
                                </span>
                              </div>
                              <div className="metas__annual-progress">
                                <div className="metas__annual-info">
                                  <span>Progreso anual</span>
                                  <span>
                                    {fmt(yS(person.id, l.id))} / {fmt(an)}
                                  </span>
                                </div>
                                <PBar
                                  value={yS(person.id, l.id)}
                                  goal={an}
                                  color={LC[l.id]}
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

                {sub === 'resumen' &&
                  QT.map((q) => {
                    const cur = q === quarter;
                    return (
                      <div key={q.name} className="quarter-block">
                        <div className="quarter-block__header">
                          <span className="quarter-block__name">{q.name}</span>
                          <span className="quarter-block__label">
                            {q.label}
                          </span>
                          {cur && (
                            <span className="quarter-block__badge">Actual</span>
                          )}
                        </div>
                        {LN.map((l) => {
                          const qs = qS(person.id, l.id, q),
                            qGoal = qG(person.id, l.id),
                            diff = qs - qGoal;
                          return (
                            <div key={l.id} className="quarter-line">
                              <div className="quarter-line__header">
                                <span className="quarter-line__name">
                                  {l.label}
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
                                color={LC[l.id]}
                                h={4}
                              />
                              <div className="quarter-line__months">
                                {q.months.map((m) => {
                                  const mS = ms(person.id, l.id, m),
                                    mGoal = mg(person.id, l.id),
                                    md = mS - mGoal;
                                  return (
                                    <div key={m}>
                                      <div className="quarter-month__header">
                                        <span className="quarter-month__name">
                                          {MF[m]}
                                        </span>
                                        <span
                                          className="quarter-month__diff"
                                          style={{
                                            color:
                                              md >= 0 && mGoal > 0
                                                ? 'var(--success)'
                                                : mGoal > 0
                                                  ? 'var(--danger)'
                                                  : 'var(--ink-muted)',
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
                                        color={LC[l.id]}
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

        {!isOpen && (
          <div className="landing">
            <img src={logoSvg} alt="" className="landing__logo" />
            <div className="landing__content">
              <p className="landing__quote">"{quote}"</p>
              <p className="landing__hint">
                Selecciona un nombre para ver su panel
              </p>
            </div>
          </div>
        )}
      </div>

      {reminder &&
        (() => {
          const list = edit ? PP : person ? [person] : PP;
          const msg = waReminder(list, ms, mg, acc, month, quarter);
          return (
            <div className="modal-overlay" onClick={() => setReminder(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                  <div className="modal__icon">🔔</div>
                  <h2 className="modal__title">
                    Recordatorio — {MF[month]} 2026
                  </h2>
                  <p className="modal__subtitle">
                    Aguayo y Asociados · {quarter.name}
                  </p>
                </div>
                <div className="modal__preview">{msg}</div>
                <div className="modal__actions">
                  <button
                    className="modal__wa-btn"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(msg)
                        .then(() => alert('Copiado — pégalo en WhatsApp'));
                    }}
                  >
                    Copiar para WhatsApp
                  </button>
                  <button
                    className="modal__close-btn"
                    onClick={() => setReminder(false)}
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
