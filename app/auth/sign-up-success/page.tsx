import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-400">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-800 rounded-md">
              <p className="text-sm text-green-400">
                Thank you for signing up! Please check your email and click the confirmation link to activate your
                account.
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Once you've confirmed your email, you'll be able to sign in to your dashboard.
            </p>
            <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
