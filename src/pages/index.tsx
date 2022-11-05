import Head from "next/head"
import { SubscribeButton } from "../components/SubscribeButton"
import styles from "./home.module.scss"

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | dev.news</title>
      </Head>
      
      <main className={styles.container}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>Dev</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for $2.90</span> month
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/women.svg" alt="Girl coding" />
      </main>
    </>
  )
}
