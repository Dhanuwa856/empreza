"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Flame,
  Shield,
  Users,
  Calendar,
  MapPin,
  Lock,
  Unlock,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Activity,
  Sparkles,
  CheckCircle2,
  Clock,
  History,
  Image as ImageIcon,
  Info,
  RefreshCw,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import { readSiteState, supabase, writeSiteState } from "../lib/supabase";

const FOOTER_SOCIAL_LINKS = [
  { label: "Facebook", href: "http://www.facebook.com/itum.mrt.ac.lk/", Icon: Facebook },
  { label: "Instagram", href: "http://instagram.com/itum.mrt.ac.lk/", Icon: Instagram },
  { label: "Twitter", href: "http://twitter.com/itumlk", Icon: Twitter },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCeGA6J0404xYDFMFnNkjZDg", Icon: Youtube },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/institute-of-technology-university-of-moratuwa/",
    Icon: Linkedin,
  },
];

export const INITIAL_TEAMS = [
  {
    id: "team-1",
    name: "TITAN VANGUARDS",
    short: "TTV",
    tagline: "Forged in Iron, Crowned in Gold",
    color: "#E7B736",
    logo: "🛡️",
    score: 485,
    wins: 6,
    events: [
      {
        name: "7-A-Side Futsal Championship",
        venue: "Main University Sports Complex",
        time: "09:00 AM - 01:30 PM",
        status: "LIVE",
        rules: [
          "7 players per side on court (maximum 3 rolling substitutes).",
          "Two halves of 10 minutes each with a 3-minute halftime interval.",
          "No offside rule; kick-ins replace throw-ins.",
          "Yellow card results in a 2-minute sin-bin suspension.",
        ],
        coordinator: "Kasun Perera (077-1234567)",
      },
      {
        name: "100m & 4x100m Sprint Relay",
        venue: "University Track & Field Arena",
        time: "02:30 PM - 04:30 PM",
        status: "UPCOMING",
        rules: [
          "Standard World Athletics baton exchange zone rules apply.",
          "Spikes or approved running shoes mandatory on track.",
          "False start leads to immediate team disqualification.",
        ],
        coordinator: "Nimesha Silva (071-9876543)",
      },
    ],
  },
  {
    id: "team-2",
    name: "SOLAR PHOENIX",
    short: "SPX",
    tagline: "Rising Above Every Limit",
    color: "#FF6B00",
    logo: "🦅",
    score: 460,
    wins: 5,
    events: [
      {
        name: "3x3 Street Basketball",
        venue: "Outdoor Hardcourt Arena A",
        time: "10:00 AM - 02:00 PM",
        status: "LIVE",
        rules: [
          "10-minute single period or first team to reach 21 points wins.",
          "12-second shot clock strictly enforced.",
          "1 point inside the arc, 2 points behind the arc.",
        ],
        coordinator: "Dilshan Fernando (076-2345678)",
      },
      {
        name: "Table Tennis Smash Cup",
        venue: "Indoor Gymnasium Hall 2",
        time: "01:00 PM - 05:00 PM",
        status: "UPCOMING",
        rules: [
          "Best of 3 sets (11 points per set, 2-point lead required).",
          "ITTF approved 40+ poly balls used for all matches.",
          "Mixed doubles and singles brackets counted toward team points.",
        ],
        coordinator: "Tharushi Jayasinghe (077-8765432)",
      },
    ],
  },
  {
    id: "team-3",
    name: "CRIMSON WOLVES",
    short: "CRW",
    tagline: "Relentless Pack Mentality",
    color: "#EF4444",
    logo: "🐺",
    score: 430,
    wins: 5,
    events: [
      {
        name: "6-Over Super Sixes Cricket",
        venue: "Main Oval Ground",
        time: "08:30 AM - 04:00 PM",
        status: "LIVE",
        rules: [
          "6 players per team, 5 overs per innings (max 1 over per bowler).",
          "Batsmen must retire not-out upon reaching 31 runs.",
          "Wide and no-ball count as 2 extra runs plus an extra delivery.",
        ],
        coordinator: "Chathura Bandara (071-3456789)",
      },
      {
        name: "Classic Tug of War",
        venue: "Central Turf Field",
        time: "04:15 PM - 05:45 PM",
        status: "UPCOMING",
        rules: [
          "8 pullers per team with a maximum combined weight cap of 640kg.",
          "Best of 3 pulls; changing grip after referee lock is prohibited.",
          "No gloves or metal cleats permitted.",
        ],
        coordinator: "Sahan Wijesinghe (075-4567890)",
      },
    ],
  },
  {
    id: "team-4",
    name: "AZURE SHARKS",
    short: "AZS",
    tagline: "Deep Focus, Deadly Strike",
    color: "#06B6D4",
    logo: "🦈",
    score: 395,
    wins: 4,
    events: [
      {
        name: "6v6 Power Volleyball",
        venue: "Indoor Court 1",
        time: "09:30 AM - 01:30 PM",
        status: "COMPLETED",
        rules: [
          "Best of 3 sets (first two sets to 25 points, deciding set to 15).",
          "Rotation rules and net touch violations strictly officiated.",
          "Maximum 2 timeouts of 30 seconds per set.",
        ],
        coordinator: "Malith Gunasekara (077-5678901)",
      },
      {
        name: "50m Freestyle & Medley Swim",
        venue: "Aquatic Center Pool",
        time: "11:00 AM - 02:00 PM",
        status: "LIVE",
        rules: [
          "FINA starting and turn touch regulations enforced.",
          "Swimmers must remain in assigned lanes until all finish.",
          "Top 3 fastest heat times qualify for grand finals.",
        ],
        coordinator: "Amaya Senanayake (070-6789012)",
      },
    ],
  },
  {
    id: "team-5",
    name: "EMERALD VIPERS",
    short: "EMV",
    tagline: "Speed That Strikes First",
    color: "#10B981",
    logo: "🐍",
    score: 370,
    wins: 4,
    events: [
      {
        name: "Shuttle Clash Badminton",
        venue: "Indoor Badminton Complex",
        time: "09:00 AM - 03:00 PM",
        status: "LIVE",
        rules: [
          "21-point rally scoring system (best of 3 games).",
          "Non-marking indoor court shoes are compulsory.",
          "Service height must remain below 1.15m from court surface.",
        ],
        coordinator: "Pasindu Ekanayake (078-7890123)",
      },
      {
        name: "Blitz Chess Championship",
        venue: "Student Activity Hall A",
        time: "10:00 AM - 01:00 PM",
        status: "COMPLETED",
        rules: [
          "5 minutes + 3 seconds increment per move (FIDE Blitz rules).",
          "Touch-move rule applies strictly; first illegal move adds 1 min to opponent.",
          "Swiss system 5 rounds across team boards.",
        ],
        coordinator: "Kaveesha Herath (071-8901234)",
      },
    ],
  },
  {
    id: "team-6",
    name: "ROYAL PANTHERS",
    short: "RYP",
    tagline: "Stealth, Grace, Dominance",
    color: "#A855F7",
    logo: "🐆",
    score: 345,
    wins: 3,
    events: [
      {
        name: "7s Touch Rugby",
        venue: "Main Rugby Pitch",
        time: "01:30 PM - 05:00 PM",
        status: "UPCOMING",
        rules: [
          "7 players on field; 6 touches per possession before turnover.",
          "Two 7-minute halves; strictly no tackle or high contact allowed.",
          "Drop-off sudden death in case of knockout draw.",
        ],
        coordinator: "Shehan Samarasinghe (077-9012345)",
      },
      {
        name: "Carrom Masters Doubles",
        venue: "Recreation Lounge B",
        time: "09:30 AM - 02:30 PM",
        status: "LIVE",
        rules: [
          "25 points or 8 boards maximum per match.",
          "Queen must be covered on the same or immediate next valid strike.",
          "Thumb shots allowed; elbow must not cross diagonal foul lines.",
        ],
        coordinator: "Dinithi Pathirana (076-0123456)",
      },
    ],
  },
  {
    id: "team-7",
    name: "THUNDER HAWKS",
    short: "THK",
    tagline: "Velocity From the Skies",
    color: "#3B82F6",
    logo: "⚡",
    score: 320,
    wins: 3,
    events: [
      {
        name: "Fast5 Netball Showdown",
        venue: "Netball Court Complex",
        time: "10:00 AM - 02:00 PM",
        status: "LIVE",
        rules: [
          "5 players per side (GS, GA, C, GD, GK) with 4-minute quarters.",
          "1, 2, and 3-point shooting zones active.",
          "Each team gets one Power Play quarter with doubled points.",
        ],
        coordinator: "Hashini Dissanayake (071-2233445)",
      },
      {
        name: "Shot Put & Discus Throw",
        venue: "Field Sector North",
        time: "11:30 AM - 01:30 PM",
        status: "COMPLETED",
        rules: [
          "3 trial throws per athlete; top 6 advance to 3 final throws.",
          "Athlete must exit from the rear half of the throwing circle.",
          "Best legal distance recorded in meters and centimeters.",
        ],
        coordinator: "Lahiru Kumara (077-3344556)",
      },
    ],
  },
  {
    id: "team-8",
    name: "IRON GLADIATORS",
    short: "IRG",
    tagline: "Unbreakable Arena Spirit",
    color: "#F97316",
    logo: "⚔️",
    score: 295,
    wins: 2,
    events: [
      {
        name: "Pro Kabaddi Raid Arena",
        venue: "Indoor Mat Hall",
        time: "02:00 PM - 05:30 PM",
        status: "UPCOMING",
        rules: [
          "7 players on court; 30-second raid clock strictly monitored.",
          "Two 10-minute halves; bonus line active when 6+ defenders on court.",
          "Super Tackle awards 2 points when 3 or fewer defenders remain.",
        ],
        coordinator: "Dhananjaya Rajapaksa (075-4455667)",
      },
      {
        name: "Pro Arm Wrestling",
        venue: "Main Stage Amphitheater",
        time: "03:30 PM - 06:00 PM",
        status: "UPCOMING",
        rules: [
          "Under-70kg, Under-85kg, and Open weight classes.",
          "Two elbow fouls result in an automatic loss of that round.",
          "Free hand must remain in contact with the table peg at all times.",
        ],
        coordinator: "Bhanuka Mendis (077-5566778)",
      },
    ],
  },
  {
    id: "team-9",
    name: "NEON COBRAS",
    short: "NCO",
    tagline: "Precision in Every Move",
    color: "#EC4899",
    logo: "👑",
    score: 275,
    wins: 2,
    events: [
      {
        name: "Valorant & FIFA E-Sports",
        venue: "IT Lab & Digital Arena",
        time: "09:00 AM - 04:00 PM",
        status: "LIVE",
        rules: [
          "Valorant: 5v5 Single Elimination (Best of 1 qualifiers, BO3 Final).",
          "FIFA: 6-minute halves, Legendary difficulty, tactical defending required.",
          "Players may bring personal mice, controllers, and headsets.",
        ],
        coordinator: "Ravindu Gamage (076-6677889)",
      },
      {
        name: "Long Jump & High Jump",
        venue: "Sand Pit & Jump Sector",
        time: "01:00 PM - 03:30 PM",
        status: "UPCOMING",
        rules: [
          "3 jumps per qualifier; foul line monitored via optical/plasticine indicator.",
          "High Jump: 3 consecutive failures at any height eliminates jumper.",
          "Tie-breaker decided by second-best valid jump.",
        ],
        coordinator: "Nethmi Karunaratne (071-7788990)",
      },
    ],
  },
  {
    id: "team-10",
    name: "BLAZE FALCONS",
    short: "BZF",
    tagline: "Born to Conquer the Wind",
    color: "#EAB308",
    logo: "🔥",
    score: 250,
    wins: 2,
    events: [
      {
        name: "4x4 Beach Volleyball",
        venue: "Sand Court Arena",
        time: "10:30 AM - 02:30 PM",
        status: "LIVE",
        rules: [
          "Single set to 21 points (semi-finals and finals best of 3 to 15).",
          "Teams switch court sides every 7 points scored.",
          "Open-hand dinks/tips are illegal; clean contact required.",
        ],
        coordinator: "Isuru Madushan (077-8899001)",
      },
      {
        name: "5km Cross-Country Marathon",
        venue: "University Perimeter Circuit",
        time: "06:30 AM - 08:30 AM",
        status: "COMPLETED",
        rules: [
          "RFID/Chest bib must be visible on the front torso throughout.",
          "4 mandatory checkpoint verification bands along the 5km route.",
          "Top 10 finishers earn sliding points for their respective teams.",
        ],
        coordinator: "Piumi Ratnayake (070-9900112)",
      },
    ],
  },
];

