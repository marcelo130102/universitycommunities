import { Box } from "@mui/material";
import Head from "next/head";
import { ReactNode, FC } from "react";

interface BasicContainerProps {
  children: ReactNode;
  titlePage: string;
}

const BasicContainer: FC<BasicContainerProps> = ({ children, titlePage }) => {
  return (
    <>
      <Head>
        <title>{titlePage}</title>
        <meta name="description" content={titlePage} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          bgcolor: '#20252c',
          color: 'text.primary',
          padding: 4,
          minHeight: '100vh', // Asegurarse de que ocupe al menos toda la altura de la ventana
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {children}
      </Box></>
  );
};

export default BasicContainer;