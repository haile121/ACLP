"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { paymentApi } from "@/lib/api";
import { useDialog } from "@/components/ui/DialogProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { show } = useDialog();
  const [paywallLoading, setPaywallLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setPaywallLoading(true);
      const res = await paymentApi.initialize();
      window.location.href = res.data.checkout_url;
    } catch (e: any) {
      show({
        variant: "error",
        title: "Payment error",
        message:
          e?.response?.data?.error || "Failed to initialize payment gateway.",
      });
      setPaywallLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col pt-12 pb-24 items-center max-w-4xl mx-auto px-4 sm:px-6">
      <div className="w-full mb-8">
        <button
          onClick={() => router.back()}
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-6 ring-8 ring-blue-50 dark:ring-blue-900/10">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Unlock the Full C++ Course
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Get lifetime access to all advanced C++ chapters, comprehensive
          interactive lessons, and official completion certificates.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8 w-full">
        {/* Left column: Features */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm col-span-1 h-fit">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            What you'll get:
          </h2>
          <ul className="space-y-4">
            {[
              "Access to all 10+ C++ chapters",
              "Advanced topic lessons (Pointers, OOP, File I/O)",
              "Algorithm and Data Structure labs",
              "Unlimited completion certificate generation",
              "Progress tracking and gamification rewards",
              "Ad-free learning experience",
              "Lifetime access with all future updates",
            ].map((feature, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: Payment / Summary */}
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Full C++ Course
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Lifetime Access
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                1000 ETB
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center py-6">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Total
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              1000 ETB
            </p>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={paywallLoading}
            size="lg"
            className="w-full h-14 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
          >
            {paywallLoading ? (
              "Redirecting to Chapa..."
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay with Chapa
              </>
            )}
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure payment via Chapa Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
