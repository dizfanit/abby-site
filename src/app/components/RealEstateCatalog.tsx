import { useState } from "react";
import {
  Search, MapPin, ChevronDown,
  Info, SlidersHorizontal, Heart,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
import svgPaths from "../../imports/svg-2ela7q55nx";

// ─── Figma images (card photos) ───────────────────────────────────────────────
import imgCard1  from "figma:asset/d8439c22f40681e9a9228428e4f4834761085888.png";
import imgCard2  from "figma:asset/2b9e547c1ec46fe10ee843c6ef09ee8aaf1b0c5d.png";
import imgCard3  from "figma:asset/cbd4cf098f5816d3262db76790910a04efa860ce.png";
import imgCard4  from "figma:asset/ba746c446d5fcb50448e280fbdae11550a0c6656.png";
// existing figma images for extra variety
import imgRectangle346  from "figma:asset/ff54fea40513c38deb387cb8101b215ec3fc8591.png";
import imgRectangle347  from "figma:asset/e06642c41885273a73932a5fe5c6ccdae9f8fbff.png";
import imgRectangle350  from "figma:asset/19089810279087c85761b58a53c3cdbb4d22c795.png";
import imgRectangle351  from "figma:asset/4d0c17a81aea33c16af1b65c3ed6ff0f30159c3b.png";
import imgRectangle352  from "figma:asset/f0bd0bba6c8a5b6885105e1aba5235ce5af75b8d.png";
import imgRectangle354  from "figma:asset/287014ba9b35537de3602f1eec43e35fa8d4b9b2.png";
import imgRectangle356  from "figma:asset/b92c09ea8a90f836d4d40e61c06a2851262bea7b.png";
import imgRectangle93   from "figma:asset/ac777fa857d08b980b938fcb70c3dddf5e205666.png";
import imgRectangle25138 from "figma:asset/825ffddbb71d8728463aba460265cb4775da4e03.png";
import imgVerticalBuilding from "figma:asset/b2dedbcd6f8a1ddd7a68a487b9c1072dd338295b.png";
import img43641 from "figma:asset/0d910ae6b504d56e57c3c721fbc70a21287e7787.png";

// ─── Data ─────────────────────────────────────────────────────────────────────
const LISTINGS = [
  {
    id: "1", title: "1-к квартира, 64,2м", sup: "2", floor: "5/9 эт.",
    price: "7 420 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Калининград",
    img: imgCard1, photos: [imgCard1, imgRectangle346, imgRectangle347, imgRectangle350],
    badge: "Новостройка", agentName: "РиелтКузи", agentColor: "bg-blue-600",
  },
  {
    id: "2", title: "2-к квартира, 59,2м", sup: "2", floor: "2/9 эт.",
    price: "6 600 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Калининград",
    img: imgCard2, photos: [imgCard2, imgRectangle351, imgRectangle352, imgRectangle354],
    badge: null, agentName: "АвтоСити", agentColor: "bg-orange-500",
  },
  {
    id: "3", title: "2-к квартира, 59,2м", sup: "2", floor: "2/9 эт.",
    price: "6 600 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Калининград",
    img: imgCard3, photos: [imgCard3, imgRectangle356, imgRectangle93, imgRectangle346],
    badge: "Топ", agentName: "БалтДом", agentColor: "bg-green-600",
  },
  {
    id: "4", title: "2-к квартира, 59,2м", sup: "2", floor: "2/9 эт.",
    price: "6 600 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Калининград",
    img: imgCard4, photos: [imgCard4, imgRectangle347, imgRectangle350, imgRectangle351],
    badge: null, agentName: "ПремиумЖК", agentColor: "bg-purple-600",
  },
  {
    id: "5", title: "3-к квартира, 76,0м", sup: "2", floor: "8/12 эт.",
    price: "9 850 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Зеленоградск",
    img: imgRectangle93, photos: [imgRectangle93, imgCard1, imgRectangle352, imgRectangle354],
    badge: "Срочно", agentName: "МореДом", agentColor: "bg-teal-600",
  },
  {
    id: "6", title: "Студия, 28,5м", sup: "2", floor: "4/16 эт.",
    price: "3 900 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Калининград",
    img: imgRectangle350, photos: [imgRectangle350, imgCard2, imgCard3, imgRectangle356],
    badge: null, agentName: "СтудиоПро", agentColor: "bg-indigo-600",
  },
  {
    id: "7", title: "1-к квартира, 42,0м", sup: "2", floor: "1/5 эт.",
    price: "4 750 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Светлогорск",
    img: imgRectangle347, photos: [imgRectangle347, imgCard4, imgRectangle93, imgCard1],
    badge: null, agentName: "ОкеанРиелт", agentColor: "bg-cyan-600",
  },
  {
    id: "8", title: "4-к квартира, 112м", sup: "2", floor: "10/18 эт.",
    price: "14 200 000 ₽", city: "Калининградская обл.,", cityLine2: "г. Калининград",
    img: imgRectangle354, photos: [imgRectangle354, imgRectangle356, imgCard2, imgCard3],
    badge: "VIP", agentName: "ЭлитГрупп", agentColor: "bg-rose-600",
  },
];

const DEVELOPERS = [
  { id: 1, name: "Сайнет", desc: "Комплексная девелоперская компания, 15 лет на рынке...", color: "bg-[#FA5108]", initial: "С" },
  { id: 2, name: "АВВ", desc: "Крупный застройщик, лидер строителной отрасли в регионе...", color: "bg-[#FA5108]", initial: "А" },
  { id: 3, name: "Бронвка", desc: "Российская компания, специализированный застройщик...", color: "bg-[#FA5108]", initial: "Б" },
  { id: 4, name: "ПГ Осника", desc: "Девелопер-партнёр ABBY. Квартиры, коммерция...", color: "bg-[#FA5108]", initial: "П" },
  { id: 5, name: "ЖК Riviera", desc: "Новые жилые комплексы у берега моря...", color: "bg-[#FA5108]", initial: "Ж" },
];

// ─── Dot Pagination ───────────────────────────────────────────────────────────
function DotPagination({ total, active }: { total: number; active: number }) {
  const shown = Math.min(total, 5);
  return (
    <div className="flex items-center justify-center gap-[6px]">
      {Array.from({ length: shown }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === active % shown ? 10 : 10,
            height: 10,
            background: "white",
            opacity: i === active % shown ? 1 : 0.25,
          }}
        />
      ))}
    </div>
  );
}

