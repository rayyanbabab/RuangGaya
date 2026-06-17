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
  | 'beauty';

export interface FaceFilterDef {
  id: FaceFilterId;
  label: string;
  icon: string;
  description: string;
}
