import { Switch, Route, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "./context/ThemeContext";
import MainPanel from "./pages/MainPanel";
import CabDisplay from "./pages/CabDisplay";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainPanel} />
      <Route path="/cab" component={CabDisplay} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
