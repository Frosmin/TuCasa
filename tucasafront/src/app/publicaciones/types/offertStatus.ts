export const getStatusClasses = (status: string) => {
  switch (status) {
    case "ACTIVA":
      return "bg-green-100 text-green-800";
    case "EN REVISION":
      return "bg-yellow-100 text-yellow-800";
    case "PAUSADA":
      return "bg-gray-100 text-gray-700";
    case "FINALIZADA":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};
