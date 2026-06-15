import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  ShoppingCart,
  Star,
  Truck,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  Package,
  Wrench,
  Zap,
  Paintbrush,
  DoorOpen,
  Lightbulb,
  Droplets,
  Hammer,
  Filter,
  ChevronDown,
  Flame,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const IMG_LAMINATE = "/remote-images/unsplash-006.jpg&utm_source=figma&utm_medium=referral";
const IMG_TILES = "/remote-images/unsplash-031.jpg";
const IMG_TOOLS = "/remote-images/unsplash-048.jpg";
const IMG_PAINT = "/remote-images/unsplash-042.jpg&utm_source=figma&utm_medium=referral";
const IMG_FAUCET = "/remote-images/unsplash-045.jpg&utm_source=figma&utm_medium=referral";
const IMG_ELECTRICAL = "/remote-images/unsplash-036.jpg";

const categories = [
  { id: "stroymaterialy", label: "Стройматериалы", icon: Package, color: "#FA5108" },
  { id: "santehnika", label: "Сантехника", icon: Droplets, color: "#3B82F6" },
  { id: "elektrika", label: "Электрика", icon: Zap, color: "#F59E0B" },
  { id: "kraski", label: "Краски и обои", icon: Paintbrush, color: "#8B5CF6" },
  { id: "dveri", label: "Двери и окна", icon: DoorOpen, color: "#10B981" },
  { id: "instrumenty", label: "Инструменты", icon: Wrench, color: "#EF4444" },
  { id: "mebel", label: "Мебель", icon: Hammer, color: "#6366F1" },
  { id: "osveshenie", label: "Освещение", icon: Lightbulb, color: "#EC4899" },
];

const popularProducts = [
  { id: "p1", name: "Ламинат Quick-Step Impressive", desc: "Дуб натуральный, 8мм, 32 класс", price: "1 890", unit: "м²", rating: 4.7, reviews: 89, img: IMG_LAMINATE, buyers: 42, badge: null },
  { id: "p2", name: "Плитка Kerama Marazzi", desc: "Керамогранит 60x60, матовая", price: "2 340", unit: "м²", rating: 4.8, reviews: 67, img: IMG_TILES, buyers: 38, badge: "Хит" },
  { id: "p3", name: "Смеситель Grohe Eurosmart", desc: "Хром, однорычажный, с аэратором", price: "8 900", unit: "шт", rating: 4.9, reviews: 124, img: IMG_FAUCET, buyers: 27, badge: null },
  { id: "p4", name: "Краска Dulux Diamond", desc: "Интерьерная, белая, матовая, 10л", price: "4 200", unit: "шт", rating: 4.6, reviews: 53, img: IMG_PAINT, buyers: 31, badge: "Снижена цена" },
  { id: "p5", name: "Кабель ВВГнг 3×2.5", desc: "Медный, 100м бухта, ГОСТ", price: "6 750", unit: "бухта", rating: 4.5, reviews: 45, img: IMG_ELECTRICAL, buyers: 54, badge: null },
  { id: "p6", name: "Перфоратор Bosch GBH 2-26", desc: "800Вт, 3 режима, SDS-plus, кейс", price: "12 400", unit: "шт", rating: 4.8, reviews: 201, img: IMG_TOOLS, buyers: 19, badge: "Топ" },
];

const rentalTools = [
  { name: "Штроборез", price: "800 ₽/день", available: true },
  { name: "Лазерный уровень", price: "500 ₽/день", available: true },
  { name: "Перфоратор SDS-max", price: "1 200 ₽/день", available: true },
  { name: "Шлифмашина", price: "600 ₽/день", available: false },
];

const estimateItems = [
  { name: "Штукатурка Knauf Ротбанд 30кг", qty: "12 шт", price: "490 ₽/шт", total: "5 880 ₽", status: "ok" as const },
  { name: "Грунтовка Ceresit CT 17, 10л", qty: "3 шт", price: "890 ₽/шт", total: "2 670 ₽", status: "ok" as const },
  { name: "Маяки штукатурные 6мм", qty: "24 шт", price: "45 ₽/шт", total: "1 080 ₽", status: "warn" as const },
  { name: "Сетка армирующая 5×5мм, 50м²", qty: "1 рулон", price: "980 ₽", total: "980 ₽", status: "ok" as const },
];

