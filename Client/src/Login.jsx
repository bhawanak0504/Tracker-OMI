import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');      
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { email, password })
      .then(res => {
        if (res.data.status === 'Success') {  // Assuming the response data has a status field
            alert('Login Successful as User');
            navigate('/dashboard');
        }
      })
      .catch(err => alert(err.response.data));
  }

  return (
    <div className="full-background">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="login-container" style={{ width: "400px" }}> {/* Apply the new background image class here */}
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
               <p>Email</p>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                className="form-control rounded-0"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">
                <p>Password</p>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                autoComplete="off"
                name="password"
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <p className="mt-3 text-center">Don't Have an Account?</p>
            <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
             <div className="sign">Sign Up</div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
