import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing-layout";
import { ArgosMark } from "@/components/argos-logo";
import hoodie from "@/assets/merch-hoodie.jpg";
import tee from "@/assets/merch-tee.jpg";
import tote from "@/assets/merch-tote.jpg";
import stickers from "@/assets/merch-stickers.jpg";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — ARGOS" },
      {
        name: "description",
        content:
          "The ARGOS aperture mark in the wild — hoodies, tees, totes, and stickers for the team, the demo day, and everyone who shipped.",
      },
      { property: "og:title", content: "Merch — ARGOS" },
      {
        property: "og:description",
        content: "Wear the many-eyed watcher. Demo-day capsule.",
      },
    ],
  }),
  component: MerchPage,
});

const items = [
  { img: hoodie, name: "Aperture Hoodie", desc: "Heavyweight black cotton, amber embroidery." },
  { img: tee, name: "Mark Tee", desc: "Cream heavy tee, chest hit print." },
  { img: tote, name: "ARGOS Tote", desc: "Natural canvas, black screen-print." },
  { img: stickers, name: "Sticker Pack", desc: "Six vinyl die-cuts. Laptop-grade adhesive." },
];

function MerchPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <ArgosMark size={32} className="text-primary" />
            <div className="text-xs tracking-wider text-muted-foreground uppercase">
              Demo-day capsule
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-medium tracking-tight text-foreground md:text-6xl">
            The many-eyed watcher,
            <br />
            on your chest.
          </h1>
          <p className="mt-6 text-muted-foreground">
            The ARGOS mark is a hexagonal aperture around a central pupil — one shape, stroke
            only, that prints clean on cotton, embroiders on fleece, and cuts to vinyl. Preview
            below.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {items.map((it) => (
            <figure
              key={it.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={it.img}
                  alt={it.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex items-center justify-between p-6">
                <div>
                  <div className="text-lg font-medium text-foreground">{it.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  Preview
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Store opens after Demo Day · July 4, 2026 · Imperial College London
        </div>
      </div>
    </MarketingLayout>
  );
}
