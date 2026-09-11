import Header from "../components/Header";
import Canvas from "../components/Canvas";

function Tablero() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        <Canvas />
      </main>
    </div>
  );
}

export default Tablero;