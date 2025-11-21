// Note: App Screen (I will design and develop this screen later)

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/constants/routes';

const App = () => {

  // Note: handle router here...!
  const router = useRouter();

  // Note: This hook will run when this component mounts...!
  useEffect(() => {
    router.push(routes.putAwayOrder);
  }, []);

  return (
    <div></div>
  );
};

export default App;