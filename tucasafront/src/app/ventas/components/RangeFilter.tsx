import type { FC } from "react"

interface RangeFilterProps {
    label: string
    minValue: number
    maxValue: number
    onMinChange: (value: number) => void
    onMaxChange: (value: number) => void
    placeholder?: { min: string; max: string }
}
export const RangeFilter: FC<RangeFilterProps> = ({
    label,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    placeholder = { min: 'Mín', max: 'Máx' }
}) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
            {label}
        </label>
        <div className="space-y-2">
            <input
                type="number"
                placeholder={placeholder.min}
                value={minValue}
                onChange={(e) => onMinChange(Number(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="number"
                placeholder={placeholder.max}
                value={maxValue}
                onChange={(e) => onMaxChange(Number(e.target.value) || Infinity)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
)