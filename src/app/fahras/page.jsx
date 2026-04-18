// app/fahras/page.jsx
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenText,
  BriefcaseBusiness,
  Calculator,
  ChartNoAxesCombined,
  Clock3,
  LayoutList,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { SectionWrapper } from '@/components/shared/primitives';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_DIRECTORY_COUNTS, SITE_DIRECTORY_SECTIONS } from '@/lib/site-directory';
import { getSiteUrl } from '@/lib/site-config';

import styles from './page.module.css';

const SITE_URL = getSiteUrl();

const SECTION_ICONS = {
  time: Clock3,
  'calculators-hubs': LayoutList,
  'calculators-tools': Calculator,
  economy: ChartNoAxesCombined,
  guides: BookOpenText,
  holidays: PartyPopper,
  company: ShieldCheck,
};

export const metadata = buildCanonicalMetadata({
  title: 'الفهرس الشامل | كل أدوات ميقاتنا في صفحة واحدة',
  description:
    'الفهرس الشامل لميقاتنا: الوقت الآن، مواقيت الصلاة، فرق التوقيت، الحاسبات، الاقتصاد الحي، الأدلة، والمناسبات في صفحة منظمة واحدة وسهلة التصفح.',
  keywords: [
    'الفهرس',
    'فهرس ميقاتنا',
    'كل أدوات ميقاتنا',
    'دليل الحاسبات والأدوات',
    'فهرس الوقت والصلاة والتاريخ والحاسبات',
  ],
  url: `${SITE_URL}/fahras`,
});

export default function SiteIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'الفهرس الشامل',
    url: `${SITE_URL}/fahras`,
    inLanguage: 'ar',
    description: 'صفحة تجمع كل أدوات ومسارات ميقاتنا في دليل واحد واضح وسريع التصفح.',
    hasPart: SITE_DIRECTORY_SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'WebPage',
        name: item.title,
        url: `${SITE_URL}${item.href}`,
      })),
    ),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SITE_DIRECTORY_SECTIONS.flatMap((section, sectionIndex) =>
      section.items.map((item, itemIndex) => ({
        '@type': 'ListItem',
        position: sectionIndex * 100 + itemIndex + 1,
        name: item.title,
        url: `${SITE_URL}${item.href}`,
      })),
    ),
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <SectionWrapper id="fahras-hero" className={styles.heroShell} contentWidth="content-col">
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Search size={15} />
              الفهرس الشامل
            </span>
            <h1 className={styles.title}>كل ما في ميقاتنا، مرتّب بوضوح في صفحة واحدة</h1>
            <p className={styles.lead}>
              بدل أن تبقى الأدوات موزعة بين الصفحة الرئيسية والفوتر والروابط الداخلية، يجمع هذا
              الفهرس الوقت والصلاة والتاريخ والحاسبات والاقتصاد والأدلة في دليل نظيف يشبه
              القاموس: واضح، سريع، وسهل التصفح من الجوال وسطح المكتب.
            </p>
            <p className={styles.heroNote}>
              الهدف من هذه الصفحة ليس حشو روابط أكثر، بل إعطاء المستخدم خريطة منظمة
              لما يقدمه الموقع فعلاً.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>عدد المسارات</span>
              <strong className={styles.statValue}>{SITE_DIRECTORY_COUNTS.sections}</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>الصفحات المفهرسة هنا</span>
              <strong className={styles.statValue}>{SITE_DIRECTORY_COUNTS.items}+</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>الحاسبات</span>
              <strong className={styles.statValue}>{SITE_DIRECTORY_COUNTS.calculators}</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>أدوات الاقتصاد</span>
              <strong className={styles.statValue}>{SITE_DIRECTORY_COUNTS.economy}</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>الأدلة العملية</span>
              <strong className={styles.statValue}>{SITE_DIRECTORY_COUNTS.guides}</strong>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="fahras-nav" className={styles.anchorShell} contentWidth="content-col">
        <div className={styles.anchorWrap}>
          {SITE_DIRECTORY_SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={styles.anchorLink}>
              <Sparkles size={14} />
              {section.title}
            </a>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="fahras-grid" className={styles.gridShell} contentWidth="content-col">
        <div className={styles.grid}>
          {SITE_DIRECTORY_SECTIONS.map((section) => {
            const Icon = SECTION_ICONS[section.id] || BriefcaseBusiness;

            return (
              <section key={section.id} id={section.id} className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                  <div className={styles.sectionTop}>
                    <span className={styles.sectionBadge}>
                      <Icon size={16} />
                      {section.title}
                    </span>
                    <span className={styles.sectionCount}>{section.items.length} صفحة</span>
                  </div>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <p className={styles.sectionDescription}>{section.description}</p>
                </header>

                <div className={styles.itemList}>
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.itemLink}>
                      <div className={styles.itemCopy}>
                        <span className={styles.itemTitle}>{item.title}</span>
                        <span className={styles.itemDescription}>{item.description}</span>
                      </div>
                      <ArrowLeft size={16} className={styles.itemArrow} />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </SectionWrapper>
    </main>
  );
}
