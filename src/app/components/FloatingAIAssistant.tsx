import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { X, Send, Sparkles, ChevronDown, Mic, Bot, ArrowRight, Wrench } from "lucide-react";
import mascotSvg from "../../imports/Group_1171276036.svg";

// ─── AI Knowledge Base (shared) ───────────────────────────────────────────────
type AIResult = {
  text: string;
  cards?: { title: string; price: string; desc: string; link: string; img?: string }[];
  actions?: { label: string; link: string }[];
};

const knowledgeBase: { keywords: string[]; response: AIResult }[] = [
  {
    keywords: ["квартир", "купить квартиру", "1-к", "2-к", "3-к", "однокомнатн", "двухкомнатн", "однушк", "двушк"],
    response: {
      text: "Нашёл для вас актуальные варианты квартир в Калининграде 🏠",
      cards: [
        { title: "1-к квартира, 42 м²", price: "4 750 000 ₽", desc: "Светлогорск, 3/9 эт, новостройка", link: "/realestate", img: "/remote-images/unsplash-013.jpg" },
        { title: "2-к квартира, 64 м²", price: "7 200 000 ₽", desc: "Калининград, ул. Победы, 7/12 эт", link: "/realestate", img: "/remote-images/unsplash-016.jpg" },
      ],
      actions: [{ label: "Все квартиры", link: "/realestate" }, { label: "Фильтры поиска", link: "/realestate" }],
    },
  },
  {
    keywords: ["подрядч", "мастер", "ремонт", "бригад", "строитель"],
    response: {
      text: "Вот проверенные подрядчики по ремонту в вашем районе 🔧",
      cards: [
        { title: "СтройМастер", price: "от 3 500 ₽/м²", desc: "Комплексный ремонт. Рейтинг 4.9 ⭐", link: "/services" },
        { title: "АлмазБриг", price: "от 2 800 ₽/м²", desc: "Отделочные работы. Рейтинг 4.7 ⭐", link: "/services" },
      ],
      actions: [{ label: "Все подрядчики", link: "/services" }, { label: "Разместить заказ", link: "/post" }],
    },
  },
  {
    keywords: ["материал", "ламинат", "плитк", "краск", "штукатурк", "кирпич", "цемент", "маркет", "купить"],
    response: {
      text: "Строматериалы на ABBY Маркет — с доставкой в день заказа 📦",
      cards: [
        { title: "Ламинат Quick-Step", price: "1 890 ₽/м²", desc: "Дуб натуральный, 8мм, 32 класс", link: "/market" },
        { title: "Краска Dulux Diamond", price: "4 200 ₽/шт", desc: "Интерьерная, белая, матовая, 10л", link: "/market" },
      ],
      actions: [{ label: "Перейти в Маркет", link: "/market" }],
    },
  },
  {
    keywords: ["работ", "вакансий", "найти работу", "устроиться", "нанять", "сотрудник"],
    response: {
      text: "Открытые вакансии в строительстве и ремонте 👷",
      cards: [
        { title: "Каменщик 6-го разряда", price: "85 000 ₽/мес", desc: "Полный день, ЖК «Ривьера Парк»", link: "/jobs" },
        { title: "Прораб / ИТР", price: "120 000 ₽/мес", desc: "Опыт 5 лет, управление бригадой", link: "/jobs" },
      ],
      actions: [{ label: "Все вакансии", link: "/jobs" }, { label: "Разместить вакансию", link: "/post" }],
    },
  },
  {
    keywords: ["ипотек", "кредит", "рассрочк"],
    response: {
      text: "А��туальные программы ипотеки для покупки жилья 💳",
      actions: [
        { label: "Калькулятор ипотеки", link: "/calculator" },
        { label: "Новостройки с ипотекой", link: "/realestate" },
      ],
    },
  },
  {
    keywords: ["умеешь", "что ты", "помощь", "функци", "возможност"],
    response: {
      text: "Я — ИИ-ассистент ABBY. Вот что я умею:\n\n🏠 Недвижимость — найду квартиру по вашим параметрам\n🔧 Подрядчики — подберу проверенных мастеров\n📦 Маркет — материалы с доставкой\n👷 Вакансии — работа в строительстве\n💳 Ипотека — калькулятор и программы\n\nПросто напишите, что вас интересует!",
      actions: [
        { label: "Недвижимость", link: "/realestate" },
        { label: "Услуги", link: "/services" },
        { label: "Маркет", link: "/market" },
        { label: "Вакансии", link: "/jobs" },
      ],
    },
  },
  {
    keywords: ["цен", "сколько стоит", "оценк", "стоимость"],
    response: {
      text: "Воспользуйтесь нашим калькулятором для расчёта стоимости ремонта или оценки квартиры 📐",
      actions: [
        { label: "Калькулятор ремонта", link: "/calculator" },
        { label: "Каталог недвижимости", link: "/realestate" },
      ],
    },
  },
];

