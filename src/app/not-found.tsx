// Note: PageNotFound screen...!

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Group, Text, Title } from '@mantine/core';
import Illustration from './404/Illustration';
import classes from './404/not-found.module.css';
import { customStyles } from '@/styles/custom-theme';
import { routes } from '@/constants/routes';

const PageNotFound = () => {

  // Note: Handeling router here...!
  const router = useRouter();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>
            Nothing to see here
          </Title>
          <Text
            size={customStyles.deviceSize.lg}
            ta={customStyles.alignment.center}
            className={classes.description}
          >
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Group justify={customStyles.alignment.center}>
            <Button
              size={customStyles.deviceSize.md}
              style={{ backgroundColor: customStyles.colors._408CCE }}
              onClick={() => router.push(routes.root)}
            >
              Take me back to Home Page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};

export default PageNotFound;