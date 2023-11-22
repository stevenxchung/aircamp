import { useLoadScript } from "@react-google-maps/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { env } from "~/env.mjs";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const LIBRARIES = ["places"];

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GEOCODER,
    libraries: LIBRARIES as (
      | "drawing"
      | "geometry"
      | "localContext"
      | "places"
      | "visualization"
    )[],
  });

  return (
    <SessionProvider session={session}>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
