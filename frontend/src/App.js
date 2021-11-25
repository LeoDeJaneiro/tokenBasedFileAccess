import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import Access from "./Access";
import Admin from "./Admin";
import Login from "./Basic/Login";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path={process.env.REACT_APP_ADMIN_ROUTE || "/admin"}>
            <Admin />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/:token">
            <Access />
          </Route>
        </Switch>
      </Router>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;
