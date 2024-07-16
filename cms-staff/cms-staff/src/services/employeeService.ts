// services/employeeService.ts
import axios from 'axios';

const API_URL = "/api/employees"; // Đường dẫn API

const getAllEmployees = () => axios.get(API_URL);
const getEmployeeById = (id) => axios.get(`${API_URL}/${id}`);
const createEmployee = (employee) => axios.post(API_URL, employee);
const updateEmployee = (id, employee) => axios.put(`${API_URL}/${id}`, employee);
const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
