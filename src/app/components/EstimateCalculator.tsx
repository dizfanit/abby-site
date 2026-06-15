import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Calculator,
  ArrowRight,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Hammer,
  Paintbrush,
  Droplets,
  Zap,
  Ruler,
  Package,
  Plus,
  X,
  Star,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface SubService {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  marketMin: number;
  marketMax: number;
  quantity: number;
  included: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  subServices: SubService[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "renovation",
    name: "Ремонт под ключ",
    icon: Hammer,
    description: "Полный комплекс работ от демонтажа до финишной отделки",
    subServices: [
      { id: "r1", name: "Демонтаж старых покрытий", unit: "м²", pricePerUnit: 350, marketMin: 200, marketMax: 500, quantity: 60, included: true },
      { id: "r2", name: "Вывоз строительного мусора", unit: "куб.м", pricePerUnit: 2500, marketMin: 1500, marketMax: 4000, quantity: 3, included: true },
      { id: "r3", name: "Выравнивание стен (штукатурка)", unit: "м²", pricePerUnit: 650, marketMin: 450, marketMax: 900, quantity: 120, included: true },
      { id: "r4", name: "Шпаклёвка стен под покраску", unit: "м²", pricePerUnit: 300, marketMin: 200, marketMax: 450, quantity: 120, included: true },
      { id: "r5", name: "Стяжка пола", unit: "м²", pricePerUnit: 550, marketMin: 350, marketMax: 800, quantity: 60, included: true },
      { id: "r6", name: "Устройство звукоизоляции", unit: "м²", pricePerUnit: 800, marketMin: 500, marketMax: 1200, quantity: 60, included: false },
    ],
  },
  {
    id: "finishing",
    name: "Отделка и покраска",
    icon: Paintbrush,
    description: "Финишные работы: покраска, обои, декоративная штукатурка",
    subServices: [
      { id: "f1", name: "Покраска стен (2 слоя)", unit: "м²", pricePerUnit: 250, marketMin: 150, marketMax: 400, quantity: 120, included: true },
      { id: "f2", name: "Поклейка обоев", unit: "м²", pricePerUnit: 350, marketMin: 200, marketMax: 550, quantity: 0, included: false },
      { id: "f3", name: "Декоративная штукатурка", unit: "м²", pricePerUnit: 1200, marketMin: 800, marketMax: 2000, quantity: 0, included: false },
      { id: "f4", name: "Укладка ламината", unit: "м²", pricePerUnit: 500, marketMin: 350, marketMax: 700, quantity: 60, included: true },
      { id: "f5", name: "Укладка плитки (пол)", unit: "м²", pricePerUnit: 1100, marketMin: 700, marketMax: 1600, quantity: 0, included: false },
      { id: "f6", name: "Натяжной потолок", unit: "м²", pricePerUnit: 450, marketMin: 300, marketMax: 700, quantity: 60, included: true },
      { id: "f7", name: "Монтаж плинтусов", unit: "п.м.", pricePerUnit: 150, marketMin: 80, marketMax: 250, quantity: 40, included: true },
    ],
  },
  {
    id: "plumbing",
    name: "Сантехника",
    icon: Droplets,
    description: "Водоснабжение, канализация, установка сантехники",
    subServices: [
      { id: "p1", name: "Разводка труб (водоснабжение)", unit: "точка", pricePerUnit: 3500, marketMin: 2000, marketMax: 5500, quantity: 5, included: true },
      { id: "p2", name: "Разводка канализации", unit: "точка", pricePerUnit: 3000, marketMin: 1800, marketMax: 4500, quantity: 3, included: true },
      { id: "p3", name: "Установка ванны", unit: "шт", pricePerUnit: 4000, marketMin: 2500, marketMax: 6000, quantity: 1, included: true },
      { id: "p4", name: "Установка раковины", unit: "шт", pricePerUnit: 2500, marketMin: 1500, marketMax: 4000, quantity: 2, included: true },
      { id: "p5", name: "Установка унитаза", unit: "шт", pricePerUnit: 3000, marketMin: 2000, marketMax: 5000, quantity: 1, included: true },
      { id: "p6", name: "Укладка плитки (ванная)", unit: "м²", pricePerUnit: 1200, marketMin: 800, marketMax: 1800, quantity: 15, included: true },
      { id: "p7", name: "Установка полотенцесушителя", unit: "шт", pricePerUnit: 3500, marketMin: 2000, marketMax: 5000, quantity: 1, included: false },
      { id: "p8", name: "Установка водонагревателя", unit: "шт", pricePerUnit: 4000, marketMin: 2500, marketMax: 6500, quantity: 0, included: false },
    ],
  },
  {
    id: "electrical",
    name: "Электрика",
    icon: Zap,
    description: "Электромонтаж, установка розеток, освещение",
    subServices: [
      { id: "e1", name: "Монтаж электроточки (розетка/выключатель)", unit: "точка", pricePerUnit: 1500, marketMin: 1000, marketMax: 2500, quantity: 20, included: true },
      { id: "e2", name: "Прокладка кабеля в штробе", unit: "п.м.", pricePerUnit: 200, marketMin: 120, marketMax: 350, quantity: 50, included: true },
      { id: "e3", name: "Установка светильников", unit: "шт", pricePerUnit: 800, marketMin: 400, marketMax: 1200, quantity: 10, included: true },
      { id: "e4", name: "Монтаж электрощита", unit: "шт", pricePerUnit: 8000, marketMin: 5000, marketMax: 15000, quantity: 1, included: true },
      { id: "e5", name: "Установка тёплого пола (электрического)", unit: "м²", pricePerUnit: 800, marketMin: 500, marketMax: 1200, quantity: 0, included: false },
      { id: "e6", name: "Умный дом (базовый комплект)", unit: "комп.", pricePerUnit: 25000, marketMin: 15000, marketMax: 45000, quantity: 0, included: false },
    ],
  },
  {
    id: "design",
    name: "Дизайн интерьера",
    icon: Ruler,
    description: "Дизайн-проект, 3D-визуализация, авторский надзор",
    subServices: [
      { id: "d1", name: "Обмерный план", unit: "м²", pricePerUnit: 200, marketMin: 100, marketMax: 400, quantity: 60, included: false },
      { id: "d2", name: "Дизайн-проект (полный)", unit: "м²", pricePerUnit: 2500, marketMin: 1500, marketMax: 5000, quantity: 60, included: false },
      { id: "d3", name: "3D-визуализация", unit: "вид", pricePerUnit: 5000, marketMin: 3000, marketMax: 10000, quantity: 3, included: false },
      { id: "d4", name: "Авторский надзор", unit: "мес", pricePerUnit: 30000, marketMin: 15000, marketMax: 50000, quantity: 2, included: false },
    ],
  },
  {
    id: "doors-windows",
    name: "Двери и окна",
    icon: Package,
    description: "Установка дверей, окон, остекление балконов",
    subServices: [
      { id: "dw1", name: "Установка межкомнатных дверей", unit: "шт", pricePerUnit: 3000, marketMin: 2000, marketMax: 5000, quantity: 4, included: false },
      { id: "dw2", name: "Установка входной двери", unit: "шт", pricePerUnit: 5000, marketMin: 3000, marketMax: 8000, quantity: 1, included: false },
      { id: "dw3", name: "Установка пластиковых окон", unit: "шт", pricePerUnit: 4500, marketMin: 2500, marketMax: 7000, quantity: 0, included: false },
      { id: "dw4", name: "Остекление балкона", unit: "шт", pricePerUnit: 25000, marketMin: 15000, marketMax: 45000, quantity: 0, included: false },
    ],
  },
];

