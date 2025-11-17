interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FilterSelect({ value, onChange }: Props) {
  return (
    <div className="w-5xs">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" w-full px-6 py-3 border border-blue-500 rounded-lg bg-blue-50 text-blue-700 font-medium shadow-md 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option className="text-gray-700" value="">Todos</option>
        <option className="text-gray-700" value="pendiente">Pendiente</option>
        <option className="text-gray-700" value="aprovada">Aprobada</option>
        <option className="text-gray-700" value="rechazada">Rechazada</option>
      </select>
    </div>
  );
}
