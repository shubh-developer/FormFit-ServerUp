import VisitingCard from "@/components/VisitingCard";

export const dynamic = "force-static";

export default function VisitingCardDemoPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="space-y-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-center">Visiting Card Demo</h1>
        <p className="text-center text-sm opacity-80 max-w-3xl mx-auto">
          Attractive, trustworthy design with ratings, verified badge, years of experience and certifications. Perfect for building client confidence.
        </p>

        {/* Ravindra — Front */}
        <div className="flex flex-wrap gap-6 items-center justify-center">
          <VisitingCard
            side="front"
            name="RAVINDRA"
            title="Certified Physiotherapist & Sports Massage Specialist"
            company="FormaFit — Home Service"
            tagline="Certified Therapist You Can Trust"
            healthNote="Recover faster and stay active with science-backed therapy and sports massage."
            email="yourmail@email.com"
            phone="+91 XXXXX XXXXX"
            whatsapp="+91 XXXXX XXXXX"
            website="formafit.in"
            address="Pune, Maharashtra"
            locationLabel="Pune (Home Service)"
            theme="brand"
            rating={4.9}
            reviewsCount={186}
            yearsExperience={6}
            certifications={["Certified & Experienced", "Home Service Available", "100+ Clients Served"]}
            logoUrl="/images/logo.png"
          />

          {/* Ravindra — Back */}
          <VisitingCard
            side="back"
            name="RAVINDRA"
            title="Certified Physiotherapist & Sports Massage Specialist"
            services={[
              "Sports Massage",
              "Gym Massage",
              "Physiotherapy Sessions",
              "Relaxation Therapy",
              "Monthly Packages",
            ]}
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
            email={undefined}
            address="Pune, Maharashtra"
            locationLabel="Pune (Home Service)"
            theme="light"
            logoUrl="/images/logo.png"
          />
        </div>
      </div>
    </div>
  );
}


