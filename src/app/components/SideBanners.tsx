import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Phone, Star, ArrowRight, TrendingUp, Users, Zap, BadgePercent } from "lucide-react";

// ─── Company banner data ──────────────────────────────────────────────────────
const LEFT_BANNERS = [
  {
    id: "l1",
    company: "КрасотаДом",
    tagline: "Дизайн\nинтерьеров\nпод ключ",
    subtext: "Квартиры · Офисы · Лофты",
    cta: "Узнать цену",
    phone: "+7 (911) 100-20-30",
    rating: 4.9,
    reviews: 312,
    accent: "#FA5108",
    bg: "#1A1A2E",
    img: "https://images.unsplash.com/photo-1759150712360-6d48015e4f86?w=200&h=280&fit=crop",
    badge: "ТОП-1 в городе",
    discount: "−15%\nна проект",
  },
  {
    id: "l2",
    company: "СтройМастер",
    tagline: "Ремонт\nлюбой\nсложности",
    subtext: "Опыт 12 лет · 1400+ объектов",
    cta: "Получить смету",
    phone: "+7 (911) 200-30-40",
    rating: 4.8,
    reviews: 874,
    accent: "#2563EB",
    bg: "#0F172A",
    img: "https://images.unsplash.com/photo-1756649884255-048f1c6b8332?w=200&h=280&fit=crop",
    badge: "Гарантия 3 года",
    discount: "Бесплатный\nвыезд",
  },
  {
    id: "l3",
    company: "АртДекор",
    tagline: "Отделка\nи декор\nпремиум",
    subtext: "Штукатурка · Покраска · Обои",
    cta: "Записаться",
    phone: "+7 (911) 300-40-50",
    rating: 4.7,
    reviews: 196,
    accent: "#7C3AED",
    bg: "#1E1B2E",
    img: "https://images.unsplash.com/photo-1762633203398-d4432b5269b1?w=200&h=280&fit=crop",
    badge: "Новинка",
    discount: "Акция\nдо 31.03",
  },
  {
    id: "l4",
    company: "КухниМечты",
    tagline: "Кухни\nна заказ\nот 7 дней",
    subtext: "Фасады · Столешницы · Фурнитура",
    cta: "Смотреть каталог",
    phone: "+7 (911) 310-41-55",
    rating: 4.8,
    reviews: 423,
    accent: "#0891B2",
    bg: "#0C1A1E",
    img: "https://images.unsplash.com/photo-1759691337957-ebc9ed54dc44?w=200&h=280&fit=crop",
    badge: "Хит продаж",
    discount: "Рассрочка\n0% · 12 мес",
  },
  {
    id: "l5",
    company: "КровляПро",
    tagline: "Кровельные\nработы\nпод ключ",
    subtext: "Металлочерепица · Гибкая черепица",
    cta: "Рассчитать крышу",
    phone: "+7 (911) 320-44-66",
    rating: 4.6,
    reviews: 258,
    accent: "#DC2626",
    bg: "#1C0404",
    img: "https://images.unsplash.com/photo-1765025315704-0a0df222a610?w=200&h=280&fit=crop",
    badge: "Сезон открыт",
    discount: "−10%\nдо мая",
  },
  {
    id: "l6",
    company: "БригадаПлюс",
    tagline: "Строители\nи монтажники\nв наличии",
    subtext: "Любые работы · Быстро · Надёжно",
    cta: "Нанять бригаду",
    phone: "+7 (911) 330-55-77",
    rating: 4.7,
    reviews: 619,
    accent: "#16A34A",
    bg: "#061408",
    img: "https://images.unsplash.com/photo-1663058480199-acbc638bf21a?w=200&h=280&fit=crop",
    badge: "500+ бригад",
    discount: "Выезд\nсегодня",
  },
];

