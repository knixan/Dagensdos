"use client";

import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '../Buttons/toggle-theme-button';
import ClientOnly from '@/components/ClientOnly';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import authClient, { useSession } from '@/lib/auth-client';

const navigation: { name: string; href: string }[] = [
	{ name: 'Senaste', href: '#' },
	{ name: 'Inrikes', href: '#' },
	{ name: 'Världen', href: '#' },
	{ name: 'Ekonomi', href: '#' },
	{ name: 'Sport', href: '#' },
	{ name: 'Väder', href: '#' },
];

export function Navbar(): React.ReactElement {
 	const router = useRouter();
 	const { data: session } = useSession();
 	const isAuthenticated = !!session?.user;

 	async function handleLogout() {
 		await authClient.signOut();
 		// refresh so UI updates
 		router.refresh();
 		router.push('/');
 	}

	return (
		<>
			   {/* Sign-in and profile removed from top of navbar as requested */}

			<header className="bg-card shadow-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
						{/* Logo och Titel-sektion */}
						<Link href="/" className="flex items-center space-x-3">
							<div className="flex flex-col">
								<h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dagens Dos</h1>
								<p className="text-sm italic text-muted-foreground mt-1">Sanningen gör ont, här får du en bedövning.</p>
							</div>
						</Link>

						{/* Huvudnavigering (Desktop) */}
						<nav className="hidden md:flex space-x-8">
							{navigation.map((item) => (
								<Link key={item.name} href={item.href} className="whitespace-nowrap text-base font-medium text-muted-foreground hover:text-primary">
									{item.name}
								</Link>
							))}
						</nav>

						{/* Auth + Prenumeration (Desktop) */}
						<div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-3">
							{/* Theme toggle should appear before auth actions so the logout button is the far-right item */}
														<ClientOnly>
															<ModeToggle />
														</ClientOnly>
							{!isAuthenticated ? (
								<>
									<Link href="/logga-in" className="whitespace-nowrap text-base font-medium text-foreground hover:text-primary">Logga in</Link>
									<Button asChild variant="default">
										<Link href="/registrera">Registrera</Link>
									</Button>
								</>
							) : (
								<>
									<Link href="/mina-sidor" className="whitespace-nowrap text-base font-medium text-primary hover:underline">Mina sidor</Link>
									<Button variant="outline" onClick={handleLogout} className="ml-2">Logga ut</Button>
								</>
							)}
						</div>

						{/* Mobil: native disclosure (ingen JS krävs) - enkel fallback */}
						<div className="md:hidden">
							<details className="relative">
								<summary className="flex items-center gap-3 cursor-pointer list-none py-2 px-3 rounded-md hover:bg-muted/50">
									<svg className="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
										<path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
									</svg>
									<span className="sr-only">Öppna meny</span>
								</summary>

								<nav className="absolute left-4 right-4 mt-2 z-50 bg-card rounded-md p-4 shadow-lg space-y-3">
									<div className="flex flex-col space-y-2">
										{navigation.map((item) => (
											<Link key={item.name} href={item.href} className="block text-base font-medium text-foreground hover:text-primary">
												{item.name}
											</Link>
										))}
									</div>

									<div className="pt-2 border-t border-muted-foreground/20 flex flex-col gap-2">
										{/* Place theme toggle before auth actions so logout remains the last item */}
																				<div className="pt-2">
																						<ClientOnly>
																							<ModeToggle />
																						</ClientOnly>
																				</div>
										{!isAuthenticated ? (
											<>
												<Link href="/logga-in" className="block text-base font-medium text-foreground hover:text-primary">Logga in</Link>
												<Button asChild variant="default">
													<Link href="/registrera">Registrera</Link>
												</Button>
											</>
										) : (
											<>
												<Link href="/mina-sidor" className="block text-base font-medium text-foreground hover:text-primary">Mina sidor</Link>
												<button onClick={handleLogout} className="block text-base font-medium text-foreground hover:text-primary">Logga ut</button>
											</>
										)}
									</div>
								</nav>
							</details>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
