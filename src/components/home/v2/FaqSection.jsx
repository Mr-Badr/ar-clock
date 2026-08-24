// home/v2/FaqSection.jsx
// Server Component — answers written from the real objections surfaced in Phase 3 research
// (ad-cluttered competitor tools, doubt about hijri-year accuracy for zakat) plus the real,
// verifiable facts about this product (free, no account, Gulf-wide coverage). Not invented FAQs.
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ScrollReveal from '@/components/motion/ScrollReveal.client';
import './faq-section.css';

// Exported so app/page.jsx can build a matching FAQPage JSON-LD entity from the same source of
// truth — never hand-duplicate this list into the schema.
export const FAQ_ITEMS = [
  {
    q: 'هل ميقاتنا مجاني بالكامل؟',
    a: 'نعم. كل أداة وحاسبة ومناسبة على الموقع مجانية بدون أي رسوم أو نسخة "مدفوعة" مخفية خلف ميزات أساسية.',
  },
  {
    q: 'هل أحتاج إنشاء حساب أو تسجيل دخول؟',
    a: 'لا. تفتح أي أداة وتستخدمها مباشرة. لا حساب، ولا بريد إلكتروني، ولا خطوة تسجيل بينك وبين الرقم الذي تبحث عنه.',
  },
  {
    q: 'الموقع فيه إعلانات مثل باقي مواقع الحاسبات؟',
    a: 'يوجد إعلانات محدودة تموّل الموقع، لكنها لا تتوسط نتيجتك ولا تحجب الحاسبة أو الجواب — لا نوافذ منبثقة، ولا واجهة "مليانة اعلانات" تُشتتك عن رقمك.',
  },
  {
    q: 'كيف أثق بدقة حاسبة الزكاة عندكم؟',
    a: 'حاسبة الزكاة تحسب الحول بالتقويم الهجري كما تقتضيه الفتوى، وتغطي زكاة المال والذهب والأسهم على المذاهب الأربعة — لا بتاريخ ميلادي تقريبي مثل أدوات كثيرة أخرى.',
  },
  {
    q: 'هل تغطون كل دول الخليج والعالم العربي؟',
    a: 'نعم. الرواتب ومكافأة نهاية الخدمة محسوبة لكل دولة خليجية على حدة (مع استثناءات عطلة نهاية الأسبوع الخاصة بكل دولة)، ومواعيد المناسبات تغطي أكثر من دولة عربية.',
  },
  {
    q: 'من أين تأتي بيانات الرواتب ومواعيد المناسبات؟',
    a: 'من مصادر رسمية معلنة لكل دولة وقاعدة قانونية موثقة، مع مراجعة دورية عند تغيّر أي نظام أو قرار.',
  },
];

export default function FaqSection() {
  return (
    <section className="faq-v2" aria-labelledby="faq-v2-title">
      <ScrollReveal className="faq-v2-inner" itemSelector=":scope > *">
        <div className="faq-v2-head">
          <p className="faq-v2-eyebrow">أسئلة مباشرة</p>
          <h2 id="faq-v2-title" className="faq-v2-title">
            الأسئلة التي نسمعها فعلًا
          </h2>
        </div>

        <Accordion type="single" collapsible className="faq-v2-accordion">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`} className="faq-v2-item">
              <AccordionTrigger className="faq-v2-trigger">{item.q}</AccordionTrigger>
              <AccordionContent className="faq-v2-content">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </section>
  );
}
