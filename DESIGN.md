# Design System — elmony / rendi

## Filosofía

La interfaz está inspirada en el diseño de apps nativas de iOS (App Store, Lock Screen) y plataformas como Crunchyroll. El objetivo es que se sienta como una **web app premium**, no como una página de finanzas tradicional. Todo se apoya en tres pilares:

- **Liquid glass** — capas translúcidas con blur que dejan ver el fondo.
- **Progressive blur** — las imágenes no se cortan, se difuminan hacia el contenido.
- **Datos como protagonistas** — las tasas y números son el elemento visual más grande.

---

## Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| Acento principal | `#00d992` | Tasas, CTAs, bordes activos, iconos |
| Acento suave | `#8bf5cf` | Tasas secundarias (neto mensual), variante clara |
| Fondo base | `#090d10` | Color de fondo del sitio |
| Superficie | `bg-background/40` | Cards y paneles con transparencia |
| Texto primario | `text-foreground` / `white` | Títulos, valores |
| Texto secundario | `text-muted-foreground` / `white/60` | Labels, tipos, subtítulos |
| Peligro | `#ef4444` | Retención en la fuente, alertas |
| Advertencia | `amber-500` | Límites superados |

---

## Liquid Glass — patrón de superficie

Toda superficie interactiva usa esta combinación:

```
bg-background/40 backdrop-blur-xl border border-white/5
```

### Variantes

| Uso | Clases |
|-----|--------|
| Panel principal | `bg-background/40 backdrop-blur-xl border border-white/5 rounded-2xl` |
| Card hover | `hover:border-[#00d992]/30 hover:bg-background/60` |
| Píldora stat | `bg-white/10 backdrop-blur-md border border-white/15 rounded-full` |
| Info box | `border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm` |

### Orbs ambientales

Las secciones principales tienen orbs de color difuso para crear profundidad:

```tsx
<div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#00d992]/15 blur-3xl" />
<div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#00d992]/10 blur-3xl" />
```

---

## Progressive Blur

El componente `ProgressiveBlur` (`components/ui/progressive-blur.tsx`) crea el efecto de desenfoque progresivo típico de iOS. Se compone de 8 capas de `backdrop-filter: blur()` con máscaras escalonadas — de `0.5px` a `64px`.

**No es un degradado oscuro.** La imagen pierde nitidez gradualmente; el texto no flota sobre un rectángulo negro sino sobre la propia imagen desenfocada.

Para legibilidad se añade una capa de oscurecimiento encima del blur:

```tsx
<ProgressiveBlur position="bottom" height="55%" />
<div style={{ background: "linear-gradient(to top, rgba(9,13,16,0.85) 0%, ... rgba(9,13,16,0) 65%)" }} />
```

---

## Cards de Carrusel

### Card de Banco (portrait)
- **Dimensiones:** 260–280px ancho × 430–460px alto
- **Estructura:** imagen full-bleed → progressive blur → contenido superpuesto
- **Contenido:** logo (40px, rounded-xl) + nombre + check verde si actualizado + tipo de cuenta + píldoras de tasa EA y neto mensual + botón circular blanco → verde en hover

### Card de CDT (landscape)
- **Dimensiones:** 280–300px ancho × 160px alto
- **Estructura:** idéntica a la de banco pero horizontal
- **Contenido:** logo pequeño (28px) + nombre + duración en meses + tasa EA grande + botón "Aplicar" (⚡ verde, llena la calculadora) + flecha al banco
- **Comportamiento:** click en la card navega al banco; botón Aplicar hace `stopPropagation` y pre-llena la calculadora CDT

---

## Tipografía

| Elemento | Clases |
|----------|--------|
| Título de página | `text-3xl md:text-5xl font-bold text-[#00d992] tracking-tight` |
| Título de sección | `text-lg font-semibold text-foreground` |
| Tasa principal (hero) | `text-4xl md:text-5xl font-black text-[#00d992] tracking-tight` |
| Tasa en card | `text-3xl font-black text-[#00d992] leading-none` |
| Label de stat | `text-[10px] uppercase tracking-wider text-muted-foreground` |
| Nombre de banco | `font-semibold text-sm` / `font-semibold text-base` |

---

## Botones

| Tipo | Clases |
|------|--------|
| Navegación (volver, links) | `rounded-full bg-background/80 backdrop-blur-sm border border-border h-10 px-3` |
| CTA primario (visitar sitio) | `rounded-full bg-primary text-primary-foreground font-semibold` |
| Acción verde | `bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] rounded-xl` hover: `bg-[#00d992] text-black` |
| Botón circular | `w-9 h-9 rounded-full bg-white text-black` hover: `bg-[#00d992]` |
| Aplicar CDT | `rounded-full bg-[#00d992] text-black text-[10px] font-bold` con icono `<Zap>` |

---

## Filas de Stats (App Store style)

Las métricas se presentan en una fila dividida con `divide-x`:

```tsx
<div className="grid grid-cols-3 md:divide-x divide-border rounded-2xl border border-border bg-card overflow-hidden">
  <StatItem label="Tasa EA" value="9.25%" />
  <StatItem label="Neto mensual" value="0.74%" />
  <StatItem label="Tipo" value="Cajita de ahorros" />
</div>
```

Cada celda: `flex flex-col items-center justify-center px-4 py-5 text-center`.

---

## Animaciones (Framer Motion)

Patrón estándar de entrada por sección:

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.X }}
```

Listas con stagger:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
```

---

## Layout

| Contexto | Clases |
|----------|--------|
| Contenedor de página central | `max-w-5xl mx-auto` |
| Padding lateral | `px-4 xl:px-28` |
| Grid calculadora | `lg:grid-cols-[1fr_1.4fr]` (inputs más estrecho, resultados más ancho) |
| Grid de cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4` |

---

## Slugs de banco

El patrón de URL para páginas de banco es:

```ts
bank.name.toLowerCase().replace(/ /g, "-")
// "Lulo Bank" → "lulo-bank"
// "Banco Finandina" → "banco-finandina"
```

Siempre con `encodeURIComponent()` al construir el `href`.