function TeamLogo({ logo, className = "h-10 w-10" }) {
  const isImage = typeof logo === "string" && (logo.startsWith("/") || logo.startsWith("http"));
  return (
    <span className={`team-logo-frame shadow-inner ${className}`}>
      {isImage ? (
        <img src={logo} alt="Team logo" />
      ) : (
        <span className="leading-none">{logo}</span>
      )}
    </span>
  );
}

const HERO_SLIDES = [
  {
    title: "UNLEASH THE GLORY AT EMPREZA 2026",
    subtitle: "UNIVERSITY SPORT MODULE CHAMPIONSHIP • 10 TEAMS • 20 ELITE EVENTS",
    badge: "EMPREZA 2026",
    image: "/gallery/2026/hero/hero-01.jpg",
  },
  {
    title: "WHERE CHAMPIONS ARE FORGED IN GOLD",
    subtitle: "10 TEAMS • 20 EVENTS • ONE ULTIMATE TROPHY",
    badge: "2026 CHAMPIONSHIP",
    image: "/gallery/2026/hero/hero-02.jpg",
  },
  {
    title: "10 FRANCHISES. ONE OBSIDIAN THRONE.",
    subtitle: "CLICK ANY TEAM CARD BELOW TO EXPLORE HOSTED SPORTS & OFFICIAL RULES",
    badge: "UPLOAD YOUR MOMENTS",
    image: "/gallery/2026/hero/hero-03.jpg",
  },
];

