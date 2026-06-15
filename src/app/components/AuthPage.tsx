import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Phone, ShieldCheck, User, Building2, Briefcase, Users, ChevronRight,
  ArrowLeft, CheckCircle2, RefreshCw, Home, Hammer, Lock, FileText, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useAccount, UserRole, USER_ROLE_META, ROLES_NEED_VERIFICATION, roleToAccountType } from "./AccountContext";

// ─── Role options (shared with Layout) ───────────────────────────────────────
export const ROLE_OPTIONS: { id: UserRole; icon: typeof User; bg: string }[] = [
  { id: "individual",     icon: User,      bg: "bg-[#212121]" },
  { id: "realtor",        icon: Briefcase, bg: "bg-[#FA5108]" },
  { id: "developer",      icon: Building2, bg: "bg-blue-600"  },
  { id: "developer_corp", icon: Building2, bg: "bg-purple-600"},
  { id: "agency",         icon: Users,     bg: "bg-teal-600"  },
  { id: "contractor",     icon: Hammer,    bg: "bg-orange-600"},
  { id: "construction",   icon: Home,      bg: "bg-red-600"   },
];

// ─── ABBY Logo inline ─────────────────────────────────────────────────────────
function AbbyLogoInline() {
  return (
    <svg viewBox="0 0 2176 395" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
      <path d="M84.8398 239.925C84.8398 201.13 116.289 169.681 155.083 169.681H262.301L282.259 84.8412H155.083L153.079 84.8537C68.3525 85.9269 0 154.944 0 239.925C0 324.906 68.3525 393.922 153.079 394.996L155.083 395.008H209.292L229.251 310.168H155.083C116.289 310.168 84.8398 278.719 84.8398 239.925Z" fill="#FA5108"/>
      <path d="M441.151 155.083C441.151 116.289 409.702 84.8397 370.907 84.8397H281.99L301.949 0H370.907C456.558 0 525.991 69.4332 525.991 155.083C525.991 240.734 456.558 310.167 370.907 310.167H228.981L248.94 225.327H370.907C409.702 225.327 441.151 193.878 441.151 155.083Z" fill="#FA5108"/>
      <path d="M904.279 76.9919L978.661 318.944H879.928L871.2 289.522H664.328L642.946 318.944H549.793L731.443 76.9919H904.279ZM710.655 227.563H853.201L825.286 137.567H780.74L710.655 227.563Z" fill="#212121"/>
      <path d="M1303.7 167.681C1331.39 167.681 1342.01 179.345 1342.01 206.69L1322.58 269.1C1318.85 297.563 1300.43 318.944 1272.74 318.944H949.093L1002.28 76.9919H1277.27C1308.16 76.9919 1318.85 104.533 1318.85 130.072C1318.85 140.803 1310.53 159.175 1301.62 167.681H1303.7ZM1082.46 137.567L1076.52 167.681H1200.27C1208.58 167.681 1215.5 160.758 1215.5 152.451C1215.5 144.143 1208.58 137.567 1200.27 137.567H1082.46ZM1224.87 258.716V258.37C1233.53 258.37 1240.45 251.793 1240.45 243.14C1240.45 234.486 1233.53 227.563 1224.87 227.563H1064.05L1056.92 258.716H1224.87Z" fill="#212121"/>
      <path d="M1677.74 169.866C1697.19 169.866 1694.22 217.381 1694.22 217.381L1686.5 263.708C1686.5 291.399 1650.04 318.944 1622.35 318.944H1302.47L1355.67 76.9919H1624.38C1657.95 76.9919 1676.4 95.6238 1674.62 130.072C1673.82 145.515 1663.18 157.303 1657.99 166.302L1677.74 169.866ZM1440.61 137.567L1432.29 167.681H1558.8C1567.11 167.681 1574.03 160.758 1574.03 152.451C1574.03 144.143 1567.11 137.567 1558.8 137.567H1440.61ZM1580.77 258.716V258.37C1589.43 258.37 1596.35 251.793 1596.35 243.14C1596.35 234.486 1589.43 227.563 1580.77 227.563H1419.22L1410.31 258.716H1580.77Z" fill="#212121"/>
      <path d="M1981.09 78.9935L2078.49 76.9919L2048.2 207.878C2045.23 235.199 2006.63 258.37 1989.4 258.37H1897.94L1885.4 318.944H1788.82L1801.13 258.37H1717.14C1689.79 258.37 1676.31 234.629 1676.31 207.284L1703.48 76.9919H1797.91L1779.74 171.054C1776.18 190.654 1779.74 198.141 1817.51 198.141H1902.36C1926.45 198.141 1954.96 198.141 1960.9 175.211L1981.09 78.9935Z" fill="#212121"/>
    </svg>
  );
}

