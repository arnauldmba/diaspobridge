const AVATAR_COLORS = [
  '#fde68a', // jaune
  '#bfdbfe', // bleu
  '#fecaca', // rouge
  '#bbf7d0', // vert
  '#ddd6fe', // violet
  '#fbcfe8', // rose
  '#fed7aa', // orange
];

export function getAvatarColor(name: string | null | undefined): string {
  if (!name) return '#e5e7eb'; // gris fallback

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}