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

            // Validación mejorada para teléfono
            const phoneValidation = validatePhone(telefono);
            if (!phoneValidation.valid) {
                showMessage(phoneValidation.message, 'error');
                document.getElementById('telefono').style.borderColor = 'var(--rojo)';
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

    // Función mejorada para validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Función mejorada para validar teléfono (ARGENTINA)
    function validatePhone(phone) {
        // Limpiar el teléfono de caracteres no numéricos para análisis
        const cleaned = phone.replace(/[\s\-+()]/g, '');
        
        // Validaciones específicas para Argentina
        if (cleaned.length < 8) {
            return {
                valid: false,
                message: 'El teléfono debe tener al menos 8 dígitos'
            };
        }
        
        if (cleaned.length > 15) {
            return {
                valid: false,
                message: 'El teléfono no puede tener más de 15 dígitos'
            };
        }
        
        // Verificar que solo contenga números después de limpiar
        if (!/^\d+$/.test(cleaned)) {
            return {
                valid: false,
                message: 'El teléfono solo puede contener números, espacios, +, - y ()'
            };
        }
        
        // Validaciones específicas para Argentina
        if (cleaned.startsWith('11') && cleaned.length === 10) {
            // Teléfono celular de Buenos Aires (ej: 1152298113)
            return {
                valid: true,
                message: 'Teléfono válido'
            };
        }
        
        if (cleaned.startsWith('0') && cleaned.length >= 10) {
            // Teléfono fijo con código de área
            return {
                valid: true,
                message: 'Teléfono válido'
            };
        }
        
        if (cleaned.startsWith('54') && cleaned.length >= 11) {
            // Teléfono con código de país
            return {
                valid: true,
                message: 'Teléfono válido'
            };
        }
        
        // Si no cumple con los formatos específicos pero tiene entre 8 y 15 dígitos
        if (cleaned.length >= 8 && cleaned.length <= 15) {
            return {
                valid: true,
                message: 'Teléfono válido'
            };
        }
        
        return {
            valid: false,
            message: 'El formato del teléfono no es válido para Argentina'
        };
    }

    // Función para formatear teléfono mientras se escribe (opcional)
    function formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 2) {
            // Solo código de área o celular
            input.value = value;
        } else if (value.length <= 6) {
            // Código + primeros dígitos
            input.value = value.replace(/^(\d{2})(\d{1,4})/, '$1-$2');
        } else if (value.length <= 10) {
            // Formato completo sin país
            input.value = value.replace(/^(\d{2})(\d{4})(\d{1,4})/, '$1-$2-$3');
        } else {
            // Con código de país
            input.value = value.replace(/^(\d{2})(\d{2})(\d{4})(\d{1,4})/, '+$1 $2-$3-$4');
        }
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

    // Validación en tiempo real para todos los campos
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
            } else if (this.value) {
                this.style.borderColor = '#28a745'; // Verde si es válido
            }
        });
    }

    // VALIDACIÓN MEJORADA PARA TELÉFONO EN TIEMPO REAL
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        // Validación al perder el foco
        telefonoInput.addEventListener('blur', function() {
            if (this.value) {
                const phoneValidation = validatePhone(this.value);
                if (!phoneValidation.valid) {
                    showMessage(phoneValidation.message, 'error');
                    this.style.borderColor = 'var(--rojo)';
                } else {
                    this.style.borderColor = '#28a745'; // Verde si es válido
                }
            }
        });

        // Validación mientras se escribe (con formato automático)
        telefonoInput.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
            
            // Auto-formato opcional (comentar si no se desea)
            // formatPhone(this);
        });

        // Prevenir caracteres no numéricos (opcional)
        telefonoInput.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.keyCode);
            // Permitir números, +, espacios, -, paréntesis
            if (!/[\d\s\-+()]/.test(char) && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        });

        // Validación de longitud mientras se escribe
        telefonoInput.addEventListener('keyup', function() {
            const cleaned = this.value.replace(/[\s\-+()]/g, '');
            const phoneValidation = validatePhone(this.value);
            
            // Mostrar indicador de longitud
            if (cleaned.length < 8 && this.value.length > 0) {
                this.style.borderColor = '#ffc107'; // Amarillo (pocos dígitos)
            } else if (phoneValidation.valid) {
                this.style.borderColor = '#28a745'; // Verde (válido)
            }
        });
    }

    // Validación de longitud mínima para mensaje
    const mensajeInput = document.getElementById('mensaje');
    if (mensajeInput) {
        mensajeInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 10) {
                showMessage('El mensaje debe tener al menos 10 caracteres', 'error');
                this.style.borderColor = 'var(--rojo)';
            } else if (this.value) {
                this.style.borderColor = '#28a745';
            }
        });
    }

    // Validación de checkbox en tiempo real
    const terminosCheckbox = document.getElementById('terminos');
    if (terminosCheckbox) {
        terminosCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                this.parentElement.style.borderColor = 'var(--rojo)';
            } else {
                this.parentElement.style.borderColor = '#28a745';
            }
        });
    }
});