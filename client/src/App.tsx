import { useRoutes } from './routes';
import './App.scss';

function App() {
  const routes = useRoutes()
  return (
    <div>{routes}</div>
  );
}

export default App;
