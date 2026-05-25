import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-accent">
            <div></div>
            {children}
        </div>
    )
}