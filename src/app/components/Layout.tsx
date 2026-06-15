import { FloatingAIAssistant as _unused, HeaderAIBar } from "./FloatingAIAssistant";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Building2, Wrench, BookOpen, Menu, X, User, Bell,
  Briefcase, Heart, ChevronDown, MapPin, Calculator,
  ShoppingCart, Plus, LogIn, Check, UserPlus,
  ChevronRight, Trash2, LogOut, Home,
  CheckCircle2, Lock,
} from "lucide-react";

import { toast, Toaster } from "sonner";
import {
  useAccount, ACCOUNT_TYPE_META, AccountType, SubAccount, UserRole,
  USER_ROLE_META, ROLES_NEED_VERIFICATION, roleToAccountType,
} from "./AccountContext";
import { ROLE_OPTIONS } from "./AuthPage";
import { SearchBar } from "./SearchBar";
import { SideBanners } from "./SideBanners";

// ─── Role colour map ──────────────────────────────────────────────────────────
const ROLE_BG: Record<string, string> = {
  individual:     "#212121",
  realtor:        "#FA5108",
  developer:      "#2563eb",
  developer_corp: "#1d4ed8",
  agency:         "#FA5108",
  contractor:     "#16a34a",
  construction:   "#d97706",
  legal:          "#7c3aed",
};

// ─── Role Pill ────────────────────────────────────────────────────────────────
function RolePill({ role, size = "sm" }: { role: string; size?: "sm" | "md" }) {
  const bg = ROLE_BG[role] ?? "#212121";
  const label = (USER_ROLE_META as Record<string, { label: string }>)[role]?.label ?? role;
  const cls = size === "md"
    ? "px-2.5 py-1 text-[11px] rounded-full"
    : "px-1.5 py-0.5 text-[10px] rounded-full";
  return (
    <span className={`inline-flex items-center text-white ${cls}`} style={{ background: bg, fontWeight: 600 }}>
      {label}
    </span>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function AbbyLogo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const textFill = dark ? "#FFFFFF" : "#212121";
  return (
    <svg viewBox="0 0 2176 395" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M84.8398 239.925C84.8398 201.13 116.289 169.681 155.083 169.681H262.301L282.259 84.8412H155.083L153.079 84.8537C68.3525 85.9269 0 154.944 0 239.925C0 324.906 68.3525 393.922 153.079 394.996L155.083 395.008H209.292L229.251 310.168H155.083C116.289 310.168 84.8398 278.719 84.8398 239.925Z" fill="#FA5108"/>
      <path d="M441.151 155.083C441.151 116.289 409.702 84.8397 370.907 84.8397H281.99L301.949 0H370.907C456.558 0 525.991 69.4332 525.991 155.083C525.991 240.734 456.558 310.167 370.907 310.167H228.981L248.94 225.327H370.907C409.702 225.327 441.151 193.878 441.151 155.083Z" fill="#FA5108"/>
      <path d="M904.279 76.9919L978.661 318.944H879.928L871.2 289.522H664.328L642.946 318.944H549.793L731.443 76.9919H904.279ZM710.655 227.563H853.201L825.286 137.567H780.74L710.655 227.563Z" fill={textFill}/>
      <path d="M1303.7 167.681C1331.39 167.681 1342.01 179.345 1342.01 206.69L1322.58 269.1C1318.85 297.563 1300.43 318.944 1272.74 318.944H949.093L1002.28 76.9919H1277.27C1308.16 76.9919 1318.85 104.533 1318.85 130.072C1318.85 140.803 1310.53 159.175 1301.62 167.681H1303.7ZM1082.46 137.567L1076.52 167.681H1200.27C1208.58 167.681 1215.5 160.758 1215.5 152.451C1215.5 144.143 1208.58 137.567 1200.27 137.567H1082.46ZM1224.87 258.716V258.37C1233.53 258.37 1240.45 251.793 1240.45 243.14C1240.45 234.486 1233.53 227.563 1224.87 227.563H1064.05L1056.92 258.716H1224.87Z" fill={textFill}/>
      <path d="M1677.74 169.866C1697.19 169.866 1694.22 217.381 1694.22 217.381L1686.5 263.708C1686.5 291.399 1650.04 318.944 1622.35 318.944H1302.47L1355.67 76.9919H1624.38C1657.95 76.9919 1676.4 95.6238 1674.62 130.072C1673.82 145.515 1663.18 157.303 1657.99 166.302L1677.74 169.866ZM1440.61 137.567L1432.29 167.681H1558.8C1567.11 167.681 1574.03 160.758 1574.03 152.451C1574.03 144.143 1567.11 137.567 1558.8 137.567H1440.61ZM1580.77 258.716V258.37C1589.43 258.37 1596.35 251.793 1596.35 243.14C1596.35 234.486 1589.43 227.563 1580.77 227.563H1419.22L1410.31 258.716H1580.77Z" fill={textFill}/>
      <path d="M1981.09 78.9935L2078.49 76.9919L2048.2 207.878C2045.23 235.199 2006.63 258.37 1989.4 258.37H1897.94L1885.4 318.944H1788.82L1801.13 258.37H1717.14C1689.79 258.37 1676.31 234.629 1676.31 207.284L1703.48 76.9919H1797.91L1779.74 171.054C1776.18 190.654 1779.74 198.141 1817.51 198.141H1902.36C1926.45 198.141 1954.96 198.141 1960.9 175.211L1981.09 78.9935Z" fill={textFill}/>
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function AccountAvatar({ account, size = "sm" }: { account: SubAccount; size?: "sm" | "md" }) {
  const bg = ROLE_BG[account.role] ?? "#212121";
  const sz = size === "sm" ? "w-6 h-6 text-[11px]" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} flex items-center justify-center text-white shrink-0`}
      style={{ 
        background: bg, 
        fontWeight: 700,
        borderRadius: '20%',
        boxShadow: `0 2px 8px ${bg}30`
      }}>
      {(account.name.charAt(0) || "А").toUpperCase()}
    </div>
  );
}

// ─── Role Picker (shared by AddAccountModal & ChangeRoleModal) ────────────────
function RolePicker({ value, onChange, excludeRoles = [] }: { value: UserRole; onChange: (r: UserRole) => void; excludeRoles?: UserRole[] }) {
  const options = ROLE_OPTIONS.filter((r) => !excludeRoles.includes(r.id));
  return (
    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
      {options.map(({ id, icon: Icon, bg }) => {
        const meta = USER_ROLE_META[id];
        const needsV = ROLES_NEED_VERIFICATION.includes(id);
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
              value === id ? "border-[#FA5108] bg-[#FA5108]/5" : "border-[#E8E6E3] hover:bg-[#F8F7F5]"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${bg}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>{meta.label}</span>
                {needsV && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full flex items-center gap-1" style={{ fontWeight: 500 }}>
                    <Lock className="w-2.5 h-2.5" /> Верификация
                  </span>
                )}
              </div>
              <div className="text-xs text-[#737373] truncate">{meta.desc}</div>
            </div>
            {value === id && <Check className="w-4 h-4 text-[#FA5108] shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Add Account Modal ────────────────────────────────────────────────────────
function AddAccountModal({
  existingRoles,
  onAdd,
  onClose,
}: {
  existingRoles: UserRole[];
  onAdd: (type: AccountType, role: UserRole, name: string) => void;
  onClose: () => void;
}) {
  const availableFirst = ROLE_OPTIONS.find((r) => !existingRoles.includes(r.id))?.id ?? "individual";
  const [selectedRole, setSelectedRole] = useState<UserRole>(availableFirst);
  const [name, setName] = useState("");

  const roleMeta = USER_ROLE_META[selectedRole];
  const needsVerif = ROLES_NEED_VERIFICATION.includes(selectedRole);
  const allTaken = ROLE_OPTIONS.every((r) => existingRoles.includes(r.id));

  if (allTaken) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-[#212121] mb-2" style={{ fontWeight: 700 }}>Все аккаунты добавлены</h3>
          <p className="text-sm text-[#737373] mb-4">У вас уже есть аккаунты всех доступных типов.</p>
          <button onClick={onClose} className="w-full py-2.5 bg-[#FA5108] text-white rounded-xl text-sm" style={{ fontWeight: 600 }}>Закрыть</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#212121]" style={{ fontWeight: 700 }}>Добавить аккаунт</h3>
          <button onClick={onClose} className="p-1.5 text-[#737373] hover:text-[#212121] hover:bg-[#F1F0EF] rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <p className="text-xs text-[#737373] mb-2" style={{ fontWeight: 500 }}>РОЛЬ</p>
        <RolePicker value={selectedRole} onChange={setSelectedRole} excludeRoles={existingRoles} />

        <div className="mt-4 mb-4">
          <label className="text-xs text-[#737373] mb-1.5 block" style={{ fontWeight: 500 }}>
            {roleMeta.accountType === "individual" ? "ИМЯ И ФАМИЛИЯ" : "НАЗВАНИЕ КОМПАНИИ / ИП"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                onAdd(roleToAccountType(selectedRole), selectedRole, name.trim());
                onClose();
                toast.success(`Аккаунт «${name.trim()}» добавлен`);
              }
            }}
            className="w-full px-4 py-3 bg-[#F8F7F5] border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20 focus:border-[#FA5108]"
            placeholder={roleMeta.accountType === "individual" ? "Иван Петров" : "ООО «СтройИнвест»"}
            autoFocus
          />
        </div>

        {needsVerif && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">Этот аккаунт требует верификации. Полный доступ откроется после проверки документов.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#E8E6E3] rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors">Отмена</button>
          <button
            onClick={() => {
              if (!name.trim()) { toast.error("Введите имя или название"); return; }
              onAdd(roleToAccountType(selectedRole), selectedRole, name.trim());
              onClose();
              toast.success(`Аккаунт «${name.trim()}» добавлен`);
            }}
            className="flex-1 py-2.5 bg-[#FA5108] text-white rounded-xl text-sm hover:bg-[#e04a07] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Role Modal ────────────────────────────────────────────────────────
function ChangeRoleModal({ currentRole, onConfirm, onClose }: {
  currentRole: UserRole;
  onConfirm: (role: UserRole) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<UserRole>(currentRole);
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#212121]" style={{ fontWeight: 700 }}>Сменить роль</h3>
          <button onClick={onClose} className="p-1.5 text-[#737373] hover:text-[#212121] hover:bg-[#F1F0EF] rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <RolePicker value={selected} onChange={setSelected} />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#E8E6E3] rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors">Отмена</button>
          <button
            onClick={() => { onConfirm(selected); onClose(); }}
            className="flex-1 py-2.5 bg-[#FA5108] text-white rounded-xl text-sm hover:bg-[#e04a07] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Account Dropdown Content ─────────────────────────────────────────────────
function AccountDropdownContent({
  accounts, activeAccountId,
  onSwitch, onRemove, onAddAccount, onChangeRole, onNavigate, onLogout,
}: {
  accounts: SubAccount[];
  activeAccountId: string;
  onSwitch: (id: string) => void;
  onRemove: (id: string) => void;
  onAddAccount: () => void;
  onChangeRole: () => void;
  onNavigate: (to: string) => void;
  onLogout: () => void;
}) {
  const activeAccount = accounts.find((a) => a.id === activeAccountId) ?? accounts[0];
  const roleBg = activeAccount ? (ROLE_BG[activeAccount.role] ?? "#212121") : "#212121";
  return (
    <>
      {/* Header — role-tinted */}
      {activeAccount && (
        <div className="px-4 py-4 border-b border-[#F1F0EF]" style={{ background: `${roleBg}14` }}>
          <div className="flex items-center gap-2.5">
            <AccountAvatar account={activeAccount} size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[#212121] truncate" style={{ fontWeight: 700 }}>{activeAccount.name}</div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <RolePill role={activeAccount.role} size="md" />
                {activeAccount.verified === false && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full" style={{ fontWeight: 600 }}>
                    <Lock className="w-2.5 h-2.5" /> На проверке
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onChangeRole}
              className="px-2 py-1 text-[10px] border border-[#E8E6E3] bg-white rounded-lg text-[#737373] hover:border-[#FA5108] hover:text-[#FA5108] transition-colors shrink-0"
              style={{ fontWeight: 500 }}
            >
              Сменить роль
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="py-1">
        <button onClick={() => onNavigate("/profile")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#F8F7F5] transition-colors text-left">
          <User className="w-4 h-4 text-[#737373] shrink-0" /> Личный кабинет
        </button>
        <button onClick={() => onNavigate("/profile?tab=listings")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#F8F7F5] transition-colors text-left">
          <Home className="w-4 h-4 text-[#737373] shrink-0" /> Мои объявления
        </button>
      </div>

      {/* Accounts */}
      <div className="border-t border-[#F1F0EF]">
        <div className="px-4 pt-3 pb-1.5">
          <span className="text-[10px] text-[#AAAAAA]" style={{ fontWeight: 600, letterSpacing: "0.06em" }}>МОИ АККАУНТЫ</span>
        </div>
        <div className="px-2 pb-1 space-y-0.5">
          {accounts.map((acc) => {
            const isActive = acc.id === activeAccountId;
            const accBg = ROLE_BG[acc.role] ?? "#212121";
            return (
              <div key={acc.id}
                className={`flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all border ${isActive ? "border-[#E8E6E3]" : "hover:bg-[#F8F7F5] border-transparent"}`}
                style={isActive ? { background: `${accBg}0d`, borderColor: `${accBg}30` } : {}}
              >
                <AccountAvatar account={acc} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#212121] truncate" style={{ fontWeight: isActive ? 600 : 500 }}>{acc.name}</div>
                  <div className="mt-0.5"><RolePill role={acc.role} /></div>
                </div>
                {isActive ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: accBg }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => onSwitch(acc.id)} className="px-2 py-0.5 text-[11px] border border-[#E8E6E3] rounded-lg text-[#737373] hover:border-[#FA5108] hover:text-[#FA5108] transition-colors">Войти</button>
                    <button onClick={() => onRemove(acc.id)} className="p-1 text-[#C0BDBA] hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {accounts.length < 3 ? (
          <div className="px-3 pb-2 pt-1">
            <button onClick={onAddAccount} className="w-full flex items-center gap-2 justify-center py-2 border border-dashed border-[#E8E6E3] rounded-xl text-xs text-[#737373] hover:border-[#FA5108] hover:text-[#FA5108] transition-colors">
              <UserPlus className="w-3.5 h-3.5" /> Добавить аккаунт
            </button>
          </div>
        ) : (
          <div className="px-4 pb-2"><p className="text-[11px] text-[#AAAAAA] text-center">Максимум 3 аккаунта</p></div>
        )}
      </div>

      <div className="border-t border-[#F1F0EF] py-1">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" /> Выйти
        </button>
      </div>
    </>
  );
}

// ─── Category tabs data ──────────────────────────────────────────────────────
const categoryTabs = [
  { id: "realestate", label: "Недвижимость", count: "12 333", img: "https://images.unsplash.com/photo-1761135125354-d024f37d04ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwaG91c2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MjEwNzg3N3ww&ixlib=rb-4.1.0&q=80&w=1080", to: "/realestate", icon: Building2 },
  { id: "services", label: "Услуги / Подрядчики", count: "485", img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwZWxlY3RyaWNpYW4lMjByZXBhaXJ8ZW58MXx8fHwxNzcyMTA3ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080", to: "/services", icon: Wrench },
  { id: "market", label: "Маркет / Товары", count: "2 140", img: "https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBidWlsZGluZyUyMG1hdGVyaWFscyUyMHN0b3JlfGVufDF8fHx8MTc3MjAyODA1Nnww&ixlib=rb-4.1.0&q=80&w=1080", to: "/market", icon: ShoppingCart },
  { id: "jobs", label: "Вакансии / Работа", count: "43 076", img: "https://images.unsplash.com/photo-1761227447538-f4e1ec0a9df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJzJTIwaGFyZCUyMGhhdHMlMjB0ZWFtfGVufDF8fHx8MTc3MjExMjM1NXww&ixlib=rb-4.1.0&q=80&w=1080", to: "/jobs", icon: Briefcase },
];

// ─── Layout ─────────────────────────────────────────────────────────────────���──
export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Калининград");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showChangeRole, setShowChangeRole] = useState(false);

  const CITIES = ["Калининград", "Санкт-Петербург", "Москва"];

  const {
    accounts, activeAccountId, userName, isLoggedIn,
    setIsLoggedIn, setUserName, setPhone,
    switchAccount, addAccount, removeAccount, setUserRole,
  } = useAccount();

  const activeAccount = accounts.find((a) => a.id === activeAccountId) ?? accounts[0];

  const topNavItems = [
    { label: "Для Бизнеса", to: "/profile" },
    { label: "Информационный портал", to: "/hub" },
    { label: "Помощь", to: "/hub" },
  ];

  const notifications = [
    { id: 1, text: "Новый отклик на ваш заказ «Ремонт кухни»", time: "5 мин назад", unread: true },
    { id: 2, text: "Подрядчик завершил этап «Штукатурка стен»", time: "1 час назад", unread: true },
    { id: 3, text: "Ваша бронь подтверждена — ЖК «Ривьера Парк»", time: "Вчера", unread: false },
  ];

  const isLanding = location.pathname === "/";
  const showCategoryTabs = isLanding || ["/realestate", "/services", "/market", "/jobs"].some((p) => location.pathname.startsWith(p));

  const handleLogout = () => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    setIsLoggedIn(false);
    setUserName("");
    setPhone("");
    navigate("/");
    toast.success("Вы вышли из аккаунта");
  };

  const handleNavigate = (to: string) => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    navigate(to);
  };

  const handleSwitch = (id: string) => {
    switchAccount(id);
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    const acc = accounts.find((a) => a.id === id);
    if (acc) toast.success(`Переключено: ${acc.name}`);
  };

  const handleRemove = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    removeAccount(id);
    if (acc) toast(`Аккаунт «${acc.name}» удалён`);
  };

  const handleAddAccountOpen = () => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    setShowAddAccount(true);
  };

  const handleChangeRoleOpen = () => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    setShowChangeRole(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    toast.success(`Роль изменена: ${USER_ROLE_META[role].label}`);
  };

  return (
    <div className="relative min-h-screen bg-white font-['Golos_Text',Inter,sans-serif]">
      <Toaster position="top-right" richColors />

      {/* ── Side banners ─────────────────────────────────────────────────── */}
      <SideBanners />

      {/* ── Top dark bar ─────────────────────────────────────────────────── */}
      <div className="bg-[#212121] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-1">
              {/* City picker */}
              <div className="relative">
                <button
                  onClick={() => setShowCityPicker(!showCityPicker)}
                  className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors px-2 py-1"
                >
                  <MapPin className="w-3 h-3" /> {selectedCity}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
                </button>
                {showCityPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityPicker(false)} />
                    <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[#E8E6E3] z-50 overflow-hidden min-w-[180px]">
                      {CITIES.map(city => (
                        <button
                          key={city}
                          onClick={() => { setSelectedCity(city); setShowCityPicker(false); toast.success(`Город: ${city}`); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${city === selectedCity ? "bg-[#FA5108]/5 text-[#FA5108]" : "text-[#212121] hover:bg-[#F8F7F5]"}`}
                          style={{ fontWeight: city === selectedCity ? 600 : 400 }}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {city}
                          {city === selectedCity && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-[#FA5108]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {topNavItems.map((item) => (
                <Link key={item.label} to={item.to} className="text-xs text-white/60 hover:text-white transition-colors px-2 py-1">{item.label}</Link>
              ))}
            </div>
            {isLoggedIn && (
              <Link to="/profile?tab=listings" className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1">Мои объявления</Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8E6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <AbbyLogo className="h-6 w-auto" />
            </Link>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Post button */}
              <button
                onClick={() => isLoggedIn ? navigate("/post") : navigate("/auth", { state: { returnTo: "/post" } })}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm shrink-0 transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" />
                Разместить объявление
              </button>

              {/* Favorites */}
              <button onClick={() => toast.info("Избранное")} className="hidden sm:flex p-2 text-[#212121] hover:bg-[#F1F0EF] rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              {/* Notifications — only when logged in */}
              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={() => { setShowProfileMenu(false); setShowNotifications(!showNotifications); }}
                    className="relative p-2 text-[#212121] hover:bg-[#F1F0EF] rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#FA5108] rounded-full" />
                  </button>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#E8E6E3] shadow-xl z-50">
                        <div className="p-4 border-b border-[#E8E6E3]">
                          <h4 style={{ fontWeight: 600 }}>Уведомления</h4>
                        </div>
                        <div className="divide-y divide-[#F1F0EF]">
                          {notifications.map((n) => (
                            <button key={n.id} onClick={() => { toast.success(n.text); setShowNotifications(false); }}
                              className="w-full text-left p-4 hover:bg-[#F8F7F5] transition-colors">
                              <div className="flex items-start gap-3">
                                {n.unread && <div className="w-2 h-2 rounded-full bg-[#FA5108] mt-1.5 shrink-0" />}
                                <div>
                                  <div className="text-sm text-[#212121]">{n.text}</div>
                                  <div className="text-xs text-[#737373] mt-0.5">{n.time}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* User button */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifications(false); setShowProfileMenu(!showProfileMenu); }}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[#212121] hover:bg-[#F1F0EF] rounded-full transition-colors text-sm"
                  >
                    {activeAccount && <AccountAvatar account={activeAccount} size="sm" />}
                    <div className="text-left">
                      <div className="text-sm leading-none" style={{ fontWeight: 600 }}>{userName || "Профиль"}</div>
                      <div className="mt-0.5">
                        {activeAccount && <RolePill role={activeAccount.role} />}
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#737373] transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
                  </button>

                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E8E6E3] shadow-2xl z-50 overflow-hidden">
                        <AccountDropdownContent
                          accounts={accounts}
                          activeAccountId={activeAccountId}
                          onSwitch={handleSwitch}
                          onRemove={handleRemove}
                          onAddAccount={handleAddAccountOpen}
                          onChangeRole={handleChangeRoleOpen}
                          onNavigate={handleNavigate}
                          onLogout={handleLogout}
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8E6E3] text-[#212121] hover:bg-[#F1F0EF] transition-colors text-sm"
                  style={{ fontWeight: 500 }}
                >
                  <LogIn className="w-4 h-4" /> Войти
                </button>
              )}

              {/* Burger */}
              <button className="md:hidden p-2 text-[#212121]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E6E3] bg-white max-h-[80vh] overflow-y-auto">
            {isLoggedIn ? (
              <div>
                <AccountDropdownContent
                  accounts={accounts}
                  activeAccountId={activeAccountId}
                  onSwitch={handleSwitch}
                  onRemove={handleRemove}
                  onAddAccount={handleAddAccountOpen}
                  onChangeRole={handleChangeRoleOpen}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />

                <div className="border-t border-[#E8E6E3]">
                  <div className="px-4 pt-3 pb-1.5">
                    <span className="text-[10px] text-[#AAAAAA]" style={{ fontWeight: 600, letterSpacing: "0.06em" }}>РАЗДЕЛЫ</span>
                  </div>
                  <nav className="px-2 pb-3 space-y-0.5">
                    {[
                      { to: "/realestate", label: "Недвижимость", icon: Building2 },
                      { to: "/services", label: "Услуги / Подрядчики", icon: Wrench },
                      { to: "/market", label: "Маркет", icon: ShoppingCart },
                      { to: "/jobs", label: "Вакансии", icon: Briefcase },
                      { to: "/calculator", label: "Калькулятор", icon: Calculator },
                      { to: "/hub", label: "Гайды", icon: BookOpen },
                    ].map((item) => (
                      <button key={item.to} onClick={() => handleNavigate(item.to)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] hover:text-[#212121] transition-colors text-left">
                        <item.icon className="w-4 h-4" /> {item.label}
                        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("/auth"); }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FA5108] text-white rounded-xl text-sm"
                  style={{ fontWeight: 600 }}
                >
                  <LogIn className="w-4 h-4" /> Войти в аккаунт
                </button>
                <nav className="space-y-0.5">
                  {[
                    { to: "/realestate", label: "Недвижимость", icon: Building2 },
                    { to: "/services", label: "Услуги / Подрядчики", icon: Wrench },
                    { to: "/market", label: "Маркет", icon: ShoppingCart },
                    { to: "/jobs", label: "Вакансии", icon: Briefcase },
                  ].map((item) => (
                    <button key={item.to} onClick={() => handleNavigate(item.to)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors text-left">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── ABBY AI Bar — sticky just below the header, on all pages ──────── */}
      <HeaderAIBar />

      {/* ── Category tabs ────────────────────────────────────────────────── */}
      {showCategoryTabs && (
        <div className="bg-white border-b border-[#E8E6E3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center gap-4">
              {categoryTabs.map((tab) => {
                const isActive = location.pathname.startsWith(tab.to);
                const TabIcon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.to}
                    className={`relative flex-1 max-w-sm h-28 md:h-32 rounded-2xl overflow-hidden group transition-all ${isActive ? "ring-2 ring-[#FA5108] ring-offset-2" : "hover:shadow-lg"}`}
                  >
                    <img src={tab.img} alt={tab.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-colors ${isActive ? "bg-gradient-to-r from-[#FA5108]/80 to-[#FA5108]/40" : "bg-gradient-to-r from-[#212121]/70 to-[#212121]/30 group-hover:from-[#FA5108]/60 group-hover:to-[#FA5108]/20"}`} />
                    <div className="relative h-full flex flex-col justify-between p-4">
                      <div className="flex items-center gap-2">
                        <TabIcon className="w-5 h-5 text-white" />
                        <span className="text-white text-sm md:text-base" style={{ fontWeight: 600 }}>{tab.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-xs">{tab.count} объявлений</span>
                        <span className="text-white text-xs px-2.5 py-1 bg-white/20 rounded-full backdrop-blur-sm">Перейти →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main><Outlet /></main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#212121] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4"><AbbyLogo dark className="h-6 w-auto" /></div>
              <p className="text-sm text-gray-400">Цифровая экосистема для недвижимости и строительства</p>
            </div>
            <div>
              <h4 className="mb-3 text-gray-300" style={{ fontWeight: 500 }}>Площадка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/realestate" className="hover:text-white transition-colors">Недвижимость</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Услуги</Link></li>
                <li><Link to="/market" className="hover:text-white transition-colors">Маркет</Link></li>
                <li><Link to="/hub" className="hover:text-white transition-colors">Блог</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-gray-300" style={{ fontWeight: 500 }}>Реклама на сайте</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => toast.info("Раздел в разработке")} className="hover:text-white transition-colors">О компании</button></li>
                <li><Link to="/calculator" className="hover:text-white transition-colors">Калькулятор</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Для подрядчиков</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-gray-300" style={{ fontWeight: 500 }}>Карьера</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/jobs" className="hover:text-white transition-colors">Вакансии</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Личный ассистент</Link></li>
                <li><button onClick={() => toast.info("Раздел в разработке")} className="hover:text-white transition-colors">Приложение</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-gray-300" style={{ fontWeight: 500 }}>Недвижимость</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/realestate" className="hover:text-white transition-colors">Новостройки</Link></li>
                <li><Link to="/realestate" className="hover:text-white transition-colors">Вторичка</Link></li>
                <li><Link to="/realestate" className="hover:text-white transition-colors">Аренда</Link></li>
                <li><Link to="/realestate" className="hover:text-white transition-colors">Коммерция</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              <p>ABBY SYSTEM — агрегатор услуг. Россия. © ООО «ABBY SYSTEM» 2025–2026. Правила ABBY SYSTEM.</p>
              <p className="mt-1">Политика конфиденциальности. Отличные услуги на ABBY SYSTEM, вы принимаете оферту.</p>
            </div>
            <div className="flex gap-3">
              {["ВК", "YT", "TG"].map((s) => (
                <button key={s} onClick={() => toast.info(`${s}: ссылка скоро`)}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-600 hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showAddAccount && (
        <AddAccountModal
          existingRoles={accounts.map((a) => a.role)}
          onAdd={addAccount}
          onClose={() => setShowAddAccount(false)}
        />
      )}
      {showChangeRole && activeAccount && (
        <ChangeRoleModal
          currentRole={activeAccount.role}
          onConfirm={handleRoleChange}
          onClose={() => setShowChangeRole(false)}
        />
      )}
    </div>
  );
}