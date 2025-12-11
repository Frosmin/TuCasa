  "use client";

  import { useState, useRef, useEffect } from "react";
  import { Bell } from "lucide-react";
  import * as StompJs from "@stomp/stompjs";
  import SockJS from "sockjs-client";

  export default function Notificaciones({ clienteId }: { clienteId: number }) {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<string[]>([]);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Conexión a WebSocket
    useEffect(() => {
      const socket = new SockJS("http://localhost:8000/tucasabackend/ws");
      const stompClient = StompJs.Stomp.over(socket);

      stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/notificaciones/${clienteId}`, (message) => {
          const data = JSON.parse(message.body);
          setNotifs(prev => [data.mensaje, ...prev]); // Agrega al inicio
        });
      });

      return () => stompClient.disconnect();
    }, [clienteId]);

    return (
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-gray-200 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <Bell className="w-5 h-5 text-gray-600 hover:text-white transition-colors duration-300" />
        </button>

        {notifs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifs.length}
          </span>
        )}

        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
            <p className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notificaciones</p>
            <div className="max-h-64 overflow-y-auto">
              {notifs.length > 0 ? (
                notifs.map((n, i) => (
                  <div key={i} className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm border-b last:border-0">
                    {n}
                  </div>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">Sin notificaciones.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
