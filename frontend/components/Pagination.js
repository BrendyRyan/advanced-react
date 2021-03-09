import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';

export default function Pagination({ page, pageCount, count }) {
  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits | Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>← Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Totals</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next →</a>
      </Link>
    </PaginationStyles>
  );
}
