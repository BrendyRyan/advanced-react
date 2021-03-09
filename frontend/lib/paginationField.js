import { PAGINATION_QUERY } from '../pages/products/index';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items, AND there aren't enough items to satisify how many per page, AND we are on the last page, THEN just send when you have
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we have no items and must go to network to fetch them
        return false;
      }
      if (items.length) {
        // if there are items, return them from cache and no need to go to network
        console.log(`There are ${items.length} items in the Apollo cache`);
        return items;
      }
      return false; // fallback to network
      // 1. Ask the read fn for those items
      // Can do one of two things
      // return items b/c they are already in the cache
      // other is return false from here, triggering a network request
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the Apollo client comes back from the network with our products
      // console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // Finally we return the merged items from the cache
      return merged;
    },
  };
}
