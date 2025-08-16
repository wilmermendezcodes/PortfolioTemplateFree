import LoginModal from "@/components/LoginModal";
import { SEOHead } from "@/components/SEOHead";

export default function Login() {
  return (
    <>
      <SEOHead
        title="Login - Access Your Cozy Recommendations Account"
        description="Sign in to access your personalized AI-powered movie, book, and music recommendations. Create your account to start discovering content based on your mood."
        keywords="login, sign in, cozy account, access recommendations, user account"
        canonical="https://cozy-recommendations.replit.app/login"
        noIndex={true}
      />
      <LoginModal />
    </>
  );
}
