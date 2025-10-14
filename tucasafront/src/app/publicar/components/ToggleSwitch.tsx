// publicar/components/ToggleSwitch.tsx

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  color?: 'blue' | 'purple';
}

export default function ToggleSwitch({ label, checked, onChange, color = 'blue' }: ToggleSwitchProps) {
  const colorClass = color === 'blue' ? 'bg-blue-600' : 'bg-purple-600';

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? colorClass : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}