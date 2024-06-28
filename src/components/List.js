import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getImagesByHotelId, getHotels } from './api';

function List() {
    const [hoteles, setHoteles] = useState([]);
    const [imagenes, setImagenes] = useState([]);
  
    const getHoteles = async () => {
      try {
        const response = await getHotels();
        const hotelsData = response.data.hotels;
        const promises = [];
    
        for (const hotel of hotelsData) {
          promises.push(
            getImagesByHotelId(hotel.id)
              .then((response2) => {
                const imagesData = response2.data.images[0].Data;
                return new Uint8Array(atob(imagesData).split('').map(char => char.charCodeAt(0)));
              })
              .catch((error) => {
                console.error('Error al obtener imágenes por hotel:', error);
                return null;
              })
          );
        }
    
        const imagesArray = await Promise.all(promises);
    
        setImagenes(imagesArray.filter(image => image !== null));
        setHoteles(hotelsData);
      } catch (error) {
        console.error('Error al obtener hoteles:', error);
      }
    };
  
    useEffect(() => {
      getHoteles();
    }, []);
  
    return (
      <Container className="mt-5">
        <h2 style={{marginBottom: 35}}>Resultado</h2>
        {hoteles.map((hotel, index) => (
          <Row key={hotel.id} className="mb-4">
            <Col md={12}>
              <Card>
                <Row className="no-gutters">
                  <Col md={4}>
                    <Card.Img
                      src={`data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, imagenes[index]))}`}
                      alt={`Imagen de ${hotel.name}`}
                      className="img-fluid"
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          <Card.Title>{hotel.name}</Card.Title>
                        </Col>
                        <Col md={8} />
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Card.Text>{hotel.description}</Card.Text>
                        </Col>
                        <Col md={8} />
                      </Row>
                      <Row>
                        <Col md={4} />
                        <Col md={4} />
                        <Col md={4} className="d-flex justify-content-end">
                          <Button variant="primary">Reservar</Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        ))}
      </Container>
    );
  }

export default List;
