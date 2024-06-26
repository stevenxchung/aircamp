import { GoogleMap, MarkerF } from "@react-google-maps/api";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { type ReactNode } from "react";
import { Container } from "react-bootstrap";
import { BsLightningChargeFill, BsStarFill, BsStars } from "react-icons/bs";
import { FaCampground } from "react-icons/fa";
import CustomNavbar from "~/components/navbar";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const GoogleMapView = (props: { lat: number; lng: number }) => (
  <div>
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "500px",
      }}
      center={{ lat: props.lat, lng: props.lng }}
      zoom={10}
    >
      <MarkerF position={{ lat: props.lat, lng: props.lng }} />
    </GoogleMap>
  </div>
);

const RowTextElement = (props: { text: string }) => (
  <div className="pt-3">
    <p>{props.text}</p>
  </div>
);

const RowListElement: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <li className="flex items-center space-x-2">{children}</li>;
};

const Campground: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.campgrounds.getByPostId.useQuery({
    id,
  });

  const imageUrl = data?.imageSource || "";

  if (!data) return <div>404</div>;

  const iconSize = 25;

  return (
    <>
      <Head>
        <title>{data.location}</title>
      </Head>
      <CustomNavbar />
      <main className="flex flex-col items-center">
        <Container className="my-10 px-4">
          <h1>Stay at {data.name}</h1>
          <p>{data.location}</p>
          <div className="my-4 w-full overflow-hidden rounded-lg text-white">
            <Image src={imageUrl} alt="Image" width={1500} height={1500} />
          </div>
          <div className="space-y-4 divide-y">
            <div className="flex flex-row items-center">
              <h4>
                Grounds hosted by {data.owner ? data.owner.firstName : ""}
              </h4>
              <Image
                src={data.owner ? (data.owner.avatar as string) : ""}
                alt={`${
                  data.owner ? data.owner.firstName : "Unknown"
                }'s profile picture`}
                width={64}
                height={64}
                className="ml-2 rounded-full border-4"
              />
            </div>
            <div>
              <ul className="list-group flex flex-col space-y-6 py-4">
                <RowListElement>
                  <BsStars size={iconSize} />
                  <strong>Rare find</strong>
                </RowListElement>
                <RowListElement>
                  <BsStarFill size={iconSize} />
                  <strong>Most saved by campers</strong>
                </RowListElement>
                <RowListElement>
                  <BsLightningChargeFill size={iconSize} />
                  <strong>Usually books out fast</strong>
                </RowListElement>
                <RowListElement>
                  <FaCampground size={iconSize} />
                  <strong>Dedicated campgrounds</strong>
                </RowListElement>
              </ul>
            </div>
            <RowTextElement text={data.summary} />
            <div className="flex flex-col space-y-2 py-4">
              <h4>Location</h4>
              <GoogleMapView lat={data.lat} lng={data.lng} />
              <div className="mt-4">
                <strong>{`${data.name} - ${data.location}`}</strong>
              </div>
              <RowTextElement text={data.description} />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No ID!");

  await ssg.campgrounds.getByPostId.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Campground;
