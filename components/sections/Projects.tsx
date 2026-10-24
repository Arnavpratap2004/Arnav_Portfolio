"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { m, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ParticleNebula } from "@/components/ui/ParticleNebula";
import { NarrativeProjectCard } from "@/components/ui/NarrativeProjectCard";
import { VortexPanel } from "@/components/ui/VortexPanel";

type Project = {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    techStack: string[];
    highlight: string;
    badge?: string;
    projectLink: string;
};

/**
 * A whirlpool around a VERTICAL axis: cards enter low, orbit the axis while they climb, and
 * leave over the top. The axis is upright, so the orbit is horizontal — x and z are the circle,
 * y is the climb, and z is what earns the perspective scale that sells the swirl as 3D.
 *
 * Each card has one cycle coordinate `p`, wrapped into [0, 1):
 *   p -> 1   bottom of the column, just entering
 *   p ~ 0.5  mid-climb
 *   p -> 0   over the top, leaving
 * Scrolling decreases p, so every card rises. Cards are spaced evenly in p, which keeps the
 * column populated at every scroll position instead of draining out at one end.
 */
type VortexConfig = {
    // The orbit is an ELLIPSE, not a circle: wide in x, shallower in z. A circle ties the two
    // together, and the radius needed to throw neighbours off the left/right edges then also
    // drives translateZ so far forward that the near card doubles in size (measured 1283px on a
    // 1440 viewport). Splitting the axes buys the wide sweep without the runaway scale.
    // driftX must be the LARGER of the two lateral terms. The orbit swings a card +/-xRadius
    // every revolution, so when xRadius dominates each card just oscillates left-right and the
    // diagonal is unreadable while scrolling — the direction is there in the maths but invisible
    // on screen. With drift dominant the card tracks a clear bottom-right to top-left line and the
    // orbit becomes a swirl around that line rather than the main motion.
    driftX: number;      // lateral travel of the AXIS itself, bottom-right to top-left
    xRadius: number;     // lateral half-width of the orbit
    // zRadius, riseVh and spin are jointly constrained by a 3D intersection problem, so they
    // move together. A card is a tilted plane, and a fully revolving one sweeps half its own width
    // through Z. When two cards overlap on screen AND sit
    // at similar depth, those reaches meet and the browser renders the seam where the planes cross
    // — one card visibly slicing through the other rather than sitting in front of it.
    //
    // Neighbouring cards are the risk: they are closest vertically, and at one point in every
    // revolution their depths coincide exactly. Raising riseVh separates them vertically so they
    // overlap less when that happens, raising zRadius spreads the depths further apart, and
    // lowering facing shortens each plane's reach into Z. At 1.9 / 300 / 50 all three were too
    // tight at once and cards intersected.
    zRadius: number;     // depth half-width; this alone sets the near/far scale contrast
    riseVh: number;      // total vertical travel, in multiples of viewport height
    // Pushes the whole helix down to reserve a clear band at the top for the heading. The heading
    // cannot solve this by moving up instead: the floating nav sits at roughly y=32..88 on both
    // breakpoints, so top-24 is already the highest offset that clears it, and going higher trades
    // a collision with the cards for a collision with the nav. Moving the vortex is the axis that
    // is actually free.
    // Centres the column in the band BELOW the heading rather than in the whole viewport: the
    // heading occupies the top ~96px (desktop) / ~70px (mobile), so the usable band's midpoint sits
    // half that distance lower than the viewport midpoint.
    //
    // These two numbers were measured, not guessed: sampling 14 scroll positions and taking the
    // mean offset of the focus-plane card from the band midpoint. Sampling only three or four
    // positions is useless here — Lenis easing means the scroll lands near, not on, a focus point,
    // and the readings swung between -233 and +110 depending purely on where it stopped.
    //
    // NOTE this value is in 3D space, so perspective multiplies it before it reaches the screen.
    // The hero sits at the near point where the factor is largest (1.4x desktop, 1.22x mobile), so
    // the offset is the wanted on-screen shift DIVIDED by that factor — not the shift itself.
    yOffset: number;     // px the whole column is shifted down, pre-perspective
    // turns is bound to spin. Once a card revolves fully (spin = 1) it is edge-on for part of every
    // revolution, so the revolution rate decides how much of the time it is readable. At 2.2 turns
    // with full spin, measured card widths collapsed to 71-162px against a 420px base — cards spent
    // most of the scroll as slivers and the section read as flicker rather than rotation. One turn
    // per pass is what makes a full spin legible: each card faces the viewer once, goes edge-on at
    // the sides, and shows its back briefly at the far side of the orbit.
    turns: number;       // full revolutions completed during one bottom-to-top pass
    perspective: number; // parent perspective; front/back scale falls out of this
    // 0.8, not 1. rotateY sweeps (360p - 180) * spin across a pass, so full spin puts a card exactly
    // edge-on at p = 0.25 and 0.75 — the middle of the visible range, where it renders as a 23-99px
    // bright sliver. At 0.8 the edge-on angle moves out to p = 0.19 and 0.81, which sit inside the
    // entry and exit fades, so a card is already nearly transparent by the time it turns side-on.
    spin: number;        // 0..1 share of a FULL radial turn; 1 = card revolves once per orbit
    roll: number;        // max deg of z-roll, the cue that reads as "swirl" rather than "slide"
    cardScale: number;   // base size multiplier at the orbit's neutral depth
    thickness: number;   // px of slab depth, so a card turning side-on shows an edge not nothing
};

