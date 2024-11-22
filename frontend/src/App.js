import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const initialFormData = { 
    code: '', 
    moduleName: '' 
  }

  const [modules, setModules] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);

  // Refresh module table when Component mounts
  useEffect(() => {
    refreshModuleTable();
  }, []);

  function refreshModuleTable() {
    // [Path 1 - Get] -- Get all Modules
    axios.get('http://localhost:5000/modules/get')
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => console.error(error.message));
  }

  function handleInputChange (e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit (e) {
    e.preventDefault();

    if (!isEditing) {
      // [Path 2 - POST] -- Create a Module 
      axios.post('http://localhost:5000/modules/create', formData)
        .then((response) => {
          refreshModuleTable(); // Refresh <table> after CREATE
          console.log(`Module created: `, response.data);
          setFormData(initialFormData); // Clear the form
        })
        .catch((error) => console.error(error.message));
    } else {
      // [Path 4 - PUT] -- Update a Module
      axios.put(`http://localhost:5000/modules/update/${editingModuleId}`, formData)
        .then((response) => {
          refreshModuleTable(); // Refresh <table> after UPDATE
          console.log(`Module updated: `, response.data);
          setFormData(initialFormData); // Clear the form
          setIsEditing(false);
          setEditingModuleId(null);
        })
        .catch((error) => console.error(error.message));
    }
  };

  function handleEdit (id) {
    setEditingModuleId(id);
    // [Path 3 - GET] -- Get a Module
    axios.get(`http://localhost:5000/modules/get/${id}`)
      .then((response) => {
        setFormData({
          code: response.data.code,
          moduleName: response.data.moduleName,
        });
        setIsEditing(true);
      })
      .catch((error) => console.error(error.message));
  };

  function handleDelete (id) {
    // [Path 5 -- DELETE] -- Delete a Module 
    axios.delete(`http://localhost:5000/modules/delete/${id}`)
      .then((response) => {
        refreshModuleTable();
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <div className="App">
      <h3>CRUD for Maynooth Module</h3>
      <table>
        <thead>
          <tr>
            <th>Module ID</th>
            <th>Module Code</th>
            <th>Module Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module._id}>
              <td>{module._id}</td>
              <td>{module.code}</td>
              <td>{module.moduleName}</td>
              <td>
                <button onClick={() => handleEdit(module._id)}>Edit</button>
                <button onClick={() => handleDelete(module._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Module Submit Form</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Module Code:</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Module Name:</label>
          <input
            type="text"
            name="moduleName"
            value={formData.moduleName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">
            {isEditing ? 'Edit Module' : 'Create Module'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;