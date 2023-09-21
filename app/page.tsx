'use client';

import { useEffect } from "react";
import pb from "./pb";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.push("/human");
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <></>
  );
}
