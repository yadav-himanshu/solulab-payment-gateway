import { MainDashboard } from "@/components/MainDashboard";

export default function Home() {
  return (
    <div className="w-full max-w-5xl animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-gray-500 mb-4 tracking-tight">
          SecurePay Gateway
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Experience a production-grade payment flow with real-time card validation, 
          live previews, and comprehensive lifecycle management.
        </p>
      </header>

      <MainDashboard />
    </div>
  );
}
