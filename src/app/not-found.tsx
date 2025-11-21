// Note: PageNotFound screen...!

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Text, Center } from '@mantine/core';
import nextDynamic from 'next/dynamic';
import { customStyles } from '@/styles/custom-theme';
import { routes } from '@/constants/routes';

// Dynamically import Lottie to prevent SSR issues
const Lottie = nextDynamic(() => import('lottie-react'), { ssr: false });

const PageNotFound = () => {
  // Note: Handeling router here...!
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);

  // Note: This hook will run only once when the component mounts...!
  useEffect(() => {
    // Dynamically import the animation data on client side only
    import("../assets/lottie/not-found-animation.json").then((data) => {
      setAnimationData(data.default);
    });

    setTimeout(() => {
      router.push(routes.putAwayOrder);
    }, 2000);
  }, [router]);

  return (
    <Center
      style={{
        flexDirection: customStyles.elementDirection.column,
        paddingTop: "8%",
        paddingRight: "15%"
      }}
    >
      <Container style={{ textAlign: customStyles.alignment.center }}>
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            style={{
              width: 400,
              height: 400
            }}
          />
        )}
        <Text
          size={customStyles.deviceSize.xl}
          style={{ fontWeight: 600 }}
          mt={customStyles.deviceSize.lg}
        >
          Oops! The page you're looking for could not be found.
        </Text>
      </Container>
    </Center>
  );
};

export default PageNotFound;