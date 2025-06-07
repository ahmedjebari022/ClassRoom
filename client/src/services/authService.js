import API from '../api';


const authService ={
    register : async (userData) => {
        try {
            const response = await API.post('/auth/register',userData);
            return {
                success:true,
                data:response.data,
            }
        } catch (error) {
            return {
                success:false,
                message:error.response?.data?.message || 'Registration failed',
                error: error.response?.data,
            };
        }
    },
    login : async(credentials) => {
        try {
            const response = await API.post('/auth/login',credentials);
            return{
                success:true,
                data:response.data
            }
        } catch (error) {
            return {
                success:false,
                message:error.response?.data?.message || 'Login failed',
                error:error.response?.data,
            }
        }
    },
    getMe : async () => {
        try {
            const response = await API.get('/auth/me');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to get user info',
                error: error.response?.data,
            };
        }
    },
    logout: async () => {
        try {
            const response = await API.post('/auth/logout');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Logout failed',
                error: error.response?.data,
            };
        }
    },
    updateProfile: async(profileData) => {
        try {
            const response = await API.put('/users/update-profile',profileData);
                return {
                    success: true,
                    data: response.data.user,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.response?.data?.message || 'Profile update failed',
                    error: error.response?.data,
                }

            }

    },
    changePassword: async (passwordData) => {
        try {
            const response = await API.put('/users/change-password', passwordData);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to change password',
                error: error.response?.data,
            };
        }
    }
}

export default authService;