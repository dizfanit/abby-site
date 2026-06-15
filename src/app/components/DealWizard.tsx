import { useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle2,
  Circle,
  Home,
  FileText,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  Landmark,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Объект", icon: Home, desc: "Подтверждение выбора" },
  { id: 2, title: "Документы", icon: FileText, desc: "Загрузка документов" },
  { id: 3, title: "Ипотека", icon: Landmark, desc: "Заявка в банк" },
  { id: 4, title: "Сделка", icon: ShieldCheck, desc: "Безопасная сделка" },
  { id: 5, title: "Регистрация", icon: ClipboardCheck, desc: "Росреестр" },
];

export function DealWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () => {
    setCurrentStep(Math.min(currentStep + 1, 5));
    toast.success(`Шаг ${currentStep} завершён`);
  };
  const goPrev = () => setCurrentStep(Math.max(currentStep - 1, 1));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2" style={{ fontWeight: 700 }}>Визард сделки</h1>
        <p className="text-muted-foreground">
          Проведите сделку от выбора до регистрации в одном окне
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  step.id < currentStep
                    ? "bg-green-500 text-white"
                    : step.id === currentStep
                    ? "bg-[#FA5108] text-white"
                    : "bg-[#F1F0EF] text-[#737373]"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs ${step.id === currentStep ? "text-[#FA5108]" : "text-[#737373]"}`}
                  style={{ fontWeight: step.id === currentStep ? 600 : 400 }}>
                  {step.title}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                step.id < currentStep ? "bg-green-500" : "bg-border"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-border p-8 mb-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl mb-4" style={{ fontWeight: 600 }}>Подтверждение объекта</h2>
            <div className="bg-muted rounded-lg p-6 mb-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Объект</div>
                  <div style={{ fontWeight: 600 }}>ЖК «Ривьера Парк», кв. 127</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Цена</div>
                  <div style={{ fontWeight: 600 }}>8 900 000 ₽</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Площадь</div>
                  <div style={{ fontWeight: 600 }}>60 м², 2-комн.</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Застройщик</div>
                  <div style={{ fontWeight: 600 }}>СтройИнвест</div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                Бронирование зафиксировано. Цена и условия действуют 48 часов.
                Подтвердите выбор и переходите к следующему шагу.
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl mb-4" style={{ fontWeight: 600 }}>Загрузка документов</h2>
            <p className="text-muted-foreground mb-6">Загрузите необходимые документы для проведения сделки</p>
            <div className="space-y-4">
              {[
                { name: "Паспорт (основной разворот)", status: "uploaded" },
                { name: "Паспорт (регистрация)", status: "uploaded" },
                { name: "СНИЛС", status: "pending" },
                { name: "Справка о доходах (2-НДФЛ)", status: "pending" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className={`w-5 h-5 ${doc.status === "uploaded" ? "text-green-500" : "text-muted-foreground"}`} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{doc.name}</div>
                      <div className={`text-xs ${doc.status === "uploaded" ? "text-green-600" : "text-orange-500"}`}>
                        {doc.status === "uploaded" ? "Загружен" : "Ожидает загрузки"}
                      </div>
                    </div>
                  </div>
                  {doc.status === "pending" && (
                    <button
                      onClick={() => toast.success("Документ загружен")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#FA5108]/10 text-[#FA5108] text-sm rounded-lg hover:bg-[#FA5108]/20"
                    >
                      <Upload className="w-4 h-4" /> Загрузить
                    </button>
                  )}
                  {doc.status === "uploaded" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl mb-4" style={{ fontWeight: 600 }}>Ипотечный калькулятор</h2>
            <p className="text-muted-foreground mb-6">Подайте заявку в несколько банков одновременно</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Первоначальный взнос</label>
                <input type="text" value="2 000 000 ₽" className="w-full px-4 py-3 bg-muted rounded-lg" readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Срок (лет)</label>
                <input type="text" value="20" className="w-full px-4 py-3 bg-muted rounded-lg" readOnly />
              </div>
            </div>
            <div className="space-y-3">
              {[
                { bank: "Сбербанк", rate: "11.9%", payment: "67 400 ₽/мес", approved: true },
                { bank: "ВТБ", rate: "12.1%", payment: "68 200 ₽/мес", approved: true },
                { bank: "Альфа-Банк", rate: "12.5%", payment: "70 100 ₽/мес", approved: false },
              ].map((b) => (
                <div key={b.bank} className={`flex items-center justify-between p-4 rounded-lg border ${
                  b.approved ? "border-green-200 bg-green-50" : "border-border"
                }`}>
                  <div className="flex items-center gap-3">
                    <Landmark className={`w-5 h-5 ${b.approved ? "text-green-600" : "text-muted-foreground"}`} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{b.bank}</div>
                      <div className="text-sm text-muted-foreground">Ставка: {b.rate}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontWeight: 600 }}>{b.payment}</div>
                    {b.approved ? (
                      <span className="text-xs text-green-600">Одобрено</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">На рассмотрении</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-xl mb-4" style={{ fontWeight: 600 }}>Безопасная сделка</h2>
            <p className="text-muted-foreground mb-6">Средства будут переведены через эскроу-счёт</p>
            <div className="space-y-4">
              {[
                { step: "Подписание ДДУ / ДКП", status: "done" },
                { step: "Открытие эскроу-счёта", status: "done" },
                { step: "Перечисление средств на эскроу", status: "current" },
                { step: "Подача на регистрацию", status: "pending" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3 p-4 rounded-lg border border-border">
                  {s.status === "done" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {s.status === "current" && <Circle className="w-5 h-5 text-primary animate-pulse" />}
                  {s.status === "pending" && <Circle className="w-5 h-5 text-muted-foreground" />}
                  <span className={s.status === "pending" ? "text-muted-foreground" : ""} style={{ fontWeight: s.status === "current" ? 600 : 400 }}>
                    {s.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontWeight: 700 }}>Регистрация завершена!</h2>
            <p className="text-muted-foreground mb-6">
              Право собственности зарегистрировано в Росреестре.
              Поздравляем с покупкой квартиры!
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 max-w-md mx-auto">
              <h3 className="mb-2" style={{ fontWeight: 600 }}>Что дальше?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                У вас квартира без отделки. 12 проверенных подрядчиков уже делали ремонт в вашем ЖК.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Найти подрядчика <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={goPrev}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>
        {currentStep < 5 && (
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#FA5108] text-white rounded-lg hover:bg-[#e04a07] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Далее <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}