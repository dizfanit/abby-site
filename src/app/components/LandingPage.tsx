import { useState } from "react";
import { Link } from "react-router";
import {
  Search, ChevronDown, SlidersHorizontal, Info,
  Star, MapPin, ShieldCheck, ArrowRight,
  Paintbrush, Zap, Hammer, Droplets, Package,
  Briefcase, Clock, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import svgPaths from "../../imports/svg-2ela7q55nx";

// ─── Figma images (real estate) ───────────────────────────────────────────────
import imgCard1     from "figma:asset/d8439c22f40681e9a9228428e4f4834761085888.png";
import imgCard2     from "figma:asset/2b9e547c1ec46fe10ee843c6ef09ee8aaf1b0c5d.png";
import imgCard3     from "figma:asset/cbd4cf098f5816d3262db76790910a04efa860ce.png";
import imgCard4     from "figma:asset/ba746c446d5fcb50448e280fbdae11550a0c6656.png";
import imgRect346   from "figma:asset/ff54fea40513c38deb387cb8101b215ec3fc8591.png";
import imgRect347   from "figma:asset/e06642c41885273a73932a5fe5c6ccdae9f8fbff.png";
import imgRect350   from "figma:asset/19089810279087c85761b58a53c3cdbb4d22c795.png";
import imgRect351   from "figma:asset/4d0c17a81aea33c16af1b65c3ed6ff0f30159c3b.png";
import imgRect352   from "figma:asset/f0bd0bba6c8a5b6885105e1aba5235ce5af75b8d.png";
import imgRect354   from "figma:asset/287014ba9b35537de3602f1eec43e35fa8d4b9b2.png";
import imgRect356   from "figma:asset/b92c09ea8a90f836d4d40e61c06a2851262bea7b.png";
import imgRect93    from "figma:asset/ac777fa857d08b980b938fcb70c3dddf5e205666.png";
import imgRect25138 from "figma:asset/825ffddbb71d8728463aba460265cb4775da4e03.png";
import imgVertical  from "figma:asset/b2dedbcd6f8a1ddd7a68a487b9c1072dd338295b.png";
import img43641     from "figma:asset/0d910ae6b504d56e57c3c721fbc70a21287e7787.png";

// ─── Market images (Unsplash) ─────────────────────────────────────────────────
const IMG_LAMINATE   = "https://images.unsplash.com/photo-1617262869522-6740e6450f27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW1pbmF0ZSUyMHdvb2QlMjBmbG9vcmluZyUyMHRleHR1cmV8ZW58MXx8fHwxNzcyMTEyMzU1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_TILES      = "https://images.unsplash.com/photo-1760544137582-85c3300b794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHRpbGVzJTIwY2VyYW1pYyUyMG1vc2FpY3xlbnwxfHx8fDE3NzIxMTIzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_TOOLS      = "https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHRvb2xzJTIwZHJpbGwlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzIxMTIzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_PAINT      = "https://images.unsplash.com/photo-1763741226847-f5ef0c846506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludCUyMGNhbnMlMjBjb2xvcmZ1bCUyMHJlbm92YXRpb258ZW58MXx8fHwxNzcyMTEyMzU2fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_FAUCET     = "https://images.unsplash.com/photo-1769763828411-eb09bb05d97f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZmF1Y2V0JTIwY2hyb21lJTIwbW9kZXJufGVufDF8fHx8MTc3MjExMDAzOXww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_ELECTRICAL = "https://images.unsplash.com/photo-1762115106003-30a83b29f609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwd2lyaW5nJTIwaW5zdGFsbGF0aW9uJTIwY2FibGVzfGVufDF8fHx8MTc3MjExMjM1N3ww&ixlib=rb-4.1.0&q=80&w=1080";

// ─── Data ─────────────────────────────────────────────────────────────────────
const RE_LISTINGS = [
  { id: "r1", title: "1-к квартира, 64,2м", sup: "2", floor: "5/9 эт.", price: "7 420 000 ₽",
    city: "Калининград", badge: "Новостройка",
    photo: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb20lMjBtb2Rlcm58ZW58MXx8fHwxNzcyMjAwNDE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    photoCount: 4 },
  { id: "r2", title: "2-к квартира, 59,2м", sup: "2", floor: "2/9 эт.", price: "6 600 000 ₽",
    city: "Калининград", badge: null,
    photo: "https://images.unsplash.com/photo-1661796428175-55423b19409f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBiZWRyb29tJTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBjb3p5fGVufDF8fHx8MTc3MjIxMDY2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    photoCount: 4 },
  { id: "r3", title: "Студия, 28,5м", sup: "2", floor: "4/16 эт.", price: "3 900 000 ₽",
    city: "Калининград", badge: "Топ",
    photo: "https://images.unsplash.com/photo-1759691337957-ebc9ed54dc44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjByZW5vdmF0aW9ufGVufDF8fHx8MTc3MjIxMDY2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    photoCount: 3 },
  { id: "r4", title: "2-к квартира, 59,2м", sup: "2", floor: "2/9 эт.", price: "6 600 000 ₽",
    city: "Зеленоградск", badge: null,
    photo: "https://images.unsplash.com/photo-1571164860029-856acbc24b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMHNjYW5kaW5hdmlhbnxlbnwxfHx8fDE3NzIyMTA2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    photoCount: 4 },
  { id: "r5", title: "3-к квартира, 76,0м", sup: "2", floor: "8/12 эт.", price: "9 850 000 ₽",
    city: "Светлогорск", badge: "Срочно",
    photo: "https://images.unsplash.com/photo-1758800601486-75c3865cc9a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMHBhbm9yYW1pYyUyMHdpbmRvd3xlbnwxfHx8fDE3NzIyMTA2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    photoCount: 5 },
  { id: "r6", title: "4-к квартира, 112м", sup: "2", floor: "10/18 эт.", price: "14 200 000 ₽",
    city: "Калининград", badge: "VIP",
    photo: "https://images.unsplash.com/photo-1759647020668-648cd90ddce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMHNvZmElMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzIyMTA2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    photoCount: 6 },
];

const MARKET_ITEMS = [
  { id: "m1", name: "Ламинат Quick-Step Impressive", desc: "Дуб натуральный, 8мм, 32 класс",
    price: "1 890 ₽", unit: "м²", rating: 4.7, reviews: 89, img: IMG_LAMINATE, badge: null },
  { id: "m2", name: "Плитка Kerama Marazzi", desc: "Керамогранит 60×60, матовая",
    price: "2 340 ₽", unit: "м²", rating: 4.8, reviews: 67, img: IMG_TILES, badge: "Хит" },
  { id: "m3", name: "Смеситель Grohe Eurosmart", desc: "Хром, однорычажный, с аэратором",
    price: "8 900 ₽", unit: "шт", rating: 4.9, reviews: 124, img: IMG_FAUCET, badge: null },
  { id: "m4", name: "Краска Dulux Diamond", desc: "Интерьерная, белая, матовая, 10л",
    price: "4 200 ₽", unit: "шт", rating: 4.6, reviews: 53, img: IMG_PAINT, badge: "Снижена цена" },
  { id: "m5", name: "Кабель ВВГнг 3×2.5", desc: "Медный, 100м бухта, ГОСТ",
    price: "6 750 ₽", unit: "бухта", rating: 4.5, reviews: 45, img: IMG_ELECTRICAL, badge: null },
  { id: "m6", name: "Перфоратор Bosch GBH 2-26", desc: "800Вт, 3 режима, SDS-plus",
    price: "12 400 ₽", unit: "шт", rating: 4.8, reviews: 201, img: IMG_TOOLS, badge: "Топ" },
];

const SERVICE_ITEMS = [
  { id: "s1", avatar: "СМ", name: "СтройМастер Про", specialty: "Ремонт под ключ",
    rating: 4.9, reviews: 156, price: "от 8 500 ₽/м²", location: "Калининград",
    verified: true, badge: "Топ-10", color: "#FA5108", Icon: Hammer },
  { id: "s2", avatar: "АС", name: "АкваСервис", specialty: "Сантехника и водоснабжение",
    rating: 4.7, reviews: 98, price: "от 2 000 ₽/час", location: "Калининград",
    verified: true, badge: "Допуск", color: "#3B82F6", Icon: Droplets },
  { id: "s3", avatar: "ЭМ", name: "ЭлектроМонтаж+", specialty: "Электромонтажные работы",
    rating: 4.8, reviews: 73, price: "от 1 500 ₽/точка", location: "Калининград, МО",
    verified: true, badge: "EAC", color: "#F59E0B", Icon: Zap },
  { id: "s4", avatar: "ДК", name: "Домашний Комфорт", specialty: "Комплексный ремонт квартир",
    rating: 4.6, reviews: 45, price: "от 12 000 ₽/м²", location: "Калининград",
    verified: true, badge: "Гарантия 3 года", color: "#10B981", Icon: Package },
  { id: "s5", avatar: "МО", name: "МастерОтделки", specialty: "Штукатурка, покраска, плитка",
    rating: 4.5, reviews: 112, price: "от 800 ₽/м²", location: "Калининград",
    verified: false, badge: null, color: "#8B5CF6", Icon: Paintbrush },
  { id: "s6", avatar: "РС", name: "РемСтрой Групп", specialty: "Капитальный ремонт",
    rating: 4.8, reviews: 67, price: "от 9 000 ₽/м²", location: "Калининград",
    verified: true, badge: "СРО", color: "#EF4444", Icon: Hammer },
];

const JOB_ITEMS = [
  { id: "j1", title: "Штукатур-маляр", company: "ГК «Стройинвест»",
    salary: "80 000 — 120 000 ₽", location: "Калининград, ЖК «Речной»",
    schedule: "Вахта 45/15", perks: ["Проживание", "Питание"],
    color: "#8B5CF6", Icon: Paintbrush, hot: true, companyRating: 4.5 },
  { id: "j2", title: "Электромонтажник", company: "ООО «ЭлектроПро»",
    salary: "90 000 — 140 000 ₽", location: "Калининград",
    schedule: "Полный день", perks: ["Белая зарплата", "ДМС"],
    color: "#F59E0B", Icon: Zap, hot: false, companyRating: 4.8 },
  { id: "j3", title: "Плиточник", company: "РемонтПро39",
    salary: "100 000 — 160 000 ₽", location: "Калининград, ЖК «Парковый»",
    schedule: "Сезон · 4 месяца", perks: ["Белая зарплата", "Инструмент"],
    color: "#EF4444", Icon: Hammer, hot: true, companyRating: 4.9 },
  { id: "j4", title: "Прораб", company: "БалтСтрой",
    salary: "120 000 — 180 000 ₽", location: "Калининград",
    schedule: "Постоянная", perks: ["Авто", "ДМС"],
    color: "#10B981", Icon: Building2, hot: false, companyRating: 4.7 },
  { id: "j5", title: "Сварщик", company: "МеталлПро",
    salary: "70 000 — 110 000 ₽", location: "Калининградская обл.",
    schedule: "Вахта 60/30", perks: ["Проживание", "Спецодежда"],
    color: "#3B82F6", Icon: Hammer, hot: false, companyRating: 4.3 },
  { id: "j6", title: "Каменщик", company: "СК «Балтика»",
    salary: "85 000 — 130 000 ₽", location: "Калининград",
    schedule: "Сезон · 5 месяцев", perks: ["Питание", "Инструмент"],
    color: "#FA5108", Icon: Package, hot: true, companyRating: 4.6 },
];

const DEVELOPERS = [
  { id: 1, name: "Сайнет",    desc: "Комплексная девелоперская компания, 15 лет на рынке...",   color: "bg-[#FA5108]", initial: "С" },
  { id: 2, name: "АВВ",       desc: "Крупный застройщик, лидер строительной отрасли в регионе...", color: "bg-[#FA5108]", initial: "А" },
  { id: 3, name: "Бронвка",   desc: "Российская компания, специализированный застройщик...",    color: "bg-[#FA5108]", initial: "Б" },
  { id: 4, name: "ПГ Осника", desc: "Девелопер-партнёр ABBY. Квартиры, коммерция...",          color: "bg-[#FA5108]", initial: "П" },
  { id: 5, name: "ЖК Riviera",desc: "Новые жилые комплексы у берега моря...",                  color: "bg-[#FA5108]", initial: "Ж" },
];

type Tab = "all" | "realestate" | "market" | "services" | "jobs";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          className="w-3 h-3"
          fill={s <= Math.round(rating) ? "#FA5108" : "none"}
          stroke={s <= Math.round(rating) ? "#FA5108" : "#D1D5DB"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ─── Dot Pagination ───────────────────────────────────────────────────────────
function DotPagination({ total, active }: { total: number; active: number }) {
  const shown = Math.min(total, 5);
  return (
    <div className="flex items-center justify-center gap-[6px]">
      {Array.from({ length: shown }).map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-300"
          style={{ width: 8, height: 8, background: "white", opacity: i === active % shown ? 1 : 0.3 }}
        />
      ))}
    </div>
  );
}

// ─── Card Shell (shared container) ────────────────────────────────────────────
function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative bg-white overflow-hidden group transition-all duration-300 hover:translate-y-[-2px] ${className}`}
      style={{ 
        borderRadius: 'clamp(12px, 1.5vw, 18px)',
        boxShadow: "0 1px 3px rgba(250, 81, 8, 0.08), 0 8px 24px rgba(250, 81, 8, 0.06)"
      }}
    >
      {children}
    </div>
  );
}

// ─── Real Estate Card ─────────────────────────────────────────────────────────
function RealEstateCard({ item }: { item: typeof RE_LISTINGS[0] }) {
  const [fav, setFav] = useState(false);
  return (
    <CardShell>
      <Link to={`/realestate/${item.id}`} className="block">
        {/* Photo — clicking opens detail page */}
        <div className="relative overflow-hidden" style={{ height: 220 }}>
          <img src={item.photo} alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {item.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px]"
              style={{ background: "linear-gradient(98deg,#FA5108 0%,#FF753A 100%)", fontWeight: 700 }}>
              {item.badge}
            </div>
          )}
          {/* Dot indicator (static) */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <DotPagination total={item.photoCount} active={0} />
          </div>
        </div>
        {/* Info */}
        <div className="px-4 pt-3 pb-4 relative">
          <div className="pr-10">
            <p className="text-[#212121] leading-snug" style={{ fontSize: 14, letterSpacing: "-0.5px" }}>
              {item.title}<sup style={{ fontSize: 9 }}>{item.sup}</sup>
            </p>
            <p className="text-[#212121] leading-snug" style={{ fontSize: 14, letterSpacing: "-0.5px" }}>{item.floor}</p>
          </div>
          <p className="text-[#212121] mt-1.5" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.5px" }}>{item.price}</p>
          <div className="flex items-center gap-1 mt-1.5 opacity-50">
            <MapPin className="w-3 h-3 shrink-0 text-[#212121]" />
            <span className="text-[#212121]" style={{ fontSize: 12 }}>{item.city}</span>
          </div>
        </div>
      </Link>
      {/* Favourite button — outside Link to prevent navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); setFav(!fav); fav ? toast("Удалено из избранного") : toast.success("Добавлено в избранное"); }}
        className="absolute top-[236px] right-3 flex items-center justify-center rounded-[10px] bg-white hover:bg-[#F1F0EF] transition-colors"
        style={{ width: 38, height: 38, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", border: "1px solid #F0EFEE" }}>
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
          <path d={svgPaths.p1cbe8780} stroke={fav ? "#FA5108" : "#212121"} fill={fav ? "#FA5108" : "none"}
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </CardShell>
  );
}

// ─── Market Card ──────────────────────────────────────────────────────────────
function MarketCard({ item }: { item: typeof MARKET_ITEMS[0] }) {
  const [fav, setFav] = useState(false);
  return (
    <CardShell>
      <Link to="/market" className="block">
        {/* Photo */}
        <div className="relative overflow-hidden bg-[#F8F7F5]" style={{ height: 220 }}>
          <ImageWithFallback src={item.img} alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {item.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px]"
              style={{ background: "linear-gradient(98deg,#FA5108 0%,#FF753A 100%)", fontWeight: 700 }}>
              {item.badge}
            </div>
          )}
        </div>
        {/* Info */}
        <div className="px-4 pt-3 pb-4 relative">
          <div className="pr-10">
            <p className="text-[#212121] leading-snug line-clamp-1" style={{ fontSize: 14, letterSpacing: "-0.4px" }}>{item.name}</p>
            <p className="text-[#737373] leading-snug line-clamp-1 mt-0.5" style={{ fontSize: 12 }}>{item.desc}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Stars rating={item.rating} />
            <span className="text-[#737373]" style={{ fontSize: 11 }}>{item.rating} ({item.reviews})</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-[#212121]" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.5px" }}>{item.price}</span>
            <span className="text-[#737373]" style={{ fontSize: 12 }}>/ {item.unit}</span>
          </div>
        </div>
      </Link>
      {/* Favourite button */}
      <button
        onClick={(e) => { e.stopPropagation(); setFav(!fav); fav ? toast("Удалено из избранного") : toast.success("Добавлено в избранное"); }}
        className="absolute top-[236px] right-3 flex items-center justify-center rounded-[10px] bg-white hover:bg-[#F1F0EF] transition-colors"
        style={{ width: 38, height: 38, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", border: "1px solid #F0EFEE" }}>
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
          <path d={svgPaths.p1cbe8780} stroke={fav ? "#FA5108" : "#212121"} fill={fav ? "#FA5108" : "none"}
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </CardShell>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ item }: { item: typeof SERVICE_ITEMS[0] }) {
  const { Icon } = item;
  return (
    <CardShell>
      <Link to="/services" className="block">
        {/* Avatar header */}
        <div className="relative flex items-center justify-center overflow-hidden" style={{ height: 180,
          background: `linear-gradient(135deg, ${item.color}22 0%, ${item.color}44 100%)` }}>
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{ background: `${item.color}18` }} />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full" style={{ background: `${item.color}12` }} />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: item.color }}>
              <span className="text-white text-xl" style={{ fontWeight: 700 }}>{item.avatar}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80" style={{ backdropFilter: "blur(4px)" }}>
              <Stars rating={item.rating} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#212121" }}>{item.rating}</span>
              <span className="text-[#737373]" style={{ fontSize: 11 }}>({item.reviews})</span>
            </div>
          </div>
          {item.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px]"
              style={{ background: item.color, fontWeight: 700 }}>
              {item.badge}
            </div>
          )}
          {item.verified && (
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center"
              style={{ backdropFilter: "blur(4px)" }}>
              <ShieldCheck className="w-4 h-4" style={{ color: item.color }} />
            </div>
          )}
        </div>
        {/* Info */}
        <div className="px-4 pt-3 pb-4">
          <p className="text-[#212121] leading-snug" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.4px" }}>{item.name}</p>
          <p className="text-[#737373] leading-snug mt-0.5" style={{ fontSize: 12 }}>{item.specialty}</p>
          <span className="text-[#FA5108] mt-2 block" style={{ fontSize: 13, fontWeight: 600 }}>{item.price}</span>
          <div className="flex items-center gap-1 mt-1.5 opacity-50">
            <MapPin className="w-3 h-3 shrink-0 text-[#212121]" />
            <span className="text-[#212121]" style={{ fontSize: 12 }}>{item.location}</span>
          </div>
        </div>
      </Link>
    </CardShell>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ item }: { item: typeof JOB_ITEMS[0] }) {
  const { Icon } = item;
  return (
    <CardShell>
      <Link to="/jobs" className="block">
        {/* Header banner */}
        <div className="relative flex items-end overflow-hidden px-4 pb-4 pt-6" style={{ height: 160,
          background: `linear-gradient(135deg, ${item.color}33 0%, ${item.color}66 100%)` }}>
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full" style={{ background: `${item.color}20` }} />
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${item.color}30` }}>
            <Icon className="w-6 h-6" style={{ color: item.color }} />
          </div>
          {item.hot && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px]"
              style={{ background: "linear-gradient(98deg,#FA5108 0%,#FF753A 100%)", fontWeight: 700 }}>
              Горячая
            </div>
          )}
          <div className="relative z-10">
            <p className="text-[#212121]" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.5px" }}>{item.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 className="w-3.5 h-3.5 text-[#737373]" />
              <span className="text-[#737373]" style={{ fontSize: 12 }}>{item.company}</span>
              <div className="flex items-center gap-0.5 ml-1">
                <Star className="w-3 h-3 fill-[#FA5108] stroke-[#FA5108]" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#212121" }}>{item.companyRating}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="px-4 pt-3 pb-4">
          <p className="text-[#212121]" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.4px" }}>{item.salary}</p>
          <div className="flex items-center gap-1 mt-1.5 opacity-60">
            <MapPin className="w-3 h-3 shrink-0 text-[#212121]" />
            <span className="text-[#212121] line-clamp-1" style={{ fontSize: 12 }}>{item.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 opacity-60">
            <Clock className="w-3 h-3 shrink-0 text-[#212121]" />
            <span className="text-[#212121]" style={{ fontSize: 12 }}>{item.schedule}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.perks.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded-full text-[10px] bg-[#F1F0EF] text-[#737373]">{p}</span>
            ))}
          </div>
        </div>
      </Link>
    </CardShell>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, count, to, emoji }: { title: string; count: number; to: string; emoji: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <h2 className="text-[#212121]" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.4px" }}>{title}</h2>
        <span className="px-2 py-0.5 rounded-full text-[11px] text-[#737373] bg-[#F1F0EF]" style={{ fontWeight: 500 }}>
          {count}
        </span>
      </div>
      <Link to={to} className="flex items-center gap-1 text-[#FA5108] hover:opacity-75 transition-opacity"
        style={{ fontSize: 13, fontWeight: 600 }}>
        Все <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ─── Filter / Tab Bar ─────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: "all",        label: "Всё" },
  { id: "realestate", label: "Недвижимость" },
  { id: "market",     label: "Маркет" },
  { id: "services",   label: "Услуги" },
  { id: "jobs",       label: "Вакансии" },
];

function TopBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex items-center gap-2 mb-6 bg-white rounded-xl border border-[#E8E6E3] p-2.5 flex-wrap">
      {/* Search */}
      <div className="relative w-52">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
        <input
          className="w-full pl-9 pr-3 py-2 text-xs text-[#212121] bg-[#F8F7F5] rounded-lg border border-[#E8E6E3] outline-none focus:border-[#FA5108]"
          placeholder="Поиск..."
        />
      </div>
      {/* Tab pills */}
      <div className="flex items-center gap-1.5 flex-1 flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-lg text-xs border transition-all whitespace-nowrap ${
              tab === t.id
                ? "border-[#FA5108] bg-[#FA5108]/5 text-[#FA5108]"
                : "border-[#E8E6E3] text-[#737373] hover:border-[#FA5108]/40"
            }`}
            style={{ fontWeight: tab === t.id ? 700 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>
      <button className="p-2 rounded-lg border border-[#E8E6E3] text-[#737373] hover:border-[#FA5108]/40 transition-colors ml-auto">
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Advertising Banner ───────────────────────────────────────────────────────
function AdvertisingBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden my-6 bg-[#212121]" style={{ minHeight: 110 }}>
      <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border-[30px] border-white/5" />
      <div className="absolute -right-4 top-4 w-36 h-36 rounded-full border-[20px] border-white/5" />
      <div className="relative z-10 flex items-center px-6 py-4 gap-6">
        <div className="flex-1">
          <h3 className="text-white mb-2" style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.2, textTransform: "uppercase" }}>
            УВЕЛИЧИВАЙТЕ<br />ПОТОК КЛИЕНТОВ
          </h3>
          <Link to="/profile"
            className="inline-block px-4 py-1.5 bg-[#FA5108] text-white text-xs rounded-lg hover:bg-[#e04a07] transition-colors"
            style={{ fontWeight: 600 }}>
            В кабинет
          </Link>
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
            <button key={dev.id} onClick={() => toast.info(`${dev.name}: открыть профиль`)}
              className="w-full flex items-start gap-3 text-left hover:bg-[#F8F7F5] rounded-xl p-2 -mx-2 transition-colors">
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

      <div className="relative rounded-2xl overflow-hidden bg-[#212121]" style={{ minHeight: 180 }}>
        <img src={imgRect25138} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 p-5 flex flex-col justify-between h-full min-h-[180px]">
          <div className="text-white text-xs mb-2" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            КОММЕРЦИЯ<br />КВАРТИРЫ<br />ОФИСЫ<br />ДОМА
          </div>
          <Link to="/realestate" className="w-full py-2 bg-[#FA5108] text-white text-[11px] rounded-lg text-center block"
            style={{ fontWeight: 600 }}>
            Недвижимость
          </Link>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-[#212121]" style={{ minHeight: 200 }}>
        <img src={imgVertical} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 p-5 h-full min-h-[200px] flex flex-col justify-between">
          <p className="text-white/70 text-[10px] leading-loose" style={{ fontWeight: 300 }}>
            #строительство<br />#ремонт<br />#услуги<br />#маркет<br />#вакансии
          </p>
          <Link to="/services" className="w-full mt-3 py-2 bg-[#FA5108] text-white text-[11px] rounded-lg text-center block"
            style={{ fontWeight: 600 }}>
            Подрядчики
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const [tab, setTab] = useState<Tab>("all");

  const showRE      = tab === "all" || tab === "realestate";
  const showMarket  = tab === "all" || tab === "market";
  const showService = tab === "all" || tab === "services";
  const showJobs    = tab === "all" || tab === "jobs";

  return (
    <div className="bg-[#F8F7F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TopBar tab={tab} setTab={setTab} />

        <div className="flex gap-5 items-start">
          {/* ── Content ── */}
          <div className="flex-1 min-w-0">

            {/* Недвижимость */}
            {showRE && (
              <div className="mb-8">
                <SectionHeader title="Недвижимость" count={12333} to="/realestate" emoji="🏠" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {RE_LISTINGS.slice(0, tab === "all" ? 3 : 6).map((item) => (
                    <RealEstateCard key={item.id} item={item} />
                  ))}
                </div>
                {tab === "realestate" && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {RE_LISTINGS.slice(3).map((item) => (
                      <RealEstateCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Рекламный баннер (только на вкладке «Всё») */}
            {tab === "all" && <AdvertisingBanner />}

            {/* Маркет */}
            {showMarket && (
              <div className="mb-8">
                <SectionHeader title="Маркет" count={4870} to="/market" emoji="🛒" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {MARKET_ITEMS.slice(0, tab === "all" ? 3 : 6).map((item) => (
                    <MarketCard key={item.id} item={item} />
                  ))}
                </div>
                {tab === "market" && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {MARKET_ITEMS.slice(3).map((item) => (
                      <MarketCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Услуги */}
            {showService && (
              <div className="mb-8">
                <SectionHeader title="Услуги и подрядчики" count={1240} to="/services" emoji="🔧" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {SERVICE_ITEMS.slice(0, tab === "all" ? 3 : 6).map((item) => (
                    <ServiceCard key={item.id} item={item} />
                  ))}
                </div>
                {tab === "services" && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {SERVICE_ITEMS.slice(3).map((item) => (
                      <ServiceCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Вакансии */}
            {showJobs && (
              <div className="mb-8">
                <SectionHeader title="Вакансии" count={387} to="/jobs" emoji="💼" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {JOB_ITEMS.slice(0, tab === "all" ? 3 : 6).map((item) => (
                    <JobCard key={item.id} item={item} />
                  ))}
                </div>
                {tab === "jobs" && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {JOB_ITEMS.slice(3).map((item) => (
                      <JobCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Load more / баннер внизу */}
            {tab !== "all" && (
              <div className="text-center py-6">
                <button onClick={() => toast.info("Загружаем ещё...")}
                  className="px-8 py-3 border-2 border-[#FA5108] text-[#FA5108] rounded-xl text-sm hover:bg-[#FA5108]/5 transition-colors"
                  style={{ fontWeight: 600 }}>
                  Показать ещё
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="w-[240px] shrink-0 hidden xl:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}