import axios from "axios";
import Cookies from "js-cookie";

const URL_API = "http://localhost:8060";

//Register

export const postUser = async (
  FirstName,
  LastName,
  Username,
  Password,
  Email
) => {
  try {
    const response = await axios.post(
      `${URL_API}/addUsuario/${FirstName}/${LastName}/${Username}/${Password}/${Email}`
    );
    return response;
  } catch (error) {
    if (error.response.status === 400) {
      // El servidor respondió con un código de estado de error
      const errorMessage = error.response.data;
      // Manejar el mensaje de error, por ejemplo, mostrarlo en la interfaz de usuario
      console.error(errorMessage);
      return error.response;
    } else {
      // Error de red o solicitud cancelada
      console.error("Error en la solicitud:", error.message);
    }
  }

  throw new Error("Error al agregar usuario");
};

//Hotel

export const postHotel = async (name, Nroom, descr) => {
  try {
    const response = await axios.post(
      `${URL_API}/insertHhotel/${name}/${Nroom}/${descr}`
    );
    return response;
  } catch (error) {
    if (error.response.status === 400) {
      // El servidor respondió con un código de estado de error
      const errorMessage = error.response.data;
      // Manejar el mensaje de error, por ejemplo, mostrarlo en la interfaz de usuario
      console.error(errorMessage);
      return error.response;
    } else {
      // Error de red o solicitud cancelada
      console.error("Error en la solicitud:", error.message);
    }
  }

  throw new Error("Error al agregar hotel");
};

//Imagen
export const postImage = async (image, idHotel) => {
  try {
    const response = await axios.post(
      `${URL_API}/postImage/${image}/${idHotel}`
    );
    return response;
  } catch (error) {
    if (error.response.status === 400) {
      // El servidor respondió con un código de estado de error
      const errorMessage = error.response.data;
      // Manejar el mensaje de error, por ejemplo, mostrarlo en la interfaz de usuario
      console.error(errorMessage);
      return error.response;
    } else {
      // Error de red o solicitud cancelada
      console.error("Error en la solicitud:", error.message);
    }
  }

  throw new Error("Error al agregar imagenes");
};

export const loginUser = async (email, password) => {
  const data = {
    email: email,
    password: password,
  };

  try {
    const response = await axios.post(`${URL_API}/login`, data);
    return response;
  } catch (error) {
    if (error.response.status === 400) {
      // El servidor respondió con un código de estado de error
      const errorMessage = error.response.data;
      // Manejar el mensaje de error, por ejemplo, mostrarlo en la interfaz de usuario
      console.error(errorMessage);
      return error.response;
    } else {
      // Error de red o solicitud cancelada
      console.error("Error en la solicitud:", error.message);
    }
  }
};

//Reservation
export const agregarReservation = async (
  idHotel,
  inicio,
  final,
  habitacion
) => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);
    axios.defaults.headers.common["Authorization"] = user.token;
  } catch (error) {
    alert("Token expirado, registrece de nuevo para continuar");
  }
  try {
    const response = await axios.post(
      `${URL_API}/usuario/agregarReservation/${idHotel}/${inicio}/${final}/${habitacion}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

//Dispponibilidad de reservas
export const disponibilidadDeReserva = async (
  idHotel,
  inicio,
  final,
  habitacion
) => {
  try {
    const response = await axios.get(
      `${URL_API}/disponibilidadDeReserva/${idHotel}/${inicio}/${final}/${habitacion}`
    );
    if (response.status === 200 || response.status === 201) {
      try {
        const userData = Cookies.get("userData");
        const user = JSON.parse(userData);
        console.log(user.token);
      } catch (error) {
        alert("Reservacion Disponible, registrece para continuar");
        response.status = 501;
        return response;
      }
      return response;
    }
  } catch (error) {
    let er = error.response.data;
    console.log(error);
    return error.response;
  }
};

//Get users
export const getUsers = async () => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);

    axios.defaults.headers.common["Authorization"] = user.token;
    const response = await axios.get(`${URL_API}/admin/users`);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

//GetHotels
export const getHotels = async () => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);
    axios.defaults.headers.common["Authorization"] = user.token;
  } catch (error) {
    console.log("Usuario no regsitrado");
  }
  try {
    const response = await axios.get(`${URL_API}/hotels`);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

export const getHotelById = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/hotelId/${id}`);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

export const getReservations = async () => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);

    axios.defaults.headers.common["Authorization"] = user.token;

    const response = await axios.get(`${URL_API}/admin/reservas`);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

export const getReservationsByUser = async () => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);

    axios.defaults.headers.common["Authorization"] = user.token;
    const id = user.id;

    const response = await axios.get(
      `${URL_API}/usuario/reservaByUserId/${id}`
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

export const getImagesByHotelId = async (idHotel) => {
  try {
    const response = await axios.get(
      `${URL_API}/getImagesByHotelId/${idHotel}`
    );
    return response;
  } catch (error) {
    console.error("Error al obtener las imagenes:", error);
  }
};

export const getImagesByHotelIdMap = async (idHotel) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/getImagesByHotelId/${idHotel}`
    );
    return response.data.images; // Devuelve todas las imágenes
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    throw error; // Lanza el error para que pueda ser manejado en la llamada.
  }
};

export const InsertHotel = async (data) => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);

    axios.defaults.headers.common["Authorization"] = user.token;

    const response = await axios.post(`${URL_API}admin/InsertHotel`, data, {
      headers: {
        "Content-Type": "application/json",
        // Otros encabezados si es necesario
      },
    });

    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al insertar el hotel:", error);
    throw error; // Lanza el error para que pueda ser manejado por el código que llama a InsertHotel
  }
};

export const tipoHabitaciones = async () => {
  try {
    const userData = Cookies.get("userData");
    const user = JSON.parse(userData);

    axios.defaults.headers.common["Authorization"] = user.token;
    const response = await axios.get(`${URL_API}/admin/Habitaciones`);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

export const getAmenities = async () => {
  try {
    const response = await axios.get(`${URL_API}/getAmenities`);
    return response;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};
