import { useEffect, useState } from "react";
import { Input } from "../components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import "../styles/Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../backendServices/authService";
import { login } from "../store/slices/authSlice";
const defaultAuthDetails = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  avatar: null,
  coverImage: null,
};

const errorCondition = {
  email: {
    required: {
      message: "Email is required",
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
  },
  password: {
    required: {
      message: "Password is required",
    },
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      message:
        "Password must include an uppercase letter, lowercase letter, number, and special character.",
    },
  },
  username: {
    required: {
      message: "Username is required",
    },
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters long",
    },
  },
  fullName: {
    required: {
      message: "Full Name is required",
    },
    minLength: {
      value: 3,
      message: "Full Name must be at least 3 characters long",
    },
  },
  avatar: {
    required: {
      message: "Avatar is required",
    },
  },
};

const Auth = ({ type }) => {
  const [isLogin, setIsLogin] = useState(type == "l" ? true : false);
  const isUserLogedIn = useSelector((state) => state.auth.isLogedIn);
  const navigate = useNavigate();
  const dispath = useDispatch();
  const locationState = useLocation().state;
  useEffect(() => {
    if (type === "l") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    if (isUserLogedIn) {
      if (locationState?.from) {
        navigate(locationState.from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }

    setErrorMessage("");
  }, [type]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [isHoverInAvatar, setIsHoverInAvatar] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState("");

  const [authDetails, setAuthDetails] = useState(defaultAuthDetails);
  const onChange = (e) => {
    setAuthDetails({ ...authDetails, [e.target.name]: e.target.value });
  };

  const [errorMessage, setErrorMessage] = useState("");
  const isFieldValidate = (field) => {
    if (errorCondition[field]) {
      const { required, minLength, pattern } = errorCondition[field];

      if (required && authDetails[field] === "") {
        return { isValid: false, message: required.message };
      }
      if (minLength && authDetails[field].length < minLength.value) {
        return { isValid: false, message: minLength.message };
      }
      if (pattern && !pattern.value.test(authDetails[field])) {
        return { isValid: false, message: pattern.message };
      }
    }
    return { isValid: true };
  };
  const onSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      for (const key of Object.keys(authDetails)) {
        const { isValid, message } = isFieldValidate(key);
        if (!isValid) {
          setErrorMessage(message);
          return;
        }
      }

      setErrorMessage("");
      authService
        .register(authDetails)
        .then((data) => {
          dispath(login(data.user));
        })
        .catch(setErrorMessage);
    } else {
      if (!authDetails.email && !authDetails.username) {
        setErrorMessage("Email or Username are required");
        return;
      }

      const { isValid, message } = isFieldValidate("password");
      if (!isValid) {
        setErrorMessage(message);
        return;
      }

      setErrorMessage("");
      authService
        .login({
          email: authDetails.email?.trim(),
          password: authDetails.password,
          username: authDetails.username?.trim(),
        })
        .then((data) => {
          dispath(login(data.user));
          navigate(locationState?.from || "/", { replace: true });
        })
        .catch(setErrorMessage);
    }
  };

  return (
    <div className="authContainer flex-all">
      <form className="form-control" onSubmit={onSubmit}>
        <p className="title">{isLogin ? "Login" : "Register"}</p>
        {isLogin || (
          <>
            <div
              className="filePreview flex-all"
              style={{ backgroundImage: `url(${coverImagePreview})` }}
            >
              <label
                htmlFor="avatar"
                onMouseEnter={() => setIsHoverInAvatar(true)}
                onMouseLeave={() => setIsHoverInAvatar(false)}
              >
                <Avatar
                  src={avatarPreview}
                  children={authDetails?.fullName?.[0]}
                  alt="User Avatar"
                  className="avatarPreview flex-all"
                />
                {isHoverInAvatar && (
                  <div className="carmeraOverlay flex-all">
                    <CloudUploadOutlined />
                  </div>
                )}
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  required
                  onChange={(e) => {
                    const avatar = e.target.files[0];
                    if (avatar) {
                      setAvatarPreview(URL.createObjectURL(avatar));
                      setAuthDetails({ ...authDetails, avatar });
                    } else {
                      setAvatarPreview("");
                      setAuthDetails({ ...authDetails, avatar: null });
                    }
                  }}
                />
              </label>
            </div>
            <Input
              onChange={onChange}
              required
              name="fullName"
              value={authDetails.fullName}
              label="Enter Full Name"
              type="text"
            />
          </>
        )}
        <Input
          onChange={onChange}
          label="Enter Email"
          name="email"
          type="email"
          required={!isLogin}
          value={authDetails.email}
        />
        {isLogin && <span className="orText">or</span>}
        <Input
          onChange={onChange}
          label="Enter Username"
          name="username"
          type="text"
          required={!isLogin}
          value={authDetails.username}
        />
        <Input
          label="Enter Password"
          name="password"
          type="password"
          required
          onChange={onChange}
          value={authDetails.password}
        />
        {isLogin || (
          <Input
            name="coverImage"
            label="Upload Cover Image"
            type="file"
            required={false}
            classname="coverImageUpload"
            validate={authDetails.coverImage ? true : false}
            onChange={(e) => {
              const coverImage = e.target.files[0];
              if (coverImage) {
                setCoverImagePreview(URL.createObjectURL(coverImage));
                setAuthDetails({ ...authDetails, coverImage });
              } else {
                setCoverImagePreview("");
                setAuthDetails({ ...authDetails, coverImage: null });
              }
            }}
          />
        )}
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        <button className="submit-btn" type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
        <Link
          to={`/${isLogin ? "register" : "login"}`}
          className="switchTypeBtn"
        >
          {isLogin ? "Don't Have an Account" : "Already Have a Account"}
        </Link>
      </form>
    </div>
  );
};

export default Auth;
