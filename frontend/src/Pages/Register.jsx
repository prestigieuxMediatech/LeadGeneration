
import React, { useContext, useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Mail,
  MoveUpRight,
} from "lucide-react";
import axios from "axios";
import { LeadContext } from "@/Context/leadContext";
import { toast } from "react-toastify";

export default function Register() {
  const [name,setName]=useState("")
  const [email, setEmail] = useState("");
  const[password,setPassword]=useState("")
  
  const [loading, setLoading] = useState(false);
  const {backendUrl, setCookie, getCookie, navigate}=useContext(LeadContext)
const token=getCookie("token")


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    try {
      console.log(email);

      const response=await axios.post(`${backendUrl}/register`,{email,name, password})
      console.log(response.data)
      
      console.log(response)
      if(response?.data?.success == true){
        setLoading(false)
        setCookie("token",response.data.token)
        setCookie("admin",response.data.role)
        navigate("/dashboard")
      return   toast.success(" Login Successfully")
      
      }
      else{
        setLoading(false)
        return toast.error(response?.data?.error)
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F6F5F0] text-[#171717]">

      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)",
          backgroundSize: "65px 65px",
        }}
      />

    

      {/* Main Content */}
      <section className="relative z-10 flex w-full flex-1 items-center justify-center px-6 py-16">

        <div className="w-full max-w-[460px]">

       
          {/* Form Heading */}
          <div className="mb-12">

            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-black/15">
              <Mail size={22} strokeWidth={1.5} />
            </div>

          
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <label
              htmlFor="email"
              className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              Your email address
            </label>

            {/* Email Input */}
            <div className="group relative">

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b border-neutral-400 bg-transparent pb-5 pr-10 text-xl tracking-tight outline-none transition-colors placeholder:text-neutral-400 focus:border-black sm:text-2xl"
              />

              <MoveUpRight
                size={20}
                className="absolute right-0 top-1 text-neutral-400 transition-colors group-focus-within:text-black"
              />
            </div>




            {/* Your UserName */}

            <label
              htmlFor="username"
              className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              Your email address
            </label>

            {/* Email Input */}
            <div className="group relative">

              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                placeholder="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-0 border-b border-neutral-400 bg-transparent pb-5 pr-10 text-xl tracking-tight outline-none transition-colors placeholder:text-neutral-400 focus:border-black sm:text-2xl"
              />

              <MoveUpRight
                size={20}
                className="absolute right-0 top-1 text-neutral-400 transition-colors group-focus-within:text-black"
              />
            </div>
     
            {/* your password */}

             <label
              htmlFor="email"
              className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] mt-3"
            >
              Your Password
            </label>

            {/* Email Input */}
            <div className="group relative">

              <input
                id="email"
                type="password"
                required
                autoComplete="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 border-b border-neutral-400 bg-transparent pb-5 pr-10 text-xl tracking-tight outline-none transition-colors placeholder:text-neutral-400 focus:border-black sm:text-2xl"
              />

              <MoveUpRight
                size={20}
                className="absolute right-0 top-1 text-neutral-400 transition-colors group-focus-within:text-black"
              />
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-10 flex w-full items-center justify-between rounded-full bg-[#171717] p-2 pl-7 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <span>
                {loading ? "Please wait..." : " Registoration"}
              </span>

              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4F36A] text-black transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={21} />
              </span>

            </button>

          </form>

          {/* Back Link */}
          <div className="mt-8 flex items-center justify-between">

            <a
              href="/login"
              className="group flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />

              Remember your password?
            </a>

            <span className="font-mono text-xs text-neutral-400">
              STEP 01 / 02
            </span>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 px-6 py-6 md:px-12 lg:px-20">

        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
          © {new Date().getFullYear()} Lead Generation
        </span>

        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-500">
          Your workspace. Your control.
        </span>

      </footer>

    </main>
  );
}
