import "./app.css";
import Layout from "./layout/layout";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { ReviewProvider } from "./context/ReviewContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <ReviewProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Layout />
        </ReviewProvider>
      </AppointmentProvider>
    </AuthProvider>
  );
}

export default App;
