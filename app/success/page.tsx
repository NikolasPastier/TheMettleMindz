"use client"

import { Suspense } from "react"
import SuccessPageContent from "./success-content"

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessPageLoading />}>
      <SuccessPageContent />
    </Suspense>
  )
}

function SuccessPageLoading() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="pt-20 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
            <p className="text-white text-lg">Loading your purchase details...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we verify your payment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
