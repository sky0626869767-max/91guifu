import { useState, useEffect, useRef } from "react";
import {
  Home, Users, Compass, User, Search, Trophy, Play,
  Heart, Bookmark, MessageCircle, Share2, Flame, ThumbsUp,
  X, ArrowLeft, Gift, Tv, Calendar, Zap, BookOpen, Film,
  Crown, Settings, ChevronRight, ChevronDown, ChevronUp,
  Eye, Clock, Mic, Video, Wand2, Brush, Headphones,
  Check, Plus, Star, Bell, Cpu, Layers, Image as ImageIcon, Hand,
} from "lucide-react";
import { ImmersiveVideoPlayer } from "./components/ImmersiveVideoPlayer";
import { EnhancedVideoCard } from "./components/EnhancedVideoCard";
import { GestureTutorial } from "./components/GestureTutorial";
import { FluidBackground } from "./components/FluidBackground";
import { MouseLightEffect } from "./components/MouseLightEffect";
import { Tilt3DCard } from "./components/FlipCard3D";
import { GradientGlassCard } from "./components/GlassmorphicCard";

// ── Types ──────────────────────────────────────────────────────────────
type TabId = "home" | "community" | "anime" | "discovery" | "profile";
type OverlayId = "search" | "ranking" | "videoPlayer" | "checkin" | "blacktech" | "live" | "date";
type HomeNavId = "hot" | "student" | "cat3" | "cat4" | "cat5" | "cat6";
type AnimeTabId = "anime" | "novel" | "manga";
type CommunityNavId = "follow" | "hot" | "photo" | "story";

interface VideoData {
  id: string; title: string; thumb: string;
  views: string; duration: string; vip: boolean; coins?: number;
}
interface PostData {
  id: string; avatar: string; name: string; time: string;
  title: string; image: string; views: string; likes: string;
  comments: string; tags: string[];
}

// ── Mock Data ──────────────────────────────────────────────────────────
const VIDEO_DATA: VideoData[] = [
  { id:"v1", title:"极致诱惑·私人定制系列 第三集", thumb:"1529626455594-4ff0802cfb7e", views:"328万", duration:"43:21", vip:true },
  { id:"v2", title:"学院派·制服系列精选合集", thumb:"1488426862026-3ee34a7d66df", views:"215万", duration:"28:05", vip:false, coins:50 },
  { id:"v3", title:"午夜魅惑·深夜特辑完整版", thumb:"1524504388940-b1c1722653e8", views:"189万", duration:"1:02:14", vip:true },
  { id:"v4", title:"邻家女神·日常生活篇", thumb:"1502823403499-6ccfcf4fb453", views:"156万", duration:"35:48", vip:false, coins:30 },
  { id:"v5", title:"黑丝诱惑·私房写真系列", thumb:"1520813792240-56fc4a3765a7", views:"298万", duration:"52:33", vip:true },
  { id:"v6", title:"清纯系·初次体验特辑", thumb:"1570295999919-56ceb5ecca61", views:"142万", duration:"24:17", vip:false, coins:20 },
  { id:"v7", title:"白领OL·办公室系列 完整版", thumb:"1438761681033-6461ffad8d80", views:"267万", duration:"47:09", vip:true },
  { id:"v8", title:"夜色撩人·户外写真全集", thumb:"1534528741775-53994a69daeb", views:"178万", duration:"31:44", vip:false, coins:40 },
  { id:"v9", title:"私人时光·卧室系列甄选", thumb:"1494790108377-be9c29b29330", views:"312万", duration:"58:22", vip:true },
  { id:"v10", title:"甜蜜禁区·恋人特辑精选", thumb:"1531746020798-e6953c6e8e04", views:"93万", duration:"19:55", vip:false, coins:25 },
];

const POST_DATA: PostData[] = [
  { id:"p1", avatar:"1529626455594-4ff0802cfb7e", name:"梦幻姐姐", time:"2小时前", title:"今天的私房写真，你们喜欢哪张？💕", image:"1488426862026-3ee34a7d66df", views:"8.2万", likes:"3.4万", comments:"1.2千", tags:["写真","私房"] },
  { id:"p2", avatar:"1524504388940-b1c1722653e8", name:"樱花妹纸", time:"4小时前", title:"JK制服新入，求大家评分！认真的那种", image:"1502823403499-6ccfcf4fb453", views:"12万", likes:"5.6万", comments:"2.1千", tags:["JK","制服"] },
  { id:"p3", avatar:"1570295999919-56ceb5ecca61", name:"初夏甜心", time:"昨天", title:"最近练习舞蹈，有进步了吗？求鼓励！", image:"1438761681033-6461ffad8d80", views:"6.8万", likes:"2.9万", comments:"876", tags:["舞蹈","日常"] },
  { id:"p4", avatar:"1534528741775-53994a69daeb", name:"深夜精灵", time:"3天前", title:"深夜分享一组黑丝写真，晚安宝贝们~", image:"1520813792240-56fc4a3765a7", views:"19万", likes:"8.7万", comments:"3.2千", tags:["黑丝","写真","晚安"] },
];

const AD_LABELS = ["国产精品","韩国主播","日本番号","欧美系列","动漫H","直播精选","AI换脸","写真集","短视频","VIP专区","新片速递","热门推荐","美女写真","制服诱惑","情侣私房","素人系列","网红主播","丝袜诱惑","浴室系列","露出系列","中字精品","无码精品","有码推荐","合集精选"];
const AD_COLORS = ["#e8175d","#9c27b0","#7c3aed","#c2185b","#e91e8f","#6a1b9a"];

const TAGS = ["无码","有码","国产","韩国","欧美","日本","动漫","写真","制服","黑丝","白丝","护士","教师","学生","少妇","熟女","萝莉","巨乳","苗条","素人","直播","明星","户外","网红"];

const LIVE_ROOMS = [
  { id:"l1", name:"娜娜酱", thumb:"1529626455594-4ff0802cfb7e", online:"3.2万", tag:"脱衣舞" },
  { id:"l2", name:"冰冰爱你", thumb:"1488426862026-3ee34a7d66df", online:"1.8万", tag:"互动" },
  { id:"l3", name:"小猫咪", thumb:"1570295999919-56ceb5ecca61", online:"5.1万", tag:"写真" },
  { id:"l4", name:"Elena乌克兰", thumb:"1524504388940-b1c1722653e8", online:"2.4万", tag:"外国" },
  { id:"l5", name:"深夜精灵", thumb:"1534528741775-53994a69daeb", online:"876", tag:"才艺" },
  { id:"l6", name:"苹果甜心", thumb:"1502823403499-6ccfcf4fb453", online:"4.3万", tag:"互动" },
  { id:"l7", name:"Kira乌克兰", thumb:"1438761681033-6461ffad8d80", online:"1.2万", tag:"外国" },
  { id:"l8", name:"紫薇儿", thumb:"1520813792240-56fc4a3765a7", online:"9.8万", tag:"顶级" },
];

