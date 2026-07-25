import type { ReactNode } from 'react';

import type { DocumentationContent } from './documentationTypes';
import styles from './DocumentationPage.module.css';

export interface DocumentationPageProps {
  content: DocumentationContent;
  example?: ReactNode;
}

export function DocumentationPage({
  content,
  example,
}: DocumentationPageProps) {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 className={styles.title}>{content.title}</h1>
        {content.status ? (
          <span className={styles.status}>{content.status}</span>
        ) : null}
        <p className={styles.summary}>{content.summary}</p>
      </header>

      <div className={styles.content}>
        {content.sections.map((section) => (
          <section className={styles.section} key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.code ? (
              <pre
                className={styles.code}
                tabIndex={0}
                aria-label={`${section.title} code example`}
              >
                <code>{section.code}</code>
              </pre>
            ) : null}
          </section>
        ))}
      </div>

      {example ? (
        <section className={styles.example}>
          <h2>Executable example</h2>
          <div className={styles.exampleCanvas}>{example}</div>
        </section>
      ) : null}
    </article>
  );
}

DocumentationPage.displayName = 'DocumentationPage';
