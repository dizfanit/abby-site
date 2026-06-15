import { useState } from "react";
import { Link } from "react-router";
import {
  Search, MapPin, Star, Briefcase, Clock, DollarSign, Filter, ArrowRight,
  Building2, ShieldCheck, Users, Zap, Hammer, Paintbrush, Wrench,
  ChevronDown, CheckCircle2, MessageSquare, BadgeCheck, GraduationCap,
  Heart, TrendingUp, ToggleLeft, ToggleRight, Package, AlertCircle,
  Phone, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAccount } from "./AccountContext";

type JobType = "all" | "permanent" | "vahta" | "season";

const jobTypes: { id: JobType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "permanent", label: "Постоянная" },
  { id: "vahta", label: "Вахта" },
  { id: "season", label: "Проект / Сезон" },
];

const specializations = [
  "Штукатур", "Маляр", "Электрик", "Сантехник", "Плиточник",
  "Монолитчик", "Прораб", "Сварщик", "Каменщик", "Отделочник",
];

const vacancies = [
  {
    id: "v1",
    title: "Штукатур-маляр",
    company: "ГК «Стройинвест»",
    companyRating: 4.5,
    companyProjects: 12,
    salary: "80 000 — 120 000",
    location: "Калининград, ЖК «Речной»",
    type: "vahta" as JobType,
    schedule: "Вахта 45/15",
    perks: ["Проживание", "Питание", "Проезд"],
    workersOnAbby: 3,
    review: { name: "Игорь К.", text: "Платят вовремя, условия хорошие", rating: 5 },
    icon: Paintbrush,
    color: "#8B5CF6",
    hot: true,
  },
  {
    id: "v2",
    title: "Электромонтажник",
    company: "ООО «ЭлектроПро»",
    companyRating: 4.8,
    companyProjects: 7,
    salary: "90 000 — 140 000",
    location: "Калининград",
    type: "permanent" as JobType,
    schedule: "Полный день",
    perks: ["Белая зарплата", "ДМС", "Инструмент"],
    workersOnAbby: 5,
    review: { name: "Дмитрий С.", text: "Отличный коллектив, есть рост", rating: 5 },
    icon: Zap,
    color: "#F59E0B",
    hot: false,
  },
  {
    id: "v3",
    title: "Плиточник",
    company: "РемонтПро39",
    companyRating: 4.9,
    companyProjects: 15,
    salary: "100 000 — 160 000",
    location: "Калининград, ЖК «Парковый»",
    type: "season" as JobType,
    schedule: "Сезон · 4 месяца",
    perks: ["Белая зарплата", "Инструмент", "Спецодежда"],
    workersOnAbby: 2,
    review: { name: "Алексей М.", text: "Хороший объём, адекватный прораб", rating: 4 },
    icon: Hammer,
    color: "#EF4444",
    hot: true,
  },
  {
    id: "v4",
    title: "Прораб",
    company: "ГК «Развитие»",
    companyRating: 4.3,
    companyProjects: 9,
    salary: "120 000 — 180 000",
    location: "Калининград",
    type: "permanent" as JobType,
    schedule: "Полный день · 5/2",
    perks: ["Белая зарплата", "ДМС", "Авто", "КПИ-бонус"],
    workersOnAbby: 8,
    review: { name: "Сергей П.", text: "Серьёзная компания, стабильно", rating: 5 },
    icon: Building2,
    color: "#3B82F6",
    hot: false,
  },
  {
    id: "v5",
    title: "Сварщик НАКС",
    company: "МеталлСтрой",
    companyRating: 4.6,
    companyProjects: 5,
    salary: "150 000 — 200 000",
    location: "Калининградская обл.",
    type: "vahta" as JobType,
    schedule: "Вахта 60/30",
    perks: ["Проживание", "Питание", "Проезд", "Спецодежда"],
    workersOnAbby: 4,
    review: { name: "Иван Р.", text: "Платят хорошо, вахта удобная", rating: 5 },
    icon: Wrench,
    color: "#10B981",
    hot: true,
  },
];

