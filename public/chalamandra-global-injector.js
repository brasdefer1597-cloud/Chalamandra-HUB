(function () {
  var HUB_URL = 'https://chalamandra-hub.vercel.app';
  var ACCESS_KEY = 'pudin';
  var COOKIE_KEY = 'chalamandra_admin';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var host = location.hostname;
    var parts = host.split('.');
    var domain = parts.length > 2 ? '.' + parts.slice(-2).join('.') : host;
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;domain=' + domain;
  }

  function generarInsultoConLlave(llave) {
    var pool = [
      'Tu jugada fue un poema trágico.',
      'Ese movimiento confirmó mis sospechas sobre tu caos.',
      'Intentaste estrategia, obtuviste autogol cuántico.',
      'La reina bostezó cuando vio esa línea.'
    ];
    var seed = Number(String(llave).slice(-2)) || 0;
    return pool[seed % pool.length] + ' [' + llave + ']';
  }

  function renderOracleCountdown(txt) {
    var existing = document.getElementById('chalamandra-countdown');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'chalamandra-countdown';
      existing.style.cssText = 'position:fixed;top:12px;right:12px;z-index:99999;background:#050505dd;border:1px solid #ff2ea688;color:#ff2ea6;padding:6px 10px;font:700 12px monospace;letter-spacing:.05em;border-radius:8px;';
      document.body.appendChild(existing);
    }
    existing.textContent = 'LLAVE EXPIRA EN ' + txt;
  }

  function applyOracleGlitchByCountdown(rawCountdown) {
    var split = String(rawCountdown || '60:00').split(':');
    var mm = Number(split[0] || 60);
    var ss = Number(split[1] || 0);
    var left = (mm * 60) + ss;

    if (left <= 0) {
      document.documentElement.classList.add('hub-offline-mode');
      document.documentElement.style.filter = 'grayscale(1) contrast(0.7) blur(0.7px)';
      return;
    }

    if (left <= 600) {
      document.documentElement.style.filter = 'saturate(1.3) contrast(1.2) hue-rotate(-15deg)';
      document.documentElement.style.animation = 'chalamandraGlitch .35s steps(2,end) infinite';
    } else {
      document.documentElement.style.animation = '';
    }
  }

  function aplicarDegradacionAjedrez() {
    document.documentElement.style.filter = 'grayscale(1) contrast(0.9)';
    document.documentElement.classList.add('hub-offline-mode');

    if (!window.__chalamandraLagInterval) {
      window.__chalamandraLagInterval = window.setInterval(function () {
        var t = performance.now();
        while (performance.now() - t < 28) {
          // lag intencional leve
        }
      }, 3500);
    }
  }

  function configurarMotorConLlave(llave, poas) {
    var agresividad = poas > 1.0 ? 'MAX_TOXIC' : 'STANDARD';
    console.log('[CHALAMANDRA] Motor en modo: ' + agresividad + ' | Semilla: ' + llave);

    var dana = document.getElementById('dana-chat');
    if (dana) {
      dana.innerText = generarInsultoConLlave(llave);
    }

    document.documentElement.dataset.chalamandraMotor = agresividad;
    if (!document.documentElement.classList.contains('hub-offline-mode')) {
      document.documentElement.style.removeProperty('filter');
      document.documentElement.classList.remove('hub-offline-mode');
    }
  }

  // Lógica de Fidelidad en el Oráculo
  function registrarFidelidad(usuarioID) {
    var key = 'chalamandra_qbitz_' + String(usuarioID || 'anon');
    var qbitz = Number(localStorage.getItem(key) || 0);
    qbitz += 1;
    localStorage.setItem(key, String(qbitz));
    localStorage.setItem('chalamandra_qbitz', String(qbitz));

    if (qbitz >= 10) {
      mostrarBotonDorado('¡Felicidades! Has alcanzado Masa Crítica. Obtén tu recompensa aquí.');
    }

    return qbitz;
  }

  function mostrarBotonDorado(msg) {
    var wrap = document.getElementById('chalamandra-golden-kofi');
    if (!wrap) {
      wrap = document.createElement('a');
      wrap.id = 'chalamandra-golden-kofi';
      wrap.href = 'https://ko-fi.com/';
      wrap.target = '_blank';
      wrap.rel = 'noopener noreferrer';
      wrap.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99999;background:linear-gradient(90deg,#facc15,#f59e0b);color:#111;border:1px solid #fde047;padding:10px 12px;border-radius:9999px;font:700 12px sans-serif;text-decoration:none;box-shadow:0 0 20px #fbbf24aa;';
      document.body.appendChild(wrap);
    }
    wrap.textContent = msg;
  }

  var params = new URLSearchParams(location.search);
  if (params.get('access') === ACCESS_KEY) {
    setCookie(COOKIE_KEY, 'true', 30);
    localStorage.setItem('pudin_access', 'true');
  }

  window.chalamandra = window.chalamandra || {};
  window.chalamandra.isPudinActive = function () {
    return getCookie(COOKIE_KEY) === 'true' || localStorage.getItem('pudin_access') === 'true';
  };

  // Escuchando la frecuencia del HUB para Ajedrez y Oráculo
  window.addEventListener('chalamandra:hub-status', function (event) {
    var detail = event.detail || {};
    var status = detail.status || detail.system_status;
    var poas = Number(detail.poas || 0);
    var ultima_llave = String(detail.ultima_llave || '92028127');
    var countdown = String(detail.countdown || '60:00');

    renderOracleCountdown(countdown);
    applyOracleGlitchByCountdown(countdown);

    if (status === 'offline') {
      aplicarDegradacionAjedrez();
    } else {
      configurarMotorConLlave(ultima_llave, poas);
    }
  });

  var link = document.createElement('link');
  link.rel = 'icon';
  link.href = HUB_URL + '/salamandra.svg';
  document.head.appendChild(link);

  var brand = document.createElement('link');
  brand.rel = 'stylesheet';
  brand.href = HUB_URL + '/brand.css';
  document.head.appendChild(brand);

  var style = document.createElement('style');
  style.textContent = '@keyframes chalamandraGlitch{0%{transform:translate(0,0)}20%{transform:translate(-1px,1px)}40%{transform:translate(1px,-1px)}60%{transform:translate(-1px,-1px)}80%{transform:translate(1px,1px)}100%{transform:translate(0,0)}}';
  document.head.appendChild(style);

  var btn = document.createElement('a');
  btn.href = HUB_URL;
  btn.className = 'chalamandra-return-btn';
  btn.textContent = '← Volver al Sistema Central';
  document.body.appendChild(btn);

  window.chalamandra.configurarMotorConLlave = configurarMotorConLlave;
  window.chalamandra.aplicarDegradacionAjedrez = aplicarDegradacionAjedrez;
  window.chalamandra.registrarFidelidad = registrarFidelidad;
})();
