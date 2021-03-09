import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';
import { perPage } from '../../config';
import DisplayError from '../../components/ErrorMessage';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function ProductPage() {
  const { query } = useRouter();
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { count } = data._allProductsMeta;
  let page = parseInt(query.page);
  const pageCount = Math.ceil(count / perPage);
  if (page > pageCount) {
    page = pageCount;
  }
  return (
    <div>
      <Pagination page={page || 1} pageCount={pageCount} count={count} />
      <Products page={page || 1} />
      <Pagination page={page || 1} pageCount={pageCount} count={count} />
    </div>
  );
}
