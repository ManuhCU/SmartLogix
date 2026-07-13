import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await api.login({ username, password });

            if (data.success) {
                // Guardar datos en localStorage
                localStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    role: data.role,
                    cardHolderName: data.cardHolderName || '',
                    cardNumber: data.cardNumber || '',
                    cardExpiry: data.cardExpiry || '',
                    cardCvv: data.cardCvv || '',
                }));
                localStorage.setItem('isAuthenticated', 'true');

                // Redirigir según el rol
                if (data.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/catalog');
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = { username, role: 'USER', active: true };
            const data = await api.createUser(user, password);
            if (data && data.username) {
                setIsRegistering(false);
                setError('¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta.');
            } else {
                setError('Error al registrar usuario. Intenta con otro nombre.');
            }
        } catch (err) {
            setError('Error al registrar. Es posible que el usuario ya exista.');
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = (role) => {
        const demoUser = role === 'admin' ? 'admin' : 'user1';
        const demoPassword = role === 'admin' ? 'admin123' : 'password123';
        setUsername(demoUser);
        setPassword(demoPassword);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>SmartLogix</h1>
                <h2>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>

                {error && <div className={error.includes('exitoso') ? "success-message" : "error-message"} style={{ color: error.includes('exitoso') ? 'green' : undefined }}>{error}</div>}

                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Cargando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                    <button 
                        type="button" 
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }} 
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
                        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
                    </button>
                </div>

                {!isRegistering && (
                    <div className="demo-section">
                        <p>Prueba con:</p>
                        <button
                            type="button"
                            className="btn-demo admin"
                            onClick={() => handleDemoLogin('admin')}
                        >
                            Admin (admin / admin123)
                        </button>
                        <button
                            type="button"
                            className="btn-demo user"
                            onClick={() => handleDemoLogin('user')}
                        >
                            Usuario (user1 / password123)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
