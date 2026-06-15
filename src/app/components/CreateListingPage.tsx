import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2, Wrench, ShoppingBag, Briefcase,
  ChevronRight, ArrowLeft, Check, Upload,
  MapPin, Camera, X, Plus, Info,
  Home, Layers, Store, Trees, Car, Sofa,
  Zap, Droplets, HardHat, Paintbrush, Hammer,
  Package, Settings, ChevronDown, Star, Clock,
  FileText, ShieldCheck, AlertCircle, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "./AccountContext";
import { useListings } from "./ListingsContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type CategoryId = "realestate" | "services" | "market" | "jobs";
type Step = "category" | "subcategory" | "details" | "photos" | "documents" | "preview";

interface Category {
  id: CategoryId;
  label: string;
  desc: string;
  count: string;
  icon: React.FC<{ className?: string }>;
  gradient: string;
  bg: string;
}

interface Subcategory {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: "realestate",
    label: "Недвижимость",
    desc: "Продажа, покупка и аренда квартир, домов, коммерческих объектов",
    count: "12 333",
    icon: Building2,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    id: "services",
    label: "Услуги и подрядчики",
    desc: "Ремонт, строительство, отделка, сантехника, электрика и другие работы",
    count: "485",
    icon: Wrench,
    gradient: "from-[#FA5108] to-[#FF753A]",
    bg: "bg-[#FFF5F0] border-[#FA5108]/30",
  },
  {
    id: "market",
    label: "Строительные товары",
    desc: "Материалы, инструменты, оборудование, сантехника, электрика",
    count: "2 140",
    icon: ShoppingBag,
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-50 border-green-200",
  },
  {
    id: "jobs",
    label: "Вакансии / Работа",
    desc: "Поиск сотрудников и работы в строительной и ремонтной сфере",
    count: "43 076",
    icon: Briefcase,
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
];

const SUBCATEGORIES: Record<CategoryId, Subcategory[]> = {
  realestate: [
    { id: "apartment", label: "Квартира", icon: Home },
    { id: "house", label: "Дом / Дача / Коттедж", icon: Home },
    { id: "land", label: "Земельный участок", icon: Trees },
    { id: "commercial", label: "Коммерческая недвижимость", icon: Store },
    { id: "garage", label: "Гараж / Машиноместо", icon: Car },
    { id: "room", label: "Комната / Доля", icon: Sofa },
    { id: "newbuilding", label: "Новостройка от застройщика", icon: Building2 },
    { id: "foreign", label: "Зарубежная недвижимость", icon: Layers },
  ],
  services: [
    { id: "repair_full", label: "Ремонт под ключ", icon: Hammer },
    { id: "repair_cosmetic", label: "Косметический ремонт", icon: Paintbrush },
    { id: "plumbing", label: "Сантехника и отопление", icon: Droplets },
    { id: "electrical", label: "Электромонтажные работы", icon: Zap },
    { id: "design", label: "Дизайн интерьера", icon: Paintbrush },
    { id: "construction", label: "Строительство под ключ", icon: HardHat },
    { id: "demolition", label: "Демонтажные работы", icon: Hammer },
    { id: "roofing", label: "Кровля и фасад", icon: Home },
    { id: "windows", label: "Окна и двери", icon: Layers },
    { id: "flooring", label: "Укладка полов", icon: Layers },
    { id: "tiling", label: "Плиточные работы", icon: Layers },
    { id: "other_service", label: "Другие услуги", icon: Settings },
  ],
  market: [
    { id: "building_materials", label: "Строительные материалы", icon: Layers },
    { id: "finishing", label: "Отделочные материалы", icon: Paintbrush },
    { id: "tools", label: "Инструменты и оборудование", icon: Hammer },
    { id: "plumbing_goods", label: "Сантехника", icon: Droplets },
    { id: "electrical_goods", label: "Электрика", icon: Zap },
    { id: "roofing_goods", label: "Кровельные материалы", icon: Home },
    { id: "doors_windows", label: "Двери и окна", icon: Store },
    { id: "hardware", label: "Крепёж и фурнитура", icon: Settings },
    { id: "furniture", label: "Мебель для строителей", icon: Sofa },
    { id: "other_goods", label: "Други товары", icon: ShoppingBag },
  ],
  jobs: [
    { id: "foreman", label: "Прораб / Мастер", icon: HardHat },
    { id: "finisher", label: "Отделочник / Маляр", icon: Paintbrush },
    { id: "bricklayer", label: "Каменщик / Монтажник", icon: Hammer },
    { id: "welder", label: "Сварщик", icon: Zap },
    { id: "electrician", label: "Электрик", icon: Zap },
    { id: "plumber_job", label: "Сантехник", icon: Droplets },
    { id: "loader", label: "Грузчик / Разнорабочий", icon: Package },
    { id: "designer_job", label: "Дизайнер интерьера", icon: Paintbrush },
    { id: "crane_operator", label: "Машинист / Водитель", icon: Settings },
    { id: "other_job", label: "Другая вакансия", icon: Briefcase },
  ],
};

