"use client";
import React from "react";
import {
  Connector,
  StarknetConfig,
  alchemyProvider,
} from "@starknet-react/core";
import { mainnet } from "@starknet-react/chains";

export function StarknetProvider({
  connectors,
  children,
}: {
  connectors: Connector[];
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_RPC_API_KEY!;
  const providers = [alchemyProvider({ apiKey })];
  return (
    <StarknetConfig
      connectors={connectors}
      autoConnect
      providers={providers}
      chains={[mainnet]}
    >
      {children}
    </StarknetConfig>
  );
}
