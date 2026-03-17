<script setup></script>
<template>
  <div class="container">
    <h1>Productos</h1>
    <p>Bienvenido al dashboard de productos.</p>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  width: min(100%, 1100px);
  margin: 0 auto;
  padding: 28px;
  display: grid;
  align-content: start;
  gap: 8px;
  background:
    radial-gradient(650px 280px at 90% 0%, rgba(34, 197, 94, 0.14), transparent 60%),
    linear-gradient(135deg, #f8fafc, #ecfeff);
}

h1 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  color: #0f172a;
}

p {
  margin: 0;
  color: #334155;
  font-size: 15px;
}

@media (max-width: 768px) {
  .container {
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 14px;
  }

  p {
    font-size: 14px;
  }
}
</style>
