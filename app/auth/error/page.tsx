import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
              {params?.error ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-400">Error: {params.error}</p>
                  {params.error_description && <p className="text-sm text-red-300">{params.error_description}</p>}
                </div>
              ) : (
                <p className="text-sm text-red-400">An unexpected authentication error occurred.</p>
              )}
            </div>
            <p className="text-sm text-gray-400">Please try again or contact support if the problem persists.</p>
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
