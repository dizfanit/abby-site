import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Star,
  ShieldCheck,
  MapPin,
  Award,
  Phone,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  ThumbsUp,
  ChevronRight,
  Briefcase,
  FileText,
  Share2,
  Copy,
  Check,
  Handshake,
  X,
  TrendingUp,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAccount } from "./AccountContext";

const IMG_KITCHEN = "/remote-images/unsplash-019.jpg";
const IMG_BATH = "/remote-images/unsplash-037.jpg";
const IMG_LIVING = "/remote-images/unsplash-020.jpg";

const portfolio = [
  { img: IMG_KITCHEN, title: "Кухня 15 м² — ЖК Солнечный", duration: "14 дней" },
  { img: IMG_BATH, title: "Ванная комната — ЖК Ривьера", duration: "7 дней" },
  { img: IMG_LIVING, title: "Гостиная 30 м² — ЖК Парковый", duration: "21 день" },
];

const reviews = [
  {
    name: "Мария К.",
    rating: 5,
    date: "15 января 2026",
    text: "Отличная работа! Сделали ремонт кухни за 2 недели. Всё аккуратно, по смете, без сюрпризов.",
    project: "Ремонт кухни, 15 м²",
    verified: true,
  },
  {
    name: "Дмитрий С.",
    rating: 5,
    date: "3 декабря 2025",
    text: "Профессиональный подход. Прораб был на связи каждый день, фотоотчёты присылали.",
    project: "Капитальный ремонт, 65 м²",
    verified: true,
  },
  {
    name: "Ольга П.",
    rating: 4,
    date: "18 ноября 2025",
    text: "В целом хорошо, но немного затянули с сантехникой. Зато отделка безупречная.",
    project: "Ремонт ванной",
    verified: true,
  },
];

// Referral reward per contractor id
const referralData: Record<string, { rewardMin: number; rewardMax: number; percent: number }> = {
  "1": { rewardMin: 21000, rewardMax: 42000, percent: 5 },
  "2": { rewardMin: 8000, rewardMax: 16000, percent: 5 },
  "3": { rewardMin: 6000, rewardMax: 12000, percent: 4 },
  "4": { rewardMin: 30000, rewardMax: 60000, percent: 5 },
  "5": { rewardMin: 4000, rewardMax: 9000, percent: 4 },
  "6": { rewardMin: 25000, rewardMax: 50000, percent: 5 },
};

