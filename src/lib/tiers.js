// ============================================================
// tiers.js — Lógica Oficial del Sistema de Tiers Dinámicos (Black Sheeps)
// Regla: Puestos #01, #02 y #03 son forzosamente TIER S (Podio de Honor).
// El resto se clasifica por su posición relativa en la manada.
// ============================================================

export const TIERS = {
  S: {
    name: 'Tier S',
    label: 'Campeón · Tier S',
    color: 'amber',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-400',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)]',
    icon: '👑',
    perk: 'Trofeo Oficial 3D + Aura de Victoria',
  },
  A: {
    name: 'Tier A',
    label: 'Master · Tier A',
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
 * Calcula el Tier de un asesor según su POSICIÓN en el ranking (1-based)
 * Regla de Negocio Black Sheeps:
 * - Puestos 1, 2 y 3 -> TIER S (Podio de Honor)
 * - Puestos 4 y 5 -> TIER A (Master Closers)
 * - Puestos 6, 7 y 8 -> TIER B (Élite Hunters)
 * - Puestos 9 y 10 -> TIER C (Aspirantes)
 */
export function getTierByRank(rank) {
  if (rank <= 3) return TIERS.S;
  if (rank <= 5) return TIERS.A;
  if (rank <= 8) return TIERS.B;
  return TIERS.C;
}

/**
 * Formato oficial de moneda para todo el dashboard: $124.500 USD
 */
export function formatCurrency(amount) {
  const rounded = Math.round(amount || 0);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted} USD`;
}
