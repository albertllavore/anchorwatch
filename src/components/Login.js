import React, { useState } from 'react';
import {
  getAuth,
  signInWithPopup,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
} from 'firebase/auth';
import '../styles/Login.css';
import googleIcon from '../assets/google-icon.svg';
import openInNew from '../assets/open-in-new.svg';
import EmailSent from './EmailSent';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendSignInLink = () => {
    const actionCodeSettings = {
      url: process.env.REACT_APP_SIGN_IN_URL || 'http://localhost:3000/login',
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        setIsEmailSent(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      {isEmailSent ? (
        <EmailSent resendEmail={sendSignInLink} />
      ) : (
        <>
          <div className="login-form">
            <header>
              <h2>LOG IN TO YOUR ACCOUNT</h2>
            </header>
            <p>Enter your AnchorWatch registered email</p>
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <button className="send-email-link" onClick={sendSignInLink}>
              Send Sign-In Link
            </button>
            <h4>OR</h4>
            <button onClick={signInWithGoogle}>
              <img src={googleIcon} alt="Google Sign-In" />
            </button>
            <div className="help-link">
              <button className="help-button">
                Need Help?
                <img src={openInNew} alt="Help Icon" className="help-icon" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
