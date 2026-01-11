import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthPage } from './pages/AuthPage'
import { ListingsPage } from './pages/ListingsPage'
import { CreateListingPage } from './pages/CreateListingPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { CreateStayPage } from './pages/CreateStayPage'
import { CheckoutPhotosPage } from './pages/CheckoutPhotosPage'
import { CheckinPhotosPage } from './pages/CheckinPhotosPage'
import { StayDetailPage } from './pages/StayDetailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/listings/:listingId/stays/new" element={<CreateStayPage />} />
        <Route path="/stays/:stayId/checkout-photos" element={<CheckoutPhotosPage />} />
        <Route path="/stays/:stayId/checkin-photos" element={<CheckinPhotosPage />} />
        <Route path="/stays/:id" element={<StayDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
