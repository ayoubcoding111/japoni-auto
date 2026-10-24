import { createRoot } from 'react-dom/client';
import './styles.css';
import { animate } from './lib/motion';
import App from './App';

const doc = document.documentElement;
/* `.js` turns on the motion starting states in the stylesheet */
if (animate) doc.classList.add('js');
/* the splash holds scrolling while it is up, but never for longer than 9s */
doc.classList.add('splash-on');
setTimeout(() => doc.classList.remove('splash-on'), 9000);

createRoot(document.getElementById('root')).render(<App />);
