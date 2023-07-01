import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "~/components/navbar";

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

  return (
    <>
      <Head>
        <title>`${name}&apos;s` Profile</title>
      </Head>
      <CustomNavbar />
      <main>
        <Container className="flex flex-col items-center py-4">
          <h1>{name}</h1>
          <Image
            src={imageUrl}
            alt={`{name}'s avatar`}
            className="mb-4 h-64 rounded-lg object-cover"
            width={300}
            height={300}
          />
          <p>Email: {email}</p>
          <p>ID: {id}</p>
        </Container>
      </main>
    </>
  );
};

export default Profile;
