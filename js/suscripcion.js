// js/suscripcion.js
// Clase 08: validación del formulario de suscripción
// Clase 09: envío de datos al servidor por HTTP (fetch), modal de resultado,
//           persistencia en LocalStorage y precarga del formulario

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('form-suscripcion');
    const botonEnviar = document.getElementById('btn-enviar');

    // URL del servidor al que se envían los datos del formulario.
    // JSONPlaceholder es una API falsa de pruebas: acepta cualquier POST
    // y responde con el mismo cuerpo enviado + un "id" generado.
    const API_URL = 'https://jsonplaceholder.typicode.com/posts';

    // Clave usada para guardar/leer los datos en LocalStorage
    const CLAVE_LOCALSTORAGE = 'diarioDeportivo_suscripcion';

    // ---------------------------------------------------
    // Funciones de validación
    // Cada una recibe el valor del campo (y el form si necesita
    // comparar con otro campo) y devuelve:
    //   - null si es válido
    //   - un string con el mensaje de error si no lo es
    // ---------------------------------------------------

    function validarNombre(valor) {
        const texto = valor.trim();
        const soloLetras = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü\s]+$/;

        if (texto === '') return 'El nombre completo es obligatorio.';
        if (!soloLetras.test(texto)) return 'El nombre solo puede contener letras y espacios.';

        const cantidadLetras = texto.replace(/\s/g, '').length;
        if (cantidadLetras <= 6) return 'El nombre debe tener más de 6 letras.';
        if (!/\s/.test(texto)) return 'Ingresá al menos nombre y apellido, separados por un espacio.';

        return null;
    }

    function validarEmail(valor) {
        const texto = valor.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (texto === '') return 'El email es obligatorio.';
        if (!regexEmail.test(texto)) return 'Ingresá un email con un formato válido (ej: nombre@correo.com).';

        return null;
    }

    function validarPassword(valor) {
        const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (valor === '') return 'La contraseña es obligatoria.';
        if (!regexPassword.test(valor)) {
            return 'La contraseña debe tener al menos 8 caracteres, combinando letras y números.';
        }

        return null;
    }

    function validarPassword2(valor) {
        const password = document.getElementById('password').value;

        if (valor === '') return 'Tenés que repetir la contraseña.';
        if (valor !== password) return 'Las contraseñas no coinciden.';

        return null;
    }

    function validarEdad(valor) {
        const texto = valor.trim();

        if (texto === '') return 'La edad es obligatoria.';
        if (!/^\d+$/.test(texto)) return 'La edad debe ser un número entero.';
        if (parseInt(texto, 10) < 18) return 'Debés ser mayor o igual a 18 años para suscribirte.';

        return null;
    }

    function validarTelefono(valor) {
        const texto = valor.trim();

        if (texto === '') return 'El teléfono es obligatorio.';
        if (!/^\d+$/.test(texto)) return 'El teléfono no debe contener espacios, guiones ni paréntesis, solo números.';
        if (texto.length < 7) return 'El teléfono debe tener al menos 7 dígitos.';

        return null;
    }

    function validarDireccion(valor) {
        const texto = valor.trim();

        if (texto === '') return 'La dirección es obligatoria.';
        if (texto.length < 5) return 'La dirección debe tener al menos 5 caracteres.';
        if (!/[A-Za-zÁÉÍÓÚÑÜáéíóúñü]/.test(texto)) return 'La dirección debe contener letras.';
        if (!/\d/.test(texto)) return 'La dirección debe contener al menos un número (ej: altura).';
        if (!/\s/.test(texto)) return 'La dirección debe tener un espacio entre la calle y el número.';

        return null;
    }

    function validarCiudad(valor) {
        const texto = valor.trim();

        if (texto === '') return 'La ciudad es obligatoria.';
        if (texto.length < 3) return 'La ciudad debe tener al menos 3 caracteres.';

        return null;
    }

    function validarCP(valor) {
        const texto = valor.trim();

        if (texto === '') return 'El código postal es obligatorio.';
        if (texto.length < 3) return 'El código postal debe tener al menos 3 caracteres.';

        return null;
    }

    function validarDNI(valor) {
        const texto = valor.trim();

        if (texto === '') return 'El DNI es obligatorio.';
        if (!/^\d{7,8}$/.test(texto)) return 'El DNI debe ser un número de 7 u 8 dígitos.';

        return null;
    }

    // ---------------------------------------------------
    // Configuración de cada campo: id, etiqueta (para el
    // cartel emergente) y función de validación asociada.
    // ---------------------------------------------------
    const campos = [
        { id: 'nombre', etiqueta: 'Nombre completo', validar: validarNombre },
        { id: 'email', etiqueta: 'Email', validar: validarEmail },
        { id: 'password', etiqueta: 'Contraseña', validar: validarPassword },
        { id: 'password2', etiqueta: 'Repetir contraseña', validar: validarPassword2 },
        { id: 'edad', etiqueta: 'Edad', validar: validarEdad },
        { id: 'telefono', etiqueta: 'Teléfono', validar: validarTelefono },
        { id: 'direccion', etiqueta: 'Dirección', validar: validarDireccion },
        { id: 'ciudad', etiqueta: 'Ciudad', validar: validarCiudad },
        { id: 'cp', etiqueta: 'Código Postal', validar: validarCP },
        { id: 'dni', etiqueta: 'DNI', validar: validarDNI }
    ];

    // Mapa id -> etiqueta legible, usado también para mostrar
    // la respuesta del servidor en el modal.
    const ETIQUETAS = {};
    campos.forEach(function (campo) { ETIQUETAS[campo.id] = campo.etiqueta; });
    ETIQUETAS.id = 'ID de suscripción (servidor)';

    // Valida un campo puntual y actualiza su mensaje de error en pantalla.
    // Devuelve el mensaje de error (o null si está OK).
    function validarCampo(campo) {
        const input = document.getElementById(campo.id);
        const spanError = document.getElementById('error-' + campo.id);
        const mensaje = campo.validar(input.value);

        if (mensaje) {
            spanError.textContent = mensaje;
            input.classList.add('campo-invalido');
        } else {
            spanError.textContent = '';
            input.classList.remove('campo-invalido');
        }

        return mensaje;
    }

    // ---------------------------------------------------
    // Eventos "blur" (valida) y "focus" (limpia el error,
    // asumiendo que el usuario está corrigiendo el campo)
    // ---------------------------------------------------
    campos.forEach(function (campo) {
        const input = document.getElementById(campo.id);

        input.addEventListener('blur', function () {
            validarCampo(campo);
        });

        input.addEventListener('focus', function () {
            const spanError = document.getElementById('error-' + campo.id);
            spanError.textContent = '';
            input.classList.remove('campo-invalido');
        });
    });

    // ---------------------------------------------------
    // Cartel emergente (modal)
    // ---------------------------------------------------
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCaja = document.getElementById('modal-caja');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalContenido = document.getElementById('modal-contenido');
    const botonCerrarModal = document.getElementById('modal-cerrar');

    // Modal de éxito: se llama con los datos que devolvió el SERVIDOR
    // (no los que escribió el usuario), tal como pide la consigna.
    function mostrarModalExito(datosRespuesta) {
        modalCaja.classList.remove('modal-error');
        modalTitulo.textContent = '¡Suscripción enviada con éxito!';

        let html = '<p>El servidor confirmó la suscripción. Estos son los datos recibidos en la respuesta:</p><dl>';
        Object.keys(datosRespuesta).forEach(function (clave) {
            const etiqueta = ETIQUETAS[clave] || clave;
            const esPassword = (clave === 'password' || clave === 'password2');
            const valor = esPassword ? '••••••••' : datosRespuesta[clave];
            html += '<div><dt>' + escapeHtml(etiqueta) + ':</dt><dd>' + escapeHtml(String(valor)) + '</dd></div>';
        });
        html += '</dl>';
        html += '<p class="modal-nota">Guardamos estos datos en tu navegador (LocalStorage) para precargar el formulario la próxima vez que entres.</p>';

        modalContenido.innerHTML = html;
        abrirModal();
    }

    // Modal de error de VALIDACIÓN (antes de llamar al servidor)
    function mostrarModalErrores(errores) {
        modalCaja.classList.add('modal-error');
        modalTitulo.textContent = 'Revisá los siguientes errores';

        let html = '<p>No pudimos enviar tu suscripción porque encontramos estos problemas:</p><ul>';
        errores.forEach(function (err) {
            html += '<li><strong>' + escapeHtml(err.etiqueta) + ':</strong> ' + escapeHtml(err.mensaje) + '</li>';
        });
        html += '</ul>';

        modalContenido.innerHTML = html;
        abrirModal();
    }

    // Modal de error del SERVIDOR (la validación pasó, pero el HTTP falló)
    function mostrarModalErrorEnvio(mensaje) {
        modalCaja.classList.add('modal-error');
        modalTitulo.textContent = 'No se pudo completar la suscripción';

        let html = '<p>Tus datos son correctos, pero ocurrió un problema al enviarlos al servidor:</p>';
        html += '<ul><li>' + escapeHtml(mensaje) + '</li></ul>';
        html += '<p class="modal-nota">No se guardó ninguna información en tu navegador. Podés volver a intentarlo.</p>';

        modalContenido.innerHTML = html;
        abrirModal();
    }

    function abrirModal() {
        modalOverlay.classList.add('activo');
    }

    function cerrarModal() {
        modalOverlay.classList.remove('activo');
    }

    function escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    botonCerrarModal.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', function (evento) {
        if (evento.target === modalOverlay) cerrarModal();
    });

    // ---------------------------------------------------
    // LocalStorage
    // ---------------------------------------------------
    function guardarEnLocalStorage(datosRespuesta) {
        try {
            localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(datosRespuesta));
        } catch (error) {
            console.error('No se pudo guardar en LocalStorage:', error);
        }
    }

    function mostrarAvisoDatosCargados() {
        // Evita duplicar el aviso si por algún motivo se llama dos veces
        if (document.querySelector('.aviso-datos-guardados')) return;

        const aviso = document.createElement('p');
        aviso.className = 'aviso-datos-guardados';
        aviso.textContent = 'Precargamos los datos de tu última suscripción exitosa.';
        form.insertAdjacentElement('beforebegin', aviso);
    }

    // Se ejecuta en el evento "load" de window: si hay datos guardados
    // de una suscripción exitosa anterior, precarga el formulario.
    function cargarDatosGuardados() {
        const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE);
        if (!guardado) return;

        try {
            const datos = JSON.parse(guardado);
            campos.forEach(function (campo) {
                const input = document.getElementById(campo.id);
                if (input && datos[campo.id] !== undefined && datos[campo.id] !== null) {
                    input.value = datos[campo.id];
                }
            });
            mostrarAvisoDatosCargados();
        } catch (error) {
            console.error('No se pudieron leer los datos guardados de LocalStorage:', error);
        }
    }

    // ---------------------------------------------------
    // Envío al servidor (POST con los campos como query params)
    // ---------------------------------------------------
    function enviarSuscripcion(datos) {
        const textoOriginalBoton = botonEnviar.textContent;

        // Los valores del formulario van como query params en la URL...
        const queryParams = new URLSearchParams(datos).toString();
        const url = API_URL + '?' + queryParams;

        botonEnviar.disabled = true;
        botonEnviar.textContent = 'Enviando...';

        // ...y también se mandan en el body, porque JSONPlaceholder (la API
        // de prueba que usamos) solo refleja en su respuesta lo que recibe
        // en el body del POST. Así garantizamos que el modal pueda mostrar
        // los datos "recibidos como respuesta de la llamada HTTP".
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(function (respuesta) {
                if (!respuesta.ok) {
                    throw new Error('El servidor respondió con error ' + respuesta.status + ' (' + respuesta.statusText + ').');
                }
                return respuesta.json();
            })
            .then(function (datosRespuesta) {
                guardarEnLocalStorage(datosRespuesta);
                mostrarModalExito(datosRespuesta);

                form.reset();
                campos.forEach(function (campo) {
                    document.getElementById(campo.id).classList.remove('campo-invalido');
                });
            })
            .catch(function (error) {
                mostrarModalErrorEnvio(error.message || 'No se pudo conectar con el servidor. Verificá tu conexión a internet.');
            })
            .finally(function () {
                botonEnviar.disabled = false;
                botonEnviar.textContent = textoOriginalBoton;
            });
    }

    // ---------------------------------------------------
    // Envío del formulario
    // ---------------------------------------------------
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const errores = [];

        campos.forEach(function (campo) {
            const mensaje = validarCampo(campo);
            if (mensaje) {
                errores.push({ etiqueta: campo.etiqueta, mensaje: mensaje });
            }
        });

        if (errores.length > 0) {
            mostrarModalErrores(errores);
            return;
        }

        const datos = {};
        campos.forEach(function (campo) {
            datos[campo.id] = document.getElementById(campo.id).value.trim();
        });

        enviarSuscripcion(datos);
    });

    // ---------------------------------------------------
    // Precarga del formulario al recargar la página
    // ---------------------------------------------------
    window.addEventListener('load', cargarDatosGuardados);

});