// Steps: Phone → Code → Name → Role → (Documents for business)
const STEPS_SIMPLE   = ["Телефон", "Код", "Имя", "Роль"];
const STEPS_BUSINESS = ["Телефон", "Код", "Имя", "Роль", "Документы"];

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string })?.returnTo ?? "/";
  const { setIsLoggedIn, setUserName, setPhone, setUserRole } = useAccount();

  // Steps: 0=phone, 1=code, 2=name, 3=role, 4=documents(business only)
  const [step, setStep] = useState(0);
  const [phoneInput, setPhoneInput] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [nameInput, setNameInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [docUploaded, setDocUploaded] = useState<boolean[]>([false, false, false]);

  const isBusinessRole = selectedRole ? ROLES_NEED_VERIFICATION.includes(selectedRole) : false;
  const STEPS = isBusinessRole ? STEPS_BUSINESS : STEPS_SIMPLE;

  // ── Phone formatter ──────────────────────────────────────────────────────
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    let result = "+7";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 11);
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setPhoneInput(raw.startsWith("7") ? raw : "7" + raw.slice(0, 10));
  };

  // ── OTP ──────────────────────────────────────────────────────────────────
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
  };
  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  // ── Step actions ─────────────────────────────────────────────────────────
  const sendCode = () => {
    if (phoneInput.replace(/\D/g, "").length < 11) {
      toast.error("Введите корректный номер телефона"); return;
    }
    setCountdown(59);
    const timer = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; });
    }, 1000);
    setStep(1);
    toast.success("Код отправлен", { description: `SMS на ${formatPhone(phoneInput)}` });
  };

  const verifyOtp = () => {
    if (otp.join("").length < 4) { toast.error("Введите 4-значный код"); return; }
    setStep(2);
  };

  const submitName = () => {
    if (nameInput.trim().length < 2) { toast.error("Введите ваше имя"); return; }
    setStep(3);
  };

  const submitRole = () => {
    if (!selectedRole) { toast.error("Выберите роль"); return; }
    if (isBusinessRole) { setStep(4); }
    else { finishRegistration(); }
  };

  const finishRegistration = () => {
    if (!selectedRole) return;
    setPhone(phoneInput);
    setUserRole(selectedRole);
    setUserName(nameInput.trim());
    setIsLoggedIn(true);
    toast.success(`Добро пожаловать, ${nameInput.trim()}!`, { description: "Аккаунт создан" });
    navigate(returnTo, { replace: true });
  };

  const submitDocuments = () => {
    if (!selectedRole) return;
    setPhone(phoneInput);
    setUserRole(selectedRole);
    setUserName(nameInput.trim());
    setIsLoggedIn(true);
    toast.success("Аккаунт создан", {
      description: "Документы отправлены на проверку. Доступ откроется после верификации.",
    });
    navigate(returnTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <AbbyLogoInline />
          </a>
          <p className="text-sm text-[#737373] mt-2">Войдите или зарегистрируйтесь</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E6E3] overflow-hidden">
          {/* Progress bar */}
          <div className="flex border-b border-[#F1F0EF]">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 py-3 text-center text-xs transition-colors ${
                i === step ? "text-[#FA5108] border-b-2 border-[#FA5108]" :
                i < step ? "text-green-600" : "text-[#BBBBBB]"
              }`} style={{ fontWeight: i === step ? 600 : 400 }}>
                {i < step ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : s}
              </div>
            ))}
          </div>

          <div className="p-6">

            {/* ─── Step 0: Phone ─────────────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700 }}>Введите номер телефона</h2>
                  <p className="text-sm text-[#737373]">Мы отправим SMS с кодом подтверждения</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] mb-1.5 block" style={{ fontWeight: 500 }}>Номер телефона</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
                    <input
                      type="tel"
                      value={formatPhone(phoneInput)}
                      onChange={handlePhoneChange}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full pl-10 pr-4 py-3.5 bg-[#F8F7F5] border border-[#E8E6E3] rounded-xl text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20 focus:border-[#FA5108] transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && sendCode()}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-[#F8F7F5] rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[#FA5108] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#737373]">
                    Нажимая «Получить код», вы соглашаетесь с <span className="text-[#FA5108] cursor-pointer">Условиями использования</span> и <span className="text-[#FA5108] cursor-pointer">Политикой конфиденциальности</span> ABBY.
                  </p>
                </div>
                <button
                  onClick={sendCode}
                  className="w-full py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
                >
                  Получить код
                </button>
              </div>
            )}

            {/* ─── Step 1: OTP ───────────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-[#737373] mb-3 hover:text-[#212121] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Назад
                  </button>
                  <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700 }}>Введите код из SMS</h2>
                  <p className="text-sm text-[#737373]">Отправили на {formatPhone(phoneInput)}</p>
                </div>
                <div className="flex gap-3 justify-center">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      className={`w-14 h-14 text-center rounded-xl border-2 text-xl focus:outline-none transition-colors ${
                        d ? "border-[#FA5108] bg-[#FA5108]/5 text-[#FA5108]" : "border-[#E8E6E3] bg-[#F8F7F5] text-[#212121]"
                      }`}
                      style={{ fontWeight: 700 }}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#737373] text-center">Введите любые 4 цифры для демо-входа</p>
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-[#737373]">Повторная отправка через <span className="text-[#212121]" style={{ fontWeight: 600 }}>{countdown} с</span></p>
                  ) : (
                    <button onClick={() => { sendCode(); setOtp(["","","",""]); }} className="flex items-center gap-1 text-sm text-[#FA5108] mx-auto hover:opacity-80 transition-opacity" style={{ fontWeight: 500 }}>
                      <RefreshCw className="w-4 h-4" /> Отправить код повторно
                    </button>
                  )}
                </div>
                <button
                  onClick={verifyOtp}
                  className="w-full py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
                >
                  Подтвердить
                </button>
              </div>
            )}

            {/* ─── Step 2: Name ──────────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700 }}>Ваше имя</h2>
                  <p className="text-sm text-[#737373]">Имя будет отображаться в профиле и объявлениях</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] mb-1.5 block" style={{ fontWeight: 500 }}>Имя и фамилия</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Иван Иванов"
                      className="w-full pl-10 pr-4 py-3.5 bg-[#F8F7F5] border border-[#E8E6E3] rounded-xl text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#FA5108]/20 focus:border-[#FA5108] transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && submitName()}
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  onClick={submitName}
                  className="w-full py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
                >
                  Продолжить
                </button>
              </div>
            )}

            {/* ─── Step 3: Role ──────────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700 }}>Кто вы на ABBY?</h2>
                  <p className="text-sm text-[#737373]">Выберите роль, чтобы получить подходящий функционал</p>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {ROLE_OPTIONS.map(({ id, icon: Icon, bg }) => {
                    const meta = USER_ROLE_META[id];
                    const needsVerif = meta.needsVerification;
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedRole(id)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          selectedRole === id
                            ? "border-[#FA5108] bg-[#FA5108]/5"
                            : "border-[#E8E6E3] hover:border-[#D4D2CF] hover:bg-[#F8F7F5]"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${bg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>{meta.label}</span>
                            {needsVerif && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full flex items-center gap-1 shrink-0" style={{ fontWeight: 500 }}>
                                <Lock className="w-2.5 h-2.5" /> Верификация
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#737373] mt-0.5 truncate">{meta.desc}</div>
                        </div>
                        {selectedRole === id && <CheckCircle2 className="w-4 h-4 text-[#FA5108] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {selectedRole && ROLES_NEED_VERIFICATION.includes(selectedRole) && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      После регистрации нужно загрузить документы. Полный доступ откроется после проверки нашими специалистами.
                    </p>
                  </div>
                )}

                <button
                  onClick={submitRole}
                  className="w-full py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
                >
                  {isBusinessRole ? "Далее — загрузка документов" : "Завершить регистрацию"} <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            )}

            {/* ─── Step 4: Documents (business only) ─────────────────────── */}
            {step === 4 && isBusinessRole && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[#212121] mb-1" style={{ fontWeight: 700 }}>Загрузите документы</h2>
                  <p className="text-sm text-[#737373]">
                    Для верификации {selectedRole ? USER_ROLE_META[selectedRole].label.toLowerCase() : ""} необходимы следующие документы
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "ИНН / ОГРН / ОГРНИП", hint: "Свидетельство о регистрации" },
                    { label: "Паспорт руководителя (разворот)", hint: "Страницы 2–3 и прописка" },
                    { label: "Лицензия / СРО (если есть)", hint: "Для строительных и проектных компаний" },
                  ].map((doc, i) => (
                    <div
                      key={doc.label}
                      onClick={() => {
                        const next = [...docUploaded];
                        next[i] = true;
                        setDocUploaded(next);
                        toast.success(`«${doc.label}» загружен`);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        docUploaded[i]
                          ? "border-green-400 bg-green-50"
                          : "border-dashed border-[#E8E6E3] hover:border-[#FA5108]/40 hover:bg-[#FA5108]/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${docUploaded[i] ? "bg-green-100" : "bg-[#F1F0EF]"}`}>
                          {docUploaded[i]
                            ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                            : <Upload className="w-4 h-4 text-[#737373]" />}
                        </div>
                        <div>
                          <div className="text-sm text-[#212121]" style={{ fontWeight: 600 }}>{doc.label}</div>
                          <div className="text-xs text-[#737373]">{docUploaded[i] ? "Загружен ✓" : doc.hint}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#F8F7F5] rounded-xl">
                  <p className="text-xs text-[#737373] leading-relaxed">
                    После отправки заявки наши специалисты проверят документы в течение <span className="text-[#212121]" style={{ fontWeight: 600 }}>1–2 рабочих дней</span>. До завершения верификации доступ к публикации объявлений ограничен.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={submitDocuments}
                    className="flex-1 py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)", fontWeight: 600 }}
                  >
                    Отправить заявку
                  </button>
                  <button onClick={submitDocuments} className="flex-1 py-3.5 rounded-xl border border-[#E8E6E3] text-sm text-[#737373] hover:bg-[#F1F0EF] transition-colors">
                    Загружу позже
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        <p className="text-center text-xs text-[#737373] mt-6">
          Уже есть аккаунт?{" "}
          <button onClick={() => navigate("/")} className="text-[#FA5108] hover:underline" style={{ fontWeight: 500 }}>
            На главную
          </button>
        </p>
      </div>
    </div>
  );
}
