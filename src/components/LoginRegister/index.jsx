import { useState } from "react";
import "./styles.css";

function LoginRegister({ onLoginSuccess }) {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginName.trim() || !password) {
      setError("Please enter login name or password");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        "https://3c7cpk-8081.csb.app/api/user/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            login_name: loginName,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const user = await response.json();
        onLoginSuccess(user);
      } else {
        const errorText = await response.text();
        setError(errorText || "Login failed.");
      }
    } catch (err) {
      setError(err.toString());
    }
  };

  const clearFormFields = () => {
    setLoginName("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setLocation("");
    setDescription("");
    setOccupation("");
    setError("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    if (!loginName || !password || !firstName || !lastName) {
      setRegisterError("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(
        "https://3c7cpk-8081.csb.app/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login_name: loginName,
            password: password,
            first_name: firstName,
            last_name: lastName,
            description: description,
            occupation: occupation,
            location: location,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setRegisterError(result.error || "Registration failed.");
        return;
      }

      console.log(result);
      alert("Registration successful!");
      clearFormFields();
    } catch (err) {
      console.log(err);
      setRegisterError("Network error.");
    }
  };

  return (
    <div>
      {registerMode ? (
        <div className="login-register-container">
          <div className="login-box">
            <h1>REGISTER</h1>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <div className="form-field full-width">
                  <label>Login name:</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="Enter login name"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Confirm password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter confirm password"
                  />
                </div>

                <div className="register-fields">
                  <div className="form-field">
                    <label>First name:</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="form-field">
                    <label>Last name:</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="form-field full-width">
                  <label>Location:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Occupation:</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Description:</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
              </div>

              <div className="button-group">
                <button type="submit">Register me</button>
                <button type="button" onClick={() => setRegisterMode(false)}>
                  Back to Login
                </button>
              </div>
            </form>
            {registerError && <div className="error">{registerError}</div>}
          </div>
        </div>
      ) : (
        <div className="login-register-container">
          <div className="login-box">
            <h1>LOGIN</h1>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <div className="form-field">
                  <label>Login name:</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="Enter login name"
                  />
                </div>

                <div className="form-field">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="button-group">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setRegisterMode(true)}>
                  Register
                </button>
              </div>
            </form>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginRegister;
