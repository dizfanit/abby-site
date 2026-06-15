import { useState } from "react";
import { Link } from "react-router";
import {
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Calendar,
  Bell,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight,
  Eye,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const orders = [
  {
    id: "1",
    title: "Ремонт 2-комн. квартиры",
    client: "Мария К.",
    location: "ЖК «Ривьера Парк», 60 м²",
    budget: "510 000 ₽",
    deadline: "10 апреля 2026",
    status: "active" as const,
    progress: 43,
  },
  {
    id: "2",
    title: "Укладка плитки в ванной",
    client: "Дмитрий С.",
    location: "ул. Садовая, 12",
    budget: "45 000 ₽",
    deadline: "25 марта 2026",
    status: "active" as const,
    progress: 75,
  },
  {
    id: "3",
    title: "Капитальный ремонт 3-комн.",
    client: "Ольга П.",
    location: "ЖК «Зелёный Квартал», 80 м²",
    budget: "960 000 ₽",
    deadline: "Май 2026",
    status: "upcoming" as const,
    progress: 0,
  },
];

const incomingOrders = [
  {
    id: "i1",
    title: "Косметический ремонт студии",
    area: "30 м²",
    budget: "от 165 000 ₽",
    location: "ЖК «Солнечный», Москва",
    date: "Сегодня",
    urgent: false,
  },
  {
    id: "i2",
    title: "Замена сантехники (срочно)",
    area: "—",
    budget: "от 25 000 ₽",
    location: "ул. Центральная, 1",
    date: "Сегодня",
    urgent: true,
  },
  {
    id: "i3",
    title: "Ремонт кухни с заменой фартука",
    area: "12 м²",
    budget: "от 85 000 ₽",
    location: "ЖК «Парковый», Москва",
    date: "Вчера",
    urgent: false,
  },
];

const calendarDays = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(2026, 2, 15 + i);
  const busy = [0, 1, 2, 3, 5, 6, 7, 8, 10, 11].includes(i);
  return {
    day: date.getDate(),
    weekday: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()],
    busy,
    today: i === 3,
  };
});

export function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "incoming" | "calendar">("orders");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl text-foreground mb-1" style={{ fontWeight: 700 }}>Дашборд подрядчика</h1>
          <p className="text-muted-foreground">СтройМастер Про · Москва</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 border border-border rounded-lg hover:bg-muted">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          <Link
            to="/contractor/1"
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted flex items-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" /> Мой профиль
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Активные заказы", value: "2", icon: Briefcase, color: "text-primary" },
          { label: "Заработано (мес.)", value: "285 000 ₽", icon: DollarSign, color: "text-green-600" },
          { label: "Рейтинг", value: "4.9", icon: Star, color: "text-yellow-500" },
          { label: "Отзывов", value: "156", icon: MessageSquare, color: "text-blue-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl" style={{ fontWeight: 700 }}>{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 max-w-md">
        {([
          { val: "orders" as const, label: "Мои заказы" },
          { val: "incoming" as const, label: "Входящие (3)" },
          { val: "calendar" as const, label: "Календарь" },
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

      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ fontWeight: 600 }}>{order.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      order.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {order.status === "active" ? "В работе" : "Предстоит"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {order.client} · <MapPin className="w-3.5 h-3.5 inline" /> {order.location}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" /> {order.budget}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" /> до {order.deadline}
                    </span>
                  </div>
                  {order.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Прогресс</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/timeline"
                  className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted flex items-center gap-1"
                >
                  Подробнее <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "incoming" && (
        <div className="space-y-4">
          {incomingOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ fontWeight: 600 }}>{order.title}</h3>
                    {order.urgent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                        <AlertCircle className="w-3 h-3" /> Срочно
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3.5 h-3.5 inline" /> {order.location}
                    {order.area !== "—" && ` · ${order.area}`}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-foreground" style={{ fontWeight: 600 }}>{order.budget}</span>
                    <span className="text-muted-foreground">{order.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.success("Вы откликнулись на заказ. Заказчик получит уведомление.")}
                    className="px-4 py-2 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] text-sm"
                    style={{ fontWeight: 600 }}>
                    Откликнуться
                  </button>
                  <button
                    onClick={() => toast("Заказ пропущен")}
                    className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-[#F1F0EF]">
                    Пропустить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Загрузка на 2 недели</h3>
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
            {calendarDays.map((d) => (
              <div
                key={d.day}
                className={`text-center p-3 rounded-lg ${
                  d.today
                    ? "bg-primary text-white"
                    : d.busy
                    ? "bg-red-50 border border-red-200"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <div className="text-xs text-inherit opacity-70">{d.weekday}</div>
                <div style={{ fontWeight: 600 }}>{d.day}</div>
                <div className={`text-xs mt-1 ${d.today ? "text-white/80" : d.busy ? "text-red-500" : "text-green-600"}`}>
                  {d.busy ? "Занят" : "Свободен"}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded" /> Занят
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded" /> Свободен
            </span>
          </div>
        </div>
      )}
    </div>
  );
}