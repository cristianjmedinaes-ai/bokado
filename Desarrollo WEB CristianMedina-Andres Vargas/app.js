document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dinamismo del Header y Scroll ---
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Buscador y Filtrado de Categorías (INDEX.HTML) ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');

    if (searchInput && cards.length > 0) {
        const categoryRoutes = [
            { url: 'comidallanera.html', keywords: ['mamona', 'carne', 'perra', 'tungo', 'hayaca', 'llanera', 'tradicion', 'asado', 'chiguiro'] },
            { url: 'comidadelmar.html', keywords: ['pescado', 'mar', 'rio', 'ceviche', 'mojarra', 'cazuela', 'mariscos', 'camarones'] },
            { url: 'almuerzoydesayunos.html', keywords: ['desayuno', 'almuerzo', 'caldo', 'ejecutivo', 'corriente', 'dia', 'sopa'] },
            { url: 'comidasrapidas.html', keywords: ['hamburguesa', 'perro', 'pizza', 'rapida', 'papas', 'salchipapa', 'perros', 'burguer'] },
            { url: 'comidamexicana.html', keywords: ['taco', 'tacos', 'burrito', 'quesadilla', 'nacho', 'mexicana', 'pico de gallo', 'guacamole'] },
            { url: 'postreriaypasteleria.html', keywords: ['postre', 'cafe', 'torta', 'helado', 'dulce', 'pasteleria', 'muffin', 'donas'] },
            { url: 'experienciasnuevas.html', keywords: ['experiencia', 'nuevo', 'destacado', 'gourmet', 'autor'] }
        ];

        function filterCategories() {
            const query = searchInput.value.toLowerCase().trim();
            let matchesCount = 0;

            cards.forEach(card => {
                const title = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent.toLowerCase() : '';
                const subtext = card.querySelector('.card-subtext') ? card.querySelector('.card-subtext').textContent.toLowerCase() : '';
                const badge = card.querySelector('.card-badge') ? card.querySelector('.card-badge').textContent.toLowerCase() : '';

                if (title.includes(query) || subtext.includes(query) || badge.includes(query)) {
                    card.style.display = 'block';
                    matchesCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResults) noResults.style.display = matchesCount === 0 ? 'block' : 'none';
        }

        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) return;

            const targetCategory = categoryRoutes.find(route =>
                route.keywords.some(keyword => query.includes(keyword) || keyword.includes(query))
            );

            if (targetCategory) {
                window.location.href = `${targetCategory.url}?search=${encodeURIComponent(query)}`;
            } else {
                const visibleCard = Array.from(cards).find(card => card.style.display !== 'none');
                if (visibleCard) {
                    window.location.href = visibleCard.getAttribute('href');
                }
            }
        }

        searchInput.addEventListener('input', filterCategories);
        if (searchBtn) searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // --- 3. Menú Lateral Desplegable ---
    const openBtn = document.getElementById('openMenuBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('menuOverlay');

    function abrirMenu() {
        if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarMenu() {
        if (drawer && overlay) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (openBtn) openBtn.addEventListener('click', abrirMenu);
    if (closeBtn) closeBtn.addEventListener('click', cerrarMenu);
    if (overlay) overlay.addEventListener('click', cerrarMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarMenu();
    });

    // --- 4. Modal de Autenticación (Login / Registro) ---
    const authModalOverlay = document.getElementById('authModalOverlay');
    const btnOpenLogin = document.getElementById('btnOpenLogin');
    const btnOpenRegister = document.getElementById('btnOpenRegister');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const regToggle = document.getElementById('reg-toggle');

    function abrirModal(esRegistro = false) {
    if (authModalOverlay && regToggle) {
        regToggle.checked = esRegistro;
        
        // Resetear la visibilidad de los formularios dentro del modal
        if (loginForm) loginForm.style.display = 'block';
        if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        if (verifyOtpForm) verifyOtpForm.style.display = 'none';

        authModalOverlay.classList.add('active');
        cerrarMenu();
    }
    }

    function cerrarModal() {
        if (authModalOverlay) {
            authModalOverlay.classList.remove('active');
        }
    }

    if (btnOpenLogin) {
        btnOpenLogin.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(false);
        });
    }

    if (btnOpenRegister) {
        btnOpenRegister.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(true);
        });
    }

    if (closeAuthModal) closeAuthModal.addEventListener('click', cerrarModal);

    if (authModalOverlay) {
        authModalOverlay.addEventListener('click', (e) => {
            if (e.target === authModalOverlay) cerrarModal();
        });
    }

  // --- 5. Integración con Supabase (Registro, Login y Logout) ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btnLogout = document.getElementById('btnLogout');

    const authMenuContainer = document.getElementById('authMenuContainer');
    const userLoggedContainer = document.getElementById('userLoggedContainer');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    async function verificarSesion() {
        if (typeof supabaseClient === 'undefined') return;
        const { data: { session } } = await supabaseClient.auth.getSession();
        actualizarUI(session?.user || null);
    }

    function actualizarUI(user) {
        if (user) {
            if (authMenuContainer) authMenuContainer.style.display = 'none';
            if (userLoggedContainer) userLoggedContainer.style.display = 'block';
            if (userEmailDisplay) userEmailDisplay.textContent = user.email;
        } else {
            if (authMenuContainer) authMenuContainer.style.display = 'flex';
            if (userLoggedContainer) userLoggedContainer.style.display = 'none';
        }
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const name = document.getElementById('registerName').value;

            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: { data: { full_name: name } }
            });

            if (error) {
                alert('Error al registrarse: ' + error.message);
            } else {
                alert('¡Registro exitoso! Iniciando sesión...');
                actualizarUI(data.user);
                cerrarModal();
                registerForm.reset();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                alert('Error al iniciar sesión: ' + error.message);
            } else {
                alert('¡Bienvenido a BOKADO!');
                actualizarUI(data.user);
                cerrarModal();
                loginForm.reset();
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                alert('Error al cerrar sesión: ' + error.message);
            } else {
                alert('Sesión cerrada correctamente.');
                actualizarUI(null);
            }
        });
    }

    if (typeof supabaseClient !== 'undefined') {
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            actualizarUI(session?.user || null);
        });
        verificarSesion();
    }
});
// --- FUNCIONALIDAD 1: Mostrar / Ocultar Contraseña ---
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

togglePasswordButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            btn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            btn.textContent = '👁️';
        }
    });
});

// --- FUNCIONALIDAD 2: Recuperación de Contraseña con Código (OTP) ---
const btnForgotPassword = document.getElementById('btnForgotPassword');
const btnBackToLogin = document.getElementById('btnBackToLogin');
const loginForm = document.getElementById('loginForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const verifyOtpForm = document.getElementById('verifyOtpForm');

// Cambiar pantallas dentro del modal
if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
    });
}

if (btnBackToLogin) {
    btnBackToLogin.addEventListener('click', () => {
        forgotPasswordForm.style.display = 'none';
        verifyOtpForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
}

// 1. Enviar el código OTP al correo
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

        if (error) {
            alert('Error al enviar el código: ' + error.message);
        } else {
            alert('Se ha enviado un código de verificación a tu correo.');
            forgotPasswordForm.style.display = 'none';
            verifyOtpForm.style.display = 'block';
        }
    });
}

// 2. Verificar código e ingresar la nueva contraseña
if (verifyOtpForm) {
    verifyOtpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        const token = document.getElementById('otpToken').value;
        const newPassword = document.getElementById('newPassword').value;

        // Verificar el token enviado por correo
        const { data, error } = await supabaseClient.auth.verifyOtp({
            email: email,
            token: token,
            type: 'recovery'
        });

        if (error) {
            alert('Código inválido o expirado: ' + error.message);
            return;
        }

        // Actualizar la contraseña del usuario
        const { error: updateError } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            alert('Error al actualizar la contraseña: ' + updateError.message);
        } else {
            alert('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
            verifyOtpForm.style.display = 'none';
            loginForm.style.display = 'block';
            verifyOtpForm.reset();
            forgotPasswordForm.reset();
        }
    });
}
   document.head.appendChild(Object.assign(document.createElement('script'), { src: 'fx.js' }));
 