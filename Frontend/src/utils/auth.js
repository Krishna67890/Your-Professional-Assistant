
export async function loginUser(credentials) {
  try {
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      credentials: 'include', // For cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

import { loginUser } from '../utils/auth';

function SignIn() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      // Redirect on success
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
}