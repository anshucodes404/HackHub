

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-12">
        <Hero />
        <Features />
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Hackathon Journey?
            </h2>
            <p className="text-textSecondary mb-8 max-w-2xl mx-auto">
              Join the community of innovators, creators, and problem solvers.
              Host a hackathon or find your next coding challenge.
            </p>
            <div className="flex gap-4 justify-center">
              Made with ❤️ by Anshu Kumar
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
