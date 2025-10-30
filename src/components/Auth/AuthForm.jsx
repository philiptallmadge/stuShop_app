import React from "react";



const AuthForm = ({user, isLogin, onChange, onSubmit }) => {
    return (
        <form onSubmit={onSubmit} autoComplete="off">
            {!isLogin ? (
                <div>
                    <div className="form-group" >
                        <label>Organization Name</label>
                        <br />
                        <input
                            type="text"
                            className="form-control"
                            id="organization-name-input"
                            value={user.OrganizationName || user.firstName}
                            onChange={onChange}
                            name="organizationName"
                            placeholder="Organization Name"
                            required
                        />
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div>
                <div className="form-group">
                    <label>Username</label>
                    <br />
                    <input 
                        type="text"
                        className="form-control"
                        id="username-input"
                        value={user.username}
                        onChange={onChange}
                        name="username"
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <br />
                    <input
                      type="email"
                      className="form-control"
                      id="email-input"
                      value={user.email}
                      onChange={onChange}
                      name="email"
                      placeholder="Email"
                      required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <br />
                    <input
                      type="password"
                      className="form-control"
                      id="password-input"
                      value={user.password}
                      onChange={onChange}
                      name="password"
                      min="0"
                      placeholder="Password"
                      required
                    />
                    </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary" onSubmit={onSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AuthForm;