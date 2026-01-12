import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Skeleton } from './components/ui/skeleton'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AuthPage } from './pages/AuthPage'
import { ListingsPage } from './pages/ListingsPage'
import { CreateListingPage } from './pages/CreateListingPage'
import { EditListingPage } from './pages/EditListingPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { CreateStayPage } from './pages/CreateStayPage'
import { SyncStaysPage } from './pages/SyncStaysPage'
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
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/listings/new" element={<CreateListingPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/listings/:id/stays/sync" element={<SyncStaysPage />} />
            <Route path="/listings/:listingId/stays/new" element={<CreateStayPage />} />
            <Route path="/stays/:stayId/checkout-photos" element={<CheckoutPhotosPage />} />
            <Route path="/stays/:stayId/checkin-photos" element={<CheckinPhotosPage />} />
            <Route path="/stays/:id" element={<StayDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
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
