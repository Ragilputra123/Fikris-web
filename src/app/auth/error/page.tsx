import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/fikris/logo";
import { IslamicPattern } from "@/components/fikris/islamic-pattern";
import { AlertTriangle } from "lucide-react";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const errorMessage = (() => {
    switch (searchParams?.error) {
      case "CredentialsSignin":
        return "Email atau password tidak valid.";
      case "AccessDenied":
        return "Akses ditolak.";
      case "Configuration":
        return "Terjadi kesalahan konfigurasi server.";
      default:
        return "Terjadi kesalahan saat autentikasi. Silakan coba lagi.";
    }
  })();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4">
      <IslamicPattern variant="geometric" opacity={0.03} />

      <Card className="w-full max-w-md relative border-red-100 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Autentikasi Gagal
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">{errorMessage}</p>

          <div className="space-y-3">
            <Link href="/auth/signin" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Kembali ke Login
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}