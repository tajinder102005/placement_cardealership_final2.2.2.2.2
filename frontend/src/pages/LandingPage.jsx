import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Car, Scan, Radio, ImageIcon, Building2, BellRing, ArrowRight, X,
    Mail, Lock, User, ChevronRight, Gauge, MapPin, CheckCircle2,
    Layers, Package, AlertTriangle, DollarSign
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

const CARDS = [
    { id: 1, make: "Ford", model: "F-150 Lariat", year: 2024, vin: "A2291", price: "$52,480", status: "Available", statusColor: COLORS.amber, delay: 0 },
    { id: 2, make: "Tesla", model: "Model 3 LR", year: 2024, vin: "A2277", price: "$44,990", status: "Pending", statusColor: COLORS.chrome, delay: 1.5 },
    { id: 3, make: "Honda", model: "Accord Sport", year: 2023, vin: "A2265", price: "$27,995", status: "Available", statusColor: COLORS.amber, delay: 3 },
    { id: 4, make: "BMW", model: "330i xDrive", year: 2022, vin: "A2158", price: "$38,750", status: "Sold", statusColor: COLORS.chrome, delay: 4.5 },
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

function Stat({ value, label, icon: Icon }) {
    return (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                {Icon && <Icon size={18} />}
            </div>
            <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1, color: COLORS.paper }}>{value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>{label}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        Available: { color: COLORS.green, label: "Available" },
        Pending: { color: COLORS.amber, label: "Pending" },
        Sold: { color: COLORS.chrome, label: "Sold" },
    };
    const s = map[status];
    return (
        <span className="lw-badge" style={{ borderColor: s.color + "55", color: s.color }}>
            <motion.span
                className="lw-badge-dot"
                style={{ background: s.color }}
                animate={status !== "Sold" ? { opacity: [1, 0.35, 1] } : {}}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {s.label}
        </span>
    );
}

