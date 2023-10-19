import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { RegularSearchAlt, RegularLayers } from "lineicons-react"
// import { Navbar, NavbarLink } from "./components/Navigation";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		template: '%s | PNW 3D Printing',
		default: 'Purdue Northwest 3D Printing',
	},
	description: 'Generated by create next app',
	// openGraph: {
	//   // url: "",
	//   title: "Purdue Northwest 3D Printing",
	// }
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className='h-full'>
			<head>
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Coda" />
				<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css" rel="stylesheet" />
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet" />
			</head>

			<body className={inter.className} style={{height: "100vh"}}>
				{children}
				{/* <Navbar>
					<NavbarLink label='Request a Print' path="/request" icon={<RegularSearchAlt></RegularSearchAlt>}></NavbarLink>
					<NavbarLink label='View a Print' path="/status" icon={<RegularLayers></RegularLayers>}></NavbarLink>
				</Navbar>

				<div className="content wrapper">
					<div className="h-full flex items-center justify-center">
						{children}
					</div>
				</div>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"></script> */}
			</body>
		</html>
	)
}
