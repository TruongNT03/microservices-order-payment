import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v4";
import * as User from "@/services/User";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { Link } from "react-router-dom";

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
    <div className="w-screen h-screen flex justify-center items-center text-black bg-slate-100">
      <Toaster position="top-right" />
      <div className="w-[400px] h-fit  border border-black/20 rounded-2xl p-6 flex flex-col bg-white">
        <h2 className="text-2xl font-semibold text-center mb-8">Sign In</h2>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="relative w-[310px] mx-auto mb-6 border-b-2 border-black/20">
            <input
              {...register("username")}
              type="text"
              required
              className="w-full h-12 bg-transparent outline-none border-none text-black px-1 pt-5 peer"
            />
            <label
              className="absolute left-1 top-4 e text-md pointer-events-none transition-all duration-300
              peer-focus:top-[-5px] peer-valid:top-[-5px]"
            >
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative w-[310px] mx-auto mb-6 border-b-2 border-black/20">
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
              className="w-full h-10 bg-black cursor-pointer text-white rounded-sm font-semibold active:opacity-10 hover:opacity-60 transition"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Register */}
        <div className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
