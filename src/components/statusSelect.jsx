import { Check, ChevronDown } from "lucide-react";

function StatusSelect({ status, onChange, open, onToggle }) {
  const options = [
    {
      value: "Pendiente",
      label: "Pendiente",
      color: "bg-yellow-400",
    },
    {
      value: "En_curso",
      label: "En curso",
      color: "bg-blue-500",
    },
    {
      value: "Hecho",
      label: "Hecho",
      color: "bg-green-500",
    },
  ];

  const selected = options.find(
    (option) => option.value === status
  );

  return (
    <div className="relative">
      {/* SELECTOR */}

      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-slate-300"
      >
        <span
          className={`h-2 w-2 rounded-full ${selected.color}`}
        />

        {selected.label}

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* OPCIONES */}

      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${option.color}`}
                />

                {option.label}
              </span>

              {status === option.value && (
                <Check
                  size={14}
                  className="text-blue-500"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusSelect;