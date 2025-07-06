import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import * as z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import * as User from "../../services/User";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router";

const registerSchema = z
  .object({
    username: z.string(),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{6,}$/,
        {
          message:
            "Mật khẩu phải có ít nhất 6 ký tự bao gồm: Chữ thường, chữ in hoa, số, ký tự đặc biệt",
        }
      ),
    repassword: z.string(),
    email: z.email({ message: "Hãy chắc chắn nhập đúng định dạng email" }),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Mật khẩu không khớp",
    path: ["repassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    const response = await User.register({
      username: data.username,
      password: data.password,
      email: data.email,
    });
    if (response.success) {
      toast("Thông báo", {
        description: () =>
          "Đăng ký tài khoản thành công! Đang chuyên hướng đến trang đăng nhập...",
        duration: 2000,
        onAutoClose: () => {
          navigate("/login");
        },
      });
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
        <h2 className="text-2xl font-semibold text-center mb-8">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="relative w-[310px] mx-auto mb-10 border-b-2 border-black/20">
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

          {/* Email */}
          <div className="relative w-[310px] mx-auto mb-10 border-b-2 border-black/20">
            <input
              {...register("email")}
              type="text"
              required
              className="w-full h-12 bg-transparent outline-none border-none text-black px-1 pt-5 peer"
            />
            <label
              className="absolute left-1 top-4 e text-md pointer-events-none transition-all duration-300
              peer-focus:top-[-5px] peer-valid:top-[-5px]"
            >
              Email
            </label>
            {errors.email && (
              <div className="absolute -bottom-5 text-xs text-red-500">
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="relative w-[310px] mx-auto mb-10 border-b-2 border-black/20">
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
            {errors.password && (
              <div className="absolute -bottom-9 text-xs text-red-500">
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative w-[310px] mx-auto mb-10 border-b-2 border-black/20">
            <input
              {...register("repassword")}
              type={rePasswordVisible ? "text" : "password"}
              required
              className="w-full h-12 bg-transparent outline-none border-none  px-1 pt-5 peer"
            />
            <label
              className="absolute left-1 top-4  text-md pointer-events-none transition-all duration-300
              peer-focus:top-[-5px] peer-valid:top-[-5px]"
            >
              Confirm Password
            </label>
            <FaRegEyeSlash
              className="invisible absolute cursor-pointer right-2 top-5 hover:text-blue-500 peer-valid:visible"
              onClick={() => {
                setRePasswordVisible((prev) => !prev);
              }}
            />
            {errors.repassword && (
              <div className="absolute -bottom-5 text-xs text-red-500">
                {errors.repassword.message}
              </div>
            )}
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
          Do have an account?{" "}
          <a href="login" className="font-semibold hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
