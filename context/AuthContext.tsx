"use client";
import React, { useContext, useState, useEffect, ReactNode } from "react";
import { BaseAuthStore } from "pocketbase";
import pb from "@/app/pb";

export interface AuthContextType {
  currentUser?: BaseAuthStore | null | undefined;
  login?: (id: string, pw: string) => Promise<void>;
  logout?: () => void;
}

const AuthContext = React.createContext<AuthContextType>({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<BaseAuthStore | null>();

  // 로그아웃
  function logout() {
    pb.authStore.clear();
  }

  async function login(id: string, pw: string) {
    try {
      const authData = await pb
        .collection("cstomer_m")
        .authWithPassword(id, pw);
      pb.authStore;
    } catch (e) {
      alert("이메일 또는 비밀번호를 확인하세요!");
    }
  }

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
