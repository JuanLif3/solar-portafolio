import type { ReactNode } from 'react'
import {
    ResponsiveContainer,
    BarChart, Bar,
    Line,
    ComposedChart,
    ScatterChart, Scatter, ZAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import '../styles/PowerBICharts.css'

/* ============================================================
 *  PALETA POWER BI OFICIAL
 * ============================================================ */
const PBI = {
    blue:     '#118DFF',
    blueDark: '#12239E',
    orange:   '#E66C37',
    grid:     '#E1E1E1',
    axis:     '#605E5C',
    text:     '#252423',
    muted:    '#605E5C',
}

const FONT = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"

const TOOLTIP_STYLE = {
    background: '#FFFFFF',
    border: '1px solid #E1E1E1',
    borderRadius: '2px',
    padding: '8px 12px',
    fontFamily: FONT,
    fontSize: '12px',
    color: '#252423',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
} as const

/* ============================================================
 *  WRAPPER — Card estilo Power BI
 * ============================================================ */
function PBIChartCard({
                          title,
                          subtitle,
                          children,
                      }: {
    title: string
    subtitle?: string
    children: ReactNode
}) {
    return (
        <div className="pbi-chart">
            <header className="pbi-chart__head">
                <h3 className="pbi-chart__title">{title}</h3>
                {subtitle && <p className="pbi-chart__subtitle">{subtitle}</p>}
            </header>
            <div className="pbi-chart__body">{children}</div>
        </div>
    )
}

/* ============================================================
 *  A1 · Amenaza vs Impacto (Scatter / bubble)
 * ============================================================ */
const SCATTER_DATA = [
    { comuna: 'Chimbarongo', ha: 3125, delta: 31.32, conc: 0.31, perfil: 'Crítica' },
    { comuna: 'San Fernando', ha: 1268, delta: 40.05, conc: 0.29, perfil: 'Crítica' },
    { comuna: 'Santa Cruz', ha: 246, delta: 62.30, conc: 0.21, perfil: 'Estándar' },
    { comuna: 'Lolol', ha: 228, delta: 84.44, conc: 0.25, perfil: 'Estándar' },
    { comuna: 'Chepica', ha: 166, delta: 7.45, conc: 0.19, perfil: 'Estándar' },
    { comuna: 'Peralillo', ha: 151, delta: 122.54, conc: 0.22, perfil: 'Estándar' },
    { comuna: 'Pumanque', ha: 98, delta: -10.42, conc: 0.19, perfil: 'Estándar' },
    { comuna: 'Palmilla', ha: 10, delta: 87.01, conc: 0.22, perfil: 'Estándar' },
    { comuna: 'Nancagua', ha: 6, delta: 40.13, conc: 0.25, perfil: 'Estándar' },
    { comuna: 'Placilla', ha: 1, delta: 63.52, conc: 0.22, perfil: 'Estándar' },
]

export function ChartAmenazaImpacto() {
    const criticas = SCATTER_DATA.filter((d) => d.perfil === 'Crítica')
    const estandar = SCATTER_DATA.filter((d) => d.perfil === 'Estándar')

    return (
        <PBIChartCard
            title="Amenaza vs Impacto"
            subtitle="Relación entre hectáreas quemadas y crecimiento de ventas."
        >
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} strokeDasharray="0" />
                    <XAxis
                        type="number"
                        dataKey="ha"
                        name="Hectáreas quemadas"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        domain={[0, 3500]}
                    />
                    <YAxis
                        type="number"
                        dataKey="delta"
                        name="Crecimiento"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} %`}
                        domain={[-20, 140]}
                    />
                    <ZAxis type="number" dataKey="conc" range={[80, 800]} />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                            if (!active || !payload?.[0]) return null
                            const p = payload[0].payload as typeof SCATTER_DATA[number]
                            return (
                                <div style={TOOLTIP_STYLE}>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.comuna}</div>
                                    <div>Hectáreas: {p.ha.toLocaleString('es-CL')}</div>
                                    <div>Crecimiento: {p.delta} %</div>
                                    <div>Concentración: {p.conc}</div>
                                </div>
                            )
                        }}
                    />
                    <Scatter name="Comuna crítica" data={criticas} fill={PBI.blue} />
                    <Scatter name="Comuna estándar" data={estandar} fill={PBI.blueDark} />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{
                            fontFamily: FONT,
                            fontSize: 12,
                            color: PBI.text,
                            paddingTop: 8,
                        }}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  A2 · Ventas Totales UF por comuna
 * ============================================================ */
const VENTAS_UF = [
    { comuna: 'San Fernando', uf: 48.5 },
    { comuna: 'Santa Cruz', uf: 25.5 },
    { comuna: 'Chimbarongo', uf: 19.2 },
    { comuna: 'Nancagua', uf: 13.0 },
    { comuna: 'Palmilla', uf: 9.2 },
    { comuna: 'Chepica', uf: 5.2 },
    { comuna: 'Placilla', uf: 5.2 },
    { comuna: 'Lolol', uf: 3.2 },
    { comuna: 'Peralillo', uf: 3.2 },
    { comuna: 'Pumanque', uf: 0.8 },
]

export function ChartVentasUF() {
    return (
        <PBIChartCard title="Ventas Totales UF" subtitle="por comuna">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={VENTAS_UF} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="comuna"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 10, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        angle={-35}
                        textAnchor="end"
                        height={70}
                        interval={0}
                    />
                    <YAxis
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mill.`}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(v) => [`${Number(v)} mill. UF`, 'Ventas']}
                    />
                    <Bar dataKey="uf" fill={PBI.blue} />
                </BarChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  A3 · Empresas y trabajadores por año
 * ============================================================ */