export function MarketPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showEstimate, setShowEstimate] = useState(true);

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast("Удалено из избранного"); }
      else { next.add(id); toast.success("Добавлено в избранное"); }
      return next;
    });
  };

  const filteredProducts = activeCategory
    ? popularProducts.filter(() => Math.random() > 0.3)
    : popularProducts;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FA5108, #FF753A)" }}>
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-[#212121]" style={{ fontWeight: 700 }}>ABBY Маркет</h1>
            <p className="text-xs text-[#737373]">Всё для ремонта и обустройства</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 flex items-center bg-[#F5F5F5] rounded-full overflow-hidden h-11">
            <Search className="w-4 h-4 text-[#737373] ml-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Искать товары, бренды, артикулы..."
              className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none text-[#212121] placeholder:text-[#737373]"
            />
            <button
              onClick={() => toast.success("Поиск товаров...")}
              className="h-full px-5 text-white text-xs rounded-full shrink-0"
              style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)" }}
            >
              Найти
            </button>
          </div>
          <button
            onClick={() => toast.info("Фильтры товаров")}
            className="h-11 px-4 border border-[#E8E6E3] rounded-full flex items-center gap-1.5 text-sm text-[#212121] hover:bg-[#F1F0EF] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Фильтры
          </button>
        </div>

        {/* Estimate banner */}
        {showEstimate && (
          <div className="mb-6 rounded-2xl border-2 border-[#FA5108]/20 bg-[#FA5108]/5 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FA5108] flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>У вас есть смета на платформе!</div>
                  <div className="text-xs text-[#737373]">Проект: Ремонт 2-комн, ЖК «Солнечный» · 47 позиций · ~185 000 ₽</div>
                </div>
              </div>
              <button onClick={() => setShowEstimate(false)} className="text-[#737373] text-xs hover:text-[#212121]">Скрыть</button>
            </div>

            {/* Estimate items preview */}
            <div className="bg-white rounded-xl border border-[#E8E6E3] overflow-hidden mb-3">
              <div className="px-3 py-2 bg-[#F9F9F8] border-b border-[#E8E6E3]">
                <span className="text-xs text-[#737373]" style={{ fontWeight: 500 }}>Этап 4: Штукатурка</span>
              </div>
              <div className="divide-y divide-[#E8E6E3]">
                {estimateItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 px-3 py-2.5 text-xs">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === "ok" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {item.status === "ok" ? "✓" : "!"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#212121] truncate">{item.name}</div>
                      {item.status === "warn" && (
                        <div className="text-amber-600 text-[10px]">Нет в наличии — есть альтернатива</div>
                      )}
                    </div>
                    <div className="text-[#737373] whitespace-nowrap">{item.qty}</div>
                    <div className="text-[#212121] whitespace-nowrap" style={{ fontWeight: 600 }}>{item.total}</div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2.5 bg-[#F9F9F8] border-t border-[#E8E6E3] flex items-center justify-between">
                <div className="text-xs text-[#737373]">
                  Итого за этап: <span className="text-[#212121]" style={{ fontWeight: 700 }}>10 610 ₽</span>
                  <span className="ml-2 text-green-600">Экономия: 425 ₽</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toast.success("Корзина сформирована из сметы!", { description: "47 позиций добавлены" })}
              className="w-full py-2.5 rounded-xl text-white text-sm"
              style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)", fontWeight: 600 }}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Купить всё по смете — 185 000 ₽
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-base text-[#212121] mb-3" style={{ fontWeight: 600 }}>Категории</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-[#FA5108] bg-[#FA5108]/5 shadow-sm"
                      : "border-[#E8E6E3] hover:border-[#FA5108]/30 hover:shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                    <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <span className={`text-[10px] md:text-xs text-center leading-tight ${isActive ? "text-[#FA5108]" : "text-[#212121]"}`} style={{ fontWeight: isActive ? 600 : 400 }}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular in your complex */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base text-[#212121]" style={{ fontWeight: 600 }}>
              Популярное в вашем ЖК «Солнечный»
            </h2>
            <button className="text-xs text-[#FA5108] hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
              Все товары <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-[10px] overflow-hidden cursor-pointer group"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
                onClick={() => toast.info(`${p.name}: карточка товара`)}
              >
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ height: 220, borderRadius: "10px 10px 0 0" }}>
                  <ImageWithFallback
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge */}
                  {p.badge && (
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px]"
                      style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)", fontWeight: 700 }}
                    >
                      {p.badge}
                    </div>
                  )}
                  {/* Buyers badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-white text-[10px]" style={{ fontWeight: 600 }}>{p.buyers} купили</span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-4 pt-3 pb-4 relative">
                  {/* Favorite button — same style as Figma property card */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                    className="absolute top-3 right-3 flex items-center justify-center rounded-[10px] bg-white hover:bg-[#F1F0EF] transition-colors"
                    style={{
                      width: 40,
                      height: 40,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      border: "1px solid #F0EFEE",
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${favorites.has(p.id) ? "fill-[#FA5108] text-[#FA5108]" : "text-[#212121]"}`}
                      strokeWidth={1.8}
                    />
                  </button>

                  {/* Name */}
                  <p
                    className="text-[#212121] leading-snug pr-12 line-clamp-2"
                    style={{ fontSize: 14, letterSpacing: "-0.4px" }}
                  >
                    {p.name}
                  </p>
                  <p className="text-[#737373] text-xs mt-0.5 line-clamp-1">{p.desc}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-[#212121]" style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.6px" }}>
                      {p.price} ₽
                    </span>
                    <span className="text-[#737373] text-xs">/ {p.unit}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-[#212121]" style={{ fontWeight: 500 }}>{p.rating}</span>
                    <span className="text-xs text-[#737373]">({p.reviews})</span>
                  </div>

                  {/* Location line (like real estate cards) */}
                  <div className="flex items-center gap-1 mt-2 opacity-50">
                    <MapPin className="w-3 h-3 text-[#212121] shrink-0" />
                    <span className="text-xs text-[#212121] underline" style={{ letterSpacing: "-0.4px" }}>
                      Калининград, доставка 2 ч
                    </span>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toast.success(`${p.name} добавлен в корзину`); }}
                    className="w-full mt-3 py-2 rounded-[10px] text-white text-xs transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)", fontWeight: 600 }}
                  >
                    В корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tool rental */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base text-[#212121]" style={{ fontWeight: 600 }}>Аренда инструмента</h2>
            <button className="text-xs text-[#FA5108] hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
              Смотреть все <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rentalTools.map((tool) => (
              <div key={tool.name} className="flex items-center gap-3 p-3 border border-[#E8E6E3] rounded-xl hover:border-[#FA5108]/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#212121]" style={{ fontWeight: 500 }}>{tool.name}</div>
                  <div className="text-xs text-[#FA5108]" style={{ fontWeight: 600 }}>{tool.price}</div>
                  <div className={`text-[10px] ${tool.available ? "text-green-600" : "text-red-500"}`}>
                    {tool.available ? "Доступен" : "Занят"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Truck, label: "Доставка на объект", desc: "В день заказа от 2 часов" },
            { icon: ShieldCheck, label: "Гарантия качества", desc: "Возврат 14 дней" },
            { icon: RotateCcw, label: "Продажа остатков", desc: "Верните лишние материалы" },
            { icon: Star, label: "Оптовые цены", desc: "Скидки для мастеров ABBY" },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F9F8]">
              <div className="w-9 h-9 rounded-lg bg-[#FA5108]/10 flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4 text-[#FA5108]" />
              </div>
              <div>
                <div className="text-xs text-[#212121]" style={{ fontWeight: 600 }}>{f.label}</div>
                <div className="text-[10px] text-[#737373]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #FA5108 0%, #FF753A 50%, #FFA178 100%)" }}>
          <div className="p-6 text-white">
            <div className="text-xs bg-white/20 px-2 py-0.5 rounded inline-block mb-2">Для мастеров</div>
            <h3 className="text-lg mb-1" style={{ fontWeight: 700 }}>Профессиональные цены для мастеров ABBY</h3>
            <p className="text-sm text-white/70 mb-4">Скидки до 25% при покупке по сметам. Накопительная программа лояльности.</p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2 bg-white text-[#FA5108] rounded-lg text-sm hover:bg-white/90 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Подключить PRO-аккаунт <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}