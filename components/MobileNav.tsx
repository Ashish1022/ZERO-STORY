"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton, useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"


const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1">
          <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 pl-4">
            <h1 className="text-24 font-extrabold text-white-1 ml-2">ZERO | STORY</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive = pathname === route || pathname.startsWith(`${route}/`);

                  return <SheetClose asChild key={route}><Link href={route} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {
                    'bg-nav-focus border-r-4 border-orange-1': isActive
                  })}>
                    <Image src={imgURL} alt={label} width={24} height={24} />
                    <p>{label}</p>
                  </Link></SheetClose>
                })}
                <SignedIn>
                  <div className='flex-center w-full mb-3 max-lg:px-4 lg:pr-8 flex-col gap-y-2'>
                    <Button className='text-16 w-full bg-orange-1 font-extrabold' onClick={() => signOut(() => router.push('/'))}>
                      Logout
                    </Button>
                    <Link href='/zero' className='text-12 font-extrabold underline underline-offset-4'>About&nbsp;&nbsp; ZERO | STORY</Link>
                  </div>
                  <SheetClose asChild className="border-b pb-3 mt-20">
                    <Link href={`/profile/${user?.id}`} className='flex gap-2'>
                      <UserButton />
                      <div className='flex w-full items-center justify-between'>
                        <h1 className='text-16 truncate font-semibold text-white-1'>{user?.firstName}</h1>
                      </div>
                      <Image src='/icons/right-arrow.svg' width={24} height={24} alt='arrow' />
                    </Link>
                  </SheetClose>
                </SignedIn>
                <SignedOut>
                  <div className='flex-center w-full mb-3 max-lg:px-4 lg:pr-8 flex-col gap-y-2'>
                    <Button asChild className='text-16 w-full bg-orange-1 font-extrabold'>
                      <Link href='/sign-in'>
                        Sign in
                      </Link>
                    </Button>
                    <Link href='/zero' className='text-12 font-extrabold underline underline-offset-4'>About&nbsp;&nbsp; ZERO | STORY</Link>
                  </div>
                </SignedOut>
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav