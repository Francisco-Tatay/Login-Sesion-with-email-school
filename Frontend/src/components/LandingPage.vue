<script setup>
document.title = "Inicio";

const options = [
  {
    title: "Iniciar sesion",
    description: "Entra con tu correo y contrasena para acceder a tu cuenta.",
    to: "/login",
    badge: "Acceso",
  },
  {
    title: "Crear cuenta",
    description: "Registrate para empezar con un usuario nuevo en segundos.",
    to: "/register",
    badge: "Nuevo",
  },
  {
    title: "login-delete",
    description: "Prueba visual del flujo de baja antes de conectar store/composables.",
    to: "/login/delete",
    badge: "Testing",
  },
  {
    title:"Dashboard",
    description:"Vista previa del dashboard, sin proteccion de rutas ni datos reales.",
    to:"/dashboard",
    badge:"Dashboard"
  }
];
</script>

<template>
  <main class="landing-page">
    <div class="shape shape-a"></div>
    <div class="shape shape-b"></div>

    <section class="hero">
      <p class="eyebrow">Portal de usuario</p>
      <h1>Elige una accion para comenzar</h1>
      <p class="subtitle">Desde aqui tienes las 3 opciones principales al abrir la aplicacion.</p>
    </section>

    <section class="option-grid">
      <RouterLink v-for="option in options" :key="option.title" :to="option.to" class="option-card">
        <span class="badge">{{ option.badge }}</span>
        <h2>{{ option.title }}</h2>
        <p>{{ option.description }}</p>
        <span class="cta">Ir ahora</span>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  padding: 28px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(900px 480px at -10% -10%, rgba(244, 114, 182, 0.18), transparent 60%),
    radial-gradient(700px 420px at 110% 10%, rgba(59, 130, 246, 0.2), transparent 55%),
    linear-gradient(140deg, #fff7ed, #eff6ff 52%, #f8fafc);
}

.shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(36px);
  pointer-events: none;
}

.shape-a {
  width: clamp(220px, 30vw, 360px);
  height: clamp(220px, 30vw, 360px);
  background: rgba(251, 146, 60, 0.22);
  left: -120px;
  bottom: -100px;
}

.shape-b {
  width: clamp(260px, 34vw, 420px);
  height: clamp(260px, 34vw, 420px);
  background: rgba(14, 165, 233, 0.2);
  right: -120px;
  top: -120px;
}

.hero {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.eyebrow {
  margin: 0;
  color: #be185d;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
}

h1 {
  margin: 10px 0 8px;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.08;
  color: #1e293b;
}

.subtitle {
  margin: 0;
  color: #475569;
  font-size: clamp(14px, 2.4vw, 17px);
}

.option-grid {
  margin: 30px auto 0;
  max-width: 1020px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  position: relative;
  z-index: 1;
}

.option-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 18px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 8px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.option-card:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.44);
  box-shadow: 0 20px 42px rgba(37, 99, 235, 0.18);
}

.badge {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ecfeff;
  color: #155e75;
  font-size: 12px;
  font-weight: 700;
}

h2 {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}

.option-card p {
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.45;
}

.cta {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
}

@media (max-width: 900px) {
  .option-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .landing-page {
    padding: 20px;
  }

  .option-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .option-card {
    padding: 16px;
  }
}
</style>
