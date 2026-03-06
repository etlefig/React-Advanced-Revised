import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const toaster = {
  create: ({
    title,
    description,
    type = "info",
    duration = 3000,
    closable = true,
  } = {}) =>
    toast({
      title,
      description,
      status: type,
      duration,
      isClosable: closable,
      position: "top",
    }),
};

export const Toaster = () => null;