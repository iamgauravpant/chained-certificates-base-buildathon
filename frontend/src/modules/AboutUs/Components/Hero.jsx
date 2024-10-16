import { Divider, Typography } from "antd";
const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <>
      <Title>About Us</Title>
      <Paragraph style={{ fontSize: "16px" }}>
        At ChainedCertificates, we’re on a mission to transform the way
        educational and professional credentials are issued, stored, and
        verified. In today’s digital world, ensuring the trust and security of
        certificates has never been more important. We aim to make this process
        simple, transparent, and, most importantly, secure through blockchain
        technology.
      </Paragraph>
      <Divider />
      <Title>Why We Exist</Title>
      <Paragraph style={{ fontSize: "16px" }}>
        The traditional process of issuing and verifying certificates is filled
        with challenges. Lost documents, fraudulent claims, and slow
        verification processes create headaches for everyone involved—whether
        you're an institution, an employer, or a certificate holder. We’ve
        experienced these frustrations firsthand, which is why we built
        ChainedCertificates—to offer a smarter, more reliable way to handle
        credentials.
      </Paragraph>
      <Divider />

      <Title>What We Offer</Title>
      <Paragraph style={{ fontSize: "16px" }}>
        ChainedCertificates provides a platform powered by blockchain that makes
        managing certificates effortless and secure. Every certificate issued
        through our platform is permanently recorded, ensuring it can never be
        tampered with or altered. Whether you’re an educational institution, a
        business, or an individual certificate holder, our platform is designed
        to be intuitive and scalable, so managing credentials becomes
        stress-free.
      </Paragraph>
      <Divider />

      <Title>Our Vision</Title>
      <Paragraph style={{ fontSize: "16px" }}>
        We envision a world where certificate fraud is a thing of the past, and
        verifying credentials is as simple as clicking a button. By using the
        latest technology, our platform is built to handle large-scale needs
        while maintaining performance and security. No matter where you are in
        the world, your credentials will be safe, accessible, and verifiable in
        seconds.
      </Paragraph>
    </>
  );
};

export default Hero;
