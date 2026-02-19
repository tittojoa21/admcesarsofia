// Validación del formulario de contacto - SIN REDIRECCIÓN
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.querySelector('.btn-block');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            // Prevenir el envío tradicional que redirige
            e.preventDefault();
            
            // Validar campos requeridos
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const terminos = document.getElementById('terminos').checked;

            // Validaciones
            if (!nombre || !email || !telefono || !mensaje || !terminos) {
                showMessage('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('Por favor, ingresa un email válido.', 'error');
                return;
            }

            if (!validatePhone(telefono)) {
                showMessage('Por favor, ingresa un teléfono válido.', 'error');
                return;
            }

            // Mostrar estado de carga
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                // Preparar los datos del formulario
                const formData = new FormData(contactForm);
                
                // Agregar parámetros para evitar redirección
                formData.append('_captcha', 'false');
                formData.append('_subject', 'Nuevo mensaje desde sitio web Cesar Sofia');
                formData.append('_template', 'table');
                
                // Enviar con Fetch API al endpoint AJAX de FormSubmit
                const response = await fetch('https://formsubmit.co/ajax/info@admcesarsofia.com', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Éxito
                    showMessage('¡Mensaje enviado con éxito! Te contactaremos a la brevedad.', 'success');
                    contactForm.reset(); // Limpiar formulario
                } else {
                    // Error del servidor
                    throw new Error('Error al enviar el mensaje');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contactanos por WhatsApp.', 'error');
            } finally {
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Función para validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Función para validar teléfono
    function validatePhone(phone) {
        const re = /^[\d\s\-+()]{8,20}$/;
        return re.test(phone);
    }

    // Función para mostrar mensajes
    function showMessage(text, type) {
        const formMessage = document.getElementById('formMessage');
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Validación en tiempo real
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--rojo)';
            } else {
                this.style.borderColor = '#ddd';
            }
        });

        input.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
        });
    });

    // Validación especial para email en tiempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showMessage('El email no tiene un formato válido', 'error');
                this.style.borderColor = 'var(--rojo)';
            }
        });
    }
});