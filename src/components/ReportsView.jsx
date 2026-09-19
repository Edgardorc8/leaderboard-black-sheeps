// ============================================================
// ReportsView.jsx — Módulo de Reportes Oficiales con Exportación a PDF
// ============================================================
import { useState } from 'react';
import { FileText, Download, TrendingUp, Award, Calendar, DollarSign, UserCheck, Shield } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, getTierByRank } from '../lib/tiers';

export default function ReportsView({ users, timePeriod, onPeriodChange }) {
  const [selectedAgentId, setSelectedAgentId] = useState('ALL');

  const totalRevenue = users.reduce((acc, u) => {
    const s =
      timePeriod === 'daily'
        ? u.daily_sales || 0
        : timePeriod === 'weekly'
        ? u.weekly_sales || 0
        : u.total_sales || 0;
    return acc + s;
  }, 0);

  const totalClosings = users.reduce((acc, u) => acc + (u.sales_count || 0), 0);
  const avgTicket = totalClosings > 0 ? Math.round(totalRevenue / totalClosings) : 0;

  const periodLabel =
    timePeriod === 'daily'
      ? 'Hoy (Diario)'
      : timePeriod === 'weekly'
      ? 'Esta Semana'
      : 'Mes Actual (Septiembre)';

  // ---- Exportar Reporte Global a PDF ----
  const exportGlobalPDF = () => {
    const doc = new jsPDF();

    // Encabezado Corporativo
    doc.setFillColor(15, 12, 30);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('BLACK SHEEPS', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 85, 247);
    doc.text('BALANCE EJECUTIVO DE VENTAS · REPORTE OFICIAL', 14, 28);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    doc.text(`Periodo: ${periodLabel} | Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 34);

    // Resumen de Métricas
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN GENERAL DEL EQUIPO', 14, 50);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Facturación Total Acumulada: ${formatCurrency(totalRevenue)}`, 14, 58);
    doc.text(`• Contratos / Cierres Totales: ${totalClosings} ventas`, 14, 65);
    doc.text(`• Ticket Promedio por Cierre: ${formatCurrency(avgTicket)}`, 14, 72);
    doc.text(`• Total Asesores en Evaluación: ${users.length} miembros`, 14, 79);

    // Tabla de Asesores
    const tableData = users.map((u, i) => {
      const tier = getTierByRank(i + 1);
      const sales =
        timePeriod === 'daily'
          ? u.daily_sales || 0
          : timePeriod === 'weekly'
          ? u.weekly_sales || 0
          : u.total_sales || 0;

      return [
        `#${String(i + 1).padStart(2, '0')}`,
        tier.name,
        u.name,
        u.discord_tag,
        u.country?.split(' ')[0] || '',
        `${u.sales_count || 0}`,
        formatCurrency(sales),
      ];
    });

    autoTable(doc, {
      startY: 88,
      head: [['RANK', 'TIER', 'ASESOR COMERCIAL', 'DISCORD', 'PAÍS', 'CIERRES', 'VOLUMEN']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [45, 34, 85],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'center' },
        1: { fontStyle: 'bold' },
        6: { fontStyle: 'bold', halign: 'right' },
      },
    });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Black Sheeps Enterprise Hub — Confidencial para uso interno — Página ${i} de ${pageCount}`,
        14,
        288
      );
    }

    doc.save(`Black_Sheeps_Reporte_Global_${timePeriod}.pdf`);
  };

  // ---- Exportar Ficha Individual a PDF ----
  const exportAgentPDF = (agent) => {
    const doc = new jsPDF();
    const rank = users.findIndex((u) => u.id === agent.id) + 1;
    const tier = getTierByRank(rank);

    const sales =
      timePeriod === 'daily'
        ? agent.daily_sales || 0
        : timePeriod === 'weekly'
        ? agent.weekly_sales || 0
        : agent.total_sales || 0;

    // Encabezado
    doc.setFillColor(15, 12, 30);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('BLACK SHEEPS', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 85, 247);
    doc.text('EXPEDIENTE OFICIAL DE ASESOR COMERCIAL', 14, 28);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    doc.text(`Periodo Evaluado: ${periodLabel} | Emisión: ${new Date().toLocaleDateString()}`, 14, 35);

    // Datos del Asesor
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`ASESOR: ${agent.name.toUpperCase()}`, 14, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Discord Tag: ${agent.discord_tag}`, 14, 63);
    doc.text(`• Correo: ${agent.email}`, 14, 70);
    doc.text(`• País de Operación: ${agent.country}`, 14, 77);
    doc.text(`• Personaje / Avatar Oficial: ${agent.custom_character_name || agent.character_name || 'Guerrero'}`, 14, 84);
    if (agent.battle_cry) {
      doc.text(`• Grito de Cierre: «${agent.battle_cry}»`, 14, 91);
    }

    // KPIs Individuales
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RENDIMIENTO EN EL PERIODO', 14, 105);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Posición en Leaderboard: #${String(rank).padStart(2, '0')} (${tier.name} ${tier.icon})`, 14, 113);
    doc.text(`• Facturación del Periodo: ${formatCurrency(sales)}`, 14, 120);
    doc.text(`• Cierres Totales: ${agent.sales_count || 0} contratos`, 14, 127);
    const personalAvg = agent.sales_count > 0 ? Math.round(agent.total_sales / agent.sales_count) : 0;
    doc.text(`• Promedio por Cierre: ${formatCurrency(personalAvg)}`, 14, 134);

    // Historial
    const historyData = (agent.recent_sales || []).map((s) => [
      s.time,
      'Cierre de Contrato',
      'Confirmado',
      `+${formatCurrency(s.amount)}`,
    ]);

    if (historyData.length > 0) {
      autoTable(doc, {
        startY: 145,
        head: [['FECHA Y HORA', 'CONCEPTO', 'ESTADO', 'MONTO']],
        body: historyData,
        theme: 'striped',
        headStyles: { fillColor: [45, 34, 85] },
      });
    }

    doc.save(`Ficha_${agent.name.replace(/\s+/g, '_')}_${timePeriod}.pdf`);
  };

  return (
    <section className="space-y-6">
      {/* Encabezado con Botón de Exportar Global */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#120e24] border border-[#2d2255] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              Centro de Reportes & Inteligencia Comercial
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              ADMINISTRACIÓN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Genera auditorías oficiales y exporta balances en PDF para comisiones y juntas directivas.
          </p>
        </div>

        <button
          onClick={exportGlobalPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#e94560] to-[#a855f7] hover:opacity-95 transition-all shadow-[0_0_15px_rgba(233,69,96,0.35)] shrink-0 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Exportar Reporte Global a PDF
        </button>
      </div>

      {/* Tarjetas KPI de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141026] border border-[#2d2255]">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Facturación ({periodLabel})</span>
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total acumulado</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141026] border border-[#2d2255]">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Cierres Realizados</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {totalClosings} ventas
          </div>
          <div className="text-[10px] text-slate-400 mt-1">En el periodo</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141026] border border-[#2d2255]">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Ticket Promedio</span>
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">
            {formatCurrency(avgTicket)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Por contrato</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141026] border border-[#2d2255]">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Asesores Evaluados</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {users.length} activos
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Manada Black Sheeps</div>
        </div>
      </div>

      {/* Tabla Desglosada con Fichas Individuales */}
      <div className="bg-[#120e24] border border-[#2d2255] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Desglose Individual y Descarga de Fichas
          </h3>
          <span className="text-xs text-slate-400">
            Periodo evaluado: <span className="text-purple-300 font-semibold">{periodLabel}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2d2255] text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2 font-semibold">RANK</th>
                <th className="pb-3 font-semibold">TIER DINÁMICO</th>
                <th className="pb-3 font-semibold">ASESOR</th>
                <th className="pb-3 font-semibold">DISCORD</th>
                <th className="pb-3 font-semibold">CIERRES</th>
                <th className="pb-3 font-semibold">VOLUMEN</th>
                <th className="pb-3 pr-2 text-right font-semibold">FICHA PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2255]/40">
              {users.map((u, i) => {
                const tier = getTierByRank(i + 1);
                const sales =
                  timePeriod === 'daily'
                    ? u.daily_sales || 0
                    : timePeriod === 'weekly'
                    ? u.weekly_sales || 0
                    : u.total_sales || 0;

                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-amber-400">
                      #{String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${tier.badgeBg} ${tier.border} ${tier.text}`}>
                        {tier.icon} {tier.name}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-white flex items-center gap-2">
                      <img
                        src={u.character_avatar_url || '/characters/01_sheep_alex/avatar.png'}
                        alt=""
                        className="w-6 h-6 rounded-full object-contain bg-black/40 border border-purple-500/30"
                      />
                      <span>{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.country?.split(' ')[0]}</span>
                    </td>
                    <td className="py-3 font-mono text-purple-300 text-[11px]">
                      {u.discord_tag}
                    </td>
                    <td className="py-3 text-slate-300">
                      {u.sales_count || 0} ventas
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400">
                      {formatCurrency(sales)}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => exportAgentPDF(u)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1a1435] border border-[#2d2255] text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-900/40 transition-all inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3 h-3" />
                        Ficha PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
