
import { BondType, OrbitalInfo } from './types';

export const ORBITAL_DATA: OrbitalInfo[] = [
  {
    id: BondType.SS_SIGMA,
    title: "s-s σ (西格玛) 键",
    description: "由两个球形的s轨道沿键轴方向“头碰头”重叠形成。电子云密度在轴心处最集中，具有轴对称性。这种键强度较高，且允许原子绕轴自由旋转。",
    energyLevel: "低能级 / 最稳定"
  },
  {
    id: BondType.SP_SIGMA,
    title: "s-p σ (西格玛) 键",
    description: "一个球形的s轨道与一个哑铃形的p轨道的一个叶瓣沿核间轴重叠。常见于卤化氢（如HCl）分子的形成过程中。",
    energyLevel: "中等能级"
  },
  {
    id: BondType.PP_SIGMA,
    title: "p-p σ (西格玛) 键",
    description: "两个哑铃形的p轨道沿轴线方向“头碰头”重叠。电子云呈圆柱状对称，是构成单键的主要形式。",
    energyLevel: "稳定 σ 构型"
  },
  {
    id: BondType.PP_PI,
    title: "p-p π (派) 键",
    description: "两个平行的p轨道从侧面“肩并肩”重叠。电子云分布在核间轴的上下两侧，这种重叠方式限制了原子的自由旋转，且化学性质较活泼。",
    energyLevel: "高反应活性"
  },
  {
    id: BondType.ETHANE,
    title: "乙烷 C-C σ 键 (sp³)",
    description: "乙烷中的碳原子采取sp³杂化。C-C键是由两个sp³杂化轨道重叠形成的σ键。分子呈四面体结构，支持自由旋转。",
    energyLevel: "四面体几何构型"
  },
  {
    id: BondType.ETHENE,
    title: "乙烯 C=C 双键 (sp²)",
    description: "碳原子采取sp²杂化。包含一个σ键（sp²-sp²重叠）和一个π键（未杂化的p轨道侧面重叠）。分子共平面。",
    energyLevel: "平面正三角形构型"
  },
  {
    id: BondType.ETHYNE,
    title: "乙炔 C≡C 三键 (sp)",
    description: "碳原子采取sp杂化。包含一个σ键（sp-sp重叠）和两个互相垂直的π键（py-py和pz-pz重叠）。分子呈直线型。",
    energyLevel: "直线几何构型"
  }
];
