// ═══ RuangGaya — Face Filter Types ═══

export type FaceFilterId =
  | 'none'
  | 'cat'
  | 'dog'
  | 'glasses'
  | 'crown'
  | 'flower-crown'
  | 'butterfly'
  | 'clown'
  | 'sparkle'
  | 'beauty'
  | 'devil'
  | 'angel'
  | 'bunny'
  | 'pixel-glasses'
  | 'heart-blush'
  | 'cyber-visor'
  | 'mustache'
  | 'star-eyes'
  | 'flower-blush';

export interface FaceFilterDef {
  id: FaceFilterId;
  label: string;
  icon: string;
  description: string;
}