const topContractors = [
  { id: "1", name: "СтройМастер Про", spec: "Ремонт под ключ", rating: 4.9, reviews: 156, price: "от 8 500 ₽/м²", avatar: "СМ" },
  { id: "2", name: "АкваСервис", spec: "Сантехника", rating: 4.7, reviews: 98, price: "от 2 000 ₽/час", avatar: "АС" },
  { id: "3", name: "ЭлектроМонтаж+", spec: "Электрика", rating: 4.8, reviews: 73, price: "от 1 500 ₽/точка", avatar: "ЭМ" },
];

export function EstimateCalculator() {
  const [area, setArea] = useState(60);
  const [categories, setCategories] = useState<ServiceCategory[]>(serviceCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["renovation", "finishing"]));

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const toggleSubService = (catId: string, subId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              subServices: c.subServices.map((s) =>
                s.id === subId ? { ...s, included: !s.included } : s
              ),
            }
          : c
      )
    );
  };

  const updateQuantity = (catId: string, subId: string, qty: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              subServices: c.subServices.map((s) =>
                s.id === subId ? { ...s, quantity: Math.max(0, qty) } : s
              ),
            }
          : c
      )
    );
  };

  const allIncludedServices = useMemo(
    () => categories.flatMap((c) => c.subServices.filter((s) => s.included)),
    [categories]
  );

  const totalCost = useMemo(
    () => allIncludedServices.reduce((sum, s) => sum + s.pricePerUnit * s.quantity, 0),
    [allIncludedServices]
  );

  const marketMinTotal = useMemo(
    () => allIncludedServices.reduce((sum, s) => sum + s.marketMin * s.quantity, 0),
    [allIncludedServices]
  );

  const marketMaxTotal = useMemo(
    () => allIncludedServices.reduce((sum, s) => sum + s.marketMax * s.quantity, 0),
    [allIncludedServices]
  );

  const costPerSqm = area > 0 ? Math.round(totalCost / area) : 0;

  const getBenchmarkStatus = (price: number, min: number, max: number) => {
    const mid = (min + max) / 2;
    if (price <= mid * 0.85) return "low";
    if (price >= mid * 1.15) return "high";
    return "normal";
  };

  const getCategoryTotal = (cat: ServiceCategory) =>
    cat.subServices.filter((s) => s.included).reduce((sum, s) => sum + s.pricePerUnit * s.quantity, 0);

  const getCategoryIncluded = (cat: ServiceCategory) =>
    cat.subServices.filter((s) => s.included).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-[#212121] mb-2" style={{ fontWeight: 700 }}>
          <Calculator className="w-8 h-8 inline mr-2 text-[#FA5108]" />
          Калькулятор сметы
        </h1>
        <p className="text-[#737373]">
          Выберите услуги, настройте объёмы — получите точную оценку стоимости с рыночными бенчмарками
        </p>
      </div>

      {/* Area input */}
      <div className="bg-white rounded-xl border border-[#E8E6E3] p-6 mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-[#737373] mb-1.5 block">Площадь (м²)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg"
              style={{ fontWeight: 600 }}
            />
          </div>
          <div>
            <label className="text-sm text-[#737373] mb-1.5 block">Тип помещения</label>
            <select className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg appearance-none">
              <option>Квартира</option>
              <option>Студия</option>
              <option>Дом / коттедж</option>
              <option>Офис</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[#737373] mb-1.5 block">Тип ремонта</label>
            <select className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg appearance-none">
              <option>Капитальный</option>
              <option>Косметический</option>
              <option>Под ключ</option>
              <option>Частичный</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service categories */}
        <div className="lg:col-span-2 space-y-4">
          {categories.map((cat) => {
            const isExpanded = expandedCategories.has(cat.id);
            const catTotal = getCategoryTotal(cat);
            const catIncluded = getCategoryIncluded(cat);
            const hasIncluded = catIncluded > 0;

            return (
              <div
                key={cat.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  hasIncluded ? "border-[#FA5108]/20" : "border-[#E8E6E3]"
                }`}
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCategoryExpand(cat.id)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-[#F1F0EF]/50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    hasIncluded ? "bg-[#FA5108]/10" : "bg-[#F1F0EF]"
                  }`}>
                    <cat.icon className={`w-5 h-5 ${hasIncluded ? "text-[#FA5108]" : "text-[#737373]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#212121]" style={{ fontWeight: 600 }}>{cat.name}</span>
                      {catIncluded > 0 && (
                        <span className="px-2 py-0.5 bg-[#FA5108]/10 text-[#FA5108] text-xs rounded">
                          {catIncluded} выбрано
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#737373] mt-0.5">{cat.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {catTotal > 0 && (
                      <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>
                        {catTotal.toLocaleString("ru")} ₽
                      </div>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#737373] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#737373] shrink-0" />
                  )}
                </button>

                {/* Sub-services */}
                {isExpanded && (
                  <div className="border-t border-[#E8E6E3] divide-y divide-[#E8E6E3]">
                    {cat.subServices.map((sub) => (
                      <div
                        key={sub.id}
                        className={`px-5 py-3.5 transition-colors ${
                          sub.included ? "bg-white" : "bg-[#F1F0EF]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleSubService(cat.id, sub.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                              sub.included
                                ? "bg-[#FA5108] border-[#FA5108]"
                                : "border-[#D4D2CF] hover:border-[#FA5108]/50"
                            }`}
                          >
                            {sub.included && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${sub.included ? "text-[#212121]" : "text-[#737373]"}`}>
                                {sub.name}
                              </span>
                              {sub.included && (
                                <span className="text-sm" style={{ fontWeight: 600 }}>
                                  {(sub.pricePerUnit * sub.quantity).toLocaleString("ru")} ₽
                                </span>
                              )}
                            </div>
                            {sub.included && (
                              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-[#737373]">Кол-во:</span>
                                  <input
                                    type="number"
                                    value={sub.quantity}
                                    onChange={(e) =>
                                      updateQuantity(cat.id, sub.id, Number(e.target.value))
                                    }
                                    className="w-16 px-2 py-1 bg-[#F1F0EF] rounded text-sm text-center"
                                  />
                                  <span className="text-xs text-[#737373]">{sub.unit}</span>
                                </div>
                                <div className="text-xs text-[#737373]">
                                  {sub.pricePerUnit.toLocaleString("ru")} ₽/{sub.unit}
                                </div>
                                <div className="flex items-center gap-1">
                                  {getBenchmarkStatus(sub.pricePerUnit, sub.marketMin, sub.marketMax) === "low" && (
                                    <span className="flex items-center gap-0.5 text-xs text-green-600">
                                      <TrendingDown className="w-3 h-3" /> Ниже рынка
                                    </span>
                                  )}
                                  {getBenchmarkStatus(sub.pricePerUnit, sub.marketMin, sub.marketMax) === "normal" && (
                                    <span className="flex items-center gap-0.5 text-xs text-blue-600">
                                      <Minus className="w-3 h-3" /> По рынку
                                    </span>
                                  )}
                                  {getBenchmarkStatus(sub.pricePerUnit, sub.marketMin, sub.marketMax) === "high" && (
                                    <span className="flex items-center gap-0.5 text-xs text-orange-500">
                                      <TrendingUp className="w-3 h-3" /> Выше рынка
                                    </span>
                                  )}
                                  <span className="text-xs text-[#737373]">
                                    ({sub.marketMin.toLocaleString("ru")}–{sub.marketMax.toLocaleString("ru")} ₽)
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
              <h3 className="mb-4" style={{ fontWeight: 600 }}>Итого</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Площадь</span>
                  <span style={{ fontWeight: 500 }}>{area} м²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Выбрано услуг</span>
                  <span style={{ fontWeight: 500 }}>{allIncludedServices.length}</span>
                </div>

                {/* Per category breakdown */}
                <div className="border-t border-[#E8E6E3] pt-3 space-y-2">
                  {categories
                    .filter((c) => getCategoryTotal(c) > 0)
                    .map((c) => (
                      <div key={c.id} className="flex justify-between text-sm">
                        <span className="text-[#737373] flex items-center gap-1.5">
                          <c.icon className="w-3.5 h-3.5" /> {c.name}
                        </span>
                        <span>{getCategoryTotal(c).toLocaleString("ru")} ₽</span>
                      </div>
                    ))}
                </div>

                <div className="border-t border-[#E8E6E3] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737373]">Стоимость за м²</span>
                    <span style={{ fontWeight: 600 }}>{costPerSqm.toLocaleString("ru")} ₽</span>
                  </div>
                </div>
                <div className="border-t border-[#E8E6E3] pt-3">
                  <div className="flex justify-between text-lg">
                    <span style={{ fontWeight: 600 }}>Итого</span>
                    <span className="text-[#FA5108]" style={{ fontWeight: 700 }}>
                      {totalCost.toLocaleString("ru")} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Market comparison */}
              <div className="mt-4 p-4 bg-[#FA5108]/5 rounded-lg border border-[#FA5108]/10">
                <div className="flex items-center gap-2 text-sm text-[#FA5108] mb-2" style={{ fontWeight: 500 }}>
                  <Info className="w-4 h-4" /> Рыночный диапазон
                </div>
                <div className="text-sm text-[#212121]">
                  {marketMinTotal.toLocaleString("ru")} — {marketMaxTotal.toLocaleString("ru")} ₽
                </div>
                <div className="mt-2 h-2 bg-[#FA5108]/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full bg-[#FA5108] rounded-full"
                    style={{
                      left: `${Math.max(0, Math.min(96, ((totalCost - marketMinTotal) / (marketMaxTotal - marketMinTotal || 1)) * 100 - 2))}%`,
                      width: "4%",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  toast.success("Запрос на точную смету отправлен. Ожидайте ответа от подрядчиков.")
                }
                className="w-full mt-4 py-3 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Запросить точную смету
              </button>
              <Link
                to="/services"
                className="w-full mt-2 py-3 border border-[#E8E6E3] rounded-lg text-[#212121] flex items-center justify-center gap-2 hover:bg-[#F1F0EF] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Выбрать подрядчика <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Recommended contractors for selected services */}
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-5">
              <h4 className="mb-3" style={{ fontWeight: 600 }}>Подходящие подрядчики</h4>
              <div className="space-y-3">
                {topContractors.map((c) => (
                  <Link
                    key={c.id}
                    to={`/contractor/${c.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F1F0EF] transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-[#F1F0EF] flex items-center justify-center text-sm text-[#212121] group-hover:bg-[#FA5108]/10 group-hover:text-[#FA5108] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm truncate" style={{ fontWeight: 500 }}>
                          {c.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FA5108] shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#737373]">
                        <span className="flex items-center gap-0.5 text-yellow-500">
                          <Star className="w-3 h-3 fill-yellow-400" /> {c.rating}
                        </span>
                        <span>{c.reviews} отзывов</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
