import { useState, useEffect, useCallback, useRef } from 'react';

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
  'La fe te recuerda que no estás luchando sola.',
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

const C = {
  bg: '#EAECF0',
  panel: '#FFFFFF',
  border: '#D6DBE4',
  text: '#1B2A4A',
  muted: '#929EAE',
  navy: '#0D2B5C',
  blue: '#1B4F9E',
  light: '#5DADE2',
  success: '#1E8449',
  warning: '#B7950B',
  danger: '#A93226',
};

function ChevronIcon({ up }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.3s ease',
        transform: up ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function EditIconSvg() {
  return (
    <svg
      width="20"
      height="20"
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
function ShieldIllustration() {
  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.22 }}
    >
      <path
        d="M100 18 L170 50 L170 110 Q170 160 100 188 Q30 160 30 110 L30 50 Z"
        stroke="#8896AB"
        strokeWidth="2.5"
        fill="none"
      />
      <line
        x1="60"
        y1="140"
        x2="60"
        y2="100"
        stroke="#8896AB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="80"
        y1="140"
        x2="80"
        y2="80"
        stroke="#8896AB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="140"
        x2="100"
        y2="65"
        stroke="#8896AB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="120"
        y1="140"
        x2="120"
        y2="75"
        stroke="#8896AB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="140"
        y1="140"
        x2="140"
        y2="55"
        stroke="#8896AB"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PBar({ value, goal, color, h = 5 }) {
  const barColor = color || C.blue;
  const p = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  return (
    <div
      style={{
        height: h,
        background: '#E2E6ED',
        borderRadius: 4,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${p}%`,
          borderRadius: 4,
          background: value >= goal && goal > 0 ? C.success : barColor,
          transition: 'width 0.5s ease',
          opacity: 0.75,
        }}
      />
    </div>
  );
}

function StatusText({ value, goal }) {
  if (!goal)
    return <span style={{ color: C.muted, fontSize: 11 }}>Sin meta</span>;
  const d = value - goal;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: d >= 0 ? C.success : C.danger,
      }}
    >
      {d >= 0 ? `+${fmt(d)}` : `-${fmt(Math.abs(d))}`}
    </span>
  );
}

function LockableInput({ value, onCommit, placeholder, accentColor }) {
  const numericValue = Number(value) || 0;
  const isSaved = numericValue > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const startEdit = () => {
    setDraft(isSaved ? String(numericValue) : '');
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const finishEdit = () => {
    const num = Number(draft) || 0;
    if (num > 0) onCommit(num);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') finishEdit();
  };

  if (isSaved && !isEditing) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '8px 10px',
          background: '#F0F3F9',
          borderRadius: 8,
          minHeight: 36,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            fontFamily: "'Outfit', sans-serif",
            flex: 1,
          }}
        >
          ${numericValue.toLocaleString('es-MX')}
        </span>
        <button
          onClick={startEdit}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            border: 'none',
            padding: 0,
            background: 'transparent',
            cursor: 'pointer',
            color: '#929EAE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = accentColor || C.blue)
          }
          onMouseLeave={(e) => (e.currentTarget.style.color = '#929EAE')}
        >
          <PenMini />
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          left: 9,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#929EAE',
          fontSize: 12,
          fontWeight: 600,
          pointerEvents: 'none',
        }}
      >
        $
      </span>
      <input
        ref={inputRef}
        type="number"
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
            setDraft(isSaved ? String(numericValue) : '');
            setIsEditing(true);
          }
        }}
        onBlur={finishEdit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || '0'}
        style={{
          width: '100%',
          padding: '8px 10px 8px 22px',
          background: '#F7F9FC',
          border: `1.5px solid ${isEditing ? accentColor || C.blue : '#D6DBE4'}`,
          borderRadius: 8,
          color: C.text,
          fontSize: 13,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'border-color 0.25s',
        }}
      />
    </div>
  );
}

function MoPill({ label, sel, inQ, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        padding: '6px 0',
        borderRadius: 5,
        border: 'none',
        background: sel
          ? C.navy
          : h
            ? '#D0D5DE'
            : inQ
              ? '#E8ECF2'
              : 'transparent',
        color: sel ? '#fff' : inQ ? C.text : C.muted,
        cursor: 'pointer',
        fontSize: 10,
        fontWeight: sel ? 700 : 500,
        fontFamily: "'Outfit', sans-serif",
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

function SubTab({ active, accent, onClick, label }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        borderRadius: 8,
        padding: '7px 20px',
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        background: active ? accent : h ? '#E3EAF3' : 'transparent',
        color: active ? '#fff' : h ? C.navy : C.muted,
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

function TabBtn({ label, active, accent, onClick, isFirst, isLast }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: '10px 28px',
        cursor: 'pointer',
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 0.5,
        background: active ? accent || C.navy : h ? '#EDF1F8' : 'transparent',
        color: active ? '#fff' : h ? C.navy : '#7A8A9E',
        transition: 'all 0.2s ease',
        border: `1.5px solid ${C.border}`,
        borderRight: isLast ? `1.5px solid ${C.border}` : 'none',
        borderRadius: isFirst
          ? '10px 0 0 10px'
          : isLast
            ? '0 10px 10px 0'
            : '0',
      }}
    >
      {label}
    </button>
  );
}

/* ─── WhatsApp-friendly reminder generator ─── */
function buildWhatsAppReminder(
  list,
  monthSalesFn,
  mGoalFn,
  accFn,
  month,
  quarter
) {
  const monthName = MONTHS_FULL[month];
  let msg = `📊 *AGUAYO Y ASOCIADOS*\n`;
  msg += `📅 Reporte de metas — *${monthName} 2026*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  list.forEach((per, idx) => {
    msg += `👤 *${per.name}*\n\n`;

    let totalSales = 0,
      totalGoal = 0;

    LINES.forEach((l) => {
      const mSales = monthSalesFn(per.id, l.id, month);
      const goal = mGoalFn(per.id, l.id);
      const diff = mSales - goal;
      const a = accFn(per.id, l.id, month);
      totalSales += mSales;
      totalGoal += goal;

      const statusIcon = diff >= 0 ? '✅' : '⚠️';
      const diffText = diff >= 0 ? `+${fmt(diff)}` : `-${fmt(Math.abs(diff))}`;

      msg += `   *${l.label}*\n`;
      msg += `   Meta: ${fmt(goal)} → Ventas: ${fmt(mSales)}\n`;
      msg += `   ${statusIcon} ${diff >= 0 ? 'Cumplida' : 'Pendiente'} (${diffText})\n`;

      if (a.remaining > 0) {
        msg += `   📌 Acumulado trim.: falta ${fmt(a.remaining)}\n`;
      }
      msg += `\n`;
    });

    const totalDiff = totalSales - totalGoal;
    const totalPct =
      totalGoal > 0 ? ((totalSales / totalGoal) * 100).toFixed(0) : '0';
    msg += `   📈 *Total: ${fmt(totalSales)} / ${fmt(totalGoal)} (${totalPct}%)*\n`;
    msg += `   ${totalDiff >= 0 ? '🎉 Va por encima de la meta!' : `💪 Faltan ${fmt(Math.abs(totalDiff))} — ¡sí se puede!`}\n`;

    if (idx < list.length - 1) msg += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  });

  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_${quarter.name} · Aguayo y Asociados_`;

  return msg;
}

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
  const [quote] = useState(
    () => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]
  );

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get('aguayo-v11');
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.goals) setGoals(d.goals);
          if (d.sales) setSales(d.sales);
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (g, s) => {
    try {
      await window.storage.set(
        'aguayo-v11',
        JSON.stringify({ goals: g, sales: s })
      );
    } catch (e) {}
  }, []);
  useEffect(() => {
    if (loaded) save(goals, sales);
  }, [goals, sales, loaded, save]);

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

  const annualGoal = (pid, lid) => goals[`${pid}-${lid}-year`] || 0;
  const mGoal = (pid, lid) => annualGoal(pid, lid) / 12;
  const wGoal = (pid, lid) => annualGoal(pid, lid) / 48;
  const weekSale = (pid, lid, m, w) => sales[`${pid}-${lid}-m${m}-w${w}`] || 0;
  const monthSales = (pid, lid, m) => {
    let t = 0;
    for (let w = 0; w < WEEKS; w++) t += weekSale(pid, lid, m, w);
    return t;
  };
  const mAll = (pid, m) =>
    LINES.reduce((s, l) => s + monthSales(pid, l.id, m), 0);
  const mGoalAll = (pid, m) => LINES.reduce((s, l) => s + mGoal(pid, l.id), 0);
  const gMS = (lid, m) =>
    PEOPLE.reduce((s, p) => s + monthSales(p.id, lid, m), 0);
  const gMG = (lid, m) => PEOPLE.reduce((s, p) => s + mGoal(p.id, lid), 0);
  const gAll = (m) => PEOPLE.reduce((s, p) => s + mAll(p.id, m), 0);
  const gGoalAll = (m) => PEOPLE.reduce((s, p) => s + mGoalAll(p.id, m), 0);
  const qSV = (pid, lid, q) =>
    q.months.reduce((s, m) => s + monthSales(pid, lid, m), 0);
  const qGV = (pid, lid) => mGoal(pid, lid) * 3;
  const yS = (pid, lid) => {
    let t = 0;
    for (let m = 0; m < 12; m++) t += monthSales(pid, lid, m);
    return t;
  };
  const accum = (pid, lid, upTo) => {
    const q = getQ(upTo);
    let tg = 0,
      ts = 0;
    for (const m of q.months) {
      if (m > upTo) break;
      tg += mGoal(pid, lid);
      ts += monthSales(pid, lid, m);
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

  if (!loaded)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: "'Outfit', sans-serif",
          background: C.bg,
          color: C.muted,
        }}
      >
        Cargando...
      </div>
    );

  function renderBarChart(isGlobal, pid) {
    const bars = LINES.map((line) => {
      const s = isGlobal
        ? gMS(line.id, month)
        : monthSales(pid, line.id, month);
      const g = isGlobal ? gMG(line.id, month) : mGoal(pid, line.id);
      return { ...line, sales: s, goal: g, pct: g > 0 ? (s / g) * 100 : 0 };
    });
    const totalS = isGlobal ? gAll(month) : mAll(pid, month);
    const totalG = isGlobal ? gGoalAll(month) : mGoalAll(pid, month);
    const maxVal = Math.max(...bars.map((b) => Math.max(b.sales, b.goal)), 1);
    return (
      <div style={{ padding: '24px 32px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: C.muted,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              {isGlobal
                ? 'Rendimiento global'
                : PEOPLE.find((p) => p.id === pid)?.name}{' '}
              — {MONTHS_FULL[month]}
            </div>
            <span style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>
              {fmt(totalS)}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: C.muted,
                marginLeft: 6,
              }}
            >
              / {fmt(totalG)}
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color:
                totalS >= totalG && totalG > 0
                  ? C.success
                  : totalG > 0
                    ? C.danger
                    : C.muted,
            }}
          >
            {totalG > 0 ? pctVal(totalS, totalG) + '%' : '—'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            alignItems: 'flex-end',
            height: 90,
            padding: '0 16px',
          }}
        >
          {bars.map((bar) => {
            const sH = maxVal > 0 ? (bar.sales / maxVal) * 100 : 0;
            const gH = maxVal > 0 ? (bar.goal / maxVal) * 100 : 0;
            return (
              <div
                key={bar.id}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>
                  {fmt(bar.sales)}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 65,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      background: '#D6DBE4',
                      borderRadius: 2,
                      height: `${gH}%`,
                      transition: 'height 0.6s cubic-bezier(.34,1.4,.64,1)',
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      borderRadius: 4,
                      background:
                        bar.pct >= 100
                          ? `linear-gradient(180deg, ${C.success}, ${LC[bar.id]})`
                          : LC[bar.id],
                      height: `${sH}%`,
                      transition: 'height 0.6s cubic-bezier(.34,1.4,.64,1)',
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>
                  {bar.label}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 2, marginTop: 16 }}>
          {MONTHS_FULL.map((_, i) => (
            <MoPill
              key={i}
              label={SHORT[i]}
              sel={month === i}
              inQ={getQ(i) === quarter}
              onClick={() => setMonth(i)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        margin: 0,
        padding: 0,
        width: '100%',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          background: '#fff',
          borderBottom: `1px solid ${C.border}`,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 32px',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>
              {getGreeting()},
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: C.muted,
                letterSpacing: 0.5,
                marginTop: 2,
              }}
            >
              {getDateStr()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {PEOPLE.map((p, i) => (
              <TabBtn
                key={p.id}
                label={p.short}
                active={tab === p.id && !editMode}
                accent={p.accent}
                onClick={() => selectTab(p.id)}
                isFirst={i === 0}
                isLast={i === PEOPLE.length - 1}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={togglePanel}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                border: `1.5px solid ${C.border}`,
                background: '#fff',
                cursor: tab || editMode ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.muted,
                transition: 'all 0.2s',
                opacity: tab || editMode ? 1 : 0.35,
              }}
              onMouseEnter={(e) => {
                if (tab || editMode) {
                  e.currentTarget.style.background = '#EDF1F8';
                  e.currentTarget.style.color = C.navy;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = C.muted;
              }}
            >
              <ChevronIcon up={isOpen} />
            </button>
            <button
              onClick={openEdit}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                border: `1.5px solid ${editMode ? C.navy : C.border}`,
                background: editMode ? C.navy : '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: editMode ? '#fff' : C.muted,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!editMode) {
                  e.currentTarget.style.background = '#EDF1F8';
                  e.currentTarget.style.color = C.navy;
                }
              }}
              onMouseLeave={(e) => {
                if (!editMode) {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = C.muted;
                }
              }}
            >
              <EditIconSvg />
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ padding: '20px 24px 40px', width: '100%' }}>
        <div
          style={{
            background: C.panel,
            borderRadius: 18,
            overflow: 'hidden',
            maxHeight: isOpen ? 5000 : 0,
            opacity: isOpen ? 1 : 0,
            transition:
              'max-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.35s ease',
            boxShadow: isOpen ? '0 4px 30px rgba(13,43,92,0.05)' : 'none',
            width: '100%',
          }}
        >
          {/* EDIT MODE */}
          {editMode && (
            <>
              {renderBarChart(true, null)}
              <div style={{ padding: '20px 32px 28px' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>
                    Registro de Ventas
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {MONTHS_FULL[month]} 2026
                  </div>
                </div>
                {PEOPLE.map((per) => (
                  <div key={per.id} style={{ marginBottom: 32 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: per.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          color: '#fff',
                        }}
                      >
                        {per.initials}
                      </div>
                      <span
                        style={{ fontWeight: 700, fontSize: 14, color: C.navy }}
                      >
                        {per.name}
                      </span>
                    </div>
                    {LINES.map((line) => (
                      <div key={line.id} style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            {line.label}
                          </span>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            Meta: {fmt(mGoal(per.id, line.id))}
                            <span style={{ margin: '0 5px', color: C.border }}>
                              |
                            </span>
                            Total:{' '}
                            <strong style={{ color: C.navy }}>
                              {fmt(monthSales(per.id, line.id, month))}
                            </strong>
                            <span style={{ marginLeft: 5 }}>
                              <StatusText
                                value={monthSales(per.id, line.id, month)}
                                goal={mGoal(per.id, line.id)}
                              />
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 10,
                          }}
                        >
                          {Array.from({ length: WEEKS }).map((_, w) => (
                            <div key={`${per.id}-${line.id}-${month}-${w}`}>
                              <label
                                style={{
                                  fontSize: 10,
                                  fontWeight: 500,
                                  color: C.muted,
                                  display: 'block',
                                  marginBottom: 2,
                                }}
                              >
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
                    <div style={{ height: 1, background: C.border }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PERSON VIEW */}
          {person && !editMode && (
            <>
              {renderBarChart(false, person.id)}
              <div style={{ padding: '20px 32px 28px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    marginBottom: 24,
                    justifyContent: 'center',
                  }}
                >
                  {[
                    { k: 'dashboard', l: 'Dashboard' },
                    { k: 'metas', l: 'Metas' },
                    { k: 'resumen', l: 'Resumen' },
                  ].map((v) => (
                    <SubTab
                      key={v.k}
                      active={subView === v.k}
                      accent={person.accent}
                      onClick={() => setSubView(v.k)}
                      label={v.l}
                    />
                  ))}
                  <button
                    onClick={() => setShowReminder(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: C.success,
                      fontSize: 16,
                      fontFamily: 'inherit',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = 'scale(1.15)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = 'scale(1)')
                    }
                  >
                    🔔
                  </button>
                </div>

                {/* Dashboard */}
                {subView === 'dashboard' &&
                  LINES.map((line) => {
                    const mS = monthSales(person.id, line.id, month);
                    const goal = mGoal(person.id, line.id);
                    const a = accum(person.id, line.id, month);
                    return (
                      <div
                        key={line.id}
                        style={{
                          padding: '16px 0',
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: C.navy,
                              }}
                            >
                              {line.label}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: C.muted,
                                marginLeft: 10,
                              }}
                            >
                              Anual: {fmt(annualGoal(person.id, line.id))}
                            </span>
                          </div>
                          <StatusText value={mS} goal={goal} />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 12,
                            marginBottom: 5,
                          }}
                        >
                          <span style={{ color: C.muted }}>
                            {fmt(mS)} / {fmt(goal)}
                          </span>
                          <span style={{ fontWeight: 600 }}>
                            {pctVal(mS, goal)}%
                          </span>
                        </div>
                        <PBar
                          value={mS}
                          goal={goal}
                          color={LC[line.id]}
                          h={6}
                        />
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 16,
                            marginTop: 14,
                          }}
                        >
                          {Array.from({ length: WEEKS }).map((_, w) => {
                            const ws = weekSale(person.id, line.id, month, w);
                            return (
                              <div key={w}>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 3,
                                  }}
                                >
                                  <span
                                    style={{ fontSize: 10, color: C.muted }}
                                  >
                                    Sem {w + 1}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: C.text,
                                    }}
                                  >
                                    {fmt(ws)}
                                  </span>
                                </div>
                                <PBar
                                  value={ws}
                                  goal={wGoal(person.id, line.id)}
                                  color={LC[line.id]}
                                  h={3}
                                />
                              </div>
                            );
                          })}
                        </div>
                        {a.remaining > 0 && (
                          <div
                            style={{
                              marginTop: 10,
                              fontSize: 11,
                              color: C.danger,
                              fontWeight: 500,
                            }}
                          >
                            Acumulado {quarter.name}: falta {fmt(a.remaining)}{' '}
                            para cerrar trimestre
                          </div>
                        )}
                        {a.diff >= 0 && a.goal > 0 && (
                          <div
                            style={{
                              marginTop: 10,
                              fontSize: 11,
                              color: C.success,
                              fontWeight: 500,
                            }}
                          >
                            {quarter.name} al corriente — excedente +
                            {fmt(a.diff)}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Metas — labels LEFT aligned */}
                {subView === 'metas' && (
                  <div>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 12,
                        marginBottom: 24,
                        textAlign: 'left',
                      }}
                    >
                      Define la meta anual. Se divide automáticamente por mes y
                      semana. Lo no cumplido se acumula en el trimestre.
                    </p>
                    {LINES.map((line) => {
                      const ag = annualGoal(person.id, line.id);
                      return (
                        <div
                          key={line.id}
                          style={{ marginBottom: 28, textAlign: 'left' }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 15,
                              color: C.navy,
                              marginBottom: 6,
                              textAlign: 'left',
                            }}
                          >
                            {line.label}
                          </div>
                          <div style={{ maxWidth: 300 }}>
                            <LockableInput
                              value={goals[`${person.id}-${line.id}-year`]}
                              onCommit={(v) =>
                                commitGoal(person.id, line.id, v)
                              }
                              placeholder="Meta anual"
                              accentColor={person.accent}
                            />
                          </div>
                          {ag > 0 && (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 24,
                                  marginTop: 8,
                                  fontSize: 12,
                                  color: C.muted,
                                  textAlign: 'left',
                                }}
                              >
                                <span>
                                  Mensual:{' '}
                                  <strong style={{ color: C.text }}>
                                    {fmt(ag / 12)}
                                  </strong>
                                </span>
                                <span>
                                  Semanal:{' '}
                                  <strong style={{ color: C.text }}>
                                    {fmt(ag / 48)}
                                  </strong>
                                </span>
                                <span>
                                  Trimestral:{' '}
                                  <strong style={{ color: C.text }}>
                                    {fmt(ag / 4)}
                                  </strong>
                                </span>
                              </div>
                              <div style={{ marginTop: 10, textAlign: 'left' }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 11,
                                    marginBottom: 3,
                                  }}
                                >
                                  <span style={{ color: C.muted }}>
                                    Progreso anual
                                  </span>
                                  <span style={{ fontWeight: 600 }}>
                                    {fmt(yS(person.id, line.id))} / {fmt(ag)}
                                  </span>
                                </div>
                                <PBar
                                  value={yS(person.id, line.id)}
                                  goal={ag}
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
                        onClick={() => {
                          if (confirm('¿Borrar TODOS los datos?')) {
                            setGoals({});
                            setSales({});
                          }
                        }}
                        style={{
                          padding: '6px 16px',
                          background: 'transparent',
                          border: `1px solid ${C.danger}33`,
                          borderRadius: 8,
                          color: C.danger,
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 500,
                          fontFamily: 'inherit',
                        }}
                      >
                        Borrar datos
                      </button>
                    </div>
                  </div>
                )}

                {/* Resumen */}
                {subView === 'resumen' &&
                  QUARTERS.map((q) => {
                    const curr = q === quarter;
                    return (
                      <div key={q.name} style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 12,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 15,
                              color: C.navy,
                            }}
                          >
                            {q.name}
                          </span>
                          <span style={{ fontSize: 11, color: C.muted }}>
                            {q.label}
                          </span>
                          {curr && (
                            <span
                              style={{
                                fontSize: 9,
                                background: C.blue + '18',
                                color: C.blue,
                                padding: '2px 8px',
                                borderRadius: 8,
                                fontWeight: 600,
                              }}
                            >
                              Actual
                            </span>
                          )}
                        </div>
                        {LINES.map((line) => {
                          const qs = qSV(person.id, line.id, q);
                          const qg = qGV(person.id, line.id);
                          const diff = qs - qg;
                          return (
                            <div key={line.id} style={{ marginBottom: 14 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginBottom: 4,
                                }}
                              >
                                <span style={{ fontSize: 13, fontWeight: 600 }}>
                                  {line.label}
                                </span>
                                <div style={{ display: 'flex', gap: 12 }}>
                                  <span
                                    style={{ fontSize: 12, fontWeight: 600 }}
                                  >
                                    {fmt(qs)} / {fmt(qg)}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: diff >= 0 ? C.success : C.danger,
                                    }}
                                  >
                                    {diff >= 0 ? '+' : ''}
                                    {fmt(diff)}
                                  </span>
                                </div>
                              </div>
                              <PBar
                                value={qs}
                                goal={qg}
                                color={LC[line.id]}
                                h={4}
                              />
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(3, 1fr)',
                                  gap: 20,
                                  marginTop: 6,
                                }}
                              >
                                {q.months.map((m) => {
                                  const mS = monthSales(person.id, line.id, m);
                                  const mg = mGoal(person.id, line.id);
                                  const md = mS - mg;
                                  return (
                                    <div key={m}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: C.muted,
                                          }}
                                        >
                                          {MONTHS_FULL[m]}
                                        </span>
                                        <span
                                          style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color:
                                              md >= 0 && mg > 0
                                                ? C.success
                                                : mg > 0
                                                  ? C.danger
                                                  : C.muted,
                                          }}
                                        >
                                          {mg > 0
                                            ? (md >= 0 ? '+' : '') + fmt(md)
                                            : '—'}
                                        </span>
                                      </div>
                                      <PBar
                                        value={mS}
                                        goal={mg}
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
                        <div
                          style={{
                            height: 1,
                            background: C.border,
                            marginTop: 4,
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>

        {/* Landing */}
        {!isOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '100px 20px',
              textAlign: 'center',
              animation: 'fadeUp 0.5s ease',
            }}
          >
            <ShieldIllustration />
            <div style={{ marginTop: 28, maxWidth: 360 }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.navy,
                  lineHeight: 1.6,
                  margin: '0 0 10px',
                  fontStyle: 'italic',
                }}
              >
                "{quote}"
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
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
            monthSales,
            mGoal,
            accum,
            month,
            quarter
          );
          return (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(13,43,92,.12)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 16,
              }}
              onClick={() => setShowReminder(false)}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: 28,
                  maxWidth: 520,
                  width: '100%',
                  maxHeight: '85vh',
                  overflow: 'auto',
                  boxShadow: '0 20px 60px rgba(13,43,92,0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>🔔</div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 800,
                      color: C.navy,
                    }}
                  >
                    Recordatorio — {MONTHS_FULL[month]} 2026
                  </h2>
                  <p
                    style={{ color: C.muted, fontSize: 11, margin: '4px 0 0' }}
                  >
                    Aguayo y Asociados · {quarter.name}
                  </p>
                </div>

                {/* Preview */}
                <div
                  style={{
                    background: '#F0F4F0',
                    borderRadius: 12,
                    padding: '16px 18px',
                    marginBottom: 16,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    lineHeight: 1.6,
                    color: '#1B2A4A',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 300,
                    overflow: 'auto',
                  }}
                >
                  {waMsg}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      navigator.clipboard
                        .writeText(waMsg)
                        .then(() => alert('Copiado — pégalo en WhatsApp'));
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#25D366',
                      border: 'none',
                      borderRadius: 10,
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'inherit',
                    }}
                  >
                    Copiar para WhatsApp
                  </button>
                  <button
                    onClick={() => setShowReminder(false)}
                    style={{
                      padding: '10px 20px',
                      background: '#EDF1F8',
                      border: 'none',
                      borderRadius: 10,
                      color: C.muted,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                    }}
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
