import { Route, Switch } from 'wouter';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import RadioPlayer from './components/RadioPlayer';
import Home from './pages/Home';
import Programacao from './pages/Programacao';
import Contato from './pages/Contato';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen">
        <Navbar />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/programacao" component={Programacao} />
          <Route path="/contato" component={Contato} />
          <Route path="/login" component={Login} />
          <Route>
            <div className="container py-16 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Página não encontrada
              </h1>
              <p className="text-gray-600">
                A página que você procura não existe.
              </p>
            </div>
          </Route>
        </Switch>
        <RadioPlayer />
      </div>
    </AuthProvider>
  );
}

export default App;
