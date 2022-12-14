import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | dev.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time>14 de Dezembro de 2022</time>
            <strong>Como criar um app do zero usando Next.js</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              quod, voluptate, quia, voluptates quas voluptatibus quae
              necessitatibus quibusdam quidem voluptatum quos. Quisquam, quae
              voluptates. Quisquam, quae voluptates.
            </p>
          </a>
          <a>
            <time>14 de Dezembro de 2022</time>
            <strong>Como criar um app do zero usando Next.js</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              quod, voluptate, quia, voluptates quas voluptatibus quae
              necessitatibus quibusdam quidem voluptatum quos. Quisquam, quae
              voluptates. Quisquam, quae voluptates.
            </p>
          </a>
          <a>
            <time>14 de Dezembro de 2022</time>
            <strong>Como criar um app do zero usando Next.js</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              quod, voluptate, quia, voluptates quas voluptatibus quae
              necessitatibus quibusdam quidem voluptatum quos. Quisquam, quae
              voluptates. Quisquam, quae voluptates.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
