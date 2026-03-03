import { Qibla, Coordinates } from 'adhan';
import QiblaCompass from '@/components/QiblaCompass';
import { Suspense } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Info, Map as MapIcon, Compass as CompassIcon, HelpCircle } from "lucide-react";

/**
 * app/qibla/page.jsx - World-class Qibla Finder
 * Optimized for Arabic search keywords: "تحديد القبلة", "البوصلة", "أين القبلة"
 */

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const latParam = resolvedParams.lat;
  const lonParam = resolvedParams.lon;

  const baseTitle = "تحديد اتجاه القبلة بدقة 100% - بوصلة القبلة المباشرة أون لاين";
  const coordsTitle = latParam && lonParam ? `اتجاه القبلة في إحداثيات (${latParam}, ${lonParam})` : baseTitle;
  const description = "أسهل وأدق أداة لتحديد اتجاه القبلة (مكة المكرمة) من المتصفح مباشرة. استخدم بوصلة هاتفك لتحديد القبلة في ثوانٍ بدقة متناهية.";

  return {
    title: coordsTitle,
    description: description,
    keywords: ["تحديد اتجاه القبلة", "أين القبلة", "بوصلة القبلة", "موقع مكة", "القبلة اون لاين", "Qibla Finder", "اتجاه الكعبة"],
    openGraph: {
      title: coordsTitle,
      description: description,
      type: "website",
      siteName: "مواقيت الصلاة",
      images: [
        { url: '/og-qibla.png', width: 1200, height: 630, alt: 'بوصلة القبلة الذكية' }
      ]
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/qibla`,
    }
  };
}

export default async function QiblaPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-base py-12 px-4 flex flex-col items-center overflow-x-hidden" dir="rtl">
      {/* ── Background Decor ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-accent/5 to-transparent pointer-events-none -z-10" />

      {/* ── Header Section ── */}
      <header className="max-w-2xl text-center mb-10 mt-12 px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2 border border-border shadow-sm mb-4">
          <CompassIcon className="w-4 h-4 text-accent animate-spin-slow" />
          <span className="text-xs font-bold text-primary tracking-wide">بوصلة القبلة الاحترافية</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-[1.1]">
          أين <span className="text-accent underline decoration-accent/30 underline-offset-8">القبلة</span> الآن؟
        </h1>
        <p className="text-muted text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
          بوصلة ذكية ومباشرة لتحديد اتجاه الكعبة المشرفة بدقة 100% أينما كنت في العالم.
        </p>
      </header>

      {/* ── Main App Container ── */}
      <main className="w-full max-w-5xl">
        <Tabs defaultValue="compass" className="w-full flex flex-col items-center">
          <TabsList className="mb-8 grid grid-cols-2 w-full max-w-[400px] h-14 bg-surface-2 p-1.5 rounded-2xl shadow-sm border border-border">
            <TabsTrigger value="compass" className="rounded-xl gap-2 font-bold data-[state=active]:bg-surface-1 data-[state=active]:shadow-md">
              <CompassIcon className="w-4 h-4" />
              البوصلة
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-xl gap-2 font-bold data-[state=active]:bg-surface-1 data-[state=active]:shadow-md">
              <HelpCircle className="w-4 h-4" />
              كيفية الاستخدام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compass" className="w-full">
            <Suspense fallback={<div className="h-[500px] w-full max-w-md mx-auto animate-pulse bg-surface-2 rounded-[40px]" />}>
              <DynamicQibla searchParams={searchParams} />
            </Suspense>
          </TabsContent>

          <TabsContent value="info" className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="bg-surface-2 border border-border p-8 rounded-[30px] shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                <Info className="w-6 h-6 text-accent" />
                دليل الاستخدام السريع
              </h2>
              <div className="grid gap-6">
                <Step number="1" title="مشاركة الموقع" desc="اسمح للخدمة بالوصول لموقعك الجغرافي (GPS) لنتمكن من حساب الزاوية الدقيقة." />
                <Step number="2" title="وضعية الهاتف" desc="أمسك هاتفك بشكل مسطح أمامك، تماماً كما تمسك خريطة ورقية." />
                <Step number="3" title="المعايرة" desc="إذا لاحظت عدم دقة، قم بتحريك الهاتف في الهواء على شكل رقم (8) لضبط الحساسات." />
                <Step number="4" title="توجيه السهم" desc="قم بالدوران بنفسك حتى يتوافق السهم الأخضر مع اتجاه مكة المكرمة في الأعلى." />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── SEO FAQ Section ── */}
        <section className="mt-20 max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-primary mb-4">الأسئلة الشائعة حول اتجاه القبلة</h2>
            <p className="text-muted">كل ما تريد معرفته عن كيفية حساب وتحديد اتجاه القبلة بدقة.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-border bg-surface-1 rounded-2xl px-6 py-2 overflow-hidden shadow-sm">
              <AccordionTrigger className="text-lg font-bold hover:no-underline">كيف تعمل بوصلة القبلة أون لاين؟</AccordionTrigger>
              <AccordionContent className="text-muted leading-relaxed pb-4">
                تعتمد الأداة على مستشعر المغناطيسية (Magnetometer) المدمج في هاتفك الذكي، وبإدخال إحداثيات موقعك الحالي عبر الـ GPS، نقوم بحساب "السمت" (Azimuth) من موقعك إلى إحداثيات الكعبة المشرفة بدقة متناهية.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border bg-surface-1 rounded-2xl px-6 py-2 overflow-hidden shadow-sm">
              <AccordionTrigger className="text-lg font-bold hover:no-underline">هل أحتاج إلى تحميل تطبيق لتحديد القبلة؟</AccordionTrigger>
              <AccordionContent className="text-muted leading-relaxed pb-4">
                لا، بوصلة القبلة لدينا تعمل مباشرة من المتصفح (Web-based). هذا يوفر عليك مساحة التخزين ويضمن خصوصيتك التامة، حيث يتم الحساب فورياً دون تخزين أي بيانات شخصية.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border bg-surface-1 rounded-2xl px-6 py-2 overflow-hidden shadow-sm">
              <AccordionTrigger className="text-lg font-bold hover:no-underline">لماذا قد تكون البوصلة غير دقيقة أحياناً؟</AccordionTrigger>
              <AccordionContent className="text-muted leading-relaxed pb-4">
                تتأثر البوصلة بالمجالات المغناطيسية المحيطة، مثل الأسلاك الكهربائية، المعادن، أو الأجهزة الإلكترونية الأخرى. نوصي دائماً بالابتعاد عن المعادن ومعايرة الهاتف بحركة (8) في الهواء.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border bg-surface-1 rounded-2xl px-6 py-2 overflow-hidden shadow-sm">
              <AccordionTrigger className="text-lg font-bold hover:no-underline">ما هو اتجاه القبلة الصحيح؟</AccordionTrigger>
              <AccordionContent className="text-muted leading-relaxed pb-4">
                اتجاه القبلة هو أقصر مسار دائري يربط موقعك بالكعبة المشرفة في مكة المكرمة. تختلف هذه الزاوية حسب مكان وجودك في العالم، وهي ما تقوم بوصلتنا بحسابه فوراً.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="mt-32 w-full max-w-2xl px-4 text-center border-t border-border pt-12 text-muted pb-8 italic">
        <p className="text-sm">
          نحن نستخدم صيغة "Haversine" ومكتبة Adhan الشهيرة لضمان أدق النتائج في تحديد القبلة ومواقيت الصلاة.
        </p>
      </footer>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-black flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-primary mb-1">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

async function DynamicQibla({ searchParams }) {
  const resolvedParams = await searchParams;
  const lat = parseFloat(resolvedParams.lat);
  const lon = parseFloat(resolvedParams.lon);

  let qiblaAngle = null;
  if (!isNaN(lat) && !isNaN(lon)) {
    try {
      const coordinates = new Coordinates(lat, lon);
      qiblaAngle = Qibla(coordinates);
    } catch (e) {
      console.error("Adhan.js failed to calculate Qibla", e);
    }
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "بوصلة القبلة الذكية",
      "description": "أداة ويب احترافية لتحديد اتجاه القبلة بدقة 100%.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/qibla`,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كيف تعمل بوصلة القبلة أون لاين؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تعتمد الأداة على مستشعر المغناطيسية المدمج في هاتفك وتستخدم إحداثيات الـ GPS لحساب الزاوية الدقيقة للكعبة المشرفة."
          }
        },
        {
          "@type": "Question",
          "name": "هل أحتاج إلى تحميل تطبيق لتحديد القبلة؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "لا، الخدمة تعمل مباشرة من المتصفح مما يوفر المساحة ويضمن الخصوصية."
          }
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QiblaCompass
        qiblaAngle={qiblaAngle}
        userLat={isNaN(lat) ? null : lat}
        userLon={isNaN(lon) ? null : lon}
      />
    </>
  );
}