// The orbit is phased so its NEAR point lands at p = 0.5 — the midpoint of the climb, i.e. vertical
// centre — which is what makes the composition resolve on a big, centred, square-on hero card.
//
// This MUST be derived from turns rather than hard-coded. It used to be a flat -PI/2, which only
// centres the hero when turns is exactly 1; at any other rate the hero drifts off-centre (at
// turns = 1 with the wrong phase it peaked 427px above centre, half off the top of the screen).
// Solving theta(0.5) = PI/2 gives this. With it, the hero is centred, nearest AND square-on at
// any number of turns, so the revolution rate is free to change without breaking the composition.
const phaseFor = (turns: number) => Math.PI / 2 + turns * Math.PI;

// Sized against the reference composition: a hero card about half the viewport wide, with its
// neighbours large enough to run off the edges rather than tile neatly inside the frame. The
// billboard factor is high, but radial facing is 0 at the near point by construction, so the hero
// is square-on and readable and only the decorative off-centre cards take the steep angle.
const DESKTOP_VORTEX: VortexConfig = {
    driftX: 360, xRadius: 320, zRadius: 500, riseVh: 1.6, turns: 1, yOffset: 58,
    perspective: 1400, spin: 0.8, roll: 2, cardScale: 1, thickness: 16,
};

// A phone is narrow, so the orbit has to be tight or cards get sliced by the side edges (at a
// wider radius they screenshotted as half-titles with cropped chips, which reads as a layout bug
// rather than as depth). Depth and climb carry the effect instead of lateral swing.
const MOBILE_VORTEX: VortexConfig = {
    driftX: 92, xRadius: 105, zRadius: 175, riseVh: 1.4, turns: 1, yOffset: 43,
    perspective: 900, spin: 0.8, roll: 2, cardScale: 1, thickness: 10,
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Hermite smoothstep, used for the entry/exit fades so cards never pop at the wrap seam.
const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
};

const TWO_PI = Math.PI * 2;

// Spin-up. Six cards spaced evenly around the cycle means something is ALWAYS in the upper half of
// the frame — that is a property of an evenly-populated loop, not of the fade tuning, so no fade
// band can clear the opening shot. Instead the cards start bunched at and below centre and fan out
// to even spacing over the first stretch of the section: the section opens on the first project
// alone at centre with clear space above it for the heading, and the vortex builds as you scroll.
const SPINUP_END = 0.2;   // fraction of the section over which spacing reaches even
// Capped just above 0.6: cards start at p = 0.5 + (i/total)*MIN_SPREAD, so the last card sits at
// 0.5 + 5*MIN_SPREAD/6 and anything past 1.0 wraps back above the heading — which is what the
// bunching exists to prevent. Raised from 0.5 because at that value the opening pair were only
// 0.083 apart in cycle (~175px) against a card ~262px tall, and visibly stacked on each other.
const MIN_SPREAD = 0.62;  // spacing at the very start, as a share of even spacing

