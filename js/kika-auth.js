
import { supabase } from "./supabase.js";

const AUTH_CONTAINER_ID = "kh-auth";

function showMessage(message, isError = false) {
  const element = document.getElementById("kh-auth-message");

  if (!element) return;

  element.textContent = message;
  element.style.color = isError ? "#ff7777" : "#39ed91";
}

function renderAuth() {
  if (document.getElementById(AUTH_CONTAINER_ID)) return;

  const host = document.getElementById("kika-host");
  if (!host) return;

  const container = document.createElement("div");
  container.id = AUTH_CONTAINER_ID;

  container.innerHTML = `
    <div class="kh-card">
      <h3>CUENTA KIKA HOST</h3>
      <p>Ingresá o creá tu cuenta para continuar.</p>

      <label for="kh-auth-email">Correo electrónico</label>
      <input
        id="kh-auth-email"
        type="email"
        autocomplete="email"
        placeholder="tu@email.com"
      >

      <label for="kh-auth-password">Contraseña</label>
      <input
        id="kh-auth-password"
        type="password"
        autocomplete="current-password"
        placeholder="Tu contraseña"
      >

      <button class="kh-primary" id="kh-login">
        INICIAR SESIÓN
      </button>

      <button class="kh-primary" id="kh-register">
        CREAR CUENTA
      </button>

      <p id="kh-auth-message" role="status" aria-live="polite"></p>

      <button class="kh-primary" id="kh-logout" hidden>
        CERRAR SESIÓN
      </button>
    </div>
  `;

  host.querySelector(".kh-wrapper").prepend(container);

  document.getElementById("kh-login").addEventListener("click", login);
  document.getElementById("kh-register").addEventListener("click", register);
  document.getElementById("kh-logout").addEventListener("click", logout);
}

function getCredentials() {
  const email = document.getElementById("kh-auth-email").value.trim();
  const password = document.getElementById("kh-auth-password").value;

  if (!email || !password) {
    showMessage("Completá el correo y la contraseña.", true);
    return null;
  }

  if (password.length < 8) {
    showMessage("La contraseña debe tener al menos 8 caracteres.", true);
    return null;
  }

  return { email, password };
}

async function login() {
  const credentials = getCredentials();
  if (!credentials) return;

  showMessage("Iniciando sesión...");

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    showMessage(error.message, true);
    return;
  }

  showMessage("Sesión iniciada correctamente.");
  updateAuthUI();
}

async function register() {
  const credentials = getCredentials();
  if (!credentials) return;

  showMessage("Creando cuenta...");

  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    showMessage(error.message, true);
    return;
  }

  if (!data.session) {
    showMessage("Revisá tu correo para confirmar la cuenta.");
    return;
  }

  showMessage("Cuenta creada correctamente.");
  updateAuthUI();
}

async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    showMessage(error.message, true);
    return;
  }

  showMessage("Sesión cerrada.");
  updateAuthUI();
}

async function updateAuthUI() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    showMessage("No se pudo verificar la sesión.", true);
    return;
  }

  const loggedIn = Boolean(data.user);

  document.getElementById("kh-login").hidden = loggedIn;
  document.getElementById("kh-register").hidden = loggedIn;
  document.getElementById("kh-logout").hidden = !loggedIn;

  document.getElementById("kh-auth-email").disabled = loggedIn;
  document.getElementById("kh-auth-password").disabled = loggedIn;

  if (loggedIn) {
    showMessage("Conectado como " + data.user.email);
  }
}

async function initAuth() {
  renderAuth();

  await updateAuthUI();

  supabase.auth.onAuthStateChange(() => {
    updateAuthUI();
  });
}

initAuth();
