
export enum BondType {
  SS_SIGMA = 's-s σ 键',
  SP_SIGMA = 's-p σ 键',
  PP_SIGMA = 'p-p σ 键',
  PP_PI = 'p-p π 键',
  ETHANE = '乙烷 (C-C σ)',
  ETHENE = '乙烯 (C=C σ+π)',
  ETHYNE = '乙炔 (C≡C σ+2π)'
}

export interface AnimationState {
  progress: number; // 0 to 1
  isAnimating: boolean;
}

export interface OrbitalInfo {
  id: BondType;
  title: string;
  description: string;
  energyLevel: string;
}