const RIGHT_BANNERS = [
  {
    id: "r1",
    company: "ПолиПол",
    tagline: "Полы\nлюбых\nматериалов",
    subtext: "Паркет · Ламинат · Плитка",
    cta: "Рассчитать",
    phone: "+7 (911) 400-50-60",
    rating: 4.9,
    reviews: 541,
    accent: "#059669",
    bg: "#052E16",
    img: "https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=200&h=280&fit=crop",
    badge: "Выгода месяца",
    discount: "−20%\nна монтаж",
  },
  {
    id: "r2",
    company: "ЭлектроПро",
    tagline: "Электрика\nи сантехника\nпод ключ",
    subtext: "Быстро · Чисто · С гарантией",
    cta: "Вызвать мастера",
    phone: "+7 (911) 500-60-70",
    rating: 4.8,
    reviews: 1023,
    accent: "#D97706",
    bg: "#1C1400",
    img: "https://images.unsplash.com/photo-1687179185557-81b3e47cac26?w=200&h=280&fit=crop",
    badge: "24/7 выезд",
    discount: "Диагностика\nбесплатно",
  },
  {
    id: "r3",
    company: "ЭлитРемонт",
    tagline: "Ремонт\nпрестиж-\nкласса",
    subtext: "Материалы Европа · Гарантия",
    cta: "Консультация",
    phone: "+7 (911) 600-70-80",
    rating: 5.0,
    reviews: 88,
    accent: "#B45309",
    bg: "#1C0A00",
    img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=200&h=280&fit=crop",
    badge: "VIP",
    discount: "Рассрочка\n0%",
  },
  {
    id: "r4",
    company: "УмныйДом",
    tagline: "Системы\nавтоматизации\nжилья",
    subtext: "Умный свет · Безопасность · IoT",
    cta: "Подкл��чить",
    phone: "+7 (911) 610-71-82",
    rating: 4.9,
    reviews: 174,
    accent: "#6D28D9",
    bg: "#130D24",
    img: "https://images.unsplash.com/photo-1752262167753-37a0ec83f614?w=200&h=280&fit=crop",
    badge: "Новинка 2026",
    discount: "Монтаж\nбесплатно",
  },
  {
    id: "r5",
    company: "ОкнаМир",
    tagline: "Окна\nи двери\nПВХ/ALU",
    subtext: "Замер · Доставка · Установка",
    cta: "Вызвать замерщика",
    phone: "+7 (911) 620-72-83",
    rating: 4.7,
    reviews: 392,
    accent: "#0284C7",
    bg: "#061622",
    img: "https://images.unsplash.com/photo-1726041452947-c91302d15c4c?w=200&h=280&fit=crop",
    badge: "Замер бесплатно",
    discount: "−15%\nна стеклопакет",
  },
  {
    id: "r6",
    company: "СадПро",
    tagline: "Ландшафтный\nдизайн\nи озеленение",
    subtext: "Газон · Дорожки · Полив",
    cta: "Заказать проект",
    phone: "+7 (911) 630-73-84",
    rating: 4.8,
    reviews: 211,
    accent: "#15803D",
    bg: "#071610",
    img: "https://images.unsplash.com/photo-1762423095443-2f16a2866716?w=200&h=280&fit=crop",
    badge: "Сезон открыт",
    discount: "Консультция\nбесплатно",
  },
];

// ─── Extra banner data (2 new styles per column) ──────────────────────────────

const LEFT_EXTRA: ExtraBanner[] = [
  // Style A – "Poster": full-bleed photo, gradient overlay, cinematic feel
  {
    id: "lx1",
    style: "poster",
    img: "https://images.unsplash.com/photo-1738168279272-c08d6dd22002?w=320&h=200&fit=crop",
    label: "Недвижимость",
    headline: "Квартиры\nбизнес-класса\nот 5.2 млн ₽",
    sub: "Сданы · Ипотека от 6%",
    cta: "Смотреть",
    accent: "#FA5108",
    company: "ABBY Недвижимость",
  },
  // Style B – "Stats": white card, big accent number, infographic feel
  {
    id: "lx2",
    style: "stats",
    icon: "percent",
    headline: "Ипотека",
    bigNumber: "6.5%",
    bigLabel: "годовых",
    stats: [
      { label: "Банков-партнёров", value: "14" },
      { label: "Одобрений за месяц", value: "380+" },
    ],
    cta: "Рассчитать",
    accent: "#2563EB",
    company: "ABBY Ипотека",
  },
];

const RIGHT_EXTRA: ExtraBanner[] = [
  // Style A – "Poster": dark moody photo, bold typography
  {
    id: "rx1",
    style: "poster",
    img: "https://images.unsplash.com/photo-1763328044377-d37cd9052d99?w=320&h=200&fit=crop",
    label: "Вакансии",
    headline: "Найди\nработу\nв строительстве",
    sub: "1 200+ вакансий · Сегодня",
    cta: "Найти работу",
    accent: "#16A34A",
    company: "ABBY Вакансии",
  },
  // Style B – "Stats": neon-dark card, metrics, hacker-style
  {
    id: "rx2",
    style: "stats",
    icon: "users",
    headline: "Подрядчики",
    bigNumber: "4 800+",
    bigLabel: "мастеров онлайн",
    stats: [
      { label: "Выполнено заказов", value: "92к+" },
      { label: "Средний рейтинг", value: "4.8 ★" },
    ],
    cta: "Найти мастера",
    accent: "#FA5108",
    company: "ABBY Услуги",
  },
];

// ─── Types ──────────────────────────────────────────��────────────────────────
type ExtraBanner =
  | {
      id: string;
      style: "poster";
      img: string;
      label: string;
      headline: string;
      sub: string;
      cta: string;
      accent: string;
      company: string;
    }
  | {
      id: string;
      style: "stats";
      icon: "percent" | "users" | "zap" | "trending";
      headline: string;
      bigNumber: string;
      bigLabel: string;
      stats: { label: string; value: string }[];
      cta: string;
      accent: string;
      company: string;
    };

