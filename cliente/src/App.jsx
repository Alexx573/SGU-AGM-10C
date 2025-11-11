import React, { useState, useEffect } from 'react';
// ¡NUEVAS IMPORTACIONES! Row, Col, Card
import { Container, Table, Button, Form, Alert, Navbar, Spinner, Row, Col, Card } from 'react-bootstrap';
import * as UserService from './modules/users/UserService';

import './App.css'; 

function App() {

  const [users, setUsers] = useState([]); 
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '' });
  const [editingId, setEditingId] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        await UserService.deleteUser(id);
        loadUsers(); 
      } catch (err) {
        setError("Error al eliminar.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber });
    setError(null);
  };
  

  const resetForm = () => {
    setEditingId(null);
    setFormData({ fullName: '', email: '', phoneNumber: '' });
    setError(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setError("Nombre y Email son obligatorios.");
      return;
    }

    try {
      setError(null);
      if (editingId) {
        await UserService.updateUser(editingId, formData);
      } else {
        await UserService.createUser(formData);
      }
      loadUsers(); 
      resetForm(); 
    } catch (err) {
      setError("Error al guardar.");
    }
  };


  return (
    <>

      <Navbar className="sgu-navbar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Gestión de Usuarios</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          
  
          <Col md={4}>
            <Card className="form-card">
              <Card.Body>
                <Card.Title as="h4">{editingId ? 'Editar Usuario' : 'Crear Usuario'}</Card.Title>
                
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="mt-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
 
                  <Button variant="primary" type="submit" className="me-2">
                    {editingId ? 'Actualizar' : 'Guardar'}
                  </Button>
                  
           
                  {editingId && (
                    <Button variant="secondary" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>

  
          <Col md={8}>
            {loading && (
              <div className="text-center">
                <Spinner animation="border" role="status" />
              </div>
            )}
            
            {!loading && (
              <Table hover responsive>
 
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <div className="action-buttons">
             
                          <Button className="btn-accent" size="sm" onClick={() => handleEdit(user)}>
                            Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {!loading && users.length === 0 && (
              <Alert variant="info">No hay usuarios registrados.</Alert>
            )}
          </Col>

        </Row>
      </Container>
    </>
  );
}

export default App;