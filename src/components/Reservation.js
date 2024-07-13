import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels } from './api';
import { disponibilidadDeReserva } from './api';

function Reservation() {

  const [hoteles, setHoteles] = useState([]);
  const [formData, setFormData] = useState({
    option1: '',
    startDate: '',
    endDate: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if(formData.option1===""){
        setErrorMessage('Selecciona una Ciudad');
        setShowError(true);
        setHoteles([])

        getHoteles();

        return
      }
      if(formData.startDate===""){
        setErrorMessage('Selecciona fecha inicial');
        setShowError(true);
        setHoteles([])
        getHoteles();

        return
      }
      if(formData.endDate===""){
        setErrorMessage('Selecciona fecha final');
        setShowError(true);
        setHoteles([])
        getHoteles();
        return
      }
      
      const response = await disponibilidadDeReserva(
        formData.option1,
        formData.startDate,
        formData.endDate,
      );
      
      if (response.status === 200 || response.status === 201) {
        navigate(`/busqueda/${formData.option1}`);
      }else if(response.status === 501){
        navigate(`/registro`);

      }else if (response.status===400) {
        setErrorMessage(`${response.data.message}`);
        setShowError(true);
        setHoteles([])
        getHoteles();
      }else{
        setHoteles([])
        getHoteles();
        setErrorMessage(`Algo salio mal`);
        setShowError(true);
        
      }
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      setHoteles([])
      getHoteles();
      setErrorMessage('Algo salió mal');
      setShowError(true);
    }
  };

  const getHoteles = async () => {
    try {
      const response = await getHotels();
      const reservasData = response.data;
      setHoteles(reservasData);
    } catch (error) {
      console.error('Error al obtener hoteles:', error);
    }
  };

  useEffect(() => {
    getHoteles();
  }, []);


  

  return (
    <div className="container mt-5">
      <h1>Reserva</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="option1">Locación</label>
              <select
                onChange={handleChange}
                value={formData.option1}
                className="form-control"
                id="option1"
                name="option1"
              >
                <option value="0">Seleccionar el lugar de su estadía</option>
                {hoteles.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="startDate">Fecha de inicio</label>
              <input
                onChange={handleChange}
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={formData.startDate}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="endDate">Fecha de fin</label>
              <input
                onChange={handleChange}
                type="date"
                className="form-control"
                id="endDate"
                name="endDate"
                value={formData.endDate}
              />
            </div>
          </div>
        </div>

        {showError && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit" className="btn btn-primary">
          Reservar
        </button>
      </form>
    </div>
  );
}

export default Reservation;