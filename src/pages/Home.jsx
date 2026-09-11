import { useEffect, useState } from "react";
import { ChartColumn } from "lucide-react";

import DashboardLayout from "../Layouts/DashboardLayout";

function Home() {
  const [metrics, setMetrics] = useState({
    total: 0,
    pendientes: 0,
    en_curso: 0,
    hechos: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch("http://localhost:3001/metrics");

        if (!response.ok) {
          throw new Error("Error obteniendo métricas");
        }

        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error cargando métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    // Cargar métricas al entrar al Dashboard
    loadMetrics();

    // Actualizar métricas cada 5 segundos
    const interval = setInterval(loadMetrics, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="font-poppins flex items-center gap-2 text-2xl font-bold text-slate-800">
          <ChartColumn className="h-6 w-6 text-[#297AFF]" />
          Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total de notas
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {loading ? "..." : metrics.total}
          </p>
        </div>

        {/* Pendientes */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Pendientes
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-500">
            {loading ? "..." : metrics.pendientes}
          </p>
        </div>

        {/* En curso */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            En curso
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-500">
            {loading ? "..." : metrics.en_curso}
          </p>
        </div>

        {/* Hechas */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Hechas
          </p>

          <p className="mt-2 text-3xl font-bold text-green-500">
            {loading ? "..." : metrics.hechos}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Home;

