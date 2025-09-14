import { SpinnerComponent } from "../components/common";
import { useAuthStore } from "../store/useAuthStore";
import { AccountPage } from "./AccountPage";
import { AuthPage } from "./AuthPage";

export const HomePage = () => {

  const { session, loading } = useAuthStore();

  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <SpinnerComponent />
        </div>
      )
    }

  return (
    <>
     {session ? <AccountPage /> : <AuthPage />}
    </>
  )
}
