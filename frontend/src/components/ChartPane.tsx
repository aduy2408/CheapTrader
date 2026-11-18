import { useCallback, useMemo, useRef } from "react";
import { Chart } from "./Chart";
import { ChartBoundary } from "./ChartBoundary";
import { useChartData } from "../lib/useChartData";
import { useLiveFeed } from "../lib/useLiveFeed";
import { foldTicks } from "../lib/liveBar";
import { TF } from "../lib/timeframes";
import type { ChartAppearance } from "../lib/appearance";
import type { ChartGeometry, ViewHint } from "../lib/chart";
import type { Bar, Timeframe } from "../lib/types";
import type { StreamState } from "../lib/ws";

interface Props {
  symbol: string | null;
  timeframe: Timeframe;
  barCount: number;
  appearance: ChartAppearance;
  active?: boolean;
  onActivate?: () => void;
  onGeometry?: (geometry: ChartGeometry) => void;
  onState?: (state: StreamState) => void;
  onError?: (message: string) => void;
}

/** One independent market series. Shell overlays stay in App; this owns only candle loading/live ticks. */
export function ChartPane({
  symbol,
  timeframe,
  barCount,
  appearance,
  active = false,
  onActivate,
  onGeometry,
  onState,
  onError,
}: Props) {
  const viewHintRef = useRef<(() => ViewHint | null) | null>(null);
  const { frame, loading, loadOlder, syncTail } = useChartData({
    symbol,
    timeframe,
    barCount,
    enabled: !!symbol,
    readView: () => viewHintRef.current?.() ?? null,
    onError: (message) => onError?.(message),
  });
  const live = useLiveFeed({
    symbol,
    enabled: !!symbol,
    onState: (state) => onState?.(state),
    onReconnect: syncTail,
  });
  const frameKey = `${frame.symbol}|${frame.timeframe}`;
  const liveRef = useRef<{ key: string; bar: Bar | null }>({ key: "", bar: null });
  const liveBar = useMemo(() => {
    if (!live.tick || !frame.bars.length || frame.symbol !== symbol) return null;
    const previous = liveRef.current.key === frameKey ? liveRef.current.bar : null;
    const next = foldTicks(previous, frame.bars, live.ticks.length ? live.ticks : [live.tick], TF[frame.timeframe].seconds);
    liveRef.current = { key: frameKey, bar: next };
    return next;
  }, [frame.bars, frame.symbol, frame.timeframe, frameKey, live.tick, live.ticks, symbol]);
  const onHistoryNeeded = useCallback(() => void loadOlder(), [loadOlder]);

  return (
    <div className={`tv-chart-pane${active ? " is-active" : ""}`} onPointerDown={onActivate}>
      <ChartBoundary>
        {(generation) => (
          <Chart
            key={generation}
            bars={frame.bars}
            liveBar={liveBar}
            priceLines={[]}
            indicatorPlots={[]}
            appearance={appearance}
            symbol={frame.symbol ?? undefined}
            timeframe={TF[frame.timeframe].legend}
            barSeconds={TF[frame.timeframe].seconds}
            view={frame.view}
            loading={loading}
            viewHintRef={viewHintRef}
            onGeometry={onGeometry}
            onHistoryNeeded={onHistoryNeeded}
          />
        )}
      </ChartBoundary>
    </div>
  );
}
