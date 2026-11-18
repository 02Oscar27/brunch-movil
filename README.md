# Brunch Móvil ☕🍳

Aplicación móvil desarrollada con **Ionic, Angular, TypeScript y Capacitor**, orientada a ofrecer una experiencia sencilla para consultar un menú de brunch, agregar productos a un carrito, realizar una reserva y consultar la ubicación actual del dispositivo.

## 📱 Descripción del proyecto

Brunch Móvil reúne en una sola aplicación las funciones principales de un restaurante:

- Consultar los productos disponibles en el menú.
- Buscar platos por nombre, descripción o ingredientes.
- Filtrar productos por categoría.
- Agregar productos al carrito y modificar sus cantidades.
- Consultar el valor total del pedido.
- Guardar el contenido del carrito en el almacenamiento local.
- Registrar una reserva indicando datos de contacto, número de personas y fecha y hora.
- Consultar la última reserva guardada.
- Obtener la ubicación actual del dispositivo, previa autorización del usuario.

La aplicación utiliza componentes de Ionic para la interfaz y Capacitor para acceder a funcionalidades nativas del dispositivo.

## ✨ Funcionalidades

### 1. Inicio

La pantalla de inicio presenta el nombre del restaurante, una descripción, el horario de atención y accesos al menú y al formulario de reservas.

También incluye la función **Mi ubicación**, que solicita permiso para consultar la ubicación del dispositivo. Cuando se obtiene correctamente, muestra la latitud, longitud y precisión reportada por el dispositivo.

### 2. Menú de productos

