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
    option2: '',
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
      let idHabitacion
      for (let i=0; i< hoteles.length;i++){
        if(hoteles[i].id.toString()===formData.option1){
          for(let j=0;j<hoteles[i].habitaciones.length;j++){
            if(hoteles[i].habitaciones[j].Nombre===formData.option2){
              idHabitacion = hoteles[i].habitaciones[j].Id
              break;
            }
          }
          break;
        }
      }
    if(formData.option1===""){
      setErrorMessage('Selecciona hotel');
      setShowError(true);
      setHoteles([])

      getHoteles();

      return
    }
    if(formData.option2===""){
      setErrorMessage('Selecciona Habitacion');
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
        idHabitacion,
      );
      
      if (response.status === 200 || response.status === 201) {
        navigate(`/hotel/${formData.option1}/${formData.startDate}/${formData.endDate}/${idHabitacion}`);
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
      const reservasData = response.data.hotels;
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
          <div className="col-md-6">
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
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="option2">Habitación</label>
              <select
                onChange={handleChange}
                value={formData.option2}
                className="form-control"
                id="option2"
                name="option2"
              >
                <option value="0">Seleccionar el tipo de habitación</option>
                {hoteles
                  .find((hotel) => hotel.id === parseInt(formData.option1, 10))
                  ?.habitaciones.map((habitacion) => (
                    <option key={habitacion.id} value={habitacion.id}>
                      {habitacion.Nombre}
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

/*

//esta función no se si tiene que ir aca, me parece que no
async function fetchReservaById() { //cambie el nombre para que no sea igual a la importada
  var id = document.getElementById("Rid").value;
  try {
    const response = await getReservaById(id);
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}


function Reservation() { //esto es para un POST reserva
  const handleReservarClick = async () => { //PARA ESTO, CREO QUE HAY QUE AGREGAR UN ONCLICK EN EL BOTON RESERVAR
    const idHotel = document.getElementById('option1').value;
    const habitacion = document.getElementById('option2').value;
    const inicio = document.getElementById('startDate').value;
    const final = document.getElementById('endDate').value;
    const idUser = ''; // Obtén el ID de usuario según tus necesidades

    try {
      const response = await agregarReservation(idHotel, inicio, final, idUser, habitacion);
      // Manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito
      console.log('Reserva agregada exitosamente');
    } catch (error) {
      // Manejar el error, por ejemplo, mostrar un mensaje de error
      console.error('Error al agregar reserva:', error.message);
    }
  };
}
*/

