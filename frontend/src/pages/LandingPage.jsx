import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Car, Scan, Radio, ImageIcon, Building2, BellRing, ArrowRight, X,
    Mail, Lock, User, ChevronRight, Gauge, MapPin, CheckCircle2,
} from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const COLORS = {
    asphalt: "#000000",
    asphalt2: "#0a0805",
    asphalt3: "#14110a",
    line: "#2a2211",
    chrome: "#c4bcae",
    paper: "#F4F2ED",
    amber: "#d4af37", // Gold
    amberDim: "#6b581b",
    green: "#4ADE80",
    red: "#F16565",
};

const VEHICLES = [
    { stock: "A2291", vin: "1FTFW1E5XNFB29910", year: 2024, make: "Ford", model: "F-150 Lariat", price: 52480, days: 4, status: "available" },
    { stock: "A2277", vin: "5YJ3E1EA9PF391882", year: 2024, make: "Tesla", model: "Model 3 Long Range", price: 44990, days: 11, status: "pending" },
    { stock: "A2265", vin: "1HGCV1F31NA019442", year: 2023, make: "Honda", model: "Accord Sport", price: 27995, days: 2, status: "available" },
    { stock: "A2201", vin: "3GNAXUEV5NL105521", year: 2023, make: "Chevrolet", model: "Equinox RS", price: 31240, days: 28, status: "available" },
    { stock: "A2158", vin: "WBA5R7C50ND012113", year: 2022, make: "BMW", model: "330i xDrive", price: 38750, days: 6, status: "sold" },
    { stock: "A2299", vin: "JTMB6RFV0PD112837", year: 2024, make: "Toyota", model: "RAV4 XLE", price: 33110, days: 1, status: "available" },
];

const FEATURES = [
    { icon: Scan, title: "VIN decode on intake", body: "Scan or type a VIN and every spec, trim, and option package fills itself in. No re-keying window sticker data." },
    { icon: Radio, title: "Real-time status sync", body: "A vehicle marked sold on the lot updates your website, your DMS, and every teammate's screen in the same second." },
    { icon: ImageIcon, title: "Photo & media sets", body: "Attach a full photo walk-around and window sticker to each stock number once. It follows the car everywhere it's listed." },
    { icon: Building2, title: "Multi-lot visibility", body: "Running three lots or thirty, see aging inventory, transfers, and reconditioning status from a single board." },
    { icon: Gauge, title: "Days-on-lot alerts", body: "Set aging thresholds by segment. Get flagged before a unit becomes a write-down instead of after." },
    { icon: BellRing, title: "Team notifications", body: "Sales, recon, and finance get pinged only for what's theirs to act on — no shared inbox, no missed handoffs." },
];

const STEPS = [
    { n: "01", title: "Bring your stock in", body: "Import your current inventory or add units one VIN at a time. Photos, cost, and recon notes attach on the way in." },
    { n: "02", title: "Track it while it moves", body: "Every reconditioning step, price change, and lot transfer is logged automatically as it happens, not typed in later." },
    { n: "03", title: "Close it out clean", body: "Mark a sale and the unit, its listing, and its reporting all close together. Nothing lingers as a ghost line item." },
];

function useCounter(target, inView, duration = 1400) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!inView) return;
        let start = null;
        let raf;
        const tick = (t) => {
            if (start === null) start = t;
            const progress = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target, duration]);
    return value;
}

function Stat({ value, suffix = "", label, decimals = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const count = useCounter(value, inView);
    const display = decimals ? (count / Math.pow(10, decimals)).toFixed(decimals) : count.toLocaleString();
    return (
        <div ref={ref} className="lw-stat">
            <div className="lw-stat-value">{display}{suffix}</div>
            <div className="lw-stat-label">{label}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        available: { color: COLORS.green, label: "Available" },
        pending: { color: COLORS.amber, label: "Pending" },
        sold: { color: COLORS.chrome, label: "Sold" },
    };
    const s = map[status];
    return (
        <span className="lw-badge" style={{ borderColor: s.color + "55", color: s.color }}>
            <motion.span
                className="lw-badge-dot"
                style={{ background: s.color }}
                animate={status !== "sold" ? { opacity: [1, 0.35, 1] } : {}}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {s.label}
        </span>
    );
}

function VehicleSticker({ v, index }) {
    return (
        <motion.div
            className="lw-sticker"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
        >
            <div className="lw-sticker-top">
                <span className="lw-mono lw-stock">STK {v.stock}</span>
                <StatusBadge status={v.status} />
            </div>
            <div className="lw-sticker-title">{v.year} {v.make} {v.model}</div>
            <div className="lw-mono lw-vin">VIN {v.vin}</div>
            <div className="lw-sticker-bottom">
                <span className="lw-price">${v.price.toLocaleString()}</span>
                <span className="lw-days">{v.days} day{v.days === 1 ? "" : "s"} on lot</span>
            </div>
        </motion.div>
    );
}

function FloatingCard({ v, style, delay }) {
    return (
        <motion.div
            className="lw-floating-card"
            style={style}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
                opacity: { duration: 0.8, delay },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
            }}
        >
            <div className="lw-floating-top">
                <span className="lw-mono">{v.stock}</span>
                <span className="lw-floating-dot" style={{ background: v.status === "available" ? COLORS.green : COLORS.amber }} />
            </div>
            <div className="lw-floating-title">{v.year} {v.make}</div>
            <div className="lw-floating-model">{v.model}</div>
            <div className="lw-mono lw-floating-price">${v.price.toLocaleString()}</div>
        </motion.div>
    );
}

