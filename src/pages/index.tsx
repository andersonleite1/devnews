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
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>Dev</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount}</span> month
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/women.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1M7RI8HRlVMCYkSYYdQn9nkx');

  if (!price.id || !price.unit_amount) throw new Error('Price not found');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      currency: 'USD',
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
  