// Where in the cycle a card fades in (bottom) and out (top). Both bands sit at the extremes of
// p, which is where a card is furthest off-screen vertically — so the jump from top back to
// bottom always happens while the card is fully transparent.
const FADE_IN_LO = 0.80;
const FADE_IN_HI = 0.97;
const FADE_OUT_LO = 0.03;
const FADE_OUT_HI = 0.20;

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(
        () => typeof window !== "undefined" && window.matchMedia(query).matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);

        handleChange();
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [query]);

    return matches;
}

type VortexCardProps = {
    project: Project;
    index: number;
    total: number;
    progress: MotionValue<number>;
    config: VortexConfig;
    viewportH: number;
};

export const VortexCard = React.memo(function VortexCard({
    project, index, total, progress, config, viewportH,
}: VortexCardProps) {
    const { driftX, xRadius, zRadius, riseVh, turns, spin, roll, cardScale, yOffset, thickness } = config;
    const rise = viewportH * riseVh;

    // Cycle coordinate. Everything below is a pure function of it, so the whole card is driven by
    // motion values with no React re-render per frame.
    const p = useTransform(progress, (s: number) => {
        // Spacing ramps from MIN_SPREAD to fully even. The 0.5 base puts card 0 exactly at the
        // near point at s = 0, so the section opens on the first project as a centred hero with
        // every other card below it rather than mid-cycle with two cards over the heading.
        const spread = MIN_SPREAD + (1 - MIN_SPREAD) * clamp01(s / SPINUP_END);
        const raw = 0.5 + (index / total) * spread - s;
        return ((raw % 1) + 1) % 1;
    });

    // Angle around the upright axis. p decreases as you scroll, so theta unwinds steadily and
    // every card sweeps the same direction — that shared direction is what reads as a whirlpool
    // instead of as cards independently drifting.
    // Note the MINUS: the orbit is traversed in the direction that reinforces the axis drift.
    // With +, the two lateral terms run in anti-phase — as a card climbs, drift carries it
    // right-to-left while the orbit carries it left-to-right, and they cancel to roughly zero.
    // Measured: every card sat within +/-80px of screen centre, a vertical stack with no readable
    // diagonal at all. Reversed, both terms sweep the same way and the diagonal is unmistakable.
    const theta = useTransform(p, (v: number) => phaseFor(turns) - v * turns * TWO_PI);

    // The climb. p = 1 sits below the viewport, p = 0 above it, so a card crosses the full height.
    const y = useTransform(p, (v: number) => (v - 0.5) * rise + yOffset);

    // The axis is SLANTED, not upright: it drifts right-to-left as the card climbs, so the column
    // runs bottom-right to top-left and cards spiral around that diagonal. An upright axis put the
    // whole helix in one vertical stripe down the middle of the screen. The orbit rides on top of
    // the drifting axis, so a card both circles and travels.
    //
    // p = 1 is the bottom of the climb and p = 0 the top, so (pp - 0.5) puts the axis at +driftX
    // (right) on entry and -driftX (left) on exit. Flip the sign of this term to reverse the
    // diagonal.
    const x = useTransform<number, number>(
        [p, theta],
        ([pp, th]) => (pp - 0.5) * 2 * driftX + Math.cos(th) * xRadius
    );
    // Depth around the same circle, a quarter-turn out of phase with x. This is what makes the
    // orbit a real circle in 3D rather than a flat left-right slide, and perspective turns it
    // into the near/far size change on its own — no hand-authored scale ramp.
    const z = useTransform(theta, (th: number) => Math.sin(th) * zRadius);

    // Cards turn to follow the orbit, so they read as panels carried around a column rather than
    // as flat images sliding about. cos(theta) is the card's own lateral offset on the circle, so
    // this is 0 at the near point (hero square-on and readable), positive on the right of the axis
    // and negative on the left — each card angled outward, away from the column.
    //
    // Deliberately periodic rather than the exact radial form (90deg - theta). Exact radial grows
    // without bound as a card revolves, so at more than one turn it has to be clamped, and the
    // clamp then pins every card at the ceiling for most of each revolution — the turning stops
    // reading as turning. cos is bounded by construction, needs no clamp, and cannot wrap into the
    // discontinuous flip that exact radial hits when a card passes the far side of the orbit.
    const rotateY = useTransform(theta, (th: number) => (90 - th * (180 / Math.PI)) * spin);
    const rotateZ = useTransform(theta, (th: number) => Math.cos(th) * roll);

    const opacity = useTransform(p, (v: number) => {
        const entering = 1 - smoothstep(FADE_IN_LO, FADE_IN_HI, v);
        const leaving = smoothstep(FADE_OUT_LO, FADE_OUT_HI, v);
        return entering * leaving;
    });

    // PERF: opacity 0 still composites and paints. Flipping visibility drops cards that are
    // mid-recycle out of paint entirely.
    const visibility = useTransform(opacity, (o: number) => (o < 0.015 ? "hidden" : "visible"));
    // Only a card near the front of the orbit takes pointer input, so the ones swinging round the
    // back cannot swallow clicks meant for the card the viewer is actually looking at.
    const pointerEvents = useTransform(z, (v: number) => (v > zRadius * 0.35 ? "auto" : "none"));

    return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            {/* Widths are sized so the card is still inside the viewport at the NEAR point of
                the orbit, where perspective scales it up. That factor is set by zRadius against
                perspective, so it moves whenever depth separation is retuned: raising zRadius to
                165 took the phone factor to 1.22x and a 320px base re-clipped the hero at 382px on
                a 390px screen. Re-check this whenever zRadius changes. Neighbours are meant to
                bleed off the edges; the hero is not. */}
            <m.div
                layout={false}
                className="w-[68vw] max-w-[260px] md:w-[420px] md:max-w-none"
                style={{
                    x, y, z, rotateY, rotateZ, opacity, visibility, pointerEvents,
                    scale: cardScale,
                    // Without preserve-3d here the slab's side faces are composited into this
                    // element's own plane and the card renders as a flat image with no edge.
                    // Caveat: opacity below 1 forces transform-style back to flat, so the thickness
                    // shows across the fully-opaque band (p 0.20..0.80) and collapses during the
                    // entry and exit fades -- which is exactly where the card is near-transparent.
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                }}
            >
                <VortexPanel {...project} priority={index === 0} thickness={thickness} />
            </m.div>
        </div>
    );
});
// PERF: Module-level constant — 6 project objects not re-allocated on every render.
const projects: Project[] = [
    {
        title: "CAD-RAG Framework",
        description:
            "Research project at IIT Patna addressing the challenge of detecting hate speech in evolving online discourse. Proposed a novel Context-Aware Dynamic Rationale Generation (CAD-RAG) framework combining retrieval-augmented generation with socio-temporal context. Built a dynamic knowledge base integrating evolving slur lexicons and incident reports, with a multi-query retrieval mechanism for detecting emerging 'zero-day' hate speech patterns.",
        imageSrc: "/cad-rag-framework.webp",
        imageAlt: "CAD-RAG Framework — IIT Patna Research",
        techStack: ["Python", "NLP", "RAG", "PyTorch", "Research"],
        highlight: "IIT Research",
        badge: "IIT Patna • IEEE Paper",
        projectLink: "https://github.com/Arnavpratap2004/HateSpeech_using_CAD-RAG",
    },
    {
        title: "Real-time Auction Platform",
        description:
            "Built and deployed a production-grade real-time auction platform for a college club event. Engineered WebSocket-based live bidding with instant notifications, handling 200+ concurrent users with zero downtime. Features include real-time bid updates, countdown timers, user authentication, bid history tracking, and admin dashboard for item management.",
        imageSrc: "/auction-platform.webp",
        imageAlt: "Real-time Auction Platform",
        techStack: ["React", "WebSocket", "Node.js", "MongoDB", "Express"],
        highlight: "200+ Concurrent Users",
        projectLink: "https://github.com/Arnavpratap2004/Auction-Platform",
    },
    {
        title: "Mess Feedback System",
        description:
            "Designed and built a comprehensive feedback platform for hostel dining services, now used by 500+ students daily. Implemented dynamic reporting with real-time analytics dashboards showing meal-wise satisfaction trends, complaint categorization, and targeted insights that helped improve dining quality scores by 30%.",
        imageSrc: "/mess-feedback.webp",
        imageAlt: "Mess Feedback System",
        techStack: ["HTML", "CSS", "JavaScript", "Analytics"],
        highlight: "500+ Daily Users",
        projectLink: "https://github.com/Arnavpratap2004/Mess_Feedback_System",
    },
    {
        title: "Smart Study Material Organizer",
        description:
            "Engineered an AI-driven document intelligence pipeline using AWS cloud services. Automated text extraction via Textract, intelligent document categorization with Comprehend, and semantic indexing through Lambda functions — achieving 95% classification accuracy. Enables lightning-fast retrieval of study materials across thousands of uploaded documents.",
        imageSrc: "/smart-study-organizer.webp",
        imageAlt: "Smart Study Material Organizer",
        techStack: ["AWS", "Textract", "Comprehend", "Lambda", "Python"],
        highlight: "95% Accuracy",
        badge: "AWS AI Pipeline",
        projectLink: "https://github.com/Arnavpratap2004/Study-Mate",
    },
    {
        title: "StockSense — Inventory Management",
        description:
            "Full-stack inventory management system with a premium 'Dark Industrial Precision' UI. Features real-time stock tracking, automated transaction logging, role-based access control, comprehensive reporting dashboards, and audit trail functionality. Built with a data-dense dark aesthetic optimized for warehouse operations.",
        imageSrc: "/stocksense.webp",
        imageAlt: "StockSense Inventory Management System",
        techStack: ["Next.js", "Tailwind CSS", "PostgreSQL", "Prisma"],
        highlight: "Full-Stack App",
        projectLink: "https://github.com/Arnavpratap2004/StockSense",
    },
    {
        title: "Homelia — E-Commerce Platform",
        description:
            "Modern e-commerce platform for home decor and furnishings with complete shopping experience. Implemented user authentication with role-based access, shopping cart management, product search and filtering, order processing, and responsive mobile-first design. Comprehensive E2E test suite covering all critical user journeys.",
        imageSrc: "/homelia.webp",
        imageAlt: "Homelia E-Commerce Platform",
        techStack: ["React", "Prisma", "Node.js", "Tailwind CSS"],
        highlight: "Full E2E Tested",
        projectLink: "https://github.com/Arnavpratap2004/Homelia",
    },
];

