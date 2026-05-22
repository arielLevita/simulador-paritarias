import { useSalaryProjections } from "./hooks/useSalaryProjections";
import { MonthCard } from "./components/MonthCard";

function App() {
  const {
    months,
    porcentajeAntiguedad,
    setPorcentajeAntiguedad,
    updateItem,
    addItem,
    removeItem,
    copyFromPrevious
  } = useSalaryProjections();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Simulador Paritario</h1>
          <p className="text-slate-500">Ajuste de escalas y proyecciones de haberes</p>
        </header>

        {/* Panel de Configuración Global */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center gap-6">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-slate-400 mb-1">Configuración Global</label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Antigüedad acumulada:</span>
              <div className="relative">
                <input
                  type="number"
                  value={porcentajeAntiguedad}
                  onChange={(e) => setPorcentajeAntiguedad(parseFloat(e.target.value) || 0)}
                  className="w-24 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-blue-400">%</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400 italic max-w-xs">
            * El porcentaje de antigüedad se aplica automáticamente sobre el Sueldo Básico (1110) en todos los meses.
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {months.map((month) => (
            <MonthCard
              key={month.id}
              month={month}
              globalAntiguedad={porcentajeAntiguedad}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onCopyFromPrevious={copyFromPrevious}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;