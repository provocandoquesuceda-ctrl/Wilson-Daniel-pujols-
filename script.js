// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

// Cerrar menú al hacer clic en un enlace
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// Smooth scroll para navegación interna
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Analytics - Rastrear eventos
function trackEvent(eventName, eventData = {}) {
  console.log(`Evento: ${eventName}`, eventData);
}

// Rastrear clics en botones
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function() {
    trackEvent('click_button', { 
      button: this.textContent,
      href: this.href 
    });
  });
});

// Rastrear cuando se accede a la página
window.addEventListener('load', () => {
  trackEvent('page_loaded', {
    page: window.location.pathname,
    referrer: document.referrer
  });
});

// Animación de scroll reveal
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar elementos de sección
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'all 0.6s ease-out';
  observer.observe(section);
});

// Progressive Web App - Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('Service Worker registrado correctamente');
    }).catch(err => {
      console.log('Service Worker no registrado:', err);
    });
  });
}

// Detectar conexión offline
window.addEventListener('offline', () => {
  console.log('Conexión perdida - Modo offline activado');
});

window.addEventListener('online', () => {
  console.log('Conexión restaurada');
});

// Detección de navegador
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = 'Desconocido';
  
  if (userAgent.indexOf('Chrome') > -1) browserName = 'Chrome';
  else if (userAgent.indexOf('Safari') > -1) browserName = 'Safari';
  else if (userAgent.indexOf('Firefox') > -1) browserName = 'Firefox';
  
  return {
    browser: browserName,
    platform: navigator.platform,
    language: navigator.language
  };
}

// Información de dispositivo
function getDeviceInfo() {
  return {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isOnline: navigator.onLine,
    storage: navigator.storage ? 'Disponible' : 'No disponible'
  };
}

console.log('Información del dispositivo:', getDeviceInfo());
console.log('Información del navegador:', getBrowserInfo());

// Cargar manifest para PWA
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadManifest);
} else {
  loadManifest();
}

function loadManifest() {
  const link = document.querySelector('link[rel="manifest"]');
  if (link) {
    console.log('PWA Manifest cargado');
  }
}
