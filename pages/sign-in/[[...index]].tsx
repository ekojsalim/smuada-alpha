import { Center } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <Center h="100vh">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </Center>
);

export default SignInPage;