// ─── Poster Banner ────────────────────────────────────────────────────────────
function PosterBanner({ b }: { b: Extract<ExtraBanner, { style: "poster" }> }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        height: 140,
        transform: hovered ? "scale(1.02)" : "scale(1)",
        boxShadow: hovered ? `0 10px 32px ${b.accent}50` : "0 4px 16px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => toast.success(`${b.company}: переход`)}
    >
      {/* Full-bleed photo */}
      <img
        src={b.img}
        alt={b.company}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
      />

      {/* Cinematic gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(170deg, transparent 20%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.88) 100%)`,
        }}
      />

      {/* Accent top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: b.accent }} />

      {/* Label pill */}
      <div
        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] text-white backdrop-blur-sm"
        style={{ background: `${b.accent}CC`, fontWeight: 700, letterSpacing: "0.04em" }}
      >
        {b.label}
      </div>

      {/* Content bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div
          className="text-white mb-1"
          style={{ fontWeight: 800, fontSize: "0.82rem", lineHeight: 1.2, whiteSpace: "pre-line" }}
        >
          {b.headline}
        </div>
        <div className="text-white/60 text-[9px] mb-2">{b.sub}</div>
        <button
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-[10px] transition-opacity hover:opacity-90"
          style={{ background: b.accent, fontWeight: 700 }}
          onClick={(e) => { e.stopPropagation(); toast.success(`${b.company}: переход`); }}
        >
          {b.cta} <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function StatsBanner({ b }: { b: Extract<ExtraBanner, { style: "stats" }> }) {
  const [hovered, setHovered] = useState(false);
  const IconComp = b.icon === "percent" ? BadgePercent : b.icon === "users" ? Users : b.icon === "zap" ? Zap : TrendingUp;

  const isDark = b.accent === "#FA5108";

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: isDark ? "#0F0F0F" : "#FFFFFF",
        border: isDark ? `1px solid ${b.accent}30` : "1px solid #E5E7EB",
        boxShadow: hovered
          ? `0 8px 28px ${b.accent}30`
          : isDark ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.08)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => toast.success(`${b.company}: переход`)}
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl"
        style={{ background: b.accent }}
      />

      <div className="relative z-10 p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[9px] uppercase tracking-widest"
            style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#9CA3AF", fontWeight: 600 }}
          >
            РЕКЛАМА
          </span>
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `${b.accent}20` }}
          >
            <IconComp className="w-3.5 h-3.5" style={{ color: b.accent }} />
          </div>
        </div>

        <div
          className="text-[11px] mb-1"
          style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6B7280", fontWeight: 600 }}
        >
          {b.headline}
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-1 mb-3">
          <span
            style={{
              fontSize: "1.7rem",
              fontWeight: 900,
              lineHeight: 1,
              color: b.accent,
              letterSpacing: "-0.02em",
            }}
          >
            {b.bigNumber}
          </span>
          <span
            className="text-[10px]"
            style={{ color: isDark ? "rgba(255,255,255,0.45)" : "#9CA3AF", fontWeight: 500 }}
          >
            {b.bigLabel}
          </span>
        </div>

        {/* Mini stats */}
        <div className="flex flex-col gap-1.5 mb-3">
          {b.stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span
                className="text-[9px]"
                style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}
              >
                {s.label}
              </span>
              <span
                className="text-[10px]"
                style={{ color: isDark ? "rgba(255,255,255,0.85)" : "#111827", fontWeight: 700 }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-2.5"
          style={{ background: isDark ? "rgba(255,255,255,0.07)" : "#F3F4F6" }}
        />

        {/* CTA */}
        <button
          className="w-full py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-opacity hover:opacity-90"
          style={{ background: b.accent, color: "#fff", fontWeight: 700 }}
          onClick={(e) => { e.stopPropagation(); toast.success(`${b.company}: переход`); }}
        >
          {b.cta} <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Extra Banner renderer ────────────────────────────────────────────────────
function ExtraBannerCard({ b }: { b: ExtraBanner }) {
  if (b.style === "poster") return <PosterBanner b={b} />;
  return <StatsBanner b={b} />;
}

// ─── Single Banner Card ───────────────────────────────────────────────────────
function BannerCard({ banner }: { banner: typeof LEFT_BANNERS[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: banner.bg,
        boxShadow: hovered
          ? `0 12px 40px ${banner.accent}40`
          : "0 4px 20px rgba(0,0,0,0.25)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => toast.info(`${banner.company}: ${banner.phone}`)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={banner.img}
          alt={banner.company}
          className="w-full h-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${banner.bg}CC 0%, ${banner.bg}88 60%, ${banner.accent}33 100%)`,
          }}
        />
      </div>

      {/* Accent strip top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: banner.accent }}
      />

      {/* Badge */}
      <div
        className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] text-white"
        style={{ background: banner.accent, fontWeight: 700, letterSpacing: "0.03em" }}
      >
        {banner.badge}
      </div>

      <div className="relative z-10 p-3">
        {/* Company name */}
        <div className="text-[10px] text-white/50 mb-1" style={{ letterSpacing: "0.08em" }}>
          РЕКЛАМА
        </div>
        <div
          className="text-white text-sm mb-1"
          style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          {banner.company}
        </div>

        {/* Tagline */}
        <div
          className="text-white mb-2"
          style={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2, whiteSpace: "pre-line" }}
        >
          {banner.tagline}
        </div>

        {/* Subtext */}
        <p className="text-white/60 text-[10px] mb-3 leading-snug">{banner.subtext}</p>

        {/* Discount badge */}
        <div
          className="inline-block px-2.5 py-1.5 rounded-xl mb-3 text-white text-[11px] text-center"
          style={{
            background: `${banner.accent}33`,
            border: `1px solid ${banner.accent}66`,
            fontWeight: 700,
            whiteSpace: "pre-line",
            lineHeight: 1.3,
          }}
        >
          {banner.discount}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-[11px]" style={{ fontWeight: 600 }}>{banner.rating}</span>
          <span className="text-white/40 text-[10px]">({banner.reviews})</span>
        </div>

        {/* CTA */}
        <button
          className="w-full py-2 rounded-xl text-white text-[11px] flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
          style={{
            background: banner.accent,
            fontWeight: 700,
          }}
          onClick={(e) => {
            e.stopPropagation();
            toast.success(`${banner.company}: переход к профилю`);
          }}
        >
          {banner.cta} <ArrowRight className="w-3 h-3" />
        </button>

        {/* Phone */}
        <button
          className="w-full py-1.5 mt-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
          style={{
            color: banner.accent,
            border: `1px solid ${banner.accent}44`,
            fontWeight: 600,
          }}
          onClick={(e) => {
            e.stopPropagation();
            toast.info(`Звонок: ${banner.phone}`);
          }}
        >
          <Phone className="w-2.5 h-2.5" /> {banner.phone}
        </button>
      </div>
    </div>
  );
}

