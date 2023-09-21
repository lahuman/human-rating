'use client';

import React, { ReactNode, useContext, useState } from "react";

export interface LoadContextType {
    setLoading: (loading: boolean) => void;
    loading: boolean;
}

const LoadContext = React.createContext<LoadContextType>({ loading: false, setLoading: () => { } });

export function useLoad() {
    return useContext(LoadContext);
}

export function LoadProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false);
    return <LoadContext.Provider value={{ loading, setLoading }}>{children}</LoadContext.Provider>;
}


