import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Star,
  ShieldCheck,
  MapPin,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  Hammer,
  Package,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
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

const IMG_CONTRACTOR = "/remote-images/unsplash-017.jpg";

const categories = [
  { id: "all", label: "Все", icon: Wrench },
  { id: "renovation", label: "Ремонт под ключ", icon: Hammer },
  { id: "plumbing", label: "Сантехника", icon: Droplets },
  { id: "electrical", label: "Электрика", icon: Zap },
  { id: "painting", label: "Отделка", icon: Paintbrush },
  { id: "turnkey", label: "Под ключ", icon: Package },
];

const contractors = [
  {
    id: "1",
    name: "СтройМастер Про",
    specialty: "Ремонт под ключ",
    category: "renovation",
    rating: 4.9,
    reviews: 156,
    projects: 89,
    verified: true,
    price: "от 8 500 ₽/м²",
    location: "Москва",
    available: true,
    badges: ["Топ-10", "СРО"],
    avatar: "СМ",
    rewardMin: 21000,
    rewardMax: 42000,
    rewardPercent: 5,
  },
  {
    id: "2",
    name: "АкваСервис",
    specialty: "Сантехника и водоснабжение",
    category: "plumbing",
    rating: 4.7,
    reviews: 98,
    projects: 234,
    verified: true,
    price: "от 2 000 ₽/час",
    location: "Москва",
    available: true,
    badges: ["Допуск"],
    avatar: "АС",
    rewardMin: 8000,
    rewardMax: 16000,
    rewardPercent: 5,
  },
  {
    id: "3",
    name: "ЭлектроМонтаж+",
    specialty: "Электромонтажные работы",
    category: "electrical",
    rating: 4.8,
    reviews: 73,
    projects: 145,
    verified: true,
    price: "от 1 500 ₽/точка",
    location: "Москва, МО",
    available: false,
    badges: ["Допуск", "EAC"],
    avatar: "ЭМ",
    rewardMin: 6000,
    rewardMax: 12000,
    rewardPercent: 4,
  },
  {
    id: "4",
    name: "Домашний Комфорт",
    specialty: "Комплексный ремонт квартир",
    category: "turnkey",
    rating: 4.6,
    reviews: 45,
    projects: 32,
    verified: true,
    price: "от 12 000 ₽/м²",
    location: "Санкт-Петербург",
    available: true,
    badges: ["Гарантия 3 года"],
    avatar: "ДК",
    rewardMin: 30000,
    rewardMax: 60000,
    rewardPercent: 5,
  },
  {
    id: "5",
    name: "МастерОтделки",
    specialty: "Штукатурка, покраска, плитка",
    category: "painting",
    rating: 4.5,
    reviews: 112,
    projects: 178,
    verified: false,
    price: "от 800 ₽/м²",
    location: "Москва",
    available: true,
    badges: [],
    avatar: "МО",
    rewardMin: 4000,
    rewardMax: 9000,
    rewardPercent: 4,
  },
  {
    id: "6",
    name: "РемСтрой Групп",
    specialty: "Капитальный ремонт",
    category: "renovation",
    rating: 4.8,
    reviews: 67,
    projects: 54,
    verified: true,
    price: "от 10 000 ₽/м²",
    location: "Москва",
    available: true,
    badges: ["СРО", "ISO"],
    avatar: "РГ",
    rewardMin: 25000,
    rewardMax: 50000,
    rewardPercent: 5,
  },
];

const packages = [
  {
    title: "Косметический ремонт",
    price: "от 5 500 ₽/м²",
    duration: "от 14 дней",
    includes: ["Выравнивание стен", "Покраска", "Укладка ламината", "Установка плинтусов"],
  },
  {
    title: "Стандартный ремонт",
    price: "от 8 500 ₽/м²",
    duration: "от 30 дней",
    includes: ["Электрика", "Сантехника", "Плитка", "Покраска", "Полы", "Двери"],
  },
  {
    title: "Под ключ Премиум",
    price: "от 15 000 ₽/м²",
    duration: "от 60 дней",
    includes: ["Дизайн-проект", "Все виды работ", "Мебель под заказ", "Авторский надзор"],
  },
];