const RANKING_PLAYS = [
  { rank:1, title:"极致诱惑·私人定制系列", count:"1298万次", thumb:"1529626455594-4ff0802cfb7e" },
  { rank:2, title:"午夜魅惑·深夜特辑", count:"986万次", thumb:"1524504388940-b1c1722653e8" },
  { rank:3, title:"白领OL·办公室系列 完整版", count:"872万次", thumb:"1438761681033-6461ffad8d80" },
  { rank:4, title:"黑丝诱惑·私房系列", count:"754万次", thumb:"1520813792240-56fc4a3765a7" },
  { rank:5, title:"私人时光·卧室系列", count:"698万次", thumb:"1494790108377-be9c29b29330" },
  { rank:6, title:"学院派·制服系列精选", count:"534万次", thumb:"1488426862026-3ee34a7d66df" },
  { rank:7, title:"邻家女神·日常篇", count:"489万次", thumb:"1502823403499-6ccfcf4fb453" },
  { rank:8, title:"甜蜜禁区·恋人特辑", count:"421万次", thumb:"1531746020798-e6953c6e8e04" },
  { rank:9, title:"夜色撩人·户外写真", count:"387万次", thumb:"1534528741775-53994a69daeb" },
  { rank:10, title:"清纯系·初次特辑", count:"312万次", thumb:"1570295999919-56ceb5ecca61" },
];

const ANIME_ITEMS = [
  { id:1, title:"魔都情事 第一季", thumb:"1529626455594-4ff0802cfb7e", views:"4500万", episodes:12, vip:true },
  { id:2, title:"禁忌之恋 完整版", thumb:"1570295999919-56ceb5ecca61", views:"2800万", episodes:24, vip:false },
  { id:3, title:"异世界后宫传 TV版", thumb:"1488426862026-3ee34a7d66df", views:"6100万", episodes:12, vip:true },
  { id:4, title:"甜蜜诱惑 OVA版", thumb:"1524504388940-b1c1722653e8", views:"3200万", episodes:6, vip:false },
  { id:5, title:"魅惑学院 全集", thumb:"1502823403499-6ccfcf4fb453", views:"1900万", episodes:13, vip:true },
  { id:6, title:"午夜邂逅 剧场版", thumb:"1520813792240-56fc4a3765a7", views:"5300万", episodes:1, vip:true },
];

const NOVELS = [
  { id:1, title:"禁忌之爱", thumb:"1438761681033-6461ffad8d80", views:"1200万", status:"连载中", words:"32万字" },
  { id:2, title:"深宫惑乱", thumb:"1534528741775-53994a69daeb", views:"870万", status:"已完结", words:"89万字" },
  { id:3, title:"霸道总裁的小秘书", thumb:"1494790108377-be9c29b29330", views:"2100万", status:"连载中", words:"45万字" },
  { id:4, title:"入侵女孩的秘密", thumb:"1531746020798-e6953c6e8e04", views:"680万", status:"连载中", words:"18万字" },
  { id:5, title:"密室与爱情", thumb:"1570295999919-56ceb5ecca61", views:"990万", status:"已完结", words:"62万字" },
  { id:6, title:"契约婚姻101天", thumb:"1524504388940-b1c1722653e8", views:"1580万", status:"连载中", words:"27万字" },
];

const SHORT_VID_THUMBS = ["1529626455594-4ff0802cfb7e","1488426862026-3ee34a7d66df","1524504388940-b1c1722653e8","1502823403499-6ccfcf4fb453","1520813792240-56fc4a3765a7","1570295999919-56ceb5ecca61","1438761681033-6461ffad8d80","1534528741775-53994a69daeb"];
const SHORT_VID_NAMES = ["梦幻姐姐","樱花妹纸","初夏甜心","深夜精灵","娜娜酱","冰冰爱你","小猫咪","苹果甜心"];
const SHORT_VID_DURS = ["0:32","1:15","0:48","2:03","0:55","1:28","0:41","1:53"];

// 沉浸式短视频数据
const IMMERSIVE_VIDEOS = SHORT_VID_THUMBS.map((thumb, i) => ({
  id: `sv${i}`,
  thumb,
  author: SHORT_VID_NAMES[i],
  avatar: thumb,
  caption: VIDEO_DATA[i % VIDEO_DATA.length].title,
  likes: ["8.2万", "12.5万", "6.8万", "19.3万", "5.4万", "9.7万", "15.1万", "11.2万"][i],
  comments: ["1.2千", "2.3千", "876", "3.5千", "654", "1.8千", "2.9千", "1.4千"][i],
  shares: ["432", "876", "234", "1.2千", "189", "542", "978", "654"][i],
  views: VIDEO_DATA[i % VIDEO_DATA.length].views,
  music: ["私人定制原声", "学院派BGM", "午夜魅惑", "邻家女神主题曲", "黑丝诱惑", "清纯系原声", "白领OL", "夜色撩人"][i],
}));

// ── Utility Components ────────────────────────────────────────────────
function VipBadge() {
  return (
    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-yellow-500 to-amber-400 text-black leading-none">VIP</span>
  );
}
function CoinBadge({ amount }: { amount: number }) {
  return (
    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-orange-500 to-yellow-500 text-white leading-none">{amount}金币</span>
  );
}

function HotWords() {
  const words = ["私人定制系列","学院制服合集","午夜魅惑特辑","邻家女神日常","黑丝诱惑写真","VIP专属内容","AI换脸新作"];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setFade(true); }, 200);
    }, 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="text-muted-foreground text-xs truncate transition-opacity duration-200"
      style={{ opacity: fade ? 1 : 0 }}
    >
      {words[idx]}
    </span>
  );
}

