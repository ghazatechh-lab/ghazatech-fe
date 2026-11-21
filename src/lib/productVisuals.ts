import type { Product } from './types';

export const CATEGORY_VISUALS: Record<string, string> = {
  Battery: '/images/cat-dock-batteries.webp',
  Bezel: '/images/screen-product.webp',
  Charger: '/images/cat-dock-chargers.webp',
  Fan: '/images/cat-dock-cooling.webp',
  Hinges: '/images/cat-dock-hinges.webp',
  Keyboard: '/images/cat-dock-keyboards.webp',
  Motherboard: '/images/cat-dock-motherboards.webp',
  Palmrest: '/images/palmrest-product.webp',
  Ram: '/images/cat-dock-ssd-ram.webp',
  SSD: '/images/cat-dock-ssd-ram.webp',
  Screen: '/images/cat-dock-screens.webp',
  Topcover: '/images/palmrest-product.webp',
  'Top cover': '/images/palmrest-product.webp',
  'Wifi Module': '/images/motherboard-product.webp',
};

export function getProductVisual(product: Product): string | null {
  if (product.image_url) return product.image_url;
  if (product.category?.name) return CATEGORY_VISUALS[product.category.name] ?? null;
  return null;
}
