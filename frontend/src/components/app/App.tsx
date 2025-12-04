import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Auth from '../auth/auth/Auth';
import AppRoutes from '../app-routes/AppRoutes';
import { Provider as Redux } from 'react-redux';
import store from '../../redux/store';
import SocketDispatcher from '../socket/SocketDispatcher';

function App() {
    return (
        <BrowserRouter>
            <Auth>
                <Redux store={store}>
                    <SocketDispatcher>
                        <AppRoutes />
                    </SocketDispatcher>
                </Redux>
            </Auth>
        </BrowserRouter>
    )
}

export default App
