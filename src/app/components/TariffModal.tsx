import { useState } from "react";
import { X, Check, Zap, Star, Crown, Building2, Users, Briefcase, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AccountType } from "./AccountContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TariffFeature {
  text: string;
  included: boolean;
}

interface Tariff {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  priceMonth: number | null; // null = по запросу
  priceYear: number | null;
  description: string;
  Icon: React.FC<{ className?: string }>;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  features: TariffFeature[];
  popular?: boolean;
}

// ─── Individual tariffs ───────────────────────────────────────────────────────
const individualTariffs: Tariff[] = [
  {
    id: "individual_free",
    name: "Базовый",
    priceMonth: 0,
    priceYear: 0,
    description: "Для частных сделок без лишних затрат",
    Icon: ({ className }) => <Zap className={className} />,
    accentColor: "text-[#737373]",
    accentBg: "bg-[#F8F7F5]",
    accentBorder: "border-[#E8E6E3]",
    features: [
      { text: "3 объявления одновременно", included: true },
      { text: "Сохранение в избранном", included: true },
      { text: "Базовый поиск и фильтры", included: true },
      { text: "Приоритет в выдаче", included: false },
      { text: "Скрытие рекламы", included: false },
      { text: "Расширенная статистика", included: false },
    ],
  },
  {
    id: "individual_standard",
    name: "Стандарт",
    priceMonth: 690,
    priceYear: 490,
    description: "Для активных покупателей и арендаторов",
    Icon: ({ className }) => <Star className={className} />,
    accentColor: "text-[#FA5108]",
    accentBg: "bg-[#FA5108]/5",
    accentBorder: "border-[#FA5108]/30",
    popular: true,
    features: [
      { text: "20 объявлений одновременно", included: true },
      { text: "Сохранение в избранном", included: true },
      { text: "Расширенный поиск и фильтры", included: true },
      { text: "Приоритет в выдаче", included: true },
      { text: "Скрытие рекламы", included: true },
      { text: "Расширенная статистика", included: false },
    ],
  },
  {
    id: "individual_premium",
    name: "Премиум",
    priceMonth: 1490,
    priceYear: 990,
    description: "Максимальные возможности для серьёзных сделок",
    Icon: ({ className }) => <Crown className={className} />,
    accentColor: "text-yellow-600",
    accentBg: "bg-yellow-50",
    accentBorder: "border-yellow-300",
    features: [
      { text: "Неограниченные объявления", included: true },
      { text: "Сохранение в избранном", included: true },
      { text: "Расширенный поиск и фильтры", included: true },
      { text: "Топ позиции в выдаче", included: true },
      { text: "Скрытие рекламы", included: true },
      { text: "Расширенная статистика просмотров", included: true },
    ],
  },
];