const HISTORY_TIMELINE = [
  {
    year: "2025",
    title: "EMPREZA 2025: Leadership Through Experience",
    winner: "Pathfinders (Champions)",
    desc: "The third EMPREZA leadership event series was organized by Semester II students of the Textile, Chemical and Polymer, Civil Engineering Technology, and Maritime Studies Divisions on 24 October 2025 at the university premises. Conducted as the final project for the IS1205 Sports Studies module, the event developed teamwork, decision-making, communication, and strategic thinking through physical, intellectual, and team-based challenges. Code Champ was the 1st runner-up and Trailblazers was the 2nd runner-up.",
  },
];

export const GALLERY_ITEMS = [
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g02.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g03.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g04.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g05.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g06.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g07.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g08.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g09.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g10.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g11.jpg",
  },
  {
    title: "",
    category: "2025 History",
    year: "2025",
    image: "https://feunrcibwemtfbgtmxzd.supabase.co/storage/v1/object/public/empreza-media/gallery/2025/optimized/g12.jpg",
  },
];

export function mergeGalleryItems(items) {
  const savedItems = (Array.isArray(items) ? items : []).filter(
    (item) =>
      !item.image?.includes("images.unsplash.com") &&
      !item.image?.includes("/gallery/2025/")
  ).map((item) => (
    item.year === "2025" || item.image?.startsWith("/gallery/2025/")
      ? { ...item, title: "" }
      : item
  ));
  const savedImages = new Set(savedItems.map((item) => item.image));
  const archiveItems = GALLERY_ITEMS.filter(
    (item) => item.year === "2025" && !savedImages.has(item.image)
  );
  return [...archiveItems, ...savedItems];
}

