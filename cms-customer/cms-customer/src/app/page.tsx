"use client";

import ClientFeedback from "@/components/home/ClientFeedback";
import Hero from "@/components/home/hero";
import Information from "@/components/home/information";
import ServiceList from "@/components/home/service";
import ScrollReveal from "@/components/ui/ScrollReveal";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-r from-orange-300 to-orange-200">
      <Hero />
      <ScrollReveal delay={0.3}>
        <Information />
      </ScrollReveal>
      <ScrollReveal delay={0.3}>
        <ServiceList />
      </ScrollReveal>
      <ScrollReveal delay={0.3}>
        <ClientFeedback />
      </ScrollReveal>
    </main>
  );
}
