# Aplicacion-Dinamica-con-Js

Aplicación web para gestionar una lista de contactos usando **JavaScript** y **localStorage**. Permite agregar, editar, eliminar, buscar y ordenar contactos de forma dinámica.

## Procedimiento de instalación y uso

1. **Descarga o clona el repositorio:**
   ```sh
   git clone https://github.com/tu-usuario/Aplicacion-Dinamica-con-Js.git
   ```
2. **Abre la carpeta del proyecto.**
3. **Ejecuta la aplicación:**
   - Abre el archivo `index.html` en tu navegador web.

## Funcionamiento

- **Agregar contacto:** Completa el formulario y haz clic en "ADD". El contacto se guarda en el navegador.
- **Editar contacto:** Haz clic en "Editar" en la tabla, modifica los datos y guarda los cambios.
- **Eliminar contacto:** Haz clic en "Eliminar" para borrar un contacto específico.
- **Buscar:** Usa el campo de búsqueda para filtrar contactos por nombre, apellido o ciudad.
- **Ordenar:** Selecciona el criterio de orden en el menú desplegable.
- **Borrar todos:** Haz clic en "Borrar todo" para eliminar todos los contactos guardados.

Todos los datos se almacenan localmente en el navegador usando `localStorage`, por lo que no se requiere servidor ni base de datos externa.

## Uso del DOM en la aplicación

El DOM (Document Object Model) se utiliza en varias partes del código para interactuar con los elementos de la página:

- **Selección de elementos:**  
  Se usan funciones como `document.querySelector` y `document.querySelectorAll` (abreviadas como `$` y `$$`) para seleccionar elementos del formulario, tabla, botones, etc.
- **Renderizado dinámico:**  
  La función `render()` actualiza el contenido de la tabla de contactos (`#tbody`) según los datos y filtros aplicados.
- **Manejo de eventos:**  
  Se agregan listeners para el formulario (`submit`), botones de editar/eliminar, búsqueda (`input`), orden (`change`) y borrar todos los contactos (`click`).
- **Actualización de la interfaz:**  
  Se modifican propiedades y contenido de elementos como el badge de total de contactos, mensajes de estado, y el formulario de edición.

**Ejemplo de uso del DOM en el código:**
```js
const form = $("#contact-form"); // Selecciona el formulario
form.addEventListener("submit", (e) => { ... }); // Escucha el evento submit

const tbody = $("#tbody"); // Selecciona el cuerpo de la tabla
tbody.innerHTML = "..."; // Actualiza el contenido de la tabla

$("#search").addEventListener("input", debounce(render, 120)); // Escucha cambios en el buscador
```

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- localStorage

## Autor

