export const SalaryItemRow = ({ item, onUpdate, onDelete }) => {
    const isPositive = item.tipo === "positivo";

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 text-sm">
            <td className="py-2 px-1 text-gray-500">{item.codigo}</td>
            <td className="py-2 px-1">
                <input
                    className="w-full bg-transparent border-none focus:ring-0 p-0"
                    value={item.descripcion}
                    onChange={(e) => onUpdate({ ...item, descripcion: e.target.value })}
                />
            </td>
            <td className="py-2 px-1">
                <div className="flex items-center">
                    <input
                        type="number"
                        className="w-20 p-1 border rounded text-right"
                        value={item.valor}
                        onChange={(e) => onUpdate({ ...item, valor: parseFloat(e.target.value) || 0 })}
                    />
                    <span className="ml-1 text-xs text-gray-400">
                        {item.tipoCalculo === "fijo" ? "$" : "%"}
                    </span>
                </div>
            </td>
            <td className={`py-2 px-1 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? "" : "-"}${item.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </td>
            <td className="py-2 px-1 text-right">
                <button
                    onClick={() => onDelete(item.codigo)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                >
                    &times;
                </button>
            </td>
        </tr>
    );
};