export default function EmprezaPage() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [gallery, setGallery] = useState(GALLERY_ITEMS);
  const [siteSettings, setSiteSettings] = useState({ mainLogo: "/empreza-logo.png" });
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(null);
  const [galleryPage, setGalleryPage] = useState(1);
  const [approvedSelfies, setApprovedSelfies] = useState([]);
  const [selfiesLoading, setSelfiesLoading] = useState(true);
  const [selfiesError, setSelfiesError] = useState("");
  const [selectedSelfieIndex, setSelectedSelfieIndex] = useState(null);
  const [selfiesRefresh, setSelfiesRefresh] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [announcement, setAnnouncement] = useState(
    "🔥 LIVE: Titan Vanguards take the lead after Futsal Semi-Finals (+35 PTS)! Next up: 100m Sprint Finals at 2:30 PM."
  );
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const galleryPageSize = 6;
  const galleryPageCount = Math.max(1, Math.ceil(gallery.length / galleryPageSize));
  const visibleGalleryItems = gallery.slice(
    (galleryPage - 1) * galleryPageSize,
    galleryPage * galleryPageSize
  );

  useEffect(() => {
    let active = true;

    const loadApprovedSelfies = async () => {
      if (!supabase) {
        if (active) {
          setSelfiesLoading(false);
          setSelfiesError("Live photos are not configured.");
        }
        return;
      }

      const { data, error } = await supabase
        .from("selfies")
        .select("id, image_data, event, team_name, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        setSelfiesError("Live photos could not be loaded right now.");
        setSelfiesLoading(false);
        console.error("Approved selfies read error:", error);
        return;
      }

      setApprovedSelfies(data || []);
      setSelfiesError("");
      setSelfiesLoading(false);
    };

    loadApprovedSelfies();
    const refreshTimer = window.setInterval(loadApprovedSelfies, 30000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [selfiesRefresh]);

  useEffect(() => {
    if (selectedSelfieIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedSelfieIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedSelfieIndex((index) => (index - 1 + approvedSelfies.length) % approvedSelfies.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedSelfieIndex((index) => (index + 1) % approvedSelfies.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSelfieIndex, approvedSelfies.length]);

  useEffect(() => {
    const timer = setTimeout(() => setIsIntroVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Hero Carousel Auto-Slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedGalleryIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedGalleryIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedGalleryIndex((index) => (index - 1 + gallery.length) % gallery.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedGalleryIndex((index) => (index + 1) % gallery.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGalleryIndex, gallery.length]);

  // Load & Sync Scores (Supabase if configured, plus LocalStorage fallback)
  useEffect(() => {
    if (galleryPage > galleryPageCount) setGalleryPage(galleryPageCount);
  }, [galleryPage, galleryPageCount]);

  useEffect(() => {
    if (window.location.hash === "#/admin") {
      window.location.replace("/admin");
      return;
    }
    const savedState = localStorage.getItem("empreza_2026_state");
    const savedLocal = localStorage.getItem("empreza_2026_teams");
    const savedNotice = localStorage.getItem("empreza_2026_notice");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.teams) setTeams(parsedState.teams);
        if (parsedState.announcement) setAnnouncement(parsedState.announcement);
        if (parsedState.gallery) setGallery(mergeGalleryItems(parsedState.gallery));
        if (parsedState.settings) setSiteSettings(parsedState.settings);
      } catch (e) {
        console.error("Could not load saved site state:", e);
      }
    }
    if (savedLocal) {
      try {
        setTeams(JSON.parse(savedLocal));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedNotice) {
      setAnnouncement(savedNotice);
    }

    readSiteState().then((remote) => {
      if (remote?.state?.teams) setTeams(remote.state.teams);
      if (remote?.state?.announcement) setAnnouncement(remote.state.announcement);
      if (remote?.state?.gallery) setGallery(mergeGalleryItems(remote.state.gallery));
      if (remote?.state?.settings) setSiteSettings(remote.state.settings);
      if (remote?.updated_at) setLastUpdated(new Date(remote.updated_at).toLocaleTimeString());
    }).catch((err) => console.error("Supabase read error:", err));
  }, []);

  const persistState = async (updatedTeams, updatedNotice = announcement) => {
    setTeams(updatedTeams);
    const nowStr = new Date().toLocaleTimeString();
    setLastUpdated(nowStr);
    localStorage.setItem("empreza_2026_teams", JSON.stringify(updatedTeams));
    localStorage.setItem("empreza_2026_notice", updatedNotice);
    localStorage.setItem(
      "empreza_2026_state",
      JSON.stringify({ teams: updatedTeams, announcement: updatedNotice, gallery, settings: siteSettings })
    );

    if (supabase) {
      try {
        await writeSiteState({
          teams: updatedTeams,
          announcement: updatedNotice,
          gallery,
          settings: siteSettings,
        });
      } catch (err) {
        console.error("Supabase sync error:", err);
      }
    }
  };

  const handleScoreChange = (teamId, deltaPoints, deltaWins = 0) => {
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          score: Math.max(0, t.score + deltaPoints),
          wins: Math.max(0, t.wins + deltaWins),
        };
      }
      return t;
    });
    persistState(updated);
  };

  const handleDirectScoreInput = (teamId, newScore) => {
    const numeric = parseInt(newScore, 10);
    const updated = teams.map((t) =>
      t.id === teamId ? { ...t, score: isNaN(numeric) ? 0 : Math.max(0, numeric) } : t
    );
    persistState(updated);
  };

  const handleResetDefault = () => {
    persistState(INITIAL_TEAMS, "🔥 LIVE: Scores reset to official starting tournament brackets.");
  };

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => b.score - a.score);
  }, [teams]);

  const topThree = sortedTeams.slice(0, 3);

  const handleUnlockAdmin = (e) => {
    e.preventDefault();
    if (adminPin === "2026") {
      setIsUnlocked(true);
      setPinError("");
    } else {
      setPinError("Invalid PIN! Use 2026 for Admin Access.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">
      {isIntroVisible && (
        <div className="loading-intro" role="status" aria-label="Loading EMPREZA 2026">
          <div className="loading-intro-content">
            <div className="football-kick">
              <span className="football-kick-ball" aria-hidden="true">⚽</span>
              <span className="football-kick-shadow" aria-hidden="true" />
            </div>
            <img src={siteSettings.mainLogo || "/empreza-logo.png"} alt="EMPREZA logo" className="loading-intro-logo" />
            <p className="loading-intro-label">Get ready to play</p>
          </div>
        </div>
      )}
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#E7B736]/25 bg-[#0C0C0C]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6">
          <a href="#" className="flex items-center">
            <img src={siteSettings.mainLogo || "/empreza-logo.png"} alt="EMPREZA logo" className="h-11 w-24 object-contain sm:h-14 sm:w-28" />
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-300 md:flex">
            <a href="#leaderboard" className="transition hover:text-[#E7B736]">
              Leaderboard
            </a>
            <a href="#teams" className="transition hover:text-[#E7B736]">
              10 Teams & 20 Sports
            </a>
            <a href="#about" className="transition hover:text-[#E7B736]">
              About
            </a>
            <a href="#history" className="transition hover:text-[#E7B736]">
              History
            </a>
            <a href="#gallery" className="transition hover:text-[#E7B736]">
              Gallery
            </a>
            <a href="#live-images" className="transition hover:text-[#E7B736]">
              Live Photos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 sm:flex">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              LIVE SCORES
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-lg border border-white/15 p-2 text-zinc-300 transition hover:border-[#E7B736] hover:text-[#E7B736] md:hidden"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <nav className="border-t border-white/10 px-4 py-3 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium text-zinc-300">
              {[
                ["leaderboard", "Leaderboard"],
                ["teams", "10 Teams & 20 Sports"],
                ["about", "About"],
                ["history", "History"],
                ["gallery", "Gallery"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={`#${href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-[#E7B736]"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Hero Image Carousel */}
      <section className="relative h-[540px] sm:h-[620px] w-full overflow-hidden border-b border-[#E7B736]/20">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,#3b2b0d,#0C0C0C_65%)] transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/75 to-[#0C0C0C]/40" />
          </div>
        ))}

        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF6B00]/50 bg-[#FF6B00]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FF6B00] mb-4">
            <Activity className="h-3.5 w-3.5" />
            {HERO_SLIDES[currentSlide].badge}
          </div>

          <h1 className="font-plak max-w-4xl text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
            {HERO_SLIDES[currentSlide].title.split("EMPREZA 2026")[0]}
            {HERO_SLIDES[currentSlide].title.includes("EMPREZA 2026") && (
              <span className="text-[#E7B736]">EMPREZA 2026</span>
            )}
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base font-medium tracking-wider text-zinc-300">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#leaderboard"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#E7B736] to-[#FF6B00] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#FF6B00]/25 transition hover:brightness-110"
            >
              <Trophy className="h-4 w-4" />
              View Live Standings
            </a>
            <a
              href="#teams"
              className="flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:border-[#E7B736] hover:text-[#E7B736]"
            >
              Explore 10 Teams & Rules
            </a>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
            }
            className="rounded-full border border-white/20 bg-black/60 p-2.5 text-white transition hover:border-[#E7B736] hover:text-[#E7B736]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="rounded-full border border-white/20 bg-black/60 p-2.5 text-white transition hover:border-[#E7B736] hover:text-[#E7B736]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Top 3 Podium & Full Real-Time Leaderboard */}
      <section id="leaderboard" className="mx-auto max-w-7xl px-3 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
              REAL-TIME TOURNAMENT STANDINGS
            </span>
            <h2 className="font-plak mt-2 max-w-3xl text-3xl font-extrabold uppercase leading-[0.95] tracking-wide text-white sm:text-5xl">
              CHAMPIONSHIP <span className="text-[#E7B736]">PODIUM</span>
              <span className="block text-[#E7B736] sm:inline"> & LEADERBOARD</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-400">
            <Clock className="h-4 w-4 text-[#E7B736]" />
            <span>Last Synced: {lastUpdated}</span>
          </div>
        </div>

        {/* Top 3 Spotlight Podium */}
        <div className="podium-grid mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="podium-card podium-silver order-2 md:order-1 relative rounded-2xl border border-zinc-400/40 bg-gradient-to-b from-zinc-800/60 to-[#121212] p-5 text-center shadow-xl sm:p-6">
              <div className="podium-rank mx-auto -mt-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-300 bg-[#0C0C0C] text-lg font-extrabold text-zinc-200 shadow-md">
                #2
              </div>
              <TeamLogo logo={topThree[1].logo} className="mt-4 h-16 w-16 text-5xl" />
              <span className="mt-2 inline-block rounded bg-zinc-400/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                SILVER CONTENDER
              </span>
              <h3 className="font-plak mt-2 break-words text-2xl font-bold uppercase text-white">
                {topThree[1].name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400">{topThree[1].tagline}</p>
              <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-center gap-6">
                <div>
                  <p className="text-[11px] uppercase text-zinc-400">Total Points</p>
                  <p className="font-plak text-3xl font-extrabold text-zinc-200">
                    {topThree[1].score}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-zinc-400">Gold Wins</p>
                  <p className="font-plak text-2xl font-bold text-white">{topThree[1].wins}</p>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place Champion */}
          {topThree[0] && (
            <div className="podium-card podium-gold order-1 md:order-2 relative rounded-2xl border-2 border-[#E7B736] bg-gradient-to-b from-[#E7B736]/25 via-[#161616] to-[#0C0C0C] p-6 text-center shadow-2xl shadow-[#E7B736]/15 md:-translate-y-4 sm:p-8">
              <div className="podium-rank mx-auto -mt-11 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E7B736] bg-[#0C0C0C] text-xl font-extrabold text-[#E7B736] shadow-lg shadow-[#E7B736]/30">
                👑 #1
              </div>
              <TeamLogo logo={topThree[0].logo} className="mt-4 h-20 w-20 text-6xl" />
              <span className="mt-3 inline-block rounded-full bg-[#E7B736] px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-black">
                CURRENT ARENA LEADER
              </span>
              <h3 className="font-plak mt-2 break-words text-3xl font-extrabold uppercase text-[#E7B736]">
                {topThree[0].name}
              </h3>
              <p className="mt-1 text-xs text-zinc-300">{topThree[0].tagline}</p>
              <div className="mt-6 border-t border-[#E7B736]/30 pt-4 flex items-center justify-center gap-8">
                <div>
                  <p className="text-xs uppercase text-zinc-300">Total Points</p>
                  <p className="font-plak text-4xl font-extrabold text-[#E7B736]">
                    {topThree[0].score}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-zinc-300">Gold Wins</p>
                  <p className="font-plak text-3xl font-bold text-white">{topThree[0].wins}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="podium-card podium-bronze order-3 relative rounded-2xl border border-[#FF6B00]/50 bg-gradient-to-b from-[#FF6B00]/15 to-[#121212] p-5 text-center shadow-xl sm:p-6">
              <div className="podium-rank mx-auto -mt-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FF6B00] bg-[#0C0C0C] text-lg font-extrabold text-[#FF6B00] shadow-md">
                #3
              </div>
              <TeamLogo logo={topThree[2].logo} className="mt-4 h-16 w-16 text-5xl" />
              <span className="mt-2 inline-block rounded bg-[#FF6B00]/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-[#FF6B00]">
                BRONZE CHALLENGER
              </span>
              <h3 className="font-plak mt-2 break-words text-2xl font-bold uppercase text-white">
                {topThree[2].name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400">{topThree[2].tagline}</p>
              <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-center gap-6">
                <div>
                  <p className="text-[11px] uppercase text-zinc-400">Total Points</p>
                  <p className="font-plak text-3xl font-extrabold text-[#FF6B00]">
                    {topThree[2].score}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-zinc-400">Gold Wins</p>
                  <p className="font-plak text-2xl font-bold text-white">{topThree[2].wins}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All 10 Teams Standings Table */}
        <div className="leaderboard-table mt-10 overflow-hidden rounded-2xl border border-white/15 bg-[#121212] sm:mt-12">
          <div className="grid grid-cols-12 border-b border-white/10 bg-[#191919] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-400 sm:px-6">
            <div className="col-span-2 sm:col-span-1">Rank</div>
            <div className="col-span-6 sm:col-span-5">Team Franchise</div>
            <div className="hidden sm:col-span-3 sm:block">Hosted Events</div>
            <div className="col-span-2 text-center">Wins</div>
            <div className="col-span-2 text-right">Points</div>
          </div>

          <div className="divide-y divide-white/5">
            {sortedTeams.map((team, index) => {
              const maxScore = sortedTeams[0]?.score || 1;
              const pct = Math.min(100, Math.round((team.score / maxScore) * 100));
              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="grid cursor-pointer grid-cols-12 items-center px-4 py-4 transition hover:bg-white/[0.04] sm:px-6"
                >
                  <div className="col-span-2 sm:col-span-1">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold ${
                        index === 0
                          ? "bg-[#E7B736] text-black"
                          : index === 1
                          ? "bg-zinc-300 text-black"
                          : index === 2
                          ? "bg-[#FF6B00] text-black"
                          : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    <TeamLogo logo={team.logo} className="text-3xl" />
                    <div>
                      <p className="font-plak text-base sm:text-lg font-bold uppercase text-white">
                        {team.name}
                      </p>
                      <div className="mt-1 h-1.5 w-28 sm:w-40 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: team.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:col-span-3 sm:flex flex-col gap-1 pr-4">
                    {team.events.map((ev, i) => (
                      <span
                        key={i}
                        className="truncate text-xs text-zinc-300 flex items-center gap-1.5"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        {ev.name}
                      </span>
                    ))}
                  </div>

                  <div className="col-span-2 text-center font-semibold text-zinc-200">
                    {team.wins}
                  </div>

                  <div className="col-span-2 text-right font-plak text-xl sm:text-2xl font-extrabold text-[#E7B736]">
                    {team.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 Teams & 20 Hosted Events Grid */}
      <section id="teams" className="border-t border-white/10 bg-[#101010] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E7B736]">
              CLICK ANY TEAM FOR EVENT RULES & DETAILS
            </span>
            <h2 className="font-plak mt-2 text-3xl font-extrabold uppercase text-white sm:text-5xl">
              10 FRANCHISE TEAMS & <span className="text-[#FF6B00]">20 CHAMPIONSHIP SPORTS</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Each of the 10 competing university teams organizes 2 official sports events. Click on any
              team card below to inspect their custom color identity, match schedules, and official
              tournament rules.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#161616] p-5 transition duration-300 hover:-translate-y-1.5 hover:border-[#E7B736]"
                style={{
                  boxShadow: `0 10px 30px -15px ${team.color}40`,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: team.color }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-inner"
                      style={{
                        backgroundColor: `${team.color}20`,
                        border: `1px solid ${team.color}`,
                      }}
                    >
                      <TeamLogo logo={team.logo} className="h-10 w-10 text-3xl" />
                    </span>
                    <span
                      className="rounded-md px-2.5 py-1 text-xs font-extrabold uppercase"
                      style={{
                        backgroundColor: `${team.color}20`,
                        color: team.color,
                      }}
                    >
                      {team.score} PTS
                    </span>
                  </div>

                  <h3 className="font-plak mt-4 text-xl font-bold uppercase text-white group-hover:text-[#E7B736]">
                    {team.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{team.tagline}</p>

                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Organizing 2 Sports:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {team.events.map((ev, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded-lg bg-black/40 px-2.5 py-1.5 text-xs text-zinc-200"
                        >
                          <span className="truncate pr-2 font-medium">{ev.name}</span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                              ev.status === "LIVE"
                                ? "bg-[#FF6B00] text-black"
                                : ev.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-white/10 text-zinc-300"
                            }`}
                          >
                            {ev.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold uppercase tracking-wider text-black transition group-hover:brightness-110"
                  style={{ backgroundColor: team.color }}
                >
                  View Rules & Info
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & History Section */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* About Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
              ABOUT THE TOURNAMENT
            </span>
            <h2 className="font-plak mt-2 text-3xl font-extrabold uppercase text-white sm:text-5xl">
              THE SPIRIT OF <span className="text-[#E7B736]">EMPREZA</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              The Semester II students of the Textile, Chemical and Polymer, Civil Engineering Technology,
              and Maritime Studies Divisions of the Institute of Technology, University of Moratuwa
              successfully organized the third edition of the EMPREZA leadership event series,
              <strong> EMPREZA 2025</strong>, on 24 October 2025 at the university premises.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              Conducted as the final project for the IS1205 Sports Studies module, the event gave students
              an opportunity to apply theoretical knowledge through experiential learning. Physical,
              intellectual, and team-based challenges encouraged teamwork, decision-making, communication,
              strategic thinking, creativity, and a spirit of unity and friendly rivalry.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              Team <strong>Pathfinders</strong> won the championship, followed by <strong>Code Champ</strong> as
              the 1st runner-up and <strong>Trailblazers</strong> as the 2nd runner-up. The event was graced
              by Dr. (Mrs.) M. C. W. Somarathne, Acting Director of ITUM, together with Heads of Divisions,
              academic staff, and non-academic staff members.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E7B736]/30 bg-[#141414] p-4">
                <p className="font-plak text-3xl font-extrabold text-[#E7B736]">10</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                  Teams
                </p>
              </div>
              <div className="rounded-xl border border-[#FF6B00]/30 bg-[#141414] p-4">
                <p className="font-plak text-3xl font-extrabold text-[#FF6B00]">20</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                  Events
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-[#141414] p-4">
                <p className="font-plak text-3xl font-extrabold text-white">4</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                  Participating Divisions
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-[#141414] p-4">
                <p className="font-plak text-3xl font-extrabold text-[#E7B736]">IS1205</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                  Sports Studies Module
                </p>
              </div>
            </div>
          </div>

          {/* History Timeline Column */}
          <div id="history" className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[#E7B736]">
                <History className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  LEGACY & ARCHIVES
                </span>
              </div>
              <h3 className="font-plak mt-1 text-2xl font-bold uppercase text-white sm:text-3xl">
                EMPREZA HALL OF HISTORY
              </h3>

              <div className="mt-6 space-y-6 border-l-2 border-[#E7B736]/40 pl-6">
                {HISTORY_TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[33px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E7B736] ring-4 ring-[#0C0C0C]" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded bg-[#E7B736]/20 px-2.5 py-0.5 font-plak text-sm font-bold text-[#E7B736]">
                        {item.year}
                      </span>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        🏆 {item.winner}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-base font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Gallery Section */}
      <section id="gallery" className="border-t border-white/10 bg-[#101010] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E7B736]">
                MOMENTS OF GLORY
              </span>
              <h2 className="font-plak mt-1 text-3xl font-extrabold uppercase text-white sm:text-5xl">
                ARENA <span className="text-[#FF6B00]">GALLERY</span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              High-energy captures from the EMPREZA university sports battlegrounds.
            </p>
          </div>

          <div className="mt-10">
            <div className="mb-5 flex items-center gap-3">
             
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleGalleryItems.map((item, idx) => {
                const galleryIndex = (galleryPage - 1) * galleryPageSize + idx;
                return (
                <button
                  type="button"
                  key={`${item.image}-${galleryIndex}`}
                  onClick={() => setSelectedGalleryIndex(galleryIndex)}
                  className="group relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#161616]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block rounded bg-[#E7B736] px-2 py-0.5 text-[10px] font-extrabold uppercase text-black">
                      {item.category}
                    </span>
                    {item.title && (
                      <h3 className="font-plak mt-1 text-xl font-bold uppercase text-white">
                        {item.title}
                      </h3>
                    )}
                  </div>
                </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setGalleryPage((page) => Math.max(1, page - 1))}
                disabled={galleryPage === 1}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#E7B736] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 text-sm text-zinc-400">
                Page {galleryPage} of {galleryPageCount}
              </span>
              <button
                type="button"
                onClick={() => setGalleryPage((page) => Math.min(galleryPageCount, page + 1))}
                disabled={galleryPage === galleryPageCount}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white transition hover:border-[#E7B736] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="live-images" className="border-t border-white/10 bg-[#0C0C0C] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B00]" />
                LIVE COMMUNITY MOMENTS
              </span>
              <h2 className="font-plak mt-1 text-3xl font-extrabold uppercase text-white sm:text-5xl">
                APPROVED <span className="text-[#E7B736]">SELFIES</span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Approved event photos appear here automatically.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelfiesLoading(true);
                setSelfiesRefresh((value) => value + 1);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E7B736]/50 bg-[#E7B736]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#E7B736] transition hover:bg-[#E7B736] hover:text-black"
            >
              <RefreshCw className={`h-4 w-4 ${selfiesLoading ? "animate-spin" : ""}`} />
              Refresh live photos
            </button>
          </div>

          {selfiesLoading && (
            <p className="mt-8 text-sm text-zinc-400">Loading live photos...</p>
          )}
          {!selfiesLoading && selfiesError && (
            <p className="mt-8 rounded-xl border border-white/10 bg-[#161616] p-5 text-sm text-zinc-400">
              {selfiesError}
            </p>
          )}
          {!selfiesLoading && !selfiesError && approvedSelfies.length === 0 && (
            <p className="mt-8 rounded-xl border border-white/10 bg-[#161616] p-5 text-sm text-zinc-400">
              No approved photos yet. New approved event moments will appear here.
            </p>
          )}
          {!selfiesLoading && !selfiesError && approvedSelfies.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {approvedSelfies.map((photo, index) => (
                <button
                  type="button"
                  key={photo.id}
                  onClick={() => setSelectedSelfieIndex(index)}
                  className="group relative overflow-hidden rounded-2xl border border-[#E7B736]/40 bg-[#161616] text-left transition duration-300 hover:-translate-y-1 hover:border-[#E7B736] hover:shadow-[0_1.5rem_3rem_-1.5rem_rgba(231,183,54,0.7)]"
                >
                  <img
                    src={photo.image_data}
                    alt={`${photo.team_name || "Team"} event moment`}
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E7B736] opacity-0 transition group-hover:opacity-100">
                    View photo
                  </span>
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
                      {photo.event || "EMPREZA 2026"}
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {photo.team_name || "EMPREZA Team"}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-500">
                      Approved live moment
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedSelfieIndex !== null && approvedSelfies[selectedSelfieIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedSelfieIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedSelfieIndex(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white transition hover:bg-[#E7B736] hover:text-black"
              aria-label="Close live photo"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={approvedSelfies[selectedSelfieIndex].image_data}
              alt={`${approvedSelfies[selectedSelfieIndex].team_name || "Team"} event moment`}
              className="max-h-[78vh] w-full rounded-2xl object-contain"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedSelfieIndex((index) => (index - 1 + approvedSelfies.length) % approvedSelfies.length)}
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-[#E7B736] hover:text-[#E7B736]"
                aria-label="Previous live photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  {approvedSelfies[selectedSelfieIndex].event || "EMPREZA 2026"}
                </p>
                <h3 className="font-plak mt-1 text-xl font-bold uppercase text-white">
                  {approvedSelfies[selectedSelfieIndex].team_name || "EMPREZA Team"}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  {selectedSelfieIndex + 1} / {approvedSelfies.length} • Use arrow keys to browse
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSelfieIndex((index) => (index + 1) % approvedSelfies.length)}
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-[#E7B736] hover:text-[#E7B736]"
                aria-label="Next live photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedGalleryIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedGalleryIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedGalleryIndex(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-[#E7B736] hover:text-black"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={gallery[selectedGalleryIndex].image}
              alt={gallery[selectedGalleryIndex].title}
              className="max-h-[78vh] w-full rounded-2xl object-contain"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedGalleryIndex((index) => (index - 1 + gallery.length) % gallery.length)}
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-[#E7B736] hover:text-[#E7B736]"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E7B736]">
                  {gallery[selectedGalleryIndex].category}
                </p>
                {gallery[selectedGalleryIndex].title && (
                  <h3 className="font-plak mt-1 text-xl font-bold uppercase text-white">
                    {gallery[selectedGalleryIndex].title}
                  </h3>
                )}
                <p className="mt-1 text-xs text-zinc-400">
                  {selectedGalleryIndex + 1} / {gallery.length} • Use arrow keys to browse
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryIndex((index) => (index + 1) % gallery.length)}
                className="rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-[#E7B736] hover:text-[#E7B736]"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Details & 2 Sports Rules Popup Modal */}
      {selectedTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedTeam(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border bg-[#121212] p-6 sm:p-8 shadow-2xl"
            style={{ borderColor: selectedTeam.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTeam(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-zinc-300 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl"
                style={{
                  backgroundColor: `${selectedTeam.color}25`,
                  border: `2px solid ${selectedTeam.color}`,
                }}
              >
                <TeamLogo logo={selectedTeam.logo} className="h-12 w-12 text-4xl" />
              </div>
              <div>
                <span
                  className="rounded px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-black"
                  style={{ backgroundColor: selectedTeam.color }}
                >
                  OFFICIAL TEAM FRANCHISE • {selectedTeam.short}
                </span>
                <h3 className="font-plak mt-1 text-3xl font-extrabold uppercase text-white">
                  {selectedTeam.name}
                </h3>
                <p className="text-xs text-zinc-400">{selectedTeam.tagline}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[11px] uppercase text-zinc-400">Live Score</p>
                <p
                  className="font-plak text-3xl font-extrabold"
                  style={{ color: selectedTeam.color }}
                >
                  {selectedTeam.score} PTS
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E7B736]">
                ORGANIZED SPORTS EVENTS & OFFICIAL RULES (2 EVENTS)
              </h4>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                {selectedTeam.events.map((ev, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-[#1A1A1A] p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">
                        EVENT #{idx + 1}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-extrabold ${
                          ev.status === "LIVE"
                            ? "bg-[#FF6B00] text-black"
                            : ev.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/10 text-zinc-300"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>

                    <h5 className="font-plak mt-3 text-xl font-bold uppercase text-white">
                      {ev.name}
                    </h5>

                    <div className="mt-3 space-y-1.5 text-xs text-zinc-300">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#E7B736]" />
                        {ev.venue}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#E7B736]">
                        Rules & Regulations:
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
                        {ev.rules.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <CheckCircle2
                              className="mt-0.5 h-3.5 w-3.5 shrink-0"
                              style={{ color: selectedTeam.color }}
                            />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {isAdminOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setIsAdminOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E7B736] bg-[#121212] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-zinc-300 hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7B736] text-black">
                {isUnlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-plak text-2xl font-bold uppercase text-white">
                  EMPREZA 2026 • REAL-TIME ADMIN CONSOLE
                </h3>
                <p className="text-xs text-zinc-400">
                  Update team points, gold wins, and live ticker announcements instantly.
                </p>
              </div>
            </div>

            {!isUnlocked ? (
              <form onSubmit={handleUnlockAdmin} className="mt-8 mx-auto max-w-sm text-center">
                <p className="text-sm text-zinc-300">
                  Enter Organizer PIN to unlock live score controls (Demo PIN:{" "}
                  <span className="font-bold text-[#E7B736]">2026</span>)
                </p>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter PIN (2026)"
                  className="mt-4 w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-center text-lg font-bold tracking-widest text-white focus:border-[#E7B736] focus:outline-none"
                />
                {pinError && <p className="mt-2 text-xs text-red-400">{pinError}</p>}
                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-[#E7B736] py-3 text-xs font-extrabold uppercase tracking-wider text-black hover:brightness-110"
                >
                  Unlock Dashboard
                </button>
              </form>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Live Ticker Broadcast Editor */}
                <div className="rounded-xl border border-white/10 bg-[#181818] p-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#E7B736]">
                    Live Ticker Broadcast Message
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="flex-1 rounded-lg border border-white/15 bg-black px-3.5 py-2 text-xs text-white focus:border-[#E7B736] focus:outline-none"
                    />
                    <button
                      onClick={() => persistState(teams, announcement)}
                      className="rounded-lg bg-[#FF6B00] px-4 py-2 text-xs font-extrabold uppercase text-black hover:brightness-110"
                    >
                      Broadcast Live
                    </button>
                  </div>
                </div>

                {/* Team Score Adjusters */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-[#181818] p-3.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <TeamLogo logo={team.logo} className="h-10 w-10 text-2xl" />
                        <div>
                          <p className="font-plak text-sm font-bold uppercase text-white">
                            {team.name}
                          </p>
                          <p className="text-[11px] text-zinc-400">Wins: {team.wins}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleScoreChange(team.id, -10)}
                          className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-zinc-200 hover:bg-red-500/30"
                        >
                          -10
                        </button>
                        <input
                          type="number"
                          value={team.score}
                          onChange={(e) => handleDirectScoreInput(team.id, e.target.value)}
                          className="w-16 rounded border border-white/20 bg-black py-1 text-center font-plak text-sm font-bold text-[#E7B736]"
                        />
                        <button
                          onClick={() => handleScoreChange(team.id, 10)}
                          className="rounded bg-[#E7B736] px-2 py-1 text-xs font-extrabold text-black hover:brightness-110"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleScoreChange(team.id, 25, 1)}
                          className="rounded bg-[#FF6B00] px-2 py-1 text-xs font-extrabold text-black hover:brightness-110"
                          title="Add Gold Win (+25 pts & +1 Win)"
                        >
                          +WIN
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-white/10 pt-4">
                  <button
                    onClick={handleResetDefault}
                    className="flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-red-400 hover:text-red-400"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset Default Scores
                  </button>
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="rounded-lg bg-[#E7B736] px-6 py-2 text-xs font-extrabold uppercase text-black"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#080808] py-10 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4">
          <img src={siteSettings.mainLogo || "/empreza-logo.png"} alt="EMPREZA logo" className="mx-auto h-28 w-48 object-contain" />
          <div className="mt-5 flex justify-center gap-3">
            {FOOTER_SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ITUM on ${label}`}
                className="rounded-full border border-white/15 p-2.5 text-zinc-400 transition hover:border-[#E7B736] hover:text-[#E7B736]"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        
        
          <p className="mt-2 text-zinc-600">
            © 2026 Institute of Technology, University of Moratuwa. All rights reserved.
          </p>
          <p className="mt-3 text-zinc-600">
            Developed by{" "}
            <a
              href="https://www.dhanushka.live/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#E7B736] transition hover:text-[#FF6B00]"
            >
              Dhanushka Rathnayaka
            </a>
          </p>
        
        </div>
      </footer>
    </div>
  );
}
