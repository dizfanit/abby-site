import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Search, Clock, TrendingUp, Building2, Wrench, ShoppingBag, Briefcase, ArrowRight, X } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  to: string;
  iconColor: string;
}

// ─── Suggestion database ──────────────────────────────────────────────────────
const ALL_SUGGESTIONS: Suggestion[] = [
  // Недвижимость
  { id: "r1",  text: "Квартира в Калининграде",                category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r2",  text: "Квартира аренда",                        category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r3",  text: "Квартира-студия купить",                  category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r4",  text: "Квартира 2-комнатная",                   category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r5",  text: "Квартира в новостройке",                 category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r6",  text: "Новостройки Калининград",                category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r7",  text: "Новостройки с отделкой",                 category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r8",  text: "Дом купить Калининград",                 category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r9",  text: "Дом аренда",                             category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r10", text: "Коммерческая недвижимость",              category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r11", text: "Офис аренда Калининград",               category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r12", text: "Земельный участок",                      category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r13", text: "Гараж купить",                           category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  { id: "r14", text: "Комната аренда",                         category: "Недвижимость",         icon: Building2,  to: "/realestate", iconColor: "text-blue-500" },
  // Услуги
  { id: "s1",  text: "Ремонт квартиры под ключ",               category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s2",  text: "Ремонт ванной комнаты",                  category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s3",  text: "Ремонт кухни",                           category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s4",  text: "Ремонт косметический",                   category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s5",  text: "Сантехник вызов",                        category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s6",  text: "Сантехника монтаж",                      category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s7",  text: "Электрик Калининград",                   category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s8",  text: "Электромонтажные работы",                category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s9",  text: "Дизайн интерьера",                       category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s10", text: "Плиточник укладка плитки",               category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s11", text: "Строительство дома под ключ",            category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s12", text: "Кровля монтаж",                          category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s13", text: "Демонтаж перегородок",                   category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s14", text: "Окна установка",                         category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s15", text: "Натяжные потолки",                       category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  { id: "s16", text: "Штукатурка стен",                        category: "Услуги",               icon: Wrench,     to: "/services",   iconColor: "text-[#FA5108]" },
  // Товары
  { id: "m1",  text: "Кирпич строительный",                   category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m2",  text: "Цемент купить",                          category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m3",  text: "Ламинат напольное покрытие",             category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m4",  text: "Керамическая плитка",                    category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m5",  text: "Двери межкомнатные",                     category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m6",  text: "Инструменты строительные",               category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m7",  text: "Краска для стен",                        category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m8",  text: "Обои купить Калининград",                category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m9",  text: "Утеплитель базальтовый",                 category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m10", text: "Гипсокартон листы",                      category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  { id: "m11", text: "Сантехника раковины унитазы",            category: "Маркет",               icon: ShoppingBag,to: "/market",     iconColor: "text-green-500" },
  // Вакансии
  { id: "j1",  text: "Прораб вакансия",                        category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j2",  text: "Плиточник работа",                       category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j3",  text: "Электрик вакансия Калининград",          category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j4",  text: "Сантехник работа",                       category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j5",  text: "Разнорабочий вакансия",                  category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j6",  text: "Отделочник маляр работа",                category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j7",  text: "Строитель вахта",                        category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j8",  text: "Сварщик работа Калининград",             category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j9",  text: "Дизайнер интерьера работа",              category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
  { id: "j10", text: "Каменщик монтажник вакансия",            category: "Вакансии",             icon: Briefcase,  to: "/jobs",       iconColor: "text-purple-500" },
];

const TRENDING = [
  { id: "t1", text: "Квартира в новостройке Калининград", to: "/realestate", icon: TrendingUp },
  { id: "t2", text: "Ремонт под ключ недорого",           to: "/services",   icon: TrendingUp },
  { id: "t3", text: "Плиточник опытный",                  to: "/services",   icon: TrendingUp },
  { id: "t4", text: "Стройматериалы оптом",               to: "/market",     icon: TrendingUp },
];

const RECENT_KEY = "abby_recent_search";

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]").slice(0, 5); }
  catch { return []; }
}

function addRecent(query: string) {
  try {
    const prev = getRecent().filter(q => q !== query);
    localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, 5)));
  } catch {}
}

