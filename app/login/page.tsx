"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import pb from "../pb";
import { useLoad } from "@/context/LoadContext";
import LoaddingUI from "../Loadding";

export default function Login() {
  const { login } = useAuth();
  const { setLoading, loading } = useLoad();
  const router = useRouter();

  const [loginInfo, setLoginInfo] = useState({
    id: "",
    pw: "",
  });

  async function tryLogin() {
    setLoading(true);
    if (login) await login(loginInfo.id, loginInfo.pw);

    if (pb.authStore.isValid) {
      router.push("/");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.push("/");
    }
  }, [pb.authStore.isValid]);
  return (
    <>
      {loading && <LoaddingUI />}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700 px-4 py-12 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image
              className="h-12 w-auto"
              src="/logo.png"
              alt="평가 시스템"
              width={100}
              height={100}
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  value={loginInfo.id}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, id: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  value={loginInfo.pw}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, pw: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={(e) => {
                  tryLogin();
                }}
              >
                Sign in
              </button>
            </div>
            <div>
              <button
                type="button"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={(e) => {
                  router.push("/signup");
                }}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
   
  );
}
