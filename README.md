![Logo](https://chained-certificates.netlify.app/assets/logo-h4Vsy-ha.png)

# ChainedCertificates
ChainedCertificates is a Certificate Management System based on blockchain technology. It allows users to issue and verify certificates on the blockchain, ensuring authenticity and transparency.

## Website 
https://chained-certificates.netlify.app

## Demo Video

https://www.youtube.com/watch?v=rczax0mgBg8

## Screenshots
![cover-image](https://github.com/user-attachments/assets/12b99cae-f58c-421c-999f-237fdae40641)

![certificate-issuer-dashboard](https://github.com/user-attachments/assets/5e36f8b6-f8ca-4591-b094-ec774c6ac191)

![certificate-generation-tool](https://github.com/user-attachments/assets/766ee549-91a2-480a-bceb-64d37e04a73b)

![verify-certificate-pre](https://github.com/user-attachments/assets/9d4f5812-1fad-48e6-9f2a-3c90ba062f5a)

![verify-certificate-post](https://github.com/user-attachments/assets/7cc94748-d9c2-4426-911d-2dd69964a91f)

## Features

- Issue blockchain-based certificates
- Mint Certificate NFTs and attest them
- Smooth verification of certificates using the blockchain


## Tech Stack

**Client:** React, Redux Toolkit

**Server:** Node, Express

**Database:** MongoDB (for application related data)

**Blockchain:** Base Sepolia (support for other EVM chains coming soon)

**Certificates Storage:** IPFS (Pinata)

## Authors

- [@iamgauravpant](https://github.com/iamgauravpant)


## Acknowledgements

This project builds upon the [Certificate Generator](https://github.com/vedant-jain03/certificate-generator/) by [@vedant-jain03](https://github.com/vedant-jain03), which served as the foundation for further development.

## Run Locally

Clone the project

```bash
  git clone https://github.com/iamgauravpant/chained-certificates-base-buildathon
```

Go to the frontend directory

```bash
  cd frontend
```

Install frontend dependencies

```bash
  npm install
```

Follow instructions in .env.sample file to get your api keys, create a .env file in this directory and add all those to it.


Then, start the frontend server

```bash
  npm run dev
```


Go to the backend directory

```bash
  cd backend
```

Install frontend dependencies

```bash
  npm install
```

Follow instructions in .env.sample file to get your api keys, create a .env file in this directory and add all those to it.


Then, start the backend server

```bash
  npm run dev
```
