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
    <>{loading && <LoaddingUI />}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-10 w-auto"
            src="/logo.png"
            alt="평가 시스템"
            width={100}
            height={100}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            평가 시스템
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={loginInfo.id}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, id: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={loginInfo.pw}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, pw: e.target.value })
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.nativeEvent.isComposing === false &&
                    loginInfo.id.trim() !== "" &&
                    loginInfo.pw.trim() !== ""
                  ) {
                    e.preventDefault();
                    tryLogin();
                  }
                }}
              />
            </div>
          </div>

          <div className="pt-5">
            <button
              type="button"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={(e) => {
                tryLogin();
              }}
            >
              Sign in
            </button>
          </div>


          <div className="pt-5">
            <button
              type="button"
              className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={(e) => {
                router.push("/signup");
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div></>
  );
}
