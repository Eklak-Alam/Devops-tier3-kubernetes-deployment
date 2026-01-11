import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      {/* Add your deployment dashboard section here later */}
      <Footer />
    </main>
  );
}