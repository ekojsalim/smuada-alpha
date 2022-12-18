import { Center } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <Center h="100vh">
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
  </Center>
);

export default SignUpPage;
