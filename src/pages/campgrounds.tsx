import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const campgrounds = api.campgrounds.getAll.useQuery().data;
  const delayInSeconds = 0.5;

  const navigateToCreatePage = () => {
    void router.push("/create");
  };

  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Campgrounds</title>
      </Head>
      <CustomNavbar />
      <main className="flex flex-col items-center">
        <Container className="my-10 px-4">
          <div className="h-96 rounded-lg bg-black bg-jumbotron bg-cover bg-center object-cover py-4 pl-8 text-white">
            <h1 className="delay-250 mt-2 animate-fade-in-medium">
              Experience nature
            </h1>

            {useTimeout(delayInSeconds) && (
              <h5 className="animate-fade-in-medium pt-2 delay-2000">
                View our campgrounds from all over the world.
              </h5>
            )}

            {useTimeout(0.75) && (
              <button
                className="mt-12 animate-fade-in-medium rounded border-green-600 bg-green-400 px-4 py-2 font-semibold text-gray-800 shadow hover:bg-green-200"
                onClick={navigateToCreatePage}
              >
                Add Campground
              </button>
            )}
          </div>
        </Container>
        <Container className="flex flex-wrap">
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
                      src={
                        campground.imageSource
                          ? campground.imageSource
                          : `/campgrounds/0${i + 1}.jpg`
                      }
                      alt={campground.name}
                      width={500}
                      height={500}
                      className={`h-52 rounded-lg bg-gray-200 object-cover ${
                        isLoading ? "animate-pulse" : ""
                      }`}
                      onLoad={(event) => setIsLoading(false)}
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
                          parseInt(campground.price) * getRandomNumber(0.5, 1.5)
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
      </main>
    </>
  );
};

export default Campgrounds;
