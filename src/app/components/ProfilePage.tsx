import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  User,
  Building2,
  Settings,
  Bell,
  Heart,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Camera,
  LogOut,
  ChevronRight,
  FileText,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Briefcase,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Calendar,
  Package,
  Wrench,
  Home,
  X,
  Pause,
  Play,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "./AccountContext";
import { useListings, UserListing, ListingStatus } from "./ListingsContext";
import { TariffModal, getTariffName, getTariffDesc, DEFAULT_PLAN } from "./TariffModal";

type ActiveSection =
  | "profile"
  | "settings"
  | "notifications"
  | "favorites"
  | "orders"
  | "security"
  | "billing"
  | "listings"
  | "myservices";

// Add listing modal type
type NewListing = {
  title: string;
  type: string;
  address: string;
  price: string;
  description: string;
  deal: string;
};

const savedProperties = [
  { id: "1", title: 'ЖК «Ривьера Парк»', type: "Новостройка", price: "8 900 000 ₽", address: "ул. Речная, 15" },
  { id: "2", title: "Студия с ремонтом", type: "Вторичка", price: "5 200 000 ₽", address: "пр. Победы, 42" },
  { id: "3", title: "3-комн. у метро", type: "Аренда", price: "85 000 ₽/мес", address: "ул. Ленина, 88" },
];

const orderHistory = [
  { id: "o1", title: "Ремонт кухни", contractor: "СтройМастер Про", status: "completed", date: "15 фев 2026", amount: "285 000 ₽" },
  { id: "o2", title: "Сантехника ванной", contractor: "АкваСервис", status: "active", date: "10 мар 2026", amount: "45 000 ₽" },
  { id: "o3", title: "Бронь ЖК «Ривьера»", contractor: "—", status: "pending", date: "20 мар 2026", amount: "8 900 000 ₽" },
];

const businessListings = [
  { id: "b1", title: 'ЖК «Солнечный»', type: "Новостройка", views: 1240, responses: 18, status: "active" },
  { id: "b2", title: "Офис 120 м² на Центральной", type: "Коммерция", views: 450, responses: 5, status: "active" },
  { id: "b3", title: 'ЖК «Парковый» — 3 этаж', type: "Новостройка", views: 890, responses: 12, status: "paused" },
];

const businessOrders = [
  { id: "bo1", title: "Ремонт 2-комн. квартиры", client: "Мария К.", budget: "510 000 ₽", status: "active", progress: 43 },
  { id: "bo2", title: "Укладка плитки в ванной", client: "Дмитрий С.", budget: "45 000 ₽", status: "active", progress: 75 },
  { id: "bo3", title: "Капитальный ремонт 3-комн.", client: "Ольга П.", budget: "960 000 ₽", status: "upcoming", progress: 0 },
];

type ServiceEntry = {
  id: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
  unit: string;
};

const SERVICE_CATEGORIES = ["Ремонт", "Черновые работы", "Отделка", "Электрика", "Сантехника", "Полы", "Дизайн", "Демонтаж", "Прочее"];
const SERVICE_UNITS = ["₽/м²", "₽/час", "₽/шт", "₽/точка", "₽/м.п.", "₽/вызов", "₽/комната", "₽/мес"];

const INITIAL_SERVICES: ServiceEntry[] = [
  { id: "s1", name: "Ремонт под ключ", category: "Ремонт", priceMin: 8500, priceMax: 18000, unit: "₽/м²" },
  { id: "s2", name: "Косметический ремонт", category: "Ремонт", priceMin: 3500, priceMax: 6000, unit: "₽/м²" },
  { id: "s3", name: "Штукатурка стен", category: "Черновые работы", priceMin: 350, priceMax: 600, unit: "₽/м²" },
];

