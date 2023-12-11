import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties } from 'react';

export interface NavigationItem 
{
    route: string,
    name: string,
    icon: (className: string, active: boolean) => React.JSX.Element,
    active: boolean
}

/**
 * Navigation Sidebar for Dashboards.
 * @returns 
 */
export default function SidebarNavigation({items, className, style}: 
    {
        items: NavigationItem[],
        className?: string,
        style?: CSSProperties
    })
{
    const activeItem = items.find(i => i.active);

    return<div className="p-2 h-fit w-screen lg:p-4 lg:px-8 lg:w-fit lg:h-remaining-screen-with-nav" style={Object.assign({backgroundColor: "rgb(242, 242, 242)"}, style)}>
        <div className="flex justify-center items-center sm:flex-row lg:flex-col gap-8 py-2">
            {activeItem == null ? null : <p className='font-medium lg:hidden'>{activeItem.name}</p>}
            {items.map(item => <div key={item.name}><Link href={`/dashboard/maintainer/${item.route}`}>
                <span className="inline rounded-lg">{item.icon(`inline w-7 h-7 ${item.active ? 'fill-blue-600' : 'fill-gray-500'}`, item.active)}</span>
            </Link></div>)}
        </div>
    </div>
}