El menú obtiene recetas desde la API pública [DummyJSON Recipes](https://dummyjson.com/recipes?limit=30).

La información recibida se adapta al modelo de productos de la aplicación. El servicio realiza, entre otras, estas operaciones:

- Traduce nombres e ingredientes mediante diccionarios de equivalencias.
- Determina una categoría para cada receta: **Desayunos**, **Saludables** o **Especiales**.
- Genera una descripción a partir de la categoría y de los ingredientes.
- Asigna precios de demostración definidos en el proyecto; estos precios no proceden de la API.
- Utiliza un menú local de respaldo si la consulta falla o no devuelve recetas.

El usuario puede buscar por nombre, descripción o ingredientes, filtrar por categoría y solicitar la actualización del menú.

### 3. Carrito de compras

El carrito permite:

- Agregar productos.
- Aumentar o disminuir las cantidades.
- Eliminar un producto específico.
- Vaciar el carrito con una confirmación.
- Consultar la cantidad total de unidades y el valor de la compra.
- Simular la finalización de la compra.

El contenido se conserva mediante `localStorage`, por lo que puede recuperarse al volver a abrir la aplicación en el mismo almacenamiento del dispositivo o navegador.

> **Nota:** la opción «Realizar compra» es una simulación. Actualmente no procesa pagos ni se conecta con una pasarela de pago.

### 4. Reservas

El formulario permite registrar:

- Nombre completo.
- Número de teléfono.
- Número de personas.
- Fecha y hora de la reserva.

Antes de guardar, la aplicación valida que los campos estén completos, que el nombre tenga un formato válido, que el teléfono tenga 10 dígitos y comience por 3, que el número de personas esté entre 1 y 8 y que la fecha sea futura.

Los horarios permitidos están configurados entre las 8:00 a. m. y las 3:30 p. m., en intervalos de 30 minutos.

Las reservas se guardan localmente con **Capacitor Preferences**. La función de consulta muestra la última reserva guardada; no se utiliza actualmente un servidor o base de datos remota para administrar reservas.

## 🧰 Tecnologías y herramientas

| Tecnología | Uso en el proyecto |
|---|---|
| [Angular](https://angular.dev/) | Estructura de la aplicación, componentes, servicios e inyección de dependencias. |
| [Ionic Angular](https://ionicframework.com/docs/angular/overview) | Componentes de interfaz y navegación con pestañas. |
| [TypeScript](https://www.typescriptlang.org/) | Lenguaje utilizado para la lógica de la aplicación y los modelos. |
| [Capacitor](https://capacitorjs.com/) | Integración y ejecución de la aplicación en plataformas nativas. |
| [RxJS](https://rxjs.dev/) | Manejo de solicitudes HTTP y flujos asíncronos. |
| [DummyJSON](https://dummyjson.com/) | API externa utilizada para obtener recetas. |
| Capacitor Geolocation | Acceso a la ubicación del dispositivo con autorización. |
| Capacitor Preferences | Almacenamiento local de la última reserva. |
| `localStorage` | Persistencia local de los productos del carrito. |
| Ionicons | Iconos de la interfaz. |

## 📂 Estructura principal del proyecto

```text
brunch-movil/
├── android/                       # Proyecto nativo Android de Capacitor
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── product-card/       # Tarjeta reutilizable de productos
│   │   │       ├── cardcomponents.ts
│   │   │       ├── cardcomponents.html
│   │   │       └── cardcomponents.scss
│   │   ├── models/
│   │   │   ├── product-model.ts    # Modelos Product y CartItem
│   │   │   └── reserva.model.ts    # Modelo Reserva
│   │   ├── pages/
│   │   │   └── cart/               # Pantalla del carrito
│   │   │       ├── cart-page.ts
│   │   │       ├── cart-page.html
│   │   │       └── cart-page.scss
│   │   ├── services/
│   │   │   ├── product-service.ts  # API, transformación y menú local
│   │   │   ├── cart-service.ts     # Estado y operaciones del carrito
│   │   │   └── reservas.service.ts # Guardado y consulta de reservas
│   │   ├── tab1/                   # Pantalla de inicio y geolocalización
│   │   ├── tab2/                   # Menú, búsqueda y filtros
│   │   ├── tab3/                   # Formulario de reservas
│   │   ├── tabs/                   # Barra de navegación inferior
│   │   ├── app.component.*
│   │   └── app.routes.ts           # Rutas principales
│   ├── assets/                     # Recursos gráficos
│   ├── theme/                      # Variables y estilos del tema
│   ├── global.scss                 # Estilos globales
│   └── main.ts                     # Configuración e inicio de Angular
├── angular.json
├── capacitor.config.ts
├── ionic.config.json
├── package.json
└── README.md
```

## ⚙️ Requisitos previos

Antes de instalar el proyecto, se recomienda tener:

- [Node.js](https://nodejs.org/) y npm instalados.
- Git, si se va a clonar el repositorio.
- Un editor de código, por ejemplo [Visual Studio Code](https://code.visualstudio.com/).
- Para ejecutar en Android: Android Studio, Android SDK y un dispositivo o emulador configurado.

El proyecto utiliza Angular 22, Ionic Angular 9 y Capacitor 8. Consulta las versiones de dependencias declaradas en `package.json` y utiliza una versión de Node.js compatible con Angular 22.

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd brunch-movil
```

Reemplaza `<URL_DEL_REPOSITORIO>` por la dirección real del repositorio.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en el navegador

```bash
npm start
```

Abre en el navegador la dirección local que indique Angular en la terminal (normalmente `http://localhost:4200`).

### 4. Compilar la aplicación

```bash
npm run build
```

La compilación web se genera en el directorio `www` configurado para Capacitor.

## 📲 Ejecutar en Android

El proyecto incluye la plataforma Android de Capacitor. Después de compilar la aplicación web, sincroniza los cambios con el proyecto nativo:

```bash
npm run build
npx cap sync android
```

Para abrir el proyecto en Android Studio:

```bash
npx cap open android
```

Desde Android Studio se puede seleccionar un emulador o un dispositivo físico autorizado para ejecutar la aplicación.

Si Android ya existe dentro del proyecto, no es necesario ejecutar nuevamente `npx cap add android`. Para actualizar los archivos web y los plugins nativos se utiliza `npx cap sync android`.

### Probar en un dispositivo físico

1. Activa las opciones de desarrollador y la depuración USB en el dispositivo Android.
2. Conecta el teléfono al computador mediante un cable USB que permita transferencia de datos.
3. Acepta en el teléfono la autorización de depuración USB para ese computador.
4. Comprueba la conexión con:

```bash
adb devices
```

5. Abre el proyecto con Android Studio y ejecuta la aplicación en el dispositivo.

## 🧠 Organización de la lógica

La aplicación separa las responsabilidades principales:

- **Modelos:** definen la estructura de los productos, elementos del carrito y reservas.
- **ProductService:** consulta la API, adapta las recetas al modelo interno y proporciona el menú local de respaldo.
- **Tab2Page:** carga el menú y controla la búsqueda y los filtros.
- **ProductCardComponent:** recibe un producto y emite el evento para agregarlo al carrito.
- **CartService:** centraliza los productos seleccionados, las cantidades, los totales y la persistencia del carrito.
- **CartPage:** permite consultar y modificar el pedido y simular su finalización.
- **Tab3Page:** valida los datos del formulario de reserva y gestiona la confirmación.
- **ReservasService:** guarda y recupera la última reserva mediante Capacitor Preferences.
- **Tab1Page:** presenta la información inicial y obtiene la ubicación del dispositivo mediante Capacitor Geolocation.

## 🧪 Scripts disponibles

Los siguientes comandos están definidos en `package.json`:

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo de Angular. |
| `npm run build` | Compila la aplicación. |
| `npm run watch` | Compila en modo de observación para desarrollo. |
| `npm run lint` | Ejecuta ESLint, comprobación de tipos E2E y Prettier. |
| `npm run lint:fix` | Aplica correcciones de ESLint y formato de Prettier. |
| `npm test` | Ejecuta las pruebas unitarias y E2E configuradas. |
| `npm run test:unit` | Ejecuta las pruebas unitarias sin modo watch. |
| `npm run test:e2e` | Ejecuta las pruebas de extremo a extremo con Playwright. |

## 🔐 Permisos y almacenamiento

- **Ubicación:** la aplicación solicita permiso para acceder a la ubicación del dispositivo. El usuario puede rechazarlo; en ese caso se muestra un mensaje y no se presentan coordenadas.
- **Carrito:** se guarda en `localStorage` usando la clave `brunch-movil-cart-v1`.
- **Reservas:** se guarda la última reserva en Capacitor Preferences usando la clave `ultimaReserva`.
- **Conexión:** el menú intenta consultar DummyJSON. Si la consulta falla o no contiene recetas, utiliza los productos locales de respaldo.

## ⚠️ Alcance actual

- Los precios del menú obtenido desde la API son valores de demostración definidos en el código.
- La compra no procesa pagos reales.
- Las reservas se almacenan localmente y la consulta recupera únicamente la última reserva guardada en ese dispositivo; no hay sincronización con un servidor.
- El funcionamiento del menú remoto requiere conexión a internet. El menú local permite mostrar productos cuando la API no está disponible.

## 👥 Contribución

Para trabajar en el proyecto:

1. Crea una rama para tu funcionalidad o corrección.
2. Realiza los cambios y prueba la aplicación.
3. Ejecuta la compilación para comprobar que no existan errores.
4. Envía los cambios a GitHub y crea un Pull Request para integrarlos con la rama principal.

## 📄 Licencia

No se especifica una licencia en la configuración actual del proyecto. Si se va a publicar o distribuir el repositorio, se recomienda definir una licencia de acuerdo con las condiciones del equipo o de la institución.