function Hero({ onGetStarted }) {
    const ref = useRef(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const spotX = useTransform(mx, [0, 1], ["20%", "80%"]);
    const spotY = useTransform(my, [0, 1], ["10%", "60%"]);

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
    };

    return (
        <section ref={ref} className="lw-hero" onMouseMove={handleMove}>
            <div className="lw-hero-grid" />
            <motion.div
                className="lw-hero-spot"
                style={{ left: spotX, top: spotY }}
            />
            <div className="lw-hero-inner">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lw-eyebrow"
                >
                    <span className="lw-eyebrow-dot" />
                    Built for dealership inventory teams
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lw-h1"
                >
                    Every vehicle,<br />tracked to the VIN.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="lw-hero-sub"
                >
                    Lotwise is the inventory system dealerships run their lot on — from intake scan
                    to final sale, across as many locations as you've got.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="lw-hero-cta"
                >
                    <button className="lw-btn-primary" onClick={() => onGetStarted("signup")}>
                        Start free trial <ArrowRight size={17} strokeWidth={2.5} />
                    </button>
                    <button className="lw-btn-ghost" onClick={() => onGetStarted("login")}>
                        Log in
                    </button>
                </motion.div>
            </div>

            <FloatingCard v={VEHICLES[0]} delay={0.5} style={{ top: "14%", right: "8%" }} />
            <FloatingCard v={VEHICLES[2]} delay={0.9} style={{ top: "52%", right: "20%" }} />
            <FloatingCard v={VEHICLES[5]} delay={1.2} style={{ top: "34%", right: "34%" }} />
        </section>
    );
}

// Removed internal Modal component

