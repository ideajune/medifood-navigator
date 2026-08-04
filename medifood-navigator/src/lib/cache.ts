import fs from 'fs/promises';
import path from 'path';
import { NutrientInfo } from './mockData';

const CACHE_FILE = path.join(process.cwd(), 'data.json');

interface CacheData {
  foods: Record<string, NutrientInfo>;
  analysis: Record<string, string>;
}

async function getCache(): Promise<CacheData> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 파일이 없거나 JSON 파싱 에러 시 기본 형태 반환
    return { foods: {}, analysis: {} };
  }
}

async function saveCache(data: CacheData): Promise<void> {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write cache to data.json', error);
  }
}

export async function getFoodFromCache(name: string): Promise<NutrientInfo | null> {
  const cache = await getCache();
  return cache.foods[name] || null;
}

export async function saveFoodToCache(name: string, data: NutrientInfo): Promise<void> {
  const cache = await getCache();
  cache.foods[name] = data;
  await saveCache(cache);
}

export async function getAnalysisFromCache(name: string, diseases: string[]): Promise<string | null> {
  const cacheKey = `${name}_${diseases.sort().join('_')}`;
  const cache = await getCache();
  return cache.analysis[cacheKey] || null;
}

export async function saveAnalysisToCache(name: string, diseases: string[], text: string): Promise<void> {
  const cacheKey = `${name}_${diseases.sort().join('_')}`;
  const cache = await getCache();
  cache.analysis[cacheKey] = text;
  await saveCache(cache);
}
