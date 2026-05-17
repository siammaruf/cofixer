import { SetMetadata } from '@nestjs/common';

export const CACHE_TAG_KEY = 'cacheTag';

export const CacheTag = (tag: string) => SetMetadata(CACHE_TAG_KEY, tag);
