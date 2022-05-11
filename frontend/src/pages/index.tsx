import {
    Link as ChakraLink,
    Text,
    Code,
    List,
    ListIcon,
    ListItem,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
    <Container height='100vh'>
        <NavBar />
        <Hero />
        <Main>
            <Text>
                Example repository of <Code>Next.js</Code> +{" "}
                <Code>chakra-ui</Code> + <Code>TypeScript</Code>.
            </Text>

            <List spacing={3} my={0}>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color='green.500' />
                    <ChakraLink
                        isExternal
                        href='https://chakra-ui.com'
                        flexGrow={1}
                        mr={2}>
                        Chakra UI <LinkIcon />
                    </ChakraLink>
                </ListItem>
                <ListItem>
                    <ListIcon as={CheckCircleIcon} color='green.500' />
                    <ChakraLink
                        isExternal
                        href='https://nextjs.org'
                        flexGrow={1}
                        mr={2}>
                        Next.js <LinkIcon />
                    </ChakraLink>
                </ListItem>
            </List>
        </Main>

        <DarkModeSwitch />
        <Footer>
            <Text>Next ❤️ Chakra</Text>
        </Footer>
        <CTA />
    </Container>
);

//Add ssr if doing queries and if it is important to SEO,
//you might want to use a custom loader instead of ssr in some cases
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
