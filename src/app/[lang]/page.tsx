import { LandingPage } from "@/components/landing/landing-page";
import { getDictionary } from "../dictionaries";

export default async function Home({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);
  return <LandingPage dict={dict} lang={params.lang} />;
}
