import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
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
  const delayInSeconds = 0.5;

  return (
    <>
      <Head>
        <title>Campgrounds</title>
      </Head>
      <CustomNavbar />
      <main className="flex flex-col items-center">
        <Container className="my-10 px-4">
          <div className="h-96 rounded-lg bg-black bg-jumbotron bg-cover bg-center object-cover py-4 pl-8 text-white">
            <h1 className="delay-250 animate-fade-in-medium">
              Experience nature
            </h1>
            {useTimeout(delayInSeconds) && (
              <h5 className="animate-fade-in-medium pt-2 delay-2000">
                View our campgrounds from all over the world.
              </h5>
            )}
          </div>
        </Container>
        {useTimeout(delayInSeconds) && (
          <Container className="flex animate-fade-in-medium flex-wrap">
            {campgrounds ? (
              campgrounds.map((campground, i) => (
                <div key={i} className="w-full sm:w-1/2 lg:w-1/4">
                  <Link
                    href={{
                      pathname: `/campground/${campground.id}`,
                      query: { imageIndex: `0${i + 1}` },
                    }}
                    className="text-indigo-600 no-underline"
                  >
                    <Container key={i}>
                      <Image
                        key={i}
                        src={`/campgrounds/0${i + 1}.jpg`}
                        alt={campground.name}
                        className="h-52 rounded-lg object-cover"
                        width={500}
                        height={500}
                      />
                      <p className="mb-0 mt-2.5 font-bold ">
                        {campground.location}
                      </p>
                      <div className="text-slate-500">
                        <p className="mb-0">Stay at {campground.name}</p>
                        <p className="mb-1.5">{getRandomDateRange()}</p>
                      </div>
                      <p>
                        <strong>
                          $
                          {Math.round(
                            parseInt(campground.price) *
                              getRandomNumber(0.5, 1.5)
                          )}
                        </strong>
                        /night
                      </p>
                    </Container>
                  </Link>
                </div>
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
