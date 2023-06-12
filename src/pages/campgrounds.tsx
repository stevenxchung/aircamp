import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "~/components/navbar";
import { api } from "~/utils/api";

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDateRange = () => {
  const randomNumber = getRandomNumber(5, 20);
  const currentDate = new Date();
  const nDaysLater = new Date(
    currentDate.getTime() + randomNumber * 24 * 60 * 60 * 1000
  );
  const options = { month: "short", day: "numeric" };
  const formattedStartDate = currentDate.toLocaleDateString("en-US", options);
  const formattedEndDate = nDaysLater.toLocaleDateString("en-US", options);

  return `${formattedStartDate} - ${formattedEndDate}`;
};

const useTimeout = (delayInSeconds: number) => {
  const [showElement, setShowElement] = useState(false);
  const milliseconds = delayInSeconds * 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElement(true);
    }, milliseconds);

    return () => clearTimeout(timer);
  }, [milliseconds]);

  return showElement;
};

const Campgrounds: NextPage = () => {
  const campgrounds = api.campgrounds.getAll.useQuery().data;

  return (
    <>
      <Head>
        <title>Campgrounds</title>
      </Head>
      <CustomNavbar />
      <main className="flex flex-col items-center">
        <Container className="my-10 px-4">
          <div className="h-96 rounded-md bg-black bg-jumbotron bg-cover bg-center object-cover py-4 pl-8 text-white">
            <h1 className="animate-fade-in-medium delay-1000">
              Experience nature
            </h1>
            {useTimeout(1) && (
              <h5 className="delay-3000 animate-fade-in-medium pt-2">
                View our campgrounds from all over the world.
              </h5>
            )}
          </div>
        </Container>
        {useTimeout(2) && (
          <Container className="flex animate-fade-in-medium flex-row">
            {campgrounds ? (
              campgrounds.map((campground, i) => (
                <Container key={i}>
                  <Image
                    key={i}
                    src={campground.image}
                    alt={campground.name}
                    className="h-52 rounded-md object-cover"
                    width={500}
                    height={500}
                  />
                  <p className="mb-0 mt-2.5 font-bold">{campground.location}</p>
                  <p className="mb-0">Stay at {campground.name}</p>
                  <p className="mb-1.5">{getRandomDateRange()}</p>
                  <p>
                    <strong>{campground.price}</strong>/night
                  </p>
                </Container>
              ))
            ) : (
              <p className="text-4xl">Campgrounds</p>
            )}
          </Container>
        )}
      </main>
    </>
  );
};

export default Campgrounds;
