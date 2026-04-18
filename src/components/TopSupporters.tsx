import { type NostrMetadata, NSchema as n } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { useTopSupporters } from '@/hooks/useTopSupporters';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { nip19 } from 'nostr-tools';
import { cn } from '@/lib/utils';

const PRIMARY_PROFILE_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.ditto.pub',
];

const FALLBACK_PROFILE_RELAYS = [
  'wss://purplepag.es',
  'wss://relay.nostr.band',
  'wss://antiprimal.net',
];

const DEFAULT_AVATAR = 'https://blossom.ditto.pub/62ead074d0d5a7d1b707b101f7d0db62af97bd66843f4f28c7a1d9007e1e6960.jpeg';

function useSupporterProfile(pubkey: string) {
  const { nostr } = useNostr();

  return useQuery<{ metadata?: NostrMetadata }>({
    queryKey: ['supporter-profile', pubkey],
    queryFn: async () => {
      // 1. Query the primary user relays first
      const primaryGroup = nostr.group(PRIMARY_PROFILE_RELAYS);
      const [event] = await primaryGroup.query(
        [{ kinds: [0], authors: [pubkey], limit: 1 }],
        { signal: AbortSignal.timeout(3000) },
      );

      if (event) {
        try {
          const metadata = n.json().pipe(n.metadata()).parse(event.content);
          return { metadata };
        } catch {
          return {};
        }
      }

      // 2. Fallback to directory relays if no profile is found
      const extraGroup = nostr.group(FALLBACK_PROFILE_RELAYS);
      try {
        const [extra] = await extraGroup.query(
          [{ kinds: [0], authors: [pubkey], limit: 1 }],
          { signal: AbortSignal.timeout(4000) },
        );
        if (extra) {
          try {
            const metadata = n.json().pipe(n.metadata()).parse(extra.content);
            return { metadata };
          } catch {
            return {};
          }
        }
      } catch {
        // Extra relays unreachable
      }

      return {};
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

function SupporterAvatar({ pubkey, totalSats, rank }: { pubkey: string; totalSats: number; rank: number }) {
  const profile = useSupporterProfile(pubkey);
  const metadata = profile.data?.metadata;
  const npub = nip19.npubEncode(pubkey);
  const displayName = metadata?.display_name || metadata?.name || npub.slice(0, 12) + '...';

  return (
    <a
      href={`https://primal.net/p/${npub}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1 group shrink-0"
      title={`${displayName} — ${totalSats.toLocaleString('en-US')} sats`}
    >
      <div className="relative">
        <Avatar className={cn(
          'ring-1 transition-transform group-hover:scale-[1.08]',
          rank === 0 ? 'h-9 w-9 ring-[hsl(var(--accent))]/60' :
          rank <= 2 ? 'h-8 w-8 ring-[hsl(var(--accent))]/30' :
          'h-7 w-7 ring-border',
        )}>
          <AvatarImage src={metadata?.picture || DEFAULT_AVATAR} alt={displayName} />
          <AvatarFallback>
            <img src={DEFAULT_AVATAR} alt={displayName} className="h-full w-full object-cover" />
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-[9px] tabular-nums text-muted-foreground/60 group-hover:text-foreground transition-colors">
        {totalSats >= 1000 ? `${Math.round(totalSats / 1000)}k` : totalSats}
      </span>
    </a>
  );
}

export function TopSupporters() {
  const { data: supporters, isLoading } = useTopSupporters(10);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
          Top Supporters
        </span>
        <div className="flex items-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 shrink-0">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-2 w-5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!supporters || supporters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
        Top Supporters
      </span>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 px-0.5 max-w-full">
        {supporters.map((supporter, index) => (
          <SupporterAvatar
            key={supporter.pubkey}
            pubkey={supporter.pubkey}
            totalSats={supporter.totalSats}
            rank={index}
          />
        ))}
      </div>
    </div>
  );
}
