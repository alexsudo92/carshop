const fs = require('node:fs');
const path = require('node:path');

const required = [
  'index.html',
  'css/styles.css',
  'js/jquery.min.js',
  'js/app.js',
  'pages/login.html',
  'pages/register.html',
  'pages/catalog.html',
  'pages/car.html',
  'pages/profile.html',
  'pages/checkout.html',
  'pages/about.html',
  'pages/support.html',
  'data/cars.json',
  'data/users.json'
];

let failed = false;
for (const file of required) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    console.error(`Missing required file: ${file}`);
    failed = true;
  }
}

const forbidden = ['app', 'components', 'lib', 'next.config.ts', 'tsconfig.json'];
for (const item of forbidden) {
  if (fs.existsSync(path.join(__dirname, '..', item))) {
    console.error(`Next.js artifact still exists: ${item}`);
    failed = true;
  }
}

const htmlFiles = required.filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const text = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  if (!text.includes('js/jquery.min.js') && !text.includes('../js/jquery.min.js')) {
    console.error(`jQuery is not included in ${file}`);
    failed = true;
  }
  if (!text.includes('js/app.js') && !text.includes('../js/app.js')) {
    console.error(`app.js is not included in ${file}`);
    failed = true;
  }
}

const cars = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/cars.json'), 'utf8'));
if (!Array.isArray(cars) || cars.length === 0) {
  console.error('Catalog data is empty');
  failed = true;
}

process.exit(failed ? 1 : 0);
