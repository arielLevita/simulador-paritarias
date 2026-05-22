export const calculateMonthTotals = (items, globalAntiguedad) => {
    // 1. Encontrar el Sueldo Básico (referencia para casi todo)
    const basicItem = items.find((i) => i.codigo === "1110");
    const basicAmount = basicItem ? basicItem.valor : 0;

    // 2. Calcular Haberes (Positivos)
    let totalHaberes = 0;
    const processedHaberes = items
        .filter((it) => it.tipo === "positivo")
        .map((item) => {
            let amount;

            // Lógica especial para Antigüedad (Código 1125)
            if (item.codigo === "1125") {
                amount = (globalAntiguedad / 100) * basicAmount;
            }
            // Porcentaje sobre básico (Zona, Recursos, etc.)
            else if (item.tipoCalculo === "porcentaje_basico") {
                amount = (item.valor / 100) * basicAmount;
            }
            // Montos fijos
            else {
                amount = item.valor;
            }

            totalHaberes += amount;
            return { ...item, calculatedAmount: amount };
        });

    // 3. Calcular Descuentos (Negativos)
    let totalDescuentos = 0;
    const processedDescuentos = items
        .filter((it) => it.tipo === "negativo")
        .map((item) => {
            let amount;

            // Porcentaje sobre básico
            if (item.tipoCalculo === "porcentaje_basico") {
                amount = (item.valor / 100) * basicAmount;
            }
            // Porcentaje sobre Total de Haberes (Jubilación, Seros, etc.)
            else if (item.tipoCalculo === "porcentaje_haberes") {
                amount = (item.valor / 100) * totalHaberes;
            }
            // Montos fijos (Seguros)
            else {
                amount = item.valor;
            }

            totalDescuentos += amount;
            return { ...item, calculatedAmount: amount };
        });

    return {
        items: [...processedHaberes, ...processedDescuentos],
        totalHaberes,
        totalDescuentos,
        neto: totalHaberes - totalDescuentos,
    };
};