export const calculateMonthTotals = (items, globalAntiguedad) => {
    // 1. Encontrar el Sueldo Básico (referencia base)
    const basicItem = items.find((i) => i.codigo === "1110");
    const basicAmount = basicItem ? basicItem.valor : 0;

    // NUEVO: Definir la base de Jornada Completa (JC)
    const basicJC = basicAmount * 1.75;

    // 2. Calcular Haberes (Positivos)
    let totalHaberes = 0;
    const processedHaberes = items
        .filter((it) => it.tipo === "positivo")
        .map((item) => {
            let amount;

            if (item.codigo === "1125") {
                amount = (globalAntiguedad / 100) * basicAmount;
            }
            else if (item.tipoCalculo === "porcentaje_basico") {
                amount = (item.valor / 100) * basicAmount;
            }
            // NUEVO: Tipo de cálculo para Jornada Completa
            else if (item.tipoCalculo === "porcentaje_basico_jc") {
                amount = (item.valor / 100) * basicJC;
            }
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

            if (item.tipoCalculo === "porcentaje_basico") {
                amount = (item.valor / 100) * basicAmount;
            }
            else if (item.tipoCalculo === "porcentaje_basico_jc") {
                amount = (item.valor / 100) * basicJC;
            }
            else if (item.tipoCalculo === "porcentaje_haberes") {
                amount = (item.valor / 100) * totalHaberes;
            }
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