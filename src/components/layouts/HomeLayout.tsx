import { Outlet } from "react-router-dom";

export const HomeLayout = () => (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-4">
        <div className="w-full max-w-4xl">
            <Outlet />
        </div>
    </div>
);