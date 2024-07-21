import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/home.module.scss';
import { poppins } from '@/utils/fonts';

export default function Home() {
  return (
    <>
      <Head>
        <title>Build With Assembly | Front-end Case Study</title>
        <meta
          name='description'
          content='Create a React application that supports searching GitHub for both users and
organizations.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={`${styles.main} ${poppins.className}`}>
        <h1>Build With Assembly | Front-end Case Study</h1>
      </main>
    </>
  );
}
