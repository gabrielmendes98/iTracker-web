import Issues from '../pages/Issues';
import Report from '../pages/Report';
import Edit from '../pages/Edit';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';

const routes = [
  { path: '/issues/:id?', component: Issues },
  { path: '/edit/:id', component: Edit },
  { path: '/report', component: Report },
  { path: '/about', component: About },
  { path: '/', component: Home, exact: true },
  { path: '*', component: NotFound },
];

export default routes;