// ─── Highlight matching part ──────────────────────────────────────────────────
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[#FA5108]" style={{ fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute suggestions
  const filtered: Suggestion[] = query.length >= 1
    ? ALL_SUGGESTIONS
        .filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8)
    : [];

  // What to show in dropdown
  const showRecent = query.length === 0 && recent.length > 0;
  const showTrending = query.length === 0;
  const showFiltered = filtered.length > 0;

  const totalItems = showFiltered ? filtered.length
    : (showRecent ? recent.length : 0) + (showTrending ? TRENDING.length : 0);

  // Reset active on query change
  useEffect(() => { setActiveIdx(-1); }, [query]);

  // Load recent on open
  useEffect(() => {
    if (open) setRecent(getRecent());
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = useCallback((text: string, to: string) => {
    addRecent(text);
    setRecent(getRecent());
    setQuery(text);
    setOpen(false);
    navigate(to);
  }, [navigate]);

  const handleSearch = () => {
    if (!query.trim()) return;
    const match = ALL_SUGGESTIONS.find(s =>
      s.text.toLowerCase().includes(query.toLowerCase())
    );
    addRecent(query.trim());
    setOpen(false);
    navigate(match?.to ?? "/realestate");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, totalItems - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      if (activeIdx >= 0 && showFiltered && filtered[activeIdx]) {
        go(filtered[activeIdx].text, filtered[activeIdx].to);
      } else {
        handleSearch();
      }
    }
    else if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
  };

  const clearQuery = () => { setQuery(""); inputRef.current?.focus(); };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl">
      {/* Input */}
      <div className={`flex items-center bg-[#DADADA]/40 rounded-full overflow-hidden h-9 transition-all ${open ? "ring-2 ring-[#FA5108]/30 bg-white shadow-sm" : ""}`}>
        <Search className="w-4 h-4 text-[#737373] ml-3 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Поиск по объявлениям"
          className="flex-1 px-2 py-1.5 bg-transparent text-sm focus:outline-none text-[#212121] placeholder:text-[#212121]/50"
        />
        {query && (
          <button onClick={clearQuery} className="p-1.5 text-[#737373] hover:text-[#212121] transition-colors mr-1">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="h-full px-4 text-white text-xs rounded-full shrink-0"
          style={{ background: "linear-gradient(98deg, #FA5108 0%, #F44900 16%, #FF753A 76%, #FFA178 119%)" }}
        >
          Найти
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E8E6E3] shadow-2xl z-50 overflow-hidden max-h-[480px] overflow-y-auto">
          
          {/* ── Filtered suggestions ── */}
          {showFiltered && (
            <div>
              {filtered.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => go(s.text, s.to)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      i === activeIdx ? "bg-[#FFF5F0]" : "hover:bg-[#F8F7F5]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${s.iconColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#212121] truncate">
                        <Highlighted text={s.text} query={query} />
                      </div>
                    </div>
                    <span className="text-[10px] text-[#BBBBBB] shrink-0 border border-[#E8E6E3] rounded px-1.5 py-0.5">{s.category}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#BBBBBB] shrink-0" />
                  </button>
                );
              })}
              {/* Full search link */}
              <button
                onClick={handleSearch}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 border-t border-[#F1F0EF] hover:bg-[#F8F7F5] transition-colors"
              >
                <Search className="w-4 h-4 text-[#FA5108] shrink-0" />
                <span className="text-sm text-[#FA5108]" style={{ fontWeight: 500 }}>
                  Искать «{query}» во всех объявлениях
                </span>
              </button>
            </div>
          )}

          {/* ── Empty state for query ── */}
          {query.length >= 2 && !showFiltered && (
            <div className="px-4 py-6 text-center text-sm text-[#737373]">
              Ничего не найдено по запросу <span className="text-[#212121]" style={{ fontWeight: 600 }}>«{query}»</span>
              <div className="mt-2">
                <button onClick={handleSearch} className="text-[#FA5108] text-sm hover:underline" style={{ fontWeight: 500 }}>
                  Искать в объявлениях →
                </button>
              </div>
            </div>
          )}

          {/* ── No query: recent + trending ── */}
          {!query && (
            <>
              {showRecent && (
                <div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs text-[#737373]" style={{ fontWeight: 600 }}>Вы искали</span>
                    <button onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]); }} className="text-[10px] text-[#BBBBBB] hover:text-[#737373] transition-colors">Очистить</button>
                  </div>
                  {recent.map((r, i) => (
                    <button key={i} onClick={() => { setQuery(r); handleSearch(); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-[#F8F7F5] transition-colors">
                      <Clock className="w-4 h-4 text-[#BBBBBB] shrink-0" />
                      <span className="text-sm text-[#737373] flex-1 truncate">{r}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className={showRecent ? "border-t border-[#F1F0EF]" : ""}>
                <div className="px-4 py-2">
                  <span className="text-xs text-[#737373]" style={{ fontWeight: 600 }}>Популярные запросы</span>
                </div>
                {TRENDING.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => go(t.text, t.to)}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F7F5] transition-colors">
                      <Icon className="w-4 h-4 text-[#FA5108] shrink-0" />
                      <span className="text-sm text-[#212121]">{t.text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#BBBBBB] shrink-0 ml-auto" />
                    </button>
                  );
                })}
              </div>

              {/* Quick category links */}
              <div className="border-t border-[#F1F0EF] px-4 py-3 flex flex-wrap gap-2">
                {[
                  { label: "Недвижимость", to: "/realestate", color: "text-blue-600 bg-blue-50 border-blue-200" },
                  { label: "Услуги",       to: "/services",   color: "text-[#FA5108] bg-[#FFF5F0] border-[#FA5108]/30" },
                  { label: "Товары",       to: "/market",     color: "text-green-600 bg-green-50 border-green-200" },
                  { label: "Вакансии",     to: "/jobs",       color: "text-purple-600 bg-purple-50 border-purple-200" },
                ].map((cat) => (
                  <button key={cat.to} onClick={() => { setOpen(false); navigate(cat.to); }}
                    className={`text-xs px-3 py-1 rounded-full border ${cat.color} transition-colors hover:opacity-80`}
                    style={{ fontWeight: 500 }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
