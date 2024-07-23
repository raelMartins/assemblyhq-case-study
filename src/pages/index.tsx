import Head from 'next/head';
import styles from '@/styles/home.module.scss';
import {poppins} from '@/utils/fonts';
import Image from 'next/image';
import {Avatar, SkeletonCircle, SkeletonText} from '@chakra-ui/react';
import {BaseSyntheticEvent, useEffect, useState} from 'react';
import {GetServerSideProps} from 'next';
import {useQuery} from '@tanstack/react-query';
import {query_github} from '@/utils/api_calls';
import {IoChevronBack, IoChevronForward} from 'react-icons/io5';
import {useRouter} from 'next/router';

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {props: {query: ctx.query || {}}};
};

export default function Home({
  query,
}: {
  query?: {
    q?: string;
    is_org?: boolean;
    page?: number;
  };
}) {
  const [search, setSearch] = useState(query?.q || ``);
  const [isOrg, setIsOrg] = useState(query?.is_org ? true : false);
  const [loading, setLoading] = useState(query?.q ? true : false);
  const [page, setPage] = useState(query?.page || 1);
  const router = useRouter();

  const {data, isError, refetch} = useQuery({
    queryKey: ['github_results'],
    queryFn: () => fetch_results(),
    enabled: !search,
  });

  const list = loading ? Array(30).fill('') : data || [];

  const fetch_results = async () => {
    try {
      if (!search) return;
      setLoading(true);
      const res = await query_github({query: search, org: isOrg, page});
      setLoading(false);
      router.push(`?q=${search}${isOrg ? '&is_org=true' : ``}${page > 1 ? `&page=${page}` : ``}`);
      return res;
    } catch (err) {
      setLoading(false);
      console.error(err);
      throw err;
    }
  };

  const next_page = () => {
    if (!data?.length || data?.length < 10 || loading) return;
    setPage(page + 1);
  };

  const previous_page = () => {
    if (page <= 1 || loading) return;
    setPage(page - 1);
  };

  useEffect(() => {
    refetch();
  }, [page, isOrg]);

  return (
    <>
      <Head>
        <title>Build With Assembly | Front-end Case Study</title>
        <meta
          name="description"
          content="Create a React application that supports searching GitHub for both users and organizations."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${poppins.className}`}>
        <section className={styles.container}>
          <h1>Search GitHub</h1>
          <form
            className={styles.search_input}
            onSubmit={e => {
              e.preventDefault();
              refetch();
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value)}
            />
            <button>Go</button>
          </form>
          <div className={styles.type_toggle}>
            <button
              className={`${styles.type} ${!isOrg ? styles.active : ``}`}
              onClick={() => setIsOrg(false)}
            >
              User
            </button>
            <button
              className={`${styles.type} ${isOrg ? styles.active : ``}`}
              onClick={() => setIsOrg(true)}
            >
              Organisation
            </button>
          </div>
          {loading ? (
            <ul className={styles.search_results}>
              {list?.map((result: any) => (
                <SearchItem key={result.id} result={result} loading={true} />
              ))}
            </ul>
          ) : !data ? (
            <div className={styles.text_display}>
              <h4>Start Searching</h4>
            </div>
          ) : search && data?.length == 0 ? (
            <div className={styles.text_display}>
              <h4>Nothing Found</h4>
            </div>
          ) : data?.length > 0 ? (
            <ul className={styles.search_results}>
              {list?.map((result: any) => (
                <SearchItem key={result.id} result={result} loading={loading} />
              ))}
            </ul>
          ) : isError ? (
            <div className={styles.text_display}>
              <h4>An error has occurred</h4>
            </div>
          ) : null}

          <div className={styles.pagination}>
            <span
              className={`${styles.button} ${page <= 1 && styles.disabled}`}
              onClick={previous_page}
            >
              <IoChevronBack />
            </span>
            <span>Page {page}</span>
            <span
              className={`${styles.button} ${
                !data?.length || data?.length < 10 ? styles.disabled : ``
              }`}
              onClick={next_page}
            >
              <IoChevronForward />
            </span>
          </div>
        </section>
      </main>
    </>
  );
}

const SearchItem = ({result, loading}: {result?: any; loading?: boolean}) => {
  return (
    <li className={styles.result}>
      <SkeletonCircle height={`4.2rem`} width={`4.2rem`} isLoaded={!loading}>
        {/* 
      //currently using the Chakra UI Avatar but this image implementation works fine
      
      <div className={styles.result_image}>
        <Image
          src={result?.avatar_url}
          alt={`result image`}
          fill
          style={{objectFit: `cover`}}
        />
      </div> 
    */}
        <Avatar size={`lg`} name={result?.login} src={result?.avatar_url} />
      </SkeletonCircle>
      <SkeletonText
        mt="0rem"
        flex={`1`}
        noOfLines={2}
        spacing="4"
        skeletonHeight="3"
        isLoaded={!loading}
      >
        <div className={styles.result_details}>
          <p className={styles.name}>{result?.login}</p>
          <a
            href={result?.html_url}
            target="_blank"
            rel="noopener norefferer"
            className={styles.user_link}
          >
            <p>{result?.html_url}</p>
          </a>
        </div>
      </SkeletonText>
    </li>
  );
};
