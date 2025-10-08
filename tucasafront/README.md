# 🏡 TuCasaFront — Frontend de la Plataforma

Proyecto **Next.js + TypeScript** inicializado con **Turbopack**, configurado con **TailwindCSS**, **ESLint**, **Prettier** y **Husky** para mantener un entorno limpio, eficiente y colaborativo.

---

## 🚀 Stack Tecnológico

| Herramienta | Descripción |
|--------------|-------------|
| **Next.js 15** | Framework React para SSR, SSG y App Router moderno |
| **React 19** | Librería de interfaces UI |
| **TypeScript 5** | Tipado estático para mayor robustez |
| **TailwindCSS 4** | Framework CSS utilitario para estilos rápidos y responsivos |
| **ESLint + Prettier** | Estilo y formateo de código unificado |
| **Husky + lint-staged** | Validaciones automáticas antes de hacer commit |
| **PNPM** | Gestor de paquetes rápido y aislado |

---

## 🧰 Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

- **Node.js ≥ 18**
- **PNPM ≥ 9**
- **Git**

Puedes verificarlo con:

```bash
node -v
pnpm -v
git --version
````

---

## ⚙️ Instalación del Proyecto

1. **Clona el repositorio**

```bash
git clone git@github.com:Frosmin/TuCasa.git
cd TuCasa/tucasafront
```

2. **Instala las dependencias**

```bash
pnpm install
```

3. **Inicia el servidor de desarrollo**

```bash
pnpm dev
```

4. Abre en el navegador:
   👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Scripts Disponibles

| Comando       | Descripción                                          |
| ------------- | ---------------------------------------------------- |
| `pnpm dev`    | Ejecuta el servidor en modo desarrollo con Turbopack |
| `pnpm build`  | Genera la build optimizada para producción           |
| `pnpm start`  | Inicia la aplicación compilada                       |
| `pnpm lint`   | Analiza el código con ESLint                         |
| `pnpm format` | Formatea el código con Prettier                      |

*(si no existe el script `format`, puedes añadirlo fácilmente al `package.json`)*

```json
"scripts": {
  "format": "prettier --write ."
}
```

---

## 🎨 Configuración de TailwindCSS

TailwindCSS ya está configurado en:

* `postcss.config.mjs`
* `tailwind.config.js` *(o `tailwind.config.mjs` si lo prefieres con módulos)*
* `src/app/globals.css`

Para usarlo, simplemente agrega clases utilitarias a tus componentes:

```tsx
export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Hola, TuCasa 🏡</h1>
    </main>
  );
}
```

---

## 🧹 Estructura de Carpetas

```
src/
├── app/                # Rutas, layouts y páginas (App Router)
│   ├── layout.tsx
│   └── page.tsx
├── components/         # Componentes reutilizables
├── features/           # Funcionalidades o módulos específicos (auth, booking, etc.)
├── hooks/              # Custom hooks
├── lib/                # Funciones, utilidades y configs
├── services/           # Lógica de conexión con APIs
├── styles/             # Archivos CSS o temas adicionales
└── types/              # Tipos globales de TypeScript
```

---

## 🧠 Buenas Prácticas

### 💬 Commits claros y consistentes

Usa mensajes cortos y descriptivos:

```
✨ feat: agregar componente Navbar
🐛 fix: corregir error en layout.tsx
🧹 chore: limpiar imports no usados
```

### 🧾 Formato y lint automáticos

Antes de cada commit, **Husky** ejecuta `lint-staged` para validar y formatear el código:

```bash
pnpm prepare
npx husky add .husky/pre-commit "pnpm lint-staged"
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env.local` (no lo subas a Git) siguiendo el ejemplo:

```bash
cp .env.example .env.local
```

Y dentro define tus claves:

```env
NEXT_PUBLIC_API_URL=https://api.tucasa.com
NEXT_PUBLIC_ENV=development
```

Acceso desde el código:

```ts
process.env.NEXT_PUBLIC_API_URL
```

---

## 🌍 Deploy en Producción

### Vercel 

1. Inicia sesión en [vercel.com](https://vercel.com)
2. Importa tu repositorio
3. Configura las variables `.env`
4. ¡Listo! Vercel detectará automáticamente Next.js y hará el deploy.

---

## 🧾 Licencia

Este proyecto está bajo la licencia **MIT**.
Creado con ❤️ por el equipo de desarrollo de **TuCasa**.

---

## 👨‍💻 Autor

**Johan Beltrán**
*Estudiante de Ingeniería*

---

## ✅ Checklist Post-Inicialización

| Tarea                          |      Estado     |
| ------------------------------ | :-------------: |
| Inicializar Git                |        ✅        |
| Configurar ESLint + Prettier   |        ✅        |
| Configurar Husky + lint-staged |        ✅        |
| Integrar TailwindCSS           |        ✅        |
| Crear estructura base `/src`   |        ✅        |
| Agregar `.env.example`         | ☐ *(pendiente)* |

---

