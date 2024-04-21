import { useLoadScript } from "@react-google-maps/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { LoadingPage } from "~/components/loading";
import { env } from "~/env.mjs";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const LIBRARIES = ["places"];

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GEOCODER,
    libraries: LIBRARIES as (
      | "drawing"
      | "geometry"
      | "localContext"
      | "places"
      | "visualization"
    )[],
  });

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <LoadingPage />;

  return (
    <SessionProvider session={session}>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
