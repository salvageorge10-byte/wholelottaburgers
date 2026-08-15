# Whole Lotta Burgers — sitio web

Demo comercial desarrollada por **ZEK.WEBS** para Whole Lotta Burgers (Plaza Italia 61, La Plata).

HTML, CSS y JavaScript sin dependencias ni build. Dos páginas. Se sube tal cual a cualquier
hosting estático (Netlify, Vercel, GitHub Pages, Hostinger) arrastrando la carpeta.

```
index.html    landing: hero, historia, teaser de menú, destacados, local
menu.html     la carta completa (solo para ver: foto, descripción, precio)
css/styles.css
js/main.js
assets/
  local-tall.webp · local.webp · local-sm.webp   foto del frente, fondo del hero
  logo.webp · favicon.svg · apple-touch-icon.png · og.jpg
  menu/                                            fotos de producto en WebP
```

Peso total: **3,4 MB**. Las fotos originales pesaban 215 MB en PNG.

---

## Dos páginas, no una

La carta completa (39 productos) vivía entera en el home y quedaba chica e ilegible compitiendo
con el resto del contenido. Ahora:

- **`index.html`** — landing. Muestra un teaser del menú (franja de 3 fotos grandes a todo el
  ancho, separada del texto por una línea perforada tipo entrada de recital) que lleva a la
  carta completa. El resto de las secciones (historia, franja de horarios, Moby Dick, galería,
  Instagram, local) se quedaron ahí.
- **`menu.html`** — la carta entera, con los mismos cuatro filtros (Burgers, Minutas, Bebidas,
  Postres). Cada burger es ahora una tarjeta grande con foto y precio — antes eran filas
  chicas de lista, ahora son del mismo tamaño que las tarjetas de bebidas y postres.

La navegación (header y footer) enlaza entre páginas: en `menu.html`, "Fotos", "Historia",
"Galería" y "El local" apuntan a `index.html#sección`; "Menú" es la única que se queda en la
página actual.

---

## La foto del hero

El arte que pasó el cliente traía el texto «WHOLE LOTTA BURGERS» quemado sobre la imagen y un
balde de papas fritas con aspecto artificial (foto generada por IA, se nota en la forma
pareja y gruesa de las papas). Los dos problemas se resolvieron con el mismo recorte: se
sacó una franja de la zona limpia de la imagen que deja fuera de cuadro tanto el texto como
el balde, y protagoniza solo la hamburguesa — que sí se ve bien.

| Archivo | Medida | Cuándo se usa |
|---|---|---|
| `local-tall.webp` | 325 × 1456 | Hasta 899 px. Fachada completa: marquesina, luces, la vidriera con el póster, el 37, y la hamburguesa sola abajo |
| `local.webp` | 795 × 656 | De 900 px para arriba |
| `local-sm.webp` | 700 × 578 | Igual que el anterior, pantallas chicas de escritorio |

El `<picture>` del hero elige solo cuál corresponde.

**Si aparece la foto original sin el arte encima y con una foto de papas mejor, conviene
cambiarla.** Se reemplazan los archivos respetando el nombre y no hay que tocar nada más.

---

## De dónde salió cada dato

Nada del contenido es inventado. Todo viene de fuentes públicas de la marca:

