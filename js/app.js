(function ($) {
  'use strict';

  const USERS_KEY = 'automarket_users';
  const SESSION_KEY = 'automarket_current_user';

  const page = $('body').data('page');
  const authPages = ['login', 'register'];

  function money(value) {
    return '$' + Number(value || 0).toLocaleString('en-US');
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function pageUrl(name) {
    return '/pages/' + name + '.html';
  }

  function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch (error) { localStorage.removeItem(USERS_KEY); }
    }
    const defaults = window.AUTOMARKET_DEFAULT_USERS || [];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function currentUser() {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return null;
    return getUsers().find(user => user.username === username) || null;
  }

  function setSession(username) {
    localStorage.setItem(SESSION_KEY, username);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function requireAuth() {
    const user = currentUser();
    if (!user && !authPages.includes(page)) {
      window.location.replace(pageUrl('login'));
      return null;
    }
    if (user && authPages.includes(page)) {
      window.location.replace(pageUrl('catalog'));
      return null;
    }
    return user;
  }

  function showMessage(selector, text, type) {
    $(selector).removeClass('error success').addClass(type).text(text).show();
  }

  function imagePath(path) {
    return String(path || '').replace('/data/images/', '/data/images/');
  }

  function renderHeader() {
    const header = $('#site-header');
    if (!header.length) return;
    header.html(`
      <div class="header-inner">
        <a class="brand" href="${pageUrl('catalog')}">AutoMarket Studio</a>
        <nav class="main-nav" aria-label="Основная навигация">
          <a href="${pageUrl('catalog')}">Каталог</a>
          <a href="${pageUrl('profile')}">Личный кабинет</a>
          <a href="${pageUrl('about')}">О нас</a>
          <a href="${pageUrl('support')}">Поддержка</a>
        </nav>
        <div class="header-actions">
          <span class="small muted" id="header-user"></span>
          <button type="button" class="btn btn-outline" id="logout-btn">Выйти</button>
        </div>
      </div>
    `);
    const user = currentUser();
    $('#header-user').text(user ? user.fullName : '');
    $('#logout-btn').on('click', function () {
      clearSession();
      window.location.href = pageUrl('login');
    });
  }

  function renderCatalog() {
    const grid = $('#catalog-grid');
    if (!grid.length) return;
    const cars = window.AUTOMARKET_CARS || [];
    grid.html(cars.map(car => `
      <article class="card">
        <img class="catalog-image" src="${imagePath(car.heroImage)}" alt="${car.brand} ${car.model}">
        <div class="card-pad">
          <h2>${car.brand} ${car.model}</h2>
          <p class="muted">${car.description}</p>
          <p class="small muted">${car.specs.body} • ${car.specs.drivetrain} • ${car.engineOptions.length} варианта двигателя</p>
          <p class="price" style="font-size:22px;margin:10px 0 18px;">от ${money(car.basePrice)}</p>
          <a class="btn" href="${pageUrl('car')}?id=${encodeURIComponent(car.id)}">Открыть конфигуратор</a>
        </div>
      </article>
    `).join(''));
  }

  function findById(items, id) {
    return items.find(item => item.id === id) || items[0];
  }

  function renderOptionSection(title, items, type, activeId) {
    const buttons = items.map(item => `
      <button type="button" class="option-btn ${type}-option ${item.id === activeId ? 'active' : ''}" data-type="${type}" data-id="${item.id}">
        <strong>${item.name}</strong>
        ${item.power ? `<div class="small">${item.power}</div>` : ''}
        <div class="small">${item.priceModifier ? '+ ' + money(item.priceModifier) : 'Включено'}</div>
      </button>
    `).join('');
    return `<section><h3>${title}</h3><div class="grid option-grid">${buttons}</div></section>`;
  }

  function renderColorSection(colors, activeId) {
    const buttons = colors.map(item => `
      <button type="button" class="option-btn color-btn color-option ${item.id === activeId ? 'active' : ''}" data-type="color" data-id="${item.id}">
        <span class="swatch" style="background:${item.hex}"></span>
        <strong>${item.name}</strong>
        <div class="small">${item.priceModifier ? '+ ' + money(item.priceModifier) : 'Включено'}</div>
      </button>
    `).join('');
    return `<section><h3>Цвет кузова</h3><div class="grid color-grid">${buttons}</div></section>`;
  }

  function renderPackageSection(packages) {
    const rows = packages.map(item => `
      <label class="package-row">
        <span>${item.name}</span>
        <span class="header-actions"><span class="small muted">+ ${money(item.priceModifier)}</span><input type="checkbox" class="package-check" value="${item.id}"></span>
      </label>
    `).join('');
    return `<section><h3>Пакеты опций</h3><div class="section-space">${rows}</div></section>`;
  }

  function renderCarPage() {
    const root = $('#car-root');
    if (!root.length) return;
    const id = params().get('id') || '';
    const car = (window.AUTOMARKET_CARS || []).find(item => item.id === id);
    if (!car) {
      root.html('<section class="card card-pad"><h1>Автомобиль не найден</h1><p class="muted">Вернитесь в каталог и выберите модель.</p><a class="btn" href="' + pageUrl('catalog') + '">В каталог</a></section>');
      return;
    }

    const state = {
      engine: car.engineOptions[0].id,
      color: car.colors[0].id,
      wheel: car.wheels[0].id,
      interior: car.interior[0].id,
      packages: []
    };

    root.html(`
      <section class="card hero-card grid two-col" style="margin-bottom:28px;">
        <div>
          <p class="small muted" style="text-transform:uppercase;letter-spacing:.2em;">Конфигуратор</p>
          <h1>${car.brand} ${car.model}</h1>
          <p class="muted">${car.description}</p>
        </div>
        <img class="hero-image" src="${imagePath(car.heroImage)}" alt="${car.brand} ${car.model}">
      </section>
      <section class="card card-pad grid two-col" style="margin-bottom:28px;">
        <div>
          <h2>Характеристики</h2>
          <dl class="spec-list">
            <div><dt>Кузов</dt><dd>${car.specs.body}</dd></div>
            <div><dt>Привод</dt><dd>${car.specs.drivetrain}</dd></div>
            <div><dt>Разгон 0–100</dt><dd>${car.specs.acceleration}</dd></div>
            <div><dt>Макс. скорость</dt><dd>${car.specs.topSpeed}</dd></div>
            <div><dt>Расход</dt><dd>${car.specs.consumption}</dd></div>
            <div><dt>Трансмиссия</dt><dd>${car.specs.transmission}</dd></div>
          </dl>
        </div>
        <div>
          <h2>Ключевые опции</h2>
          <ul>${car.highlights.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
      </section>
      <section class="grid config-grid">
        <div class="section-space" id="config-options">
          ${renderOptionSection('Двигатель', car.engineOptions, 'engine', state.engine)}
          ${renderColorSection(car.colors, state.color)}
          ${renderOptionSection('Диски', car.wheels, 'wheel', state.wheel)}
          ${renderOptionSection('Интерьер', car.interior, 'interior', state.interior)}
          ${renderPackageSection(car.packages)}
        </div>
        <aside class="card card-pad summary" id="summary"></aside>
      </section>
    `);

    function updateSummary() {
      const engine = findById(car.engineOptions, state.engine);
      const color = findById(car.colors, state.color);
      const wheel = findById(car.wheels, state.wheel);
      const interior = findById(car.interior, state.interior);
      const packages = car.packages.filter(item => state.packages.includes(item.id));
      const total = car.basePrice + engine.priceModifier + color.priceModifier + wheel.priceModifier + interior.priceModifier + packages.reduce((sum, item) => sum + item.priceModifier, 0);
      $('#summary').html(`
        <h3>Ваш автомобиль</h3>
        <p class="small muted">${car.brand} ${car.model} ${car.year}</p>
        <ul class="summary-list">
          <li>${engine.name}</li><li>${color.name}</li><li>${wheel.name}</li><li>${interior.name}</li>
          ${packages.map(item => `<li>${item.name}</li>`).join('')}
        </ul>
        <p class="price">${money(total)}</p>
        <a class="btn btn-full" href="${pageUrl('checkout')}?carId=${encodeURIComponent(car.id)}&trimId=${encodeURIComponent(engine.id)}">Перейти к покупке</a>
      `);
    }

    root.on('click', '.option-btn', function () {
      const type = $(this).data('type');
      state[type] = $(this).data('id');
      $('.' + type + '-option').removeClass('active');
      $(this).addClass('active');
      updateSummary();
    });
    root.on('change', '.package-check', function () {
      const id = $(this).val();
      state.packages = $('.package-check:checked').map(function () { return $(this).val(); }).get();
      if (!state.packages.includes(id)) $(this).prop('checked', false);
      updateSummary();
    });
    updateSummary();
  }

  function initLogin() {
    if (params().get('error')) showMessage('#login-message', 'Неверный логин или пароль', 'error');
    $('#login-form').on('submit', function (event) {
      event.preventDefault();
      const username = $('#username').val().trim();
      const password = $('#password').val();
      const user = getUsers().find(item => item.username === username && item.password === password);
      if (!user) {
        showMessage('#login-message', 'Неверный логин или пароль', 'error');
        return;
      }
      setSession(username);
      window.location.href = pageUrl('catalog');
    });
  }

  function initRegister() {
    if (params().get('error')) showMessage('#register-message', 'Пользователь с таким логином уже существует', 'error');
    $('#register-form').on('submit', function (event) {
      event.preventDefault();
      const users = getUsers();
      const username = $('#reg-username').val().trim();
      if (users.some(item => item.username === username)) {
        showMessage('#register-message', 'Пользователь с таким логином уже существует', 'error');
        return;
      }
      const user = {
        id: 'user-' + Date.now(),
        username,
        fullName: $('#reg-fullName').val().trim(),
        phone: $('#reg-phone').val().trim(),
        password: $('#reg-password').val().trim(),
        birthDate: $('#reg-birthDate').val(),
        paymentMethods: []
      };
      users.push(user);
      saveUsers(users);
      setSession(username);
      window.location.href = pageUrl('profile') + '?success=registered';
    });
  }

  function initProfile(user) {
    if (!$('#profile-form').length || !user) return;
    $('#profile-title').text('Личный кабинет');
    if (params().get('success')) showMessage('#profile-message', 'Данные успешно обновлены.', 'success');
    $('#profile-fullName').val(user.fullName);
    $('#profile-phone').val(user.phone);
    $('#profile-birthDate').val(user.birthDate);
    $('#profile-password').val(user.password);
    $('#profile-paymentMethods').val((user.paymentMethods || []).join('\n'));

    $('#profile-form').on('submit', function (event) {
      event.preventDefault();
      const users = getUsers();
      const index = users.findIndex(item => item.username === user.username);
      if (index === -1) return;
      users[index] = {
        ...users[index],
        fullName: $('#profile-fullName').val().trim(),
        phone: $('#profile-phone').val().trim(),
        birthDate: $('#profile-birthDate').val(),
        password: $('#profile-password').val().trim(),
        paymentMethods: $('#profile-paymentMethods').val().split('\n').map(item => item.trim()).filter(Boolean)
      };
      saveUsers(users);
      showMessage('#profile-message', 'Данные успешно обновлены.', 'success');
      renderHeader();
    });
  }

  function initCheckout(user) {
    if (!$('#checkout-form').length || !user) return;
    $('#checkout-fullName').val(user.fullName);
    $('#checkout-phone').val(user.phone);
    $('#checkout-birthDate').val(user.birthDate);
    const select = $('#checkout-payment');
    (user.paymentMethods || []).forEach(method => select.append(`<option value="${method}">${method}</option>`));

    const carId = params().get('carId');
    const trimId = params().get('trimId');
    const car = (window.AUTOMARKET_CARS || []).find(item => item.id === carId);
    if (car) {
      const trim = findById(car.engineOptions, trimId);
      $('#checkout-car').html(`<h2>Ваш выбор</h2><p>${car.brand} ${car.model} ${car.year}</p><p class="muted">${trim.name} • ${trim.power || ''}</p>`);
    }

    if (params().get('error')) showMessage('#checkout-message', 'Выбран неверный способ оплаты.', 'error');
    if (params().get('success')) {
      showMessage('#checkout-message', 'Заявка отправлена.', 'success');
      $('#success-modal').addClass('open');
    }

    $('#checkout-form').on('submit', function (event) {
      event.preventDefault();
      const method = select.val();
      if (!method || !(user.paymentMethods || []).includes(method)) {
        showMessage('#checkout-message', 'Выбран неверный способ оплаты.', 'error');
        return;
      }
      showMessage('#checkout-message', 'Заявка отправлена.', 'success');
      $('#success-modal').addClass('open');
    });
    $('#modal-close').on('click', function () { $('#success-modal').removeClass('open'); });
  }

  $(function () {
    const user = requireAuth();
    renderHeader();
    renderCatalog();
    renderCarPage();
    initLogin();
    initRegister();
    initProfile(user);
    initCheckout(user);
  });
})(jQuery);
