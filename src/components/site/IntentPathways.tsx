import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/site-config';
import type { IntentPathway } from '@/lib/site/intent-pathways';

import styles from './IntentPathways.module.css';

interface IntentPathwaysProps {
  pathways: IntentPathway[];
  sectionId: string;
  eyebrow: string;
  title: string;
  lead: string;
}

const SITE_URL = getSiteUrl();

export default function IntentPathways(props: IntentPathwaysProps) {
  const safePathways = Array.isArray(props.pathways) ? props.pathways : [];
  const pathwaysSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: props.title,
    itemListElement: safePathways.flatMap((pathway, pathwayIndex) =>
      (Array.isArray(pathway.links) ? pathway.links : []).map((link, linkIndex) => ({
        '@type': 'ListItem',
        position: pathwayIndex * 10 + linkIndex + 1,
        name: `${pathway.title}: ${link.title}`,
        url: `${SITE_URL}${link.href}`,
      })),
    ),
  };

  return (
    <section id={props.sectionId} className={styles.section} aria-labelledby={`${props.sectionId}-title`}>
      <JsonLd data={pathwaysSchema} />

      <div className={styles.header}>
        <span className={styles.eyebrow}>
          <Sparkles size={13} />
          {props.eyebrow}
        </span>
        <h2 id={`${props.sectionId}-title`} className={styles.title}>
          {props.title}
        </h2>
        <p className={styles.lead}>{props.lead}</p>
      </div>

      <div className={styles.stack}>
        {safePathways.map((pathway) => (
          <article
            key={pathway.id}
            className={styles.band}
          >
            <div className={styles.bandHeader}>
              <span className={styles.bandBadge}>{pathway.badge}</span>

              <div className={styles.bandTitleRow}>
                <div>
                  <h3 className={styles.bandTitle}>{pathway.title}</h3>
                  <p className={styles.bandDescription}>{pathway.description}</p>
                </div>

                <Link href={pathway.ctaHref} className={styles.bandCta}>
                  {pathway.ctaLabel}
                  <ArrowLeft size={15} />
                </Link>
              </div>
            </div>

            <nav className={styles.linksGrid} aria-label={pathway.title}>
              {(Array.isArray(pathway.links) ? pathway.links : []).map((link) => (
                <Link key={link.href} href={link.href} className={styles.linkCard}>
                  <span className={styles.linkTop}>
                    ابدأ من هنا
                    <ArrowLeft size={14} />
                  </span>
                  <strong className={styles.linkTitle}>{link.title}</strong>
                  <p className={styles.linkDescription}>{link.description}</p>
                </Link>
              ))}
            </nav>
          </article>
        ))}
      </div>
    </section>
  );
}
