# HARU · 하루 플래너

Aplicación móvil personal para organizar el día con una estética coreana minimalista: marfil, negro, beige, líneas simples y pequeños detalles en hangul.

## Qué incluye esta primera versión

- **Hoy:** resumen del día, progreso general, accesos rápidos, agua, palabra coreana y nota diaria.
- **Pendientes:** tareas de Trabajo, Estudio y Personal; prioridad, completar y eliminar.
- **Salud:** agua, horas de sueño, movimiento, ánimo y marcador genérico de medicación/suplemento.
- **Coreano diario:** vocabulario + gramática + ejemplo + traducción; cambia automáticamente cada día.
- **Finanzas:** ingresos, gastos, balance mensual y categorías.
- **Lectura:** libros, páginas totales y progreso de lectura.
- **Persistencia local:** los datos se conservan en el dispositivo mediante AsyncStorage.

> Esta es una app de organización personal. Los apartados de salud son únicamente de registro y no sustituyen atención o indicaciones médicas.

---

# Cómo subirla a GitHub y sacar el APK sin instalar Android Studio

## 1. Crear el repositorio

1. En GitHub crea un repositorio nuevo, por ejemplo `haru-planner`.
2. Descomprime el ZIP de este proyecto en tu computadora.
3. Sube **el contenido de la carpeta**, no el ZIP como un solo archivo.
4. Asegúrate de conservar la carpeta oculta `.github/workflows/`.
5. Haz el commit a la rama `main`.

## 2. Construir el APK desde GitHub

El proyecto ya trae el workflow:

`.github/workflows/build-android.yml`

Al subirlo a `main`, GitHub Actions intentará compilar automáticamente el APK. También puedes ejecutarlo manualmente:

1. Abre tu repositorio.
2. Ve a **Actions**.
3. Entra a **Build Android APK**.
4. Pulsa **Run workflow**.
5. Espera a que aparezca el check verde.

## 3. Descargar la aplicación al celular

1. Abre la ejecución terminada en GitHub Actions.
2. Baja hasta **Artifacts**.
3. Descarga `HaruPlanner-Android`.
4. GitHub descargará un ZIP; descomprímelo.
5. Dentro estará `HaruPlanner.apk`.
6. Pásalo o descárgalo en tu Android y ábrelo para instalarlo.
7. Android puede pedir autorización para **instalar apps de origen desconocido** desde el navegador o gestor de archivos que uses.

El APK generado por este workflow es un **debug APK instalable**, pensado para uso personal y pruebas. Para publicarla en Google Play después conviene configurar firma de release, nombre de paquete definitivo, política de privacidad, íconos finales y versión de producción.

---

# Ejecutarla localmente para editarla

Necesitas Node.js compatible con la versión de Expo del proyecto.

```bash
npm install
npx expo start
```

Para generar el proyecto Android local:

```bash
npx expo prebuild --platform android
```

---

# Estructura principal

```text
HaruPlanner/
├─ App.js
├─ app.json
├─ package.json
├─ assets/
│  ├─ icon.png
│  ├─ adaptive-icon.png
│  └─ splash.png
├─ src/
│  ├─ components/
│  ├─ data/korean.js
│  ├─ screens/
│  ├─ store/AppContext.js
│  ├─ storage.js
│  └─ theme.js
└─ .github/workflows/build-android.yml
```

# Dónde personalizar

- Colores y estética: `src/theme.js`
- Vocabulario y gramática: `src/data/korean.js`
- Pantalla inicial: `src/screens/HomeScreen.js`
- Tareas: `src/screens/TasksScreen.js`
- Salud: `src/screens/HealthScreen.js`
- Finanzas: `src/screens/FinanceScreen.js`
- Lectura: `src/screens/ReadingScreen.js`
- Navegación: `App.js`

## Ideas para una v2

Calendario semanal, recordatorios/notificaciones, objetivos y hábitos, estadísticas mensuales, copias de seguridad, exportación CSV/PDF, listas recurrentes, sincronización entre dispositivos y más contenido de coreano.
