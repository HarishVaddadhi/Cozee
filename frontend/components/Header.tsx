import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import React from 'react';

// components
import Dropdown from "./Dropdown";
import { Button } from "@/components/ui/button"
import MobileNav from "./MobileNav";
import Nav from "./Nav";


const socials = [
    { icon: <FaYoutube />, url: "https://www.youtube.com" },
    { icon: <FaFacebook />, url: "https://www.facebook.com" },
    { icon: <FaInstagram />, url: "https://www.instagram.com" },
    { icon: <FaTwitter />, url: "https://www.twitter.com" },
];

const Header = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    const user = await getUser();
    console.log(user);

    return (
        <header className="py-6 shadow-md">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                    {/* logo & social icons */}
                    <div className="flex items-center gap-5 justify-center xl:w-max">
                        <Link href="/">
                            <Image src="/assets/logo.svg" alt="Logo" width={160} height={160} />
                        </Link>
                        {/* separator */}
                        <div className="w-[1px] h-[40px] bg-gray-300"></div>
                        {/* social icons */}
                        <div className="flex gap-2">
                            {socials.map((item, index) => (
                                <Link href={item.url} key={index} className="bg-accent text-white hover:bg-accent-hover text-sm w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all">
                                    {item.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* sign in & sign up buttons */}
                    <div className="flex items-center justify-center gap-8 xl:w-max">
                    <div className="flex items-center gap-2 xl:order-2">
                        {isUserAuthenticated ? (
                            <Dropdown user={user} />
                        ) : (
                            <div className="flex gap-2">
                                <LoginLink><Button variant="default">Sign In</Button></LoginLink>
                                <RegisterLink>
                                    <Button>Register</Button>
                                </RegisterLink>
                            </div>
                        )}
                    </div>
                    {/* mobile nav bar */}
                    <div className="xl:hidden">
                        <MobileNav />
                    </div>
                    <div className="hidden xl:flex">
                        <Nav isUserAuthenticated ={isUserAuthenticated} />
                    </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
