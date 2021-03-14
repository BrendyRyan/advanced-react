import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// At it's simplest, access control is either a yes or a no value depending on user session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);
// Permissions check if someone needs a criteria - yes or no
export const permissions = {
  ...generatedPermissions,
  // additional permission example
  isAwesome({ session }: ListAccessArgs): boolean {
    return session?.data.name.includes('brendan');
  },
};
// Rule based functions
// Rules can return a boolean - yes or no - or a filter which limits products they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // checkbox permission?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // checkbox permission?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // they can read everything
    }
    // They should only see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // checkbox permission?
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // otherwise they may only update self
    return { id: session.itemId };
  },
};
