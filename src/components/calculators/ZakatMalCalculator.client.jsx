"use client";

import { useEffect, useMemo, useState } from 'react';
import { Bank, Coins, HandCoins, Info, MoonStars, Package, Sparkle, Trash, TrendUp } from '@phosphor-icons/react';

import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import ZakatCountryPicker from './ZakatCountryPicker.client';
import { getCurrencyByCode } from '@/lib/shared/arab-currencies';
import { GOLD_PURITIES } from '@/lib/islamic/zakat-live-prices';
import { GOLD_SILVER_COMBINING_NOTE, MADHABS, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, ZAKAT_RATE, getMadhabRules } from '@/lib/islamic/zakat-madhab';

const HAWL_STORAGE_KEY = 'miqatona-zakat-hawl-v2';
const HAWL_STORAGE_KEY_V1 = 'miqatona-zakat-hawl-v1';
const HIJRI_YEAR_DAYS = 354.37; // real astronomical figure for a lunar (Hijri) year.

const ASSET_TYPES = [
  { id: 'cash', label: 'نقد وأرصدة بنكية', desc: 'سيولة جاهزة في حسابك أو يدك، بما فيها التوفير.', icon: Bank, color: 'green' },
  { id: 'metals', label: 'ذهب وفضة', desc: 'مدَّخر أو حلي، سبائك، أو مشغولات.', icon: Coins, color: 'amber' },
  { id: 'stocks', label: 'أسهم', desc: 'مضاربة (بيع وشراء) أو استثمار طويل الأجل.', icon: TrendUp, color: 'blue' },
  { id: 'inventory', label: 'عروض تجارة', desc: 'بضاعة أو عقار معدّ للبيع بقصد الربح.', icon: Package, color: 'red' },
  { id: 'debts', label: 'ديون', desc: 'أموال لك عند الآخرين، أو ديون عليك.', icon: HandCoins, color: 'blue' },
];

function num(v) {
  return Math.max(0, Number(v) || 0);
}

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + Math.round(days));
  return d;
}

function formatDate(d) {
  if (!d) return '—';
  return d.toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
}

const INITIAL_VALUES = {
  cash: '', goldInvestmentGrams: '', goldPersonalGrams: '', goldKarat: 21,
  silverInvestmentGrams: '', silverPersonalGrams: '',
  goldPriceOverride: '', silverPriceOverride: '',
  tradingStockValue: '', investmentDividends: '', businessInventoryValue: '',
  receivableDebt: '', payableDebt: '',
};

