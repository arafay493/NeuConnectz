// Note: PageNotFound screen...!

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Text, Center } from '@mantine/core';
import Lottie from 'lottie-react';
import NotFoundAnimation from "../../public/lottie/Not-Found-Animation.json";
import { customStyles } from '@/styles/custom-theme';
import { routes } from '@/constants/routes';

const PageNotFound = () => {

  // Note: Handeling router here...!
  const router = useRouter();

  // Note: This hook will run only once when the component mounts...!
  useEffect(() => {
    setTimeout(() => {
      router.push(routes.root);
    }, 3000);
  }, []);

  return (
    <Center
      style={{
        flexDirection: customStyles.elementDirection.column,
        paddingTop: "8%",
        paddingRight: "15%"
      }}
    >
      <Container style={{ textAlign: customStyles.alignment.center }}>
        <Lottie
          animationData={NotFoundAnimation}
          loop={true}
          style={{
            width: 400,
            height: 400
          }}
        />
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