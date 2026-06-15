import { useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Lightbulb,
  Home,
  Wrench,
  FileText,
  TrendingUp,
  HelpCircle,
  Star,
  ChevronRight,
  Calculator,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const IMG1 = "https://images.unsplash.com/photo-1738168251394-9241984c8292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzcyMDE4ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG2 = "https://images.unsplash.com/photo-1736390800504-d3963b553aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwcmVub3ZhdGlvbnxlbnwxfHx8fDE3NzIwNDczMTh8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG3 = "https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MjA2NDczMHww&ixlib=rb-4.1.0&q=80&w=1080";

const categories = [
  { id: "all", label: "Все", icon: BookOpen },
  { id: "mortgage", label: "Ипотека", icon: Home },
  { id: "renovation", label: "Ремонт", icon: Wrench },
  { id: "legal", label: "Юридическое", icon: FileText },
  { id: "market", label: "Рынок", icon: TrendingUp },
];

const articles = [
  {
    id: "1",
    title: "Как оформить ипотеку в 2026 году: пошаговый гайд",
    category: "mortgage",
    readTime: "12 мин",
    img: IMG1,
    featured: true,
    excerpt: "Подробная инструкция от выбора банка до подписания кредитного договора. Какие документы нужны, как снизить ставку, подводные камни.",
    tags: ["Ипотека", "Гайд", "Новичкам"],
  },
  {
    id: "2",
    title: "5 ошибок при выборе подрядчика на ремонт",
    category: "renovation",
    readTime: "8 мин",
    img: IMG2,
    featured: true,
    excerpt: "Как не нарваться на недобросовестного подрядчика и защитить свои деньги. Чек-лист проверки перед началом работ.",
    tags: ["Ремонт", "Советы"],
  },
  {
    id: "3",
    title: "Как проверить квартиру перед покупкой на вторичном рынке",
    category: "legal",
    readTime: "10 мин",
    img: IMG3,
    featured: false,
    excerpt: "Юридическая чистота, обременения, история перепланировок — полный чек-лист.",
    tags: ["Вторичка", "Юридическое"],
  },
  {
    id: "4",
    title: "Обзор рынка новостроек Москвы — Q1 2026",
    category: "market",
    readTime: "15 мин",
    img: IMG1,
    featured: false,
    excerpt: "Аналитика цен, объёмов ввода, прогнозы по ключевым районам и ценовым сегментам.",
    tags: ["Аналитика", "Новостройки"],
  },
  {
    id: "5",
    title: "Смета на ремонт: как составить и не переплатить",
    category: "renovation",
    readTime: "7 мин",
    img: IMG2,
    featured: false,
    excerpt: "Разбираем структуру сметы, рыночные бенчмарки и способы контролировать бюджет.",
    tags: ["Ремонт", "Смета"],
  },
  {
    id: "6",
    title: "Эскроу-счёт: как это работает и почему это безопасно",
    category: "legal",
    readTime: "6 мин",
    img: IMG3,
    featured: false,
    excerpt: "Механизм защиты средств при покупке новостройки. Что происходит, если застройщик обанкротится.",
    tags: ["Безопасность", "Новостройки"],
  },
];

const tips = [
  {
    icon: Lightbulb,
    title: "Совет дня",
    text: "При выборе подрядчика всегда проверяйте реальные отзывы, привязанные к конкретным сделкам, а не отзывы на сторонних сайтах.",
  },
  {
    icon: Calculator,
    title: "Калькулятор",
    text: "Не знаете бюджет ремонта? Используйте наш калькулятор с рыночными бенчмарками.",
    link: "/calculator",
  },
  {
    icon: HelpCircle,
    title: "Частый вопрос",
    text: "Можно ли забронировать квартиру онлайн? Да, бронирование фиксирует цену на 48 часов.",
  },
];

export function ContentHub() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = articles.filter((a) => {
    if (activeCategory !== "all" && a.category !== activeCategory) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredArticles = filtered.filter((a) => a.featured);
  const regularArticles = filtered.filter((a) => !a.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2" style={{ fontWeight: 700 }}>
          <BookOpen className="w-8 h-8 inline mr-2 text-primary" />
          Контентный хаб
        </h1>
        <p className="text-muted-foreground">
          Гайды, статьи и подсказки для принятия решений
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по статьям..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeCategory === cat.id
                ? "bg-[#212121] text-white"
                : "bg-white border border-border text-[#212121] hover:bg-[#F1F0EF]"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Featured articles */}
          {featuredArticles.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {featuredArticles.map((a) => (
                <div
                  key={a.id}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  <ImageWithFallback
                    src={a.img}
                    alt={a.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#FA5108]/10 text-[#FA5108] text-xs rounded">{a.tags[0]}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {a.readTime}
                      </span>
                    </div>
                    <h3 className="mb-2" style={{ fontWeight: 600 }}>{a.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular articles */}
          <div className="space-y-4">
            {regularArticles.map((a) => (
              <div
                key={a.id}
                className="flex gap-4 bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <ImageWithFallback
                  src={a.img}
                  alt={a.title}
                  className="w-24 h-24 sm:w-32 sm:h-24 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {a.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">{t}</span>
                    ))}
                  </div>
                  <h3 className="mb-1 group-hover:text-primary transition-colors" style={{ fontWeight: 600 }}>{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 hidden sm:block">{a.excerpt}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" /> {a.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Tips & hints (4.5) */}
            {tips.map((tip) => (
              <div key={tip.title} className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <tip.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span style={{ fontWeight: 600 }}>{tip.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tip.text}</p>
                {tip.link && (
                  <Link
                    to={tip.link}
                    className="text-sm text-[#FA5108] flex items-center gap-1 mt-2 hover:underline"
                    style={{ fontWeight: 500 }}
                  >
                    Перейти <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}

            {/* Popular */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h4 className="mb-3" style={{ fontWeight: 600 }}>Популярное</h4>
              <div className="space-y-3">
                {articles.slice(0, 3).map((a, i) => (
                  <div key={a.id} className="flex items-start gap-3 cursor-pointer group">
                    <span className="text-2xl text-muted-foreground/30" style={{ fontWeight: 700 }}>{i + 1}</span>
                    <div>
                      <div className="text-sm group-hover:text-primary transition-colors" style={{ fontWeight: 500 }}>{a.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {a.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}