"use client";
import React, { useContext, useState, useEffect, ReactNode } from "react";
import pb from "@/app/pb";

export interface AuthContextType {
  login?: (id: string, pw: string) => Promise<void>;
  logout?: () => void;
}

const AuthContext = React.createContext<AuthContextType>({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {

  // 로그아웃
  function logout() {
    pb.authStore.clear();
  }

  async function login(id: string, pw: string) {
    try {
      await pb
        .collection("cstomer_m")
        .authWithPassword(id, pw);
    } catch (e) {
      alert("이메일 또는 비밀번호를 확인하세요!");
    }
  }

  const value = {
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
