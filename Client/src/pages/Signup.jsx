import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "@remixicon/react";
import { ChatState } from "../../Context/ChatProvider";
import ChatWaveLogo from "../assets/ChatWaveLogo.png"

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)


  const uploadPic = (pic) =>{
    setLoading(true)
    if(pic === undefined)
    {
      alert("Upload a picture")
    }
    if(pic.type === "image/jpeg" || "image/png" || "image/jpg" || "image/jfif"){
      const data = new FormData();
      data.append("file", pic)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "dtng8fbnf")
      fetch("https://api.cloudinary.com/v1_1/dtng8fbnf/image/upload", {
        method: "post",
        body: data
      })
      .then((res) => res.json())
      .then((data) =>{
        setProfilePicture(data.url.toString());
        setLoading(false)
      })
      .catch((err)=>{
        console.log(err);
        setLoading(false)
      })
    }
    else{
      console.log("Image type not allowed, only JPG, JPEG and PNG allowed");
      setLoading(false)
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let user = {};
    if(profilePicture === ""){
      user = { name, email, password };
    }
    else{
      user = { name, email, password, profilePicture };
    }
    try {
      const {data} = await axios.post("http://127.0.0.1:3000/api/user/signup", user);
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data);
      navigate("/chats");
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="overflow-y-auto">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            to={"/login"}
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src={ChatWaveLogo}
              alt="logo"
            />
            ChatWave
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                method="POST"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    {showPassword ? (
                      <RiEyeOffFill
                        className="cursor-pointer"
                        onClick={handleShowPassword}
                      />
                    ) : (
                      <RiEyeFill
                        className="cursor-pointer"
                        onClick={handleShowPassword}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profilePicture"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    id="profilePicture"
                    accept="image/*"
                    onChange={(e) => uploadPic(e.target.files[0])}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading ? true: false}
                  className={`w-full cursor-pointer text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-green-300 ${loading?"cursor-not-allowed bg-gray-400":""} dark:focus:ring-green-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5`}

                >
                  {loading ? "Loading" : "Create an account"}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to={"/"}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;

