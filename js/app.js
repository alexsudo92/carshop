(function ($) {
  'use strict';

  var USERS_KEY = 'automarket_users';
  var AUTH_KEY = 'automarket_current_user';
  var CHECKOUT_KEY = 'automarket_last_checkout';
  var page = $('body').data('page');
  var isPagesPath = window.location.pathname.indexOf('/pages/') !== -1;
  var pagePrefix = isPagesPath ? '' : 'pages/';
  var assetPrefix = isPagesPath ? '../' : '';

  function money(value) {
    return '$' + Number(value).toLocaleString('en-US');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getQuery(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function normalizeImage(src) {
    var fileName = String(src || '').split('/').pop();
    return assetPrefix + 'data/images/' + fileName;
  }

  function go(file, params) {
    window.location.href = pagePrefix + file + (params || '');
  }

  function currentUsername() {
    return localStorage.getItem(AUTH_KEY);
  }

  function setCurrentUsername(username) {
    localStorage.setItem(AUTH_KEY, username);
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    go('login.html');
  }

  function loadUsers() {
    var cached = localStorage.getItem(USERS_KEY);
    if (cached) {
      return $.Deferred().resolve(JSON.parse(cached)).promise();
    }

    return $.getJSON(assetPrefix + 'data/users.json').then(function (users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users;
    });
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getUser(users, username) {
    return users.find(function (user) { return user.username === username; });
  }

  function requireAuth() {
    if (!currentUsername()) {
      go('login.html');
      return false;
    }
    return true;
  }

  function redirectAuthedAway() {
    if (currentUsername()) {
      go('catalog.html');
      return true;
    }
    return false;
  }

  function renderHeader() {
    $('#site-header').html(
      '<header class="site-header"><div class="container header-inner">' +
        '<a class="logo" href="catalog.html">AutoMarket Studio</a>' +
        '<nav class="main-nav">' +
          '<a href="catalog.html">Каталог</a>' +
          '<a href="profile.html">Личный кабинет</a>' +
          '<a href="about.html">О нас</a>' +
          '<a href="support.html">Поддержка</a>' +
        '</nav>' +
        '<button id="logout-button" class="logout-button" type="button">Выйти</button>' +
      '</div></header>'
    );
    $('#logout-button').on('click', logout);
  }

  function loadCars() {
    return $.getJSON(assetPrefix + 'data/cars.json');
  }

  function renderCatalog() {
    loadCars().then(function (cars) {
      var html = cars.map(function (car) {
        return '<article class="card car-card">' +
          '<img src="' + normalizeImage(car.heroImage) + '" alt="' + escapeHtml(car.brand + ' ' + car.model) + '">' +
          '<div class="car-card-body">' +
            '<h2>' + escapeHtml(car.brand + ' ' + car.model) + '</h2>' +
            '<p>' + escapeHtml(car.description) + '</p>' +
            '<p>' + escapeHtml(car.specs.body + ' • ' + car.specs.drivetrain + ' • ' + car.engineOptions.length + ' варианта двигателя') + '</p>' +
            '<p class="price">от ' + money(car.basePrice) + '</p>' +
            '<a class="primary-button" href="car.html?id=' + encodeURIComponent(car.id) + '">Открыть конфигуратор</a>' +
          '</div>' +
        '</article>';
      }).join('');
      $('#catalog-grid').html(html);
    }).catch(function () {
      $('#catalog-grid').html('<p class="error-text">Не удалось загрузить каталог.</p>');
    });
  }

  function optionButton(option, activeId, kind) {
    var isActive = option.id === activeId;
    var swatch = kind === 'color' ? '<div class="swatch" style="background:' + escapeHtml(option.hex) + '"></div>' : '';
    var power = option.power ? '<p class="muted">' + escapeHtml(option.power) + '</p>' : '';
    return '<button class="option-button ' + (kind === 'color' ? 'color-button ' : '') + (isActive ? 'active' : '') + '" type="button" data-id="' + escapeHtml(option.id) + '">' +
      swatch + '<strong>' + escapeHtml(option.name) + '</strong>' + power +
      '<p>' + (option.priceModifier ? '+ ' + money(option.priceModifier) : 'Включено') + '</p>' +
    '</button>';
  }

  function renderOptionSection(title, className, options, activeId) {
    return '<section><h3 class="option-title">' + title + '</h3><div class="option-grid ' + className + '">' +
      options.map(function (option) { return optionButton(option, activeId, className === 'colors' ? 'color' : 'option'); }).join('') +
      '</div></section>';
  }

  function renderCarPage() {
    var id = getQuery('id');
    loadCars().then(function (cars) {
      var car = cars.find(function (item) { return item.id === id; });
      if (!car) {
        $('#car-page').html('<section class="card pad-card"><h1>Автомобиль не найден</h1><p class="muted">Вернитесь в каталог и выберите модель заново.</p><a class="primary-button" href="catalog.html">В каталог</a></section>');
        return;
      }

      document.title = car.brand + ' ' + car.model + ' — AutoMarket Studio';
      var state = {
        engine: car.engineOptions[0].id,
        color: car.colors[0].id,
        wheel: car.wheels[0].id,
        interior: car.interior[0].id,
        packages: []
      };

      function find(list, selectedId) {
        return list.find(function (item) { return item.id === selectedId; });
      }

      function totals() {
        var engine = find(car.engineOptions, state.engine);
        var color = find(car.colors, state.color);
        var wheel = find(car.wheels, state.wheel);
        var interior = find(car.interior, state.interior);
        var packages = car.packages.filter(function (item) { return state.packages.indexOf(item.id) !== -1; });
        var total = car.basePrice + engine.priceModifier + color.priceModifier + wheel.priceModifier + interior.priceModifier + packages.reduce(function (sum, item) { return sum + item.priceModifier; }, 0);
        return { engine: engine, color: color, wheel: wheel, interior: interior, packages: packages, total: total };
      }

      function renderConfigurator() {
        var selected = totals();
        $('#configurator').html(
          '<div class="config-options">' +
            renderOptionSection('Двигатель', 'engine-options', car.engineOptions, state.engine) +
            renderOptionSection('Цвет кузова', 'colors', car.colors, state.color) +
            renderOptionSection('Диски', 'wheel-options', car.wheels, state.wheel) +
            renderOptionSection('Интерьер', 'interior-options', car.interior, state.interior) +
            '<section><h3 class="option-title">Пакеты опций</h3><div class="form-stack">' +
              car.packages.map(function (pack) {
                return '<label class="package-row"><span>' + escapeHtml(pack.name) + '</span><span>+ ' + money(pack.priceModifier) + ' <input type="checkbox" data-id="' + escapeHtml(pack.id) + '" ' + (state.packages.indexOf(pack.id) !== -1 ? 'checked' : '') + '></span></label>';
              }).join('') +
            '</div></section>' +
          '</div>' +
          '<aside class="card summary"><h3>Ваш автомобиль</h3><p class="muted">' + escapeHtml(car.brand + ' ' + car.model + ' ' + car.year) + '</p>' +
            '<ul><li>' + escapeHtml(selected.engine.name) + '</li><li>' + escapeHtml(selected.color.name) + '</li><li>' + escapeHtml(selected.wheel.name) + '</li><li>' + escapeHtml(selected.interior.name) + '</li>' +
            selected.packages.map(function (item) { return '<li>' + escapeHtml(item.name) + '</li>'; }).join('') + '</ul>' +
            '<p class="summary-price">' + money(selected.total) + '</p>' +
            '<a class="primary-button full-width" href="checkout.html?carId=' + encodeURIComponent(car.id) + '&trimId=' + encodeURIComponent(selected.engine.id) + '">Перейти к покупке</a></aside>'
        );
      }

      $('#car-page').html(
        '<section class="card hero-card hero-grid"><div><p class="eyebrow">Конфигуратор</p><h1>' + escapeHtml(car.brand + ' ' + car.model) + '</h1><p>' + escapeHtml(car.description) + '</p></div><img class="hero-image" src="' + normalizeImage(car.heroImage) + '" alt="' + escapeHtml(car.brand + ' ' + car.model) + '"></section>' +
        '<section class="card info-card two-grid"><div><h2>Характеристики</h2><dl class="spec-list"><div><dt>Кузов</dt><dd>' + escapeHtml(car.specs.body) + '</dd></div><div><dt>Привод</dt><dd>' + escapeHtml(car.specs.drivetrain) + '</dd></div><div><dt>Разгон 0–100</dt><dd>' + escapeHtml(car.specs.acceleration) + '</dd></div><div><dt>Макс. скорость</dt><dd>' + escapeHtml(car.specs.topSpeed) + '</dd></div><div><dt>Расход</dt><dd>' + escapeHtml(car.specs.consumption) + '</dd></div><div><dt>Трансмиссия</dt><dd>' + escapeHtml(car.specs.transmission) + '</dd></div></dl></div><div><h2>Ключевые опции</h2><ul class="highlights">' + car.highlights.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul></div></section>' +
        '<section id="configurator" class="configurator"></section>'
      );
      renderConfigurator();

      $('#configurator').on('click', '.engine-options .option-button', function () { state.engine = $(this).data('id'); renderConfigurator(); });
      $('#configurator').on('click', '.colors .option-button', function () { state.color = $(this).data('id'); renderConfigurator(); });
      $('#configurator').on('click', '.wheel-options .option-button', function () { state.wheel = $(this).data('id'); renderConfigurator(); });
      $('#configurator').on('click', '.interior-options .option-button', function () { state.interior = $(this).data('id'); renderConfigurator(); });
      $('#configurator').on('change', 'input[type="checkbox"]', function () {
        var packId = $(this).data('id');
        if (this.checked && state.packages.indexOf(packId) === -1) state.packages.push(packId);
        if (!this.checked) state.packages = state.packages.filter(function (item) { return item !== packId; });
        renderConfigurator();
      });
    });
  }

  function initLogin() {
    if (redirectAuthedAway()) return;
    if (getQuery('error')) $('#login-error').removeClass('hidden');
    $('#login-form').on('submit', function (event) {
      event.preventDefault();
      var username = $.trim(this.username.value);
      var password = this.password.value;
      loadUsers().then(function (users) {
        var user = getUser(users, username);
        if (!user || user.password !== password) {
          $('#login-error').removeClass('hidden');
          return;
        }
        setCurrentUsername(username);
        go('catalog.html');
      });
    });
  }

  function initRegister() {
    if (redirectAuthedAway()) return;
    $('#register-form').on('submit', function (event) {
      event.preventDefault();
      var form = this;
      loadUsers().then(function (users) {
        var username = $.trim(form.username.value);
        if (getUser(users, username)) {
          $('#register-error').removeClass('hidden');
          return;
        }
        users.push({
          id: 'user-' + Date.now(),
          username: username,
          fullName: $.trim(form.fullName.value),
          phone: $.trim(form.phone.value),
          password: form.password.value,
          birthDate: form.birthDate.value,
          paymentMethods: []
        });
        saveUsers(users);
        setCurrentUsername(username);
        go('profile.html?success=registered');
      });
    });
  }

  function initProfile() {
    loadUsers().then(function (users) {
      var user = getUser(users, currentUsername());
      if (!user) { logout(); return; }
      var form = $('#profile-form')[0];
      form.fullName.value = user.fullName;
      form.phone.value = user.phone;
      form.birthDate.value = user.birthDate;
      form.password.value = user.password;
      form.paymentMethods.value = user.paymentMethods.join('\n');
      if (getQuery('success')) $('#profile-success').removeClass('hidden');
      $('#profile-form').on('submit', function (event) {
        event.preventDefault();
        user.fullName = $.trim(form.fullName.value);
        user.phone = $.trim(form.phone.value);
        user.birthDate = form.birthDate.value;
        user.password = form.password.value;
        user.paymentMethods = form.paymentMethods.value.split('\n').map(function (item) { return $.trim(item); }).filter(Boolean);
        saveUsers(users);
        $('#profile-success').removeClass('hidden');
      });
    });
  }

  function initCheckout() {
    loadUsers().then(function (users) {
      var user = getUser(users, currentUsername());
      if (!user) { logout(); return; }
      var form = $('#checkout-form')[0];
      form.fullName.value = user.fullName;
      form.phone.value = user.phone;
      form.birthDate.value = user.birthDate;
      user.paymentMethods.forEach(function (method) {
        $(form.paymentMethod).append('<option value="' + escapeHtml(method) + '">' + escapeHtml(method) + '</option>');
      });
      $('#checkout-form').on('submit', function (event) {
        event.preventDefault();
        var payment = form.paymentMethod.value;
        if (!payment || user.paymentMethods.indexOf(payment) === -1) {
          $('#checkout-error').removeClass('hidden');
          return;
        }
        localStorage.setItem(CHECKOUT_KEY, JSON.stringify({ user: user.username, payment: payment, createdAt: new Date().toISOString(), carId: getQuery('carId'), trimId: getQuery('trimId') }));
        $('#checkout-error').addClass('hidden');
        $('#success-modal').removeClass('hidden');
      });
      $('#close-modal').on('click', function () { $('#success-modal').addClass('hidden'); });
    });
  }

  $(function () {
    if (page === 'home') { go(currentUsername() ? 'catalog.html' : 'login.html'); return; }
    if (page === 'login') { initLogin(); return; }
    if (page === 'register') { initRegister(); return; }
    if (!requireAuth()) return;
    renderHeader();
    if (page === 'catalog') renderCatalog();
    if (page === 'car') renderCarPage();
    if (page === 'profile') initProfile();
    if (page === 'checkout') initCheckout();
  });
})(jQuery);
