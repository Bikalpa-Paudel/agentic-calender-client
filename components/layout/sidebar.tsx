import Link from 'next/link'
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";

function Sidebar() {
    const topNav = [
        {
            name: "Calendar",
            link: "#",
            icon: FaRegCalendarAlt
        },
        {
            name: "Integrations",
            link: "#",
            icon: FaTools
        },
        {
            name: "Automations",
            link: "#",
            icon: FaRobot
        },
        {
            name: "AI Logs",
            link: "#",
            icon: SiGoogledocs
        },
    ]
    return (
        <div className='flex flex-col h-screen sticky top-0 justify-between px-4 py-6 bg-white sm:min-w-[200px]'>
            <div className='space-y-5'>
                <h1>Logo</h1>
                <div className='flex flex-col gap-6'>
                    {
                        topNav.map((item, index) => {
                            return (
                                <Link href={item.link} key={index} className='flex items-center gap-2'>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })
                    }

                </div>
            <div className='w-full h-px bg-gray-300'>

                <div>
                    <h1>Analytics</h1>
                </div>
            </div>


            </div>
            <div>footer</div>
        </div>
    )
}

export default Sidebar