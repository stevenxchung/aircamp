import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "~/components/navbar";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const session = await getSession();
      if (!session) {
        void router.replace("/campgrounds"); // Redirect to the login page
      }
    };

    void checkAuthentication();
  });

  const { name, email, image, id } = router.query;
  const imageUrl = image ? image.toString() : "/favicon.ico";
  const userId = id as string;
  const { data } = api.campgrounds.getByUserId.useQuery({
    id: userId,
  });

  if (!data) return <div>404</div>;

  console.log(data);

  return (
    <>
      <Head>
        <title>{name}&apos;s Profile</title>
      </Head>
      <CustomNavbar />
      <main>
        <Container className="my-10 flex flex-col">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <h1>{name}</h1>
              <Image
                src={imageUrl}
                alt={`{name}'s avatar`}
                className="h-64 w-64 rounded-lg object-cover"
                width={250}
                height={250}
              />
              <p>Email: {email}</p>
              <p>ID: {id}</p>
            </div>
            <h1>Campgrounds</h1>
            <div className="flex flex-wrap">
              {data ? (
                data.map((campground, i) => (
                  <div key={i} className="sm:w-1/2 sm:px-4 sm:py-4">
                    <Link
                      href={{
                        pathname: `/campground/${campground.id}`,
                        query: { imageIndex: `0${i + 1}` },
                      }}
                      className="text-indigo-600 no-underline"
                    >
                      <div key={i}>
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
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-4xl">Campgrounds</p>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export default Profile;
