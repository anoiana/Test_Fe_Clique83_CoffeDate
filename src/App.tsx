import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { IntakeSurvey } from './pages/IntakeSurvey';
import { MembershipPaymentPage } from './pages/MembershipPaymentPage';
import { MembershipSuccessPage } from './pages/MembershipSuccessPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { MatchingSurvey } from './pages/MatchingSurvey';
import { Round3Survey } from './features/matching/components/Round3/Round3Survey';
import { Round3SuccessPage } from './features/matching/components/Round3/Round3SuccessPage';
import { ProfileReviewPage } from './pages/ProfileReviewPage';
import MatchProfilePage from './pages/MatchProfilePage';
import { PaymentPage } from './pages/PaymentPage';
import { AvailabilityPage } from './pages/AvailabilityPage';
import { PhotoUploadPage } from './pages/PhotoUploadPage';
import { ReviewJourneyPage } from './pages/ReviewJourneyPage';
import { SuccessConfirmationPage } from './pages/SuccessConfirmationPage';
import { R1CompletionIntro } from './features/onboarding/components/R1CompletionIntro';
import { LocationSelectionPage } from './pages/LocationSelectionPage';
import { AppLayout } from './layouts/AppLayout';
import { MeetingStatusPage } from './pages/MeetingStatusPage';
import { MutualMatchCongratsPage } from './pages/MutualMatchCongratsPage';
import { MatchFoundPage } from './pages/MatchFoundPage';
import { SchedulingSuccessPage } from './pages/SchedulingSuccessPage';
import { GridSelectionPage } from './pages/GridSelectionPage';
import { WaitingPage } from './pages/WaitingPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FeedbackThankYouPage } from './pages/FeedbackThankYouPage';
import { PromiseMadePage } from './pages/PromiseMadePage';
import { ConfirmCompletePage } from './pages/ConfirmCompletePage';
import { WelcomeRound1Page } from './pages/WelcomeRound1Page';
import { CommunityGuidelinesPage } from './pages/CommunityGuidelinesPage';
import { RouteGuard } from './shared/components/RouteGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Auth Flow */}
          <Route path="/" element={<RouteGuard isPublic><AuthPage /></RouteGuard>} />
          <Route path="/settings/profile-review" element={<RouteGuard><ProfileReviewPage /></RouteGuard>} />
          
          {/* Onboarding Flow */}
          <Route path="/onboarding/guidelines" element={<RouteGuard><CommunityGuidelinesPage /></RouteGuard>} />
          <Route path="/onboarding/welcome" element={<RouteGuard><WelcomeRound1Page /></RouteGuard>} />
          <Route path="/onboarding" element={<RouteGuard><IntakeSurvey /></RouteGuard>} />
          <Route path="/onboarding/r1-completion" element={<RouteGuard><R1CompletionIntro /></RouteGuard>} />
          <Route path="/onboarding/matching-survey" element={<RouteGuard><MatchingSurvey /></RouteGuard>} />
          <Route path="/onboarding/photo-upload" element={<RouteGuard><PhotoUploadPage /></RouteGuard>} />
          <Route path="/onboarding/review-status" element={<RouteGuard><ReviewJourneyPage /></RouteGuard>} />
          <Route path="/onboarding/matching-fee" element={<RouteGuard><MembershipPaymentPage /></RouteGuard>} />
          <Route path="/onboarding/membership-success" element={<RouteGuard><MembershipSuccessPage /></RouteGuard>} />
          <Route path="/onboarding/round3" element={<RouteGuard><Round3Survey /></RouteGuard>} />
          <Route path="/onboarding/round3-success" element={<RouteGuard><Round3SuccessPage /></RouteGuard>} />

          {/* Payment Handling */}
          <Route path="/payment/result" element={<RouteGuard><PaymentResultPage /></RouteGuard>} />
          <Route path="/payment-result" element={<RouteGuard><PaymentResultPage /></RouteGuard>} />

          {/* Match & Date Flow */}
          <Route path="/match" element={<RouteGuard><MatchProfilePage /></RouteGuard>} />
          <Route path="/meeting/:meetingId/feedback" element={<RouteGuard><FeedbackPage /></RouteGuard>} />
          <Route path="/meeting/:meetingId/feedback/thank-you" element={<RouteGuard><FeedbackThankYouPage /></RouteGuard>} />
          <Route path="/meeting/:meetingId/promise" element={<RouteGuard><PromiseMadePage /></RouteGuard>} />
          <Route path="/meeting/:meetingId/confirm-complete" element={<RouteGuard><ConfirmCompletePage /></RouteGuard>} />
          <Route path="/match/found" element={<RouteGuard><MatchFoundPage /></RouteGuard>} />
          <Route path="/match/mutual-congrats" element={<RouteGuard><MutualMatchCongratsPage /></RouteGuard>} />
          <Route path="/date-payment" element={<RouteGuard><PaymentPage /></RouteGuard>} />
          <Route path="/meeting-status" element={<RouteGuard><MeetingStatusPage /></RouteGuard>} />
           <Route path="/availability" element={<RouteGuard><AvailabilityPage /></RouteGuard>} />
           <Route path="/availability/selection" element={<RouteGuard><GridSelectionPage /></RouteGuard>} />
           <Route path="/scheduling-success" element={<RouteGuard><SchedulingSuccessPage /></RouteGuard>} />
          <Route path="/select-location" element={<RouteGuard><LocationSelectionPage /></RouteGuard>} />
          <Route path="/success" element={<RouteGuard><SuccessConfirmationPage /></RouteGuard>} />
          <Route path="/waiting" element={<RouteGuard><WaitingPage /></RouteGuard>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
