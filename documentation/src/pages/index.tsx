import clsx from 'clsx';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Документация проекта"
      description="Документация сайта для абитуриентов РГПУ им. А. И. Герцена">
      <main className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Герцен. Абитуриентам
          </Heading>
          <p className="hero__subtitle">
            Проектная документация: требования, архитектура, API, база данных и UML.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              Открыть документацию
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
