import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Target,
  Clock,
  Swords,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Trophy,
  ScrollText,
  Landmark,
  ShieldCheck,
  Vote,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

interface Bet {
  id: string;
  title: string;
  description: string;
  proposedBy: 'ODELL' | 'Marty';
  against: 'ODELL' | 'Marty';
  amount: string;
  odds: string;
  oddsExplainer: string;
  deadline: string;
  deadlineDate: Date;
  status: 'active' | 'settled';
  winner?: 'ODELL' | 'Marty';
  /** Sats collected by the winner (for settled bets) */
  satsWon?: number;
  icon: typeof Flame;
}

function formatSats(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toString();
}

const BETS: Bet[] = [
  // ── Active bets ──
  {
    id: 'iran-ceasefire',
    title: 'Iran Ceasefire',
    description: '5 days of ceasefire in Iran by April 21',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '2:1',
    oddsExplainer: 'Marty wins 200k if ceasefire happens, loses 100k if not',
    deadline: 'April 21, 2026 23:59 UTC',
    deadlineDate: new Date('2026-04-21T23:59:00Z'),
    status: 'active',
    icon: Target,
  },
  {
    id: 'btc-ath-gold-silver',
    title: 'BTC ATH in Gold & Silver',
    description: 'Bitcoin hits new all-time highs priced in gold and silver by end of 2026',
    proposedBy: 'ODELL',
    against: 'Marty',
    amount: '100,000 sats',
    odds: '2:1',
    oddsExplainer: 'ODELL wins 200k if BTC hits ATH in both, loses 100k if not',
    deadline: 'December 31, 2026 23:59 UTC',
    deadlineDate: new Date('2026-12-31T23:59:00Z'),
    status: 'active',
    icon: TrendingUp,
  },
  // ── Settled bets ──
  {
    id: 'mempool-clear',
    title: 'Mempools Clear Before Halving',
    description: 'Marty bets mempools will clear before the next halving',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '1,000,000 sats',
    odds: 'Even',
    oddsExplainer: 'Marty won 1M sats',
    deadline: 'Next halving',
    deadlineDate: new Date('2024-04-20'),
    status: 'settled',
    winner: 'Marty',
    satsWon: 1_000_000,
    icon: HardDrive,
  },
  {
    id: 'bitbonds',
    title: 'US Gov Issues BitBonds',
    description: 'Marty bets the US government will issue BitBonds by end of 2025',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '2:1',
    oddsExplainer: 'ODELL won 100k sats',
    deadline: 'End of 2025',
    deadlineDate: new Date('2025-12-31'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 100_000,
    icon: Landmark,
  },
  {
    id: 'tether-hack',
    title: 'Tether Gets Hacked BTC Back',
    description: 'Marty bets Tether gets their hacked bitcoin back by July 16',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '200,000 sats',
    odds: '2:1',
    oddsExplainer: 'ODELL won 200k sats',
    deadline: 'July 16, 2025',
    deadlineDate: new Date('2025-07-16'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 200_000,
    icon: ShieldCheck,
  },
  {
    id: 'sbr-bill',
    title: 'Strategic Bitcoin Reserve Bill Signed',
    description: 'Marty bets a strategic bitcoin reserve bill is signed by June 15, 2025',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '200,000 sats',
    odds: 'Even',
    oddsExplainer: 'ODELL won 200k sats',
    deadline: 'June 15, 2025',
    deadlineDate: new Date('2025-06-15'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 200_000,
    icon: ScrollText,
  },
  {
    id: 'election-cancelled',
    title: 'Election Won\'t Happen',
    description: 'Marty bets the election won\'t happen',
    proposedBy: 'Marty',
    against: 'ODELL',
    amount: '100,000 sats',
    odds: '10:1',
    oddsExplainer: 'ODELL won 100k sats',
    deadline: 'Election Day 2024',
    deadlineDate: new Date('2024-11-05'),
    status: 'settled',
    winner: 'ODELL',
    satsWon: 100_000,
    icon: Vote,
  },
];

function getTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    const remainingMonths = Math.floor((days - years * 365) / 30);
    return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
  }
  if (months > 0) return `${months}mo ${days % 30}d`;
  if (days > 0) return `${days}d`;
  return '<1d';
}

function getUrgencyColor(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 14) return 'text-red-400';
  if (days <= 60) return 'text-amber-400';
  return 'text-emerald-400';
}