function getAIResponse(query: string): AIResult {
  const q = query.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => q.includes(kw))) {
      return entry.response;
    }
  }
  return {
    text: `Понял, ищу «${query}» в базе ABBY... Попробуйте уточнить запрос или воспользуйтесь быстрыми кнопками ниже.`,
    actions: [
      { label: "Недвижимость", link: "/realestate" },
      { label: "Услуги", link: "/services" },
      { label: "Маркет", link: "/market" },
    ],
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: number;
  role: "user" | "bot";
  text: string;
  cards?: AIResult["cards"];
  actions?: AIResult["actions"];
}

const QUICK_CHIPS = [
  "Найди квартиру",
  "Подобрать подрядчика",
  "Стройматериалы",
  "Вакансии",
  "Что ты умеешь?",
];

// ─── Mascot Avatar ────────────────────────────────────────────────────────────
function MascotAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        boxShadow: "0 0 0 2px #FA5108, 0 4px 12px rgba(250,81,8,0.3)",
      }}
    >
      <Sparkles style={{ width: size * 0.48, height: size * 0.48, color: "#FA5108" }} />
    </div>
  );
}

// ─── Header AI Bar ────────────────────────────────────────────────────────────
// Sticky bar that lives between the header and the category tabs on all pages
export function HeaderAIBar() {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "bot",
      text: "Привет! Я ABBY AI — ваш умный помощник. Помогу найти квартиру, подрядчика, стройматериалы или вакансию. Просто напишите, что вас интересует!",
      actions: [
        { label: "Недвижимость", link: "/realestate" },
        { label: "Подрядчики", link: "/services" },
        { label: "Маркет", link: "/market" },
        { label: "Вакансии", link: "/jobs" },
      ],
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, expanded, isTyping]);

  // Close when clicking outside
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const sendMessage = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput("");
    setExpanded(true);

    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      const result = getAIResponse(msg);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: result.text, cards: result.cards, actions: result.actions },
      ]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <div
      ref={panelRef}
      className="sticky z-40"
      style={{ top: 56 }} // = h-14 (header height)
    >
      {/* ── Main strip ── */}
      <div
        className="border-b"
        style={{
          background: "linear-gradient(98deg, #1a1a2e 0%, #212121 100%)",
          borderColor: "#FA510820",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2">
            {/* Mascot */}
            <MascotAvatar size={34} />

            {/* Label */}
            <div className="hidden sm:flex flex-col shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-white text-xs" style={{ fontWeight: 700 }}>ABBY AI</span>
                <span
                  className="px-1 py-px rounded text-[9px] text-white"
                  style={{ background: "#FA5108", fontWeight: 700, letterSpacing: "0.05em" }}
                >
                  BETA
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{ animation: "pulse-dot 2s infinite" }} />
                <span className="text-white/50 text-[10px]">Онлайн</span>
              </div>
            </div>

            {/* Input */}
            <div
              className="flex-1 flex items-center gap-2 rounded-full px-4 py-1.5 cursor-text"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              onClick={() => { setExpanded(true); inputRef.current?.focus(); }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "#FA5108" }} />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setExpanded(true)}
                onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) sendMessage(); }}
                placeholder="Спросите что угодно — квартиры, ремонт, подрядчики, вакансии..."
                className="flex-1 bg-transparent text-white text-xs placeholder:text-white/40 outline-none min-w-0"
              />
            </div>

            {/* Quick chips — hidden when expanded */}
            {!expanded && (
              <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                {QUICK_CHIPS.slice(0, 3).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toast.info("Голосовой ввод скоро")}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => { if (input.trim()) sendMessage(); else setExpanded(!expanded); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-90"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, #FA5108, #FF753A)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                {expanded && !input.trim()
                  ? <ChevronDown className="w-4 h-4 text-white/60" />
                  : <Send className={`w-3.5 h-3.5 ${input.trim() ? "text-white" : "text-white/40"}`} />
                }
              </button>
              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick chips row — inside expanded or on mobile */}
          {!expanded && (
            <div className="flex lg:hidden items-center gap-1.5 pb-2 overflow-x-auto scrollbar-hide">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap shrink-0 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded chat panel ── */}
      {expanded && (
        <div
          className="border-b border-[#E8E6E3] shadow-xl"
          style={{ background: "#F8F7F5" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Messages */}
            <div
              className="overflow-y-auto py-4 space-y-3"
              style={{ maxHeight: 320 }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "#1a1a2e", boxShadow: "0 0 0 1.5px #FA5108" }}
                    >
                      <img src={mascotSvg} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div
                      className="px-3.5 py-2.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed"
                      style={{
                        background: msg.role === "user"
                          ? "linear-gradient(135deg, #FA5108, #FF753A)"
                          : "#FFFFFF",
                        color: msg.role === "user" ? "#FFFFFF" : "#212121",
                        borderRadius: msg.role === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      }}
                    >
                      {msg.text}
                    </div>

                    {/* Cards */}
                    {msg.cards && msg.cards.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.cards.map((card, i) => (
                          <Link
                            key={i}
                            to={card.link}
                            className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#E8E6E3] hover:border-[#FA5108]/40 hover:shadow-sm transition-all group"
                            onClick={() => setExpanded(false)}
                          >
                            {card.img ? (
                              <img src={card.img} alt={card.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#F1F0EF] flex items-center justify-center shrink-0">
                                <Wrench className="w-4 h-4 text-[#737373]" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-[#212121] group-hover:text-[#FA5108] transition-colors" style={{ fontWeight: 600 }}>
                                {card.title}
                              </div>
                              <div className="text-[11px] text-[#737373] mt-0.5 truncate">{card.desc}</div>
                              <div className="text-xs text-[#FA5108] mt-0.5" style={{ fontWeight: 700 }}>{card.price}</div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#FA5108] shrink-0 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Action links */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.actions.map((action, i) => (
                          <Link
                            key={i}
                            to={action.link}
                            className="px-3 py-1.5 text-[11px] rounded-full transition-colors"
                            style={{
                              border: "1px solid rgba(250,81,8,0.35)",
                              color: "#FA5108",
                              fontWeight: 500,
                            }}
                            onClick={() => setExpanded(false)}
                          >
                            {action.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[#F1F0EF] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#737373]" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#1a1a2e" }}
                  >
                    <img src={mascotSvg} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
                  </div>
                  <div className="px-3.5 py-3 bg-white rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-[#FA5108] rounded-full"
                        style={{ animation: `ai-bounce 1.2s infinite ${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips when chat is open */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 pb-3">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="px-3 py-1.5 rounded-full text-xs border border-[#E8E6E3] text-[#212121] hover:border-[#FA5108] hover:text-[#FA5108] transition-colors bg-white"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes ai-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}