| Dato | Fuente |
|---|---|
| Nombre, descripción y precio de los 39 productos | Carta oficial [lottaburgers.com](https://lottaburgers.com/) (los precios los toma de una hoja de Google que la marca actualiza) |
| Fotografías de producto y logo | Assets de lottaburgers.com |
| Eslogan «El rock hecho burger premium» | Bio de Instagram y home de la carta oficial |
| Dirección, horarios y turnos | Carta oficial + nota de El Día |
| Historia, socios, apertura, panadería, cerveza, tienda de puntos | [El Día — «Whole Lotta Burgers: el rock hecho hamburguesa»](https://www.eldia.com/nota/2026-3-5-6-50-29-whole-lotta-burgers-el-rock-hecho-hamburguesa-gourmet) |
| Canales de pedido | Link de la bio de Instagram (RestoSimple), PedidosYa, Rappi, tienda de puntos |
| +5.700 seguidores de Instagram | Perfil [@whole.lottaburgers](https://www.instagram.com/whole.lottaburgers/), agosto 2026 |

---

## Cómo se pide

El sitio no toma pedidos: los productos son solo para ver (foto, descripción, precio). Pedir
se hace por los canales que el local ya tiene funcionando — el botón flotante y todos los CTA
de "Pedir online" abren `whole-lotta-burgers.restosimple.com`; la sección «El local» suma
además PedidosYa, Rappi e Instagram.

Se probaron dos versiones de carrito con checkout por WhatsApp durante el desarrollo y se
sacaron a pedido del cliente las dos veces. Si en algún momento hace falta reactivar uno,
está en el historial de git.

Siguen estando los canales oficiales (RestoSimple, PedidosYa, Rappi) en el header y en la
sección del local, por si prefieren pedir por ahí.

---

## «El local» (última sección)

Rediseñada tomando como referencia un mockup que pasó el cliente — solo para estructura y
estilo, no para contenido: el mockup traía un logo de PedidosYa/Rappi replicado a mano (riesgo
de marca, no es un asset oficial) y horarios genéricos tipo "Lun-Vie". Se reemplazó por:

- **Mapa real embebido** con Google Maps (`maps.google.com/maps?q=...&output=embed`, sin API
  key), con un filtro oscuro (`grayscale + invert + contrast`) que se aclara al pasar el mouse
  o hacer foco, para que combine con la paleta del sitio en vez de mostrarse con los colores
  por defecto de Google.
- **Tres tarjetas de canal** (Pedido propio, PedidosYa, Rappi). "Pedido propio" usa un ícono
  genérico en la paleta del sitio (es el canal propio, no hay logo de por medio). PedidosYa y
  Rappi muestran el isotipo real de cada marca — `assets/pedidosya-logo.svg` y
  `assets/rappi-logo.svg`, bajados de sus páginas en Wikimedia Commons y usados tal cual
  (mismo color de marca, mismas proporciones, sin recolorear). Antes esas dos tarjetas tenían
  un ícono genérico como "Pedido propio", por la misma cautela de marca de siempre — se
  cambió a pedido explícito del cliente.
  **Ojo con el ícono de Rappi si se actualiza en el futuro**: su app cambia de ícono seguido
  por campañas (se vio uno de bigote rosa, aparentemente por Movember, al buscarlo). El
  isotipo naranja de acá es su marca estable de siempre, no un ícono de campaña — no
  reemplazar por el ícono de la app del momento sin fijarse primero si es permanente.
- **Horario real** tal como está publicado: mediodía 12:00–16:00, noche 20:00–00:00, los siete
  días.

---

## Cómo actualizar

**Precios y descripciones** — están escritos directamente en el HTML. Los de la carta viven
en `menu.html`, dentro de `<section class="menu">`; los de Moby Dick, en `index.html` dentro
de `<section class="feat">`. Buscar el nombre del producto y editar el texto. Se dejaron en
HTML plano a propósito: así Google los indexa y la página funciona aunque falle el JavaScript.
**Un producto vive en los dos lugares si aparece en el teaser del home** (`index.html`,
`<section class="menu-teaser">`) — son solo fotos decorativas ahí, no hace falta tocarlas al
cambiar un precio.

**Fotos** — reemplazar el archivo dentro de `assets/menu/` respetando el nombre. Los
productos de la carta completa (`menu.html`) usan la imagen de 800 px (`nombre.webp`); las
miniaturas del carrusel de fotos y de Instagram en el home usan la de 400 px (`nombre-sm.webp`).
Solo están los tamaños que cada página realmente pide.

**Producto destacado** — la sección Moby Dick está en `index.html`, `<section class="feat">`.

**Horarios** — se tocan en dos lugares: el bloque `loc-hours` en `index.html` y el
`openingHoursSpecification` del JSON-LD en su `<head>`. El cartelito «Abierto / Cerrado» del
hero se calcula solo con la constante `RANGES` de `js/main.js`, en horario de Argentina.

---

## Lo que ya está resuelto

- Mobile-first; probado en 320, 360, 390, 414, 900, 1440 y 1920 px, en las dos páginas
- SEO: title, meta description, canonical, Open Graph, Twitter Card y JSON-LD tipo `Restaurant`
  (`menu.html` tiene sus propios meta y canonical)
- Accesibilidad: HTML semántico, skip link, foco visible, `alt` en todas las imágenes,
  tabs con roles ARIA y navegación por flechas, lightbox con foco atrapado y cierre con Escape
- Contraste WCAG AA en todos los textos
- Respeta `prefers-reduced-motion`
- Imágenes en WebP con `loading="lazy"`, `decoding="async"` y `width`/`height` para evitar saltos de layout
- El JavaScript corre por features aisladas (`run()` en `js/main.js`): si una sección llegara a
  fallar, no se lleva puestas a las demás
- Sin frameworks, sin cookies, sin trackers

## Tipografías y color

| | |
|---|---|
| Display (hero) | Anton — la única licencia para gritar, en mayúscula |
| Display (resto de los títulos) | Fraunces — serif con carácter, mismo espíritu rock con más elegancia |
| Etiquetas y precios | Barlow Condensed |
| Texto | Barlow |
| Fondo | `#0A0908` |
| Acento principal | `#D9A548` — dorado, reemplaza el ámbar de neón de la primera versión |
| Bloque destacado (Moby Dick) | `#C6903A` |
| Oro del logo / detalles chicos | `#A67C3D` |
| Texto | `#F4EFE6` |

---

## Estructura de la landing (`index.html`)

Hero → **Se come con los ojos** (carrusel de fotos) → Historia → **Teaser de menú** (lleva a
`menu.html`) → **Franja de horarios** a todo el ancho → Moby Dick destacado → Galería →
Instagram → El local → Footer.

El carrusel son dos filas que corren solas en sentidos opuestos, sin nada que tocar. El JS
duplica el contenido de cada fila para que el bucle cierre sin salto y le calcula la duración
según el ancho real, así las dos van a la misma velocidad aunque tengan distinta cantidad de
fotos. Se frena al pasar el mouse por encima.

La franja de horarios ocupa el ancho completo, con un parallax leve: la foto se mueve un poco
más lento que el resto de la página al hacer scroll. Es puramente decorativo — se apaga solo
si el sistema tiene activado "reducir movimiento".

El hero sigue el arte que pasó el cliente: `WHOLE` y `LOTTA` apilados en Anton sobre la foto
del frente, `BURGERS` en oro entre dos rayos, la bajada, dos botones de contorno fino
(Ver el menú / Pedir online) y la dirección con el pin. En teléfono la foto muestra la
fachada completa con el titular arriba sobre negro; de 900 px para arriba la foto ocupa todo
el ancho y el texto se recuesta a la izquierda sobre un degradado.

Cada sección entra con fade-in + slide-up + un leve achique de escala al cruzar el borde
inferior de la pantalla, y los elementos dentro de cada una (tarjetas, fotos) se escalonan
entre sí en vez de aparecer todos juntos.

Ese disparador se revisa por la posición real de cada elemento en cada scroll, no con
`requestAnimationFrame` a solas: una pestaña en segundo plano o con el rendimiento limitado
por el sistema puede tardar en darle un frame a `requestAnimationFrame`, y mientras tanto el
contenido quedaría invisible. Acá corre con un timer plano que no depende de eso, con
`IntersectionObserver` como segundo disparador en paralelo.