const MOCK_REFERRER_ID = "usr_alex_8f2k";

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(".", ",")} млн ₽`;
  if (n >= 1000) return `${Math.round(n / 1000)} тыс. ₽`;
  return `${n} ₽`;
}

// Mini referral modal for catalog
function ReferralQuickModal({
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
      description: `Вознаграждение: ${formatMoney(rewardMin)} — ${formatMoney(rewardMax)}`,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F0EF]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FA5108]/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-[#FA5108]" />
              </div>
              <div>
                <div style={{ fontWeight: 700 }} className="text-[#212121] text-sm">Реферальная ссылка</div>
                <div className="text-[11px] text-[#737373]">{contractorName}</div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#F1F0EF] transition-colors">
              <X className="w-4 h-4 text-[#737373]" />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <div className="bg-[#FFF5F0] border border-[#FA5108]/20 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Handshake className="w-3.5 h-3.5 text-[#FA5108]" />
                <span style={{ fontWeight: 600 }} className="text-xs text-[#FA5108]">Ваше вознаграждение</span>
              </div>
              <div className="text-xl text-[#212121]" style={{ fontWeight: 700 }}>
                {formatMoney(rewardMin)} — {formatMoney(rewardMax)}
              </div>
              <div className="text-[11px] text-[#737373] mt-0.5">
                {percent}% от стоимости сделки
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#FA5108]/70">
                <TrendingUp className="w-3 h-3" /> Выплата после закрытия сделки
              </div>
            </div>

            <div className="space-y-1.5">
              {[
                "Скопируйте ссылку и отправьте клиенту",
                "Клиент оформляет заказ",
                "Вы получаете вознагра��дение",
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#212121] text-white text-[10px] flex items-center justify-center shrink-0" style={{ fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <span className="text-xs text-[#737373]">{s}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-[#F1F0EF] rounded-xl border border-[#E8E6E3]">
              <span className="flex-1 text-[11px] text-[#212121] truncate font-mono">{refLink}</span>
              <button
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all ${copied ? "bg-green-500 text-white" : "bg-[#FA5108] text-white hover:bg-[#e04a07]"}`}
                style={{ fontWeight: 600 }}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "OK" : "Копировать"}
              </button>
            </div>

            <div className="flex items-start gap-1.5 text-[11px] text-[#737373]">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              Ссылка привязана к вашему аккаунту. Переходы видны в личном кабинете.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ServicesCatalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [referralTarget, setReferralTarget] = useState<typeof contractors[0] | null>(null);
  const { accountType } = useAccount();
  const isAgent = accountType === "business";

  const filtered = contractors.filter((c) => {
    if (activeCategory !== "all" && c.category !== activeCategory) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2" style={{ fontWeight: 700 }}>Строительные услуги</h1>
        <p className="text-muted-foreground">
          Верифицированные подрядчики с реальными отзывами и портфолио
        </p>
      </div>

      {/* Package offers (2.6) */}
      <div className="mb-10">
        <h2 className="text-xl mb-4" style={{ fontWeight: 600 }}>Пакетные решения</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <h3 style={{ fontWeight: 600 }} className="mb-1">{pkg.title}</h3>
              <div className="text-2xl text-primary mb-1" style={{ fontWeight: 700 }}>{pkg.price}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <Clock className="w-4 h-4" /> {pkg.duration}
              </div>
              <ul className="space-y-1.5 mb-4">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/calculator"
                className="text-sm text-[#FA5108] flex items-center gap-1 hover:underline"
                style={{ fontWeight: 500 }}
              >
                Рассчитать стоимость <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeCategory === cat.id
                ? "bg-[#212121] text-white"
                : "bg-white border border-border text-[#212121] hover:bg-[#F1F0EF]"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Найти подрядчика..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Contractors list */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div key={c.id} className="relative">
            <Link
              to={`/contractor/${c.id}`}
              className="flex flex-col sm:flex-row items-start gap-4 bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl shrink-0"
                style={{ fontWeight: 700 }}>
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 style={{ fontWeight: 600 }}>{c.name}</h3>
                      {c.verified && (
                        <ShieldCheck className="w-4 h-4 text-[#FA5108]" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{c.specialty}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg text-foreground" style={{ fontWeight: 700 }}>{c.price}</div>
                    {isAgent && (
                      <div className="text-xs text-[#FA5108] mt-0.5" style={{ fontWeight: 500 }}>
                        Возн.: {formatMoney(c.rewardMin)}–{formatMoney(c.rewardMax)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" /> {c.rating}
                  </span>
                  <span>{c.reviews} отзывов</span>
                  <span>{c.projects} проектов</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.location}</span>
                  {c.available ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" /> Дос��упен
                    </span>
                  ) : (
                    <span className="text-orange-500 flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" /> Занят до марта
                    </span>
                  )}
                </div>
                {c.badges.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {c.badges.map((b) => (
                      <span key={b} className="flex items-center gap-1 px-2 py-0.5 bg-[#FA5108]/10 text-[#FA5108] text-xs rounded">
                        <Award className="w-3 h-3" /> {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors self-center hidden sm:block" />
            </Link>

            {/* Referral button overlay — agents only */}
            {isAgent && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setReferralTarget(c);
                }}
                className="absolute bottom-4 right-14 sm:right-16 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[#FA5108]/30 text-[#FA5108] bg-white hover:bg-[#FA5108] hover:text-white transition-all shadow-sm"
                style={{ fontWeight: 600 }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Рекомендовать
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Referral modal */}
      {referralTarget && (
        <ReferralQuickModal
          contractorId={referralTarget.id}
          contractorName={referralTarget.name}
          rewardMin={referralTarget.rewardMin}
          rewardMax={referralTarget.rewardMax}
          percent={referralTarget.rewardPercent}
          onClose={() => setReferralTarget(null)}
        />
      )}
    </div>
  );
}