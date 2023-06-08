import type { NextPage } from "next";
import Head from "next/head";

const Campgrounds: NextPage = () => {
  return (
    <>
      <Head>
        <title>Campgrounds</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-4xl">Campgrounds</h1>
      </main>
    </>
  );
};

export default Campgrounds;
