import type { FC } from "react"

interface SelectFilterProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: string[]
    placeholder?: string
}
export const SelectFilter: FC<SelectFilterProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Seleccionar'
}) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
            {label}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
            ))}
        </select>
    </div>
)