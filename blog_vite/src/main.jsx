import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

// Scroll restoration on back/forward is implemented by the app itself
// (NavigationScroll in App.jsx): the browser's built-in restore fires while
// the outgoing page is still animating and gets clamped/cancelled by the
// content swap, so we take full ownership instead.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
);