const EMP_TRAB = [
    { anio: '2018', trabajadores: 49.5, empresas: 4780 },
    { anio: '2019', trabajadores: 55.5, empresas: 5050 },
    { anio: '2020', trabajadores: 56.5, empresas: 5040 },
    { anio: '2021', trabajadores: 48.5, empresas: 5390 },
]

export function ChartEmpresasTrabajadores() {
    return (
        <PBIChartCard
            title="Empresas y trabajadores por año"
            subtitle="Cantidad de empresas y trabajadores formales por año."
        >
            <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={EMP_TRAB} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="anio"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mil`}
                        domain={[46, 58]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        domain={[4700, 5400]}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(v, name) => {
                            if (name === 'trabajadores') return [`${Number(v)} mil`, 'Trabajadores Sector Agro']
                            return [`${Number(v)}`, 'Empresas Sector Agro']
                        }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="trabajadores"
                        stroke={PBI.blue}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: PBI.blue, strokeWidth: 0 }}
                        name="Trabajadores Sector Agro"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="empresas"
                        stroke={PBI.blueDark}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: PBI.blueDark, strokeWidth: 0 }}
                        name="Empresas Sector Agro"
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: PBI.text, paddingTop: 8 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  B1 · Hectáreas quemadas vs Ventas Sector Agro
 * ============================================================ */
const HA_VENTAS = [
    { anio: '2018', ha: 200, ventas: 16 },
    { anio: '2019', ha: 400, ventas: 17.5 },
    { anio: '2020', ha: 1200, ventas: 21 },
    { anio: '2021', ha: 3500, ventas: 24 },
]

export function ChartHectareasVentas() {
    return (
        <PBIChartCard
            title="T.Hectareas quemadas y Ventas Sector Agro"
            subtitle="por año"
        >
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={HA_VENTAS} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="anio"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        domain={[0, 3500]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mill.`}
                        domain={[16, 24]}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(v, name) => {
                            if (name === 'ha') return [`${Number(v)}`, 'T.Hectareas quemadas']
                            return [`${Number(v)} mill.`, 'Ventas Sector Agro']
                        }}
                    />
                    <Bar
                        yAxisId="left"
                        dataKey="ha"
                        fill={PBI.blue}
                        name="T.Hectareas quemadas"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="ventas"
                        stroke={PBI.blueDark}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: PBI.blueDark, strokeWidth: 0 }}
                        name="Ventas Sector Agro"
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: PBI.text, paddingTop: 8 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  B2 · Vegetación, Plantaciones y Ha_Agricolas (100% apilado)
 * ============================================================ */
const VEGETACION = [
    { comuna: 'Chimbarongo', vegetacion: 99, plantaciones: 1, agricolas: 0 },
    { comuna: 'San Fernando', vegetacion: 35, plantaciones: 60, agricolas: 5 },
    { comuna: 'Santa Cruz', vegetacion: 78, plantaciones: 20, agricolas: 2 },
    { comuna: 'Lolol', vegetacion: 80, plantaciones: 18, agricolas: 2 },
    { comuna: 'Chepica', vegetacion: 95, plantaciones: 3, agricolas: 2 },
    { comuna: 'Peralillo', vegetacion: 65, plantaciones: 20, agricolas: 15 },
    { comuna: 'Pumanque', vegetacion: 92, plantaciones: 5, agricolas: 3 },
    { comuna: 'Palmilla', vegetacion: 75, plantaciones: 23, agricolas: 2 },
    { comuna: 'Nancagua', vegetacion: 88, plantaciones: 10, agricolas: 2 },
    { comuna: 'Placilla', vegetacion: 90, plantaciones: 8, agricolas: 2 },
]