const DEAL_TYPES = ["Продажа", "Аренда долгосрочная", "Аренда посуточно"];
const ROOM_COUNTS = ["Студия", "1", "2", "3", "4", "5+"];
const CONDITION_TYPES = ["Без отделки", "Черновая отделка", "Предчистовая", "Чистовая", "Дизайнерский ремонт"];
const HOUSE_TYPES = ["Монолит", "Панель", "Кирпич", "Блок", "Др��во"];
const EMPLOYMENT_TYPES = ["Полная занятость", "Частичная занятость", "Разовая работа", "Вахтовый метод", "Стажировка"];
const SCHEDULES = ["5/2", "6/1", "Сменный", "Свободный график", "Вахта 15/15", "Вахта 30/30"];
const CONDITION_GOODS = ["Новое", "Отличное", "Хорошее", "Удовлетворительное"];
const EXPERIENCE_YEARS = ["Без опыта", "1–2 года", "3–5 лет", "5–10 лет", "Более 10 лет"];

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1559329146-807aff9ff1fb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1738168251394-9241984c8292?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582068019386-a943ee9287ae?w=400&h=300&fit=crop",
];

// ─── Sub-components OUTSIDE main component to prevent remount on every render ─
const inputCls = "w-full px-4 py-3 bg-[#F8F7F5] border border-[#E8E6E3] rounded-xl text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20 focus:border-[#FA5108] transition-colors";
const selectCls = inputCls + " appearance-none";

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-sm text-[#737373] mb-1.5 flex items-center gap-1" style={{ fontWeight: 500 }}>
      {label}{required && <span className="text-[#FA5108]">*</span>}
    </label>
  );
}

function ChipGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`px-3.5 py-1.5 rounded-lg text-sm border-2 transition-all ${
            value === o
              ? "border-[#FA5108] bg-[#FA5108]/5 text-[#FA5108]"
              : "border-[#E8E6E3] text-[#737373] hover:border-[#FA5108]/30"
          }`}
          style={{ fontWeight: value === o ? 600 : 400 }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CreateListingPage() {
  const navigate = useNavigate();
  const { userName, userRole } = useAccount();
  const { addListing } = useListings();

  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // Real estate documents
  const [docOwnership, setDocOwnership] = useState(false);
  const [docPower, setDocPower] = useState(false);
  const [docPassport, setDocPassport] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("₽");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [dealType, setDealType] = useState("Продажа");
  const [rooms, setRooms] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [houseType, setHouseType] = useState("");
  const [condition, setCondition] = useState("");
  const [year, setYear] = useState("");
  const [experience, setExperience] = useState("");
  const [guarantee, setGuarantee] = useState("");
  const [travelArea, setTravelArea] = useState("По городу");
  const [goodsCondition, setGoodsCondition] = useState("Новое");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("шт");
  const [employmentType, setEmploymentType] = useState("Полная занятость");
  const [schedule, setSchedule] = useState("5/2");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [workConditions, setWorkConditions] = useState("");
  const [vacancyType, setVacancyType] = useState("work");
  const [companyName, setCompanyName] = useState("");

  // Ownership confirmation (real estate only)
  const [sellerType, setSellerType] = useState<"owner" | "agent" | "">("");
  const [ownerConfirm, setOwnerConfirm] = useState(false);

  const isRealEstate = category?.id === "realestate";
  // Agents/realtors also need power of attorney
  const isAgent = userRole === "realtor" || userRole === "agency";

  // Dynamic step order based on category
  const stepOrder: Step[] = isRealEstate
    ? ["category", "subcategory", "details", "photos", "documents", "preview"]
    : ["category", "subcategory", "details", "photos", "preview"];

  const stepLabels: string[] = isRealEstate
    ? ["Категория", "Подкатегория", "Описание", "Фотографии", "Документы", "Проверка"]
    : ["Категория", "Подкатегория", "Описание", "Фотографии", "Проверка"];

  const stepIndex = stepOrder.indexOf(step);

  const goBack = () => {
    if (step === "category") navigate(-1);
    else setStep(stepOrder[stepIndex - 1]);
  };

  const pickCategory = (cat: Category) => {
    setCategory(cat);
    setSubcategory(null);
    setStep("subcategory");
  };

  const pickSubcategory = (sub: Subcategory) => {
    setSubcategory(sub);
    setStep("details");
  };

  const goToPhotos = () => {
    if (!title.trim()) { toast.error("Укажите заголовок объявления"); return; }
    if (!price.trim() && category?.id !== "jobs") { toast.error("Укажите цену"); return; }
    if (!address.trim()) { toast.error("Укажите адрес или местоположение"); return; }
    if (category?.id === "realestate") {
      if (!sellerType) {
        toast.error("Укажите, на каком основании вы размещаете объявление");
        return;
      }
      if (!ownerConfirm) {
        toast.error("Подтвердите своё право на продажу или аренду объекта");
        return;
      }
    }
    setStep("photos");
  };

  const goToDocuments = () => {
    setStep("documents");
  };

  const goToPreview = () => {
    if (isRealEstate && !docOwnership) {
      toast.error("Необходимо приложить документ о праве собственности или основании продажи");
      return;
    }
    setStep("preview");
  };

  const addMockPhoto = () => {
    if (photos.length >= 10) { toast.error("Максимум 10 фотографий"); return; }
    const next = MOCK_PHOTOS[photos.length % MOCK_PHOTOS.length];
    setPhotos((p) => [...p, next]);
  };

  const removePhoto = (idx: number) => setPhotos((p) => p.filter((_, i) => i !== idx));

  const publish = () => {
    if (!category) return;
    if (isRealEstate && !docOwnership) {
      toast.error("Прикрепите документ о праве собственности");
      setStep("documents");
      return;
    }
    addListing({
      title,
      category: category.label,
      subcategory: subcategory?.label ?? "",
      price,
      priceUnit,
      address,
      description,
      photos,
      status: "moderation",
      dealType,
      rooms,
      area,
      floor,
      totalFloors,
      condition,
      houseType,
      experience,
      employmentType,
      goodsCondition,
    });
    toast.success("Объявление отправлено на модерацию!", {
      description: "Документы проверяются. Обычно публикуется в течение 2 часов",
    });
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E8E6E3] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-[#F1F0EF] transition-colors text-[#737373] hover:text-[#212121]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>
              {step === "category" ? "Разместить объявление" : category?.label}
            </div>
            {subcategory && <div className="text-xs text-[#737373]">{subcategory.label}</div>}
          </div>
          {/* Step progress */}
          <div className="hidden sm:flex items-center gap-1">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                  i < stepIndex ? "bg-green-500 text-white" :
                  i === stepIndex ? "bg-[#FA5108] text-white" :
                  "bg-[#F1F0EF] text-[#BBBBBB]"
                }`} style={{ fontWeight: 600 }}>
                  {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`w-6 h-0.5 ${i < stepIndex ? "bg-green-500" : "bg-[#E8E6E3]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── CATEGORY ─────────────────────────────────────────────────────────── */}
        {step === "category" && (
          <div>
            <div className="mb-8 text-center">
              <h1 className="text-[#212121] mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>Что вы хотите разместить?</h1>
              <p className="text-[#737373] text-sm">Выберите категорию — форма подстроится под ваш тип объявления</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => pickCategory(cat)}
                    className={`group text-left p-6 bg-white rounded-2xl border-2 hover:shadow-lg transition-all hover:border-[#FA5108]/40 ${cat.bg}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#212121] mb-1" style={{ fontWeight: 700, fontSize: "1rem" }}>{cat.label}</div>
                        <div className="text-xs text-[#737373] leading-relaxed mb-3">{cat.desc}</div>
                        <div className="text-xs text-[#BBBBBB]">{cat.count} объявлений</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#BBBBBB] group-hover:text-[#FA5108] transition-colors shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 p-4 bg-white rounded-xl border border-[#E8E6E3] flex items-start gap-3">
              <Info className="w-5 h-5 text-[#FA5108] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>Первые 3 объявления — бесплатно</div>
                <div className="text-xs text-[#737373] mt-0.5">Далее — тарифы от 99 ₽/объявление.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SUBCATEGORY ──────────���────────────────────────────────────────────── */}
        {step === "subcategory" && category && (
          <div>
            <div className="mb-6">
              <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700, fontSize: "1.25rem" }}>Выберите подкатегорию</h2>
              <p className="text-xs text-[#737373]">Категория: {category.label}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {SUBCATEGORIES[category.id].map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => pickSubcategory(sub)}
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E8E6E3] hover:border-[#FA5108]/50 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F8F7F5] flex items-center justify-center shrink-0 group-hover:bg-[#FA5108]/10 transition-colors">
                      <SubIcon className="w-5 h-5 text-[#737373] group-hover:text-[#FA5108] transition-colors" />
                    </div>
                    <span className="text-sm text-[#212121] flex-1" style={{ fontWeight: 500 }}>{sub.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#BBBBBB] group-hover:text-[#FA5108] transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DETAILS ───────────────────────────────────────────────────────────── */}
        {step === "details" && category && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-5">
                <h2 className="text-[#212121]" style={{ fontWeight: 700 }}>Основная информация</h2>

                {/* Jobs: vacancy toggle */}
                {category.id === "jobs" && (
                  <div>
                    <FieldLabel label="Тип объявления" />
                    <div className="flex gap-2">
                      {[{ v: "work", l: "Ищу сотрудника" }, { v: "resume", l: "Ищу работу" }].map((t) => (
                        <button key={t.v} type="button" onClick={() => setVacancyType(t.v)}
                          className={`flex-1 py-2.5 rounded-xl text-sm border-2 transition-all ${vacancyType === t.v ? "border-[#FA5108] bg-[#FA5108]/5 text-[#FA5108]" : "border-[#E8E6E3] text-[#737373]"}`}
                          style={{ fontWeight: vacancyType === t.v ? 600 : 400 }}>
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real estate: deal type */}
                {category.id === "realestate" && (
                  <div>
                    <FieldLabel label="Тип сделки" required />
                    <ChipGroup options={DEAL_TYPES} value={dealType} onChange={setDealType} />
                  </div>
                )}

                {/* Title */}
                <div>
                  <FieldLabel label={
                    category.id === "jobs" ? (vacancyType === "work" ? "Название вакансии" : "Ваша специальность") :
                    category.id === "services" ? "Название услуги" :
                    category.id === "market" ? "Название товара" :
                    "Заголовок объявления"
                  } required />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputCls}
                    placeholder={
                      category.id === "realestate" ? "Например: 2-к. квартира с ремонтом, 65 м²" :
                      category.id === "services" ? "Например: Укладка плитки в ванной и на кухне" :
                      category.id === "market" ? "Например: Кирпич керамический М-150, 500 шт." :
                      "Например: Плиточник — 8 лет опыта, Калининград"
                    }
                  />
                </div>

                {/* Company name for jobs */}
                {category.id === "jobs" && vacancyType === "work" && (
                  <div>
                    <FieldLabel label="Название компании" />
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputCls} placeholder="ООО «СтройМастер»" />
                  </div>
                )}

                {/* Real estate specifics */}
                {category.id === "realestate" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel label="Количество комнат" />
                        <ChipGroup options={ROOM_COUNTS} value={rooms} onChange={setRooms} />
                      </div>
                      <div>
                        <FieldLabel label="Площадь, м²" required />
                        <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className={inputCls} placeholder="65" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <FieldLabel label="Этаж" />
                        <input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} className={inputCls} placeholder="5" />
                      </div>
                      <div>
                        <FieldLabel label="Этажей в доме" />
                        <input type="number" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className={inputCls} placeholder="12" />
                      </div>
                      <div>
                        <FieldLabel label="Год постройки" />
                        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className={inputCls} placeholder="2020" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel label="Тип дома" />
                      <div className="relative">
                        <select value={houseType} onChange={(e) => setHouseType(e.target.value)} className={selectCls}>
                          <option value="">Не указано</option>
                          {HOUSE_TYPES.map((h) => <option key={h}>{h}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel label="Состояние" />
                      <ChipGroup options={CONDITION_TYPES} value={condition} onChange={setCondition} />
                    </div>
                  </>
                )}

                {/* Services specifics */}
                {category.id === "services" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel label="Опыт работы" />
                        <div className="relative">
                          <select value={experience} onChange={(e) => setExperience(e.target.value)} className={selectCls}>
                            <option value="">Выбрать</option>
                            {EXPERIENCE_YEARS.map((e) => <option key={e}>{e}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel label="Гарантия (мес.)" />
                        <input type="number" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} className={inputCls} placeholder="12" />
                      </div>
                    </div>
                    <div>
                      <FieldLabel label="Выезд" />
                      <ChipGroup options={["По городу", "По области", "По России"]} value={travelArea} onChange={setTravelArea} />
                    </div>
                  </>
                )}

                {/* Market specifics */}
                {category.id === "market" && (
                  <>
                    <div>
                      <FieldLabel label="Состояние" />
                      <ChipGroup options={CONDITION_GOODS} value={goodsCondition} onChange={setGoodsCondition} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel label="Количество" />
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputCls} placeholder="500" />
                      </div>
                      <div>
                        <FieldLabel label="Единица" />
                        <div className="relative">
                          <select value={unit} onChange={(e) => setUnit(e.target.value)} className={selectCls}>
                            {["шт", "м²", "м³", "кг", "т", "уп", "рулон"].map((u) => <option key={u}>{u}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Jobs specifics */}
                {category.id === "jobs" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel label="Тип занятости" />
                        <div className="relative">
                          <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={selectCls}>
                            {EMPLOYMENT_TYPES.map((e) => <option key={e}>{e}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel label="График работы" />
                        <div className="relative">
                          <select value={schedule} onChange={(e) => setSchedule(e.target.value)} className={selectCls}>
                            {SCHEDULES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <FieldLabel label="Требования и обязанности" />
                      <textarea rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} className={inputCls + " resize-none"} placeholder="Опыт от 2 лет, наличие инструмента..." />
                    </div>
                    <div>
                      <FieldLabel label="Условия работы" />
                      <textarea rows={3} value={workConditions} onChange={(e) => setWorkConditions(e.target.value)} className={inputCls + " resize-none"} placeholder="Питание, проживание, спецодежда..." />
                    </div>
                  </>
                )}

                {/* Description */}
                <div>
                  <FieldLabel label="Описание" required />
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputCls + " resize-none"}
                    placeholder="Подробно опишите ваше предложение..."
                  />
                </div>
              </div>

              {/* Price block */}
              <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-4">
                <h2 className="text-[#212121]" style={{ fontWeight: 700 }}>Цена</h2>
                {category.id === "jobs" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="negotiable" checked={salaryNegotiable} onChange={(e) => setSalaryNegotiable(e.target.checked)} className="w-4 h-4 accent-[#FA5108]" />
                      <label htmlFor="negotiable" className="text-sm text-[#212121]" style={{ fontWeight: 500 }}>Зарплата договорная</label>
                    </div>
                    {!salaryNegotiable && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FieldLabel label="Зарплата от, ₽" />
                          <input type="number" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} className={inputCls} placeholder="80 000" />
                        </div>
                        <div>
                          <FieldLabel label="Зарплата до, ₽" />
                          <input type="number" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} className={inputCls} placeholder="150 000" />
                        </div>
                      </div>
                    )}
                    <div>
                      <FieldLabel label="Отображать в объявлении" />
                      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder={salaryNegotiable ? "Договорная" : "от 80 000 ₽/мес"} />
                    </div>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <FieldLabel label="Цена" required />
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={inputCls}
                        placeholder={
                          category.id === "realestate" ? dealType.includes("Аренда") ? "85 000" : "8 900 000" :
                          category.id === "services" ? "3 500" : "1 200"
                        }
                      />
                    </div>
                    <div className="w-36">
                      <FieldLabel label="Единица" />
                      <div className="relative">
                        <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)} className={selectCls}>
                          {category.id === "services"
                            ? ["₽/м²", "₽/ч", "₽/день", "₽/работа", "Договорная"].map((u) => <option key={u}>{u}</option>)
                            : category.id === "market"
                            ? ["₽/шт", "₽/м²", "₽/м³", "₽/кг", "₽/т", "₽/уп"].map((u) => <option key={u}>{u}</option>)
                            : ["₽", "₽/мес", "₽/сутки"].map((u) => <option key={u}>{u}</option>)
                          }
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737373] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 space-y-4">
                <h2 className="text-[#212121]" style={{ fontWeight: 700 }}>Местоположение</h2>
                <div>
                  <FieldLabel label="Адрес объекта / город" required />
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls + " pl-10"} placeholder="Калининград, ул. Примерная, 1" />
                  </div>
                </div>
                <div className="h-36 bg-[#F8F7F5] rounded-xl border border-[#E8E6E3] flex items-center justify-center gap-2 text-[#BBBBBB] text-sm cursor-pointer hover:bg-[#F1F0EF] transition-colors">
                  <MapPin className="w-5 h-5" />
                  Нажмите, чтобы уточнить на карте
                </div>
              </div>

              {/* ── Ownership block — real estate only ── */}
              {category.id === "realestate" && (
                <div className={`bg-white rounded-2xl border-2 p-6 space-y-4 transition-colors ${
                  sellerType && ownerConfirm
                    ? "border-green-400"
                    : sellerType
                    ? "border-amber-300"
                    : "border-[#FA5108]/50"
                }`}>
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#FA5108] shrink-0" />
                    <h2 className="text-[#212121] flex-1" style={{ fontWeight: 700 }}>Право на размещение</h2>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px]" style={{ fontWeight: 700 }}>
                      Обязательно
                    </span>
                  </div>

                  <p className="text-xs text-[#737373] leading-relaxed">
                    Без подтверждения права собственности или полномочий объявление о недвижимости разместить нельзя — это защита покупателей от мошенничества.
                  </p>

                  {/* Seller type picker */}
                  <div>
                    <FieldLabel label="Кто размещает объявление?" required />
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      {[
                        { v: "owner" as const, title: "Я — собственник", sub: "Объект оформлен на меня", Icon: Home },
                        { v: "agent" as const, title: "Агент / Представитель", sub: "Действую по доверенности", Icon: Briefcase },
                      ].map(({ v, title: t, sub, Icon }) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => { setSellerType(v); setOwnerConfirm(false); }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            sellerType === v
                              ? "border-[#FA5108] bg-[#FFF5F0]"
                              : "border-[#E8E6E3] hover:border-[#FA5108]/30 hover:bg-[#FFF5F0]/50"
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2" style={{ color: sellerType === v ? "#FA5108" : "#737373" }} />
                          <div className="text-sm" style={{ fontWeight: 600, color: sellerType === v ? "#FA5108" : "#212121" }}>{t}</div>
                          <div className="text-xs text-[#737373] mt-0.5">{sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Agent warning */}
                  {sellerType === "agent" && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 leading-relaxed">
                        На шаге «Документы» потребуется загрузить нотариально заверенную <strong>доверенность от собственника</strong> на право продажи или сдачи объекта в аренду.
                      </p>
                    </div>
                  )}

                  {/* Confirmation checkbox */}
                  {sellerType && (
                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${
                      ownerConfirm ? "bg-green-50 border-green-200" : "bg-[#F8F7F5] border-[#E8E6E3]"
                    }`}>
                      <input
                        type="checkbox"
                        checked={ownerConfirm}
                        onChange={(e) => setOwnerConfirm(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-[#FA5108] shrink-0"
                      />
                      <span className="text-sm text-[#212121] leading-snug">
                        {sellerType === "owner"
                          ? "Подтверждаю, что являюсь собственником данного объекта и имею право его продавать или сдавать в аренду. Несу ответственность за достоверность предоставленных сведений."
                          : "Подтверждаю, что имею нотариальную доверенность от собственника на право продажи или сдачи данного объекта и готов предоставить её для проверки."}
                      </span>
                    </label>
                  )}

                  {/* Status hint */}
                  {sellerType && (
                    <div className={`flex items-center gap-2 text-xs ${ownerConfirm ? "text-green-700" : "text-amber-700"}`}>
                      {ownerConfirm
                        ? <><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> Право подтверждено — можно продолжить</>
                        : <><AlertCircle className="w-4 h-4 text-amber-500 shrink-0" /> Поставьте галочку, чтобы продолжить</>}
                    </div>
                  )}
                </div>
              )}

              <button onClick={goToPhotos}
                className="w-full py-4 rounded-2xl text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 700 }}>
                Далее — добавить фотографии
                <ChevronRight className="inline w-5 h-5 ml-1" />
              </button>
            </div>

            {/* Sidebar tips */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8E6E3] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>Советы для продажи</span>
                </div>
                <ul className="space-y-2 text-xs text-[#737373]">
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />Добавьте качественные фото</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />Заголовок с ключевыми словами</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />Цена близкая к рыночной</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />Подробное описание снижает вопросы</li>
                </ul>
              </div>
              <div className="bg-[#FFF5F0] rounded-2xl border border-[#FA5108]/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#FA5108]" />
                  <span className="text-sm text-[#FA5108]" style={{ fontWeight: 600 }}>Время модерации</span>
                </div>
                <p className="text-xs text-[#737373]">Обычно <span className="text-[#212121]" style={{ fontWeight: 600 }}>1–2 часа</span> в рабочее время.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── PHOTOS ────────────────────────────────────────────────────────────── */}
        {step === "photos" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700, fontSize: "1.25rem" }}>Фотографии</h2>
              <p className="text-sm text-[#737373]">Добавьте до 10 фото. Первое фото — обложка</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 mb-5">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded" style={{ fontWeight: 600 }}>Обложка</div>
                    )}
                    <button onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <button onClick={addMockPhoto}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#E8E6E3] flex flex-col items-center justify-center gap-1 hover:border-[#FA5108] hover:bg-[#FFF5F0] transition-all text-[#BBBBBB] hover:text-[#FA5108]">
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px]">Добавить</span>
                  </button>
                )}
              </div>
              <div onClick={addMockPhoto}
                className="border-2 border-dashed border-[#E8E6E3] rounded-xl p-8 text-center cursor-pointer hover:border-[#FA5108] hover:bg-[#FFF5F0] transition-all">
                <Upload className="w-8 h-8 text-[#BBBBBB] mx-auto mb-2" />
                <p className="text-sm text-[#737373]" style={{ fontWeight: 500 }}>Нажмите или перетащите файлы</p>
                <p className="text-xs text-[#BBBBBB] mt-1">JPG, PNG, WEBP — до 10 МБ каждый</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("details")}
                className="px-6 py-3.5 border border-[#E8E6E3] rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors">
                Назад
              </button>
              <button onClick={() => isRealEstate ? goToDocuments() : goToPreview()}
                className="flex-1 py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 700 }}>
                {photos.length > 0
                  ? isRealEstate
                    ? `Далее — документы (${photos.length} фото)`
                    : `Далее — проверка (${photos.length} фото)`
                  : "Пропустить"}
                <ChevronRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ─────────────────────────────────────────────────────────── */}
        {step === "documents" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700, fontSize: "1.25rem" }}>Документы на объект</h2>
              <p className="text-sm text-[#737373]">Без приложения документов разместить объявление о недвижимости нельзя — это защита покупателей от мошенничества</p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-amber-900" style={{ fontWeight: 600 }}>Обязательное требование ABBY</div>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Документы видны только верификаторам ABBY и хранятся в зашифрованном виде. Они не публикуются в объявлении, но необходимы для проверки законности сделки.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Ownership doc — required */}
              <div
                onClick={() => { setDocOwnership(true); toast.success("Документ о праве собственности загружен"); }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  docOwnership ? "border-green-400 bg-green-50" : "border-dashed border-[#E8E6E3] hover:border-[#FA5108]/50 hover:bg-[#FA5108]/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${docOwnership ? "bg-green-100" : "bg-[#F1F0EF]"}`}>
                    {docOwnership ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-[#737373]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>Документ о праве собственности</span>
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full" style={{ fontWeight: 600 }}>Обязательно</span>
                    </div>
                    <div className="text-xs text-[#737373] mt-0.5">
                      {docOwnership ? "✓ Загружен" : "Свидетельство о праве собственности, выписка из ЕГРН или договор купли-продажи"}
                    </div>
                  </div>
                  {!docOwnership && <Upload className="w-4 h-4 text-[#BBBBBB] shrink-0" />}
                </div>
              </div>

              {/* Power of attorney — for agents */}
              {isAgent && (
                <div
                  onClick={() => { setDocPower(true); toast.success("Доверенность загружена"); }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    docPower ? "border-green-400 bg-green-50" : "border-dashed border-[#E8E6E3] hover:border-[#FA5108]/50 hover:bg-[#FA5108]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${docPower ? "bg-green-100" : "bg-[#F1F0EF]"}`}>
                      {docPower ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <ShieldCheck className="w-5 h-5 text-[#737373]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>Доверенность от собственника</span>
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full" style={{ fontWeight: 600 }}>Для агентов</span>
                      </div>
                      <div className="text-xs text-[#737373] mt-0.5">
                        {docPower ? "✓ Загружена" : "Нотариально заверенная доверенность на право продажи/сдачи в аренду"}
                      </div>
                    </div>
                    {!docPower && <Upload className="w-4 h-4 text-[#BBBBBB] shrink-0" />}
                  </div>
                </div>
              )}

              {/* Passport — optional */}
              <div
                onClick={() => { setDocPassport(true); toast.success("Паспорт загружен"); }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  docPassport ? "border-green-400 bg-green-50" : "border-dashed border-[#E8E6E3] hover:border-[#FA5108]/50 hover:bg-[#FA5108]/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${docPassport ? "bg-green-100" : "bg-[#F1F0EF]"}`}>
                    {docPassport ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-[#737373]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>Паспорт собственника</span>
                      <span className="px-1.5 py-0.5 bg-[#F1F0EF] text-[#737373] text-[10px] rounded-full" style={{ fontWeight: 600 }}>Рекомендуется</span>
                    </div>
                    <div className="text-xs text-[#737373] mt-0.5">
                      {docPassport ? "✓ Загружен" : "Страницы 2–3 паспорта РФ собственника объекта"}
                    </div>
                  </div>
                  {!docPassport && <Upload className="w-4 h-4 text-[#BBBBBB] shrink-0" />}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-2 p-3 rounded-xl mb-5 ${docOwnership ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              {docOwnership
                ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
              <span className={`text-xs ${docOwnership ? "text-green-800" : "text-red-700"}`} style={{ fontWeight: 500 }}>
                {docOwnership
                  ? `Обязательный документ загружен${docPower ? ", доверенность приложена" : ""}${docPassport ? ", паспорт приложен" : ""}. Можно продолжить.`
                  : "Пожалуйста, загрузите документ о праве собственности (обязательно)"}
              </span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("photos")} className="px-6 py-3.5 border border-[#E8E6E3] rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors">
                Назад
              </button>
              <button
                onClick={goToPreview}
                disabled={!docOwnership}
                className={`flex-1 py-3.5 rounded-xl text-white text-sm transition-all ${docOwnership ? "opacity-100 hover:opacity-90" : "opacity-40 cursor-not-allowed"}`}
                style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 700 }}
              >
                Далее — проверить объявление <ChevronRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ── PREVIEW ──────────────────────────────────────────────────────────── */}
        {step === "preview" && category && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700, fontSize: "1.25rem" }}>Проверьте объявление</h2>
              <p className="text-sm text-[#737373]">Так оно будет выглядеть для покупателей</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden mb-5">
              {photos.length > 0 ? (
                <div className="relative">
                  <img src={photos[0]} alt="" className="w-full h-56 object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs rounded-lg text-[#212121]" style={{ fontWeight: 600 }}>{photos.length} фото</span>
                  </div>
                </div>
              ) : (
                <div className="h-40 bg-[#F8F7F5] flex items-center justify-center text-[#BBBBBB] text-sm">
                  <Camera className="w-6 h-6 mr-2" /> Фото не добавлены
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{category.label}</span>
                  {subcategory && <span className="px-2 py-0.5 bg-[#F1F0EF] text-xs text-[#737373] rounded">{subcategory.label}</span>}
                </div>
                <h3 className="text-[#212121] mb-2" style={{ fontWeight: 700, fontSize: "1.1rem" }}>{title || "Заголовок объявления"}</h3>
                <div className="text-[#FA5108] mb-3" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                  {price ? `${Number(price.replace(/\s/g, "")).toLocaleString("ru-RU")} ${priceUnit}` : "Цена не указана"}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#737373] mb-3">
                  {address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{address}</span>}
                  {category.id === "realestate" && area && <span>{area} м²</span>}
                  {category.id === "realestate" && rooms && <span>{rooms === "Студия" ? "Студия" : `${rooms}-комн.`}</span>}
                  {category.id === "jobs" && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{employmentType}</span>}
                </div>
                {description && <p className="text-sm text-[#737373] leading-relaxed line-clamp-3">{description}</p>}
                <div className="border-t border-[#F1F0EF] mt-4 pt-4 flex items-center justify-between text-xs text-[#BBBBBB]">
                  <span>ABBY · {new Date().toLocaleDateString("ru-RU")}</span>
                  <span>{userName || "Пользователь"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#F8F7F5] rounded-xl border border-[#E8E6E3] mb-5">
              <Info className="w-5 h-5 text-[#737373] shrink-0 mt-0.5" />
              <p className="text-xs text-[#737373] leading-relaxed">
                Нажимая «Опубликовать», вы подтверждаете соответствие объявления <span className="text-[#FA5108]">Правилам ABBY</span>.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("photos")}
                className="px-6 py-3.5 border border-[#E8E6E3] rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors">
                Назад
              </button>
              <button onClick={publish}
                className="flex-1 py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 700 }}>
                ✓ Опубликовать объявление
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}