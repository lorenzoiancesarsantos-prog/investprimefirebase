
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChartLine, ShieldCheck, PieChart, Lock, Scale, Users, Star, Quote, ArrowRight, Library, GitBranch, Waypoints, HandCoins, Globe } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '../logo';
import { usePathname } from 'next/navigation';

export function LandingPage({ dict, lang }: { dict: any, lang: string }) {
  const pathname = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {dict.header.features}
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {dict.header.howItWorks}
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {dict.header.testimonials}
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {dict.header.faq}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                <Link href={redirectedPathName('pt')} className={lang === 'pt' ? 'text-primary font-bold' : ''}>PT</Link>
                 | 
                <Link href={redirectedPathName('en')} className={lang === 'en' ? 'text-primary font-bold' : ''}>EN</Link>
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href={`/${lang}/login`}>{dict.header.login}</Link>
            </Button>
            <Button asChild>
              <Link href={`/${lang}/signup`}>{dict.header.signUp} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative border-b py-20 md:py-32 lg:py-40">
           <div aria-hidden="true" className="absolute inset-0 top-[-20rem] -z-10 transform-gpu overflow-hidden blur-3xl" >
            <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/50 to-primary/20 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" ></div>
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline"
                    dangerouslySetInnerHTML={{ __html: dict.hero.title }}
                >
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  {dict.hero.subtitle}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#how-it-works">{dict.hero.cta1}</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#faq">{dict.hero.cta2}</Link>
                  </Button>
                </div>
                 <p className="text-xs text-muted-foreground">
                  {dict.hero.disclaimer}
                </p>
              </div>
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem>
                      <Card className="overflow-hidden">
                        <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-card to-accent">
                          <div className="text-center">
                            <ChartLine className="mx-auto h-16 w-16 text-primary" />
                            <h3 className="mt-4 text-2xl font-semibold">{dict.hero.carousel.slide1.title}</h3>
                            <p className="mt-2 text-muted-foreground">{dict.hero.carousel.slide1.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                    <CarouselItem>
                      <Card>
                        <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-card to-accent">
                          <div className="text-center">
                            <ShieldCheck className="mx-auto h-16 w-16 text-primary" />
                            <h3 className="mt-4 text-2xl font-semibold">{dict.hero.carousel.slide2.title}</h3>
                            <p className="mt-2 text-muted-foreground">{dict.hero.carousel.slide2.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{dict.features.title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.features.subtitle}
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Lock className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4">{dict.features.items.securitization.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  {dict.features.items.securitization.description}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <PieChart className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4">{dict.features.items.diversification.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  {dict.features.items.diversification.description}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4">{dict.features.items.risk.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  {dict.features.items.risk.description}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Scale className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4">{dict.features.items.compliance.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  {dict.features.items.compliance.description}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{dict.howItWorks.title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.howItWorks.subtitle}
              </p>
            </div>
            <div className="relative mt-16">
              <div className="absolute left-1/2 top-4 hidden h-full w-px bg-border/50 lg:block" />
              <div className="grid gap-12 lg:grid-cols-3">
                <div className="relative flex flex-col items-center text-center">
                  <div className="absolute -top-1 left-1/2 hidden -translate-x-1/2 lg:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-4 text-primary lg:mt-12">
                    <Library className="h-10 w-10" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{dict.howItWorks.steps.origination.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {dict.howItWorks.steps.origination.description}
                  </p>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="absolute -top-1 left-1/2 hidden -translate-x-1/2 lg:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-4 text-primary lg:mt-12">
                    <GitBranch className="h-10 w-10" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{dict.howItWorks.steps.structuring.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {dict.howItWorks.steps.structuring.description}
                  </p>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="absolute -top-1 left-1/2 hidden -translate-x-1/2 lg:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-4 text-primary lg:mt-12">
                    <Waypoints className="h-10 w-10" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{dict.howItWorks.steps.distribution.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {dict.howItWorks.steps.distribution.description}
                  </p>
                </div>
              </div>
            </div>
             <div className="mt-16 text-center">
              <Button size="lg" asChild>
                <Link href={`/${lang}/signup`}>{dict.howItWorks.cta}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{dict.testimonials.title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.testimonials.subtitle}
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {dict.testimonials.reviews.map((review: any, index: number) => (
                 <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <Star className="h-5 w-5 fill-primary text-primary" />
                            <Star className="h-5 w-5 fill-primary text-primary" />
                            <Star className="h-5 w-5 fill-primary text-primary" />
                            <Star className="h-5 w-5 fill-primary text-primary" />
                            <Star className="h-5 w-5 fill-primary text-primary" />
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground">
                        {review.quote}
                      </blockquote>
                      <div className="flex items-center gap-4">
                        <Image src={`https://picsum.photos/seed/${index + 1}/40/40`} width={40} height={40} alt={review.name} className="rounded-full" data-ai-hint="person" />
                        <div>
                          <p className="font-semibold text-foreground">{review.name}</p>
                          <p className="text-sm text-muted-foreground">{review.age}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                {dict.faq.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.faq.subtitle}
              </p>
            </div>
            <div className="mt-12 mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {dict.faq.questions.map((q: any, index: number) => (
                  <AccordionItem value={`item-${index + 1}`} key={index}>
                    <AccordionTrigger>{q.question}</AccordionTrigger>
                    <AccordionContent>{q.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">{dict.footer.tagline}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.links.title}</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">{dict.footer.links.features}</Link>
                </li>
                <li>
                   <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">{dict.footer.links.howItWorks}</Link>
                </li>
                 <li>
                   <Link href={`/${lang}/terms`} className="text-sm text-muted-foreground hover:text-primary">{dict.footer.links.terms}</Link>
                </li>
                 <li>
                   <Link href="#" className="text-sm text-muted-foreground hover:text-primary">{dict.footer.links.privacy}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.contact.title}</h3>
              <ul className="mt-4 space-y-2">
                 <li className="text-sm text-muted-foreground">{dict.footer.contact.email}</li>
                 <li className="text-sm text-muted-foreground">{dict.footer.contact.phone}</li>
              </ul>
            </div>
             <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{dict.footer.newsletter.title}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{dict.footer.newsletter.subtitle}</p>
              <form className="mt-4 flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder={dict.footer.newsletter.placeholder} />
                <Button type="submit">{dict.footer.newsletter.subscribe}</Button>
              </form>
            </div>
          </div>
           <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {dict.footer.copyright}</p>
            <p className="mt-2 text-xs">
              {dict.footer.disclaimer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

    
