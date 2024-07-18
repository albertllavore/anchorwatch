import React, { useState, useEffect } from 'react';
import '../styles/EmailSent.css';
import emailSentIcon from '../assets/email.svg';
import timer from '../assets/timer.svg';

const EmailSent = ({ resendEmail }) => {
  const [seconds, setSeconds] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [seconds]);

  const handleResendClick = () => {
    setSeconds(30);
    setIsResendDisabled(true);
    resendEmail();
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-text">
        <h2>LOG IN TO YOUR ACCOUNT</h2>
        <p>
          Check your inbox for a sign-in link, which is valid for 10 minutes. If
          you don't receive it in 30 seconds, press resend to receive another
          link.
        </p>
        <div className="resend-container">
          <button onClick={handleResendClick} disabled={isResendDisabled}>
            Resend
          </button>
          <div className="countdown-container">
            {seconds > 0 && (
              <img src={timer} alt="Countdown Timer" className="timer-icon" />
            )}
            <span className="countdown-timer">
              {seconds > 0 ? `${seconds} seconds` : ''}
            </span>
          </div>
        </div>
      </div>
      <div className="confirmation-image">
        <img src={emailSentIcon} alt="Email Sent" />
      </div>
    </div>
  );
};

export default EmailSent;
