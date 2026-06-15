import { createContext, useContext, useState, useRef, ReactNode } from "react";

export type AccountType = "individual" | "business" | "developer";

export type UserRole =
  | "individual"       // Частное лицо — полный доступ сразу
  | "realtor"          // Риелтор — полный доступ сразу
  | "developer"        // Застройщик — верификация
  | "developer_corp"   // Девелопер — верификация
  | "agency"           // Агентство недвижимости — верификация
  | "contractor"       // Подрядчик — верификация
  | "construction"     // Строительная компания — верификация
  | "legal";           // Юр. лицо (совместимость)

/** Роли, требующие верификации документов */
export const ROLES_NEED_VERIFICATION: UserRole[] = [
  "developer", "developer_corp", "agency", "contractor", "construction",
];

export interface SubAccount {
  id: string;
  type: AccountType;
  role: UserRole;
  name: string;
  phone: string;
  verified: boolean; // прошёл верификацию
}

interface AccountContextValue {
  accounts: SubAccount[];
  activeAccountId: string;
  switchAccount: (id: string) => void;
  addAccount: (type: AccountType, role: UserRole, name: string) => void;
  removeAccount: (id: string) => void;

  // Computed from active account
  accountType: AccountType;
  userRole: UserRole;
  userName: string;
  phone: string;
  isVerified: boolean;
  needsVerification: boolean;

  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  setUserName: (name: string) => void;
  setPhone: (v: string) => void;

  // Called by AuthPage
  setAccountType: (type: AccountType) => void;
  setUserRole: (v: UserRole) => void;
}

const AccountContext = createContext<AccountContextValue>({
  accounts: [],
  activeAccountId: "",
  switchAccount: () => {},
  addAccount: () => {},
  removeAccount: () => {},
  accountType: "individual",
  userRole: "individual",
  userName: "",
  phone: "",
  isVerified: true,
  needsVerification: false,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  setUserName: () => {},
  setPhone: () => {},
  setAccountType: () => {},
  setUserRole: () => {},
});

export function roleToAccountType(role: UserRole): AccountType {
  if (role === "developer" || role === "developer_corp") return "developer";
  if (role === "individual") return "individual";
  // realtor, agency, contractor, construction, legal → business
  return "business";
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [userRole, _setUserRole] = useState<UserRole>("individual");

  const userRoleRef = useRef<UserRole>("individual");

  const [accounts, setAccounts] = useState<SubAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>("");

  const activeAccount = accounts.find((a) => a.id === activeAccountId) ?? accounts[0];
  const accountType: AccountType = activeAccount?.type ?? roleToAccountType(userRoleRef.current);
  const activeRole: UserRole = activeAccount?.role ?? userRoleRef.current;
  const userName: string = activeAccount?.name ?? "";
  const isVerified: boolean = activeAccount?.verified ?? true;
  const needsVerification: boolean = ROLES_NEED_VERIFICATION.includes(activeRole) && !isVerified;

  const setAccountType = (type: AccountType) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === activeAccountId ? { ...a, type } : a))
    );
  };

  const setUserRole = (role: UserRole) => {
    userRoleRef.current = role;
    _setUserRole(role);
    const accType = roleToAccountType(role);
    setAccounts((prev) =>
      prev.length > 0
        ? prev.map((a) => (a.id === activeAccountId ? { ...a, type: accType, role } : a))
        : prev
    );
  };

  const handleSetUserName = (name: string) => {
    setAccounts((prev) => {
      if (prev.length === 0) {
        const id = `acc_${Date.now()}`;
        setActiveAccountId(id);
        const role = userRoleRef.current;
        const type = roleToAccountType(role);
        const verified = !ROLES_NEED_VERIFICATION.includes(role);
        return [{ id, type, role, name, phone, verified }];
      }
      return prev.map((a) => (a.id === activeAccountId ? { ...a, name } : a));
    });
  };

  const handleSetIsLoggedIn = (v: boolean) => {
    setIsLoggedIn(v);
    if (!v) {
      setAccounts([]);
      setActiveAccountId("");
      userRoleRef.current = "individual";
      _setUserRole("individual");
    }
  };

  const handleSetPhone = (p: string) => {
    setPhone(p);
    setAccounts((prev) => prev.map((a) => ({ ...a, phone: p })));
  };

  const switchAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (acc) {
      setActiveAccountId(id);
      userRoleRef.current = acc.role;
      _setUserRole(acc.role);
    }
  };

  const addAccount = (type: AccountType, role: UserRole, name: string) => {
    const id = `acc_${Date.now()}`;
    const verified = !ROLES_NEED_VERIFICATION.includes(role);
    setAccounts((prev) => [...prev, { id, type, role, name, phone, verified }]);
    setActiveAccountId(id);
    userRoleRef.current = role;
    _setUserRole(role);
  };

  const removeAccount = (id: string) => {
    setAccounts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (activeAccountId === id && next.length > 0) {
        const nextAcc = next[0];
        setActiveAccountId(nextAcc.id);
        userRoleRef.current = nextAcc.role;
        _setUserRole(nextAcc.role);
      }
      return next;
    });
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        activeAccountId,
        switchAccount,
        addAccount,
        removeAccount,
        accountType,
        userRole: activeRole,
        userName,
        phone,
        isVerified,
        needsVerification,
        isLoggedIn,
        setIsLoggedIn: handleSetIsLoggedIn,
        setUserName: handleSetUserName,
        setPhone: handleSetPhone,
        setAccountType,
        setUserRole,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}

export const ACCOUNT_TYPE_META: Record<
  AccountType,
  { label: string; shortLabel: string; desc: string; color: string; bg: string; border: string }
> = {
  individual: {
    label: "Физическое лицо",
    shortLabel: "Физ. лицо",
    desc: "Покупка, аренда, избранное",
    color: "bg-[#212121]",
    bg: "bg-[#212121]/5",
    border: "border-[#212121]",
  },
  business: {
    label: "Бизнес / Агент",
    shortLabel: "Агент",
    desc: "Объявления, клиенты, CRM",
    color: "bg-[#FA5108]",
    bg: "bg-[#FA5108]/5",
    border: "border-[#FA5108]",
  },
  developer: {
    label: "Застройщик",
    shortLabel: "Застройщик",
    desc: "ЖК, проекты, партнёры",
    color: "bg-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-500",
  },
};

export const USER_ROLE_META: Record<
  UserRole,
  { label: string; desc: string; accountType: AccountType; needsVerification: boolean }
> = {
  individual:      { label: "Частное лицо",             desc: "Покупка, продажа и аренда для себя",               accountType: "individual", needsVerification: false },
  realtor:         { label: "Риелтор",                  desc: "Работа с клиентами, комиссионные сделки",          accountType: "business",   needsVerification: false },
  developer:       { label: "Застройщик",               desc: "Размещение ЖК, управление объектами",              accountType: "developer",  needsVerification: true  },
  developer_corp:  { label: "Девелопер",                desc: "Крупный портфель проектов, партнёрская сеть",      accountType: "developer",  needsVerification: true  },
  agency:          { label: "Агентство недвижимости",   desc: "Команда агентов, объявления, CRM",                 accountType: "business",   needsVerification: true  },
  contractor:      { label: "Подрядчик",                desc: "Выполнение ремонтных и строительных работ",        accountType: "business",   needsVerification: true  },
  construction:    { label: "Строительная компания",    desc: "Генподряд, строительство объектов",               accountType: "business",   needsVerification: true  },
  legal:           { label: "Юридическое лицо",         desc: "Бизнес-аккаунт: аналитика, продвижение",          accountType: "business",   needsVerification: true  },
};