export default function LandingPage() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="lw-root">
            <style>{FONTS}</style>
            <style>{CSS}</style>

            <header className={`lw-nav ${scrolled ? "lw-nav-scrolled" : ""}`}>
                <div className="lw-nav-inner">
                    <div className="lw-logo">
                        <span className="lw-logo-mark"><Car size={17} strokeWidth={2.5} /></span>
                        Lotwise
                    </div>
                    <nav className="lw-nav-links">
                        <a href="#features">Features</a>
                        <a href="#how">How it works</a>
                        <a href="#inventory">Live board</a>
                    </nav>
                    <div className="lw-nav-actions">
                        <button className="lw-btn-ghost lw-btn-small" onClick={() => navigate("/login")}>Log in</button>
                        <button className="lw-btn-primary lw-btn-small" onClick={() => navigate("/register")}>Sign up</button>
                    </div>
                </div>
            </header>

            <Hero onGetStarted={(type) => navigate(type === 'login' ? '/login' : '/register')} />

            <section className="lw-stats-bar">
                <Stat value={214000} suffix="+" label="Vehicles tracked" />
                <Stat value={41} suffix="%" label="Avg. faster time-to-list" />
                <Stat value={860} suffix="+" label="Dealerships on Lotwise" />
                <Stat value={998} decimals={1} suffix="%" label="Uptime last 12 months" />
            </section>

            <section id="features" className="lw-section">
                <div className="lw-section-head">
                    <span className="lw-kicker">The board</span>
                    <h2 className="lw-h2">One system, from intake to sold</h2>
                    <p className="lw-section-sub">
                        Everything a dealership's inventory touches — scanning, photos, pricing, transfers,
                        reporting — lives on the same stock number.
                    </p>
                </div>
                <div className="lw-features-grid">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            className="lw-feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                        >
                            <div className="lw-feature-icon"><f.icon size={19} strokeWidth={2} /></div>
                            <h3>{f.title}</h3>
                            <p>{f.body}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section id="how" className="lw-section lw-how">
                <div className="lw-section-head">
                    <span className="lw-kicker">The flow</span>
                    <h2 className="lw-h2">How a unit moves through Lotwise</h2>
                </div>
                <div className="lw-steps">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.n}
                            className="lw-step"
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <span className="lw-step-n">{s.n}</span>
                            <div>
                                <h3>{s.title}</h3>
                                <p>{s.body}</p>
                            </div>
                            {i < STEPS.length - 1 && <span className="lw-step-line" />}
                        </motion.div>
                    ))}
                </div>
            </section>

            <section id="inventory" className="lw-section">
                <div className="lw-section-head">
                    <span className="lw-kicker">Live board</span>
                    <h2 className="lw-h2">What your team sees, in real time</h2>
                    <p className="lw-section-sub">A sample board — every card updates the moment status changes on the lot.</p>
                </div>
                <div className="lw-inventory-grid">
                    {VEHICLES.map((v, i) => <VehicleSticker key={v.stock} v={v} index={i} />)}
                </div>
            </section>

            <section className="lw-quote-section">
                <motion.div
                    className="lw-quote-plate"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <CheckCircle2 size={20} color={COLORS.amber} />
                    <p>
                        "We stopped finding out a car sold from the customer instead of our own system.
                        That alone paid for Lotwise in the first month."
                    </p>
                    <span className="lw-quote-attr">— Inventory Manager, 4-location dealer group</span>
                </motion.div>
            </section>

            <section className="lw-cta-footer">
                <MapPin size={22} color={COLORS.amber} style={{ marginBottom: 14 }} />
                <h2 className="lw-h2">Get your lot on one board</h2>
                <p className="lw-section-sub">Set up takes an afternoon. Most teams import their first stock the same day.</p>
                <button className="lw-btn-primary lw-btn-large" onClick={() => navigate("/register")}>
                    Start free trial <ArrowRight size={18} strokeWidth={2.5} />
                </button>
            </section>

            <footer className="lw-footer">
                <div className="lw-logo lw-footer-logo">
                    <span className="lw-logo-mark"><Car size={16} strokeWidth={2.5} /></span>
                    Lotwise
                </div>
                <span className="lw-footer-copy">Inventory software for dealership lots.</span>
            </footer>

        </div>
    );
}

