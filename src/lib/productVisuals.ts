import type { Product } from './types';

export const CATEGORY_VISUALS: Record<string, string> = {
  Battery: '/images/battery-product.webp',
  Bezel: '/images/screen-product.webp',
  Charger: '/images/charger-product.webp',
  Fan: '/images/fan-product.webp',
  Hinges: '/images/hinges-product.webp',
  Keyboard: '/images/keyboard-product.webp',
  Motherboard: '/images/motherboard-product.webp',
  Palmrest: '/images/palmrest-product.webp',
  Ram: '/images/motherboard-product.webp',
  SSD: '/images/battery-product.webp',
  Screen: '/images/screen-product.webp',
  Topcover: '/images/screen-product.webp',
  'Wifi Module': '/images/motherboard-product.webp',
};

export function getProductVisual(product: Product): string | null {
  if (product.image_url) return product.image_url;
  if (product.category?.name) return CATEGORY_VISUALS[product.category.name] ?? null;
  return null;
}
