import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v4";
import * as User from "@/services/User";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const response = await User.login({
      username: data.username,
      password: data.password,
    });
    if (response.statusCode === 201) {
      navigate("/");
    } else {
      toast("Thông báo", {
        description: response.message,
      });
    }
  };
  return (
    <div className="w-screen h-screen bg-[url(unsplash.jpg)] bg-cover flex justify-center items-center text-white bg-slate-100">
      <Toaster position="top-right" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[400px] h-fit rounded-2xl p-6 flex flex-col bg-transparent backdrop-brightness-150 backdrop-blur-md border-white border-[1px]"
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Sign In</h2>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="relative w-[310px] mx-auto mb-6 border-b-2 border-white">
            <input
              {...register("username")}
              type="text"
              required
              className="w-full h-12 bg-transparent outline-none border-none px-1 pt-5 peer"
            />
            <label
              className="absolute left-1 top-4 e text-md pointer-events-none transition-all duration-300
              peer-focus:top-[-5px] peer-valid:top-[-5px]"
            >
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative w-[310px] mx-auto mb-6 border-b-2 border-white">
            <input
              {...register("password")}
              type={passwordVisible ? "text" : "password"}
              required
              className="w-full h-12 bg-transparent outline-none border-none px-1 pt-5 peer"
            />
            <label
              className="absolute left-1 top-4 text-md pointer-events-none transition-all duration-300
              peer-focus:top-[-5px] peer-valid:top-[-5px]"
            >
              Password
            </label>
            <FaRegEyeSlash
              className="invisible absolute cursor-pointer right-2 top-5 hover:text-blue-500 peer-valid:visible"
              onClick={() => {
                setPasswordVisible((prev) => !prev);
              }}
            />
          </div>

          {/* Login Button */}
          <div className="px-5 mt-6">
            <button
              type="submit"
              className="w-full h-10 bg-black cursor-pointer text-white rounded-sm font-semibold active:opacity-10 hover:bg-stone-800 transition"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="text-center mt-2">or</div>

        {/* Google Login*/}
        <a
          className="px-5 mt-2"
          href="http://localhost:8080/api/v1/auth/google/login"
        >
          <button
            type="button"
            className="w-full h-10 bg-red-700 flex justify-center items-center cursor-pointer text-white rounded-sm font-semibold active:opacity-10 hover:bg-red-800 transition"
          >
            <FaGoogle />
          </button>
        </a>

        {/* Register */}
        <div className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
