import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppSwitch from "./Routes/Index";

function App() {
  const [appIsOnline, setAppIsOnline] = useState(window.navigator.onLine);
  const [appHasGoneOffline, setAppHasGoneOffline] = useState(false);

  window.addEventListener("offline", () => {
    setAppIsOnline(window.navigator.onLine);
  });

  window.addEventListener("online", () => {
    setAppIsOnline(window.navigator.onLine);
  });

  // checks if a device is offline or online
  useEffect(() => {
    if (!appIsOnline) {
      toast.warn("Your device is offline");
      setAppHasGoneOffline(true);
      return;
    }

    if (appHasGoneOffline) {
      toast.success("Back Online");
    }
  }, [appIsOnline, appHasGoneOffline]);
  return (
    <Router>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHove
        />
      </div>
      <AppSwitch />
    </Router>
  );
}

export default App;
