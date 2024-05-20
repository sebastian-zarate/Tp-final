'use client'
import React, { useState, useEffect } from 'react';
import { getEdificios, updateEdificioUltimaInteraccion } from '@/services/edificios';

const EdificiosPage = () => {
  const [edificios, setEdificios] = useState([]);
  const [editingEdificio, setEditingEdificio] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nivel: '',
    ancho: '',
    largo: '',
    descripcion: '',
    costo: ''
  });

  useEffect(() => {
    fetchEdificios();
  }, []);

  const fetchEdificios = async () => {
    try {
      const edificiosData = await getEdificios();
      setEdificios(edificiosData);
    } catch (error) {
      console.error('Error fetching edificios:', error);
    }
  };

  const handleEditClick = (edificio) => {
    setEditingEdificio(edificio);
    setFormData({
      name: edificio.name,
      nivel: edificio.nivel,
      ancho: edificio.ancho,
      largo: edificio.largo,
      descripcion: edificio.descripcion,
      costo: edificio.costo
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const anchoInt = parseInt(formData.ancho);
      const largoInt = parseInt(formData.largo);
      const costoInt = parseInt(formData.costo);
  
      await updateEdificioUltimaInteraccion(
        editingEdificio.id,
        new Date(),
        anchoInt,
        largoInt,
        costoInt,
        formData.descripcion
      );
      fetchEdificios();
      setEditingEdificio(null);
      setFormData({
        name: '',
        nivel: '',
        ancho: '',
        largo: '',
        descripcion: '',
        costo: ''
      });
    } catch (error) {
      console.error('Error updating edificio:', error);
    }
  }
  

  return (
    <div>
      <h1>Edificios</h1>
      {edificios.map((edificio) => (
        <div key={edificio.id}>
          {editingEdificio && editingEdificio.id === edificio.id ? (
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="nivel"
                value={formData.nivel}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="ancho"
                value={formData.ancho}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="largo"
                value={formData.largo}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="costo"
                value={formData.costo}
                onChange={handleInputChange}
              />
              <button type="submit">Guardar</button>
            </form>
          ) : (
            <div>
              <p>Name: {edificio.name}</p>
              <p>Nivel: {edificio.nivel}</p>
              <p>Ancho: {edificio.ancho}</p>
              <p>Largo: {edificio.largo}</p>
              <p>Descripción: {edificio.descripcion}</p>
              <p>Costo: {edificio.costo}</p>
              <button onClick={() => handleEditClick(edificio)}>Editar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EdificiosPage;
