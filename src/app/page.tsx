"use client";

import { PublicHeader, PublicFooter } from "@/components/fikris";
import { HeroSection } from "@/components/public/hero-section";
import { ProfileSection } from "@/components/public/profile-section";
import { EventsSection } from "@/components/public/events-section";
import { RegistrationSection } from "@/components/public/registration-section";
import { ContactSection } from "@/components/public/contact-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amber-50/30">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection />
        <ProfileSection />
        <EventsSection />
        <RegistrationSection />
        <ContactSection />
      </main>

      <PublicFooter />
    </div>
  );
}