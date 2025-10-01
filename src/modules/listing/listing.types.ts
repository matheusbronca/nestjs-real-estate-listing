import { listings } from './schema';

export type CreateListingInput = Omit<
  typeof listings.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
