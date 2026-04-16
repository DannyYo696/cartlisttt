import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, ArrowRight, Loader2 } from "lucide-react";

export default function BusinessNameModal() {
  const { user, fetchWithAuth, checkAuth } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show if user is logged in but has no business name or whatsapp number
  const show = !!user && (!user.businessName || !user.whatsappNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !whatsappNumber.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetchWithAuth("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessName: businessName.trim(),
          whatsappNumber: whatsappNumber.trim()
        }),
      });

      if (response.ok) {
        await checkAuth(); // Refresh user data
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[40px] p-8 sm:p-10 shadow-2xl overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cartlist-orange/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cartlist-orange/5 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 sm:mb-8 rotate-3 shadow-inner">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-cartlist-orange -rotate-3" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2 sm:mb-3 text-gray-900">One last thing!</h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                We need a few more details to set up your professional dashboard.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-2xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="businessName" className="text-sm font-bold ml-1">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g. Adaeze's Grains"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-12 sm:h-14 border-orange-100 focus:border-cartlist-orange focus:ring-cartlist-orange rounded-2xl text-base sm:text-lg px-6"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="whatsappNumber" className="text-sm font-bold ml-1">WhatsApp Phone Number</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="e.g. 08012345678"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="h-12 sm:h-14 border-orange-100 focus:border-cartlist-orange focus:ring-cartlist-orange rounded-2xl text-base sm:text-lg px-6"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !businessName.trim() || !whatsappNumber.trim()}
                  className="w-full h-14 sm:h-16 bg-cartlist-orange hover:bg-orange-600 text-white rounded-full text-lg sm:text-xl font-bold shadow-xl shadow-orange-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Get Started <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
