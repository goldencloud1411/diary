# HARU · 하루 플래너 v2

Aplicación personal de organización diaria con estética coreana minimalista.

## Novedades v2

- Registro diario con calendario mensual y tracker.
- Historial de salud, coreano, lectura, tareas completadas, finanzas y notas.
- Coreano diario con un banco ampliado de más de 50 palabras y más de 40 estructuras gramaticales.
- Racha y últimos 7 días de estudio de coreano.
- Biblioteca con libros y audiolibros.
- Portadas elegidas desde la galería y guardadas en el almacenamiento privado de Haru.
- Progreso de libros por páginas o porcentaje.
- Progreso de audiolibros por tiempo o porcentaje.
- Historial de sesiones de lectura/escucha.
- Migración automática de los datos de Haru v1.

## Actualizar desde Haru v1

El proyecto conserva el mismo identificador Android:

`com.harudaily.planner`

La versión Android ahora usa `versionCode: 2`, por lo que el APK está preparado para instalarse como actualización sobre v1 siempre que Android reconozca la misma firma.

1. Sube el contenido de esta carpeta al mismo repositorio de GitHub, reemplazando los archivos anteriores.
2. Asegúrate de que también quede actualizado `.github/workflows/build-android.yml`.
3. Ve a **Actions > Build Android APK**.
4. Espera a que la ejecución termine con check verde.
5. Descarga el artifact **HaruPlanner-Android-v2**.
6. Extrae `HaruPlanner-v2.apk` e instálalo en el celular.
7. Si Android muestra **Actualizar**, elige esa opción: tus datos locales deberían conservarse.

> Importante: no desinstales Haru v1 antes de intentar la actualización, porque al desinstalar Android borra el almacenamiento local de la app.

Si Android rechaza la actualización por una firma distinta, no desinstales todavía si tienes información importante: conserva la v1 y revisa primero el proceso de firma para evitar perder datos.

## Compilación

El workflow incluido genera una APK `release` autónoma; no necesita Metro ni una computadora para abrirse.

## Datos y privacidad

Los datos se guardan localmente mediante AsyncStorage. Las portadas se copian al directorio privado de documentos de la aplicación. La app no usa una nube ni envía tus registros a un servidor.

## Desarrollo local

```bash
npm install
npx expo start
```

Para probar con Expo Go, escanea el QR que muestra Expo.
