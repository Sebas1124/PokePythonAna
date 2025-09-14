import { Route, Routes } from "react-router-dom"
import { HomeLayout } from "./components/layouts/HomeLayout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HomePage, AccountPage, PokemonDetailPage } from "./pages"
import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
})

export const App = () => {

  useEffect(() => {
      useAuthStore.getState().initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/account" element={<AccountPage/>} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage/>} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}
