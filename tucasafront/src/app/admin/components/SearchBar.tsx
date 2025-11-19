import { Search } from "lucide-react"
import type { FC } from "react"
interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => (
    <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
            type="text"
            placeholder="Buscar por nombre, correo..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
)