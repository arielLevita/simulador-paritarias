import { calculateMonthTotals } from "../utils/calculations";

export const MonthCard = ({
    month,
    globalAntiguedad,
    onUpdateItem,
    onAddItem,
    onRemoveItem,
    onCopyFromPrevious
}) => {
    // Realizamos los cálculos dinámicos para este mes
    const { items, totalHaberes, totalDescuentos, neto } = calculateMonthTotals(
        month.items,
        globalAntiguedad
    );

    // Función para manejar la creación de un nuevo ítem
    const handleAddNewItem = () => {
        const descripcion = prompt("Nombre del nuevo concepto (ej: ADICIONAL JC):");
        if (!descripcion) return;

        const defaultCodigo = Date.now().toString().slice(-4);
        const codigo = prompt("Código (4 dígitos):", defaultCodigo);

        const tipo = confirm("¿Es un HABER (Suma)? \n'Aceptar' para HABER / 'Cancelar' para DESCUENTO")
            ? "positivo"
            : "negativo";

        // Actualizamos el prompt para incluir la nueva opción
        const msg = "Elija el tipo de cálculo:\n" +
            "1: fijo (Monto en $)\n" +
            "2: porcentaje_basico (% sobre Básico)\n" +
            "3: porcentaje_basico_jc (% sobre Básico JC x1.75)\n" +
            "4: porcentaje_haberes (% sobre Total Bruto)";

        const seleccion = prompt(msg, "1");

        let tipoCalculo = "fijo";
        if (seleccion === "2") tipoCalculo = "porcentaje_basico";
        if (seleccion === "3") tipoCalculo = "porcentaje_basico_jc";
        if (seleccion === "4") tipoCalculo = "porcentaje_haberes";

        onAddItem(month.id, {
            codigo: codigo || defaultCodigo,
            descripcion: descripcion.toUpperCase(),
            tipo,
            tipoCalculo,
            valor: 0
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-pink-200 flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
            {/* Cabecera del Mes */}
            <div className="bg-pink-600 p-3 flex justify-between items-center">
                <h2 className="text-white font-bold tracking-wide leading-none">{month.nombre}</h2>

                <div className="flex items-center">
                    <button
                        onClick={handleAddNewItem}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-[10px] font-bold py-1.5 px-3 rounded border border-white shadow-sm transition-colors"
                    >
                        + AGREGAR
                    </button>
                    {month.id > 0 && (
                        <button
                            onClick={() => onCopyFromPrevious(month.id)}
                            className="text-[9px] text-slate-300 hover:text-white mt-1 mx-2 no-underline transition-colors text-left"
                        >
                            <p className="text-center">Igualarar al</p>
                            <p className="text-center">mes anterior</p>
                        </button>
                    )}
                </div>
            </div>

            {/* Cuerpo: Tabla de Ítems */}
            <div className="py-4 px-2 grow overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] uppercase text-slate-400 border-b">
                            <th className="pb-2 px-2 font-medium">Cód</th>
                            <th className="pb-2 px-2 font-medium">Concepto</th>
                            <th className="pb-2 px-2 text-right font-medium">Valor/%</th>
                            <th className="pb-2 px-2 text-right font-medium">Importe</th>
                            <th className="pb-2 px-2 w-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.map((item, idx) => {
                            const isAntiguedad = item.codigo === "1125";
                            const isBasico = item.codigo === "1110";
                            const isPositive = item.tipo === "positivo";

                            return (
                                <tr key={`${item.codigo}-${idx}`} className="text-sm group hover:bg-slate-50">
                                    <td className="py-2 px-2 text-[10px] text-slate-400 font-mono">{item.codigo}</td>
                                    <td className="p-2">
                                        <div className="font-medium text-slate-700 text-xs leading-tight">
                                            {item.descripcion}
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">
                                        {isAntiguedad ? (
                                            <span className="text-pink-600 font-bold text-xs">{globalAntiguedad}%</span>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <input
                                                    type="number"
                                                    className="w-20 text-center border-slate-200 rounded text-xs p-1 focus:ring-1 focus:ring-blue-400 outline-none"
                                                    value={item.valor}
                                                    onChange={(e) => onUpdateItem(month.id, idx, {
                                                        ...item,
                                                        valor: parseFloat(e.target.value) || 0
                                                    })}
                                                />
                                                <span className="text-[8px] text-center text-slate-400 uppercase mt-0.5 mx-auto">
                                                    {item.tipoCalculo === "porcentaje_basico_jc" ? "% BÁSICO JC" : item.tipoCalculo.replace('_', ' ')}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className={`p-2 text-right font-mono font-bold text-xs ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {isPositive ? "" : "-"}{item.calculatedAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-2 text-right">
                                        {/* El Sueldo Básico y la Antigüedad no se deberían borrar para no romper la lógica */}
                                        {!isBasico && !isAntiguedad && (
                                            <button
                                                onClick={() => onRemoveItem(month.id, item.codigo)}
                                                className="text-slate-300 hover:text-rose-500 transition-colors ml-2 font-bold"
                                                title="Eliminar concepto"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pie: Totales y Neto */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                    <span>TOTAL HABERES (BRUTO)</span>
                    <span className="font-bold text-slate-700">
                        ${totalHaberes.toFixed(2).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                    <span>TOTAL DESCUENTOS</span>
                    <span className="font-bold text-slate-700">
                        -${totalDescuentos.toFixed(2).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-300 mt-2">
                    <span className="text-sm font-black text-slate-800">NETO A COBRAR:</span>
                    <span className="text-xl font-black text-pink-700">
                        ${neto.toFixed(2).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};