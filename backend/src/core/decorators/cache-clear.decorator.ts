import { SetMetadata } from '@nestjs/common';

export const CACHE_CLEAR_KEY = 'cacheClear';

export const CacheClear = (tag: string) => SetMetadata(CACHE_CLEAR_KEY, tag);
