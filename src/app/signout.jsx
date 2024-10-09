// src/app/signout.jsx

'use client';

import React from 'react';
import { logOut } from '../lib/auth';

const SignOut = () => {
  const handleSignOut = async () => {
    await logOut();
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