export function ChartVegetacion() {
    return (
        <PBIChartCard
            title="Vegetación, Plantaciones y Ha_Agricolas"
            subtitle="por comuna"
        >
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={VEGETACION} margin={{ top: 10, right: 10, bottom: 60, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="comuna"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 9.5, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        angle={-35}
                        textAnchor="end"
                        height={70}
                        interval={0}
                    />
                    <YAxis
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(v) => `${Number(v)}%`}
                    />
                    <Bar dataKey="vegetacion" stackId="a" fill={PBI.blue} name="Vegetación" />
                    <Bar dataKey="plantaciones" stackId="a" fill={PBI.blueDark} name="Plantaciones" />
                    <Bar dataKey="agricolas" stackId="a" fill={PBI.orange} name="Ha_Agricolas" />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 11, color: PBI.text, paddingTop: 8 }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  B3 · Precipitación Anual mm y Ventas Sector Agro
 * ============================================================ */
const PRECIP_VENTAS = [
    { anio: '2018', precip: 4800, ventas: 16 },
    { anio: '2019', precip: 3500, ventas: 17.5 },
    { anio: '2020', precip: 5500, ventas: 21 },
    { anio: '2021', precip: 4500, ventas: 24 },
]

export function ChartPrecipitacionVentas() {
    return (
        <PBIChartCard
            title="Precipitación Anual mm y Ventas Sector Agro"
            subtitle="por año"
        >
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={PRECIP_VENTAS} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="anio"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v / 1000} mil`}
                        domain={[0, 6000]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mill.`}
                        domain={[16, 25]}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(v, name) => {
                            if (name === 'precip') return [`${Number(v)} mm`, 'Precipitación Anual mm']
                            return [`${Number(v)} mill.`, 'Ventas Sector Agro']
                        }}
                    />
                    <Bar
                        yAxisId="left"
                        dataKey="precip"
                        fill={PBI.blue}
                        name="Precipitación Anual mm"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="ventas"
                        stroke={PBI.blueDark}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: PBI.blueDark, strokeWidth: 0 }}
                        name="Ventas Sector Agro"
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: PBI.text, paddingTop: 8 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  C1 · Empresas Cereales y Empresas Apicultura
 * ============================================================ */
const EMP_CEREALES_APIC = [
    { anio: '2018', cereales: 1560, apicultura: 186 },
    { anio: '2019', cereales: 1600, apicultura: 190 },
    { anio: '2020', cereales: 1420, apicultura: 190 },
    { anio: '2021', cereales: 1460, apicultura: 192 },
]

export function ChartEmpresasCerealesApicultura() {
    return (
        <PBIChartCard
            title="Empresas Cereales y Empresas Apicultura"
            subtitle="por año"
        >
            <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={EMP_CEREALES_APIC} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="anio"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        domain={[1400, 1650]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        domain={[185, 193]}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="cereales"
                        stroke={PBI.blue}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: PBI.blue, strokeWidth: 0 }}
                        name="Empresas Cereales"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="apicultura"
                        stroke={PBI.blueDark}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: PBI.blueDark, strokeWidth: 0 }}
                        name="Empresas Apicultura"
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: PBI.text, paddingTop: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  C2 · Ventas Cereales y Ventas Apicultura
 * ============================================================ */
const VENTAS_CEREALES_APIC = [
    { anio: '2018', cereales: 2.72, apicultura: 185 },
    { anio: '2019', cereales: 2.42, apicultura: 130 },
    { anio: '2020', cereales: 2.38, apicultura: 125 },
    { anio: '2021', cereales: 2.48, apicultura: 180 },
]

export function ChartVentasCerealesApicultura() {
    return (
        <PBIChartCard
            title="Ventas Cereales (Trigo y Maiz) y Ventas Apicultura"
            subtitle="por año"
        >
            <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={VENTAS_CEREALES_APIC} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="anio"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mill.`}
                        domain={[2.3, 2.8]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mil`}
                        domain={[100, 200]}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="cereales"
                        stroke={PBI.blue}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: PBI.blue, strokeWidth: 0 }}
                        name="Ventas Cereales (Trigo y Maiz)"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="apicultura"
                        stroke={PBI.blueDark}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: PBI.blueDark, strokeWidth: 0 }}
                        name="Ventas Apicultura"
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: PBI.text, paddingTop: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  C3 · Trabajadores cereales y Trabajadores Apicultura
 * ============================================================ */
const TRAB_CEREALES_APIC = [
    { anio: '2018', cereales: 3.7, apicultura: 78 },
    { anio: '2019', cereales: 3.0, apicultura: 66 },
    { anio: '2020', cereales: 1.9, apicultura: 60 },
    { anio: '2021', cereales: 2.4, apicultura: 65 },
]