// ─── Side Banner Column ───────────────────────────────────────────────────────
function BannerColumn({
  banners,
  side,
  extra,
}: {
  banners: typeof LEFT_BANNERS;
  side: "left" | "right";
  extra: ExtraBanner[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-rotate banners every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % banners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div
      className="absolute z-30 hidden 2xl:flex flex-col gap-2 items-center"
      style={{
        [side === "left" ? "left" : "right"]: "calc((100vw - 1280px) / 2 - 176px)",
        width: 160,
        top: "150px",
      }}
    >
      {/* Main rotating banner */}
      <BannerCard banner={banners[activeIdx]} />

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-1">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? 18 : 6,
              height: 6,
              background: i === activeIdx ? banners[activeIdx].accent : "#CCCCCC",
            }}
          />
        ))}
      </div>

      {/* Small preview of next banner */}
      <div
        className="w-full rounded-xl overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        onClick={() => setActiveIdx((activeIdx + 1) % banners.length)}
        style={{ background: banners[(activeIdx + 1) % banners.length].bg }}
      >
        <div className="relative h-16">
          <img
            src={banners[(activeIdx + 1) % banners.length].img}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-center px-3 gap-2">
            <div
              className="w-1 h-full rounded-full shrink-0"
              style={{
                background: banners[(activeIdx + 1) % banners.length].accent,
                width: 3,
              }}
            />
            <div>
              <div className="text-white text-[10px]" style={{ fontWeight: 700 }}>
                {banners[(activeIdx + 1) % banners.length].company}
              </div>
              <div className="text-white/50 text-[9px]">
                {banners[(activeIdx + 1) % banners.length].subtext.split("·")[0].trim()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad label */}
      <div className="text-[9px] text-[#AAAAAA] text-center" style={{ letterSpacing: "0.05em" }}>
        Реклама · ABBY
      </div>

      {/* ── Extra banners (2 new styles) ─ */}
      <div className="w-full h-px bg-white/10 my-1" />
      {extra.map((b) => (
        <ExtraBannerCard key={b.id} b={b} />
      ))}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function SideBanners() {
  return (
    <>
      <BannerColumn banners={LEFT_BANNERS} side="left" extra={LEFT_EXTRA} />
      <BannerColumn banners={RIGHT_BANNERS} side="right" extra={RIGHT_EXTRA} />
    </>
  );
}