"use client";

import { useEffect, useState, useRef } from "react";
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
  const passwordRef = useRef<HTMLInputElement | null>(null);

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
      <div className="flex min-h-screen items-center justify-center bg-[#FAE100] px-6 py-16 lg:px-12">
        <div className="w-full max-w-lg space-y-10">
          <div className="flex flex-col items-center">
            <Image
              className="h-16 w-auto"
              src="/logo.png"
              alt="Evaluation System"
              width={128}
              height={128}
            />
            <h2 className="mt-8 text-center text-4xl font-bold tracking-tight text-[#3C1E1E]">
              로그인하세요
            </h2>
          </div>
          <form className="mt-10 space-y-8" action="#" method="POST" onSubmit={(e) => { e.preventDefault(); tryLogin(); }}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-[#3C1E1E] mb-2">
                  이메일 주소
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border border-transparent px-4 py-3 text-[#3C1E1E] placeholder-[#3C1E1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9D342] focus:ring-offset-[#FAE100] bg-white"
                  placeholder="이메일 주소"
                  value={loginInfo.id}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, id: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      passwordRef.current?.focus();
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#3C1E1E] mb-2">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  ref={passwordRef}
                  className="block w-full rounded-md border border-transparent px-4 py-3 text-[#3C1E1E] placeholder-[#3C1E1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9D342] focus:ring-offset-[#FAE100] bg-white"
                  placeholder="비밀번호"
                  value={loginInfo.pw}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, pw: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      tryLogin();
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#3C1E1E] py-3 px-6 text-lg font-semibold text-[#FAE100] hover:bg-[#2E1515] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E1515] focus:ring-offset-[#FAE100]"
                onClick={(e) => {
                  tryLogin();
                }}
              >
                로그인
              </button>
            </div>
            <div>
              <button
                type="button"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#FAE100] py-3 px-6 text-lg font-semibold text-[#3C1E1E] hover:bg-[#F9D342] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9D342] focus:ring-offset-[#3C1E1E]"
                onClick={(e) => {
                  router.push("/signup");
                }}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
