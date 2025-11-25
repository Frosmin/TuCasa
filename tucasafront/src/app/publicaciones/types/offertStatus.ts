
export const getStatusClasses = (status: string) => {
  switch (status) {
    case "publicado":
      return "bg-green-100 text-green-800";
    case "pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "borrador":
      return "bg-gray-100 text-gray-700";
    case "terminado":
      return "bg-blue-100 text-blue-800";
    case "cancelado":
      return "bg-red-100 text-red-800";
    case "rechazado":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "publicado":
      return "Publicado";
    case "pendiente":
      return "En Revisión";
    case "borrador":
      return "Borrador";
    case "terminado":
      return "Terminado";
    case "cancelado":
      return "Cancelado";
    case "rechazado":
      return "Rechazado";
    default:
      return status;
  }
};
export type ColorName = "gray" | "yellow" | "green" | "blue" | "red" | "purple";

export const colorClasses: Record<
  ColorName,
  { active: string; inactive: string }
> = {
  gray: {
    active: "bg-gray-600 text-white",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-600 hover:text-white",
  },
  yellow: {
    active: "bg-yellow-600 text-white",
    inactive: "bg-yellow-100 text-yellow-700 hover:bg-yellow-600 hover:text-white",
  },
  green: {
    active: "bg-green-600 text-white",
    inactive: "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white",
  },
  blue: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white",
  },
  red: {
    active: "bg-red-600 text-white",
    inactive: "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white",
  },
  purple: {
    active: "bg-purple-600 text-white",
    inactive: "bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white",
  },
};
