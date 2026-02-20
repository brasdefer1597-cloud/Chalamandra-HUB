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

  var params = new URLSearchParams(location.search);
  if (params.get('access') === ACCESS_KEY) {
    setCookie(COOKIE_KEY, 'true', 30);
    localStorage.setItem('pudin_access', 'true');
  }

  window.chalamandra = window.chalamandra || {};
  window.chalamandra.isPudinActive = function () {
    return getCookie(COOKIE_KEY) === 'true' || localStorage.getItem('pudin_access') === 'true';
  };

  var link = document.createElement('link');
  link.rel = 'icon';
  link.href = HUB_URL + '/salamandra.svg';
  document.head.appendChild(link);

  var brand = document.createElement('link');
  brand.rel = 'stylesheet';
  brand.href = HUB_URL + '/brand.css';
  document.head.appendChild(brand);

  var btn = document.createElement('a');
  btn.href = HUB_URL;
  btn.className = 'chalamandra-return-btn';
  btn.textContent = '← Volver al Sistema Central';
  document.body.appendChild(btn);
})();
