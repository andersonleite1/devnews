import { GetServerSidePropsContext, PreviewData } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { ParsedUrlQuery } from "querystring";
import { getPrismicClient } from "../../services/prismic";

import { Session } from "next-auth";

import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

interface ISession extends Session {
  activeSubscription?: string;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | dev.news</title>
      </Head>
      <main className={styles.conteiner}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps = async ({ req, params }: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  const session = await getSession({ req }) as ISession;

  if (!params) {
    console.log('No params');
    return;
  }

  const { slug } = params;
  console.log('session', session);

  if (!session || !session?.activeSubscription) {
    console.log('No active subscription');
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  if (!response.last_publication_date) {
    console.log('Post without publication date');
    return;
  }

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return {
    props: {
      post,
    }
  }
}
