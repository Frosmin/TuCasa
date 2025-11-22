"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyFavorites } from "@/api/favorito.service";
import { OfertaCard } from "@/components/OfertaCard";
import { Loader2 } from "lucide-react";
import type { Oferta } from "@/models/Oferta";
import LoadingSpinner from '@/components/Loading';

interface FavoritoResponse {
  id: number;
  oferta: Oferta;
  fechaCreacion: string;
}

export default function FavoritosPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [favoritos, setFavoritos] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token && typeof window !== "undefined" && localStorage.getItem("token") === null) {
       router.push("/login");
    }
  }, [token, router]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const res = await getMyFavorites(token);
        if (res.data) {
          setFavoritos(res.data);
        }
      } catch (err) {
        console.error("Error cargando favoritos:", err);
        setError("No se pudieron cargar tus favoritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [token]);

  if (loading) {
    return (
      <LoadingSpinner 
        message="Cargando favoritos..." 
        fullScreen={true} 
      />
    );
  }

  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Mis Favoritos</h1>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {favoritos.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-xl">Aún no tienes propiedades guardadas.</p>
            <a href="/ventas" className="mt-4 text-blue-600 hover:underline">
              Explorar ofertas
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoritos.map((oferta) => (
              <div key={oferta.id} className="h-full">
                <OfertaCard oferta={oferta} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}