const CSS = `
* { box-sizing: border-box; }
.lw-root {
  background: linear-gradient(135deg, #110e05 0%, #000000 100%);
  color: ${COLORS.paper};
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}
.lw-mono { font-family: 'IBM Plex Mono', monospace; }

/* NAV */
.lw-nav {
  position: sticky; top: 0; z-index: 40;
  border-bottom: 1px solid transparent;
  transition: all 0.25s ease;
}
.lw-nav-scrolled {
  background: rgba(11,13,16,0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${COLORS.line};
}
.lw-nav-inner {
  max-width: 1160px; margin: 0 auto; padding: 16px 24px;
  display: flex; align-items: center; justify-content: space-between;
}
.lw-logo {
  font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 19px;
  letter-spacing: 0.02em; display: flex; align-items: center; gap: 9px;
}
.lw-logo-mark {
  width: 30px; height: 30px; border-radius: 7px;
  background: ${COLORS.amber}; color: #1a0d02;
  display: flex; align-items: center; justify-content: center;
}
.lw-nav-links { display: flex; gap: 28px; }
.lw-nav-links a {
  color: ${COLORS.chrome}; text-decoration: none; font-size: 14px; font-weight: 500;
  transition: color 0.2s;
}
.lw-nav-links a:hover { color: ${COLORS.paper}; }
.lw-nav-actions { display: flex; gap: 10px; align-items: center; }

/* BUTTONS */
.lw-btn-primary {
  background: ${COLORS.amber}; color: #1a0d02; border: none;
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14.5px;
  padding: 12px 20px; border-radius: 8px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 0 0 0 rgba(255,122,26,0);
}
.lw-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px -8px ${COLORS.amber}aa; }
.lw-btn-large { padding: 15px 26px; font-size: 16px; margin-top: 22px; }
.lw-btn-small { padding: 9px 16px; font-size: 13.5px; }
.lw-btn-ghost {
  background: transparent; color: ${COLORS.paper};
  border: 1px solid ${COLORS.line}; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 14.5px; padding: 12px 20px; border-radius: 8px;
  cursor: pointer; transition: border-color 0.2s, background 0.2s;
}
.lw-btn-ghost:hover { border-color: ${COLORS.chrome}; background: ${COLORS.asphalt2}; }

/* HERO */
.lw-hero {
  position: relative; padding: 108px 24px 160px; overflow: hidden;
  display: flex; justify-content: center;
}
.lw-hero-grid {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(90deg, ${COLORS.line}55 0, ${COLORS.line}55 1px, transparent 1px, transparent 120px),
    repeating-linear-gradient(0deg, ${COLORS.line}33 0, ${COLORS.line}33 1px, transparent 1px, transparent 120px);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%);
}
.lw-hero-spot {
  position: absolute; width: 520px; height: 520px; border-radius: 50%;
  background: radial-gradient(circle, ${COLORS.amber}22 0%, transparent 70%);
  transform: translate(-50%, -50%); pointer-events: none;
}
.lw-hero-inner { position: relative; max-width: 660px; z-index: 2; }
.lw-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: ${COLORS.amber};
  letter-spacing: 0.03em; margin-bottom: 22px;
}
.lw-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: ${COLORS.amber}; }
.lw-h1 {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: 58px; line-height: 1.04; letter-spacing: 0.005em; margin: 0 0 22px;
}
.lw-hero-sub { font-size: 18px; line-height: 1.6; color: ${COLORS.chrome}; max-width: 520px; margin: 0 0 34px; }
.lw-hero-cta { display: flex; gap: 12px; }

.lw-floating-card {
  position: absolute; width: 188px; background: ${COLORS.asphalt2};
  border: 1px solid ${COLORS.line}; border-radius: 12px; padding: 14px;
  box-shadow: 0 20px 40px -18px rgba(0,0,0,0.6);
  display: none;
}
.lw-floating-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px; color: ${COLORS.chrome}; }
.lw-floating-dot { width: 7px; height: 7px; border-radius: 50%; }
.lw-floating-title { font-family: 'Oswald', sans-serif; font-size: 15px; font-weight: 600; }
.lw-floating-model { font-size: 12.5px; color: ${COLORS.chrome}; margin-bottom: 8px; }
.lw-floating-price { font-size: 13px; color: ${COLORS.amber}; }

@media (min-width: 980px) {
  .lw-floating-card { display: block; }
}

/* STATS */
.lw-stats-bar {
  max-width: 1100px; margin: -90px auto 0; position: relative; z-index: 3;
  background: ${COLORS.asphalt2}; border: 1px solid ${COLORS.line}; border-radius: 16px;
  padding: 30px 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
}
@media (min-width: 780px) { .lw-stats-bar { grid-template-columns: repeat(4, 1fr); } }
.lw-stat { text-align: center; }
.lw-stat-value {
  font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 32px; color: ${COLORS.amber};
}
.lw-stat-label { font-size: 12.5px; color: ${COLORS.chrome}; margin-top: 4px; }

/* SECTIONS */
.lw-section { max-width: 1100px; margin: 0 auto; padding: 120px 24px 0; }
.lw-section-head { max-width: 620px; margin-bottom: 52px; }
.lw-kicker { font-size: 12.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${COLORS.amber}; }
.lw-h2 {
  font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase;
  font-size: 34px; margin: 10px 0 14px; line-height: 1.15;
}
.lw-section-sub { color: ${COLORS.chrome}; font-size: 16px; line-height: 1.6; }

.lw-features-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 720px) { .lw-features-grid { grid-template-columns: repeat(3, 1fr); } }
.lw-feature-card {
  background: ${COLORS.asphalt2}; border: 1px solid ${COLORS.line}; border-radius: 14px;
  padding: 24px; transition: border-color 0.2s;
}
.lw-feature-card:hover { border-color: ${COLORS.amber}55; }
.lw-feature-icon {
  width: 38px; height: 38px; border-radius: 9px; background: ${COLORS.asphalt3};
  color: ${COLORS.amber}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
}
.lw-feature-card h3 { font-size: 16.5px; font-weight: 600; margin: 0 0 8px; }
.lw-feature-card p { font-size: 14.5px; color: ${COLORS.chrome}; line-height: 1.6; margin: 0; }

/* STEPS */
.lw-steps { display: flex; flex-direction: column; gap: 0; }
.lw-step {
  display: flex; gap: 22px; align-items: flex-start; padding: 26px 0;
  border-bottom: 1px solid ${COLORS.line}; position: relative;
}
.lw-step:last-child { border-bottom: none; }
.lw-step-n {
  font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: ${COLORS.amber};
  border: 1px solid ${COLORS.amber}55; border-radius: 7px; padding: 5px 9px; flex-shrink: 0;
}
.lw-step h3 { font-size: 18px; font-weight: 600; margin: 0 0 6px; font-family: 'Oswald', sans-serif; }
.lw-step p { color: ${COLORS.chrome}; font-size: 15px; line-height: 1.6; margin: 0; max-width: 520px; }

/* INVENTORY STICKERS */
.lw-inventory-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 720px) { .lw-inventory-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1020px) { .lw-inventory-grid { grid-template-columns: repeat(3, 1fr); } }
.lw-sticker {
  background: ${COLORS.asphalt2}; border: 1px solid ${COLORS.line}; border-radius: 12px;
  padding: 18px; position: relative;
}
.lw-sticker-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.lw-stock { font-size: 12px; color: ${COLORS.chrome}; }
.lw-badge {
  display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600;
  border: 1px solid; border-radius: 20px; padding: 3px 10px;
}
.lw-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
.lw-sticker-title { font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 17px; margin-bottom: 6px; }
.lw-vin { font-size: 11.5px; color: ${COLORS.chrome}; margin-bottom: 16px; }
.lw-sticker-bottom { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed ${COLORS.line}; padding-top: 12px; }
.lw-price { font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: ${COLORS.amber}; font-size: 16px; }
.lw-days { font-size: 12px; color: ${COLORS.chrome}; }

/* QUOTE */
.lw-quote-section { max-width: 780px; margin: 130px auto 0; padding: 0 24px; }
.lw-quote-plate {
  background: ${COLORS.asphalt2}; border: 1px solid ${COLORS.line}; border-radius: 16px;
  padding: 38px; text-align: center;
}
.lw-quote-plate p { font-size: 20px; line-height: 1.55; font-family: 'Oswald', sans-serif; font-weight: 500; margin: 14px 0 14px; }
.lw-quote-attr { font-size: 13px; color: ${COLORS.chrome}; }

/* CTA FOOTER */
.lw-cta-footer { text-align: center; max-width: 620px; margin: 130px auto 0; padding: 0 24px 120px; }

/* FOOTER */
.lw-footer {
  border-top: 1px solid ${COLORS.line}; padding: 26px 24px;
  display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap;
}
.lw-footer-logo { font-size: 15px; }
.lw-footer-copy { font-size: 13px; color: ${COLORS.chrome}; }

/* MODAL */
.lw-modal-backdrop {
  position: fixed; inset: 0; background: rgba(6,7,9,0.7); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;
}
.lw-modal {
  background: ${COLORS.asphalt2}; border: 1px solid ${COLORS.line}; border-radius: 16px;
  padding: 34px; width: 100%; max-width: 380px; position: relative;
}
.lw-modal-close {
  position: absolute; top: 16px; right: 16px; background: none; border: none;
  color: ${COLORS.chrome}; cursor: pointer; padding: 4px;
}
.lw-modal-mark {
  width: 36px; height: 36px; border-radius: 9px; background: ${COLORS.amber}; color: #1a0d02;
  display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
}
.lw-modal-title { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 600; margin: 0 0 6px; }
.lw-modal-sub { font-size: 14px; color: ${COLORS.chrome}; margin: 0 0 22px; line-height: 1.5; }
.lw-field {
  display: flex; align-items: center; gap: 10px; background: ${COLORS.asphalt};
  border: 1px solid ${COLORS.line}; border-radius: 9px; padding: 11px 13px; margin-bottom: 12px;
  color: ${COLORS.chrome};
}
.lw-field input {
  background: none; border: none; outline: none; color: ${COLORS.paper};
  font-family: 'Inter', sans-serif; font-size: 14.5px; width: 100%;
}
.lw-modal-submit { width: 100%; justify-content: center; margin-top: 6px; }
.lw-modal-switch { text-align: center; font-size: 13.5px; color: ${COLORS.chrome}; margin-top: 18px; }
.lw-modal-switch button { background: none; border: none; color: ${COLORS.amber}; font-weight: 600; cursor: pointer; padding: 0; }

@media (max-width: 640px) {
  .lw-h1 { font-size: 40px; }
  .lw-h2 { font-size: 26px; }
  .lw-hero { padding: 90px 20px 130px; }
  .lw-stats-bar { margin-top: -60px; }
}
`;