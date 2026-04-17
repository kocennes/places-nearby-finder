import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tarayıcıdaki "root" id'li div'i React'in yönetimine bırakır (public/index.html içinde tanımlı)
// React 18 ile gelen createRoot API'si concurrent mode özelliklerini aktif eder
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
