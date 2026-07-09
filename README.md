# Portada de Diario Deportivo

Proyecto de maquetado web responsivo utilizando HTML y CSS (Flexbox) aplicando el concepto de Mobile First.

## Ver online (GitHub Pages)

- Portada: https://valencabj46.github.io/ValentinoFLEXBOX/
- Suscripción de lectores: https://valencabj46.github.io/ValentinoFLEXBOX/suscripcion.html



## Semana 09 - Envío al servidor y LocalStorage

Al enviar el formulario (una vez que pasa todas las validaciones), los datos
se envían mediante un POST por fetch a `https://jsonplaceholder.typicode.com/posts`
(incluyendo todos los campos como query params en la URL). Según la respuesta:

- **Éxito:** se muestra un modal con los datos devueltos por el servidor y se
  guardan en `LocalStorage`.
- **Error:** se muestra un modal con el detalle del error y no se guarda nada.

Al recargar la página, si hay datos guardados de una suscripción exitosa
anterior, se precargan automáticamente en el formulario (evento `load` de
`window`).
