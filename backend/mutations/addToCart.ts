/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('Adding to cart');
  // 1. query current user and see if signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2 query current user cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity' // tell Keystone what values to return
  });
  // 3 See if the item is already in the cart
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity} items in the cart, incrementing by 1.`
    );
    // 4 if it is, increment by one
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 4 if it is not, create new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
