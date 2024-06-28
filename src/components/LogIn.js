import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './api';
import Cookies from 'js-cookie';

const LogIn = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await loginUser(formData.email, formData.password);
      if (response.status === 200) {
        const user = {
          email: response.data.email,
          name: response.data.name,
          lastName: response.data.lastName,
          dni: response.data.dni,
          id: response.data.id,
          admin: response.data.admin,
          token: response.data.token
        };
        console.log(response)

        Cookies.set('userData', JSON.stringify(user));
        onLogin(formData.firstName, formData);
        navigate("/");
     
      } else if (response.status === 400) {
        setErrorMessage('El usuario no existe o la contraseña es incorrecta');
        setShowError(true);
      } else{
        setErrorMessage('Error al iniciar sesión');
        setShowError(true);
      }  
        
      } catch (error) {
        setErrorMessage('Error al iniciar sesión');
        setShowError(true);
        console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 id="h1">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {showError && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit" className="btn btn-primary">
          Iniciar sesión
        </button>
      </form>
      <p style={{ color: 'gray', marginTop: '10px' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/registro" style={{ textDecoration: 'underline' }}>
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default LogIn;