// ─── Agent / Business tariffs ─────────────────────────────────────────────────
const agentTariffs: Tariff[] = [
  {
    id: "agent_start",
    name: "Старт",
    priceMonth: 1990,
    priceYear: 1490,
    description: "Для начинающих агентов и небольших команд",
    Icon: ({ className }) => <Briefcase className={className} />,
    accentColor: "text-[#737373]",
    accentBg: "bg-[#F8F7F5]",
    accentBorder: "border-[#E8E6E3]",
    features: [
      { text: "25 активных объявлений", included: true },
      { text: "Базовая CRM (до 50 клиентов)", included: true },
      { text: "Статистика по объявлениям", included: true },
      { text: "Рекомендации в каталоге", included: false },
      { text: "Аналитика рынка", included: false },
      { text: "Несколько агентов", included: false },
      { text: "API-интеграция", included: false },
    ],
  },
  {
    id: "agent_pro",
    name: "Профессионал",
    priceMonth: 5990,
    priceYear: 4490,
    description: "Для опытных агентов с активной клиентской базой",
    Icon: ({ className }) => <Star className={className} />,
    accentColor: "text-[#FA5108]",
    accentBg: "bg-[#FA5108]/5",
    accentBorder: "border-[#FA5108]/30",
    popular: true,
    features: [
      { text: "100 активных объявлений", included: true },
      { text: "Полная CRM (без ограничений)", included: true },
      { text: "Расширенная статистика", included: true },
      { text: "Рекомендации в каталоге", included: true },
      { text: "Аналитика рынка и конкурентов", included: true },
      { text: "Несколько агентов", included: false },
      { text: "API-интеграция", included: false },
    ],
  },
  {
    id: "agent_agency",
    name: "Агентство",
    priceMonth: 12990,
    priceYear: 9990,
    description: "Для агентств с командой и объёмным портфелем",
    Icon: ({ className }) => <Users className={className} />,
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-300",
    features: [
      { text: "Неограниченные объявления", included: true },
      { text: "Полная CRM + воронка сделок", included: true },
      { text: "Расширенная статистика", included: true },
      { text: "Топ-рекомендации в каталоге", included: true },
      { text: "Аналитика рынка и конкурентов", included: true },
      { text: "До 5 агентов в аккаунте", included: true },
      { text: "API-интеграция", included: false },
    ],
  },
  {
    id: "agent_top",
    name: "Топ-Агент",
    priceMonth: 24990,
    priceYear: 19990,
    description: "Максимум для лидеров рынка недвижимости",
    Icon: ({ className }) => <Crown className={className} />,
    accentColor: "text-yellow-600",
    accentBg: "bg-yellow-50",
    accentBorder: "border-yellow-300",
    badge: "Всё включено",
    badgeColor: "bg-yellow-500",
    features: [
      { text: "Неограниченные объявления", included: true },
      { text: "Полная CRM + воронка сделок", included: true },
      { text: "Расширенная статистика + отчёты", included: true },
      { text: "Приоритет №1 в каталоге", included: true },
      { text: "Аналитика рынка и конкурентов", included: true },
      { text: "Неограниченное кол-во агентов", included: true },
      { text: "API-интеграция + Webhook", included: true },
    ],
  },
];

