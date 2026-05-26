import { Types } from 'mongoose';
import type { ProductComment } from '@jmart/shared';

const commentsByProductId = new Map<string, ProductComment[]>();

export function listInMemoryComments(productId: string) {
  return commentsByProductId.get(String(productId)) ?? [];
}

export function addInMemoryComment(productId: string, authorName: string, userId: string, text: string) {
  const current = commentsByProductId.get(String(productId)) ?? [];
  const comment: ProductComment = {
    id: new Types.ObjectId().toString(),
    userId,
    authorName,
    text,
    createdAt: new Date().toISOString()
  };
  commentsByProductId.set(String(productId), [comment, ...current]);
  return comment;
}