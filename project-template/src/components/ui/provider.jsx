import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "./toaster";

export function Provider({ children }) {
  return (
    <ChakraProvider>
      {children}
      <Toaster />
    </ChakraProvider>
  );
}