// Services data per contractor
const contractorServices: Record<string, { name: string; unit: string; priceMin: number; priceMax: number; category: string }[]> = {
  "1": [
    { name: "Комплексный ремонт под ключ", unit: "₽/м²", priceMin: 8500, priceMax: 18000, category: "Ремонт" },
    { name: "Стандартный ремонт", unit: "₽/м²", priceMin: 6000, priceMax: 10000, category: "Ремонт" },
    { name: "Косметический ремонт", unit: "₽/м²", priceMin: 3500, priceMax: 6000, category: "Ремонт" },
    { name: "Штукатурка стен (машинная)", unit: "₽/м²", priceMin: 350, priceMax: 600, category: "Черновые работы" },
    { name: "Укладка плитки", unit: "₽/м²", priceMin: 900, priceMax: 1800, category: "Отделка" },
    { name: "Монтаж ламината / паркета", unit: "₽/м²", priceMin: 400, priceMax: 800, category: "Отделка" },
    { name: "Покраска стен", unit: "₽/м²", priceMin: 200, priceMax: 450, category: "Отделка" },
    { name: "Установка дверей", unit: "₽/шт", priceMin: 3500, priceMax: 7000, category: "Столярка" },
  ],
  "2": [
    { name: "Монтаж систем водоснабжения", unit: "₽/точка", priceMin: 2500, priceMax: 5000, category: "Водоснабжение" },
    { name: "Замена труб (стояк)", unit: "₽/м.п.", priceMin: 1200, priceMax: 2500, category: "Водоснабжение" },
    { name: "Установка сантехники", unit: "₽/шт", priceMin: 2000, priceMax: 6000, category: "Сантехника" },
    { name: "Монтаж теплого пола (вода)", unit: "₽/м²", priceMin: 1200, priceMax: 2200, category: "Отопление" },
    { name: "Подключение радиаторов", unit: "₽/шт", priceMin: 3000, priceMax: 5500, category: "Отопление" },
    { name: "Аварийный вызов", unit: "₽/вызов", priceMin: 1500, priceMax: 3000, category: "Аварийный" },
  ],
  "3": [
    { name: "Монтаж электропроводки", unit: "₽/м²", priceMin: 600, priceMax: 1200, category: "Электрика" },
    { name: "Установка розеток/выключателей", unit: "₽/точка", priceMin: 800, priceMax: 1500, category: "Электрика" },
    { name: "Сборка щитка", unit: "₽/шт", priceMin: 8000, priceMax: 25000, category: "Электрика" },
    { name: "Монтаж теплого пола (эл.)", unit: "₽/м²", priceMin: 500, priceMax: 900, category: "Теплый пол" },
    { name: "Подключение бытовой техники", unit: "₽/шт", priceMin: 1200, priceMax: 3000, category: "Подключение" },
    { name: "Монтаж освещения", unit: "₽/точка", priceMin: 600, priceMax: 1200, category: "Освещение" },
  ],
  "4": [
    { name: "Ремонт под ключ Премиум", unit: "₽/м²", priceMin: 12000, priceMax: 25000, category: "Ремонт" },
    { name: "Дизайн-проект", unit: "₽/м²", priceMin: 2000, priceMax: 4500, category: "Дизайн" },
    { name: "Авторский надзор", unit: "₽/мес", priceMin: 15000, priceMax: 35000, category: "Надзор" },
    { name: "Ремонт ванной комнаты", unit: "₽/м²", priceMin: 15000, priceMax: 30000, category: "Ремонт" },
    { name: "Ремонт кухни", unit: "₽/м²", priceMin: 12000, priceMax: 22000, category: "Ремонт" },
    { name: "3D-визуализация", unit: "₽/комната", priceMin: 5000, priceMax: 12000, category: "Дизайн" },
  ],
  "5": [
    { name: "Штукатурка стен", unit: "₽/м²", priceMin: 300, priceMax: 550, category: "Черновые работы" },
    { name: "Шпатлевание стен", unit: "₽/м²", priceMin: 200, priceMax: 400, category: "Черновые работы" },
    { name: "Покраска стен", unit: "₽/м²", priceMin: 180, priceMax: 380, category: "Отделка" },
    { name: "Поклейка обоев", unit: "₽/м²", priceMin: 200, priceMax: 500, category: "Отделка" },
    { name: "Укладка плитки", unit: "₽/м²", priceMin: 800, priceMax: 1600, category: "Отделка" },
    { name: "Устройство стяжки пола", unit: "₽/м²", priceMin: 450, priceMax: 800, category: "Полы" },
  ],
  "6": [
    { name: "Капитальный ремонт", unit: "₽/м²", priceMin: 10000, priceMax: 20000, category: "Ремонт" },
    { name: "Демонтажные работы", unit: "₽/м²", priceMin: 800, priceMax: 1500, category: "Демонтаж" },
    { name: "Перепланировка квартиры", unit: "₽/м²", priceMin: 12000, priceMax: 22000, category: "Ремонт" },
    { name: "Монтаж перегородок (гипсокартон)", unit: "₽/м²", priceMin: 1200, priceMax: 2500, category: "Черновые работы" },
    { name: "Выравнивание полов (стяжка)", unit: "₽/м²", priceMin: 500, priceMax: 900, category: "Полы" },
    { name: "Изоляция и утепление", unit: "₽/м²", priceMin: 600, priceMax: 1400, category: "Черновые работы" },
  ],
};