export function ProfilePage() {
  const { accountType, setAccountType, userName, isLoggedIn } = useAccount();
  const { listings, updateListingStatus, deleteListing } = useListings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileType = accountType === "individual" ? "individual" : "business";

  const tabFromUrl = searchParams.get("tab") as ActiveSection | null;
  const [activeSection, setActiveSection] = useState<ActiveSection>(tabFromUrl ?? "profile");
  const [editMode, setEditMode] = useState(false);

  // Sync URL tab → active section
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeSection) {
      setActiveSection(tabFromUrl);
    }
  }, [tabFromUrl]);

  const [previewListing, setPreviewListing] = useState<UserListing | null>(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [listingsMock, setListingsMock] = useState(businessListings);
  const [newListing, setNewListing] = useState<NewListing>({
    title: "", type: "Новостройка", address: "", price: "", description: "", deal: "buy",
  });

  // Tariff
  const [currentPlanId, setCurrentPlanId] = useState<string>(DEFAULT_PLAN[accountType]);
  const [showTariffModal, setShowTariffModal] = useState(false);

  const [myServices, setMyServices] = useState<ServiceEntry[]>(INITIAL_SERVICES);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState<Omit<ServiceEntry, "id">>({
    name: "", category: "Ремонт", priceMin: 0, priceMax: 0, unit: "₽/м²",
  });

  const [name, setName] = useState("Александр Иванов");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("+7 (999) 123-45-67");
  const [city, setCity] = useState("Москва");
  const [companyName, setCompanyName] = useState("ООО «Строй Инвест»");
  const [inn, setInn] = useState("7712345678");
  const [companyType, setCompanyType] = useState("Застройщик");

  const [notifNewListings, setNotifNewListings] = useState(true);
  const [notifPriceChanges, setNotifPriceChanges] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [notifSms, setNotifSms] = useState(false);

  const handleAddService = () => {
    if (!newService.name.trim()) { toast.error("Введите название услуги"); return; }
    if (newService.priceMin <= 0 || newService.priceMax <= 0) { toast.error("Введите цены"); return; }
    setMyServices(prev => [...prev, { ...newService, id: `s_${Date.now()}` }]);
    setNewService({ name: "", category: "Ремонт", priceMin: 0, priceMax: 0, unit: "₽/м²" });
    setShowAddService(false);
    toast.success("Услуга добавлена", { description: "Она отображается в вашем публичном профиле" });
  };

  const handleDeleteService = (id: string) => {
    setMyServices(prev => prev.filter(s => s.id !== id));
    toast("Услуга удалена");
  };

  const handleAddListing = () => {
    if (!newListing.title.trim() || !newListing.price.trim()) {
      toast.error("Заполните название и цену");
      return;
    }
    const entry = {
      id: `b_${Date.now()}`,
      title: newListing.title,
      type: newListing.type,
      views: 0,
      responses: 0,
      status: "active" as const,
    };
    setListingsMock(prev => [entry, ...prev]);
    setNewListing({ title: "", type: "Новостройка", address: "", price: "", description: "", deal: "buy" });
    setShowListingModal(false);
    toast.success("Объявление размещено!", { description: "Проходит модерацию — обычно до 2 часов" });
  };

  const individualMenuItems = [
    { id: "profile" as const, label: "Мой профиль", icon: User },
    { id: "listings" as const, label: "Мои объявления", icon: Home },
    { id: "favorites" as const, label: "Избранное", icon: Heart },
    { id: "orders" as const, label: "Мои заказы", icon: FileText },
    { id: "notifications" as const, label: "Уведомления", icon: Bell },
    { id: "security" as const, label: "Безопасность", icon: Lock },
    { id: "settings" as const, label: "Настройки", icon: Settings },
  ];

  const businessMenuItems = [
    { id: "profile" as const, label: "Профиль компании", icon: Building2 },
    { id: "myservices" as const, label: "Мои услуги", icon: Wrench },
    { id: "listings" as const, label: "Мои объявления", icon: Home },
    { id: "orders" as const, label: "Заказы и проекты", icon: Briefcase },
    { id: "billing" as const, label: "Финансы", icon: CreditCard },
    { id: "notifications" as const, label: "Уведомления", icon: Bell },
    { id: "security" as const, label: "Безопасность", icon: Lock },
    { id: "settings" as const, label: "Настройки", icon: Settings },
  ];

  const menuItems = profileType === "individual" ? individualMenuItems : businessMenuItems;

  const ToggleSwitch = ({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm text-[#212121]" style={{ fontWeight: 500 }}>{label}</div>
        {desc && <div className="text-xs text-[#737373] mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-[#FA5108]" : "bg-[#D4D2CF]"}`}>
        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm" style={{ left: value ? "22px" : "2px" }} />
      </button>
    </div>
  );

  const avatarColor = accountType === "developer" ? "bg-blue-600" : "bg-[#FA5108]/10";
  const avatarTextColor = accountType === "developer" ? "text-white" : "text-[#FA5108]";
  const accountLabel = accountType === "individual" ? "Физическое лицо" : accountType === "developer" ? "Застройщик" : "Бизнес / Агент";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile type switch */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl text-[#212121]" style={{ fontWeight: 700 }}>Личный кабинет</h1>
          <p className="text-sm text-[#737373] mt-0.5">{accountLabel}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E8E6E3] overflow-hidden">
            <div className="p-5 border-b border-[#E8E6E3]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl ${avatarColor} ${avatarTextColor}`} style={{ fontWeight: 700 }}>
                    {profileType === "individual" ? name.charAt(0) : companyName.charAt(0)}
                  </div>
                  <button onClick={() => toast("Загрузка фото профиля")} className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FA5108] rounded-full flex items-center justify-center text-white">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="min-w-0">
                  <div className="text-sm truncate" style={{ fontWeight: 600 }}>
                    {profileType === "individual" ? name : companyName}
                  </div>
                  <div className={`text-xs ${accountType === "developer" ? "text-blue-600" : "text-[#737373]"}`}>
                    {accountLabel}
                  </div>
                </div>
              </div>
            </div>
            <nav className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeSection === item.id ? "bg-[#F1F0EF] text-[#212121]" : "text-[#737373] hover:bg-[#F1F0EF]/50 hover:text-[#212121]"}`}
                  style={{ fontWeight: activeSection === item.id ? 500 : 400 }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-[#E8E6E3] mt-2 pt-2">
                <button
                  onClick={() => toast("Выход из аккаунта", { description: "Функция будет доступна после подключения авторизации" })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Выйти
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">

          {/* INDIVIDUAL profile */}
          {activeSection === "profile" && profileType === "individual" && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontWeight: 600 }}>Личные данные</h2>
                  <button
                    onClick={() => { if (editMode) toast.success("Данные сохранены"); setEditMode(!editMode); }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${editMode ? "bg-[#FA5108] text-white hover:bg-[#e04a07]" : "border border-[#E8E6E3] text-[#212121] hover:bg-[#F1F0EF]"}`}
                    style={{ fontWeight: 500 }}
                  >
                    {editMode ? "Сохранить" : "Редактировать"}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Имя и фамилия", value: name, onChange: setName, type: "text" },
                    { label: "Email", value: email, onChange: setEmail, type: "email" },
                    { label: "Телефон", value: phone, onChange: setPhone, type: "tel" },
                    { label: "Город", value: city, onChange: setCity, type: "text" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-sm text-[#737373] mb-1.5 block">{f.label}</label>
                      <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Finance widget — always visible on main page */}
              <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontWeight: 600 }}>Финансы и тариф</h2>
                  <button onClick={() => toast.info("История операций")} className="text-sm text-[#FA5108] hover:underline">История →</button>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Баланс", value: "2 400 ₽", icon: CreditCard, color: "text-[#FA5108]" },
                    { label: "Потрачено", value: "3 200 ₽", icon: TrendingUp, color: "text-blue-500" },
                    { label: "Объявлений", value: `${listings.length} / 3`, icon: Home, color: "text-green-600" },
                  ].map(s => (
                    <div key={s.label} className="p-3 bg-[#F8F7F5] rounded-xl">
                      <s.icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                      <div className="text-base" style={{ fontWeight: 700 }}>{s.value}</div>
                      <div className="text-[11px] text-[#737373]">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8F7F5] rounded-xl mb-3">
                  <div>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{getTariffName(accountType, currentPlanId)}</span>
                    <div className="text-xs text-[#737373]">{getTariffDesc(accountType, currentPlanId)}</div>
                  </div>
                  <button
                    onClick={() => setShowTariffModal(true)}
                    className="px-3 py-1.5 border border-[#E8E6E3] text-[#212121] rounded-lg text-xs hover:bg-[#F1F0EF] transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Изменить тариф
                  </button>
                </div>
                <button onClick={() => toast("Пополнение баланса")} className="w-full py-2.5 bg-[#FA5108] text-white rounded-xl text-sm hover:bg-[#e04a07] transition-colors" style={{ fontWeight: 600 }}>
                  Пополнить баланс
                </button>
              </div>
            </div>
          )}

          {/* BUSINESS / DEVELOPER profile */}
          {activeSection === "profile" && profileType === "business" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontWeight: 600 }}>Данные компании</h2>
                  <button
                    onClick={() => { if (editMode) toast.success("Данные компании сохранены"); setEditMode(!editMode); }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${editMode ? "bg-[#FA5108] text-white hover:bg-[#e04a07]" : "border border-[#E8E6E3] text-[#212121] hover:bg-[#F1F0EF]"}`}
                    style={{ fontWeight: 500 }}
                  >
                    {editMode ? "Сохранить" : "Редактировать"}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className="text-sm text-[#737373] mb-1.5 block">Название компании</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60" /></div>
                  <div><label className="text-sm text-[#737373] mb-1.5 block">ИНН</label><input type="text" value={inn} onChange={(e) => setInn(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60" /></div>
                  <div><label className="text-sm text-[#737373] mb-1.5 block">Тип деятельности</label><select value={companyType} onChange={(e) => setCompanyType(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60 appearance-none"><option>Застройщик</option><option>Подрядчик</option><option>Агентство недвижимости</option><option>Поставщик материалов</option></select></div>
                  <div><label className="text-sm text-[#737373] mb-1.5 block">Город</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60" /></div>
                  <div><label className="text-sm text-[#737373] mb-1.5 block">Телефон</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60" /></div>
                  <div><label className="text-sm text-[#737373] mb-1.5 block">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editMode} className="w-full px-4 py-3 bg-[#F1F0EF] rounded-lg disabled:opacity-60" /></div>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: "Активные объявления", value: "3", icon: Home, color: "text-[#FA5108]" },
                  { label: "Просмотры (мес.)", value: "2 580", icon: Eye, color: "text-blue-500" },
                  { label: "Отклики", value: "35", icon: MessageSquare, color: "text-green-600" },
                  { label: "Средний рейтинг", value: "4.8", icon: Star, color: "text-yellow-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-[#E8E6E3] p-4">
                    <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <div className="text-xl" style={{ fontWeight: 700 }}>{s.value}</div>
                    <div className="text-xs text-[#737373]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY SERVICES */}
          {activeSection === "myservices" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 style={{ fontWeight: 600 }}>Мои услуги</h2>
                  <p className="text-sm text-[#737373] mt-0.5">Отображаются в вашем публичном профиле</p>
                </div>
                <button
                  onClick={() => setShowAddService(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] transition-colors text-sm"
                  style={{ fontWeight: 600 }}
                >
                  <Plus className="w-4 h-4" /> Добавить услугу
                </button>
              </div>

              {/* Add form */}
              {showAddService && (
                <div className="bg-white rounded-xl border-2 border-[#FA5108]/30 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontWeight: 600 }} className="text-sm">Новая услуга</h3>
                    <button onClick={() => setShowAddService(false)} className="p-1 text-[#737373] hover:text-[#212121]"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs text-[#737373] mb-1 block">Название услуги</label>
                      <input type="text" placeholder="Например: Укладка плитки" value={newService.name} onChange={(e) => setNewService(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 bg-[#F1F0EF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20" />
                    </div>
                    <div>
                      <label className="text-xs text-[#737373] mb-1 block">Категория</label>
                      <select value={newService.category} onChange={(e) => setNewService(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 bg-[#F1F0EF] rounded-lg text-sm appearance-none">
                        {SERVICE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#737373] mb-1 block">Единица</label>
                      <select value={newService.unit} onChange={(e) => setNewService(p => ({ ...p, unit: e.target.value }))} className="w-full px-3 py-2.5 bg-[#F1F0EF] rounded-lg text-sm appearance-none">
                        {SERVICE_UNITS.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#737373] mb-1 block">Цена от (₽)</label>
                      <input type="number" placeholder="500" value={newService.priceMin || ""} onChange={(e) => setNewService(p => ({ ...p, priceMin: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-[#F1F0EF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20" />
                    </div>
                    <div>
                      <label className="text-xs text-[#737373] mb-1 block">Цена до (₽)</label>
                      <input type="number" placeholder="1 500" value={newService.priceMax || ""} onChange={(e) => setNewService(p => ({ ...p, priceMax: Number(e.target.value) }))} className="w-full px-3 py-2.5 bg-[#F1F0EF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddService} className="px-5 py-2.5 bg-[#FA5108] text-white rounded-lg text-sm hover:bg-[#e04a07] transition-colors" style={{ fontWeight: 600 }}>Сохранить</button>
                    <button onClick={() => setShowAddService(false)} className="px-5 py-2.5 border border-[#E8E6E3] text-[#737373] rounded-lg text-sm hover:bg-[#F1F0EF] transition-colors">Отмена</button>
                  </div>
                </div>
              )}

              {/* Grouped list */}
              {myServices.length > 0 ? (() => {
                const grouped = myServices.reduce<Record<string, ServiceEntry[]>>((acc, s) => {
                  if (!acc[s.category]) acc[s.category] = [];
                  acc[s.category].push(s);
                  return acc;
                }, {});
                return Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="text-xs text-[#737373] mb-2 px-1" style={{ fontWeight: 600 }}>{cat.toUpperCase()}</div>
                    <div className="bg-white rounded-xl border border-[#E8E6E3] overflow-hidden">
                      {items.map((s, i) => (
                        <div key={s.id} className={`flex items-center gap-4 px-4 py-3.5 ${i !== items.length - 1 ? "border-b border-[#F1F0EF]" : ""}`}>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[#212121]" style={{ fontWeight: 500 }}>{s.name}</div>
                          </div>
                          <div className="text-right shrink-0 mr-2">
                            <div className="text-sm text-[#FA5108]" style={{ fontWeight: 700 }}>
                              {s.priceMin.toLocaleString("ru")} – {s.priceMax.toLocaleString("ru")}
                            </div>
                            <div className="text-[11px] text-[#737373]">{s.unit}</div>
                          </div>
                          <button onClick={() => handleDeleteService(s.id)} className="p-1.5 text-[#737373] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })() : (
                <div className="text-center py-16 text-[#737373] bg-white rounded-xl border border-[#E8E6E3]">
                  <Wrench className="w-12 h-12 mx-auto mb-3 text-[#D4D2CF]" />
                  <p style={{ fontWeight: 500 }}>Услуги не добавлены</p>
                  <p className="text-sm mt-1">Добавьте виды работ и цены — клиенты сразу увидят их в профиле</p>
                  <button onClick={() => setShowAddService(true)} className="mt-4 px-5 py-2.5 bg-[#FA5108] text-white rounded-lg text-sm hover:bg-[#e04a07] inline-flex items-center gap-2" style={{ fontWeight: 600 }}>
                    <Plus className="w-4 h-4" /> Добавить первую услугу
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Favorites */}
          {activeSection === "favorites" && (
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
              <h2 className="mb-4" style={{ fontWeight: 600 }}>Избранное</h2>
              <div className="space-y-3">
                {savedProperties.map((p) => (
                  <Link key={p.id} to={`/realestate/${p.id}`} className="flex items-center justify-between p-4 rounded-lg border border-[#E8E6E3] hover:border-[#FA5108]/20 hover:shadow-sm transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 500 }}>{p.title}</span>
                        <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{p.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#737373] mt-1"><MapPin className="w-3 h-3" /> {p.address}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#212121]" style={{ fontWeight: 600 }}>{p.price}</span>
                      <button onClick={(e) => { e.preventDefault(); toast("Удалено из избранного"); }} className="p-1.5 text-[#737373] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Orders Individual */}
          {activeSection === "orders" && profileType === "individual" && (
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
              <h2 className="mb-4" style={{ fontWeight: 600 }}>Мои заказы</h2>
              <div className="space-y-3">
                {orderHistory.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-4 rounded-lg border border-[#E8E6E3]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 500 }}>{o.title}</span>
                        <span className={`px-2 py-0.5 text-xs rounded ${o.status === "completed" ? "bg-green-100 text-green-600" : o.status === "active" ? "bg-[#FA5108]/10 text-[#FA5108]" : "bg-[#F1F0EF] text-[#737373]"}`}>
                          {o.status === "completed" ? "Завершён" : o.status === "active" ? "В работе" : "Ожидание"}
                        </span>
                      </div>
                      <div className="text-xs text-[#737373] mt-1">{o.contractor !== "—" ? `Подрядчик: ${o.contractor} · ` : ""}{o.date}</div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontWeight: 600 }}>{o.amount}</div>
                      <button onClick={() => toast.info("Детали заказа")} className="text-xs text-[#FA5108] hover:underline">Подробнее</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Business */}
          {activeSection === "orders" && profileType === "business" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 style={{ fontWeight: 600 }}>Заказы и проекты</h2>
                <Link to="/dashboard" className="text-sm text-[#FA5108] flex items-center gap-1 hover:underline" style={{ fontWeight: 500 }}>Полный дашборд <ArrowRight className="w-4 h-4" /></Link>
              </div>
              {businessOrders.map((o) => (
                <div key={o.id} className="bg-white rounded-xl border border-[#E8E6E3] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 500 }}>{o.title}</span>
                      <span className={`px-2 py-0.5 text-xs rounded ${o.status === "active" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>{o.status === "active" ? "В работе" : "Предстоит"}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{o.budget}</span>
                  </div>
                  <div className="text-sm text-[#737373] mb-3">Заказчик: {o.client}</div>
                  {o.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-[#737373] mb-1"><span>Прогресс</span><span>{o.progress}%</span></div>
                      <div className="h-2 bg-[#F1F0EF] rounded-full"><div className="h-full bg-[#FA5108] rounded-full" style={{ width: `${o.progress}%` }} /></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Listings — ALL USERS */}
          {activeSection === "listings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 style={{ fontWeight: 600 }}>Мои объявления</h2>
                  <p className="text-sm text-[#737373] mt-0.5">
                    {listings.length > 0 ? `${listings.length} объявл.` : "Нет активных объявлений"}
                  </p>
                </div>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E6E3]">
                  <Home className="w-14 h-14 mx-auto mb-4 text-[#D4D2CF]" />
                  <p className="text-[#212121]" style={{ fontWeight: 600 }}>Объявлений пока нет</p>
                  <p className="text-sm text-[#737373] mt-1 mb-4">Разместите первое объявление — это займёт 5 минут</p>
                  <Link
                    to="/post"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
                  >
                    <Plus className="w-4 h-4" /> Разместить объявление
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.map((l) => (
                    <ListingCard
                      key={l.id}
                      listing={l}
                      onStatusChange={(id, status) => {
                        updateListingStatus(id, status);
                        toast.success(
                          status === "active" ? "Объявление активировано" :
                          status === "paused" ? "Объявление приостановлено" :
                          "Статус обновлён"
                        );
                      }}
                      onDelete={(id) => {
                        deleteListing(id);
                        toast("Объявление удалено");
                      }}
                      onEdit={() => navigate("/post")}
                      onPreview={(l) => setPreviewListing(l)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Listings — BUSINESS mock */}
          {activeSection === "listings" && false && profileType === "business" && (
            <div />
          )}

          {/* Billing */}
          {activeSection === "billing" && profileType === "business" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
                <h2 className="mb-4" style={{ fontWeight: 600 }}>Финансы</h2>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[{ label: "Баланс", value: "45 200 ₽" }, { label: "Потрачено (мес.)", value: "12 800 ₽" }, { label: "На эскроу", value: "510 000 ₽" }].map(s => (
                    <div key={s.label} className="p-4 bg-[#F1F0EF] rounded-lg">
                      <div className="text-xs text-[#737373] mb-1">{s.label}</div>
                      <div className="text-xl" style={{ fontWeight: 700 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => toast("Пополнение баланса")} className="px-4 py-2 bg-[#FA5108] text-white rounded-lg text-sm hover:bg-[#e04a07]" style={{ fontWeight: 600 }}>Пополнить</button>
                  <button onClick={() => toast.info("История операций")} className="px-4 py-2 border border-[#E8E6E3] rounded-lg text-sm hover:bg-[#F1F0EF]">История операций</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Тарифный план</h3>
                <div className="flex items-center justify-between p-4 bg-[#FA5108]/5 border border-[#FA5108]/20 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 600 }}>{getTariffName(accountType, currentPlanId)}</span>
                      <span className="px-2 py-0.5 bg-[#FA5108] text-white text-xs rounded-full">Активен</span>
                    </div>
                    <div className="text-sm text-[#737373] mt-0.5">{getTariffDesc(accountType, currentPlanId)}</div>
                  </div>
                  <button
                    onClick={() => setShowTariffModal(true)}
                    className="px-4 py-2 border border-[#E8E6E3] rounded-xl text-sm hover:bg-[#F1F0EF] transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Изменить тариф
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
              <h2 className="mb-4" style={{ fontWeight: 600 }}>Настройки уведомлений</h2>
              <div className="divide-y divide-[#E8E6E3]">
                <ToggleSwitch value={notifNewListings} onChange={setNotifNewListings} label="Новые объявления" desc="По вашим фильтрам" />
                <ToggleSwitch value={notifPriceChanges} onChange={setNotifPriceChanges} label="Изменение цен" desc="В избранном" />
                <ToggleSwitch value={notifMessages} onChange={setNotifMessages} label="Сообщения" />
                <ToggleSwitch value={notifOrders} onChange={setNotifOrders} label="Статусы заказов" />
                <ToggleSwitch value={notifMarketing} onChange={setNotifMarketing} label="Маркетинг" />
                <ToggleSwitch value={notifSms} onChange={setNotifSms} label="SMS-уведомления" />
              </div>
              <button onClick={() => toast.success("Сохранено")} className="mt-4 px-6 py-2.5 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] text-sm" style={{ fontWeight: 600 }}>Сохранить</button>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
              <h2 className="mb-4" style={{ fontWeight: 600 }}>Безопасность</h2>
              <div className="space-y-3">
                {[
                  { icon: Lock, title: "Пароль", desc: "Последнее изменение: 15 янв 2026", action: "Изменить", primary: false, onClick: () => toast("Изменение пароля") },
                  { icon: ShieldCheck, title: "Двухфакторная аутентификация", desc: "Не настроена", action: "Включить", primary: true, onClick: () => toast("Настройка 2FA") },
                  { icon: Globe, title: "Активные сессии", desc: "2 устройства", action: "Завершить все", primary: false, onClick: () => toast.success("Сессии завершены") },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-4 bg-[#F1F0EF] rounded-lg">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-[#737373]" />
                      <div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{item.title}</div>
                        <div className="text-xs text-[#737373]">{item.desc}</div>
                      </div>
                    </div>
                    <button onClick={item.onClick} className={`px-3 py-1.5 rounded-lg text-sm ${item.primary ? "bg-[#FA5108] text-white hover:bg-[#e04a07]" : "border border-[#E8E6E3] hover:bg-white"}`}>{item.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <div className="bg-white rounded-xl border border-[#E8E6E3] p-6">
              <h2 className="mb-4" style={{ fontWeight: 600 }}>Настройки</h2>
              <div className="space-y-3">
                {["Язык интерфейса", "Валюта", "Часовой пояс"].map((s) => (
                  <div key={s} className="flex items-center justify-between p-4 bg-[#F1F0EF] rounded-lg">
                    <span className="text-sm">{s}</span>
                    <button onClick={() => toast.info(s)} className="text-sm text-[#FA5108] hover:underline">Изменить</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Tariff Modal ── */}
      {showTariffModal && (
        <TariffModal
          accountType={accountType}
          currentPlanId={currentPlanId}
          onClose={() => setShowTariffModal(false)}
          onChangePlan={(planId, planName) => {
            setCurrentPlanId(planId);
            toast.success(`Тариф «${planName}» подключён`, {
              description: "Изменения вступят в силу немедленно",
            });
          }}
        />
      )}

      {/* ── Listing Preview Modal ── */}
      {previewListing && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewListing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F1F0EF]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#737373]" />
                <span className="text-sm text-[#737373]" style={{ fontWeight: 500 }}>Предпросмотр — так видит покупатель</span>
              </div>
              <button onClick={() => setPreviewListing(null)} className="p-1.5 text-[#737373] hover:text-[#212121] hover:bg-[#F1F0EF] rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Photos */}
            {previewListing.photos.length > 0 ? (
              <div className="relative">
                <img src={previewListing.photos[0]} alt="" className="w-full h-64 object-cover" />
                {previewListing.photos.length > 1 && (
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    {previewListing.photos.slice(0, 5).map((src, i) => (
                      <img key={i} src={src} alt="" className="w-12 h-10 object-cover rounded-lg border-2 border-white opacity-80 hover:opacity-100 cursor-pointer" />
                    ))}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs rounded-lg text-[#212121]" style={{ fontWeight: 600 }}>{previewListing.photos.length} фото</span>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-[#F8F7F5] flex items-center justify-center text-[#BBBBBB] text-sm gap-2">
                <Camera className="w-5 h-5" /> Нет фотографий
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{previewListing.category}</span>
                {previewListing.subcategory && <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{previewListing.subcategory}</span>}
                {previewListing.dealType && <span className="px-2 py-0.5 bg-[#FA5108]/10 text-xs text-[#FA5108] rounded">{previewListing.dealType}</span>}
              </div>
              <h2 className="text-[#212121] mb-2" style={{ fontWeight: 700, fontSize: "1.2rem" }}>{previewListing.title}</h2>
              <div className="text-[#FA5108] mb-4" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                {previewListing.price ? `${previewListing.price} ${previewListing.priceUnit}` : "Цена не указана"}
              </div>
              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[
                  previewListing.area ? { label: "Площадь", value: `${previewListing.area} м²` } : null,
                  previewListing.rooms ? { label: "Комнаты", value: previewListing.rooms } : null,
                  (previewListing.floor && previewListing.totalFloors) ? { label: "Этаж", value: `${previewListing.floor} / ${previewListing.totalFloors}` } : null,
                  previewListing.condition ? { label: "Состояние", value: previewListing.condition } : null,
                  previewListing.houseType ? { label: "Тип дома", value: previewListing.houseType } : null,
                  previewListing.experience ? { label: "Опыт", value: previewListing.experience } : null,
                  previewListing.employmentType ? { label: "Занятость", value: previewListing.employmentType } : null,
                ].filter((d): d is { label: string; value: string } => d !== null).map(d => (
                  <div key={d.label} className="p-3 bg-[#F8F7F5] rounded-xl">
                    <div className="text-[10px] text-[#737373] mb-0.5">{d.label}</div>
                    <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>{d.value}</div>
                  </div>
                ))}
              </div>
              {previewListing.address && (
                <div className="flex items-center gap-2 text-sm text-[#737373] mb-4">
                  <MapPin className="w-4 h-4 text-[#FA5108] shrink-0" />
                  <span>{previewListing.address}</span>
                </div>
              )}
              {previewListing.description && (
                <div className="mb-4">
                  <div className="text-sm text-[#212121] mb-1" style={{ fontWeight: 600 }}>Описание</div>
                  <p className="text-sm text-[#737373] leading-relaxed">{previewListing.description}</p>
                </div>
              )}
              <div className="border-t border-[#F1F0EF] pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FA5108]/10 flex items-center justify-center text-[#FA5108]" style={{ fontWeight: 700 }}>
                    {userName?.charAt(0)?.toUpperCase() || "П"}
                  </div>
                  <div>
                    <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>{userName || "Продавец"}</div>
                    <div className="text-xs text-[#737373]">Опубликовано {previewListing.createdAt}</div>
                  </div>
                </div>
                <button onClick={() => toast.success("Это ваше объявление")} className="px-4 py-2 bg-[#FA5108] text-white rounded-xl text-sm hover:bg-[#e04a07] transition-colors" style={{ fontWeight: 600 }}>
                  Связаться
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type ListingCardProps = {
  listing: UserListing;
  onStatusChange: (id: string, status: ListingStatus) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onPreview: (l: UserListing) => void;
};

function ListingCard({ listing, onStatusChange, onDelete, onEdit, onPreview }: ListingCardProps) {
  const isActive = listing.status === "active";
  const isMod = listing.status === "moderation";

  const statusLabel =
    listing.status === "active" ? "Активно" :
    listing.status === "paused" ? "На паузе" :
    listing.status === "moderation" ? "Модерация" : "Отклонено";

  const statusColor =
    listing.status === "active" ? "bg-green-100 text-green-600" :
    listing.status === "paused" ? "bg-yellow-100 text-yellow-700" :
    listing.status === "moderation" ? "bg-blue-100 text-blue-600" :
    "bg-red-100 text-red-600";

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#F1F0EF]">
          {listing.photos.length > 0 ? (
            <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#BBBBBB]">
              <Camera className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <h3 className="text-sm text-[#212121] truncate" style={{ fontWeight: 600 }}>{listing.title}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${statusColor}`} style={{ fontWeight: 500 }}>{statusLabel}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{listing.category}</span>
            {listing.subcategory && <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{listing.subcategory}</span>}
          </div>

          {listing.price && (
            <div className="text-sm text-[#FA5108] mb-1" style={{ fontWeight: 700 }}>
              {listing.price} {listing.priceUnit}
            </div>
          )}

          {listing.address && (
            <div className="flex items-center gap-1 text-xs text-[#737373]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{listing.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats + Actions */}
      <div className="border-t border-[#F1F0EF] px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs text-[#737373]">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {listing.views} просмотров</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {listing.responses} откликов</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {listing.createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview */}
          <button
            onClick={() => onPreview(listing)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E6E3] rounded-lg text-xs text-[#737373] hover:bg-[#F1F0EF] hover:text-[#212121] transition-colors"
          >
            <Eye className="w-3 h-3" /> Просмотр
          </button>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E6E3] rounded-lg text-xs text-[#737373] hover:bg-[#F1F0EF] hover:text-[#212121] transition-colors"
          >
            <Edit3 className="w-3 h-3" /> Изменить
          </button>

          {/* Pause / Activate */}
          {!isMod && (
            <button
              onClick={() => onStatusChange(listing.id, isActive ? "paused" : "active")}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs transition-colors ${
                isActive
                  ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  : "border-green-300 text-green-700 hover:bg-green-50"
              }`}
            >
              {isActive ? (
                <><Pause className="w-3 h-3" /> Пауза</>
              ) : (
                <><Play className="w-3 h-3" /> Активировать</>
              )}
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(listing.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Удалить
          </button>
        </div>
      </div>
    </div>
  );
}