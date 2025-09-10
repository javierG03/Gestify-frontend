import { Gift, MousePointer, UserPlus, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react'
import { PieChart } from '@mui/x-charts';

const datosParticipacion = [
    { mes: 'diciembre', year: '2019', participaciones: 100 },
    { mes: 'enero', year: '2019', participaciones: 150 },
    { mes: 'febrero', year: '2019', participaciones: 400 },
    { mes: 'marzo', year: '2019', participaciones: 950 },
    { mes: 'abril', year: '2019', participaciones: 200 },
    { mes: 'mayo', year: '2019', participaciones: 150 },
    { mes: 'junio', year: '2019', participaciones: 250 },
    { mes: 'julio', year: '2019', participaciones: 300 },
    { mes: 'agosto', year: '2019', participaciones: 200 },
    { mes: 'septiembre', year: '2019', participaciones: 100 },
    { mes: 'octubre', year: '2019', participaciones: 150 },
    { mes: 'noviembre', year: '2019', participaciones: 200 },
    { mes: 'diciembre', year: '2019', participaciones: 180 },
    { mes: 'enero', year: '2020', participaciones: 220 },
    { mes: 'febrero', year: '2020', participaciones: 400 },
    { mes: 'marzo', year: '2020', participaciones: 650 },
    { mes: 'abril', year: '2020', participaciones: 500 },
    { mes: 'mayo', year: '2020', participaciones: 300 },
    { mes: 'junio', year: '2020', participaciones: 250 }
];
const desktopOS = [
    {
        label: 'Windows',
        value: 72.72,
    },
    {
        label: 'OS X',
        value: 16.38,
    },
    {
        label: 'Linux',
        value: 3.83,
    },
    {
        label: 'Chrome OS',
        value: 2.42,
    },
    {
        label: 'Other',
        value: 4.65,
    },
];

export const valueFormatter = (item) => `${item.value}%`;

const Reports = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calcular dimensiones y configuración óptimas según el tamaño de la pantalla
    const isMobile = windowWidth < 768;
    const chartWidth = isMobile ? windowWidth - 60 : 400; // Ajustar para padding en móvil

    // Configuración de la leyenda según el dispositivo
    const legendProps = isMobile ? {
        position: 'bottom',
        layout: 'row',
        itemStyle: { fontSize: 12 }
    } : {
        position: 'right',
        layout: 'column',
        itemStyle: { fontSize: 12 }
    };

    return (
        <div className="bg-gray-100 p-4 md:p-6 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Primera tarjeta - Participaciones */}
                <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <MousePointer className="w-6 md:w-8 h-6 md:h-8 text-gray-700" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800">23.839</h2>
                    <p className="text-gray-500 text-center mt-2">participaciones</p>
                </div>

                {/* Segunda tarjeta - Participantes */}
                <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="w-6 md:w-8 h-6 md:h-8 text-gray-700" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800">23.291</h2>
                    <p className="text-gray-500 text-center mt-2">participantes</p>
                </div>

                {/* Tercera tarjeta - Nuevos participantes */}
                <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserPlus className="w-6 md:w-8 h-6 md:h-8 text-gray-700" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800">17.728</h2>
                    <p className="text-gray-500 text-center mt-2">nuevos participantes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Tarjeta de campañas */}
                <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Gift className="w-6 md:w-8 h-6 md:h-8 text-gray-700" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800">138</h2>
                    <p className="text-gray-500 text-center mt-2">campañas</p>
                </div>

                {/* Gráfico de pastel */}
                <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Gráfica pastel</h3>
                    <div className="flex justify-center" style={{ width: '100%', height: isMobile ? '300px' : '200px' }}>
                        <PieChart
                            series={[
                                {
                                    data: desktopOS,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    valueFormatter,
                                    arcLabel: isMobile ? null : (item) => `${item.value}%`,
                                    arcLabelMinAngle: 10,
                                },
                            ]}
                            width={chartWidth}
                            height={isMobile ? 200 : 200}
                            margin={{
                                top: 10,
                                bottom: isMobile ? 40 : 10,
                                left: 10,
                                right: isMobile ? 10 : 80
                            }}
                            slotProps={{
                                legend: {
                                    direction: isMobile ? 'row' : 'column',
                                    position: {
                                        vertical: isMobile ? 'bottom' : 'middle',
                                        horizontal: isMobile ? 'middle' : 'right'
                                    },
                                    padding: 8,
                                    labelStyle: {
                                        fontSize: 12,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Gráfico de desempeño */}
            <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Desempeño</h3>
                <div className="h-60 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={datosParticipacion}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="mes"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: isMobile ? 8 : 10 }}
                                interval={isMobile ? 2 : 0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: isMobile ? 8 : 10 }}
                                domain={[0, 1000]}
                                ticks={[0, 500, 1000]}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="participaciones"
                                stroke="#4FD1C5"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports
