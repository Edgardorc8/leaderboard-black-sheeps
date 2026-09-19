// ============================================================
// tiers.js — Definición y Lógica del Sistema de Tier List (S, A, B, C)
// ============================================================

export const TIERS = {
  S: {
    name: 'Tier S',
    label: 'Leyenda · Tier S',
    minSales: 100000,
    color: 'amber',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-400',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)]',
    icon: '👑',
    perk: 'Aura Dorada de Fuego + Partículas',
  },
  A: {
    name: 'Tier A',
    label: 'Master · Tier A',
    minSales: 70000,
    color: 'purple',
    badgeBg: 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20',
    border: 'border-purple-400',
    text: 'text-purple-300',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    icon: '⚡',
    perk: 'Resplandor Amatista Neón',
  },
  B: {
    name: 'Tier B',
    label: 'Élite · Tier B',
    minSales: 40000,
    color: 'cyan',
    badgeBg: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-400',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    icon: '💎',
    perk: 'Borde Zafiro Neón',
  },
  C: {
    name: 'Tier C',
    label: 'Aspirante · Tier C',
    minSales: 0,
    color: 'emerald',
    badgeBg: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    icon: '🛡️',
    perk: 'Borde Esmeralda Pulido',
  },
};

/**
 * Calcula el Tier de un asesor según su total de ventas
 */
export function getTier(salesAmount) {
  if (salesAmount >= TIERS.S.minSales) return TIERS.S;
  if (salesAmount >= TIERS.A.minSales) return TIERS.A;
  if (salesAmount >= TIERS.B.minSales) return TIERS.B;
  return TIERS.C;
}

/**
 * Formato oficial de moneda para todo el dashboard: $124.500 USD
 */
export function formatCurrency(amount) {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted} USD`;
}