export function JobsPage() {
  const { userRole, isLoggedIn } = useAccount();
  const isContractor = isLoggedIn && (userRole === "contractor" || userRole === "construction");

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<JobType>("all");
  const [activeSpec, setActiveSpec] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  // Contractor status toggle
  const [takingOrders, setTakingOrders] = useState(true);

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast("Удалено из сохранённых"); }
      else { next.add(id); toast.success("Вакансия сохранена"); }
      return next;
    });
  };

  const filtered = vacancies.filter((v) => {
    if (activeType !== "all" && v.type !== activeType) return false;
    if (activeSpec && !v.title.toLowerCase().includes(activeSpec.toLowerCase())) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Mock customer orders for contractors
  const customerOrders = [
    { id: "co1", title: "Ремонт квартиры под ключ", area: "72 м²", budget: "от 650 000 ₽", location: "Калининград, ул. Победы", client: "Иван М.", urgent: true, category: "Ремонт" },
    { id: "co2", title: "Штукатурка и покраска стен", area: "45 м²", budget: "от 85 000 ₽", location: "Калининград, пр. Мира", client: "Ольга К.", urgent: false, category: "Отделка" },
    { id: "co3", title: "Замена сантехники в ванной", area: "—", budget: "до 40 000 ₽", location: "Калининград, ул. Лесная", client: "Дмитрий Р.", urgent: true, category: "Сантехника" },
    { id: "co4", title: "Укладка плитки на кухне и в ванной", area: "28 м²", budget: "от 55 000 ₽", location: "Калининград, ЖК «Речной»", client: "Светлана П.", urgent: false, category: "Полы/плитка" },
    { id: "co5", title: "Монтаж электропроводки в новостройке", area: "90 м²", budget: "от 120 000 ₽", location: "Калининград, ЖК «Солнечный»", client: "Агентство «СтройДом»", urgent: false, category: "Электрика" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Contractor status banner ─────────────────────────────────── */}
        {isContractor && (
          <div className={`mb-6 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all ${
            takingOrders
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${takingOrders ? "bg-green-100" : "bg-red-100"}`}>
                <Hammer className={`w-5 h-5 ${takingOrders ? "text-green-600" : "text-red-500"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>
                    {takingOrders ? "Беру заказы" : "Не беру заказы"}
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] rounded-full ${takingOrders ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`} style={{ fontWeight: 600 }}>
                    {takingOrders ? "Видимый" : "Скрытый"}
                  </span>
                </div>
                <p className="text-xs text-[#737373] mt-0.5">
                  {takingOrders
                    ? "Вы отображаетесь в каталоге подрядчиков и получаете заказы от клиентов"
                    : "Вы скрыты из каталога — клиенты не видят ваш профиль и не могут написать вам"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !takingOrders;
                setTakingOrders(next);
                toast[next ? "success" : "error"](
                  next ? "Вы снова принимаете заказы" : "Вы больше не принимаете заказы",
                  { description: next ? "Профиль снова виден клиентам" : "Профиль скрыт из каталога" }
                );
              }}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm transition-all shrink-0 ${
                takingOrders
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              style={{ fontWeight: 600 }}
            >
              {takingOrders ? "Не беру заказы" : "Беру заказы"}
            </button>
          </div>
        )}

        {/* ── If contractor taking orders → show customer orders ────────── */}
        {isContractor && takingOrders && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[#212121]" style={{ fontWeight: 700 }}>Заказы от клиентов</h2>
                <p className="text-xs text-[#737373] mt-0.5">Клиенты ищут подрядчика прямо сейчас</p>
              </div>
              <span className="px-2.5 py-1 bg-[#FA5108] text-white text-xs rounded-full" style={{ fontWeight: 600 }}>
                {customerOrders.length} новых
              </span>
            </div>
            <div className="space-y-3">
              {customerOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#E8E6E3] p-4 hover:shadow-md hover:border-[#FA5108]/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>{order.title}</span>
                        {order.urgent && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[11px] rounded-full" style={{ fontWeight: 600 }}>
                            Срочно
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-[#F1F0EF] text-[#737373] text-[11px] rounded-full">
                          {order.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#737373] mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.location}</span>
                        {order.area !== "—" && <span>📐 {order.area}</span>}
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {order.client}</span>
                      </div>
                      <div className="text-[#FA5108]" style={{ fontWeight: 700 }}>{order.budget}</div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => toast.success("Отклик отправлен!", { description: "Клиент получит уведомление" })}
                        className="px-4 py-2 bg-[#FA5108] text-white rounded-xl text-xs hover:bg-[#e04a07] transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Откликнуться
                      </button>
                      <button
                        onClick={() => toast.info("Написать клиенту")}
                        className="px-4 py-2 border border-[#E8E6E3] text-[#737373] rounded-xl text-xs hover:bg-[#F1F0EF] transition-colors"
                      >
                        Написать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#F1F0EF]">
              <h3 className="text-sm text-[#212121] mb-3" style={{ fontWeight: 600 }}>Вакансии и работа</h3>
            </div>
          </div>
        )}

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FA5108, #FF753A)" }}>
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-[#212121]" style={{ fontWeight: 700 }}>ABBY Работа</h1>
            <p className="text-xs text-[#737373]">Вакансии в строительстве, ремонте и недвижимости</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center bg-[#F5F5F5] rounded-full overflow-hidden h-11">
            <Search className="w-4 h-4 text-[#737373] ml-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Должность, специальность, компания..."
              className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none text-[#212121] placeholder:text-[#737373]"
            />
            <button
              onClick={() => toast.success("Поиск вакансий...")}
              className="h-full px-5 text-white text-xs rounded-full shrink-0"
              style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)" }}
            >
              Найти
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs border border-[#E8E6E3] text-[#212121] hover:border-[#FA5108]/30">
            <MapPin className="w-3.5 h-3.5" /> Калининград <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs border border-[#E8E6E3] text-[#212121] hover:border-[#FA5108]/30">
            <DollarSign className="w-3.5 h-3.5" /> от ___ ₽ <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs border border-[#E8E6E3] text-[#212121] hover:border-[#FA5108]/30">
            <Filter className="w-3.5 h-3.5" /> Специализация <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Job type tabs */}
        <div className="flex gap-1.5 mb-4 p-1 bg-[#F5F5F5] rounded-full w-fit">
          {jobTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                activeType === t.id
                  ? "bg-[#212121] text-white shadow-sm"
                  : "text-[#737373] hover:text-[#212121]"
              }`}
              style={{ fontWeight: activeType === t.id ? 600 : 400 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Specialization chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {specializations.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSpec(activeSpec === s ? null : s)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                activeSpec === s
                  ? "bg-[#FA5108] text-white border-[#FA5108]"
                  : "border-[#E8E6E3] text-[#212121] hover:border-[#FA5108]/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Master profile hint */}
        <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>У вас профиль мастера с рейтингом 4.8</div>
            <div className="text-xs text-[#737373] mt-0.5">12 компаний ищут специалистов с вашими навыками прямо сейчас</div>
          </div>
          <button
            onClick={() => toast.info("Показываем подходящие вакансии")}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs shrink-0 hover:bg-blue-600 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Посмотреть
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vacancies list */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base text-[#212121]" style={{ fontWeight: 600 }}>
                {filtered.length} вакансий найдено
              </h2>
            </div>

            {filtered.map((v) => {
              const VIcon = v.icon;
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-[#E8E6E3] p-4 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => toast.info(`${v.title} в ${v.company}: подробности вакансии`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${v.color}15` }}>
                      <VIcon className="w-5 h-5" style={{ color: v.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[#212121] group-hover:text-[#FA5108] transition-colors" style={{ fontWeight: 600 }}>{v.title}</span>
                        {v.hot && (
                          <span className="px-1.5 py-0.5 bg-[#FA5108] text-white text-[10px] rounded" style={{ fontWeight: 700 }}>Горячая</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#212121]" style={{ fontWeight: 500 }}>{v.company}</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{v.companyRating}
                        </span>
                        <span className="text-[10px] text-[#737373]">· {v.companyProjects} объектов на ABBY</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-xs text-[#212121]" style={{ fontWeight: 600 }}>
                          <DollarSign className="w-3.5 h-3.5 text-green-600" />{v.salary} ₽/мес
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#737373]">
                          <MapPin className="w-3.5 h-3.5" />{v.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#737373]">
                          <Clock className="w-3.5 h-3.5" />{v.schedule}
                        </span>
                      </div>

                      {/* Perks */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {v.perks.map((perk) => (
                          <span key={perk} className="flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded-full">
                            <CheckCircle2 className="w-3 h-3" />{perk}
                          </span>
                        ))}
                      </div>

                      {/* Social proof */}
                      <div className="mt-2.5 flex items-start gap-2 p-2 bg-[#F9F9F8] rounded-lg">
                        <Users className="w-3.5 h-3.5 text-[#737373] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#737373]">{v.workersOnAbby} чел. уже работают через ABBY</div>
                          <div className="text-[10px] text-[#212121] mt-0.5 italic">
                            "{v.review.text}" — {v.review.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toast.success("Отклик отправлен!", { description: "Ваш профиль мастера отправлен как резюме" }); }}
                        className="px-4 py-2 rounded-lg text-xs text-white"
                        style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)", fontWeight: 600 }}
                      >
                        Откликнуться
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(v.id); }}
                        className={`px-4 py-2 rounded-lg text-xs border transition-colors ${
                          savedJobs.has(v.id) ? "border-[#FA5108] text-[#FA5108]" : "border-[#E8E6E3] text-[#737373] hover:border-[#FA5108]/30"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 inline mr-1 ${savedJobs.has(v.id) ? "fill-[#FA5108]" : ""}`} />
                        {savedJobs.has(v.id) ? "Сохранено" : "Сохранить"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#737373]">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-[#E8E6E3]" />
                <div className="text-sm">Вакансий по вашим фильтрам не найдено</div>
                <button onClick={() => { setActiveType("all"); setActiveSpec(null); setSearch(""); }} className="text-xs text-[#FA5108] mt-2 hover:underline">
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Your profile as resume */}
            <div className="rounded-xl border border-[#E8E6E3] p-4">
              <h3 className="text-sm text-[#212121] mb-3" style={{ fontWeight: 600 }}>Ваш профиль как резюме</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#F1F0EF] flex items-center justify-center">
                  <span className="text-lg">👷</span>
                </div>
                <div>
                  <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>Александр Петров</div>
                  <div className="text-xs text-[#737373]">Штукатур-маляр · Отделочник</div>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#737373]">Рейтинг</span>
                  <span className="flex items-center gap-1 text-[#212121]" style={{ fontWeight: 600 }}>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />4.8
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#737373]">Проекты</span>
                  <span className="text-[#212121]" style={{ fontWeight: 600 }}>89</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#737373]">В срок</span>
                  <span className="text-green-600" style={{ fontWeight: 600 }}>97%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#737373]">Споры</span>
                  <span className="text-green-600" style={{ fontWeight: 600 }}>0</span>
                </div>
              </div>
              <div className="flex gap-1.5 p-1 bg-[#F5F5F5] rounded-lg mb-3">
                <button className="flex-1 py-1.5 bg-[#212121] text-white rounded-md text-[10px]" style={{ fontWeight: 600 }}>
                  Беру заказы
                </button>
                <button
                  onClick={() => toast.success("Режим «Ищу работу» активирован")}
                  className="flex-1 py-1.5 text-[#737373] rounded-md text-[10px] hover:bg-white transition-colors"
                >
                  Ищу работу
                </button>
              </div>
              <Link to="/profile" className="text-xs text-[#FA5108] hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
                Редактировать профиль <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Skills bar chart */}
            <div className="rounded-xl border border-[#E8E6E3] p-4">
              <h3 className="text-sm text-[#212121] mb-3" style={{ fontWeight: 600 }}>Навыки (подтверждены проектами)</h3>
              <div className="space-y-2.5">
                {[
                  { skill: "Штукатурка машинная", projects: 47, pct: 100 },
                  { skill: "Шпаклёвка", projects: 38, pct: 80 },
                  { skill: "Покраска", projects: 31, pct: 65 },
                  { skill: "Плиточные работы", projects: 18, pct: 38 },
                ].map((s) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-[#212121]">{s.skill}</span>
                      <span className="text-[#737373]">{s.projects} пр.</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F0EF] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FA5108] rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick hire CTA */}
            <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #FA5108 0%, #FF753A 100%)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm" style={{ fontWeight: 700 }}>Нужны люди срочно?</span>
              </div>
              <p className="text-xs text-white/70 mb-3">847 специалистов доступны в вашем регионе</p>
              <button
                onClick={() => toast.info("Создание срочной вакансии")}
                className="w-full py-2 bg-white text-[#FA5108] rounded-lg text-xs hover:bg-white/90 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Разместить срочную вакансию
              </button>
            </div>

            {/* Courses */}
            <div className="rounded-xl border border-[#E8E6E3] p-4">
              <h3 className="text-sm text-[#212121] mb-3" style={{ fontWeight: 600 }}>
                <GraduationCap className="w-4 h-4 inline mr-1.5 text-[#FA5108]" />
                Повысить квалификацию
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Работа на высоте", badge: "Допуск", price: "2 900 ₽" },
                  { name: "Knauf — сертификация", badge: "Бренд", price: "Бесплатно" },
                  { name: "Электробезопасность", badge: "Допуск", price: "3 500 ₽" },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => toast.info(`Курс: ${c.name}`)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#F1F0EF] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FA5108]/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-[#FA5108]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[#212121]" style={{ fontWeight: 500 }}>{c.name}</div>
                      <div className="text-[10px] text-[#737373]">{c.badge} · {c.price}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#737373]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}