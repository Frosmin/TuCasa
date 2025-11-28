import { useAuth } from "@/context/AuthContext";
import { Phone, User } from "lucide-react";
import NumInput from "./NumInput";

interface MiContactoProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

const MiContacto = ({ setValue, value }: MiContactoProps) => {
  const { user } = useAuth();
  return (
    <div>
      <div className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm`}>
        <span className="text-xs text-gray-500 mb-1">Nombre Completo</span>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <span>{user?.nombre + " " + user?.apellido}</span>
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Celular*
      </label>
      <NumInput setValue={setValue} value={value} />
    </div>
  );
};

export default MiContacto;