// ─── Developer tariffs ────────────────────────────────────────────────────────
const developerTariffs: Tariff[] = [
  {
    id: "dev_base",
    name: "Базовый",
    priceMonth: 4990,
    priceYear: 3990,
    description: "Старт на платформе: первые ЖК и лоты",
    Icon: ({ className }) => <Building2 className={className} />,
    accentColor: "text-[#737373]",
    accentBg: "bg-[#F8F7F5]",
    accentBorder: "border-[#E8E6E3]",
    features: [
      { text: "2 проекта / ЖК", included: true },
      { text: "До 50 лотов (квартир/офисов)", included: true },
      { text: "Шахматка планировок", included: true },
      { text: "Аналитика рынка", included: false },
      { text: "CRM покупателей", included: false },
      { text: "Партнёрская программа", included: false },
      { text: "API / интеграции", included: false },
    ],
  },
  {
    id: "dev_standard",
    name: "Застройщик",
    priceMonth: 14990,
    priceYear: 11990,
    description: "Для компаний с несколькими проектами",
    Icon: ({ className }) => <Star className={className} />,
    accentColor: "text-[#FA5108]",
    accentBg: "bg-[#FA5108]/5",
    accentBorder: "border-[#FA5108]/30",
    popular: true,
    features: [
      { text: "10 проектов / ЖК", included: true },
      { text: "До 500 лотов", included: true },
      { text: "Шахматка + ход строительства", included: true },
      { text: "Аналитика рынка (регион)", included: true },
      { text: "CRM покупателей (до 500 записей)", included: true },
      { text: "Партнёрская программа", included: false },
      { text: "API / интеграции", included: false },
    ],
  },
  {
    id: "dev_pro",
    name: "Девелопер",
    priceMonth: 34990,
    priceYear: 27990,
    description: "Для крупных девелоперов с широким портфелем",
    Icon: ({ className }) => <Users className={className} />,
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-300",
    features: [
      { text: "Неограниченные проекты", included: true },
      { text: "Неограниченное кол-во лотов", included: true },
      { text: "Шахматка + ход строительства", included: true },
      { text: "Полная аналитика рынка РФ", included: true },
      { text: "CRM без ограничений + воронка", included: true },
      { text: "Партнёрская программа (агенты)", included: true },
      { text: "API / REST + Webhook", included: false },
    ],
  },
  {
    id: "dev_corp",
    name: "Корпоративный",
    priceMonth: null,
    priceYear: null,
    description: "Индивидуальное решение для федеральных застройщиков",
    Icon: ({ className }) => <Crown className={className} />,
    accentColor: "text-purple-600",
    accentBg: "bg-purple-50",
    accentBorder: "border-purple-300",
    badge: "По запросу",
    badgeColor: "bg-purple-600",
    features: [
      { text: "Неограниченные проекты и лоты", included: true },
      { text: "White-label платформа", included: true },
      { text: "Шахматка + BIM-интеграция", included: true },
      { text: "Аналитика рынка + Big Data", included: true },
      { text: "CRM + ERP-интеграция", included: true },
      { text: "Расширенная партнёрская программа", included: true },
      { text: "Полное API + выделенный сервер", included: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TARIFFS_BY_TYPE: Record<AccountType, Tariff[]> = {
  individual: individualTariffs,
  business: agentTariffs,
  developer: developerTariffs,
};

const DEFAULT_PLAN: Record<AccountType, string> = {
  individual: "individual_free",
  business: "agent_start",
  developer: "dev_base",
};

function formatPrice(p: number | null, period: "month" | "year"): string {
  if (p === null) return "По запросу";
  if (p === 0) return "Бесплатно";
  return `${p.toLocaleString("ru-RU")} ₽/${period === "month" ? "мес" : "мес"}`;
}

function discount(monthly: number, yearly: number): number {
  return Math.round((1 - yearly / monthly) * 100);
}

// ─── Component ────────────────────────────────────────────────────────────────
interface TariffModalProps {
  accountType: AccountType;
  currentPlanId: string;
  onClose: () => void;
  onChangePlan: (planId: string, planName: string) => void;
}

export function TariffModal({ accountType, currentPlanId, onClose, onChangePlan }: TariffModalProps) {
  const tariffs = TARIFFS_BY_TYPE[accountType];
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [selected, setSelected] = useState<string>(currentPlanId);

  const handleConfirm = () => {
    const plan = tariffs.find(t => t.id === selected);
    if (!plan) return;
    if (selected === currentPlanId) {
      onClose();
      return;
    }
    onChangePlan(selected, plan.name);
    onClose();
  };

  const sectionTitle: Record<AccountType, string> = {
    individual: "Тарифы для физических лиц",
    business: "Тарифы для агентов и бизнеса",
    developer: "Тарифы для застройщиков",
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-[#F1F0EF]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[#212121]" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                {sectionTitle[accountType]}
              </h2>
              <p className="text-sm text-[#737373] mt-0.5">
                Выберите подходящий план. Сменить тариф можно в любое время.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#737373] hover:text-[#212121] hover:bg-[#F1F0EF] rounded-xl transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Period toggle */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex bg-[#F1F0EF] rounded-xl p-1 gap-1">
              <button
                onClick={() => setPeriod("month")}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                  period === "month" ? "bg-white text-[#212121] shadow-sm" : "text-[#737373]"
                }`}
                style={{ fontWeight: period === "month" ? 600 : 400 }}
              >
                Ежемесячно
              </button>
              <button
                onClick={() => setPeriod("year")}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                  period === "year" ? "bg-white text-[#212121] shadow-sm" : "text-[#737373]"
                }`}
                style={{ fontWeight: period === "year" ? 600 : 400 }}
              >
                Ежегодно
              </button>
            </div>
            {period === "year" && (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full" style={{ fontWeight: 600 }}>
                Экономия до 25%
              </span>
            )}
          </div>
        </div>

        {/* Tariff grid */}
        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ gridTemplateColumns: tariffs.length <= 3 ? `repeat(${tariffs.length}, minmax(0, 1fr))` : undefined }}>
          {tariffs.map((t) => {
            const isCurrent = t.id === currentPlanId;
            const isSelected = t.id === selected;
            const price = period === "month" ? t.priceMonth : t.priceYear;
            const monthlyPrice = t.priceMonth;
            const yearlyPrice = t.priceYear;

            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all flex flex-col ${
                  isSelected
                    ? `${t.accentBorder} ${t.accentBg}`
                    : "border-[#E8E6E3] hover:border-[#D4D2CF] hover:shadow-sm"
                }`}
              >
                {/* Popular / Badge */}
                {t.popular && !t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-[#FA5108] text-white text-[11px] rounded-full whitespace-nowrap" style={{ fontWeight: 600 }}>
                      Популярный
                    </span>
                  </div>
                )}
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 ${t.badgeColor} text-white text-[11px] rounded-full whitespace-nowrap`} style={{ fontWeight: 600 }}>
                      {t.badge}
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-[#212121] text-white text-[10px] rounded-full" style={{ fontWeight: 600 }}>
                      Текущий
                    </span>
                  </div>
                )}

                {/* Icon + Name */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isSelected ? t.accentBg : "bg-[#F1F0EF]"}`}>
                  <t.Icon className={`w-5 h-5 ${isSelected ? t.accentColor : "text-[#737373]"}`} />
                </div>
                <div className="text-[#212121] mb-0.5" style={{ fontWeight: 700 }}>{t.name}</div>
                <div className="text-xs text-[#737373] mb-4 leading-relaxed">{t.description}</div>

                {/* Price */}
                <div className="mb-1">
                  {price === null ? (
                    <div className="text-[#212121]" style={{ fontWeight: 700, fontSize: "1.1rem" }}>По запросу</div>
                  ) : price === 0 ? (
                    <div className="text-[#212121]" style={{ fontWeight: 700, fontSize: "1.1rem" }}>Бесплатно</div>
                  ) : (
                    <div>
                      <span className={`${t.accentColor}`} style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                        {price.toLocaleString("ru-RU")} ₽
                      </span>
                      <span className="text-xs text-[#737373]"> / мес</span>
                    </div>
                  )}
                </div>
                {period === "year" && monthlyPrice && yearlyPrice && monthlyPrice > 0 && (
                  <div className="text-xs text-green-600 mb-3" style={{ fontWeight: 500 }}>
                    Скидка {discount(monthlyPrice, yearlyPrice)}% · {(yearlyPrice * 12).toLocaleString("ru-RU")} ₽/год
                  </div>
                )}
                {period === "month" && price !== null && price > 0 && (
                  <div className="text-xs text-[#737373] mb-3">в месяц</div>
                )}
                {(price === 0 || price === null) && <div className="mb-3" />}

                {/* Features */}
                <div className="space-y-2 mt-auto">
                  {t.features.map((f) => (
                    <div key={f.text} className={`flex items-start gap-2 text-xs ${f.included ? "text-[#212121]" : "text-[#BBBBBB]"}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        f.included ? "bg-green-100" : "bg-[#F1F0EF]"
                      }`}>
                        {f.included
                          ? <Check className="w-2.5 h-2.5 text-green-600" />
                          : <X className="w-2.5 h-2.5 text-[#D4D2CF]" />}
                      </div>
                      <span className={f.included ? "" : "line-through"}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* Select indicator */}
                {isSelected && (
                  <div className={`mt-4 flex items-center gap-1.5 text-xs ${t.accentColor}`} style={{ fontWeight: 600 }}>
                    <Check className="w-3.5 h-3.5" /> Выбрано
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-4 border-t border-[#F1F0EF] pt-4">
          <p className="text-xs text-[#737373]">
            Тарифы указаны без НДС. Списание — в начале каждого расчётного периода.
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-[#E8E6E3] rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl text-white text-sm flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
            >
              {selected === currentPlanId ? "Закрыть" : "Подключить тариф"}
              {selected !== currentPlanId && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Export helpers for ProfilePage ──────────────────────────────────────────
export function getTariffName(accountType: AccountType, planId: string): string {
  const tariffs = TARIFFS_BY_TYPE[accountType];
  return tariffs.find(t => t.id === planId)?.name ?? "Базовый";
}

export function getTariffDesc(accountType: AccountType, planId: string): string {
  const tariffs = TARIFFS_BY_TYPE[accountType];
  return tariffs.find(t => t.id === planId)?.description ?? "";
}

export { DEFAULT_PLAN };
