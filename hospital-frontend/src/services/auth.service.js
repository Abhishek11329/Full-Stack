import api from './api.service';

const login = async (username, password) => {
    const response = await api.post('/auth/login', {
        username,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const register = async (userData) => {
    return api.post('/auth/register', userData);
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    register,
    getCurrentUser,
};

export default authService;
