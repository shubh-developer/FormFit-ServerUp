import Pamphlet from "@/components/Pamphlet";

export default function PamphletPage() {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Pamphlet Preview (A4)</h1>
        <p className="text-sm opacity-80">Use the browser print dialog to print or save as PDF (A4, no margins).</p>
        <Pamphlet
          name="RAVINDRA"
          title="Certified Physiotherapist & Sports Massage Specialist"
          phone="+91 XXXXX XXXXX"
          whatsapp="+91 XXXXX XXXXX"
          email="yourmail@email.com"
          website="formafit.in"
          address="Pune, Maharashtra (Home Service Available)"
          logoUrl="/images/logo.png"
          services={[
            "Sports Massage",
            "Gym Massage",
            "Physiotherapy Sessions",
            "Relaxation Therapy",
            "Pain Relief & Mobility",
            "Deep Tissue Massage",
          ]}
          featured={[
            { title: "Sports Massage", imageUrl: "/images/sport.svg", subtitle: "Performance & Recovery" },
            { title: "Relaxation (Tension Free)", imageUrl: "/images/relax.svg", subtitle: "Stress Relief & Sleep" },
            { title: "Gym Massage", imageUrl: "/images/gym.svg", subtitle: "Post-Workout Recovery" },
          ]}
          oils={["Ayurvedic Herbal Oil", "Coconut Oil", "Olive Oil", "Almond Oil", "Pain Relief Blend"]}
          comboPackages={[
            "Physio + Sports Massage",
            "Gym Massage + Recovery",
            "Pain Relief + Mobility",
            "Deep Tissue + Stretching",
          ]}
          yearlyPackages={[
            "12 Sessions / Year",
            "24 Sessions / Year",
            "36 Sessions / Year",
            "Custom Annual Plan",
          ]}
          gallery={[
            { title: "Therapy Session", imageUrl: "/images/therapy1.svg" },
            { title: "Muscle Recovery", imageUrl: "/images/therapy2.svg" },
            { title: "Physio Care", imageUrl: "/images/therapy3.svg" },
          ]}
        />
      </div>
    </div>
  );
}