// ─── Vertical Property Card (Figma style) ────────────────────────────────────
function VerticalPropertyCard({ listing }: { listing: typeof LISTINGS[0] }) {
  const [fav, setFav] = useState(false);

  return (
    <div
      className="relative bg-white rounded-[10px] overflow-hidden group"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
    >
      <Link to={`/realestate/${listing.id}`} className="block">
        {/* ── Photo area ── */}
        <div className="relative overflow-hidden" style={{ height: 260, borderRadius: "10px 10px 0 0" }}>
          <img
            src={({
              "1": "/remote-images/unsplash-012.jpg",
              "2": "/remote-images/unsplash-010.jpg",
              "3": "/remote-images/unsplash-028.jpg",
              "4": "/remote-images/unsplash-003.jpg",
              "5": "/remote-images/unsplash-025.jpg",
              "6": "/remote-images/unsplash-041.jpg",
              "7": "/remote-images/unsplash-027.jpg",
              "8": "/remote-images/unsplash-012.jpg",
            } as Record<string, string>)[listing.id] ?? listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          {listing.badge && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px]"
              style={{ background: "linear-gradient(98deg, #FA5108 0%, #FF753A 100%)", fontWeight: 700 }}
            >
              {listing.badge}
            </div>
          )}

          {/* Dot pagination — static indicator */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <DotPagination total={listing.photos.length} active={0} />
          </div>
        </div>

        {/* ── Info area ── */}
        <div className="px-4 pt-3 pb-4 relative">
          {/* Title + floor */}
          <div className="pr-12">
            <p className="text-[#212121] leading-snug" style={{ fontSize: 15, letterSpacing: "-0.6px" }}>
              {listing.title}<sup style={{ fontSize: 10 }}>{listing.sup}</sup>
            </p>
            <p className="text-[#212121] leading-snug" style={{ fontSize: 15, letterSpacing: "-0.6px" }}>
              {listing.floor}
            </p>
          </div>

          {/* Price */}
          <p
            className="text-[#212121] mt-2"
            style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.6px" }}
          >
            {listing.price}
          </p>

          {/* Location */}
          <div className="flex items-start gap-1 mt-2 opacity-50">
            <svg
              width="11"
              height="13"
              viewBox="0 0 11 12.8332"
              fill="none"
              className="shrink-0 mt-0.5"
            >
              <path
                clipRule="evenodd"
                d={svgPaths.p3421cc80}
                fill="#212121"
                fillRule="evenodd"
              />
            </svg>
            <div
              className="underline leading-snug text-[#212121]"
              style={{ fontSize: 13, letterSpacing: "-0.5px", textDecorationColor: "#212121" }}
            >
              <p>{listing.city}</p>
              <p>{listing.cityLine2}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Favourite button — outside Link so it doesn't navigate */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setFav(!fav);
          fav ? toast("Удалено из избранного") : toast.success("Добавлено в избранное");
        }}
        className="absolute flex items-center justify-center rounded-[10px] bg-white transition-colors hover:bg-[#F1F0EF]"
        style={{
          top: 276,
          right: 12,
          width: 40,
          height: 40,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          border: "1px solid #F0EFEE",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
          <path
            d={svgPaths.p1cbe8780}
            stroke={fav ? "#FA5108" : "#212121"}
            fill={fav ? "#FA5108" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (v: string) => void }) {
  const filters = ["Цена", "Комнаты", "Площадь", "Тип дома", "Проверено"];
  return (
    <div className="flex items-center gap-2 mb-6 bg-white rounded-xl border border-[#E8E6E3] p-2.5">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
        <input
          className="w-full pl-9 pr-3 py-2 text-xs text-[#212121] bg-[#F8F7F5] rounded-lg border border-[#E8E6E3] outline-none focus:border-[#FA5108]"
          placeholder="Поиск, улица, район..."
        />
      </div>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setActiveFilter(activeFilter === f ? "" : f)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs border transition-all whitespace-nowrap ${
            activeFilter === f
              ? "border-[#FA5108] bg-[#FA5108]/5 text-[#FA5108]"
              : "border-[#E8E6E3] text-[#737373] hover:border-[#FA5108]/40"
          }`}
          style={{ fontWeight: activeFilter === f ? 600 : 400 }}
        >
          {f} <ChevronDown className="w-3 h-3" />
        </button>
      ))}
      <button className="p-2 rounded-lg border border-[#E8E6E3] text-[#737373] hover:border-[#FA5108]/40 transition-colors ml-auto">
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Advertising Banner ──────────────────────────────────────────────────────
function AdvertisingBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 bg-[#212121]" style={{ minHeight: 110 }}>
      <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border-[30px] border-white/5" />
      <div className="absolute -right-4 top-4 w-36 h-36 rounded-full border-[20px] border-white/5" />
      <div className="relative z-10 flex items-center px-6 py-4 gap-6">
        <div className="flex-1">
          <h3 className="text-white mb-2" style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.2, textTransform: "uppercase" }}>
            УВЕЛИЧИВАЙТЕ<br />ПОТОК КЛИЕНТОВ
          </h3>
          <button className="px-4 py-1.5 bg-[#FA5108] text-white text-xs rounded-lg hover:bg-[#e04a07] transition-colors" style={{ fontWeight: 600 }}>
            В кабинет
          </button>
        </div>
        <div className="shrink-0 w-20 h-20 flex items-center justify-center overflow-hidden">
          <img src={img43641} alt="" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E8E6E3] p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm text-[#212121]" style={{ fontWeight: 700 }}>Топ Застройщиков</h3>
          <Info className="w-3.5 h-3.5 text-[#BBBBBB]" />
        </div>
        <div className="space-y-3">
          {DEVELOPERS.map((dev) => (
            <button
              key={dev.id}
              onClick={() => toast.info(`${dev.name}: открыть профиль`)}
              className="w-full flex items-start gap-3 text-left hover:bg-[#F8F7F5] rounded-xl p-2 -mx-2 transition-colors"
            >
              <div className={`w-9 h-9 rounded-full ${dev.color} flex items-center justify-center shrink-0`}>
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>{dev.initial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#212121]" style={{ fontWeight: 600 }}>{dev.name}</div>
                <p className="text-[10px] text-[#737373] leading-snug line-clamp-2 mt-0.5">{dev.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ABBY Dark ad */}
      <div className="relative rounded-2xl overflow-hidden bg-[#212121]" style={{ minHeight: 180 }}>
        <img src={imgRectangle25138} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 p-5 flex flex-col justify-between h-full min-h-[180px]">
          <div className="text-white text-xs mb-2" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            КОММЕРЦИЯ<br />КВАРТИРЫ<br />ОФИСЫ<br />ДОМА
          </div>
          <button className="w-full py-2 bg-[#FA5108] text-white text-[11px] rounded-lg" style={{ fontWeight: 600 }}>
            Недвижимость
          </button>
        </div>
      </div>

      {/* ABBY Building ad */}
      <div className="relative rounded-2xl overflow-hidden bg-[#212121]" style={{ minHeight: 200 }}>
        <img src={imgVerticalBuilding} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 p-5 h-full min-h-[200px] flex flex-col justify-between">
          <p className="text-white/70 text-[10px] leading-loose" style={{ fontWeight: 300 }}>
            #строительство<br />#недвижимость<br />#квартиры<br />#застройщики<br />#новостройки
          </p>
          <button className="w-full mt-3 py-2 bg-[#FA5108] text-white text-[11px] rounded-lg" style={{ fontWeight: 600 }}>
            Недвижимость
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function RealEstateCatalog() {
  const [activeFilter, setActiveFilter] = useState("");

  return (
    <div className="bg-[#F8F7F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* 2-col layout */}
        <div className="flex gap-5 items-start">

          {/* Left: Grid of cards */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#737373]">
                Найдено <span className="text-[#212121]" style={{ fontWeight: 600 }}>12 333</span> объявлений
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737373]">Сортировка:</span>
                <button className="flex items-center gap-1 text-xs text-[#212121] hover:text-[#FA5108] transition-colors" style={{ fontWeight: 500 }}>
                  По дате <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {LISTINGS.slice(0, 6).map((listing) => (
                <VerticalPropertyCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Ad banner between card rows */}
            <AdvertisingBanner />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {LISTINGS.slice(6).map((listing) => (
                <VerticalPropertyCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Load more */}
            <div className="text-center py-8">
              <button
                onClick={() => toast.info("Загружаем щё объявления...")}
                className="px-8 py-3 border-2 border-[#FA5108] text-[#FA5108] rounded-xl text-sm hover:bg-[#FA5108]/5 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Показать ещё
              </button>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="w-[240px] shrink-0 hidden xl:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}