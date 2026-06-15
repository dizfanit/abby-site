import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Camera,
  DollarSign,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const stages = [
  {
    id: 1,
    name: "Демонтаж",
    status: "done" as const,
    duration: "3 дня",
    dates: "1–3 марта",
    cost: 21000,
    paid: true,
    photos: 8,
    description: "Демонтаж старых покрытий, вынос мусора",
  },
  {
    id: 2,
    name: "Электрика",
    status: "done" as const,
    duration: "5 дней",
    dates: "4–8 марта",
    cost: 30000,
    paid: true,
    photos: 12,
    description: "Штробление, прокладка кабелей, установка подрозетников",
  },
  {
    id: 3,
    name: "Сантехника",
    status: "done" as const,
    duration: "4 дня",
    dates: "9–12 марта",
    cost: 12500,
    paid: true,
    photos: 6,
    description: "Разводка труб, подключение полотенцесушителя",
  },
  {
    id: 4,
    name: "Штукатурка стен",
    status: "current" as const,
    duration: "7 дней",
    dates: "13–19 марта",
    cost: 78000,
    paid: false,
    photos: 4,
    description: "Выравнивание стен по маякам, 120 м²",
  },
  {
    id: 5,
    name: "Стяжка пола",
    status: "upcoming" as const,
    duration: "5 дней",
    dates: "20–24 марта",
    cost: 45000,
    paid: false,
    photos: 0,
    description: "Полусухая стяжка, 60 м²",
  },
  {
    id: 6,
    name: "Укладка плитки",
    status: "upcoming" as const,
    duration: "6 дней",
    dates: "25–30 марта",
    cost: 18000,
    paid: false,
    photos: 0,
    description: "Плитка в ванной и на кухонном фартуке, 15 м²",
  },
  {
    id: 7,
    name: "Чистовая отделка",
    status: "upcoming" as const,
    duration: "10 дней",
    dates: "1–10 апреля",
    cost: 90000,
    paid: false,
    photos: 0,
    description: "Покраска, ламинат, плинтуса, двери",
  },
];

export function ProjectTimeline() {
  const [selectedStage, setSelectedStage] = useState<number | null>(4);

  const totalCost = stages.reduce((s, st) => s + st.cost, 0);
  const paidCost = stages.filter((s) => s.paid).reduce((s, st) => s + st.cost, 0);
  const progress = Math.round(
    (stages.filter((s) => s.status === "done").length / stages.length) * 100
  );

  const selected = stages.find((s) => s.id === selectedStage);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2" style={{ fontWeight: 700 }}>Таймлайн проекта</h1>
        <p className="text-muted-foreground">
          Отслеживайте этапы ремонта и статусы оплаты
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground">Прогресс</div>
          <div className="text-2xl text-primary" style={{ fontWeight: 700 }}>{progress}%</div>
          <div className="h-2 bg-muted rounded-full mt-2">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground">Бюджет</div>
          <div className="text-2xl" style={{ fontWeight: 700 }}>{totalCost.toLocaleString("ru")} ₽</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground">Оплачено</div>
          <div className="text-2xl text-green-600" style={{ fontWeight: 700 }}>{paidCost.toLocaleString("ru")} ₽</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground">Срок сдачи</div>
          <div className="text-2xl" style={{ fontWeight: 700 }}>10 апр.</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="mb-6" style={{ fontWeight: 600 }}>Этапы работ</h2>
            <div className="space-y-0">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      stage.status === "done"
                        ? "bg-green-500 text-white"
                        : stage.status === "current"
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {stage.status === "done" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : stage.status === "current" ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    {i < stages.length - 1 && (
                      <div className={`w-0.5 h-full min-h-[40px] ${
                        stage.status === "done" ? "bg-green-500" : "bg-border"
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pb-6 cursor-pointer`}
                    onClick={() => setSelectedStage(stage.id)}
                  >
                    <div className={`p-4 rounded-lg transition-all ${
                      selectedStage === stage.id
                        ? "bg-primary/5 border border-primary/20"
                        : "hover:bg-muted"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 600 }}>{stage.name}</span>
                            {stage.status === "current" && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">В работе</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {stage.dates} · {stage.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div style={{ fontWeight: 600 }}>{stage.cost.toLocaleString("ru")} ₽</div>
                          {stage.paid ? (
                            <span className="text-xs text-green-600 flex items-center gap-1 justify-end">
                              <CheckCircle2 className="w-3 h-3" /> Оплачено
                            </span>
                          ) : stage.status === "current" ? (
                            <span className="text-xs text-orange-500">Ожидает приёмки</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Не оплачено</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage detail */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {selected && (
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <h3 className="mb-1" style={{ fontWeight: 600 }}>{selected.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Сроки
                    </span>
                    <span style={{ fontWeight: 500 }}>{selected.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Длительность
                    </span>
                    <span style={{ fontWeight: 500 }}>{selected.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> Стоимость
                    </span>
                    <span style={{ fontWeight: 500 }}>{selected.cost.toLocaleString("ru")} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Camera className="w-4 h-4" /> Фотоотчёт
                    </span>
                    <span style={{ fontWeight: 500 }}>{selected.photos} фото</span>
                  </div>
                </div>

                {selected.status === "current" && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => toast.success("Этап принят! Средства будут переведены подрядчику.")}
                      className="w-full py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      style={{ fontWeight: 600 }}>
                      <CheckCircle2 className="w-4 h-4 inline mr-2" /> Принять этап
                    </button>
                    <button
                      onClick={() => toast.error("Спор открыт. Арбитр будет назначен в течение 24 часов.")}
                      className="w-full py-2.5 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm">
                      <AlertTriangle className="w-4 h-4 inline mr-2" /> Открыть спор
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span style={{ fontWeight: 600 }}>Безопасная сделка</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Средства на эскроу-счёте. Подрядчик получит оплату только после вашей приёмки этапа.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}