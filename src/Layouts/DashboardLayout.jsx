import Header from "../components/Header";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        <div className="mx-auto w-full max-w-[1400px] p-8">
          {children}
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;