export function ChartTrabajadoresCerealesApicultura() {
    return (
        <PBIChartCard
            title="Trabajadores cereales y Trabajadores Apicultura"
            subtitle="por año"
        >
            <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={TRAB_CEREALES_APIC} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke={PBI.grid} vertical={false} />
                    <XAxis
                        dataKey="anio"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        tickFormatter={(v) => `${v} mil`}
                        domain={[1.5, 4]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={PBI.axis}
                        tick={{ fill: PBI.muted, fontSize: 11, fontFamily: FONT }}
                        tickLine={false}
                        axisLine={{ stroke: PBI.axis }}
                        domain={[55, 85]}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="cereales"
                        stroke={PBI.blue}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: PBI.blue, strokeWidth: 0 }}
                        name="Trabajadores cereales"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="apicultura"
                        stroke={PBI.blueDark}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: PBI.blueDark, strokeWidth: 0 }}
                        name="Trabajadores Apicultura"
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        wrapperStyle={{ fontFamily: FONT, fontSize: 12, color: PBI.text, paddingTop: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </PBIChartCard>
    )
}

/* ============================================================
 *  GRUPO C — stack vertical
 * ============================================================ */
export function PowerBIChartsGroupC() {
    return (
        <div className="pbi-group-c">
            <ChartEmpresasCerealesApicultura />
            <ChartVentasCerealesApicultura />
            <ChartTrabajadoresCerealesApicultura />
        </div>
    )
}

/* ============================================================
 *  A4 · Mapa de Calor · Heladas por comuna y año
 * ============================================================ */
const HELADAS_DATA = [
    { comuna: 'Chepica',      y2018: 9,  y2019: 2, y2020: 1, y2021: 3 },
    { comuna: 'Chimbarongo',  y2018: 13, y2019: 5, y2020: 6, y2021: 7 },
    { comuna: 'Lolol',        y2018: 1,  y2019: 1, y2020: 0, y2021: 0 },
    { comuna: 'Nancagua',     y2018: 12, y2019: 3, y2020: 4, y2021: 7 },
    { comuna: 'Palmilla',     y2018: 7,  y2019: 1, y2020: 1, y2021: 3 },
    { comuna: 'Peralillo',    y2018: 7,  y2019: 3, y2020: 1, y2021: 2 },
    { comuna: 'Placilla',     y2018: 6,  y2019: 1, y2020: 2, y2021: 2 },
    { comuna: 'Pumanque',     y2018: 11, y2019: 5, y2020: 2, y2021: 5 },
    { comuna: 'San Fernando', y2018: 11, y2019: 4, y2020: 4, y2021: 3 },
    { comuna: 'Santa Cruz',   y2018: 7,  y2019: 1, y2020: 1, y2021: 3 },
]

const YEARS = ['y2018', 'y2019', 'y2020', 'y2021'] as const
const YEAR_LABELS = ['2018', '2019', '2020', '2021']
const MAX_HEAT = 13

function heatColor(value: number): string {
    if (value === 0) return 'rgba(240, 240, 240, 1)'
    const t = value / MAX_HEAT
    // Gradiente amarillo → naranja → rojo → rojo oscuro
    const r = 255
    const g = Math.round(237 - t * 180)
    const b = Math.round(160 - t * 150)
    return `rgb(${r}, ${g}, ${b})`
}

function heatTextColor(value: number): string {
    return value >= 8 ? '#FFFFFF' : '#252423'
}

export function ChartHeladasHeatmap() {
    return (
        <PBIChartCard
            title="Mapa de Calor Espacio-Temporal"
            subtitle="Severidad de heladas por comuna (2018-2021)"
        >
            <div className="pbi-heatmap">
                <div className="pbi-heatmap__grid">
                    {/* Header row */}
                    <div className="pbi-heatmap__corner" />
                    {YEAR_LABELS.map((y) => (
                        <div key={y} className="pbi-heatmap__year">{y}</div>
                    ))}

                    {/* Data rows */}
                    {HELADAS_DATA.map((row) => (
                        <>
                            <div key={row.comuna} className="pbi-heatmap__label">
                                {row.comuna}
                            </div>
                            {YEARS.map((y) => (
                                <div
                                    key={`${row.comuna}-${y}`}
                                    className="pbi-heatmap__cell"
                                    style={{
                                        background: heatColor(row[y]),
                                        color: heatTextColor(row[y]),
                                    }}
                                    title={`${row.comuna} · ${y.replace('y', '')} · ${row[y]} días`}
                                >
                                    {row[y]}
                                </div>
                            ))}
                        </>
                    ))}
                </div>

                {/* Color scale */}
                <div className="pbi-heatmap__scale">
                    <span className="pbi-heatmap__scale-label">0</span>
                    <div className="pbi-heatmap__scale-bar" />
                    <span className="pbi-heatmap__scale-label">{MAX_HEAT}</span>
                </div>
            </div>
        </PBIChartCard>
    )
}