const MOCK_REFERRER_ID = "usr_alex_8f2k";

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(".", ",")} млн ₽`;
  if (n >= 1000) return `${Math.round(n / 1000)} тыс. ₽`;
  return `${n} ₽`;
}

// Referral link modal
function ReferralModal({
  contractorId,
  contractorName,
  rewardMin,
  rewardMax,
  percent,
  onClose,
}: {
  contractorId: string;
  contractorName: string;
  rewardMin: number;
  rewardMax: number;
  percent: number;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const refLink = `https://abby.ru/contractor/${contractorId}?ref=${MOCK_REFERRER_ID}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink).catch(() => {});
    setCopied(true);
    toast.success("Ссылка скопирована!", {
      description: "Отправьте её клиенту — и получите вознаграждение при сдлке",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F0EF]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#FA5108]/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-[#FA5108]" />
              </div>
              <div>
                <div style={{ fontWeight: 700 }} className="text-[#212121]">Реферальная ссылка</div>
                <div className="text-xs text-[#737373]">{contractorName}</div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#F1F0EF] transition-colors">
              <X className="w-4 h-4 text-[#737373]" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Reward block */}
            <div className="bg-[#FFF5F0] border border-[#FA5108]/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="w-4 h-4 text-[#FA5108]" />
                <span style={{ fontWeight: 600 }} className="text-sm text-[#FA5108]">Ваше вознаграждение</span>
              </div>
              <div className="text-2xl text-[#212121]" style={{ fontWeight: 700 }}>
                {formatMoney(rewardMin)} — {formatMoney(rewardMax)}
              </div>
              <div className="text-xs text-[#737373] mt-1">
                {percent}% от стоимости сделки при успешном заказе по вашей ссылке
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-[#FA5108]/80">
                <TrendingUp className="w-3 h-3" />
                Выплачивается после подписания акта выполненных работ
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-2">
              {[
                { step: "1", text: "Скопируйте и отправьте ссылку клиенту" },
                { step: "2", text: "Клиент переходит и заказывает услугу" },
                { step: "3", text: "После закрытия сделки вы получаете вознаграждение" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#212121] text-white text-xs flex items-center justify-center shrink-0" style={{ fontWeight: 700 }}>
                    {s.step}
                  </div>
                  <span className="text-sm text-[#737373]">{s.text}</span>
                </div>
              ))}
            </div>

            {/* Link field */}
            <div>
              <label className="text-xs text-[#737373] mb-1.5 block" style={{ fontWeight: 500 }}>Ваша уникальная ссылка</label>
              <div className="flex items-center gap-2 p-3 bg-[#F1F0EF] rounded-xl border border-[#E8E6E3]">
                <span className="flex-1 text-xs text-[#212121] truncate font-mono">{refLink}</span>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-[#FA5108] text-white hover:bg-[#e04a07]"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Скопировано" : "Копировать"}
                </button>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 text-xs text-[#737373] bg-[#F9F9F8] rounded-lg p-3">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#737373]" />
              Ссылка привязана к вашему аккаунту. Все переходы и статус сделки отображаются в личном кабинете.
            </div>
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)",
                fontWeight: 600,
              }}
            >
              Скопировать реферальную ссылку
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ContractorProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"portfolio" | "reviews" | "docs" | "services">("portfolio");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const { accountType } = useAccount();
  const isAgent = accountType === "business";

  const contractorId = id ?? "1";
  const reward = referralData[contractorId] ?? referralData["1"];
  const services = contractorServices[contractorId] ?? contractorServices["1"];

  // Group services by category
  const servicesByCategory = services.reduce<Record<string, typeof services>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/services" className="hover:text-primary">Услуги</Link>
        <span>/</span>
        <span className="text-foreground">СтройМастер Про</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl shrink-0"
                style={{ fontWeight: 700 }}>
                СМ
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl" style={{ fontWeight: 700 }}>СтройМастер Про</h1>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-muted-foreground mb-3">Ремонт под ключ · Москва и МО</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" /> 4.9
                  </span>
                  <span className="text-muted-foreground">156 отзывов</span>
                  <span className="text-muted-foreground">89 проектов</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" /> Москва
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {["Топ-10", "СРО", "Допуск", "Гарантия 3 года"].map((b) => (
                    <span key={b} className="flex items-center gap-1 px-2 py-1 bg-[#FA5108]/10 text-[#FA5108] text-xs rounded">
                      <Award className="w-3 h-3" /> {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Выполнено проектов", value: "89", icon: Briefcase },
              { label: "Средний срок", value: "24 дня", icon: Clock },
              { label: "В срок", value: "94%", icon: Calendar },
              { label: "Рекомендуют", value: "98%", icon: ThumbsUp },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xl" style={{ fontWeight: 700 }}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1">
            {([
              { val: "portfolio" as const, label: "Портфолио" },
              { val: "services" as const, label: "Услуги и цены" },
              { val: "reviews" as const, label: "Отзывы (156)" },
              { val: "docs" as const, label: "Документы" },
            ]).map((t) => (
              <button
                key={t.val}
                onClick={() => setActiveTab(t.val)}
                className={`flex-1 py-2.5 rounded-md text-sm transition-colors ${
                  activeTab === t.val
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontWeight: activeTab === t.val ? 600 : 400 }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "portfolio" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map((p) => (
                <div key={p.title} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <ImageWithFallback src={p.img} alt={p.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 style={{ fontWeight: 600 }} className="text-sm mb-1">{p.title}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-3 bg-[#FFF5F0] border border-[#FA5108]/20 rounded-xl text-sm text-[#737373]">
                <Info className="w-4 h-4 text-[#FA5108] shrink-0" />
                Цены ориентировочные и зависят от объёма работ, материалов и условий объекта. Точная стоимость рассчитывается после осмотра.
              </div>
              {Object.entries(servicesByCategory).map(([category, items]) => (
                <div key={category}>
                  <div className="text-xs text-[#737373] mb-2 px-1" style={{ fontWeight: 600 }}>
                    {category.toUpperCase()}
                  </div>
                  <div className="bg-white rounded-xl border border-[#E8E6E3] overflow-hidden">
                    {items.map((s, i) => (
                      <div
                        key={s.name}
                        className={`flex items-center justify-between px-4 py-3 ${i !== items.length - 1 ? "border-b border-[#F1F0EF]" : ""}`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="text-sm text-[#212121]" style={{ fontWeight: 500 }}>{s.name}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm text-[#FA5108]" style={{ fontWeight: 700 }}>
                            {s.priceMin.toLocaleString("ru")} – {s.priceMax.toLocaleString("ru")}
                          </div>
                          <div className="text-[11px] text-[#737373]">{s.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => toast.success("Запрос на смету отправлен", { description: "Подрядчик свяжется с вами в течение часа" })}
                className="w-full py-3 rounded-xl text-white text-sm"
                style={{
                  background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)",
                  fontWeight: 600,
                }}
              >
                Запросить точную смету
              </button>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.name + r.date} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 600 }}>{r.name}</span>
                        {r.verified && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 className="w-3 h-3" /> Сделка на ABBY
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{r.project}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{r.date}</div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "docs" && (
            <div className="space-y-3">
              {[
                { name: "Свидетельство СРО", status: "Действует до 2027" },
                { name: "Допуск к работам", status: "Проверено" },
                { name: "Страховой полис", status: "Действует" },
                { name: "Сертификат ISO 9001", status: "Проверено" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between bg-white rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{doc.name}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {doc.status}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1">Стоимость работ</div>
              <div className="text-2xl text-foreground mb-4" style={{ fontWeight: 700 }}>от 8 500 ₽/м²</div>
              <button
                onClick={() => toast.success("Запрос на смету отправлен подрядчику")}
                className="w-full py-3 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] transition-colors mb-3"
                style={{ fontWeight: 600 }}>
                Запросить смету
              </button>
              <Link
                to="/calculator"
                className="w-full py-3 bg-[#212121] text-white rounded-lg hover:bg-[#212121]/90 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                Калькулятор сметы <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => toast("Звонок подрядчику", { description: "+7 (495) 987-65-43" })}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-[#F1F0EF] transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-4 h-4" /> Позвонить
                </button>
                <button
                  onClick={() => toast.success("Чат с подрядчиком открыт")}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-[#F1F0EF] transition-colors flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" /> Написать
                </button>
              </div>
            </div>

            {/* Referral block — agents only */}
            {isAgent ? (
              <div className="bg-gradient-to-br from-[#FA5108]/8 to-[#FF753A]/5 rounded-xl border border-[#FA5108]/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#FA5108]/15 flex items-center justify-center">
                    <Handshake className="w-4 h-4 text-[#FA5108]" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }} className="text-sm text-[#212121]">Рекомендовать</div>
                    <div className="text-[11px] text-[#737373]">Только для агентов</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-[11px] text-[#737373] mb-0.5">Вознаграждение за успешную сделку</div>
                  <div className="text-xl text-[#FA5108]" style={{ fontWeight: 700 }}>
                    {formatMoney(reward.rewardMin)} — {formatMoney(reward.rewardMax)}
                  </div>
                  <div className="text-[11px] text-[#737373]">{reward.percent}% от стоимости заказа</div>
                </div>

                <button
                  onClick={() => setShowReferralModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)",
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Получить ссылку
                </button>

                <div className="mt-3 flex items-start gap-1.5 text-[10px] text-[#737373]">
                  <Info className="w-3 h-3 shrink-0 mt-0.5" />
                  Ссылка уникальная — сделка отслеживается автоматически
                </div>
              </div>
            ) : (
              <div className="bg-[#F1F0EF] rounded-xl border border-[#E8E6E3] p-5">
                <div className="flex items-center gap-2 mb-2 opacity-50">
                  <Share2 className="w-4 h-4 text-[#737373]" />
                  <span style={{ fontWeight: 600 }} className="text-sm text-[#737373]">Рекомендовать</span>
                </div>
                <p className="text-xs text-[#737373]">
                  Функция доступна только для агентов и бизнес-аккаунтов. Переключите тип аккаунта в профиле.
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-border p-6">
              <h4 className="mb-3" style={{ fontWeight: 600 }}>Доступость</h4>
              <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                Свободен с 1 марта 2026
              </div>
              <div className="text-sm text-muted-foreground">
                Может взять проект до 100 м²
              </div>
            </div>

            <div className="bg-[#F1F0EF] rounded-xl border border-border p-6">
              <h4 className="mb-2" style={{ fontWeight: 600 }}>Работы в вашем ЖК</h4>
              <p className="text-sm text-[#737373] mb-2">
                Этот подрядчик выполнил 12 проектов в ЖК «Ривьера Парк»
              </p>
              <button
                onClick={() => toast.info("Портфолио работ в вашем ЖК")}
                className="text-sm text-[#FA5108] flex items-center gap-1 hover:underline"
                style={{ fontWeight: 500 }}
              >
                Посмотреть работы <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral modal */}
      {showReferralModal && (
        <ReferralModal
          contractorId={contractorId}
          contractorName="СтройМастер Про"
          rewardMin={reward.rewardMin}
          rewardMax={reward.rewardMax}
          percent={reward.percent}
          onClose={() => setShowReferralModal(false)}
        />
      )}
    </div>
  );
}