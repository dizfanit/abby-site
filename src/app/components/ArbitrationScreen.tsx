import { useState } from "react";
import {
  AlertTriangle,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  Camera,
  Send,
  ShieldCheck,
  Scale,
  ArrowRight,
  User,
} from "lucide-react";
import { toast } from "sonner";

const disputes = [
  {
    id: "1",
    title: "Качество штукатурки — отклонение от нормы",
    project: "Ремонт квартиры, ЖК «Ривьера Парк»",
    contractor: "СтройМастер Про",
    stage: "Штукатурка стен",
    amount: "78 000 ₽",
    status: "in_review" as const,
    date: "18 марта 2026",
    messages: 5,
  },
  {
    id: "2",
    title: "Задержка по срокам — 4 дня",
    project: "Ремонт ванной, ул. Садовая",
    contractor: "АкваСервис",
    stage: "Укладка плитки",
    amount: "18 000 ₽",
    status: "resolved" as const,
    date: "5 февраля 2026",
    messages: 12,
  },
];

const chatMessages = [
  { from: "customer", text: "Штукатурка отклоняется от вертикали на 5 мм, что превышает допустимую норму. Прикладываю фото с уровнем.", time: "18 марта, 10:15", hasPhoto: true },
  { from: "contractor", text: "Здравствуйте. Готовы приехать и произвести замер. В каком помещении обнаружено отклонение?", time: "18 марта, 11:30", hasPhoto: false },
  { from: "customer", text: "В большой комнате, стена напротив окна. Отклонение по всей длине стены (4.2 м).", time: "18 марта, 12:00", hasPhoto: false },
  { from: "arbiter", text: "Назначен независимый эксперт. Выезд на объект запланирован на 20 марта. Обоим сторонам необходимо обеспечить доступ.", time: "18 марта, 14:00", hasPhoto: false },
];

export function ArbitrationScreen() {
  const [selectedDispute, setSelectedDispute] = useState("1");
  const [newMessage, setNewMessage] = useState("");

  const active = disputes.find((d) => d.id === selectedDispute);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2" style={{ fontWeight: 700 }}>
          <Scale className="w-8 h-8 inline mr-2 text-primary" />
          Арбитраж
        </h1>
        <p className="text-muted-foreground">
          Разрешение споров без суда — быстро, прозрачно, справедливо
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Disputes list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 style={{ fontWeight: 600 }}>Мои споры</h3>
            </div>
            <div className="divide-y divide-border">
              {disputes.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDispute(d.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedDispute === d.id ? "bg-primary/5" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      d.status === "in_review" ? "bg-orange-100" : "bg-green-100"
                    }`}>
                      {d.status === "in_review" ? (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm truncate" style={{ fontWeight: 600 }}>{d.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{d.contractor}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          d.status === "in_review"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {d.status === "in_review" ? "На рассмотрении" : "Решён"}
                        </span>
                        <span className="text-xs text-muted-foreground">{d.amount}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => toast("Форма нового спора", { description: "Выберите проект и этап для оспаривания" })}
                className="w-full py-2.5 border border-border rounded-lg text-sm text-[#212121] hover:bg-[#F1F0EF] transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> Открыть новый спор
              </button>
            </div>
          </div>
        </div>

        {/* Chat & Details */}
        <div className="lg:col-span-2">
          {active && (
            <div className="space-y-4">
              {/* Dispute info */}
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 style={{ fontWeight: 600 }}>{active.title}</h2>
                    <div className="text-sm text-muted-foreground mt-1">{active.project}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${
                    active.status === "in_review"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`} style={{ fontWeight: 500 }}>
                    {active.status === "in_review" ? "На рассмотрении" : "Решён"}
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Подрядчик:</span>
                    <div style={{ fontWeight: 500 }}>{active.contractor}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Этап:</span>
                    <div style={{ fontWeight: 500 }}>{active.stage}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Сумма спора:</span>
                    <div style={{ fontWeight: 500 }}>{active.amount}</div>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 style={{ fontWeight: 600 }}>Переписка</h3>
                  <span className="text-sm text-muted-foreground">{chatMessages.length} сообщений</span>
                </div>

                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.from === "customer" ? "" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                        msg.from === "customer"
                          ? "bg-primary/10 text-primary"
                          : msg.from === "contractor"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-purple-100 text-purple-600"
                      }`} style={{ fontWeight: 600 }}>
                        {msg.from === "customer" ? "ВЫ" : msg.from === "contractor" ? "ПД" : "АБ"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm" style={{ fontWeight: 600 }}>
                            {msg.from === "customer" ? "Вы" : msg.from === "contractor" ? "Подрядчик" : "Арбитр ABBY"}
                          </span>
                          {msg.from === "arbiter" && <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />}
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <div className="bg-muted rounded-lg p-3 text-sm">
                          {msg.text}
                          {msg.hasPhoto && (
                            <div className="flex items-center gap-1 text-primary text-xs mt-2">
                              <Camera className="w-3 h-3" /> 3 фото прикреплено
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Напишите сообщение..."
                      className="flex-1 px-4 py-2.5 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {active.status === "in_review" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => toast.success("Решение принято. Средства будут распределены согласно результату.")}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    style={{ fontWeight: 600 }}>
                    Принять решение
                  </button>
                  <button
                    onClick={() => toast.info("Запрос на экспертизу отправлен. Эксперт будет назначен в течение 48 часов.")}
                    className="flex-1 py-3 border border-border rounded-lg hover:bg-[#F1F0EF] transition-colors"
                    style={{ fontWeight: 500 }}>
                    Запросить экспертизу
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}