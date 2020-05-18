import IssueList from './components/IssueList';
import IssueReport from './components/IssueReport';
import IssueEdit from './components/IssueEdit';
import About from './components/About';
import NotFound from './components/NotFound';
import Home from './components/Home';

const routes = [
  { path: '/issues/:id?', component: IssueList },
  { path: '/edit/:id', component: IssueEdit },
  { path: '/report', component: IssueReport },
  { path: '/about', component: About },
  { path: '/', component: Home },
  { path: '*', component: NotFound },
];

export default routes;
