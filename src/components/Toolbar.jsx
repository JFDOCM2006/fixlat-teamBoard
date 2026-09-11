import { Plus } from "lucide-react";

function Toolbar({ onAddCard }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <button
        onClick={onAddCard}
        className="flex items-center gap-2 rounded-lg bg-[#007DFC] px-4 py-2 text-sm font-medium text-white"
      >
        <Plus size={18} />
        Nueva tarjeta
      </button>
    </div>
  );
}

export default Toolbar;