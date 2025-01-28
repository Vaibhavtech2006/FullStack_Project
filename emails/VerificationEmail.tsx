import React from 'react';
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
  verificationUrl: string;
  isVerified: boolean;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp, verificationUrl, isVerified }) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial"
          webFontUrl="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        />
      </Head>
      <Preview>{isVerified ? "Your email is verified" : "Verify your email address"}</Preview>
      <Section style={{ padding: '20px', backgroundColor: '#f4f4f7', fontFamily: 'Roboto, Arial, sans-serif' }}>
        <Heading style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
          Welcome to Our Platform, {username}!
        </Heading>
        {isVerified ? (
          <Text style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
            Your email has been successfully verified. Thank you for completing the process!
          </Text>
        ) : (
          <>
            <Text style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
              Thank you for signing up. To get started, please verify your email address using the OTP below:
            </Text>
            <Text
              style={{
                fontSize: '24px',
                color: '#007bff',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              {otp}
            </Text>
            <Text style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
              Alternatively, you can verify your email by clicking the button below:
            </Text>
            <Row style={{ justifyContent: 'center', marginBottom: '20px' }}>
              <Button
                href={verificationUrl}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                Verify Email
              </Button>
            </Row>
          </>
        )}
        <Text style={{ fontSize: '14px', color: '#888' }}>
          If you did not sign up for our platform, please ignore this email.
        </Text>
        <Text style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
          Best Regards,
          <br />
          The Team
        </Text>
      </Section>
    </Html>
  );
};

export default VerificationEmail;
