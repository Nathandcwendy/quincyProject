import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <div className="text-black dark:text-gray-100">
          <Header />
          <Outlet />
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
