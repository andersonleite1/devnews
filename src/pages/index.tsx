import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  
  return (
    <>
      <Head>
        <title>Home | dev.news</title>
      </Head>
      
      <main className={styles.container}>
        <section className={styles.hero}>
          <span>👏 Ei, bem-vindo</span>
          <h1>Notícias sobre o <span>Dev</span> mundo.</h1>
          <p>
            Tenha acesso a todas as publicações <br />
            por <span>{product.amount}</span> mensais
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/women.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1MK3RZHRlVMCYkSYfQagn8rl');

  if (!price.id || !price.unit_amount) throw new Error('Price not found');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      style: 'currency'
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
  