export default function ZakatMalCalculator({ livePrices }) {
  const [countryCode, setCountryCode] = useState('sa');
  const [madhabId, setMadhabId] = useState('cautious');
  const [selectedAssets, setSelectedAssets] = useState(() => new Set(['cash']));
  const [values, setValues] = useState(INITIAL_VALUES);
  const [receivableCollectible, setReceivableCollectible] = useState(true);
  const [nisabBasis, setNisabBasis] = useState(null); // null = inherit the madhab's default

  const [hawlStartDate, setHawlStartDate] = useState('');
  const [savedHawl, setSavedHawl] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HAWL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.startDate) { setSavedHawl(parsed); return; }
      }
      // Migrate a v1 record (no madhabId/countryCode) so a returning user doesn't lose their date.
      const rawV1 = window.localStorage.getItem(HAWL_STORAGE_KEY_V1);
      if (rawV1) {
        const parsedV1 = JSON.parse(rawV1);
        if (parsedV1?.startDate) {
          const migrated = { startDate: parsedV1.startDate, savedAt: parsedV1.savedAt, madhabId: 'cautious', countryCode: 'sa' };
          setSavedHawl(migrated);
          window.localStorage.setItem(HAWL_STORAGE_KEY, JSON.stringify(migrated));
        }
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — silently fall back to no saved state.
    }
  }, []);

  function saveHawl() {
    if (!hawlStartDate) return;
    const record = { startDate: hawlStartDate, savedAt: new Date().toISOString(), madhabId, countryCode };
    try {
      window.localStorage.setItem(HAWL_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // ignore write failures — the in-memory state below still works for this session.
    }
    setSavedHawl(record);
  }

  function clearHawl() {
    try {
      window.localStorage.removeItem(HAWL_STORAGE_KEY);
      window.localStorage.removeItem(HAWL_STORAGE_KEY_V1);
    } catch {
      // ignore
    }
    setSavedHawl(null);
    setHawlStartDate('');
  }

  function toggleAsset(id) {
    setSelectedAssets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function setValue(key, val) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  const madhab = getMadhabRules(madhabId);
  const currency = getCurrencyByCode(countryCode);
  const countryLive = livePrices?.byCountry?.[countryCode] ?? null;
  const isUnpriced = livePrices?.unpriced?.includes(countryCode) ?? false;

  const livePrice24k = countryLive?.goldPerGramByKarat?.[24] ?? null;
  const livePriceUserKarat = countryLive?.goldPerGramByKarat?.[values.goldKarat] ?? null;
  const liveSilverPrice = countryLive?.silverPerGram ?? null;

  const effectiveGoldPrice24k = values.goldPriceOverride !== '' ? num(values.goldPriceOverride) : livePrice24k;
  const effectiveGoldPriceUserKarat = values.goldPriceOverride !== ''
    ? num(values.goldPriceOverride) * (GOLD_PURITIES.find((p) => p.karat === values.goldKarat)?.fraction ?? 1)
    : livePriceUserKarat;
  const effectiveSilverPrice = values.silverPriceOverride !== '' ? num(values.silverPriceOverride) : liveSilverPrice;

  const resolvedNisabBasis = nisabBasis ?? madhab.rules.defaultNisabBasis;

  const result = useMemo(() => {
    const cash = num(values.cash);
    const goldInv = num(values.goldInvestmentGrams);
    const goldPersonal = num(values.goldPersonalGrams);
    const silverInv = num(values.silverInvestmentGrams);
    const silverPersonal = num(values.silverPersonalGrams);
    const trading = num(values.tradingStockValue);
    const dividends = num(values.investmentDividends);
    const inventory = num(values.businessInventoryValue);
    const receivable = num(values.receivableDebt);
    const payable = num(values.payableDebt);

    const zakatableGoldGrams = goldInv + (madhab.rules.jewelryZakatable ? goldPersonal : 0);
    const zakatableSilverGrams = silverInv + (madhab.rules.jewelryZakatable ? silverPersonal : 0);
    const goldValue = zakatableGoldGrams * (effectiveGoldPriceUserKarat || 0);
    const silverValue = zakatableSilverGrams * (effectiveSilverPrice || 0);
    const receivableIncluded = receivableCollectible ? receivable : 0;
    const stocksValue = trading + dividends;

    const monetary = cash + stocksValue + inventory + receivableIncluded;
    const totalAssets = goldValue + silverValue + monetary;
    const totalZakatable = Math.max(0, totalAssets - payable);

    const nisabValue = resolvedNisabBasis === 'gold'
      ? NISAB_GOLD_GRAMS * (effectiveGoldPrice24k || 0)
      : NISAB_SILVER_GRAMS * (effectiveSilverPrice || 0);

    const hasPriceData = resolvedNisabBasis === 'gold' ? Boolean(effectiveGoldPrice24k) : Boolean(effectiveSilverPrice);
    const meetsNisab = hasPriceData && totalZakatable >= nisabValue && totalZakatable > 0;
    const zakatDue = meetsNisab ? totalZakatable * ZAKAT_RATE : 0;

    const breakdown = [
      { id: 'gold', label: 'الذهب', value: goldValue, color: 'var(--amber-text)' },
      { id: 'silver', label: 'الفضة', value: silverValue, color: 'var(--text-secondary)' },
      { id: 'cash', label: 'النقد', value: cash, color: 'var(--green-text)' },
      { id: 'stocks', label: 'الأسهم', value: stocksValue, color: 'var(--blue-text)' },
      { id: 'inventory', label: 'عروض التجارة', value: inventory, color: 'var(--red-text)' },
      { id: 'receivable', label: 'ديون مستحقة لك', value: receivableIncluded, color: 'var(--green-text)' },
    ].filter((b) => b.value > 0);
    const breakdownTotal = breakdown.reduce((s, b) => s + b.value, 0) || 1;

    // "Madhab impact" — recompute against the opposite jewelry rule (the only branch that actually
    // varies today, per FIQH-SOURCES.md §2) to show what would change with a different school.
    const jewelryValue = (goldPersonal * (effectiveGoldPriceUserKarat || 0)) + (silverPersonal * (effectiveSilverPrice || 0));
    const altZakatDue = (() => {
      if (jewelryValue <= 0) return null;
      const altGoldGrams = goldInv + (madhab.rules.jewelryZakatable ? 0 : goldPersonal);
      const altSilverGrams = silverInv + (madhab.rules.jewelryZakatable ? 0 : silverPersonal);
      const altTotal = Math.max(0, (altGoldGrams * (effectiveGoldPriceUserKarat || 0)) + (altSilverGrams * (effectiveSilverPrice || 0)) + monetary - payable);
      const altMeets = hasPriceData && altTotal >= nisabValue && altTotal > 0;
      return altMeets ? altTotal * ZAKAT_RATE : 0;
    })();

    return {
      totalZakatable, nisabValue, meetsNisab, zakatDue, hasPriceData, breakdown, breakdownTotal,
      goldValue, silverValue, monetary, payable, altZakatDue,
    };
  }, [values, receivableCollectible, effectiveGoldPriceUserKarat, effectiveSilverPrice, effectiveGoldPrice24k, resolvedNisabBasis, madhab]);

  const hawlNextDue = savedHawl ? addDays(savedHawl.startDate, HIJRI_YEAR_DAYS) : null;
  const hawlDaysRemaining = hawlNextDue ? Math.ceil((hawlNextDue.getTime() - Date.now()) / 86400000) : null;
  const hawlDaysElapsed = savedHawl ? Math.max(0, Math.round(HIJRI_YEAR_DAYS) - Math.max(0, hawlDaysRemaining ?? 0)) : 0;
  const hawlPercentElapsed = savedHawl ? Math.min(100, Math.round((hawlDaysElapsed / HIJRI_YEAR_DAYS) * 100)) : 0;

  const nisabPercent = result.hasPriceData && result.nisabValue > 0
    ? Math.min(100, Math.round((result.totalZakatable / result.nisabValue) * 100))
    : 0;
  const ringColor = result.meetsNisab ? 'var(--green)' : nisabPercent >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="guide-v2-checker" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Coins size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">حاسبة زكاة المال الشاملة</p>
          <p className="guide-v2-checker-sub">اختر مذهبك وأموالك — تظهر لك الحقول المناسبة فقط</p>
        </div>
      </div>

      <ZakatCountryPicker countryCode={countryCode} onChange={setCountryCode} />

      {isUnpriced ? (
        <p className="tool-v2-note-strip">
          <Info size={15} weight="fill" aria-hidden="true" />
          تعذّر جلب سعر السوق اللحظي لعملة {currency.country} بثقة كافية — تختلف بعض الأسعار المتداولة محلياً عن السعر الرسمي في هذه الدولة، أدخل سعر جرام الذهب والفضة يدوياً بحسب المصدر الذي تثق به.
        </p>
      ) : livePrices ? (
        <p className="guide-v2-checker-result-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkle size={14} weight="fill" aria-hidden="true" />
          أسعار الذهب والفضة محدّثة تلقائياً من السوق العالمية بعملة {currency.country} — يمكنك تعديلها يدوياً أدناه إن أردت سعراً مختلفاً.
        </p>
      ) : (
        <p className="guide-v2-checker-result-note">
          تعذّر جلب سعر السوق اللحظي حالياً — أدخل سعر جرام الذهب والفضة يدوياً في الحقول أدناه.
        </p>
      )}

      {/* اختيار المذهب */}
      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>ما مذهبك؟</p>
        <div className="tool-v2-choice-list">
          {MADHABS.map((m) => (
            <label key={m.id} className={`tool-v2-choice-card${madhabId === m.id ? ' is-active' : ''}`}>
              <input type="radio" name="zakat-madhab" value={m.id} checked={madhabId === m.id} onChange={() => setMadhabId(m.id)} />
              <span className={`tool-v2-choice-icon tool-v2-choice-icon--${m.color}`} aria-hidden="true">
                <MoonStars size={16} weight="bold" />
              </span>
              <span className="tool-v2-choice-body">
                <span className="tool-v2-choice-title">
                  {m.name}
                  {m.recommended ? <span className="tool-v2-choice-badge">الافتراضي</span> : null}
                </span>
                <span className="tool-v2-choice-desc">{m.whereCommon}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* اختيار الأموال */}
      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>ما الأموال التي تملكها؟</p>
        <div className="tool-v2-choice-list">
          {ASSET_TYPES.map((a) => {
            const Icon = a.icon;
            const active = selectedAssets.has(a.id);
            return (
              <label key={a.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`}>
                <input type="checkbox" checked={active} onChange={() => toggleAsset(a.id)} />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${a.color}`} aria-hidden="true">
                  <Icon size={16} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{a.label}</span>
                  <span className="tool-v2-choice-desc">{a.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* النقد */}
      {selectedAssets.has('cash') ? (
        <div className="tool-v2-field">
          <label htmlFor="zakat-cash">النقد وأرصدة البنوك ({currency.short})</label>
          <input id="zakat-cash" type="number" inputMode="decimal" min="0" value={values.cash} onChange={(e) => setValue('cash', e.target.value)} placeholder="0" />
        </div>
      ) : null}

      {/* الذهب والفضة */}
      {selectedAssets.has('metals') ? (
        <div>
          <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>الذهب والفضة</p>
          <div className="tool-v2-field-row-pair">
            <div className="tool-v2-field">
              <label htmlFor="zakat-gold-inv">ذهب مدَّخر/سبائك (جرام)</label>
              <input id="zakat-gold-inv" type="number" inputMode="decimal" min="0" value={values.goldInvestmentGrams} onChange={(e) => setValue('goldInvestmentGrams', e.target.value)} placeholder="0" />
            </div>
            <div className="tool-v2-field">
              <label htmlFor="zakat-gold-karat">العيار</label>
              <PremiumSelect
                id="zakat-gold-karat"
                value={values.goldKarat}
                onChange={(v) => setValue('goldKarat', Number(v))}
                options={GOLD_PURITIES.map((p) => ({ value: p.karat, label: p.label }))}
              />
            </div>
          </div>
          <div className="tool-v2-field">
            <label htmlFor="zakat-gold-personal">
              ذهب حلي (زينة شخصية) (جرام)
              <FieldHint text="بعض المذاهب تُزكّي الحلي المُعَدّ للاستعمال الشخصي وبعضها لا — راجع اختيار مذهبك أعلاه." />
            </label>
            <input id="zakat-gold-personal" type="number" inputMode="decimal" min="0" value={values.goldPersonalGrams} onChange={(e) => setValue('goldPersonalGrams', e.target.value)} placeholder="0" />
            {values.goldPersonalGrams && num(values.goldPersonalGrams) > 0 ? (
              <p className="guide-v2-checker-result-note" style={{ marginTop: 4 }}>
                على {madhab.name}: {madhab.rules.jewelryZakatable ? 'تُحتسب ضمن زكاتك.' : 'لا تُحتسب ضمن زكاتك.'}
              </p>
            ) : null}
          </div>
          <div className="tool-v2-field">
            <label htmlFor="zakat-gold-price">
              سعر جرام الذهب عيار 24 اليوم ({currency.short})
              <FieldHint text="يُستخدم هذا السعر لتقييم ذهبك (مضروباً بنسبة العيار) ولحساب قيمة النصاب أيضاً." />
            </label>
            <input
              id="zakat-gold-price"
              type="number"
              inputMode="decimal"
              min="0"
              value={values.goldPriceOverride}
              onChange={(e) => setValue('goldPriceOverride', e.target.value)}
              placeholder={livePrice24k ? fmt(livePrice24k) : 'أدخل السعر'}
            />
          </div>

          <div className="tool-v2-field-row-pair" style={{ marginTop: 'var(--space-3)' }}>
            <div className="tool-v2-field">
              <label htmlFor="zakat-silver-inv">فضة مدَّخرة (جرام)</label>
              <input id="zakat-silver-inv" type="number" inputMode="decimal" min="0" value={values.silverInvestmentGrams} onChange={(e) => setValue('silverInvestmentGrams', e.target.value)} placeholder="0" />
            </div>
            <div className="tool-v2-field">
              <label htmlFor="zakat-silver-personal">فضة حلي (زينة)</label>
              <input id="zakat-silver-personal" type="number" inputMode="decimal" min="0" value={values.silverPersonalGrams} onChange={(e) => setValue('silverPersonalGrams', e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="tool-v2-field">
            <label htmlFor="zakat-silver-price">سعر جرام الفضة اليوم ({currency.short})</label>
            <input
              id="zakat-silver-price"
              type="number"
              inputMode="decimal"
              min="0"
              value={values.silverPriceOverride}
              onChange={(e) => setValue('silverPriceOverride', e.target.value)}
              placeholder={liveSilverPrice ? fmt(liveSilverPrice) : 'أدخل السعر'}
            />
          </div>
        </div>
      ) : null}

      {/* الأسهم */}
      {selectedAssets.has('stocks') ? (
        <div>
          <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>
            الأسهم
            <FieldHint text="أسهم المضاربة (تُشترى وتُباع بقصد الربح) تُزكّى بكامل قيمتها السوقية كعروض التجارة. أسهم الاستثمار (يُحتفظ بها للأرباح السنوية) تُزكّى أرباحها فقط، لا أصل السهم." />
          </p>
          <div className="tool-v2-field-row-pair">
            <div className="tool-v2-field">
              <label htmlFor="zakat-trading-stock">قيمة أسهم المضاربة السوقية ({currency.short})</label>
              <input id="zakat-trading-stock" type="number" inputMode="decimal" min="0" value={values.tradingStockValue} onChange={(e) => setValue('tradingStockValue', e.target.value)} placeholder="0" />
            </div>
            <div className="tool-v2-field">
              <label htmlFor="zakat-investment-dividends">أرباح أسهم الاستثمار هذا العام ({currency.short})</label>
              <input id="zakat-investment-dividends" type="number" inputMode="decimal" min="0" value={values.investmentDividends} onChange={(e) => setValue('investmentDividends', e.target.value)} placeholder="0" />
            </div>
          </div>
        </div>
      ) : null}

      {/* عروض التجارة */}
      {selectedAssets.has('inventory') ? (
        <div className="tool-v2-field">
          <label htmlFor="zakat-inventory">
            عروض التجارة (بضاعة معدّة للبيع) ({currency.short})
            <FieldHint text="القيمة السوقية للبضاعة يوم وجوب الزكاة، لا سعر الشراء الأصلي." />
          </label>
          <input id="zakat-inventory" type="number" inputMode="decimal" min="0" value={values.businessInventoryValue} onChange={(e) => setValue('businessInventoryValue', e.target.value)} placeholder="0" />
        </div>
      ) : null}

      {/* الديون */}
      {selectedAssets.has('debts') ? (
        <div>
          <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>الديون</p>
          <div className="tool-v2-field">
            <label htmlFor="zakat-receivable">أموال لك عند الآخرين ({currency.short})</label>
            <input id="zakat-receivable" type="number" inputMode="decimal" min="0" value={values.receivableDebt} onChange={(e) => setValue('receivableDebt', e.target.value)} placeholder="0" />
          </div>
          <div className="guide-v2-checker-options" role="group" aria-label="حالة المدين">
            <button
              type="button"
              className={`guide-v2-checker-chip${receivableCollectible ? ' is-active' : ''}`}
              aria-pressed={receivableCollectible}
              onClick={() => setReceivableCollectible(true)}
            >
              المدين قادر وغير مماطل
            </button>
            <button
              type="button"
              className={`guide-v2-checker-chip${!receivableCollectible ? ' is-active' : ''}`}
              aria-pressed={!receivableCollectible}
              onClick={() => setReceivableCollectible(false)}
            >
              معسر أو مماطل
            </button>
          </div>
          <p className="guide-v2-checker-result-note" style={{ marginTop: 4 }}>
            {receivableCollectible
              ? 'تُحسب ضمن أموالك الزكوية كل عام حتى لو لم تقبضها فعلياً — لأنها في حكم المقبوض.'
              : 'لا زكاة عليها حتى تقبضها فعلياً، وحينها تبدأ حولاً جديداً من تاريخ القبض.'}
          </p>

          <div className="tool-v2-field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="zakat-payable">ديون عليك (تُخصم من الإجمالي) ({currency.short})</label>
            <input id="zakat-payable" type="number" inputMode="decimal" min="0" value={values.payableDebt} onChange={(e) => setValue('payableDebt', e.target.value)} placeholder="0" />
          </div>
        </div>
      ) : null}

      {/* أساس النصاب */}
      <div>
        <p className="guide-v2-checker-result-label" style={{ marginBottom: 8 }}>
          أساس حساب النصاب
          <FieldHint text="النصاب التلقائي يتبع مذهبك المختار أعلاه — يمكنك تثبيته يدوياً على الذهب أو الفضة فقط بغض النظر عن مذهبك." />
        </p>
        <div className="guide-v2-checker-options" role="group" aria-label="أساس النصاب">
          <button type="button" className={`guide-v2-checker-chip${nisabBasis === null ? ' is-active' : ''}`} aria-pressed={nisabBasis === null} onClick={() => setNisabBasis(null)}>
            تلقائي حسب مذهبك ({resolvedNisabBasis === 'gold' ? 'الذهب' : 'الفضة'})
          </button>
          <button type="button" className={`guide-v2-checker-chip${nisabBasis === 'gold' ? ' is-active' : ''}`} aria-pressed={nisabBasis === 'gold'} onClick={() => setNisabBasis('gold')}>
            الذهب فقط (85 جرام)
          </button>
          <button type="button" className={`guide-v2-checker-chip${nisabBasis === 'silver' ? ' is-active' : ''}`} aria-pressed={nisabBasis === 'silver'} onClick={() => setNisabBasis('silver')}>
            الفضة فقط (595 جرام)
          </button>
        </div>
      </div>

      {/* النتيجة */}
      <div className="guide-v2-checker-result" aria-live="polite">
        <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <AnimatedCircularProgressBar
            className="tool-v2-progress-ring"
            value={nisabPercent}
            gaugePrimaryColor={ringColor}
            gaugeSecondaryColor="var(--bg-surface-2)"
          />
          <div style={{ textAlign: 'center' }}>
            <span className="tool-v2-result-label">مقدار الزكاة الواجبة</span>
            <div className="tool-v2-result-value" style={{ color: 'var(--green-text)', direction: 'ltr' }}>
              {fmt(result.zakatDue)} {currency.short}
            </div>
          </div>
        </div>

        {result.breakdown.length >= 2 ? (
          <div className="tool-v2-chart-card">
            <div className="tool-v2-chart-head">
              <h3>تفصيل أموالك الزكوية</h3>
              <p>نسبة كل نوع مال من إجمالي المبلغ الزكوي</p>
            </div>
            <div className="tool-v2-hbar-list">
              {result.breakdown.map((b) => (
                <div className="tool-v2-hbar-row" key={b.id}>
                  <span className="tool-v2-hbar-label">{b.label}</span>
                  <div className="tool-v2-hbar-track">
                    <div className="tool-v2-hbar-fill" style={{ width: `${(b.value / result.breakdownTotal) * 100}%`, background: b.color }} />
                  </div>
                  <span className="tool-v2-hbar-value">{fmt(b.value)} {currency.short}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">إجمالي أموالك الزكوية</span>
            <span className="tool-v2-breakdown-value">{fmt(result.totalZakatable)} {currency.short}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">قيمة النصاب</span>
            <span className="tool-v2-breakdown-value">{result.hasPriceData ? `${fmt(result.nisabValue)} ${currency.short}` : '— أدخل السعر أولاً'}</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">هل بلغ مالك النصاب؟</span>
            <span className="tool-v2-breakdown-value">{result.hasPriceData ? (result.meetsNisab ? 'نعم' : 'لا') : '—'}</span>
          </div>
        </div>

        {result.altZakatDue !== null && result.altZakatDue !== result.zakatDue ? (
          <div className="tool-v2-result-stat-row">
            <div className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.zakatDue)}</span>
              <span className="tool-v2-result-stat-label">على {madhab.name}</span>
            </div>
            <span className="tool-v2-result-stat-sep">↔</span>
            <div className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.altZakatDue)}</span>
              <span className="tool-v2-result-stat-label">لو اخترت مذهباً آخر (حلي الزينة)</span>
            </div>
          </div>
        ) : null}

        <p className="guide-v2-checker-result-note">
          هذا تقدير استرشادي بناءً على ما أدخلته وسعر الذهب/الفضة المعروض — تحقّق من دقة السعر ليوم إخراج الزكاة الفعلي، واستشر جهة إفتاء موثوقة عند الشك في حالة خاصة.
        </p>
      </div>

      {/* متتبع الحول */}
      <div className="guide-v2-checker" style={{ background: 'color-mix(in srgb, var(--green-subtle) 40%, var(--bg-surface-1))' }}>
        <div className="guide-v2-checker-head">
          <span className="guide-v2-checker-icon" aria-hidden="true"><MoonStars size={18} weight="bold" /></span>
          <div>
            <p className="guide-v2-checker-title">متتبع الحول الهجري</p>
            <p className="guide-v2-checker-sub">يُحفظ على جهازك فقط — بلا حساب أو تسجيل دخول</p>
          </div>
        </div>

        {savedHawl ? (
          <>
            <div className="tool-v2-countdown-grid tool-v2-countdown-grid--3">
              <div className="tool-v2-countdown-unit">
                <NumberTicker className="tool-v2-countdown-num" value={Math.floor((hawlDaysRemaining ?? 0) / 30)} />
                <span className="tool-v2-countdown-label">شهراً متبقياً</span>
              </div>
              <div className="tool-v2-countdown-unit">
                <NumberTicker className="tool-v2-countdown-num" value={Math.max(0, hawlDaysRemaining ?? 0)} />
                <span className="tool-v2-countdown-label">يوماً متبقياً</span>
              </div>
              <div className="tool-v2-countdown-unit">
                <NumberTicker className="tool-v2-countdown-num" value={hawlPercentElapsed} />
                <span className="tool-v2-countdown-label">% من الحول مضى</span>
              </div>
            </div>
            <div className="tool-v2-breakdown-list">
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">تاريخ بداية حولك</span>
                <span className="tool-v2-breakdown-value">{formatDate(new Date(savedHawl.startDate))}</span>
              </div>
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">موعد زكاتك القادم تقريباً</span>
                <span className="tool-v2-breakdown-value">{formatDate(hawlNextDue)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-3)' }}>
              <button type="button" className="tool-v2-action-btn" onClick={() => { clearHawl(); }}>
                <Trash size={14} weight="bold" aria-hidden="true" /> إعادة ضبط تاريخ الحول
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="tool-v2-field">
              <label htmlFor="zakat-hawl-date">متى بلغ مالك النصاب أول مرة؟</label>
              <input id="zakat-hawl-date" type="date" value={hawlStartDate} onChange={(e) => setHawlStartDate(e.target.value)} />
            </div>
            <button type="button" className="tool-v2-action-btn is-primary" onClick={saveHawl} disabled={!hawlStartDate}>
              احفظ وتابع الحول
            </button>
            <p className="guide-v2-checker-result-note" style={{ marginTop: 8 }}>
              الحول سنة هجرية كاملة (نحو 354 يوماً) — سجّل التاريخ مرة واحدة وارجع لهذه الصفحة لاحقاً لمعرفة موعد زكاتك القادم دون إعادة إدخاله.
            </p>
          </>
        )}
      </div>

      {/* ملاحظة ضم الذهب والفضة — محتوى فقط، ليست فرعاً محسوباً، راجع FIQH-SOURCES.md */}
      <p className="guide-v2-checker-result-note">
        ملاحظة: {GOLD_SILVER_COMBINING_NOTE[madhabId] ?? GOLD_SILVER_COMBINING_NOTE.hanbali}
      </p>
    </div>
  );
}