function FloatingCard({ v, style, delay }) {
    return (
        <motion.div
            className="lw-floating-card"
            style={{...style, borderColor: COLORS.paper + "33"}}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
                opacity: { duration: 0.8, delay },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
            }}
        >
            <div className="lw-floating-top">
                <span className="lw-mono">{v.vin}</span>
                <span className="lw-floating-dot" style={{ background: v.statusColor }} />
            </div>
            <div className="lw-floating-title">{v.year} {v.make}</div>
            <div className="lw-floating-model">{v.model}</div>
            <div className="lw-mono lw-floating-price">{v.price}</div>
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
                    <span className="lw-hero-badge"><span className="lw-dot" style={{ backgroundColor: COLORS.amber }}></span> Torque Motors Showroom</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lw-h1"
                >
                    Every vehicle <span style={{ color: COLORS.amber }}>on the floor</span>, tracked in real time.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="lw-hero-sub"
                >
                    Torque Motors keeps stock, pricing and sales in sync. Browse the showroom, filter down to the exact spec, and purchase the moment a unit is available.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="lw-hero-cta"
                >
                    <button className="lw-btn-primary" onClick={() => onGetStarted("signup")}>
                        Sign up <ArrowRight size={17} strokeWidth={2.5} />
                    </button>
                    <button className="lw-btn-ghost" onClick={() => onGetStarted("login")}>
                        Log in
                    </button>
                </motion.div>
            </div>

            <FloatingCard v={CARDS[0]} delay={0.5} style={{ top: "14%", right: "8%" }} />
            <FloatingCard v={CARDS[1]} delay={0.9} style={{ top: "60%", right: "10%" }} />
            <FloatingCard v={CARDS[2]} delay={1.2} style={{ top: "20%", left: "8%" }} />
            <FloatingCard v={CARDS[3]} delay={1.5} style={{ top: "65%", left: "5%" }} />
            <FloatingCard v={CARDS[0]} delay={1.8} style={{ top: "70%", right: "42%" }} />
        </section>
    );
}

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
                        AutoDrive
                    </div>
                    <nav className="lw-nav-links">
                        <a href="#features">Features</a>
                        <a href="#how">How it works</a>
                    </nav>
                    <div className="lw-nav-actions">
                        <button className="lw-btn-ghost lw-btn-small" onClick={() => navigate("/login")}>Log in</button>
                        <button className="lw-btn-primary lw-btn-small" onClick={() => navigate("/register")}>Sign up</button>
                    </div>
                </div>
            </header>

            <Hero onGetStarted={(type) => navigate(type === 'login' ? '/login' : '/register')} />

            <section className="lw-stats-bar" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px', color: COLORS.paper }}>Showroom overview</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Welcome to Torque Motors — here's how the lot is looking today.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <Stat value="11" label="Models listed" icon={Layers} />
                    <Stat value="61" label="Units in stock" icon={Package} />
                    <Stat value="0" label="Sold out" icon={AlertTriangle} />
                    <Stat value="$30.53M" label="Floor value" icon={DollarSign} />
                </div>
            </section>

            <div style={{
                position: 'relative',
                backgroundImage: 'url("https://ballerbossez.com/wp-content/uploads/2025/01/5.-luxury-cars-in-china.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)' }} />
                <div style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
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
                                    style={{ backgroundColor: 'rgba(10, 8, 5, 0.6)', backdropFilter: 'blur(10px)' }}
                                >
                                    <div className="lw-feature-icon"><f.icon size={19} strokeWidth={2} /></div>
                                    <h3>{f.title}</h3>
                                    <p>{f.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <div style={{
                position: 'relative',
                backgroundImage: 'url("https://d1pmvr35o5z8zp.cloudfront.net/assets/header_fnl_-1728959733.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)' }} />
                <div style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
                    <section id="how" className="lw-section lw-how">
                        <div className="lw-section-head">
                            <span className="lw-kicker">The flow</span>
                            <h2 className="lw-h2">How a unit moves through Torque Motors</h2>
                        </div>
                        <div className="lw-steps" style={{ backgroundColor: 'rgba(10, 8, 5, 0.5)', backdropFilter: 'blur(12px)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            {STEPS.map((s, i) => (
                                <motion.div
                                    key={s.n}
                                    className="lw-step"
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    style={{ borderBottom: i < STEPS.length - 1 ? '1px solid var(--border-color)' : 'none' }}
                                >
                                    <span className="lw-step-n">{s.n}</span>
                                    <div>
                                        <h3 style={{ color: 'var(--paper)' }}>{s.title}</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
                                    </div>
                                    {i < STEPS.length - 1 && <span className="lw-step-line" />}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <footer className="lw-footer">
                <div className="lw-logo"><Car size={20} color={COLORS.amber} /> Torque Motors</div>
                <span className="lw-footer-copy">Premium dealership software.</span>
            </footer>

        </div>
    );
}

const CSS = `
* { box-sizing: border-box; }
:root { --bg-secondary: ${COLORS.asphalt2}; --border-color: ${COLORS.line}; --accent-color: ${COLORS.amber}; --text-secondary: ${COLORS.chrome}; --text-muted: #888; }
.lw-root {
  background: linear-gradient(135deg, #110e05 0%, #000000 100%);
  color: ${COLORS.paper};
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}
.lw-mono { font-family: 'IBM Plex Mono', monospace; }
.lw-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.lw-hero-badge { background: ${COLORS.asphalt3}; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid ${COLORS.line}; }

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
  background: linear-gradient(135deg, #d4af37 0%, #ffdf73 50%, #b38728 100%);
  color: #000000; border: none;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14.5px;
  padding: 12px 20px; border-radius: 8px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 15px rgba(212,175,55,0.25);
}
.lw-btn-primary:hover { 
  background: linear-gradient(135deg, #ffdf73 0%, #d4af37 50%, #fcd555 100%);
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(212,175,55,0.4); 
}
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
.lw-h1 {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: 58px; line-height: 1.04; letter-spacing: 0.005em; margin: 0 0 22px;
}
.lw-hero-sub { font-size: 18px; line-height: 1.6; color: ${COLORS.chrome}; max-width: 520px; margin: 0 0 34px; }
.lw-hero-cta { display: flex; gap: 12px; }

.lw-floating-card {
  position: absolute; width: 188px; background: ${COLORS.asphalt2};
  border: 1px solid; border-radius: 12px; padding: 14px;
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