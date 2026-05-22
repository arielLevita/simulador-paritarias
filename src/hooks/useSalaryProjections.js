import { useState, useEffect } from "react";

// Datos iniciales (se mantienen igual que los proporcionados)
const INITIAL_ITEMS = [
    { codigo: "1110", descripcion: "SUELDO BASICO", tipo: "positivo", tipoCalculo: "fijo", valor: 313349.89 },
    { codigo: "1125", descripcion: "ANTIGÜEDAD", tipo: "positivo", tipoCalculo: "porcentaje_basico", valor: 45 },
    { codigo: "1154", descripcion: "ZONA PATAGONICA C/APTES", tipo: "positivo", tipoCalculo: "porcentaje_basico", valor: 125 },
    { codigo: "1160", descripcion: "RECURSOS MATERIALES", tipo: "positivo", tipoCalculo: "porcentaje_basico", valor: 20 },
    { codigo: "1168", descripcion: "ADIC. PROFESIONALIDAD DOCENTE", tipo: "positivo", tipoCalculo: "porcentaje_basico", valor: 25 },
    { codigo: "1402", descripcion: "JUBILACION", tipo: "negativo", tipoCalculo: "porcentaje_haberes", valor: 16 },
    { codigo: "1404", descripcion: "S.E.R.O.S. TITULAR", tipo: "negativo", tipoCalculo: "porcentaje_haberes", valor: 6.5 },
    { codigo: "1424", descripcion: "SEG.VIDA COL.OBLIG", tipo: "negativo", tipoCalculo: "fijo", valor: 3000 },
    { codigo: "1430", descripcion: "SEG.VIDA COL.FAMILIAR", tipo: "negativo", tipoCalculo: "fijo", valor: 2460 },
    { codigo: "1462", descripcion: "SEROS - SEGURO TRASPLANTE", tipo: "negativo", tipoCalculo: "porcentaje_haberes", valor: 0.5 },
];

export const useSalaryProjections = () => {
    const [months, setMonths] = useState(() => {
        const saved = localStorage.getItem("salary_months_v3");
        if (saved) return JSON.parse(saved);
        return Array.from({ length: 6 }, (_, i) => ({
            id: i,
            nombre: i === 0 ? "Mes Actual" : `Mes +${i}`,
            items: JSON.parse(JSON.stringify(INITIAL_ITEMS)),
        }));
    });

    const [porcentajeAntiguedad, setPorcentajeAntiguedad] = useState(() => {
        const saved = localStorage.getItem("salary_antiguedad_v3");
        return saved ? parseFloat(saved) : 45;
    });

    useEffect(() => {
        localStorage.setItem("salary_months_v3", JSON.stringify(months));
        localStorage.setItem("salary_antiguedad_v3", porcentajeAntiguedad.toString());
    }, [months, porcentajeAntiguedad]);

    // UPDATE: Uso de .map para garantizar inmutabilidad
    const updateItem = (monthIndex, itemIndex, updatedItem) => {
        setMonths((prevMonths) =>
            prevMonths.map((month, mIdx) => {
                if (mIdx < monthIndex) return month; // Meses anteriores no cambian

                // Buscamos el ítem por código en este mes (por si el orden cambió)
                const newItems = month.items.map((item) =>
                    item.codigo === updatedItem.codigo ? { ...updatedItem } : item
                );

                return { ...month, items: newItems };
            })
        );
    };

    // ADD: Creamos una copia nueva del array de items para cada mes afectado
    const addItem = (monthIndex, newItem) => {
        setMonths((prevMonths) =>
            prevMonths.map((month, mIdx) => {
                if (mIdx < monthIndex) return month;

                // Evitar duplicados por código en el mismo mes si se dispara dos veces
                if (month.items.some(it => it.codigo === newItem.codigo)) return month;

                return {
                    ...month,
                    items: [...month.items, { ...newItem }]
                };
            })
        );
    };

    // REMOVE: .filter crea automáticamente un nuevo array
    const removeItem = (monthIndex, itemCodigo) => {
        setMonths((prevMonths) =>
            prevMonths.map((month, mIdx) => {
                if (mIdx < monthIndex) return month;
                return {
                    ...month,
                    items: month.items.filter((it) => it.codigo !== itemCodigo)
                };
            })
        );
    };

    const copyFromPrevious = (monthIndex) => {
        if (monthIndex === 0) return; // No se puede copiar nada al primer mes

        setMonths((prevMonths) => {
            // Obtenemos una copia profunda de los ítems del mes anterior (N-1)
            const previousItems = JSON.parse(JSON.stringify(prevMonths[monthIndex - 1].items));

            return prevMonths.map((month, mIdx) => {
                // Los meses anteriores al seleccionado no cambian
                if (mIdx < monthIndex) return month;

                // El mes seleccionado y todos los futuros ahora tienen los ítems del mes anterior al seleccionado
                return {
                    ...month,
                    items: JSON.parse(JSON.stringify(previousItems))
                };
            });
        });
    };

    return { months, porcentajeAntiguedad, setPorcentajeAntiguedad, updateItem, addItem, removeItem, copyFromPrevious };
};