function ActiveBetCard({ bet }: { bet: Bet }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = bet.icon;
  const timeRemaining = getTimeRemaining(bet.deadlineDate);
  const urgencyColor = getUrgencyColor(bet.deadlineDate);

  return (
    <Card
      className="group relative border-amber-500/15 bg-card/40 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-all duration-300" />

      <CardContent className="p-4 sm:p-5">
        {/* Main row */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors duration-300">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                {bet.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-xs border-amber-500/20 bg-amber-500/5 text-amber-400 font-semibold px-2 py-0.5"
                >
                  <Zap className="w-2.5 h-2.5 mr-0.5" />
                  {bet.amount}
                </Badge>
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2">
              {bet.description}
            </p>

            {/* Matchup & Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/80">
              <span className="flex items-center gap-1">
                <Swords className="w-3 h-3 text-amber-500/60" />
                <span className="font-semibold text-amber-400">{bet.proposedBy}</span>
                <span className="text-muted-foreground/40">vs</span>
                <span className="font-semibold text-foreground/80">{bet.against}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${urgencyColor}`} />
                <span className={urgencyColor}>{timeRemaining}</span>
              </span>
              <span className="text-muted-foreground/60">
                {bet.odds} odds
              </span>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-amber-500/10 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                <span className="text-muted-foreground/60 block mb-0.5">Deadline</span>
                <span className="font-semibold text-foreground/90">{bet.deadline}</span>
              </div>
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                <span className="text-muted-foreground/60 block mb-0.5">Odds</span>
                <span className="font-semibold text-foreground/90">{bet.odds} ({bet.proposedBy})</span>
              </div>
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10 sm:col-span-1">
                <span className="text-muted-foreground/60 block mb-0.5">Payout</span>
                <span className="font-semibold text-foreground/90">{bet.oddsExplainer}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SettledBetCard({ bet }: { bet: Bet }) {
  const Icon = bet.icon;
  const winnerIsOdell = bet.winner === 'ODELL';

  return (
    <Card className="group relative border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/60">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-muted-foreground/60" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-xs sm:text-sm text-foreground/80 leading-tight truncate">
                {bet.title}
              </h3>
              <Badge
                variant="outline"
                className="text-[9px] sm:text-[10px] border-muted-foreground/15 bg-muted/30 text-muted-foreground/60 font-medium px-1.5 py-0 flex-shrink-0"
              >
                {bet.amount}
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground/50 leading-snug truncate">
              {bet.description}
            </p>
          </div>

          {/* Winner badge */}
          <div className="flex-shrink-0">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
              winnerIsOdell
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <Trophy className="w-2.5 h-2.5" />
              {bet.winner}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BetTracker() {
  const [showSettled, setShowSettled] = useState(false);
  const activeBets = BETS.filter((b) => b.status === 'active');
  const settledBets = BETS.filter((b) => b.status === 'settled');

  const odellWins = settledBets.filter((b) => b.winner === 'ODELL').length;
  const martyWins = settledBets.filter((b) => b.winner === 'Marty').length;
  const odellSatsWon = settledBets.filter((b) => b.winner === 'ODELL').reduce((sum, b) => sum + (b.satsWon ?? 0), 0);
  const martySatsWon = settledBets.filter((b) => b.winner === 'Marty').reduce((sum, b) => sum + (b.satsWon ?? 0), 0);

  return (
    <section className="relative py-10 sm:py-14 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(245,158,11,0.04),transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            <Flame className="w-4 h-4" />
            Live Bet Tracker
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">ODELL</span>
            <span className="text-foreground"> vs </span>
            <span className="gradient-text">Marty</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Active bets between the hosts — settled on air, paid in sats.
          </p>
        </div>

        {/* Performance scoreboard */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {/* ODELL stats */}
            <div className="relative rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <p className="text-xs text-muted-foreground/60 mb-1 uppercase tracking-wider font-medium">ODELL</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 leading-none mb-1">
                {odellWins}<span className="text-base sm:text-lg font-bold text-amber-400/60">W</span>
              </p>
              <p className="text-xs text-muted-foreground/50">
                <Zap className="w-3 h-3 inline -mt-0.5 text-amber-400/50" /> {formatSats(odellSatsWon)} won
              </p>
            </div>

            {/* Marty stats */}
            <div className="relative rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <p className="text-xs text-muted-foreground/60 mb-1 uppercase tracking-wider font-medium">Marty</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none mb-1">
                {martyWins}<span className="text-base sm:text-lg font-bold text-emerald-400/60">W</span>
              </p>
              <p className="text-xs text-muted-foreground/50">
                <Zap className="w-3 h-3 inline -mt-0.5 text-emerald-400/50" /> {formatSats(martySatsWon)} won
              </p>
            </div>
          </div>
        </div>

        {/* Active bet cards */}
        <div className="space-y-3">
          {activeBets.map((bet) => (
            <ActiveBetCard key={bet.id} bet={bet} />
          ))}
        </div>

        {/* Total stake */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">200k</span> sats at stake
            </span>
          </div>
        </div>

        {/* Settled bets section */}
        <div className="mt-10">
          <button
            onClick={() => setShowSettled(!showSettled)}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground/80 transition-colors duration-200 group/toggle cursor-pointer"
          >
            <div className="h-px flex-1 max-w-[80px] bg-border/50" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-card/30 hover:bg-card/60 transition-all duration-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">Past Bets</span>
              <span className="text-xs text-muted-foreground/50">({settledBets.length})</span>
              {showSettled ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/40" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />
              )}
            </div>
            <div className="h-px flex-1 max-w-[80px] bg-border/50" />
          </button>

          {showSettled && (
            <div className="mt-4 space-y-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
              {/* Record */}
              <div className="flex items-center justify-center gap-4 mb-3 text-xs text-muted-foreground/60">
                <span>
                  ODELL: <span className="font-bold text-amber-400">{odellWins}W</span>
                </span>
                <span className="text-muted-foreground/20">|</span>
                <span>
                  Marty: <span className="font-bold text-emerald-400">{martyWins}W</span>
                </span>
              </div>

              {settledBets.map((bet) => (
                <SettledBetCard key={bet.id} bet={bet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
