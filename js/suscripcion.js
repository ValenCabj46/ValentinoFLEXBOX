// js/suscripcion.js
// Validación del formulario de suscripción - Clase 08

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('form-suscripcion');

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

    // Caso especial: si el usuario corrige la contraseña principal
    // después de haber cargado la repetición, conviene re-chequear
    // la repetición al perder foco la contraseña (no obligatorio,
    // pero evita confusiones). Se valida igual en su propio blur.

    // ---------------------------------------------------
    // Cartel emergente (modal)
    // ---------------------------------------------------
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCaja = document.getElementById('modal-caja');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalContenido = document.getElementById('modal-contenido');
    const botonCerrarModal = document.getElementById('modal-cerrar');

    function mostrarModalExito(datos) {
        modalCaja.classList.remove('modal-error');
        modalTitulo.textContent = '¡Suscripción exitosa!';

        let html = '<p>Estos son los datos que enviaste:</p><dl>';
        html += '<div><dt>Nombre completo:</dt><dd>' + escapeHtml(datos.nombre) + '</dd></div>';
        html += '<div><dt>Email:</dt><dd>' + escapeHtml(datos.email) + '</dd></div>';
        html += '<div><dt>Contraseña:</dt><dd>••••••••</dd></div>';
        html += '<div><dt>Edad:</dt><dd>' + escapeHtml(datos.edad) + '</dd></div>';
        html += '<div><dt>Teléfono:</dt><dd>' + escapeHtml(datos.telefono) + '</dd></div>';
        html += '<div><dt>Dirección:</dt><dd>' + escapeHtml(datos.direccion) + '</dd></div>';
        html += '<div><dt>Ciudad:</dt><dd>' + escapeHtml(datos.ciudad) + '</dd></div>';
        html += '<div><dt>Código Postal:</dt><dd>' + escapeHtml(datos.cp) + '</dd></div>';
        html += '<div><dt>DNI:</dt><dd>' + escapeHtml(datos.dni) + '</dd></div>';
        html += '</dl>';

        modalContenido.innerHTML = html;
        abrirModal();
    }

    function mostrarModalErrores(errores) {
        modalCaja.classList.add('modal-error');
        modalTitulo.textContent = 'Revisá los siguientes errores';

        let html = '<p>No pudimos procesar tu suscripción porque encontramos estos problemas:</p><ul>';
        errores.forEach(function (err) {
            html += '<li><strong>' + escapeHtml(err.etiqueta) + ':</strong> ' + escapeHtml(err.mensaje) + '</li>';
        });
        html += '</ul>';

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

        if (errores.length === 0) {
            const datos = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                edad: document.getElementById('edad').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                direccion: document.getElementById('direccion').value.trim(),
                ciudad: document.getElementById('ciudad').value.trim(),
                cp: document.getElementById('cp').value.trim(),
                dni: document.getElementById('dni').value.trim()
            };
            mostrarModalExito(datos);
            form.reset();
            campos.forEach(function (campo) {
                document.getElementById(campo.id).classList.remove('campo-invalido');
            });
        } else {
            mostrarModalErrores(errores);
        }
    });

});
