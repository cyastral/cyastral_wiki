import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    output: "standalone",
    serverExternalPackages: [
    '@prisma/client', 
    '@prisma/adapter-d1'
  ],
    /* config options here */
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();