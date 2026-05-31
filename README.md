# 🎂 Momentos Divertidos – Postres y Regalos Dulces

Tienda web completa (MVP) para emprendimiento de postres artesanales. Incluye tienda pública con carrito + checkout WhatsApp y panel de administración completo.

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TailwindCSS + Framer Motion |
| Backend | Node.js + Express.js |
| Base de datos | MongoDB + Mongoose |
| Autenticación | JWT + Bcrypt |
| Imágenes | Multer |

---

## 📋 Requisitos previos

- Node.js **v18+**
- MongoDB (local o MongoDB Atlas)
- npm o yarn

---

## 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd momentos-divertidos
```

### 2. Configurar variables de entorno del backend

```bash
cd backend
cp .env.example .env
```

Edita `.env` con tus valores:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/momentos-divertidos
JWT_SECRET=cambia_esta_clave_por_una_muy_segura_aleatoria
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> 💡 Para MongoDB Atlas: usa la URI de conexión que te proporciona Atlas (incluye usuario y contraseña).

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 5. Ejecutar el seed inicial

Esto crea el usuario administrador y la configuración inicial:

```bash
cd backend
npm run seed
```

Salida esperada:
```
✅ Conectado a MongoDB
✅ Usuario admin creado: admin@momentos.com / admin123
✅ Configuración inicial creada
🎂 Seed completado exitosamente!
```

> ⚠️ **IMPORTANTE:** Cambia la contraseña del admin después del primer inicio de sesión.

---

## ▶️ Comandos de desarrollo

### Backend (puerto 5000)
```bash
cd backend
npm run dev
```

### Frontend (puerto 5173)
```bash
cd frontend
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🔑 Acceso al panel de administración

```
URL: http://localhost:5173/admin/login
Email: admin@momentos.com
Contraseña: admin123
```

---

## 📦 Estructura del proyecto

```
momentos-divertidos/
├── backend/
│   ├── config/         → db.js, multer.js
│   ├── controllers/    → auth, products, orders, config
│   ├── middleware/     → auth, upload, errorHandler
│   ├── models/         → User, Product, Order, Config
│   ├── routes/         → rutas de la API
│   ├── uploads/        → imágenes subidas (servidas estáticamente)
│   ├── utils/          → generateToken, seed
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── admin/      → páginas del panel admin
│       ├── components/ → componentes reutilizables
│       ├── contexts/   → CartContext, AuthContext
│       ├── layouts/    → MainLayout, AdminLayout
│       ├── pages/      → Home, Catalog, ProductDetail, Checkout...
│       ├── services/   → api.js, productService, orderService
│       ├── styles/     → global.css con TailwindCSS
│       └── utils/      → formatters, whatsapp
└── README.md
```

---

## 🏭 Producción

### Backend
```bash
cd backend
npm start
```

### Frontend (generar build)
```bash
cd frontend
npm run build
# Los archivos estáticos quedan en /frontend/dist
```

> Para producción, sirve el build de frontend con Nginx o en plataformas como Vercel/Netlify, y despliega el backend en Railway, Render, o tu propio VPS.

---

## 🔗 API Endpoints principales

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Login admin | ❌ |
| GET | `/api/auth/me` | Perfil autenticado | ✅ |
| GET | `/api/products` | Listar productos (público) | ❌ |
| GET | `/api/products/:id` | Detalle producto | ❌ |
| POST | `/api/products` | Crear producto | ✅ |
| PUT | `/api/products/:id` | Actualizar producto | ✅ |
| DELETE | `/api/products/:id` | Eliminar producto | ✅ |
| POST | `/api/orders` | Crear pedido | ❌ |
| GET | `/api/orders` | Listar pedidos | ✅ |
| PUT | `/api/orders/:id/status` | Cambiar estado | ✅ |
| GET | `/api/config` | Obtener configuración | ❌ |
| PUT | `/api/config` | Actualizar configuración | ✅ |

---

## 🎨 Identidad visual

| Color | Hex | Uso |
|-------|-----|-----|
| Rosa pastel | `#F9E4E0` | Fondos suaves |
| Crema vainilla | `#FFF9F0` | Cards, contenedores |
| Chocolate | `#6B4E3D` | Textos, botones secundarios |
| Dorado | `#D4AF37` | Acentos, CTA, hover |

**Tipografías:** Playfair Display (títulos) + Poppins (cuerpo)

---

## 📱 Flujo de pedido (WhatsApp)

1. Cliente agrega productos al carrito
2. Va a Checkout, completa nombre y dirección
3. Hace clic en "Confirmar pedido"
4. El backend guarda el pedido en MongoDB
5. Se genera un enlace `wa.me/` con el resumen completo
6. Se abre WhatsApp automáticamente
7. Cliente envía el mensaje al negocio
8. El admin confirma y actualiza el estado desde el panel

---

## 🐛 Solución de problemas comunes

**Error de CORS:** Verifica que `FRONTEND_URL` en `.env` coincida con la URL del frontend.

**MongoDB no conecta:** Asegúrate de que MongoDB está corriendo (`mongod`) o que la URI de Atlas es correcta.

**Imágenes no cargan:** Las imágenes se sirven desde `/uploads/`. Verifica que el servidor backend esté corriendo.

**JWT expirado:** El token dura 7 días. Si expira, vuelve a iniciar sesión en `/admin/login`.
