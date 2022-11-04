import Head from "next/head"
import styles from "./home.module.scss"

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      
      <main className={styles.container}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for $2.90</span> month
          </p>
        </section>
        <img src="/images/women.svg" alt="Girl coding" />
      </main>
    </>
  )
}
