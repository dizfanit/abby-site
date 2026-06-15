import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Share2,
  BedDouble,
  Ruler,
  Building2,
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const IMG1 = "/remote-images/unsplash-020.jpg";
const IMG2 = "/remote-images/unsplash-019.jpg";
const IMG3 = "/remote-images/unsplash-037.jpg";
const IMG4 = "/remote-images/unsplash-004.jpg";

const images = [IMG1, IMG2, IMG3, IMG4];

export function PropertyDetail() {
  const { id } = useParams();
  const [currentImg, setCurrentImg] = useState(0);
  const [booked, setBooked] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/realestate" className="hover:text-primary">Каталог</Link>
        <span>/</span>
        <span className="text-foreground">ЖК «Ривьера Парк»</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Images & Details */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="relative rounded-xl overflow-hidden mb-4">
            <ImageWithFallback
              src={images[currentImg]}
              alt="Property"
              className="w-full h-[400px] object-cover"
            />
            <button
              onClick={() => setCurrentImg((currentImg - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImg((currentImg + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-1 bg-primary text-white text-xs rounded">Новостройка</span>
              <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded">
                <ShieldCheck className="w-3 h-3" /> Проверено
              </span>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => {
                  setLiked(!liked);
                  toast.success(liked ? "Удалено из избранного" : "Добавлено в избранное");
                }}
                className="absolute top-3 right-3 flex gap-2"
              >
                <span className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors">
                  <Heart className={`w-4 h-4 ${liked ? "fill-[#FA5108] text-[#FA5108]" : "text-[#737373]"}`} />
                </span>
              </button>
              <button
                onClick={() => { toast.success("Ссылка скопирована"); }}
                className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#737373]" />
              </button>
            </div>
          </div>
          <div className="flex gap-2 mb-8">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`rounded-lg overflow-hidden border-2 transition-colors ${
                  i === currentImg ? "border-primary" : "border-transparent"
                }`}
              >
                <ImageWithFallback src={img} alt="" className="w-20 h-14 object-cover" />
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl text-foreground mb-2" style={{ fontWeight: 700 }}>
                ЖК «Ривьера Парк» — 2-комнатная квартира
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> ул. Речная, 15, Москва</span>
                <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-yellow-400" /> 4.8</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: BedDouble, label: "Комнаты", value: "2" },
                { icon: Ruler, label: "Площадь", value: "60 м²" },
                { icon: Building2, label: "Этаж", value: "7 / 25" },
                { icon: Calendar, label: "Сдача", value: "Q4 2026" },
              ].map((item) => (
                <div key={item.label} className="bg-muted rounded-lg p-4 text-center">
                  <item.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div style={{ fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg mb-3" style={{ fontWeight: 600 }}>Описание</h2>
              <p className="text-muted-foreground">
                Просторная двухкомнатная квартира в новом жилом комплексе «Ривьера Парк».
                Панорамные окна, высокие потолки 3.1 м, кухня-гостиная 25 м². Рядом парк, 
                школа и детский сад. Подземный паркинг. Квартира без отделки — возможность 
                сделать ремонт по вашему вкусу.
              </p>
            </div>

            <div>
              <h2 className="text-lg mb-3" style={{ fontWeight: 600 }}>Характеристики</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Тип дома", "Монолитный"],
                  ["Потолки", "3.1 м"],
                  ["Отделка", "Без отделки"],
                  ["Паркинг", "Подземный"],
                  ["Класс", "Комфорт+"],
                  ["Застройщик", "СтройИнвест"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="text-3xl text-foreground mb-1" style={{ fontWeight: 700 }}>8 900 000 ₽</div>
              <div className="text-sm text-muted-foreground mb-6">148 333 ₽/м²</div>

              {!booked ? (
                <button
                  onClick={() => { setBooked(true); toast.success("Квартира забронирована! Цена зафиксирована на 48 часов."); }}
                  className="w-full py-3 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] transition-colors mb-3"
                  style={{ fontWeight: 600 }}
                >
                  <Bookmark className="w-5 h-5 inline mr-2" />
                  Забронировать онлайн
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-2 text-green-700" style={{ fontWeight: 600 }}>
                    <CheckCircle2 className="w-5 h-5" />
                    Забронировано!
                  </div>
                  <p className="text-sm text-green-600 mt-1">Цена зафиксирована на 48 часов</p>
                </div>
              )}

              <Link
                to="/deal"
                className="w-full py-3 bg-[#212121] text-white rounded-lg hover:bg-[#212121]/90 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                Перейти к сделке <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => toast("Звонок менеджеру", { description: "+7 (495) 123-45-67" })}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-[#F1F0EF] transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-4 h-4" /> Позвонить
                </button>
                <button
                  onClick={() => toast.success("Чат открыт")}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-[#F1F0EF] transition-colors flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" /> Написать
                </button>
              </div>
            </div>

            {/* Agent card */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary" style={{ fontWeight: 600 }}>
                  АК
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Алексей Козлов</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    Верифицированный агент
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>4.9 · 127 сделок</span>
              </div>
            </div>

            {/* Cross-vertical: What's next */}
            <div className="bg-[#F1F0EF] rounded-xl border border-border p-6">
              <h3 className="mb-2" style={{ fontWeight: 600 }}>Купите квартиру? Что дальше?</h3>
              <p className="text-sm text-[#737373] mb-3">
                12 проверенных подрядчиков уже делали ремонт в этом ЖК
              </p>
              <Link
                to="/services"
                className="text-sm text-[#FA5108] flex items-center gap-1 hover:underline"
                style={{ fontWeight: 500 }}
              >
                Найти подрядчика <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}