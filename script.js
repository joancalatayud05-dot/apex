// ── usarEjemplo global (fuera del DOMContentLoaded) ──
function usarEjemplo(el) {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = el.textContent;
  chatInput.focus();
}

document.addEventListener('DOMContentLoaded', () => {

  // ── INTRO ──
  const intro    = document.getElementById('intro');
  const introBtn = document.getElementById('intro-btn');
  let introCerrada = false;

  function cerrarIntro() {
    if (introCerrada) return;
    introCerrada = true;
    const sonido = new Audio('audios/motor.mp3');
    sonido.volume = 0.4;
    sonido.play().catch(() => {});
    intro.classList.add('oculto');
    setTimeout(() => { intro.style.display = 'none'; }, 600);
  }

  introBtn.addEventListener('click', cerrarIntro);
  setTimeout(cerrarIntro, 4000);

  // ── CURSOR ──
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animarAnillo() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animarAnillo);
  }
  animarAnillo();

  // ── HOVER ──
  const hoverables = document.querySelectorAll('a, .card, .feature, .btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // ── REVEAL AL SCROLL ──
  const reveals  = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));

  // ── PARALLAX ──
  const heroCarWrap = document.querySelector('.hero-car');
  const heroTitle   = document.querySelector('.hero-title');
  const heroSub     = document.querySelector('.hero-sub');
  const hero        = document.querySelector('.hero');

  window.scrollTo({ top: 0, behavior: 'instant' });

  window.addEventListener('scroll', () => {
    const scroll     = window.scrollY;
    const heroHeight = hero.offsetHeight;
    if (scroll <= heroHeight) {
      heroCarWrap.style.transform = `translateY(${scroll * 0.4}px)`;
      heroTitle.style.transform   = `translateY(${scroll * 0.15}px)`;
      heroSub.style.transform     = `translateY(${scroll * 0.1}px)`;
    }
  });

  // ── SELECTOR DE COCHES ──
  const cards         = document.querySelectorAll('.card');
  const heroCarImg    = document.querySelector('.hero-car img');
  const heroEyebrow   = document.querySelector('.hero-eyebrow');
  const statVelocidad = document.querySelectorAll('.stat-num')[0];
  const statCero      = document.querySelectorAll('.stat-num')[1];
  const statCv        = document.querySelectorAll('.stat-num')[2];

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const nombre    = card.dataset.nombre;
      const marca     = card.dataset.marca;
      const cv        = card.dataset.cv;
      const velocidad = card.dataset.velocidad;
      const cero      = card.dataset.cero;
      const imagen    = card.dataset.imagen;

      heroCarImg.style.opacity    = '0';
      heroCarImg.style.transition = 'opacity 0.4s ease';

      setTimeout(() => {
        heroCarImg.src          = imagen;
        heroTitle.innerHTML     = nombre.toUpperCase().replace(' ', '<br>');
        heroEyebrow.textContent = '// ' + marca + ' — Seleccionado';
        statVelocidad.innerHTML = velocidad + '<span>km/h</span>';
        statCero.innerHTML      = cero + '<span>s</span>';
        statCv.innerHTML        = cv + '<span>cv</span>';
        heroCarImg.style.opacity = '0.45';
      }, 400);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── TACÓMETRO ──
  const tachoAguja     = document.getElementById('tacho-aguja');
  const tachoArco      = document.getElementById('tacho-arco');
  const tachoVelocidad = document.getElementById('tacho-velocidad');
  const tachoCv        = document.getElementById('tacho-cv');
  const tachoCero      = document.getElementById('tacho-cero');
  const tachoSection   = document.getElementById('tachometro');

  let tachoAnimado   = false;
  const velocidadMax = 420;
  const cvMax        = 1500;
  const ceroMax      = 2.4;
  const longitudArco = 534;

  function animarTacho() {
    if (tachoAnimado) return;
    tachoAnimado = true;

    const duracion = 2000;
    const inicio   = performance.now();

    function step(ahora) {
      const elapsed  = ahora - inicio;
      const progreso = Math.min(elapsed / duracion, 1);
      const eased    = 1 - Math.pow(1 - progreso, 3);

      tachoAguja.style.transform      = `rotate(${-120 + eased * 240}deg)`;
      tachoArco.style.strokeDasharray = `${longitudArco * eased} ${longitudArco}`;
      tachoVelocidad.textContent      = Math.round(eased * velocidadMax);
      tachoCv.textContent             = Math.round(eased * cvMax);
      tachoCero.textContent           = (ceroMax + (10 - ceroMax) * (1 - eased)).toFixed(1);

      if (progreso < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const tachoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) animarTacho(); });
  }, { threshold: 0.3 });
  tachoObserver.observe(tachoSection);

  // ── COMPARADOR ──
  const selectA   = document.getElementById('select-a');
  const selectB   = document.getElementById('select-b');
  const resultado = document.getElementById('comp-resultado');

  function parsearCoche(val) {
    const [marca, nombre, cv, vel, cero] = val.split('|');
    return { marca, nombre, cv: +cv, vel: +vel, cero: +cero };
  }

  function fila(label, valA, valB, max, unidad, menorEsMejor = false, id) {
    const ganaA = menorEsMejor ? valA <= valB : valA >= valB;
    const ganaB = menorEsMejor ? valB <= valA : valB >= valA;

    return `
      <div class="comp-bloque">
        <p class="comp-label">${label}</p>
        <div class="comp-fila">
          <div class="comp-valor-wrap izq">
            <div class="comp-valor ${ganaA ? 'ganador' : ''}">${valA}<small> ${unidad}</small></div>
            <div class="comp-barra-wrap">
              <div class="comp-barra" id="barra-${id}-a"></div>
            </div>
          </div>
          <div class="comp-centro">—</div>
          <div class="comp-valor-wrap">
            <div class="comp-barra-wrap">
              <div class="comp-barra" id="barra-${id}-b"></div>
            </div>
            <div class="comp-valor ${ganaB ? 'ganador' : ''}">${valB}<small> ${unidad}</small></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderComparador() {
    if (!selectA.value || !selectB.value) return;

    const a = parsearCoche(selectA.value);
    const b = parsearCoche(selectB.value);

    const maxCv   = Math.max(a.cv, b.cv);
    const maxVel  = Math.max(a.vel, b.vel);
    const maxCero = Math.max(a.cero, b.cero);

    resultado.innerHTML = `
      <div class="comp-grid">
        <div class="comp-nombres">
          <div class="comp-nombre izq"><small>${a.marca}</small>${a.nombre}</div>
          <div class="comp-separador">VS</div>
          <div class="comp-nombre der"><small>${b.marca}</small>${b.nombre}</div>
        </div>
        ${fila('Potencia', a.cv, b.cv, maxCv, 'cv', false, 'cv')}
        ${fila('Velocidad Máx', a.vel, b.vel, maxVel, 'km/h', false, 'vel')}
        ${fila('0–100 km/h', a.cero, b.cero, maxCero, 's', true, 'cero')}
      </div>
    `;

    setTimeout(() => {
      document.getElementById('barra-cv-a').style.width   = (a.cv / maxCv * 100) + '%';
      document.getElementById('barra-cv-b').style.width   = (b.cv / maxCv * 100) + '%';
      document.getElementById('barra-vel-a').style.width  = (a.vel / maxVel * 100) + '%';
      document.getElementById('barra-vel-b').style.width  = (b.vel / maxVel * 100) + '%';
      document.getElementById('barra-cero-a').style.width = (a.cero / maxCero * 100) + '%';
      document.getElementById('barra-cero-b').style.width = (b.cero / maxCero * 100) + '%';
    }, 50);
  }

  selectA.addEventListener('change', renderComparador);
  selectB.addEventListener('change', renderComparador);

  // ── EASTER EGG ──
  const codigoSecreto = 'APEX';
  let teclasPulsadas  = '';

  document.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT') return;
    teclasPulsadas += e.key.toUpperCase();
    if (teclasPulsadas.length > codigoSecreto.length) {
      teclasPulsadas = teclasPulsadas.slice(-codigoSecreto.length);
    }
    if (teclasPulsadas === codigoSecreto) {
      activarEasterEgg();
      teclasPulsadas = '';
    }
  });

  function activarEasterEgg() {
    const overlay = document.createElement('div');
    overlay.id    = 'easter-egg';
    overlay.innerHTML = `
      <div class="egg-contenido">
        <div class="egg-logo">AP<span>E</span>X</div>
        <p class="egg-texto">Has encontrado el secreto.</p>
        <p class="egg-sub">Solo los más rápidos llegan hasta aquí.</p>
        <button class="egg-btn" onclick="document.getElementById('easter-egg').remove()">CERRAR</button>
      </div>
    `;
    document.body.appendChild(overlay);
    lanzarConfeti();
    setTimeout(() => {
      const el = document.getElementById('easter-egg');
      if (el) el.remove();
    }, 6000);
  }

  function lanzarConfeti() {
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const particula           = document.createElement('div');
        particula.className       = 'confeti';
        particula.style.left      = Math.random() * 100 + 'vw';
        particula.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        particula.style.animationDelay   = Math.random() * 0.5 + 's';
        particula.style.width     = (6 + Math.random() * 8) + 'px';
        particula.style.height    = (6 + Math.random() * 8) + 'px';
        particula.style.background = Math.random() > 0.5 ? '#e8001c' : '#f0ede8';
        document.body.appendChild(particula);
        setTimeout(() => particula.remove(), 3000);
      }, i * 20);
    }
  }

  // ── MODO LLUVIA ──
  let lluviaActiva  = false;
  let gotasInterval = null;

  document.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (e.key.toLowerCase() === 'r' && document.activeElement.tagName !== 'SELECT') {
      lluviaActiva ? pararLluvia() : activarLluvia();
    }
  });

  function activarLluvia() {
    lluviaActiva = true;
    document.body.classList.add('lluvia');

    gotasInterval = setInterval(() => {
      const gota              = document.createElement('div');
      gota.className          = 'gota';
      gota.style.left         = Math.random() * 100 + 'vw';
      gota.style.animationDuration = (0.4 + Math.random() * 0.6) + 's';
      gota.style.animationDelay   = Math.random() * 0.2 + 's';
      gota.style.height       = (10 + Math.random() * 20) + 'px';
      gota.style.opacity      = (0.2 + Math.random() * 0.4);
      document.body.appendChild(gota);
      setTimeout(() => gota.remove(), 1000);
    }, 30);
  }

  function pararLluvia() {
    lluviaActiva = false;
    document.body.classList.remove('lluvia');
    clearInterval(gotasInterval);
    document.querySelectorAll('.gota').forEach(g => g.remove());
  }

  // ── EFECTO VELOCIDAD ──
  const btnGarage = document.querySelector('.btn-primary');

  btnGarage.addEventListener('click', e => {
    e.preventDefault();

    const overlay  = document.createElement('canvas');
    overlay.id     = 'velocidad-overlay';
    overlay.width  = window.innerWidth;
    overlay.height = window.innerHeight;
    document.body.appendChild(overlay);

    const ctx       = overlay.getContext('2d');
    let progreso    = 0;
    let scrollHecho = false;

    function dibujarBlur(intensidad) {
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      const numLineas = Math.floor(120 * intensidad);

      for (let i = 0; i < numLineas; i++) {
        const y        = Math.random() * overlay.height;
        const largo    = (100 + Math.random() * overlay.width) * intensidad;
        const x        = Math.random() * overlay.width;
        const grosor   = 0.5 + Math.random() * 2;
        const opacidad = (0.05 + Math.random() * 0.15) * intensidad;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + largo, y);
        ctx.strokeStyle = `rgba(255,255,255,${opacidad})`;
        ctx.lineWidth   = grosor;
        ctx.stroke();
      }

      const grad = ctx.createLinearGradient(0, 0, overlay.width, 0);
      grad.addColorStop(0,   `rgba(8,8,8,${0.6 * intensidad})`);
      grad.addColorStop(0.3, 'transparent');
      grad.addColorStop(0.7, 'transparent');
      grad.addColorStop(1,   `rgba(8,8,8,${0.6 * intensidad})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, overlay.width, overlay.height);
    }

    const duracion = 800;
    const inicio   = performance.now();

    function scrollSuaveRapido(destino) {
      const inicio_scroll   = window.scrollY;
      const distancia       = destino - inicio_scroll;
      const duracion_scroll = 600;
      const inicio_tiempo   = performance.now();

      function paso(ahora) {
        const elapsed  = ahora - inicio_tiempo;
        const progreso = Math.min(elapsed / duracion_scroll, 1);
        const eased    = 1 - Math.pow(1 - progreso, 4);
        window.scrollTo(0, inicio_scroll + distancia * eased);
        if (progreso < 1) requestAnimationFrame(paso);
      }

      requestAnimationFrame(paso);
    }

    function animar(ahora) {
      const elapsed    = ahora - inicio;
      progreso         = Math.min(elapsed / duracion, 1);
      const intensidad = Math.sin(progreso * Math.PI);

      dibujarBlur(intensidad);

      if (!scrollHecho && progreso > 0.4) {
        scrollHecho = true;
        scrollSuaveRapido(document.getElementById('garage').offsetTop);
      }

      if (progreso < 1) {
        requestAnimationFrame(animar);
      } else {
        overlay.remove();
      }
    }

    requestAnimationFrame(animar);
  });

  // ── MODO CONDUCCIÓN ──
  let conduccionActiva = false;

  document.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (e.key.toLowerCase() === 'c' && document.activeElement.tagName !== 'SELECT') {
      conduccionActiva ? pararConduccion() : activarConduccion();
    }
  });

  function activarConduccion() {
    conduccionActiva = true;
    document.body.classList.add('conduccion');
    const indicador     = document.createElement('div');
    indicador.id        = 'conduccion-indicador';
    indicador.innerHTML = '// MODO CONDUCCIÓN ACTIVO — PULSA C PARA SALIR';
    document.body.appendChild(indicador);
  }

  function pararConduccion() {
    conduccionActiva               = false;
    document.body.style.transform  = '';
    document.body.style.transition = '';
    document.body.classList.remove('conduccion');
    const indicador = document.getElementById('conduccion-indicador');
    if (indicador) indicador.remove();
  }

  document.addEventListener('mousemove', e => {
    if (!conduccionActiva) return;

    const cx     = window.innerWidth / 2;
    const cy     = window.innerHeight / 2;
    const dx     = (e.clientX - cx) / cx;
    const dy     = (e.clientY - cy) / cy;
    const rotZ   = dx * 4;
    const rotX   = -dy * 3;
    const transX = dx * 15;

    document.body.style.transition = 'transform 0.15s ease';
    document.body.style.transform  = `perspective(1200px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) translateX(${transX}px)`;

    if (heroCarImg) {
      heroCarImg.style.transition = 'transform 0.15s ease';
      heroCarImg.style.transform  = `translateX(${-dx * 25}px) translateY(${-dy * 10}px)`;
    }
  });

  // ── MECÁNICO IA ──
  const chatInput    = document.getElementById('chat-input');
  const chatBtn      = document.getElementById('chat-btn');
  const chatMensajes = document.getElementById('chat-mensajes');
  const historial    = [];

  function añadirMensaje(rol, texto) {
    const msg       = document.createElement('div');
    msg.className   = `chat-msg ${rol === 'user' ? 'usuario' : rol === 'loading' ? 'cargando' : 'asistente'}`;
    msg.innerHTML   = `
      <span class="chat-autor">${rol === 'user' ? 'TÚ' : 'MECÁNICO'}</span>
      <p>${texto}</p>
    `;
    chatMensajes.appendChild(msg);
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
    return msg;
  }

  async function enviarMensaje() {
    const texto = chatInput.value.trim();
    if (!texto) return;

    chatInput.value  = '';
    chatBtn.disabled = true;

    añadirMensaje('user', texto);
    historial.push({ role: 'user', content: texto });

    const msgCargando = añadirMensaje('loading', 'Analizando...');

    try {
      const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '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',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-request-header': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          system: `Eres el mecánico experto de APEX, una web de superdeportivos.
            Respondes en español, de forma directa y técnica pero accesible.
            Eres apasionado de los coches de alta gama, la F1, y la ingeniería mecánica.
            Usas un tono cercano pero profesional. Nunca te sales del tema de los coches.
            Tus respuestas son concisas, máximo 3-4 frases.`,
          messages: historial
        })
      });

      const data          = await respuesta.json();
      const textoRespuesta = data.content[0].text;

      msgCargando.remove();
      añadirMensaje('assistant', textoRespuesta);
      historial.push({ role: 'assistant', content: textoRespuesta });

    } catch (error) {
      msgCargando.remove();
      añadirMensaje('assistant', 'Error de conexión. Revisa la consola.');
      console.error(error);
    }

    chatBtn.disabled = false;
  }

  chatBtn.addEventListener('click', enviarMensaje);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') enviarMensaje();
  });

});