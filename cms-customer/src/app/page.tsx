"use client";

import ClientFeedback from "@/components/home/ClientFeedback";
import Hero from "@/components/home/hero";
import Information from "@/components/home/information";
import ServiceList from "@/components/services/service";
import ScrollReveal from "@/components/ui/ScrollReveal";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-stone-200">
      <Hero />
      <ScrollReveal delay={0.5}>
        <Information />
      </ScrollReveal>
      <ScrollReveal delay={0.5}>
        <ServiceList />
      </ScrollReveal>
      <ScrollReveal delay={0.6}>
        <ClientFeedback />
      </ScrollReveal>
    </main>
  );
}
