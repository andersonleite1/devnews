import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(`/posts/${post.slug}`);
    }
  }, [status]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Quer continuar lendo?
            <Link href="/">
              Inscreva-se agora 🤗
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    console.log('No params');
    return;
  }

  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  if (!response.last_publication_date) {
    console.log('Post without publication date');
    return;
  }

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.slice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  }
}
