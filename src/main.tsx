import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './infrastructure/queryClient'
import './index.css'
import './i18n'
import App from './App'
import { LoadingProvider } from './shared/context/LoadingContext'
import { ErrorProvider } from './shared/context/ErrorContext'
import { NotificationProvider } from './shared/context/NotificationContext'
import { AuthProvider } from './shared/context/AuthContext'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <NotificationProvider>
          <LoadingProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </LoadingProvider>
        </NotificationProvider>
      </ErrorProvider>
    </QueryClientProvider>
  </StrictMode>,
)
