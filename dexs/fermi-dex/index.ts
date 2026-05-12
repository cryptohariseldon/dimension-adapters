import { FetchOptions, FetchResultVolume, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { httpGet } from "../../utils/fetchURL";

const VOLUME_ENDPOINT =
  process.env.FERMI_DEX_VOLUME_API || "https://v1.fermi.trade/api/volume";

const fetch = async (options: FetchOptions): Promise<FetchResultVolume> => {
  const response = await httpGet(VOLUME_ENDPOINT, {
    params: {
      start_timestamp: options.startTimestamp,
      end_timestamp: options.endTimestamp,
    },
  });

  return {
    dailyVolume: Number(response.volume_in_quote_units ?? response.dailyVolume ?? 0),
  };
};

const adapter: SimpleAdapter = {
  version: 2,
  chains: [CHAIN.SOLANA],
  start: "2026-05-03",
  fetch,
  methodology: {
    Volume:
      "Perpetual volume is served by Fermi's monitoring API, which aggregates on-chain perp fills from the SOL-PERP, ETH-PERP, and BTC-PERP markets and returns USDC quote notional for the requested window. Optional verification data is available on the same API surface by adding query params to /api/volume, for example https://v1.fermi.trade/api/volume?start_timestamp=1778457600&end_timestamp=1778544000&trace=summary or https://v1.fermi.trade/api/volume?start_timestamp=1778457600&end_timestamp=1778544000&trace=1&tx_signature=required. Rows with tx_signature can be sample checked through any Solana RPC with getTransaction(signature) to confirm the transaction exists on-chain.",
  },
};

export default adapter;