export function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobileLayout = useMediaQuery("(max-width: 767px)");
    // Touch devices get the readable stacked archive instead of a pinned 3D stage. A phone has no
    // hover state for the extra project details, and the 400vh vortex turns six useful cards into
    // a long gesture-only sequence. Desktop keeps the cinematic orbit; mobile gets the complete
    // project information, larger tap targets, and a much shorter scroll path.
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    const config = useMemo(
        () => (isMobileLayout ? MOBILE_VORTEX : DESKTOP_VORTEX),
        [isMobileLayout]
    );

    // The climb is expressed in viewport heights, so it needs a real pixel height to resolve
    // against. Measured once here and passed down rather than read per card — six resize
    // listeners for one shared number is six times the work for the same answer.
    const [viewportH, setViewportH] = useState(900);
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const measure = () => setViewportH(window.innerHeight);
        const onResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(measure, 150);
        };
        measure();
        window.addEventListener("resize", onResize, { passive: true });
        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(timeout);
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // PERF: scrollYProgress updates on every scroll frame anywhere on the page, not just while
    // this section is on screen. Bound straight to the cards it meant that scrolling through
    // About re-wrote all six cards' transforms every frame for content nobody could see. This
    // mirror only tracks while the section is near the viewport, so off-screen the cards go quiet.
    const gatedProgress = useMotionValue(0);
    const isNearRef = useRef(false);

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        if (isNearRef.current) gatedProgress.set(value);
    });

    useEffect(() => {
        const element = containerRef.current;
        // NOTE: the gate now runs on phones too. It used to bail out on mobile because the mobile
        // branch was a static list with nothing to drive; the phone runs the vortex now, so it
        // needs the gate more than desktop does, not less.
        if (!element || isMobileLayout || prefersReducedMotion) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isNearRef.current = entry.isIntersecting;
                // Resync on entry so the vortex never animates in from a stale position.
                if (entry.isIntersecting) gatedProgress.set(scrollYProgress.get());
            },
            { rootMargin: "600px 0px" }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [gatedProgress, scrollYProgress, isMobileLayout, prefersReducedMotion]);

    if (isMobileLayout || prefersReducedMotion) {
        return (
            <section ref={containerRef} className="w-full relative bg-[#06090F] min-h-screen py-20 sm:py-28 overflow-hidden">
                <div className="relative z-10 text-center w-full px-4 mb-10 pointer-events-none">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
                        Selected <span className="text-gradient-display">Projects</span>
                    </h2>
                    <p className="text-neutral-400 max-w-lg mx-auto text-sm">
                        Things I&apos;ve designed, built and shipped
                    </p>
                </div>
                <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-6">
                    {projects.map((project, index) => (
                        <NarrativeProjectCard key={index} {...project} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        // 400vh is load-bearing: it must stay in step with `minHeight` on the Projects
        // DeferredSection in app/page.tsx and with `.lazy-section-projects`'s
        // contain-intrinsic-size in globals.css, or scroll geometry gets revised late.
        <section ref={containerRef} className="w-full relative bg-[#06090F] h-[400vh]">
            <div className="sticky [position:-webkit-sticky] top-0 h-[100svh] md:h-screen w-full overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <ParticleNebula />
                </div>

                {/* The 3D stage. `preserve-3d` is what makes the browser depth-sort the cards by
                    their real Z as they orbit, which is why no card here sets a z-index. The
                    previous orbital build drove z-index from a motion value and the constant
                    re-sorting showed up in traces as a long Layerize; sorting in 3D costs nothing
                    per frame, and it stays correct through the whole revolution for free. */}
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{ perspective: `${config.perspective}px`, transformStyle: "preserve-3d", zIndex: 1 }}
                >
                    {projects.map((project, index) => (
                        <VortexCard
                            key={index}
                            project={project}
                            index={index}
                            total={projects.length}
                            progress={gatedProgress}
                            config={config}
                            viewportH={viewportH}
                        />
                    ))}
                </div>

                {/* top-8 / md:top-12 — the height this section shipped with, and the right one.
                    An earlier pass pushed this down to top-24 to avoid the floating nav, but that
                    collision does not actually occur: FloatingNavbar only reveals on UPWARD scroll
                    (its visibility is gated on `direction < 0`), so it is hidden the whole time you
                    are scrolling down through this section. Guarding against it cost real layout
                    space for nothing.

                    Panels climbing past the heading are handled by the scrim instead of by
                    position: a soft elliptical plate of page background that keeps the text
                    readable when a bright card passes behind, without drawing a visible box. */}
                <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 text-center w-full px-4 pointer-events-none" style={{ zIndex: 110 }}>
                    <h2 className="relative text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.95)]">
                        <span className="absolute left-1/2 top-1/2 -z-10 h-[240%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#06090F]/85 blur-2xl" aria-hidden="true" />
                        Selected <span className="text-gradient-display">Projects</span>
                    </h2>
                </div>
            </div>
        </section>
    );
}
