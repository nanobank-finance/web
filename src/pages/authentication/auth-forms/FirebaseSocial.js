// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';

// assets
import Google from 'assets/images/icons/google.svg';
import Twitter from 'assets/images/icons/twitter.svg';
import Github from 'assets/images/icons/github.svg';

// firebase
import { getAppAuth } from 'utils/firebase';
import {
    getAuth,
    getRedirectResult,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider
} from 'firebase/auth';

// react
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const error_message = {
    'auth/email-already-in-use': 'Email already in use',
    'auth/invalid-email': 'Error: Invalid Email',
    'auth/wrong-password': 'Incorrect password',
    'auth/rejected-credential': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts',
    'auth/unverified-email': 'Please verify your email',
    'auth/weak-password': 'Your password must be at least 6 characters, containing letters and numbers'
};

const FirebaseSocial = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider();
    const githubProvider = new GithubAuthProvider();

    googleProvider.setCustomParameters({
        prompt: 'select_account'
    });

    twitterProvider.setCustomParameters({
        prompt: 'select_account'
    });

    githubProvider.setCustomParameters({
        prompt: 'select_account'
    });

    const auth = getAppAuth();

    const handleLoginSuccess = async (result) => {
        // Get idToken
        const idToken = await result.user.getIdToken(true);

        // Get uid
        const uid = result.user.uid;

        // Save user information to sessionStorage
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('uid', uid);

        // Redirect to check page to check if user is onboarded yet
        navigate('/check');
    };

    const handleLoginFailure = (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorMessage);
        console.log(errorCode);
        // TODO: lock account after too many failed attempts?
        alert(`Error: ${error.message || 'An error occurred!'}`);
    };

    const googleHandler = async () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => handleLoginSuccess(result, googleProvider))
            .catch(handleLoginFailure);
    };

    const twitterHandler = async () => {
        signInWithPopup(auth, twitterProvider)
            .then((result) => handleLoginSuccess(result, twitterProvider))
            .catch(handleLoginFailure);
    };

    const githubHandler = async () => {
        signInWithPopup(auth, githubProvider)
            .then((result) => handleLoginSuccess(result, githubProvider))
            .catch(handleLoginFailure);
    };

    return (
        <Stack
            direction="row"
            spacing={matchDownSM ? 1 : 2}
            justifyContent={matchDownSM ? 'space-around' : 'space-between'}
            sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
        >
            <Button
                variant="outlined"
                color="secondary"
                fullWidth={!matchDownSM}
                startIcon={<img src={Google} alt="Google" />}
                onClick={googleHandler}
            >
                {!matchDownSM && 'Google'}
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                fullWidth={!matchDownSM}
                startIcon={<img src={Twitter} alt="Twitter" />}
                onClick={twitterHandler}
            >
                {!matchDownSM && 'Twitter'}
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                fullWidth={!matchDownSM}
                startIcon={<img src={Github} alt="Github" />}
                onClick={githubHandler}
            >
                {!matchDownSM && 'Github'}
            </Button>
        </Stack>
    );
};

export default FirebaseSocial;
