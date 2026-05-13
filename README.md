# Norvia — Guía de uso y despliegue

## Estructura del proyecto

```
norvia/
├── index.html
├── README.md
├── articulos/
│   ├── index.json              ← índice de todos los artículos
│   ├── nombre-del-articulo.md  ← artículos en Markdown
│   └── ...
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

---

## Cómo publicar en GitHub Pages

### Primer despliegue

1. Creá un repositorio nuevo en GitHub (ej: `norvia`)
2. Subí todos los archivos de este proyecto al repositorio
3. Andá a **Settings → Pages**
4. En "Source" seleccioná **Deploy from a branch**
5. Elegí la rama `main` y la carpeta `/ (root)`
6. Guardá. En unos minutos tu sitio va a estar en:
   `https://TU-USUARIO.github.io/norvia/`

> Si usás un dominio propio, podés configurarlo en la misma sección de Pages.

---

## Cómo agregar un nuevo artículo

### Paso 1 — Crear el archivo Markdown

Creá un archivo `.md` dentro de la carpeta `/articulos/` con este formato:

```
nombre-del-articulo.md
```

El nombre debe ser en minúsculas, sin espacios (usá guiones) y sin acentos.

**Ejemplo:** `responsabilidad-ambiental-empresas.md`

### Paso 2 — Estructura del archivo

Cada artículo empieza con un bloque de metadatos entre `---`:

```markdown
---
titulo: "Título del artículo"
categoria: "Derecho al Ambiente"
fecha: "2025-06-01"
resumen: "Una oración que resume el artículo. Aparece en las tarjetas."
autor: "Lucas Are"
imagen: ""
---

## Introducción

El contenido del artículo va acá, en Markdown normal.

## Otra sección

Más texto...
```

**Categorías disponibles:**
- `Derecho al Ambiente`
- `Derecho Constitucional Económico`
- `IA en el Derecho`

Para agregar una nueva categoría, también actualizá los filtros en `index.html` (sección `.filter-bar`).

### Paso 3 — Actualizar el índice

Abrí el archivo `articulos/index.json` y agregá una entrada al **inicio** del array (para que aparezca como el más reciente):

```json
[
  {
    "archivo": "nombre-del-articulo.md",
    "titulo": "Título del artículo",
    "categoria": "Derecho al Ambiente",
    "fecha": "2025-06-01",
    "resumen": "Una oración que resume el artículo.",
    "autor": "Lucas Are"
  },
  ...artículos anteriores...
]
```

> ⚠️ El `index.json` es lo que la página usa para mostrar las tarjetas. Si no actualizás este archivo, el artículo no va a aparecer aunque subas el `.md`.

### Paso 4 — Subir los cambios a GitHub

Con GitHub Desktop o desde la web:
1. Subí el archivo `.md` nuevo a `/articulos/`
2. Subí el `index.json` actualizado
3. GitHub Pages va a actualizar el sitio en 1-2 minutos

---

## Configurar el formulario de contacto (Formspree)

El formulario usa [Formspree](https://formspree.io), que redirige los mensajes a tu email sin necesitar un backend.

1. Entrá a [formspree.io](https://formspree.io) y creá una cuenta gratuita
2. Creá un nuevo formulario con tu email `lucasare94@gmail.com`
3. Te van a dar un ID de formulario, algo como `xpwzgaqe`
4. En `index.html`, buscá esta línea:
   ```html
   <form class="contacto-form" id="contactForm" action="https://formspree.io/f/lucasare94@gmail.com"
   ```
   Y reemplazá la URL con tu ID real:
   ```html
   <form class="contacto-form" id="contactForm" action="https://formspree.io/f/xpwzgaqe"
   ```

El plan gratuito de Formspree permite 50 envíos por mes, más que suficiente para empezar.

---

## Personalizar el contenido

### Sección "Sobre el autor"
Editá el texto directamente en `index.html`, buscando la sección `<section class="autor-section">`.

### Agregar foto de perfil
Reemplazá el div `.autor-initials` por una imagen:
```html
<img src="assets/img/foto.jpg" alt="Lucas Are" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
```

### Cambiar el color dorado
En `assets/css/style.css`, buscá la variable `--gold` y cambiá el valor:
```css
--gold: #c9a96e;
```

---

## Sintaxis Markdown para artículos

```markdown
## Título de sección

Párrafo normal con **negrita** o *cursiva*.

### Subsección

Otro párrafo.

> Una cita o destacado importante.

- Lista con guiones
- Segundo ítem
```
