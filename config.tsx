import { usePathname } from 'next/navigation';

import { Bell, Home, TriangleAlert, PhoneIcon, ChartNoAxesCombinedIcon } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Home',
      href: '/home',
      icon: <Home size={20} />,
      active: isNavItemActive(pathname, '/home'),
      position: 'top',
    },
    // {
    //   name: 'Analytics',
    //   href: '/analytics',
    //   icon: <ChartNoAxesCombinedIcon size={20} />,
    //   active: isNavItemActive(pathname, '/analytics'),
    //   position: 'top',
    // },
    {
      name: 'Incidents',
      href: '/incidents',
      icon: <TriangleAlert size={20} />,
      active: isNavItemActive(pathname, '/incidents'),
      position: 'top',
    },
    // {
    //   name: 'Client (demo)',
    //   href: '/mobile-client',
    //   icon: <PhoneIcon size={20} />,
    //   active: isNavItemActive(pathname, '/mobile-client'),
    //   position: 'top',
    // },

  ];
};