import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link , useNavigate } from "react-router-dom";
import "./Signup.css";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
  }

    e.preventDefault();
    // Example usage of the state values
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    
    axios.post('http://localhost:3001/register', { name, email, password })
    .then(() => {
      alert("Registered Successfully");
      navigate('/login');
    })
    .catch(err => {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error); // Display the server error message
      } else {
        console.log(err);
      }
    });
  };


  return (
    <div className="full-background">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="register-container" style={{ width: "400px" }}>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">
                <p>Name</p>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                name="name"
                className="form-control rounded-0"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            <p className="mt-3 text-center">Already Have an Account?</p>
            <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none" >
 <div className="login">Login</div> 
</Link>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
