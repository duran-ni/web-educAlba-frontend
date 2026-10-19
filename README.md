# 🎓 EducAlba · Frontend

![Vue](https://img.shields.io/badge/Vue-3.5-42b883)
![Vite](https://img.shields.io/badge/Vite-8-646CFF)
![Tests unitarios](https://img.shields.io/badge/tests_unitarios-431_pasados-brightgreen)
![Tests e2e](https://img.shields.io/badge/tests_e2e-213_pasados-brightgreen)
![Cobertura](https://img.shields.io/badge/cobertura-100%25-brightgreen)

Web de **EducAlba**, academia de refuerzo escolar y talleres extraescolares. Incluye la parte pública de la academia (inicio, talleres, refuerzo, quiénes somos, qué hacemos, galería y contacto), el registro y el login de las familias, y los paneles privados de la familia y del administrador.

> 📖 **Documentación completa en la [Wiki](https://github.com/duran-ni/web-educAlba-frontend/wiki).**
> 🎨 **Diseño en Figma:** _(enlace pendiente)_
> 🎤 **Presentación:** _(enlace pendiente)_

---

## 🗂️ Estructura del proyecto

El proyecto está dividido en dos repositorios:

| Repositorio | Contenido |
|-------------|-----------|
| **web-educAlba-frontend** (este) | Aplicación web en Vue 3 |
| [web-educAlba-backend](https://github.com/duran-ni/web-educAlba-backend) | API REST con Spring Boot que consume esta aplicación |

---

## 💻 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| Framework y build | Vue 3 (Composition API, `<script setup>`) · Vite |
| Enrutado y estado | Vue Router 4 · Pinia |
| Peticiones HTTP | Axios (instancia única con interceptores) |
| Estilos | Sass (SCSS modular) · BEM · *mobile-first* |
| Testing | Vitest · Vue Test Utils · Playwright |
| Calidad y CI | ESLint · Prettier · GitHub Actions |

---

## 🚀 Inicio rápido

Requisitos: **Node.js 22** y el [backend](https://github.com/duran-ni/web-educAlba-backend) arrancado.

```bash
git clone https://github.com/duran-ni/web-educAlba-frontend.git
cd web-educAlba-frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8080/api
npm run dev
```

La aplicación queda en `http://localhost:5173`.

> ⚠️ El backend tiene que estar en marcha antes de arrancar el frontend.

📖 Paso a paso, scripts y comprobaciones: [Guía de instalación](https://github.com/duran-ni/web-educAlba-frontend/wiki/Guía-de-instalación)

---

## ✨ Funcionalidades

**👀 Visitantes**: talleres en calendario y listado con inscripción sin cuenta, galería de fotos y vídeos por carpetas, equipo de profesores, metodología, contacto y formulario rápido de interés.

**👨‍👩‍👧 Familias**: registro con los datos del alumno, login con "recordarme", recuperación de contraseña y panel con los talleres del alumno.

**🛠️ Administración**: indicadores en tiempo real, y gestión de talleres e inscripciones, alumnos, profesores (con foto) y galería (carpetas, portadas, subida de varias fotos y vídeos a la vez).

**🔐 Acceso por rol**: cada panel solo es accesible para su rol; si alguien entra en una zona que no le corresponde, se le lleva a la suya.

📖 [Autenticación y rutas](https://github.com/duran-ni/web-educAlba-frontend/wiki/Autenticación-y-rutas) · [Componentes](https://github.com/duran-ni/web-educAlba-frontend/wiki/Componentes)

---

## 🎨 Diseño UX/UI

Todas las vistas se diseñaron antes de programarlas: boceto, prototipos rápidos con IA y diseño final en Figma. La identidad visual es la de un **cuaderno de clase** (fondo cuadriculado, bordes dibujados a mano y colores pastel), con un diseño *responsive* y accesible.

📖 [Diseño y prototipos](https://github.com/duran-ni/web-educAlba-frontend/wiki/Diseño-y-prototipos) · [Estilos SCSS y BEM](https://github.com/duran-ni/web-educAlba-frontend/wiki/Estilos-SCSS-y-BEM) · [Accesibilidad](https://github.com/duran-ni/web-educAlba-frontend/wiki/Accesibilidad)

---

## 🛠️ Buenas prácticas

- **Capas separadas**: vistas, componentes, servicios y una única instancia de Axios. Los componentes nunca llaman a Axios directamente.
- **Sesión por cookie `HttpOnly`**, sin tokens en `localStorage`.
- **Asincronía**: peticiones en paralelo con `Promise.all` y un único estado (`status`) por componente para la carga y los errores.
- **Tiempo real** con Server-Sent Events en el panel del administrador.
- **Sass modular con BEM** y variables como única fuente de colores, tipografías y *breakpoints*.
- **Accesibilidad**: HTML semántico, formularios con `aria-invalid` y `aria-describedby`, foco visible y menú móvil con `aria-expanded`.

📖 [Arquitectura](https://github.com/duran-ni/web-educAlba-frontend/wiki/Arquitectura) · [Comunicación con la API](https://github.com/duran-ni/web-educAlba-frontend/wiki/Comunicación-con-la-API) · [Decisiones técnicas](https://github.com/duran-ni/web-educAlba-frontend/wiki/Decisiones-técnicas)

---

## ✅ Tests

| Tipo | Herramienta | Resultado |
|------|-------------|-----------|
| Unitarios y de componentes | Vitest + Vue Test Utils | **431 tests**, cobertura del **100 %** |
| *End-to-end* | Playwright (Chromium, Firefox y WebKit) | **71 tests × 3 navegadores = 213 ejecuciones** |

```bash
npm run test:unit:coverage   # tests unitarios con cobertura
npm run test:e2e             # tests end-to-end
```

📖 [Testing](https://github.com/duran-ni/web-educAlba-frontend/wiki/Testing)

---

## 📊 Gestión del proyecto

Proyecto individual gestionado con metodología ágil en **Jira**: 17 épicas, 59 historias de usuario con criterios de aceptación en formato Gherkin y 217 tareas y subtareas, en 3 sprints.

📖 [Gestión del proyecto](https://github.com/duran-ni/web-educAlba-frontend/wiki/Gestión-del-proyecto)

---

## 🌿 Control de versiones

- **Git Flow simplificado**: `main` (estable) ← `dev` (integración) ← una rama por tarea.
- **Commits atómicos** con [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat(router):`, `test(e2e):`, `style(gallery):`…).
- **Integración continua** con GitHub Actions: lint, tests unitarios, tests *end-to-end* y build en cada `push` a `dev` y `main`.

📖 [Flujo de trabajo](https://github.com/duran-ni/web-educAlba-frontend/wiki/Flujo-de-trabajo)

---

## 📖 Documentación

| Página de la wiki | Contenido |
|-------------------|-----------|
| [Guía de instalación](https://github.com/duran-ni/web-educAlba-frontend/wiki/Guía-de-instalación) | Requisitos, `.env`, arranque y scripts |
| [Gestión del proyecto](https://github.com/duran-ni/web-educAlba-frontend/wiki/Gestión-del-proyecto) | Jira, épicas, historias de usuario y sprints |
| [Diseño y prototipos](https://github.com/duran-ni/web-educAlba-frontend/wiki/Diseño-y-prototipos) | Proceso de diseño, identidad visual y prototipos |
| [Diagramas](https://github.com/duran-ni/web-educAlba-frontend/wiki/Diagramas) | Casos de uso, capas y navegación por rol |
| [Arquitectura](https://github.com/duran-ni/web-educAlba-frontend/wiki/Arquitectura) | Tecnologías, capas, carpetas y arranque |
| [Autenticación y rutas](https://github.com/duran-ni/web-educAlba-frontend/wiki/Autenticación-y-rutas) | Sesión, store, rutas, guards y layouts |
| [Comunicación con la API](https://github.com/duran-ni/web-educAlba-frontend/wiki/Comunicación-con-la-API) | Servicios, asincronía, archivos, paginación y tiempo real |
| [Componentes](https://github.com/duran-ni/web-educAlba-frontend/wiki/Componentes) | Catálogo de componentes y vistas |
| [Estilos SCSS y BEM](https://github.com/duran-ni/web-educAlba-frontend/wiki/Estilos-SCSS-y-BEM) | Sass modular, BEM y *responsive* |
| [Accesibilidad](https://github.com/duran-ni/web-educAlba-frontend/wiki/Accesibilidad) | Prácticas aplicadas y lista de comprobación |
| [Testing](https://github.com/duran-ni/web-educAlba-frontend/wiki/Testing) | Vitest y Playwright |
| [Decisiones técnicas](https://github.com/duran-ni/web-educAlba-frontend/wiki/Decisiones-técnicas) | Por qué se eligió cada solución |
| [Flujo de trabajo](https://github.com/duran-ni/web-educAlba-frontend/wiki/Flujo-de-trabajo) | Ramas, commits e integración continua |
| [Limitaciones y próximos pasos](https://github.com/duran-ni/web-educAlba-frontend/wiki/Limitaciones-y-próximos-pasos) | Lo que queda por hacer |
| [Solución de problemas](https://github.com/duran-ni/web-educAlba-frontend/wiki/Solución-de-problemas) | Errores frecuentes |

---

## ✍️ Autora

**Nieves Durán** — [@duran-ni](https://github.com/duran-ni)

Proyecto final del Bootcamp Java Fullstack de Factoría F5.