function SectionHeader({ title, onMore }: { title: string; onMore?: () => void }) {
  return (
    <div className="flex items-center justify-between px-3 mb-2">
      <div className="flex items-center gap-1.5">
        <div className="w-0.5 h-3.5 rounded-full bg-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      {onMore && (
        <button onClick={onMore} className="flex items-center gap-0.5 text-xs text-muted-foreground">
          更多<ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ── Ad Grid ────────────────────────────────────────────────────────────
function AdGrid() {
  const rows = [
    AD_LABELS.slice(0, 6), AD_LABELS.slice(6, 12),
    AD_LABELS.slice(12, 18), AD_LABELS.slice(18, 24),
  ];
  const lastRowDbl = [...rows[3], ...rows[3]];
  return (
    <div className="px-3 mb-4">
      {rows.slice(0, 3).map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 gap-x-1 gap-y-2 mb-2">
          {row.map((label, ci) => {
            const color = AD_COLORS[(ri * 6 + ci) % AD_COLORS.length];
            return (
              <button key={ci} className="flex flex-col items-center gap-0.5 active:scale-95 transition-transform">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${color}88, ${color})` }}>
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="text-[8px] text-muted-foreground text-center leading-tight line-clamp-1 w-full">{label}</span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="overflow-hidden">
        <div className="flex gap-1" style={{ animation: "adScrollLeft 22s linear infinite", width: "200%" }}>
          {lastRowDbl.map((label, i) => {
            const color = AD_COLORS[i % AD_COLORS.length];
            return (
              <div key={i} className="flex flex-col items-center gap-0.5" style={{ width: "calc(100% / 12)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${color}88, ${color})` }}>
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="text-[8px] text-muted-foreground text-center leading-tight line-clamp-1 w-full">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Diamond Area (金刚区) ──────────────────────────────────────────────
function DiamondArea({ onOpen }: { onOpen: (id: OverlayId) => void }) {
  const items = [
    { id: "blacktech" as OverlayId, icon: <Cpu className="w-6 h-6" />, label: "黑科技", from: "#7c3aed", to: "#4c1d95", badge: "NEW" },
    { id: "checkin" as OverlayId, icon: <Gift className="w-6 h-6" />, label: "签到", from: "#e8175d", to: "#9d174d", badge: null },
    { id: "live" as OverlayId, icon: <Tv className="w-6 h-6" />, label: "直播", from: "#dc2626", to: "#991b1b", badge: "HOT" },
    { id: "date" as OverlayId, icon: <Calendar className="w-6 h-6" />, label: "约会", from: "#ea580c", to: "#c2410c", badge: null },
  ];

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <>
      <style>{`
        @keyframes diamondFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes diamondPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(232, 23, 93, 0.3); }
          50% { box-shadow: 0 6px 30px rgba(232, 23, 93, 0.6); }
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .diamond-item {
          animation: diamondFloat 3s ease-in-out infinite;
        }

        .diamond-item:nth-child(1) { animation-delay: 0s; }
        .diamond-item:nth-child(2) { animation-delay: 0.2s; }
        .diamond-item:nth-child(3) { animation-delay: 0.4s; }
        .diamond-item:nth-child(4) { animation-delay: 0.6s; }

        .diamond-icon {
          animation: diamondPulse 2s ease-in-out infinite;
        }

        .badge-pulse {
          animation: badgePulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <div className="grid grid-cols-4 gap-2 px-3 mb-4">
        {items.map((item, idx) => (
          <Tilt3DCard key={item.id} className="diamond-item">
            <button
              onClick={() => {
                vibrate(10);
                onOpen(item.id);
              }}
              className="flex flex-col items-center gap-1.5 active:scale-90 transition-all hover:scale-105 w-full"
            >
              <div className="relative">
                <div
                  className="diamond-icon w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
                >
                  {item.icon}
                </div>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 badge-pulse">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-foreground font-medium">{item.label}</span>
            </button>
          </Tilt3DCard>
        ))}
      </div>
    </>
  );
}

// ── Tag Area ──────────────────────────────────────────────────────────
function TagArea() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState("无码");
  const visible = expanded ? TAGS : TAGS.slice(0, 8);
  return (
    <div className="px-3 mb-4">
      <div className="flex flex-wrap gap-2">
        {visible.map(tag => (
          <button
            key={tag}
            onClick={() => setSelected(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selected === tag
                ? "bg-primary text-white shadow-sm"
                : "bg-secondary/60 text-muted-foreground border border-border"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-primary text-xs mt-2">
        {expanded ? <><ChevronUp className="w-3 h-3" />收起</> : <><ChevronDown className="w-3 h-3" />展开查看更多</>}
      </button>
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────
function FilterBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const filters = ["正在看","最新","热门","最热","10分钟+"];
  return (
    <div className="flex items-center gap-4 px-3 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`flex-shrink-0 text-sm font-medium pb-1 border-b-2 transition-colors ${
            value === f ? "text-primary border-primary" : "text-muted-foreground border-transparent"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────
function VideoCard({ video, onClick }: { video: VideoData; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left active:scale-[0.97] transition-transform">
      <div className="relative rounded-xl overflow-hidden bg-muted mb-1.5" style={{ aspectRatio: "3/4" }}>
        <img
          src={`https://images.unsplash.com/photo-${video.thumb}?w=200&h=267&fit=crop&auto=format`}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute top-1.5 left-1.5">
          {video.vip ? <VipBadge /> : video.coins ? <CoinBadge amount={video.coins} /> : null}
        </div>
        <div className="absolute bottom-1.5 right-1.5 bg-black/50 px-1.5 py-0.5 rounded text-[9px] text-white/90">
          {video.duration}
        </div>
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 text-[9px] text-white/70">
          <Eye className="w-2.5 h-2.5" />{video.views}
        </div>
      </div>
      <p className="text-xs text-foreground line-clamp-2 leading-tight">{video.title}</p>
    </button>
  );
}

// ── Home Tab ──────────────────────────────────────────────────────────
const HOME_NAVS: { id: HomeNavId; label: string }[] = [
  { id:"hot", label:"热门推荐" }, { id:"student", label:"学生UN" },
  { id:"cat3", label:"欧美系列" }, { id:"cat4", label:"日韩精品" },
  { id:"cat5", label:"国产精品" }, { id:"cat6", label:"动漫特辑" },
];

function HomeTab({ onOpen, onVideoClick }: { onOpen: (id: OverlayId) => void; onVideoClick: (v: VideoData) => void }) {
  const [nav, setNav] = useState<HomeNavId>("hot");
  const [filter, setFilter] = useState("热门");

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-shrink-0 border-b border-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex min-w-max px-3 gap-5">
          {HOME_NAVS.map(n => (
            <button
              key={n.id}
              onClick={() => setNav(n.id)}
              className={`text-sm py-2.5 border-b-2 transition-colors flex-shrink-0 ${
                nav === n.id ? "text-primary border-primary font-semibold" : "text-muted-foreground border-transparent"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-3" style={{ scrollbarWidth: "none" }}>
        {nav === "hot" && (
          <>
            <AdGrid />
            <DiamondArea onOpen={onOpen} />
            <SectionHeader title="标签分类" />
            <TagArea />
          </>
        )}
        {nav !== "hot" && <AdGrid />}
        {nav === "student" && (
          <div className="px-3 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-2">
              {["制服","JK","学院","清纯","上衣","格裙","白丝","校园"].map(c => (
                <button key={c} className="flex-shrink-0 px-3 py-1 rounded-full bg-card border border-border text-xs text-foreground">{c}</button>
              ))}
            </div>
          </div>
        )}
        {(nav === "cat3" || nav === "cat4" || nav === "cat5" || nav === "cat6") && (
          <div className="flex flex-wrap gap-2 px-3 mb-3">
            {TAGS.slice(0, 8).map(t => (
              <button key={t} className="px-3 py-1 rounded-full bg-secondary/60 text-xs text-muted-foreground border border-border">{t}</button>
            ))}
            <button className="px-3 py-1 rounded-full bg-primary/20 text-xs text-primary border border-primary/30">展开</button>
          </div>
        )}
        <FilterBar value={filter} onChange={setFilter} />
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 px-3">
          {VIDEO_DATA.map(v => <VideoCard key={v.id} video={v} onClick={() => onVideoClick(v)} />)}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Community Tab ─────────────────────────────────────────────────────
const COMM_NAVS: { id: CommunityNavId; label: string }[] = [
  { id:"follow", label:"关注" }, { id:"hot", label:"精品热门" },
  { id:"photo", label:"写真" }, { id:"story", label:"情感" },
];

function PostCard({ post }: { post: PostData }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-card rounded-2xl overflow-hidden mb-3 mx-3 border border-border">
      <div className="flex items-center gap-2.5 p-3 pb-2">
        <img src={`https://images.unsplash.com/photo-${post.avatar}?w=40&h=40&fit=crop&auto=format`} alt={post.name} className="w-9 h-9 rounded-full object-cover border border-primary/30" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{post.name}</p>
          <p className="text-[10px] text-muted-foreground">{post.time}</p>
        </div>
        <button className="px-3 py-1 rounded-full border border-primary text-primary text-xs">关注</button>
      </div>
      <p className="text-sm text-foreground px-3 pb-2 line-clamp-2">{post.title}</p>
      <img src={`https://images.unsplash.com/photo-${post.image}?w=400&h=220&fit=crop&auto=format`} alt={post.title} className="w-full object-cover" style={{ height: 180 }} />
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 text-xs ${liked ? "text-primary" : "text-muted-foreground"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-primary" : ""}`} />{post.likes}
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageCircle className="w-4 h-4" />{post.comments}
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground">
            <Share2 className="w-4 h-4" />分享
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />{post.views}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pb-3">
        {post.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">#{t}</span>)}
      </div>
    </div>
  );
}

function CommunityTab() {
  const [nav, setNav] = useState<CommunityNavId>("hot");
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-shrink-0 border-b border-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex px-3 gap-5 min-w-max">
          {COMM_NAVS.map(n => (
            <button key={n.id} onClick={() => setNav(n.id)} className={`text-sm py-2.5 border-b-2 transition-colors ${nav === n.id ? "text-primary border-primary font-semibold" : "text-muted-foreground border-transparent"}`}>{n.label}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-3" style={{ scrollbarWidth: "none" }}>
        {nav === "follow" ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"><Users className="w-8 h-8 text-muted-foreground/40" /></div>
            <p className="text-sm text-muted-foreground">关注喜欢的用户，查看TA的动态</p>
            <button className="px-5 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm rounded-full font-semibold">去发现</button>
          </div>
        ) : (
          <>
            <div className="mx-3 mb-3 h-20 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">广告位</span>
            </div>
            <div className="mx-3 mb-3 px-3 py-2 bg-card border border-border rounded-xl flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-muted-foreground whitespace-nowrap" style={{ animation: "marquee 14s linear infinite" }}>
                  【公告】平台全新升级，内容更丰富，体验更流畅！每日签到赢积分，兑换VIP会员！
                </p>
              </div>
            </div>
            <div className="mx-3 mb-3">
              <SectionHeader title="热门话题" />
              <div className="grid grid-cols-2 gap-2">
                {["#制服诱惑","#黑丝写真","#JK日常","#深夜福利","#私房相册","#邻家女孩"].map(t => (
                  <Tilt3DCard key={t} intensity={8}>
                    <GradientGlassCard className="rounded-xl px-3 py-2 text-left cursor-pointer hover:scale-105 transition-transform">
                      <span className="text-xs text-primary font-semibold">{t}</span>
                    </GradientGlassCard>
                  </Tilt3DCard>
                ))}
              </div>
            </div>
            {POST_DATA.map(p => <PostCard key={p.id} post={p} />)}
          </>
        )}
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Anime Tab ─────────────────────────────────────────────────────────
function AnimeTab() {
  const [tab, setTab] = useState<AnimeTabId>("anime");
  const tabDefs: { id: AnimeTabId; label: string }[] = [
    { id:"anime", label:"动漫" }, { id:"novel", label:"小说" }, { id:"manga", label:"漫画" },
  ];
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-shrink-0 flex border-b border-border">
        {tabDefs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t.id ? "text-primary border-primary" : "text-muted-foreground border-transparent"}`}>{t.label}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="mx-3 mt-3 mb-2 h-16 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">广告位</span>
        </div>
        <div className="mx-3 mb-3 px-3 py-1.5 bg-card border border-border rounded-xl">
          <p className="text-xs text-muted-foreground">📢 新番上线：《魔都情事》第二季已开播，VIP抢先看！</p>
        </div>

        {tab === "anime" && (
          <>
            <SectionHeader title="精品专题" onMore={() => {}} />
            <div className="grid grid-cols-3 gap-2 px-3 mb-4">
              {ANIME_ITEMS.slice(0, 3).map(a => (
                <button key={a.id} className="text-left active:scale-95 transition-transform">
                  <div className="relative rounded-xl overflow-hidden bg-muted mb-1" style={{ aspectRatio: "2/3" }}>
                    <img src={`https://images.unsplash.com/photo-${a.thumb}?w=120&h=180&fit=crop&auto=format`} alt={a.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1">{a.vip && <VipBadge />}</div>
                    <div className="absolute bottom-1 right-1 text-[9px] text-white/80 bg-black/50 px-1 rounded">{a.episodes}集</div>
                  </div>
                  <p className="text-[11px] text-foreground line-clamp-2 leading-tight">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.views}播放</p>
                </button>
              ))}
            </div>
            <SectionHeader title="全部动漫" onMore={() => {}} />
            <div className="grid grid-cols-3 gap-2 px-3 mb-4">
              {ANIME_ITEMS.map(a => (
                <button key={a.id} className="text-left active:scale-95 transition-transform">
                  <div className="relative rounded-xl overflow-hidden bg-muted mb-1" style={{ aspectRatio: "2/3" }}>
                    <img src={`https://images.unsplash.com/photo-${a.thumb}?w=120&h=180&fit=crop&auto=format`} alt={a.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1">{a.vip && <VipBadge />}</div>
                  </div>
                  <p className="text-[11px] text-foreground line-clamp-2 leading-tight">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.views}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {(tab === "novel" || tab === "manga") && (
          <>
            <div className="grid grid-cols-4 gap-2 px-3 mb-4">
              {["分类","最新","完结","排行榜"].map(item => (
                <button key={item} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b2fc9, #e8175d)" }}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-foreground">{item}</span>
                </button>
              ))}
            </div>
            <SectionHeader title={tab === "novel" ? "精品小说" : "精品漫画"} onMore={() => {}} />
            <div className="grid grid-cols-3 gap-2 px-3 mb-4">
              {NOVELS.map(n => (
                <button key={n.id} className="text-left active:scale-95 transition-transform">
                  <div className="relative rounded-xl overflow-hidden bg-muted mb-1" style={{ aspectRatio: "2/3" }}>
                    <img src={`https://images.unsplash.com/photo-${n.thumb}?w=120&h=180&fit=crop&auto=format`} alt={n.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white/90">{n.status}</div>
                  </div>
                  <p className="text-[11px] text-foreground line-clamp-2 leading-tight">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground">{n.words}</p>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Discovery Tab (沉浸式短视频) ──────────────────────────────────────
function DiscoveryTab() {
  const [view, setView] = useState<"list" | "immersive">("list");
  const [startIndex, setStartIndex] = useState(0);
  const [filter, setFilter] = useState("推荐");

  if (view === "immersive") {
    return (
      <ImmersiveVideoPlayer
        videos={IMMERSIVE_VIDEOS}
        initialIndex={startIndex}
        onClose={() => setView("list")}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-shrink-0 px-4 py-2.5 flex gap-4 border-b border-border">
        {["推荐","最新","最热"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-semibold pb-0.5 border-b-2 transition-colors ${
              filter === f ? "text-primary border-primary" : "text-muted-foreground border-transparent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
        <GradientGlassCard className="mb-4 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">全新沉浸式体验</p>
              <p className="text-[10px] text-muted-foreground">点击任意视频，上下滑动切换，双击点赞，长按加速</p>
            </div>
          </div>
        </GradientGlassCard>

        <div className="grid grid-cols-2 gap-2">
          {SHORT_VID_THUMBS.map((thumb, i) => (
            <button
              key={i}
              onClick={() => {
                setStartIndex(i);
                setView("immersive");
              }}
              className="text-left active:scale-95 transition-transform group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-muted mb-1" style={{ aspectRatio: "9/16" }}>
                <img
                  src={`https://images.unsplash.com/photo-${thumb}?w=180&h=320&fit=crop&auto=format`}
                  alt={SHORT_VID_NAMES[i]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>

                {i < 3 && (
                  <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-1.5 py-0.5">
                    <Flame className="w-2.5 h-2.5 text-white" />
                    <span className="text-[9px] text-white font-bold">HOT</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">
                    @{SHORT_VID_NAMES[i]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[10px]">{SHORT_VID_DURS[i]}</span>
                    <span className="text-white/60 text-[10px] flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" />
                      {VIDEO_DATA[i % VIDEO_DATA.length].views}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────
function ProfileTab({ onShowTutorial }: { onShowTutorial?: () => void }) {
  const menuSections = [
    {
      title: "互动与关系",
      items: [
        { icon: <Bell className="w-4 h-4" />, label: "消息", action: null },
        { icon: <Bookmark className="w-4 h-4" />, label: "我的收藏", action: null },
        { icon: <Film className="w-4 h-4" />, label: "我的购买", action: null },
        { icon: <Users className="w-4 h-4" />, label: "我的关注", action: null },
      ]
    },
    {
      title: "工具与服务",
      items: [
        { icon: <Share2 className="w-4 h-4" />, label: "分享邀请", action: null },
        { icon: <Hand className="w-4 h-4" />, label: "手势教程", action: () => onShowTutorial?.() },
        { icon: <Headphones className="w-4 h-4" />, label: "官方客服", action: null },
        { icon: <Users className="w-4 h-4" />, label: "官方交流群", action: null },
        { icon: <Gift className="w-4 h-4" />, label: "填写邀请码", action: null },
        { icon: <Star className="w-4 h-4" />, label: "填写兑换码", action: null },
        { icon: <Settings className="w-4 h-4" />, label: "设置", action: null },
      ]
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="relative px-5 pt-6 pb-5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-primary/40 shadow-lg" style={{ background: "linear-gradient(135deg, #e8175d, #8b2fc9)" }}>
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <button className="text-foreground font-bold text-base">点击登录 / 注册</button>
            <p className="text-muted-foreground text-xs mt-0.5">登录解锁更多精彩内容</p>
          </div>
        </div>
      </div>
      <div className="mx-3 mb-4 p-4 bg-card rounded-2xl border border-border">
        <div className="grid grid-cols-2 gap-3">
          <Tilt3DCard intensity={10}>
            <GradientGlassCard className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:scale-105 transition-transform">
              <Crown className="w-6 h-6 text-yellow-400" />
              <div className="text-left flex-1">
                <p className="text-[10px] text-muted-foreground">会员充值</p>
                <p className="text-sm font-bold text-foreground">开通VIP</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </GradientGlassCard>
          </Tilt3DCard>
          <Tilt3DCard intensity={10}>
            <GradientGlassCard className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-amber-400" />
              <div className="text-left flex-1">
                <p className="text-[10px] text-muted-foreground">金币充值</p>
                <p className="text-sm font-bold text-foreground">0 金币</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </GradientGlassCard>
          </Tilt3DCard>
        </div>
      </div>
      {menuSections.map(section => (
        <div key={section.title} className="mx-3 mb-3 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border/40">
            <p className="text-[11px] text-muted-foreground font-medium">{section.title}</p>
          </div>
          {section.items.map((item, i) => (
            <button
              key={item.label}
              onClick={() => item.action?.()}
              className={`w-full flex items-center gap-3 px-4 py-3 active:bg-muted/30 transition-colors ${i !== section.items.length - 1 ? "border-b border-border/20" : ""}`}
            >
              <span className="text-primary">{item.icon}</span>
              <span className="text-sm text-foreground flex-1 text-left">{item.label}</span>
              {item.label === "手势教程" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  NEW
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      ))}
      <div className="h-6" />
    </div>
  );
}

// ── Overlay: Search ───────────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [history] = useState(["私人定制","制服诱惑","黑丝写真","午夜特辑","VIP精品"]);
  const hot = ["无码精品","制服系列","国产自拍","黑丝美女","学生妹","主播精选","写真集","欧美系","高清长片","新片速递"];
  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-2 p-3 border-b border-border flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 bg-secondary/60 rounded-full px-4 py-2 border border-border">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索视频、主播、话题..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          {query && <button onClick={() => setQuery("")}><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <button onClick={onClose} className="text-muted-foreground text-sm flex-shrink-0">取消</button>
      </div>
      <div className="flex-1 overflow-y-auto pt-3" style={{ scrollbarWidth: "none" }}>
        <AdGrid />
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">历史记录</span>
            <button className="text-xs text-muted-foreground">清空</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map(h => (
              <button key={h} onClick={() => setQuery(h)} className="px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-foreground">{h}</button>
            ))}
          </div>
        </div>
        <div className="px-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">热搜总榜</span>
          </div>
          {hot.map((h, i) => (
            <button key={h} onClick={() => setQuery(h)} className="w-full flex items-center gap-3 py-2.5 border-b border-border/30">
              <span className={`text-sm font-bold w-6 text-center flex-shrink-0 ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}</span>
              <span className="flex-1 text-sm text-foreground text-left">{h}</span>
              {i < 3 && <Flame className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Overlay: Ranking ──────────────────────────────────────────────────
function RankingOverlay({ onClose }: { onClose: () => void }) {
  const [rankType, setRankType] = useState<"plays"|"sales"|"favorites">("plays");
  const [period, setPeriod] = useState<"day"|"week"|"month"|"all">("week");
  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button onClick={onClose}><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h2 className="text-base font-bold text-foreground flex-1">排行榜</h2>
        <Trophy className="w-5 h-5 text-primary" />
      </div>
      <div className="flex border-b border-border flex-shrink-0">
        {(["plays","sales","favorites"] as const).map((id, i) => (
          <button key={id} onClick={() => setRankType(id)} className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${rankType === id ? "text-primary border-primary" : "text-muted-foreground border-transparent"}`}>
            {["播放榜","畅销榜","收藏榜"][i]}
          </button>
        ))}
      </div>
      <div className="flex gap-2 px-4 py-2.5 border-b border-border flex-shrink-0">
        {(["day","week","month","all"] as const).map((id, i) => (
          <button key={id} onClick={() => setPeriod(id)} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${period === id ? "bg-primary text-white" : "bg-secondary/50 text-muted-foreground"}`}>
            {["日榜","周榜","月榜","总榜"][i]}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {RANKING_PLAYS.map((item, i) => (
          <div key={item.rank} className="flex items-center gap-3 px-4 py-3 border-b border-border/20">
            <span className={`text-base font-black w-6 text-center flex-shrink-0 ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>{item.rank}</span>
            <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <img src={`https://images.unsplash.com/photo-${item.thumb}?w=48&h=64&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Play className="w-3 h-3" />{item.count}</p>
            </div>
            {i < 3 && <Flame className="w-4 h-4 text-primary flex-shrink-0" />}
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Overlay: Video Player ─────────────────────────────────────────────
function VideoPlayerOverlay({ video, onClose }: { video: VideoData; onClose: () => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="absolute inset-0 bg-background z-50 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
        <img src={`https://images.unsplash.com/photo-${video.thumb}?w=400&h=225&fit=crop&auto=format`} alt={video.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          {video.vip ? (
            <div className="text-center px-4">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <p className="text-white text-sm font-bold mb-3">VIP专享内容</p>
              <button className="px-6 py-2 rounded-full font-bold text-sm text-black" style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}>开通VIP观看</button>
            </div>
          ) : video.coins ? (
            <div className="text-center px-4">
              <Zap className="w-12 h-12 text-amber-400 mx-auto mb-2" />
              <p className="text-white text-sm font-bold mb-3">需要 {video.coins} 金币解锁</p>
              <button className="px-6 py-2 rounded-full font-bold text-sm text-white" style={{ background: "linear-gradient(90deg, #f97316, #ef4444)" }}>金币解锁</button>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          )}
        </div>
        <button onClick={onClose} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="p-4">
        <h1 className="text-base font-bold text-foreground mb-2.5">{video.title}</h1>
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{video.duration}</span>
          <div className="ml-auto flex items-center gap-4">
            <button onClick={() => setLiked(!liked)} className={`flex flex-col items-center gap-0.5 ${liked ? "text-primary" : "text-muted-foreground"}`}>
              <ThumbsUp className={`w-5 h-5 ${liked ? "fill-primary" : ""}`} />
              <span className="text-[10px]">点赞</span>
            </button>
            <button onClick={() => setSaved(!saved)} className={`flex flex-col items-center gap-0.5 ${saved ? "text-primary" : "text-muted-foreground"}`}>
              <Bookmark className={`w-5 h-5 ${saved ? "fill-primary" : ""}`} />
              <span className="text-[10px]">收藏</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-muted-foreground">
              <Share2 className="w-5 h-5" />
              <span className="text-[10px]">分享</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 p-3 bg-card rounded-xl border border-border">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <img src={`https://images.unsplash.com/photo-${video.thumb}?w=40&h=40&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">官方认证主播</p>
            <p className="text-xs text-muted-foreground">3.2万 粉丝</p>
          </div>
          <button className="px-3 py-1 rounded-full border border-primary text-primary text-xs font-semibold">关注</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {["无码","精品","高清","长片"].map(t => <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">#{t}</span>)}
        </div>
        <SectionHeader title="推荐视频" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          {VIDEO_DATA.slice(0, 4).map(v => (
            <div key={v.id}>
              <div className="relative rounded-xl overflow-hidden bg-muted mb-1" style={{ aspectRatio: "16/9" }}>
                <img src={`https://images.unsplash.com/photo-${v.thumb}?w=200&h=113&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
                {v.vip && <div className="absolute top-1 left-1"><VipBadge /></div>}
              </div>
              <p className="text-xs text-foreground line-clamp-2">{v.title}</p>
            </div>
          ))}
        </div>
        <SectionHeader title="评论区" />
        {[
          { name:"小白鸽", text:"这内容太顶了，强烈推荐！", time:"10分钟前" },
          { name:"夜猫子", text:"一口气看完，求更新！", time:"23分钟前" },
          { name:"深夜用户", text:"画质非常好，主播超美", time:"1小时前" },
        ].map((c, i) => (
          <div key={i} className="flex gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, #e8175d${["88","60","40"][i]}, #8b2fc9)` }} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">{c.name} <span className="text-muted-foreground font-normal">{c.time}</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Overlay: Check In ─────────────────────────────────────────────────
function CheckInOverlay({ onClose }: { onClose: () => void }) {
  const [checked, setChecked] = useState([true, true, true, false, false, false, false]);
  const days = ["一","二","三","四","五","六","日"];
  const todayIdx = 3;
  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button onClick={onClose}><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h2 className="text-base font-bold text-foreground">每日签到</h2>
      </div>
      <GradientGlassCard className="m-4 p-5 rounded-2xl text-center">
        <p className="text-muted-foreground text-xs mb-1">当前积分</p>
        <p className="text-5xl font-black text-primary" style={{ fontFamily: "'Noto Serif SC', serif" }}>320</p>
        <p className="text-muted-foreground text-xs mt-1">积分可兑换VIP会员</p>
      </GradientGlassCard>
      <GradientGlassCard className="mx-4 mb-4 p-4 rounded-2xl">
        <p className="text-sm font-bold text-foreground mb-3">每周签到区</p>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">周{d}</span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${checked[i] ? "bg-primary border-primary" : i === todayIdx ? "border-primary border-dashed bg-primary/10" : "border-border bg-secondary/30"}`}>
                {checked[i] ? <Check className="w-4 h-4 text-white" /> : <span className="text-[10px] text-muted-foreground">+10</span>}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setChecked(c => c.map((v, i) => i === todayIdx ? true : v))} className="w-full mt-4 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: "linear-gradient(90deg, #e8175d, #8b2fc9)" }}>
          {checked[todayIdx] ? "今日已签到 ✓" : "立即签到 +10积分"}
        </button>
      </GradientGlassCard>
      <GradientGlassCard className="mx-4 mb-4 p-4 rounded-2xl">
        <p className="text-sm font-bold text-foreground mb-3">福利任务区</p>
        {[["每日登录","+5积分",true],["评论/回复","+3积分",false],["邀请新用户","+50积分",false],["每天发帖","+8积分",false]].map(([task, reward, done], i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
            <div className="flex-1">
              <p className="text-sm text-foreground">{task as string}</p>
              <p className="text-xs text-primary font-medium">{reward as string}</p>
            </div>
            <button className={`px-3 py-1 rounded-full text-xs font-semibold ${done ? "bg-muted text-muted-foreground" : "bg-primary text-white"}`}>
              {done ? "已完成" : "去完成"}
            </button>
          </div>
        ))}
      </GradientGlassCard>
      <GradientGlassCard className="mx-4 mb-4 p-4 rounded-2xl">
        <p className="text-sm font-bold text-foreground mb-3">积分兑换区</p>
        {[[100,"VIP 1天","👑"],[200,"VIP 2天","👑"],[500,"VIP 7天","💎"],[1000,"VIP 30天","🔱"]].map(([pts, vip, icon]) => (
          <div key={String(vip)} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
            <span className="text-xl">{icon as string}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">{vip as string}</p>
              <p className="text-xs text-amber-400 font-semibold">{pts as number} 积分</p>
            </div>
            <button className="px-3 py-1 rounded-full border border-primary text-primary text-xs font-semibold">兑换</button>
          </div>
        ))}
      </GradientGlassCard>
      <div className="h-4" />
    </div>
  );
}

// ── Overlay: Black Tech ───────────────────────────────────────────────
function BlackTechOverlay({ onClose }: { onClose: () => void }) {
  const tools = [
    { icon: <Video className="w-6 h-6" />, label:"AI换脸", desc:"智能换脸技术", from:"#7c3aed", to:"#4c1d95" },
    { icon: <Wand2 className="w-6 h-6" />, label:"AI魔法", desc:"神奇变换效果", from:"#e8175d", to:"#9d174d" },
    { icon: <Layers className="w-6 h-6" />, label:"AI脱衣", desc:"虚拟衣物效果", from:"#dc2626", to:"#991b1b" },
    { icon: <Mic className="w-6 h-6" />, label:"AI语音", desc:"声音克隆合成", from:"#ea580c", to:"#c2410c" },
    { icon: <BookOpen className="w-6 h-6" />, label:"AI小说", desc:"智能写作助手", from:"#d97706", to:"#b45309" },
    { icon: <ImageIcon className="w-6 h-6" />, label:"图生图", desc:"图像转换生成", from:"#16a34a", to:"#166534" },
    { icon: <Brush className="w-6 h-6" />, label:"AI绘画", desc:"艺术画作生成", from:"#0284c7", to:"#075985" },
    { icon: <Film className="w-6 h-6" />, label:"视频换脸", desc:"视频人脸替换", from:"#6d28d9", to:"#4c1d95" },
  ];
  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button onClick={onClose}><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h2 className="text-base font-bold text-foreground flex-1">黑科技</h2>
        <Zap className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "none" }}>
        <p className="text-xs text-muted-foreground mb-4 text-center">AI驱动顶尖技术，体验前所未有的创意变换</p>
        <div className="grid grid-cols-2 gap-3">
          {tools.map(tool => (
            <button key={tool.label} className="p-4 bg-card rounded-2xl border border-border text-left active:scale-95 transition-transform">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg" style={{ background: `linear-gradient(135deg, ${tool.from}, ${tool.to})` }}>
                {tool.icon}
              </div>
              <p className="text-sm font-bold text-foreground mb-0.5">{tool.label}</p>
              <p className="text-xs text-muted-foreground mb-2">{tool.desc}</p>
              <div className="flex items-center gap-0.5 text-primary text-xs font-semibold">
                进入体验<ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Overlay: Live ─────────────────────────────────────────────────────
function LiveOverlay({ onClose }: { onClose: () => void }) {
  const [liveNav, setLiveNav] = useState("热门推荐");
  const navs = ["热门推荐","中文","乌克兰女主播","才艺表演","互动直播"];
  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button onClick={onClose}><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h2 className="text-base font-bold text-foreground flex-1">直播频道</h2>
        <div className="flex items-center gap-1 text-xs text-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: "pulse 1.5s infinite" }} />
          8个直播中
        </div>
      </div>
      <div className="flex-shrink-0 border-b border-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex px-3 gap-4 min-w-max">
          {navs.map(n => (
            <button key={n} onClick={() => setLiveNav(n)} className={`text-sm py-2.5 border-b-2 flex-shrink-0 transition-colors ${liveNav === n ? "text-primary border-primary font-semibold" : "text-muted-foreground border-transparent"}`}>{n}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
        <div className="mb-3 h-16 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">广告位</span>
        </div>
        <SectionHeader title="推荐专题" onMore={() => {}} />
        <div className="grid grid-cols-2 gap-2 mb-4">
          {LIVE_ROOMS.slice(0, 4).map(room => (
            <button key={room.id} className="relative rounded-2xl overflow-hidden active:scale-95 transition-transform">
              <img src={`https://images.unsplash.com/photo-${room.thumb}?w=200&h=140&fit=crop&auto=format`} alt={room.name} className="w-full object-cover" style={{ height: 120 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 bg-red-600/90">
                <div className="w-1 h-1 rounded-full bg-white" style={{ animation: "pulse 1s infinite" }} />
                <span className="text-[9px] text-white font-medium">直播中</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold">{room.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Eye className="w-2.5 h-2.5 text-white/70" />
                  <span className="text-[10px] text-white/70">{room.online}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/70 text-white ml-auto">{room.tag}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <SectionHeader title="全部直播" />
        <div className="grid grid-cols-2 gap-2">
          {LIVE_ROOMS.map(room => (
            <button key={room.id} className="relative rounded-2xl overflow-hidden active:scale-95 transition-transform">
              <img src={`https://images.unsplash.com/photo-${room.thumb}?w=200&h=140&fit=crop&auto=format`} alt={room.name} className="w-full object-cover" style={{ height: 110 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 bg-red-600/90">
                <div className="w-1 h-1 rounded-full bg-white" />
                <span className="text-[9px] text-white font-medium">直播中</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold">{room.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Eye className="w-2.5 h-2.5 text-white/70" />
                  <span className="text-[10px] text-white/70">{room.online}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/70 text-white ml-auto">{room.tag}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ── Overlay: Date ─────────────────────────────────────────────────────
function DateOverlay({ onClose }: { onClose: () => void }) {
  const [filters, setFilters] = useState<Record<string, string>>({ 地区:"全部", 年龄:"全部", 罩杯:"全部", 身高:"全部", 口味:"全部", 项目:"全部" });
  const filterOpts: Record<string, string[]> = {
    地区: ["全部","北京","上海","广州","深圳","杭州","成都","其他"],
    年龄: ["全部","18-22","23-27","28-32","33+"],
    罩杯: ["全部","A","B","C","D","E+"],
    身高: ["全部","150-155","156-160","161-165","166-170","170+"],
    口味: ["全部","清纯型","御姐型","萝莉型","成熟型","辣妹型"],
    项目: ["全部","聊天","视频","见面","约会","定制"],
  };
  const girls = [
    { name:"小甜心", age:22, tags:["C罩杯","162cm","上海"], thumb:"1529626455594-4ff0802cfb7e", online:true },
    { name:"妍妍", age:24, tags:["D罩杯","168cm","北京"], thumb:"1488426862026-3ee34a7d66df", online:true },
    { name:"Cherry", age:20, tags:["B罩杯","158cm","广州"], thumb:"1570295999919-56ceb5ecca61", online:false },
    { name:"娜娜", age:26, tags:["E罩杯","165cm","深圳"], thumb:"1524504388940-b1c1722653e8", online:true },
    { name:"小鹿", age:21, tags:["C罩杯","160cm","杭州"], thumb:"1502823403499-6ccfcf4fb453", online:true },
    { name:"薇薇", age:25, tags:["D罩杯","170cm","成都"], thumb:"1438761681033-6461ffad8d80", online:false },
  ];
  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button onClick={onClose}><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h2 className="text-base font-bold text-foreground flex-1">约会</h2>
        <Heart className="w-5 h-5 text-primary fill-primary" />
      </div>
      <div className="flex-shrink-0 p-3 border-b border-border">
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(filterOpts).map(([key, options]) => (
            <div key={key} className="relative">
              <select value={filters[key]} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))} className="w-full bg-secondary/60 border border-border rounded-xl px-2 py-1.5 text-[11px] text-foreground appearance-none" style={{ colorScheme: "dark" }}>
                {options.map(o => <option key={o} value={o}>{key}: {o}</option>)}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3">
          {girls.map(g => (
            <button key={g.name} className="bg-card rounded-2xl overflow-hidden border border-border active:scale-95 transition-transform text-left">
              <div className="relative aspect-square">
                <img src={`https://images.unsplash.com/photo-${g.thumb}?w=200&h=200&fit=crop&auto=format`} alt={g.name} className="w-full h-full object-cover" />
                {g.online && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600/90 rounded-full px-1.5 py-0.5">
                    <div className="w-1 h-1 rounded-full bg-white" style={{ animation: "pulse 1.5s infinite" }} />
                    <span className="text-[9px] text-white font-semibold">在线</span>
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-foreground">{g.name}</span>
                  <span className="text-xs text-muted-foreground">{g.age}岁</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {g.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>)}
                </div>
                <div className="w-full py-1.5 rounded-xl text-white text-xs font-bold text-center" style={{ background: "linear-gradient(90deg, #e8175d, #8b2fc9)" }}>联系她</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App Header ────────────────────────────────────────────────────────
function AppHeader({ onSearch, onRanking }: { onSearch: () => void; onRanking: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0 border-b border-border">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #e8175d, #8b2fc9)" }}>
          <span className="text-[9px] font-black text-white">91</span>
        </div>
        <span className="text-sm font-black text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>鬼父</span>
      </div>
      <button onClick={onSearch} className="flex-1 flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1.5 border border-border/70 min-w-0">
        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 overflow-hidden text-left"><HotWords /></div>
      </button>
      <button onClick={onRanking} className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/50 border border-border/70 flex items-center justify-center">
        <Trophy className="w-4 h-4 text-primary" />
      </button>
    </div>
  );
}

// ── Bottom Tab Bar ────────────────────────────────────────────────────
function BottomTabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string; icon: (active: boolean) => JSX.Element }[] = [
    { id:"home", label:"首页", icon: a => <Home className={`w-5 h-5 ${a ? "fill-primary text-primary" : ""}`} /> },
    { id:"community", label:"社区", icon: a => <Users className={`w-5 h-5 ${a ? "text-primary" : ""}`} /> },
    { id:"anime", label:"二次元", icon: a => <Star className={`w-5 h-5 ${a ? "fill-primary text-primary" : ""}`} /> },
    { id:"discovery", label:"发现", icon: a => <Compass className={`w-5 h-5 ${a ? "text-primary" : ""}`} /> },
    { id:"profile", label:"我的", icon: a => <User className={`w-5 h-5 ${a ? "text-primary" : ""}`} /> },
  ];
  return (
    <div className="flex-shrink-0 border-t border-border backdrop-blur-sm" style={{ background: "rgba(22, 13, 30, 0.95)" }}>
      <div className="flex">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onChange(tab.id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${active === tab.id ? "text-primary" : "text-muted-foreground"}`}>
            {tab.icon(active === tab.id)}
            <span className={`text-[9px] font-semibold ${active === tab.id ? "text-primary" : "text-muted-foreground"}`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [overlay, setOverlay] = useState<OverlayId | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [showTutorial, setShowTutorial] = useState(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenGestureTutorial");
    return !hasSeenTutorial;
  });

  const handleVideoClick = (v: VideoData) => {
    setSelectedVideo(v);
    setOverlay("videoPlayer");
  };
  const closeOverlay = () => { setOverlay(null); setSelectedVideo(null); };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hasSeenGestureTutorial", "true");
  };

  return (
    <>
      <style>{`
        @keyframes adScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
      <div
        className="relative flex flex-col bg-background text-foreground overflow-hidden"
        style={{
          width: "390px",
          height: "844px",
          maxWidth: "100vw",
          maxHeight: "100dvh",
          margin: "0 auto",
          fontFamily: "'Noto Sans SC', sans-serif",
        }}
      >
        {/* 流体渐变背景 */}
        <FluidBackground />

        {/* 鼠标跟随光效 */}
        <MouseLightEffect />

        {/* Header — hidden on discovery video mode full-screen handled internally */}
        {activeTab !== "discovery" && (
          <AppHeader onSearch={() => setOverlay("search")} onRanking={() => setOverlay("ranking")} />
        )}

        {/* Page content */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {activeTab === "home" && <HomeTab onOpen={id => setOverlay(id)} onVideoClick={handleVideoClick} />}
          {activeTab === "community" && <CommunityTab />}
          {activeTab === "anime" && <AnimeTab />}
          {activeTab === "discovery" && <DiscoveryTab />}
          {activeTab === "profile" && <ProfileTab onShowTutorial={() => setShowTutorial(true)} />}
        </div>

        {/* Bottom nav */}
        <BottomTabBar active={activeTab} onChange={setActiveTab} />

        {/* Overlays */}
        {overlay === "search" && <SearchOverlay onClose={closeOverlay} />}
        {overlay === "ranking" && <RankingOverlay onClose={closeOverlay} />}
        {overlay === "videoPlayer" && selectedVideo && <VideoPlayerOverlay video={selectedVideo} onClose={closeOverlay} />}
        {overlay === "checkin" && <CheckInOverlay onClose={closeOverlay} />}
        {overlay === "blacktech" && <BlackTechOverlay onClose={closeOverlay} />}
        {overlay === "live" && <LiveOverlay onClose={closeOverlay} />}
        {overlay === "date" && <DateOverlay onClose={closeOverlay} />}

        {/* 手势教程 */}
        {showTutorial && <GestureTutorial onClose={handleCloseTutorial} />}
      </div>
    </>
  );
}
