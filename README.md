# Hielo Santiago — Sistema de Pedidos y Logística

## Deploy en Vercel (recomendado)

### Opción A — Desde GitHub (más fácil)
1. Sube esta carpeta a un repositorio de GitHub
2. Ve a https://vercel.com → New Project
3. Importa tu repositorio
4. Vercel detecta automáticamente que es React (Create React App)
5. Click en **Deploy** — listo en ~2 minutos

### Opción B — Vercel CLI
```bash
npm install -g vercel
cd hielo-santiago
vercel
```

### Opción C — Correr localmente
```bash
cd hielo-santiago
npm install
npm start
```
Abre http://localhost:3000

---

## Acceso al sistema

**Portal cliente:** usa el código Drivin del cliente (Ej: `FUKA`, `camino`, `Lamesa`)

**Panel admin:** usa la clave `admin`

---

## Descarga Excel Drivin

El botón **⬇ Excel** en cada vuelta del Panel Operaciones descarga un archivo `.xls`
en el formato exacto que requiere Drivin, con las columnas:
- Col A: Código de despacho
- Col B: Kilos
- Col F: Código de dirección
- Col AA: Unidades del artículo
- Col AB: Código artículo
- Col AC: Descripción
- Para pedidos manuales: Col G, H, J (dirección), M (comuna), P (país)
